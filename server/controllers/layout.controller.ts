import { NextFunction, Request, Response } from "express";
import { CatchAsyncErrors } from "../middleware/catchAsyncErrors";
import ErrorHandler from "../utils/ErrorHandler";
import LayoutModel from "../models/layout.model";
import cloudinary from "cloudinary";

// create layout
export const createLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;
        const isTypeExist = await LayoutModel.findOne({ type });
        if (isTypeExist) {
            return next(new ErrorHandler(`Kiểu layout ${type} đã tồn tại`, 400));
        }

        if (type === "Banner") {
            const { image, title, subTitle } = req.body;
            const myCloud = await cloudinary.v2.uploader.upload(image, {
                folder: "layout",
            });
            const banner = {
                type: "Banner",
                banner: {
                    image: {
                        public_id: myCloud.public_id,
                        url: myCloud.secure_url,
                    },
                    title,
                    subTitle,
                },
            };
            await LayoutModel.create(banner);
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            await LayoutModel.create({ type: "FAQ", faq: faqItems });
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            await LayoutModel.create({ type: "Categories", categories: categoriesItems });
        }

        res.status(200).json({
            success: true,
            message: "Tạo layout thành công",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// edit layout
export const editLayout = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.body;

        if (type === "Banner") {
            const bannerData: any = await LayoutModel.findOne({ type: "Banner" });
            const { image, title, subTitle } = req.body;

            const bannerObj: any = {
                type: "Banner",
                banner: { title, subTitle }
            };

            // FIX BUG: Xử lý upload ảnh an toàn kể cả khi tạo mới
            if (image && !image.startsWith("https")) {
                if(bannerData?.banner?.image?.public_id){
                    await cloudinary.v2.uploader.destroy(bannerData.banner.image.public_id);
                }
                const myCloud = await cloudinary.v2.uploader.upload(image, {
                    folder: "layout",
                });
                bannerObj.banner.image = {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                };
            } else if (image && image.startsWith("https")) {
                bannerObj.banner.image = bannerData?.banner?.image;
            }

            // Nếu DB rỗng thì Create, nếu có thì Update
            if (!bannerData) {
                await LayoutModel.create(bannerObj);
            } else {
                await LayoutModel.findByIdAndUpdate(bannerData._id, bannerObj);
            }
        }

        if (type === "FAQ") {
            const { faq } = req.body;
            const faqItems = await Promise.all(
                faq.map(async (item: any) => {
                    return {
                        question: item.question,
                        answer: item.answer,
                    };
                })
            );
            // FIX BUG BẰNG UPSERT: Đéo cần biết có hay chưa, cứ phang vào DB!
            await LayoutModel.findOneAndUpdate(
                { type: "FAQ" },
                { type: "FAQ", faq: faqItems },
                { upsert: true, new: true }
            );
        }

        if (type === "Categories") {
            const { categories } = req.body;
            const categoriesItems = await Promise.all(
                categories.map(async (item: any) => {
                    return {
                        title: item.title,
                    };
                })
            );
            // FIX BUG BẰNG UPSERT: Cứu tinh chống báo "Thành công ảo"
            await LayoutModel.findOneAndUpdate(
                { type: "Categories" },
                { type: "Categories", categories: categoriesItems },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật layout thành công",
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});

// get layout by type
export const getLayoutByType = CatchAsyncErrors(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { type } = req.params;
        const layout = await LayoutModel.findOne({ type });

        res.status(201).json({
            success: true,
            layout,
        });
    } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
    }
});