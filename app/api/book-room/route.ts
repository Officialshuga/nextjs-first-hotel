import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        metadata: {
          userId: userId,
          hotelId: booking.hotelId,
          roomId: booking.roomId,
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
