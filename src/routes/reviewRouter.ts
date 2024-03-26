import { Router } from "express";
import {
   createReview,
   delReview,
   getReview,
   getReviews,
   updateReview,
} from "../controllers/reviewController";
import { protect, restrictTo } from "../controllers/authController";
import { Role } from "../types";

const ReviewRouter = Router({ mergeParams: true });
ReviewRouter.use(protect);
ReviewRouter.route("/")
   .get(getReviews)
   .post(restrictTo(Role.User), createReview);
ReviewRouter.route("/:id")
   .patch(restrictTo(Role.User), updateReview)
   .delete(restrictTo(Role.User), delReview)
   .get(getReview);

export default ReviewRouter;
