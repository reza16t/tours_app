import { Response, Request } from "express";
import { User } from "../Models/userModel";
import { ApiFeatures } from "../util/ApiFeature";
import { catchAsync } from "../util/catchAsync";
export const getAllUsers = (req: Request, res: Response) => {
   res.status(500).json({
      status: "error",
      message: "This route is not yet defined!",
   });
};
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
