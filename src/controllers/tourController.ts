const fs = require("fs");
import { Response, Request, NextFunction } from "express";
import { ToursType } from "../types";

const tours: ToursType[] = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
);

export const checkID = (req: Request, res: Response, next: NextFunction) => {
  // console.log(`Tour id is: ${val}`);
  const id: number = +req.params.id;
  if (id * 1 > tours.length) {
    return res.status(404).json({
      status: "fail",
      message: "Invalid ID"
    });
  }
  next();
};

// export const checkBody = (req: Request, res: Response, next: NextFunction) => {
//   if (!req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

export const getAllTours = (req: Request, res: Response) => {
  console.log();

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      tours
    }
  });
};

export const getTour = (req: Request, res: Response) => {
  console.log(req.params);
  const id: Number = +req.params.id * 1;

  const tour = tours.find((el) => el.id === id);

  res.status(200).json({
    status: "success",
    data: {
      tour
    }
  });
};

export const createTour = (req: Request, res: Response) => {
  // console.log(req.body);

  const newId = tours[tours.length - 1].id + 1;
  const newTour: ToursType = Object.assign({ id: newId }, req.body);
  // if(typeof newTour != ToursType)
  tours.push(newTour);

  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err: String) => {
      res.status(201).json({
        status: "success",
        data: {
          tour: newTour
        }
      });
    }
  );
};

export const updateTour = (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    data: {
      tour: "<Updated tour here...>"
    }
  });
};

export const deleteTour = (req: Request, res: Response) => {
  res.status(204).json({
    status: "success",
    data: null
  });
};
