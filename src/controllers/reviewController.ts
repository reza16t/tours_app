import { NextFunction, Response } from "express";
import { catchAsync } from "../util/catchAsync";
import { Review } from "../Models/reviewModel";
import { IReview, IRole } from "../types";
import { Tour } from "../Models/tourModel";
import { delOne, getAll, getOne, updateOne } from "./handelFactory";
import { ErrorHandler } from "../util/ErrorHandler";

export const getReviews = getAll(Review);
export const createReview = catchAsync(
   async (req: IRole, res: Response, next: NextFunction) => {
      let tourId: string = req.params.tourId || req.body.tour;
      if (req.body.tourName) {
         const tour = await Tour.findOne({ name: req.body.tour });
         if (!tourId) {
            return next(new ErrorHandler("no tour found with this name", 404));
         }
         tourId = tour._id;
      }

      const review: IReview = await Review.create({
         review: req.body.review,
         rating: req.body.rating,
         tour: tourId,
         user: req.user._id,
         tourId: tourId,
      });
      res.status(201).json({
         status: "success",
         data: {
            review,
         },
      });
   },
);
export const getReview = getOne(Review);
export const updateReview = updateOne(Review);
export const delReview = delOne(Review);
