import express from "express";
import { ErrorHandler } from "./util/ErrorHandler";
import { globalErrorHandler } from "./controllers/errorController";
const morgan = require("morgan");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoutes");
const app = express();
dotenv.config({ path: "./config.env" });

const DB = process.env.DB.replace("<PASSWORD>", process.env.DB_PASSWORD);
mongoose.connect(DB, {}).then(() => {
   console.log("mongodb is connected");
});
// 1) MIDDLEWARES
if (process.env.NODE_ENV === "development") {
   app.use(morgan("dev"));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

// 3) ROUTES
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

//4) error handling
app.all("*", (req, res, next) => {
   next(new ErrorHandler(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

// 4) START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
   console.log(`App running on port ${port}...`);
});
// process.on("unhandledRejection", (err: Error) => {
//    console.log("UNHANDLED REJECTION! 💥 Shutting down...");
//    console.log(err.name, err.message);
//    server.close(() => {
//       process.exit(1);
//    });
// });
