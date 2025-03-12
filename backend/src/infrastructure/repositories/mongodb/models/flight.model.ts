import mongoose, { Document, Schema } from 'mongoose';

export interface FlightDocument extends Document {
  _id: mongoose.Types.ObjectId;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: Date;
  arrivalTime: Date;
  price: number;
  airline: string;
  deepLink: string;
  travelPreferenceId: mongoose.Types.ObjectId;
  lastUpdated: Date;
}

const FlightSchema = new Schema({
  departureAirport: {
    type: String,
    required: true
  },
  arrivalAirport: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  arrivalTime: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  airline: {
    type: String,
    required: true
  },
  deepLink: {
    type: String,
    required: true
  },
  travelPreferenceId: {
    type: Schema.Types.ObjectId,
    ref: 'TravelPreference',
    required: true
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export const FlightModel = mongoose.model<FlightDocument>('Flight', FlightSchema); 