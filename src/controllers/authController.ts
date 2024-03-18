import { Request, Response } from "express";
import { User } from "../Models/userModel";
import { IUser } from "../types";
import { catchAsync } from "../util/catchAsync";

export const singup = catchAsync(async (req: Request, res: Response) => {
   const user: IUser = await User.create(req.body);
   res.status(201).json({
      status: "success",
      data: {
         user,
      },
   });
});
