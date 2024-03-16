import { Response, Request } from "express";

import { ToursTypeFull } from "../types";
import { Tour } from "../Models/tourModel";
import { ApiFeatures } from "../util/ApiFeature";
// import { readFileSync } from "fs";

// export const insertAllTours = async (req: Request, res: Response) => {
//    await Tour.deleteMany();
//    const tours = JSON.parse(
//       readFileSync(`${__dirname}/../dev-data/data/tours.json`, "utf8"),
//    );

//    const tour = await Tour.create(tours);
//    // console.log(tours);
//    res.status(200).json({
//       status: "success",
//       data: {
//          tour: tour,
//       },
//    });
// };

export const aliasTopTours = (req, res, next) => {
   req.query.limit = "5";
   req.query.sort = "-ratingsAverage,price";
   req.query.fields = "name,price,ratingsAverage,summary,difficulty";
   next();
};

export const getAllTours = async (req: Request, res: Response) => {
   try {
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
   } catch (error) {
      res.status(400).json({
         status: "failed",
         message: error.message,
      });
   }
};

export const getTour = async (req: Request, res: Response) => {
   try {
      const tour = await Tour.findById(req.params.id);
      res.status(200).json({
         status: "success",
         data: {
            tour,
         },
      });
   } catch (error) {
      res.status(400).json({
         status: "failed",
         message: error,
      });
   }
};

export const createTour = async (req: Request, res: Response) => {
   try {
      const newTour: ToursTypeFull = await Tour.create(req.body);
      res.status(201).json({
         status: "success",
         data: {
            tour: newTour,
         },
      });
   } catch (error) {
      res.status(400).json({
         status: "failed",
         massage: error,
      });
   }
};

export const updateTour = async (req: Request, res: Response) => {
   try {
      const newTour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
         new: true,
      });
      res.status(201).json({
         status: "success",
         data: {
            tour: newTour,
         },
      });
   } catch (error) {
      res.status(400).json({
         status: "fail",
         massage: error,
      });
   }
};

export const deleteTour = async (req: Request, res: Response) => {
   try {
      await Tour.findByIdAndDelete(req.params.id);
      res.status(201).json({
         status: "success",
         data: {
            tour: null,
         },
      });
   } catch (error) {
      res.status(400).json({
         status: "fail",
         massage: error,
      });
   }
};
export const getTourStats = async (req: Request, res: Response) => {
   try {
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
   } catch (error) {
      res.status(400).json({
         status: "failed",
         massage: error,
      });
   }
};
export const getMonthlyPlan = async (req: Request, res: Response) => {
   try {
      const year = +req.params.year;
      const stats = await Tour.aggregate([
         {
            $unwind: "$statsDates",
         },
      ]);
      res.status(200).json({
         status: "success",
         data: {
            tour: stats,
         },
      });
   } catch (error) {
      res.status(400).json({
         status: "failed",
         massage: error,
      });
   }
};
