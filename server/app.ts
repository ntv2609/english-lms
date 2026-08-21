require("dotenv").config();
import express, { NextFunction, Request, Response } from "express";
export const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notification.route";
import analyticsRouter from "./routes/analytics.route";
import layoutRouter from "./routes/layout.route";
import { rateLimit } from 'express-rate-limit';

//body parser
app.use(express.json({ limit: "50mb" }));

//cookie parser
app.use(cookieParser());

//cors => cross origin resource sharing
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://english-lms-one.vercel.app', 'https://english-lms-ntv2609s-projects.vercel.app'],
    credentials: true,
  }),
);

// api requests limit to protect against DDoS
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
});

//routes
app.use("/api/v1/", userRouter);
app.use("/api/v1/", courseRouter); 
app.use("/api/v1/", orderRouter); 
app.use("/api/v1/", notificationRouter); 
app.use("/api/v1/", analyticsRouter); 
app.use("/api/v1/", layoutRouter); 

//testing api
app.get("/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({
    success: true,
    message: "API đang hoạt động",
  });
});

//unknown route
app.all(/.*/, (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`) as any;
  err.statusCode = 404;
  next(err);
});

app.use(limiter);
app.use(ErrorMiddleware);