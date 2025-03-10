import mongoose, { Document, Schema } from 'mongoose';

export interface RouteDocument extends Document {
  _id: mongoose.Types.ObjectId;
  departureAirport: string;
  arrivalAirport: string;
}

const routeSchema = new Schema({
  departureAirport: {
    type: String,
    required: [true, 'Departure airport is required'],
    uppercase: true
  },
  arrivalAirport: {
    type: String,
    required: [true, 'Arrival airport is required'],
    uppercase: true
  }
}, {
  timestamps: true
});

// Ensure unique combination of departure and arrival airports
routeSchema.index({ departureAirport: 1, arrivalAirport: 1 }, { unique: true });

export const RouteModel = mongoose.model<RouteDocument>('Route', routeSchema); 