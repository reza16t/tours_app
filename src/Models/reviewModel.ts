import { Schema, model } from "mongoose";
import { IReview } from "../types";

const reviewSchema = new Schema<IReview>(
   {
      review: {
         type: String,
         required: [true, "A review can't be empty "],
         maxlength: [
            214,
            "A tour name must have less or equal then 214 characters",
         ],
         minlength: [
            8,
            "A tour name must have more or equal then 10 characters",
         ],
      },
      rating: {
         type: Number,
         min: [1, "Rating must be above 1.0"],
         max: [5, "Rating must be below 5.0"],
      },
      createdAt: {
         type: Date,
         default: Date.now(),
      },
      user: [
         {
            type: Schema.ObjectId,
            ref: "User",
         },
      ],
      tour: [
         {
            type: Schema.ObjectId,
            ref: "Tour",
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);
reviewSchema.pre(/^find/, function (this: IReview, next) {
   this.populate({
      path: "tour",
      select: "name",
   });
   this.populate({
      path: "user",
      select: "name email",
   });
   next();
});
export const Review = model<IReview>("Review", reviewSchema);
