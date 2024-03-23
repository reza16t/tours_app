import { Request, Response } from "express";
import { ApiFeatures } from "../util/ApiFeature";
import { catchAsync } from "../util/catchAsync";
import { Review } from "../Models/reviewModel";
import { IReview, IRole } from "../types";
import { Tour } from "../Models/tourModel";

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
export const createReview = catchAsync(async (req: IRole, res: Response) => {
   const tour = await Tour.findOne({ name: req.body.tour });
   const review: IReview = await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: tour._id,
      user: req.user._id,
   });
   res.status(201).json({
      status: "success",
      data: {
         review,
      },
   });
});
