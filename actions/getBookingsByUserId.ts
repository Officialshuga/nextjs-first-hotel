import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";

export const getBookingsByUserId = async () => {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await Booking.find({ userId })
      .populate("hotelId")      
      .populate("roomId")        
      .sort({ bookedAt: -1 });   

    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Error fetching bookings");
  }
};
