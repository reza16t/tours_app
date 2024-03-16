import {
   aliasTopTours,
   createTour,
   deleteTour,
   getAllTours,
   getMonthlyPlan,
   getTour,
   getTourStats,
   // insertAllTours,
   updateTour,
} from "../controllers/tourController";
import express from "express";
// const tourController = require('./../controllers/ts');

const router = express.Router();

router.route("/").get(getAllTours).post(createTour);
router.route("/tours-stats").get(getTourStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);
router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
