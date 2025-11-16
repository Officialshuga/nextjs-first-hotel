import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
// export const getBookingsByUserId = async () => {
//   try {
//     const session = await auth();
//     const userId = session?.userId;

//     if (!userId) {
//       throw new Error("Unauthorized");
//     }

//     const bookings = await Booking.find({ userId })
//       .populate("hotelId") 
//       .populate("roomId")   
//       .sort({ bookedAt: -1 })
//       .lean(); 
//     const safeBookings = JSON.parse(JSON.stringify(bookings));

//     return safeBookings.map((booking: any) => ({
//       ...booking,
//       startDate: new Date(booking.startDate).toISOString(),
//       endDate: new Date(booking.endDate).toISOString(),
//       bookedAt: new Date(booking.bookedAt).toISOString(),
//       currency: booking.currency?.toString() || 'NGN', 
//       paymentStatus: !!booking.paymentStatus, 
//     }));

//   } catch (error: any) {
//     console.log(error);
//     throw new Error(error.message || "Error fetching bookings");
//   }
// };




export const getBookingsByUserId = async () => {
  await dbConnect();

  const session = await auth();
  const userId = session?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const bookings = await Booking.find({
    userId,
  })
    .populate("Room")
    .populate("Hotel")
    .sort({ bookedAt: -1 });

  return JSON.parse(JSON.stringify(bookings));
};
