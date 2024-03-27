import { Response, Request, NextFunction } from "express";
import { Tour } from "../Models/tourModel";
import { catchAsync } from "../util/catchAsync";
import { createOne, delOne, getAll, getOne, updateOne } from "./handelFactory";

export const aliasTopTours = (
   req: Request,
   res: Response,
   next: NextFunction,
) => {
   req.query.limit = "5";
   req.query.sort = "-ratingsAverage,price";
   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
   next();
};
export const getAllTours = getAll(Tour);
export const createTour = createOne(Tour);
export const getTour = getOne(Tour, "reviews");
export const updateTour = updateOne(Tour);
export const deleteTour = delOne(Tour);
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
export function getTourWithIn(req: Request, res: Response, next: NextFunction) {
   const { lanlag, distance, unit } = req.params;
}
