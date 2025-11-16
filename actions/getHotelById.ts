"use server";

import dbConnect from "@/lib/dbConnect";
import Hotel, { Room } from "@/models/Hotel";

export async function getHotelById(hotelId: string) {
  try {
    await dbConnect();

    const hotelDoc = await Hotel.findById(hotelId).lean();

    if (!hotelDoc) {
      return null;
    }

    const roomsDocs = await Room.find({ hotelId: hotelId }).lean();

    const hotel = {
      ...hotelDoc,
      _id: hotelDoc._id.toString(),
      rooms: roomsDocs.map((room) => ({
        ...room,
        _id: room._id.toString(),
        hotelId: room.hotelId,
      })),
    };


    return hotel;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}