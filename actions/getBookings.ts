// import dbConnect from "@/lib/dbConnect";
// import { Booking } from "@/models/Hotel";

// interface GetBookingsProps {
//   hotelId: string;
// }

// export const getBookings = async (params?: GetBookingsProps) => {
//   try {
//     await dbConnect();

//     // ✅ Safely extract hotelId
//     const hotelId = params?.hotelId;

//     if (!hotelId) {
//       throw new Error("hotelId is required");
//     }

//     const yesterday = new Date();
//     yesterday.setDate(yesterday.getDate() - 1);

//     const bookings = await Booking.find({
//       hotelID: hotelId,
//       endDate: { $gt: yesterday },
//     });

//     return bookings;
//   } catch (error: any) {
//     console.error("Error fetching bookings:", error);
//     throw new Error(error.message || "Failed to get bookings");
//   }
// };


"use server";

import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";

interface GetBookingsProps {
  hotelId: string;
}

export const getBookings = async (params?: GetBookingsProps) => {
  try {
    await dbConnect();

    if (!params?.hotelId) {
      throw new Error("hotelId is required");
    }

    const hotelId = params.hotelId;

    // Date logic (yesterday)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // 🟢 Fetch bookings using lean() to avoid Mongoose Document issues
    const bookingsDocs = await Booking.find(
      {
        hotelID: hotelId,
        endDate: { $gt: yesterday },
      }
    ).lean();

    // 🟢 Convert ObjectIds → strings and sanitize metadata
    const bookings = bookingsDocs.map((booking: any) => ({
      ...booking,
      _id: booking._id?.toString(),
      hotelID: booking.hotelID?.toString(),
      userId: booking.userId?.toString(),
    }));

    // 🟢 Final serialization for Next.js/Vercel safety
    return JSON.parse(JSON.stringify(bookings));
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    throw new Error(error.message || "Failed to get bookings");
  }
};
