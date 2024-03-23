import express, { Request, Response, NextFunction } from "express";
import { ErrorHandler } from "./util/ErrorHandler";
import { globalErrorHandler } from "./controllers/errorController";
import helmet from "helmet";
import ReviewRouter from "./routes/reviewRouter";
import toursRouter from "./routes/tourRoutes";
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");

const app = express();
dotenv.config({ path: "./config.env" });
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
app.use(helmet());
const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(DB).then(() => {
   console.log("mongodb is connected");
});
// Development logging
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
   max: 100,
   windowMs: 60 * 60 * 1000,
   message: "Too many requests from this IP, please try again in an hour!",
});
app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
app.use(
   hpp({
      whitelist: [
         "duration",
         "ratingsQuantity",
         "ratingsAverage",
         "maxGroupSize",
         "difficulty",
         "price",
      ],
   }),
);

// Serving static files
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/tours", toursRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", ReviewRouter);

app.all("*", (req: Request, res: Response, next: NextFunction) => {
   next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
