import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// GET - Fetch all bookings for the authenticated user
export async function GET(req: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();
    
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Get URL search params for filtering
    const { searchParams } = new URL(req.url);
    const hotelId = searchParams.get("hotelId");
    const status = searchParams.get("status"); // paid or unpaid

    // Build query
    let query: any = { userId };
    
    if (hotelId) {
      query.hotelId = hotelId;
    }
    
    if (status === "paid") {
      query.paymentStatus = true;
    } else if (status === "unpaid") {
      query.paymentStatus = false;
    }

    // Fetch bookings with populated hotel and room data
    const bookings = await Booking.find(query)
      .populate("Hotel", "title location") // Populate hotel details
      .populate("Room", "title price") // Populate room details
      .sort({ bookedAt: -1 }); // Most recent first

    return NextResponse.json({
      success: true,
      count: bookings.length,
      bookings,
    });

  } catch (error: any) {
    console.error("GET BOOKINGS ERROR:", error);
    return new NextResponse(error.message || "Failed to fetch bookings", { status: 500 });
  }
}



// export async function POST(req: Request) {
//   try {
//     await dbConnect();
//     const { userId } = await auth();
//     if (!userId) {
//       return new NextResponse("Unauthorized", { status: 401 });
//     }
//     const { booking, userEmail, userName } = await req.json();

//     const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         email: userEmail,
//         amount: booking.totalPrice * 100, 
//         currency: "NGN",
//         callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
//         metadata: {
//           userId: userId,
//           hotelId: booking.hotelId,
//           roomId: booking.roomId,
//         },
//       }),
//     });

//     const paystackData = await paystackResponse.json();

//     if (!paystackData.status) {
//       throw new Error(paystackData.message || "Paystack initialization failed");
//     }

//     const bookingData = {
//       hotelOwnerId: booking.hotelOwnerID,
//       hotelId: booking.hotelId,
//       roomId: booking.roomId,
//       userId: userId,
//       userName: userName,
//       userEmail: userEmail,
//       startDate: booking.startDate,
//       endDate: booking.endDate,
//       breakFastIncluded: booking.breakFastIncluded,
//       currency: "NGN",
//       totalPrice: booking.totalPrice,
//       paymentIntentId: paystackData.data.reference,
//       paymentStatus: false,
//       bookedAt: new Date(),
//       Hotel: booking.hotelId,
//       Room: booking.roomId,
//     };

//     await Booking.create(bookingData);

//     return NextResponse.json({
//       authorization_url: paystackData.data.authorization_url,
//       reference: paystackData.data.reference,
//     });

//   } catch (error: any) {
//     console.error("PAYSTACK ERROR:", error);
//     return new NextResponse(error.message || "Payment Initialization Failed", { status: 500 });
//   }
// }



export async function POST(req: Request) {
  try {
    await dbConnect();
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { booking, userEmail, userName } = await req.json();

    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: userEmail,
        amount: booking.totalPrice * 100, 
        currency: "NGN",
        // ✅ CRITICAL: Use the correct callback URL format
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        metadata: {
          userId: userId,
          hotelId: booking.hotelId,
          roomId: booking.roomId,
          reference: "", // Will be filled by Paystack
        },
      }),
    });

    const paystackData = await paystackResponse.json();

    if (!paystackData.status) {
      throw new Error(paystackData.message || "Paystack initialization failed");
    }

    const bookingData = {
      hotelOwnerId: booking.hotelOwnerID,
      hotelId: booking.hotelId,
      roomId: booking.roomId,
      userId: userId,
      userName: userName,
      userEmail: userEmail,
      startDate: booking.startDate,
      endDate: booking.endDate,
      breakFastIncluded: booking.breakFastIncluded,
      currency: "NGN",
      totalPrice: booking.totalPrice,
      paymentIntentId: paystackData.data.reference,
      paymentStatus: false,
      bookedAt: new Date(),
      Hotel: booking.hotelId,
      Room: booking.roomId,
    };

    await Booking.create(bookingData);

    return NextResponse.json({
      authorization_url: paystackData.data.authorization_url,
      reference: paystackData.data.reference,
    });

  } catch (error: any) {
    console.error("PAYSTACK ERROR:", error);
    return new NextResponse(error.message || "Payment Initialization Failed", { status: 500 });
  }
}