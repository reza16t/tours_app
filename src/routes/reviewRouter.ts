import { Router } from "express";
import { createReview, getReviews } from "../controllers/reviewController";
import { protect } from "../controllers/authController";

const ReviewRouter = Router();

ReviewRouter.route("/").get(getReviews).post(protect, createReview);

export default ReviewRouter;
