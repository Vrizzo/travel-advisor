import mongoose, { Document, Schema } from 'mongoose';

export interface TravelPreferenceDocument extends Document {
  _id: mongoose.Types.ObjectId;
  departureCity: string;
  periodFrom: string;
  periodTo: string;
  budget: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const travelPreferenceSchema = new Schema({
  departureCity: {
    type: String,
    required: [true, 'Departure city is required'],
    uppercase: true
  },
  periodFrom: {
    type: String,
    required: [true, 'Start date is required']
  },
  periodTo: {
    type: String,
    required: [true, 'End date is required']
  },
  budget: {
    type: Number,
    required: [true, 'Budget is required'],
    min: [0, 'Budget must be a positive number']
  }
}, {
  timestamps: true
});

export const TravelPreferenceModel = mongoose.model<TravelPreferenceDocument>('TravelPreference', travelPreferenceSchema); 