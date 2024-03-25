// Generated by https://quicktype.io
import { Request } from "express";
import { Document, Model } from "mongoose";

export enum Difficulty {
   Difficult = "difficult",
   Easy = "easy",
   Medium = "medium",
}
// Generated by https://quicktype.io

export interface ITours extends Document {
   startLocation: StartLocation;
   ratingsAverage: number;
   ratingsQuantity: number;
   images: string[];
   startDates: string[];
   _id: string;
   name: string;
   duration: number;
   maxGroupSize: number;
   priceDiscount: number;
   difficulty: string;
   guides: string[];
   price: number;
   summary: string;
   createdAt: Date;
   secretTour: boolean;
   description: string;
   imageCover: string;
   slug: string;
   locations: Location[];
}

export interface Location {
   _id: string;
   description: string;
   type: Type;
   coordinates: number[];
   day: number;
}

export enum Type {
   Point = "Point",
}

export interface StartLocation {
   description: string;
   type: Type;
   coordinates: number[];
   address: string;
}
// Generated by https://quicktype.io

export interface IUser extends Document {
   _id: string;
   name: string;
   email: string;
   role: Role;
   active: boolean;
   avatar: string;
   password: string;
   passwordConfirm: string;
   passwordChangedAt: string;
   passwordRestToken: string;
   passwordRestExpires: string;
}

export enum Role {
   Admin = "admin",
   Guide = "guide",
   LeadGuide = "lead-guide",
   User = "user",
}

// Generated by https://quicktype.io

export interface IDecoded {
   id: string;
   iat: number;
   exp: number;
}
export interface IRole extends Request {
   user: Document<unknown, object, IUser> &
      IUser &
      Required<{
         _id: string;
      }>;
}
export interface IUserDocument extends IUser {
   correctPassword: (
      candidatePassword: string,
      userPassword: string,
   ) => Promise<string>;
   changedPasswordAfter: (JWT: number) => boolean;
   createPasswordRestToken: () => string;
}
export interface IReview extends Document {
   review: string;
   rating: number;
   createdAt: number | string | Date;
   tour: string;
   user: string;
}

export type model = Model<
   IUserDocument | IReview | ITours,
   object,
   object,
   object,
   Document<unknown, object, IUserDocument | IReview | ITours> &
      (IUserDocument | IReview | ITours) &
      Required<{
         _id: string;
      }>
>;
// Model<
//    IUserDocument,
//    {},
//    {},
//    {},
//    Document<unknown, {}, IUserDocument> &
//       IUserDocument &
//       Required<{
//          _id: string;
//       }>,
//    any
// >;
