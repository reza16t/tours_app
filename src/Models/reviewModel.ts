import mongoose, { Schema, model } from "mongoose";
import { IModel, IReview } from "../types";
import { Tour } from "./tourModel";

const reviewSchema = new Schema<IReview>(
   {
      tourId: String,
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
            type: mongoose.Schema.ObjectId,
            ref: "User",
         },
      ],

      tour: [
         {
            type: mongoose.Schema.ObjectId,
            ref: "Tour",
         },
      ],
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);
reviewSchema.statics.calcAverageRating = async function (
   tourId: string,
): Promise<void> {
   const stats: { id: string; nRating: number; avgRating: number }[] =
      await this.aggregate([
         { $match: { tour: tourId } },
         {
            $group: {
               _id: "$tour",
               nRating: { $sum: 1 },
               avgRating: { $avg: "$rating" },
            },
         },
      ]);
   if (stats.length > 0) {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsAverage: stats[0].avgRating,
         ratingsQuantity: stats[0].nRating,
      });
   } else {
      await Tour.findByIdAndUpdate(tourId, {
         ratingsAverage: 4.5,
         ratingsQuantity: 0,
      });
   }
};
reviewSchema.post("save", function (this: IReview) {
   this.constructor.calcAverageRating(this.tour);
});
reviewSchema.pre(/^findOneAnd/, function (this: IModel, next) {
   (this as any).r = this.findOne();
   next();
});
reviewSchema.post(/^findOneAnd/, function (this: IModel, next) {
   (this as any).r.constructor.calcAverageRating((this as any).r.tour);
   next();
});

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
