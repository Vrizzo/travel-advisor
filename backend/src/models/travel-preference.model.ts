import mongoose, { Document, Schema } from 'mongoose';
import { TravelPreference } from '../types/travel-preference';

export interface TravelPreferenceDocument extends TravelPreference, Document {}

const travelPreferenceSchema = new Schema({
  departureCity: {
    type: String,
    required: [true, 'Departure city is required'],
    uppercase: true
  },
  periodFrom: {
    type: String,
    required: [true, 'Start date is required'],
    validate: {
      validator: (value: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      },
      message: 'Start date must be in YYYY-MM-DD format'
    }
  },
  periodTo: {
    type: String,
    required: [true, 'End date is required'],
    validate: {
      validator: (value: string) => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        if (!regex.test(value)) return false;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      },
      message: 'End date must be in YYYY-MM-DD format'
    }
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