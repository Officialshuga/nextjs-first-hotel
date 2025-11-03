import { auth } from "@clerk/nextjs/server";
import Hotel from "@/models/Hotel";
import dbConnect from "@/lib/dbConnect";

export async function POST(req: Request) {
  try {
    const { userId } = await auth(); 

    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const newHotel = await Hotel.create({
      ...body,
      userId 
    });

    return new Response(JSON.stringify(newHotel), { status: 201 });

  } catch (error: any) {
    return new Response(error.message, { status: 500 });
  }
}
