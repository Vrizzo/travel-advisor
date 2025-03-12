import mongoose, { Document, Schema } from 'mongoose';

export interface RouteDocument extends Document {
  _id: mongoose.Types.ObjectId;
  departureAirport: string;
  arrivalAirport: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RouteSchema = new Schema({
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
}, { timestamps: true });

// Ensure unique combination of departure and arrival airports
RouteSchema.index({ departureAirport: 1, arrivalAirport: 1 }, { unique: true });

export const RouteModel = mongoose.model<RouteDocument>('Route', RouteSchema); 