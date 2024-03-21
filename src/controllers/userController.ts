import { Response, Request, NextFunction } from "express";
import { User } from "../Models/userModel";
import { ApiFeatures } from "../util/ApiFeature";
import { catchAsync } from "../util/catchAsync";
import { ErrorHandler } from "../util/ErrorHandler";
import { IRole } from "../types";

const filterObj = (obj, ...allowedFields: string[]): object => {
   const newObj = {};
   Object.keys(obj).forEach(
      (el) => allowedFields.includes(el) && (newObj[el] = obj[el]),
   );
   return newObj;
};

export const updateMyUser = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      if (req.body.password || req.body.passwordConfirm) {
         return next(
            new ErrorHandler(
               "This route is not for password updates. Please use /updateMyPassword.",
               400,
            ),
         );
      }
      const filterReq = filterObj(req.body, "name", "email");

      const currentUser = await User.findByIdAndUpdate(
         req.user._id,
         filterReq,
         { new: true, runValidators: true },
      );

      res.status(200).json({
         status: "success",
         data: {
            user: currentUser,
         },
      });
   },
);

export const getUsers = catchAsync(async (req: Request, res: Response) => {
   const feature = new ApiFeatures(User.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

   const users = await feature.query;
   res.status(200).json({
      status: "success",
      results: users.length,
      data: {
         users,
      },
   });
});
export const createUser = (req: Request, res: Response) => {
   res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
   });
};
export const updateUser = (req: Request, res: Response) => {
   res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
   });
};
export const deleteUser = (req: Request, res: Response) => {
   res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
   });
};
