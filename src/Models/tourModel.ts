import mongoose, { Schema, model } from "mongoose";
import { ITours, Type } from "../types";
// 1) MIDDLEWARES
const toursSchema = new Schema<ITours>(
   {
      name: {
         type: String,
         required: [true, "A tour must have a name"],
         unique: true,
         trim: true,
         maxlength: [
            40,
            "A tour name must have less or equal then 40 characters",
         ],
         minlength: [
            8,
            "A tour name must have more or equal then 10 characters",
         ],
         // validate: [validator.isAlpha, 'Tour name must only contain characters']
      },
      description: {
         type: String,
         trim: true,
      },

      // slug: String,
      duration: {
         type: Number,
         required: [true, "A tour must have a duration"],
      },
      price: {
         type: Number,
         required: [true, "A tour must have a price"],
      },

      difficulty: {
         type: String,
         required: [true, "A tour must have a difficulty"],
         enum: {
            values: ["easy", "medium", "difficult"],
            message: "Difficulty is either: easy, medium, difficult",
         },
      },
      ratingsAverage: {
         type: Number,
         default: 4.5,
         min: [1, "Rating must be above 1.0"],
         max: [5, "Rating must be below 5.0"],
         set: (v: number) => v.toFixed(1),
      },
      ratingsQuantity: {
         type: Number,
         default: 0,
      },

      priceDiscount: {
         type: Number,
         validate: {
            validator: function (val: number) {
               // this only points to current doc on NEW document creation
               return val < this.price;
            },
            message: "Discount price ({VALUE}) should be below regular price",
         },
      },
      maxGroupSize: {
         type: Number,
         required: [true, "A tour must have a group size"],
      },
      summary: {
         type: String,
         trim: true,
         required: [true, "A tour must have a description"],
      },
      imageCover: {
         type: String,
         required: [true, "A tour must have a cover image"],
      },
      images: [String],
      createdAt: {
         type: Date,
         default: Date.now(),
         select: false,
      },
      startDates: [Date],
      slug: String,

      secretTour: {
         type: Boolean,
         default: false,
      },
      guides: [
         {
            type: mongoose.Schema.ObjectId,
            ref: "User",
         },
      ],
      locations: [
         {
            type: {
               type: String,
               default: Type.Point,
            },
            coordinates: [Number],
            description: String,
            address: String,
            day: Number,
         },
      ],
      startLocation: {
         type: {
            type: String,
            default: Type.Point,
         },
         coordinates: [Number],
         description: String,
         address: String,
         day: Number,
      },
   },
   {
      toJSON: { virtuals: true },
      toObject: { virtuals: true },
   },
);
toursSchema.pre(/^find/, function (this: ITours, next) {
   this.populate({
      path: "guides",
      select: "name _id email",
   });
   next();
});
toursSchema.virtual("durationWeeks").get(function () {
   return this.duration / 7;
});
toursSchema.virtual("reviews", {
   ref: "Review",
   foreignField: "tour",
   localField: "_id",
});
// toursSchema.pre("save", async function (next) {
//    const guides = (this.guides as string[]).map(
//       async (id) => await User.findById(id),
//    );
//    this.guides = await Promise.all(guides);
//    next();
// });
export const Tour = model<ITours>("Tour", toursSchema);
