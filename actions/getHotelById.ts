// "use server";

import dbConnect from "@/lib/dbConnect";
import Hotel, { Room } from "@/models/Hotel";

// import dbConnect from "@/lib/dbConnect";
// import Hotel, { Room } from "@/models/Hotel";

// export async function getHotelById(hotelId: string) {
//   try {
//     await dbConnect();

//     const hotelDoc = await Hotel.findById(hotelId).lean();

//     if (!hotelDoc) {
//       return null;
//     }

//     const roomsDocs = await Room.find({ hotelId: hotelId }).lean();

//     const hotel = {
//       ...hotelDoc,
//       _id: hotelDoc._id.toString(),
//       rooms: roomsDocs.map((room) => ({
//         ...room,
//         _id: room._id.toString(),
//         hotelId: room.hotelId,
//       })),
//     };


//     return hotel;
//   } catch (error) {
//     console.error("Error fetching hotel:", error);
//     return null;
//   }
// }

export async function getHotelById(hotelId: string) {
  try {
    await dbConnect();

    const hotelDoc = await Hotel.findById(hotelId).lean();

    if (!hotelDoc) {
      return null;
    }

    const roomsDocs = await Room.find({ hotelId: hotelId }).lean();

    // Create a plain JavaScript object with only the properties we need
    const hotel = {
      ...hotelDoc,
      _id: hotelDoc._id.toString(),
      userId: hotelDoc.userId?.toString(), // Convert ObjectId to string if it exists
      rooms: roomsDocs.map((room: any) => ({
        ...room,
        _id: room._id.toString(),
        hotelId: room.hotelId?.toString(),
        // Add any other room properties you need
      })),
      // Remove any MongoDB-specific properties that might cause issues
      __v: undefined,
    };

    return hotel;
  } catch (error) {
    console.error('Error fetching hotel by ID:', error);
    return null;
  }
}
