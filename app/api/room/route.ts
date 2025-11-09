import { auth } from "@clerk/nextjs/server";
import dbConnect from "@/lib/dbConnect";
import Hotel, { Room} from "@/models/Hotel"; 

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const body = await req.json();
    const { hotelId, ...roomData } = body;

    if (!hotelId) {
      return new Response("hotelId is required", { status: 400 });
    }

    const hotel = await Hotel.findById(hotelId);

    if (!hotel || hotel.userId !== userId) {
      return new Response("Unauthorized: This hotel does not belong to you", { status: 401 });
    }

    const room = await Room.create({
      hotelId,
      ...roomData,
    });

    return new Response(JSON.stringify(room), { status: 201 });
  } catch (error: any) {
    console.log("Error at /api/room POST", error);
    return new Response(error.message, { status: 500 });
  }
}
