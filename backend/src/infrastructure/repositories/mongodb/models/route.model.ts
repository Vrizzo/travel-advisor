import mongoose, { Document, Schema } from 'mongoose';

export interface RouteDocument extends Document {
  departureAirport: string;
  arrivalAirport: string;
}

const routeSchema = new Schema({
  departureAirport: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 3,
    uppercase: true
  },
  arrivalAirport: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 3,
    uppercase: true
  }
});

// Ensure unique combination of departure and arrival airports
routeSchema.index({ departureAirport: 1, arrivalAirport: 1 }, { unique: true });

export const RouteModel = mongoose.model<RouteDocument>('Route', routeSchema); 