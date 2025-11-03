import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IHotel extends Document {
  userId: string;
  title: string;
  description: string;
  image: string;
  state: string;
  country: string;
  city: string;
  locationDescription: string;
  gym: boolean;
  spa: boolean;
  bar: boolean;
  laundry: boolean;
  restaurant: boolean;
  shopping: boolean;
  freeParking: boolean;
  bikeRental: boolean;
  freeWifi: boolean;
  movieNights: boolean;
  swimmingPool: boolean;
  coffeShop: boolean;
  addedAt: Date;
  updatedAt: Date;
}


const HotelSchema: Schema<IHotel> = new Schema(
  {    
    userId: { type: String, required: true },
    title: { type: String, required: true, maxlength: 500 },
    description: { type: String, required: true },
    image: { type: String, required: true },
    country: { type: String, required: true, maxlength: 50 },
    state: { type: String, required: true, maxlength: 50 },
    city: { type: String, required: true, maxlength: 50 },
    locationDescription: { type: String, required: true },
    
    gym: { type: Boolean, default: false },
    spa: { type: Boolean, default: false },
    bar: { type: Boolean, default: false },
    laundry: { type: Boolean, default: false },
    restaurant: { type: Boolean, default: false },
    shopping: { type: Boolean, default: false },
    freeParking: { type: Boolean, default: false },
    bikeRental: { type: Boolean, default: false },
    freeWifi: { type: Boolean, default: false },
    movieNights: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false },
    coffeShop: { type: Boolean, default: false },
  },
  {
    timestamps: { createdAt: 'addedAt', updatedAt: 'updatedAt' }, 
  }
);


const Hotel = (mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema)) as Model<IHotel>;

export default Hotel;