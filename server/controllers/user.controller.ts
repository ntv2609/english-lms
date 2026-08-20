require("dotenv").config();
import { Request, Response, NextFunction } from "express";
import userModel, { IUser } from "../models/user.model";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt";
import { redis } from "../utils/redis";
import { getUserById } from "../services/user.service";
import cloudinary from "cloudinary";
import { getAllUsersService, updateUserRoleService } from "../services/user.service";

//register user
interface IRegistrationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const isEmailExist = await userModel.findOne({ email });
      if (isEmailExist) {
        return next(new ErrorHandler("Email đã tồn tại", 400));
      }

      const user: IRegistrationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data,
      );

      try {
        await sendMail({
          email: user.email,
          subject: "Kích hoạt tài khoản của bạn",
          template: "activation-mail.ejs",
          data,
        });

        res.status(201).json({
          success: true,
          message: `Vui lòng kiểm tra email: ${user.email} để kích hoạt tài khoản của bạn!`,
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    {
      expiresIn: "5m",
    },
  );

  return { token, activationCode };
};

//activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;

      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string,
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("Invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exist", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
        isVerified: true, 
      });

      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

//login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;

      if (!email || !password) {
        return next(new ErrorHandler("Please enter email and password", 400));
      }

      const user = await userModel.findOne({ email }).select("+password");

      if (!user) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      const isPasswordMatch = await user.comparePassword(password);
      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid email or password", 400));
      }

      sendToken(user, 200, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// logout user
export const logoutUser = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      res.cookie("access_token", "", { maxAge: 1 });
      res.cookie("refresh_token", "", { maxAge: 1 });
      const userId = req.user?._id || "";

      redis.del(userId.toString());

      res.status(200).json({
        success: true,
        message: "Đăng xuất thành công",
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// update access token
export const updateAccessToken = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refresh_token = req.cookies.refresh_token as string;
      const decoded = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN as string,
      ) as JwtPayload;

      const message = "Could not refresh token";
      if (!decoded) {
        return next(new ErrorHandler(message, 400));
      }
      const session = await redis.get(decoded.id.toString());

      if (!session) {
        return next(new ErrorHandler(message, 400));
      }

      const user = JSON.parse(session);

      const accessToken = jwt.sign(
        { id: user._id },
        process.env.ACCESS_TOKEN as string,
        {
          expiresIn: "5m", 
        },
      );

      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_TOKEN as string,
        {
          expiresIn: "3d",
        },
      );

      req.user = user;

      res.cookie("access_token", accessToken, accessTokenOptions);
      res.cookie("refresh_token", refreshToken, refreshTokenOptions);

      await redis.set(user._id.toString(), JSON.stringify(user), "EX", 604800); 

      if (req.originalUrl.includes("/refresh")) {
        res.status(200).json({
          success: true,
          accessToken,
        });
      } else {
        // FIX BUG EXPIRED Ở ĐÂY LÀ HẾT NHỨC ĐẦU:
        // Ép cập nhật lại req.cookies để thằng middleware isAuthenticated chạy ngay phía sau có token mới để kiểm tra
        req.cookies.access_token = accessToken;
        next();
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// get user info
export const getUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?._id;
      getUserById(userId?.toString() as string, res);
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: string;
}

// social auth
export const socialAuth = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body;
      const user = await userModel.findOne({ email });
      if (!user) {
        const newUser = await userModel.create({ email, name, avatar, isVerified: true});
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// update user info (Đã refactor theo tutorial - loại bỏ email)
interface IUpdateUserInfo {
  name?: string;
}

export const updateUserInfo = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body as IUpdateUserInfo;
      const userId = req.user?._id;
      
      if (!userId) {
          return next(new ErrorHandler("User ID not found", 400));
      }

      const user = await userModel.findById(userId.toString());

      if (!user) {
          return next(new ErrorHandler("User not found", 404));
      }

      if (name) {
        user.name = name;
      }

      await user.save();

      await redis.set(userId.toString(), JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

// update user password
interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export const updatePassword = CatchAsyncErrors(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body as IUpdatePassword;

      if (!oldPassword || !newPassword) {
        return next(new ErrorHandler("Vui lòng nhập mật khẩu cũ và mới", 400));
      }

      const user = await userModel.findById(req.user?._id).select("+password");

      if (user?.password === undefined) {
        return next(new ErrorHandler("Invalid user", 400));
      }

      const isPasswordMatch = await user?.comparePassword(oldPassword);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("Invalid old password", 400));
      }

      user.password = newPassword;

      await user.save();

      await redis.set(req.user?._id.toString() as string, JSON.stringify(user));

      res.status(201).json({
        success: true,
        user,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  },
);

interface IUpdateAvatar {
  avatar: string;
}

// update profile picture
export const updateProfilePicture = CatchAsyncErrors(async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const { avatar } = req.body;
        const userId = req.user?._id;
        const user = await userModel.findById(userId);

        if(avatar && user){
            // if user have one avatar then call this if
            if(user?.avatar?.public_id){
                // first delete the old image
                await cloudinary.v2.uploader.destroy(user?.avatar?.public_id);

                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } else {
                const myCloud = await cloudinary.v2.uploader.upload(avatar, {
                    folder: "avatars",
                    width: 150,
                });
                user.avatar = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            }
        }

        await user?.save();

        if(userId) {
             await redis.set(userId.toString(), JSON.stringify(user));
        }

        res.status(200).json({
            success: true,
            user,
        });

    } catch (error: any) {
        return next(new ErrorHandler(error.message, 400));
    }
})

// get all users (Admin only)
export const getAllUsers = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        getAllUsersService(res);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// update user role (Admin only)
export const updateUserRole = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id, role } = req.body;
        updateUserRoleService(res, id.toString(), role);
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// delete user (Admin only)
export const deleteUser = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;

        const user = await userModel.findById(id);

        if (!user) {
            return next(new ErrorHandler("Không tìm thấy người dùng", 404));
        }

        await user.deleteOne({ _id: id });

        await redis.del(id.toString());

        res.status(200).json({
            success: true,
            message: "Xóa người dùng thành công",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});