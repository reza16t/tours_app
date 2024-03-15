import {
   createTour,
   deleteTour,
   getAllTours,
   getTour,
   insertAllTours,
   updateTour,
} from "../controllers/tourController";
import express from "express";
// const tourController = require('./../controllers/ts');

const router = express.Router();

router.route("/").get(getAllTours).post(createTour);
router.route("/insert/:password").post(insertAllTours);
router.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = router;
