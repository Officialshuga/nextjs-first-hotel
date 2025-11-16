
// "use server";

import dbConnect from "@/lib/dbConnect";
import Hotel from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";

export async function getHotelByUserId() {
  try {
    await dbConnect();
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    // VERY IMPORTANT: use lean()
    const hotels = await Hotel.find({ userId })
      .populate("rooms")
      .lean(); 

    if (!hotels) return null;

    // Convert _id and room._id to string
    const cleanHotels = hotels.map((hotel: any) => ({
      ...hotel,
      _id: hotel._id.toString(),
      userId: hotel.userId.toString(),
      rooms: hotel.rooms?.map((room: any) => ({
        ...room,
        _id: room._id.toString(),
      })) || [],
    }));

    return cleanHotels;
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}
