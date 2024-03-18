import { Response, Request, NextFunction } from "express";

import { ToursTypeFull } from "../types";
import { Tour } from "../Models/tourModel";
import { ApiFeatures } from "../util/ApiFeature";
import { ErrorHandler } from "../util/ErrorHandler";

const catchAsync = (fn) => {
   return (req, res, next) => {
      fn(req, res, next).catch(next);
   };
};
export const aliasTopTours = (req, res, next) => {
   req.query.limit = "5";
   req.query.sort = "-ratingsAverage,price";
   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
   next();
};
export const getAllTours = catchAsync(async (req: Request, res: Response) => {
   const feature = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .fields()
      .pagination();

   const tours = await feature.query;
   res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
         tours,
      },
   });
});

export const getTour = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const tour = await Tour.findById(req.params.id);

      if (!tour) {
         console.log(tour);
         return next(new ErrorHandler("no tour found with this ID", 404));
      }
      res.status(200).json({
         status: "success",
         data: {
            tour,
         },
      });
   },
);

export const createTour = catchAsync(async (req: Request, res: Response) => {
   const newTour: ToursTypeFull = await Tour.create(req.body);
   res.status(201).json({
      status: "success",
      data: {
         tour: newTour,
      },
   });
});

export const updateTour = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
      });
      if (!newTour) {
         return next(new ErrorHandler("no tour found with this ID", 404));
      }
      res.status(201).json({
         status: "success",
         data: {
            tour: newTour,
         },
      });
   },
);

export const deleteTour = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const tour = await Tour.findByIdAndDelete(req.params.id);
      if (!tour) {
         return next(new ErrorHandler("no tour found with this ID", 404));
      }
      res.status(201).json({
         status: "success",
         data: {
            tour: null,
         },
      });
   },
);
export const getTourStats = catchAsync(async (req: Request, res: Response) => {
   const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
         $group: {
            _id: "$difficulty",
            numTours: { $sum: 1 },
            maxPrice: { $max: "$price" },
            minPrice: { $min: "$price" },
            avgPrice: { $avg: "$price" },
            numRatings: { $sum: "$ratingsQuantity" },
            avgRating: { $avg: "$ratingsAverage" },
         },
      },
   ]);
   res.status(200).json({
      status: "success",
      data: {
         tour: stats,
      },
   });
});
export const getMonthlyPlan = catchAsync(
   async (req: Request, res: Response) => {
      const year = +req.params.year;
      const stats = await Tour.aggregate([
         {
            $unwind: "$startDates",
         },
         {
            $match: {
               startDates: {
                  $gte: new Date(`${year}-01-01`),
                  $lte: new Date(`${year}-12-31`),
               },
            },
         },
         { $project: { _id: 0 } },

         {
            $group: {
               _id: { $month: "$startDates" },
               numTours: { $sum: 1 },
               Tours: { $push: "$name" },
            },
         },
         {
            $set: { month: "$_id" },
         },
         {
            $sort: { numTours: -1 },
         },
      ]);

      res.status(200).json({
         status: "success",
         data: {
            tour: stats,
         },
      });
   },
);
