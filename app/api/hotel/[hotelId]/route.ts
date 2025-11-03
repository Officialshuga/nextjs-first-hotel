// import dbConnect from "@/lib/dbConnect";
// import Hotel from "@/models/Hotel";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";



// export async function PATCH(req: Request, {params}: {params: {hotelId: string}}){
//     try {
//         const { userId } = await auth(); 
//         if(!params.hotelId){
//             return new NextResponse("Hotel ID is required", {status: 400})
//         }
//         if (!userId) {
//             return new Response("Unauthorized", { status: 401 });
//         }
//          await dbConnect();
//         const body = await req.json();
//         const { hotelId } = await params;
//         const hotel = await Hotel.findByIdAndUpdate(
//             hotelId,
//             { $set: { ...body } },
//             { new: true }
//         );
//             return new Response(JSON.stringify(hotel), { status: 200 });

//         //return NextResponse.json(hotel);
//     } catch (error: any) {
//         console.log("Error at /api/hotel/hotelId PATCH", error)
//         return new Response(error.message, { status: 500 });
//     }
// }



import dbConnect from "@/lib/dbConnect";
import Hotel from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, 
    { params }: { params: Promise<{ hotelId: string }> }  // ✅ Changed to Promise
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { hotelId } = await params;  // ✅ Await params FIRST
        
        if (!hotelId) {  // ✅ Now check hotelId (not params.hotelId)
            return new NextResponse("Hotel ID is required", { status: 400 });
        }
        
        await dbConnect();
        const body = await req.json();
        
        const hotel = await Hotel.findByIdAndUpdate(
            hotelId,
            { $set: { ...body } },
            { new: true }
        );
        
        if (!hotel) {
            return new NextResponse("Hotel not found", { status: 404 });
        }
        
        return NextResponse.json(hotel);
        
    } catch (error: any) {
        console.log("Error at /api/hotel/hotelId PATCH", error);
        return new NextResponse(error.message, { status: 500 });
    }
}

export async function DELETE(
    req: Request, 
    { params }: { params: Promise<{ hotelId: string }> }
) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }
        
        const { hotelId } = await params;
        
        if (!hotelId) {
            return new NextResponse("Hotel ID is required", { status: 400 });
        }
        
        await dbConnect();
        
        // Optional: Verify the hotel belongs to the user before deleting
        const hotel = await Hotel.findById(hotelId);
        
        if (!hotel) {
            return new NextResponse("Hotel not found", { status: 404 });
        }
        
        // Optional: Add ownership check
        // if (hotel.userId !== userId) {
        //     return new NextResponse("Forbidden: You don't own this hotel", { status: 403 });
        // }
        
        await Hotel.findByIdAndDelete(hotelId);
        
        return new NextResponse("Hotel deleted successfully", { status: 200 });
        
    } catch (error: any) {
        console.log("Error at /api/hotel/hotelId DELETE", error);
        return new NextResponse(error.message, { status: 500 });
    }
}