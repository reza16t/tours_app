import { Router } from "express";
import {
   createReview,
   getReview,
   getReviews,
} from "../controllers/reviewController";
import { protect } from "../controllers/authController";

const ReviewRouter = Router();

ReviewRouter.route("/").get(getReviews).post(protect, createReview);
ReviewRouter.route("/:id").get(getReview);

export default ReviewRouter;
