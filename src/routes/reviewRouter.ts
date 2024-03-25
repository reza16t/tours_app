import { Router } from "express";
import {
   createReview,
   delReview,
   getReview,
   getReviews,
   updateReview,
} from "../controllers/reviewController";
import { protect } from "../controllers/authController";

const ReviewRouter = Router({ mergeParams: true });

ReviewRouter.route("/").get(getReviews).post(protect, createReview);
ReviewRouter.route("/:id")
   .patch(updateReview)
   .delete(protect, delReview)
   .get(getReview);

export default ReviewRouter;
