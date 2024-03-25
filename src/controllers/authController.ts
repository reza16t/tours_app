import { NextFunction, Request, Response } from "express";
import { User } from "../Models/userModel";
import { IDecoded, IRole, IUser, Role } from "../types";
import { catchAsync } from "../util/catchAsync";
import { sign, verify } from "jsonwebtoken";
import { ErrorHandler } from "../util/ErrorHandler";
import sendEmail from "../util/email";
import { createHash } from "crypto";
export const createToken = (res: Response, statusCode: number, user) => {
   const token = sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
   });
   res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "development" ? false : true,
      expires: new Date(
         Date.now() + +process.env.COOKIES_EXPIRES * 24 * 60 * 60 * 1000,
      ),
   });
   res.status(statusCode).json({
      status: "success",
      token,
      data: {
         user,
      },
   });
};

export const signup = catchAsync(async (req: Request, res: Response) => {
   const user: IUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
   });
   createToken(res, 200, user);
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
      createToken(res, 201, user);
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

export const restrictTo = (...role: Role[]) => {
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
export const forgotPassword = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      const currentUser = await User.findOne({ email: req.body.email });
      if (!currentUser) {
         return next(
            new ErrorHandler("There is no user with that email address.", 400),
         );
      }

      const resetToken = currentUser.createPasswordRestToken();
      await currentUser.save();

      const resetURL = `${req.protocol}://${req.get("host")}/api/v1/users/resetPassword/${resetToken}`;
      try {
         const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

         await sendEmail({
            email: currentUser.email,
            subject: "Your password reset token (valid for 10min)",
            message,
         });
         res.status(200).json({
            status: "success",
            message: "Token sent to email!",
         });
      } catch (error) {
         currentUser.passwordRestToken = undefined;
         currentUser.passwordRestExpires = undefined;
         await currentUser.save();

         return next(
            new ErrorHandler(
               "There was an error sending the email. Try again later!",
               404,
            ),
         );
      }
   },
);
export const resetPassword = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      const tokenHash = createHash("sha256")
         .update(req.params.token as string)
         .digest("hex");
      const currentUser = await User.findOne({
         passwordRestToken: tokenHash,
         passwordRestExpires: { $gt: Date.now() },
      });

      if (!currentUser) {
         return next(
            new ErrorHandler(
               "The user belonging to this token does no longer exist",
               400,
            ),
         );
      }
      currentUser.password = req.body.password;
      currentUser.passwordConfirm = req.body.passwordConfirm;
      currentUser.passwordRestToken = undefined;
      currentUser.passwordRestExpires = undefined;
      await currentUser.save();

      createToken(res, 201, currentUser);
   },
);

export const updatePassword = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      const currentUser = await User.findById(req.user.id).select("+password");
      if (
         !currentUser ||
         !(await currentUser.correctPassword(
            req.body.password,
            currentUser.password,
         ))
      ) {
         return next(new ErrorHandler("incorrect email/password", 401));
      }
      currentUser.password = req.body.newPassword;
      currentUser.passwordConfirm = req.body.newPasswordConfirm;
      await currentUser.save();
      createToken(res, 201, currentUser);
   },
);
