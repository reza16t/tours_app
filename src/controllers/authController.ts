import { NextFunction, Request, Response } from "express";
import { User } from "../Models/userModel";
import { IDecoded, IRole, IUser } from "../types";
import { catchAsync } from "../util/catchAsync";
import { sign, verify } from "jsonwebtoken";
import { ErrorHandler } from "../util/ErrorHandler";

export const signup = catchAsync(async (req: Request, res: Response) => {
   const user: IUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
   });
   const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
   });
   res.status(201).json({
      status: "success",
      token,
      data: {
         user,
      },
   });
});

export const signin = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const { email, password } = req.body;

      if (!password || !email) {
         return next(new ErrorHandler("please inter your email/password", 400));
      }
      const user = await User.findOne({ email }).select("+password");
      //create Express Password Checker
      if (!user || !(await user.correctPassword(password, user.password))) {
         return next(new ErrorHandler("incorrect email/password", 401));
      }
      const token = sign({ id: user._id }, process.env.JWT_SECRET, {
         expiresIn: process.env.JWT_EXPIRES_IN,
      });
      res.status(200).json({
         status: "success",
         token,
      });
   },
);

export const protect = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      let token: string;
      if (
         req.headers.authorization &&
         req.headers.authorization.startsWith("Bearer")
      ) {
         token = req.headers.authorization.split(" ")[1];
      }
      if (!token) {
         return next(
            new ErrorHandler(
               "Your not logged in! please log in to get access ",
               400,
            ),
         );
      }
      const decoded = await verify(token, process.env.JWT_SECRET);
      const currentUser = await User.findById((decoded as IDecoded).id);

      if (!currentUser) {
         return next(
            new ErrorHandler(
               "The user belonging to this token does no longer exist",
               400,
            ),
         );
      }
      if (currentUser.changedPasswordAfter((decoded as IDecoded).iat)) {
         next(
            new ErrorHandler(
               "User recently changed password! Please log in again.",
               404,
            ),
         );
      }

      req.user = currentUser;
      next();
   },
);

export const restrictTo = (...role) => {
   return (req: IRole, res: Response, next: NextFunction) => {
      if (!role.includes(req.user.role)) {
         return next(
            new ErrorHandler(
               "you don't have permission to preform this action",
               403,
            ),
         );
      }
      next();
   };
};
