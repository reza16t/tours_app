// Generated by https://quicktype.io

export interface ToursType {
  id: number;
  name: string;
  duration: number;
  maxGroupSize?: number;
  difficulty: Difficulty;
  ratingsAverage?: number;
  ratingsQuantity?: number;
  price?: number;
  summary?: string;
  description?: string;
  imageCover?: string;
  images?: string[];
  startDates?: string[];
}

export enum Difficulty {
  Difficult = 'difficult',
  Easy = 'easy',
  Medium = 'medium',
}
