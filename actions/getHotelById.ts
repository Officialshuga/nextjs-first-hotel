"use server";

// import dbConnect from "@/lib/dbConnect";
// import Hotel, { Room } from "@/models/Hotel";

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

"use server";

import dbConnect from "@/lib/dbConnect";
import Hotel, { Room } from "@/models/Hotel";

export async function getHotelById(hotelId: string) {
  try {
    await dbConnect();

    // Use lean() to remove all Mongoose Document metadata
    const hotelDoc = await Hotel.findById(hotelId).lean();

    if (!hotelDoc) return null;

    // Fetch rooms separately (also lean)
    const roomsDocs = await Room.find({ hotelId }).lean();

    // Convert everything into clean JSON objects
    const hotel = {
      ...hotelDoc,
      _id: hotelDoc._id?.toString(),
      userId: hotelDoc.userId?.toString(),

      rooms: roomsDocs.map((room: any) => ({
        ...room,
        _id: room._id?.toString(),
        hotelId: room.hotelId?.toString(),
      })),
    };

    // Final purification — GUARANTEES Next.js build success
    return JSON.parse(JSON.stringify(hotel));
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return null;
  }
}

