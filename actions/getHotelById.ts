"use server";

import dbConnect from "@/lib/dbConnect";
import Hotel, { Room } from "@/models/Hotel";

export async function getHotelById(hotelId: string) {
  try {
    await dbConnect();

    // Fetch the hotel
    const hotelDoc = await Hotel.findById(hotelId).lean();

    if (!hotelDoc) {
      return null;
    }

    // Fetch all rooms for this hotel
    const roomsDocs = await Room.find({ hotelId: hotelId }).lean();

    // Combine hotel with rooms and convert MongoDB ObjectIds to strings
    const hotel = {
      ...hotelDoc,
      _id: hotelDoc._id.toString(),
      rooms: roomsDocs.map((room) => ({
        ...room,
        _id: room._id.toString(),
        hotelId: room.hotelId,
      })),
    };

    console.log("Hotel fetched with rooms:", hotel.title);
    console.log("Number of rooms:", hotel.rooms.length);

    return hotel;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}