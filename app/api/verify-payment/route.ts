// app/api/verify-payment/route.ts
import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json(
        { success: false, message: "No reference provided" }, 
        { status: 400 }
      );
    }

    // First, check if we already have a successful payment for this reference
    await dbConnect();
    const existingBooking = await Booking.findOne({ 
      paymentIntentId: reference,
      paymentStatus: true // Check for already paid bookings
    });

    if (existingBooking) {
      return NextResponse.json({
        success: true,
        message: "Payment already verified",
        booking: existingBooking,
        alreadyVerified: true
      });
    }

    // Verify payment with Paystack
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Cache-Control": "no-cache",
        },
      }
    );

    if (!verifyResponse.ok) {
      const error = await verifyResponse.json();
      console.error("Paystack API Error:", error);
      return NextResponse.json(
        { 
          success: false, 
          message: error.message || "Failed to verify payment" 
        }, 
        { status: verifyResponse.status }
      );
    }

    const verifyData = await verifyResponse.json();

    if (!verifyData.status || verifyData.data.status !== "success") {
      return NextResponse.json(
        { 
          success: false, 
          message: verifyData.message || "Payment not successful",
          data: verifyData.data 
        }, 
        { status: 400 }
      );
    }

    // Update booking status in database
    const updatedBooking = await Booking.findOneAndUpdate(
      { 
        paymentIntentId: reference,
        paymentStatus: false // Only update if it's currently not paid
      },
      { 
        $set: {
          paymentStatus: true,
          paymentDetails: verifyData.data,
          updatedAt: new Date()
        }
      },
      { 
        new: true,
        // Return the original document if no document was found
        // This helps us know if the update was successful
        returnOriginal: false
      }
    );

    if (!updatedBooking) {
      // Try to find the booking to see why it might not be updating
      const booking = await Booking.findOne({ paymentIntentId: reference });
      console.log("Booking found but not updated:", booking);
      
      return NextResponse.json(
        { 
          success: false, 
          message: "Booking not found or already paid",
          bookingExists: !!booking,
          currentStatus: booking?.paymentStatus
        }, 
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      booking: updatedBooking,
    });

  } catch (error: any) {
    console.error("Payment verification error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "Internal server error",
        error: process.env.NODE_ENV === "development" ? error.message : undefined
      }, 
      { status: 500 }
    );
  }
}