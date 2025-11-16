// import { Booking } from "@/models/Hotel";
// import { auth } from "@clerk/nextjs/server";

// export const getBookingsByHotelOwnerId = async () => {
//     try {
//         const session = await auth();
//     const userId = session?.userId;

//     if (!userId) {
//       throw new Error("Unauthorized");
//     }
//     const bookings = await Booking.findById({
//         hotelOwnerId: userId,
//         Room: true,
//         Hotel: true,
//         orderBy: {bookedAt: "desc"}
//     })


//     } catch (error: any) {
//         console.log(error);
//         throw new Error(error)
//     }
// }


import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await Booking.find({ hotelOwnerId: userId })
      .populate("hotelId")       // populate hotel
      .populate("roomId")        // populate room
      .sort({ bookedAt: -1 });   // descending order

    return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error.message || "Error fetching bookings");
  }
};
