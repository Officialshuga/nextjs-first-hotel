import dbConnect from "@/lib/dbConnect";
import { Room } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ roomId: string }> }  
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { roomId } = await params;  
        
        if (!roomId) {  
            return new NextResponse("Room ID is required", { status: 400 });
        }
        
        await dbConnect();
        const body = await req.json();
        
        const room = await Room.findByIdAndUpdate(
            roomId,
            { $set: { ...body } },
            { new: true }
        );
        
        if (!room) {
            return new NextResponse("Hotel not found", { status: 404 });
        }
        
        return NextResponse.json(room);
        
    } catch (error: any) {
        console.log("Error at /api/room/roomId PATCH", error);
        return new NextResponse(error.message, { status: 500 });
    }
}

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ roomId: string }> }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { roomId } = await params;
        
        if (!roomId) {
            return new NextResponse("room ID is required", { status: 400 });
        }
        
        await dbConnect();
        
        // Optional: Verify the room belongs to the user before deleting
        const room = await Room.findById(roomId);
        
        if (!room) {
            return new NextResponse("Hotel not found", { status: 404 });
        }
        
        // Optional: Add ownership check
        // if (hotel.userId !== userId) {
        //     return new NextResponse("Forbidden: You don't own this hotel", { status: 403 });
        // }
        
        await Room.findByIdAndDelete(roomId);
        
        return new NextResponse("Hotel deleted successfully", { status: 200 });
        
    } catch (error: any) {
        console.log("Error at /api/room/roomId DELETE", error);
        return new NextResponse(error.message, { status: 500 });
    }
}