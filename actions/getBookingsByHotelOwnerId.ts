import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
export const getBookingsByHotelOwnerId = async () => {
  try {
    await dbConnect();
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      throw new Error("Unauthorized");
    }
    const bookings = await Booking.find({
    hotelOwnerId: userId,
  })
    .populate("Room")   // if Room is a ref
    .populate("Hotel")  // if Hotel is a ref
    .sort({ bookedAt: -1 });

  return JSON.parse(JSON.stringify(bookings));
    // const bookings = await Booking.find({
    //   hotelOwnerId: userId,
    //   Room: true,
    //   Hotel: true,
    //   orderBy: { bookedAt: "desc" },
    // });
    // if(!bookings) return null;
    // return bookings;
  } catch (error: any) {
    console.log(error);
    throw new Error(error);
  }
};

// import dbConnect from "@/lib/dbConnect";
// import { Booking } from "@/models/Hotel";
// import { auth } from "@clerk/nextjs/server";

// export const getBookingsByHotelOwnerId = async () => {
//   try {
//     await dbConnect();
//     const session = await auth();
//     const userId = session?.userId;

//     if (!userId) {
//       throw new Error("Unauthorized");
//     }

//     const bookings = await Booking.find({ hotelOwnerId: userId })
//       .populate("hotelId")
//       .populate("roomId")
//       .sort({ bookedAt: -1 });

//     return bookings;
//   } catch (error: any) {
//     console.log(error);
//     throw new Error(error.message || "Error fetching bookings");
//   }
// };
