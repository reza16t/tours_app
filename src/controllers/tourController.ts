import { Response, Request, NextFunction } from "express";
import { Tour } from "../Models/tourModel";
import { catchAsync } from "../util/catchAsync";
import { createOne, delOne, getAll, getOne, updateOne } from "./handelFactory";
import { ErrorHandler } from "../util/ErrorHandler";

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
export const getTourWithIn = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const { latlng, distance, unit } = req.params;
      const radius = unit === "mi" ? +distance / 3963.2 : +distance / 6378.1;
      const [lat, lng] = latlng.split(",");
      if (!lat || !lng) {
         next(
            new ErrorHandler(
               "Please provide latitutr and longitude in the format lat, lng",
               400,
            ),
         );
      }
      const tours = await Tour.find({
         startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
      });
      res.status(200).json({
         status: "success",
         data: {
            data: tours,
         },
      });
   },
);
export const getDistance = catchAsync(
   async (req: Request, res: Response, next: NextFunction) => {
      const { latlng, unit } = req.params;
      const [lat, lng] = latlng.split(",");
      const multiplier = unit === "mi" ? 0.000621371 : 0.001;
      if (!lat || !lng) {
         next(
            new ErrorHandler(
               "Please provide latitutr and longitude in the format lat, lng",
               400,
            ),
         );
      }
      const distance = await Tour.aggregate([
         {
            $geoNear: {
               near: {
                  type: "Point",
                  coordinates: [+lng, +lat],
               },
               distanceField: "distance",
               distanceMultiplier: multiplier,
            },
         },
         {
            $project: {
               distance: 1,
               name: 1,
            },
         },
      ]);
      res.status(200).json({
         status: "success",
         data: {
            data: distance,
         },
      });
   },
);
