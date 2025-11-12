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
  rooms: IRoom[];
}


export interface IRoom extends Document {
    _id: string;
    title: string;
    description: string;
    bedCount: number;
    guestCount: number;
    bathroomCount: number;
    kingBed: number;
    queenBed: number;
    image: string;
    breakFastPrice: number;
    roomPrice: number;
    roomService: boolean;
    balcony: boolean;
    TV: boolean;
    hotelId: string;
    freeWifi: boolean;
    cityView: boolean;
    oceanView: boolean;
    forestView: boolean;
    mountainView: boolean;
    airCondition: boolean;
    soundProofed: boolean;
}

export interface IBooking extends Document {
    _id: string;
    userId: string;
    hotelId: string;
    roomId: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    breakFastIncluded: Boolean;
    currency: String;
    paymentStatus: Boolean;
    paymentIntentId: String;
    bookedAt: Date;
    Hotel: IHotel;
    userEmail: String;
    Room: IRoom;
    hotelOwnerId: String;
}

export const BookingSchema: Schema<IBooking> = new Schema(
    {
        userId: { type: String, required: true },
        hotelId: { type: String, required: true },
        roomId: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        totalPrice: { type: Number, required: true },
        breakFastIncluded: { type: Boolean, required: true },
        currency: { type: String, required: true },
        paymentStatus: { type: Boolean, required: true },
        paymentIntentId: { type: String, required: true },
        bookedAt: { type: Date, required: true },
        Hotel: { type: Schema.Types.ObjectId, ref: 'Hotel', required: true },
        Room: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
        hotelOwnerId: { type: String, required: true },
    },
    {
        timestamps: { createdAt: 'bookedAt', updatedAt: 'updatedAt' }, 
    }
)


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
    toJSON: { virtuals: true },    
    toObject: { virtuals: true }, 
  }
);

HotelSchema.virtual('rooms', {
  ref: 'Room',
  localField: '_id',
  foreignField: 'hotelId',
});



const RoomSchema: Schema<IRoom> = new Schema(
    {
      title: {type: String, required: true, maxlength: 500},
      description: {type: String, required: true, maxlength: 500},
      bedCount: {type: Number, required: true, },
      guestCount: {type: Number, required: true, },
      bathroomCount: {type: Number, required: true, },
      kingBed: {type: Number, required: true, },
      queenBed: {type: Number, required: true, },
      image: {type: String, required: true, },
      breakFastPrice: {type: Number, required: true, },
      roomPrice: {type: Number, required: true, },
      roomService: {type: Boolean, default: false, },
      balcony: {type: Boolean, default: false, },
      TV: {type: Boolean, default: false, },
      hotelId: { type: String, required: true },
      freeWifi: {type: Boolean, default: false, },
      cityView: {type: Boolean, default: false, },
      oceanView: {type: Boolean, default: false, },
      forestView: {type: Boolean, default: false, },
      mountainView: {type: Boolean, default: false, },
      airCondition: {type: Boolean, default: false, },
      soundProofed: {type: Boolean, default: false, }, 
    },
  {
    timestamps: { createdAt: 'addedAt', updatedAt: 'updatedAt' }, 
  }
)


export const Booking = (mongoose.models.Booking || mongoose.model<IBooking>('Booking', BookingSchema)) as Model<IBooking>;
export const Room = (mongoose.models.Room || mongoose.model<IRoom>('Room', RoomSchema)) as Model<IRoom>;
const Hotel = (mongoose.models.Hotel || mongoose.model<IHotel>('Hotel', HotelSchema)) as Model<IHotel>;

export default Hotel;

