import { auth } from "@clerk/nextjs/server";
// import Hotel from "@/models/Hotel";
import { Room } from "@/models/Hotel";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const room = await Room.create({
      ...body, 
    });

    return new Response(JSON.stringify(room), { status: 201 });

  } catch (error: any) {
    console.log("Error at /api/room POST", error)
    return new Response(error.message, { status: 500 });
  }
}
