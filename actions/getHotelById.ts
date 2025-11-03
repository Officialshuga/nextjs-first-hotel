import Hotel from "@/models/Hotel";
import dbConnect from "@/lib/dbConnect";
import { isValidObjectId } from "mongoose";
export const getHotelById = async (hotelId: string) => {
 try{
   await dbConnect();
   if (!isValidObjectId(hotelId)) {
      return null;
    }
    const hotel = await Hotel.findById(hotelId);
    if(!hotel) return null;
    //return hotel
     return JSON.parse(JSON.stringify(hotel));
 }  catch(error: any){
    throw new Error(error)
 } 
}