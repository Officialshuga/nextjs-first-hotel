import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";

interface GetBookingsProps {
  hotelId: string;
}

export const getBookings = async (params?: GetBookingsProps) => {
  try {
    await dbConnect();

    // ✅ Safely extract hotelId
    const hotelId = params?.hotelId;

    if (!hotelId) {
      throw new Error("hotelId is required");
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await Booking.find({
      hotelID: hotelId,
      endDate: { $gt: yesterday },
    });

    return bookings;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.message || "Failed to get bookings");
  }
};
