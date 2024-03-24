import { NextFunction, Request, Response } from "express";
import { ApiFeatures } from "../util/ApiFeature";
import { catchAsync } from "../util/catchAsync";
import { Review } from "../Models/reviewModel";
import { IReview, IRole } from "../types";
import { Tour } from "../Models/tourModel";
import { ErrorHandler } from "../util/ErrorHandler";

export const getReviews = catchAsync(async (req: Request, res: Response) => {
   const feature = new ApiFeatures(Review.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

   const review = await feature.query;
   res.status(200).json({
      status: "success",
      results: review.length,
      data: {
         review,
      },
   });
});
export const getReview = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const review = await Review.findById(req.params.id);
      if (!review) {
         return next(new ErrorHandler("no review found with this ID", 404));
      }
      res.status(200).json({
         status: "success",
         data: {
            review,
         },
      });
   },
);
export const createReview = catchAsync(async (req: IRole, res: Response) => {
   let tourId = req.body.tour;
   if (req.body.tourName) {
      tourId = (await Tour.findOne({ name: req.body.tour }))._id;
   }

   const review: IReview = await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: tourId,
      user: req.user._id,
   });
   res.status(201).json({
      status: "success",
      data: {
         review,
      },
   });
});
