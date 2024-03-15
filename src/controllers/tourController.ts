import { Response, Request } from "express";

import { ToursTypeFull } from "../types";
import { Tour } from "../Models/tourModel";
import { readFileSync } from "fs";

export const insertAllTours = async (req: Request, res: Response) => {
   await Tour.deleteMany();
   const tours = JSON.parse(
      readFileSync(`${__dirname}/../dev-data/data/tours.json`, "utf8"),
   );

   const tour = await Tour.create(tours);
   // console.log(tours);
   res.status(200).json({
      status: "success",
      data: {
         tour: tour,
      },
   });
};

export const getAllTours = async (req: Request, res: Response) => {
   const tours = await Tour.find();
   res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
         tours,
      },
   });
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
