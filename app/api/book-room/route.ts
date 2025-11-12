// import dbConnect from "@/lib/dbConnect";
// import { Booking } from "@/models/Hotel";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Paystack from "paystack-api";

// const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

// export async function POST(req: Request) {
//   await dbConnect();
//   const user = await currentUser();

//   if (!user) {
//     return new NextResponse("Unauthorized", { status: 401 });
//   }

//   const body = await req.json();
//   const { booking } = body;

//   const bookingData = {
//     ...booking,
//     userName: user.firstName,
//     userId: user.id,
//     userEmail: user.emailAddresses[0]?.emailAddress,
//     currency: "NGN",
//   };

//   // ✅ Initialize Paystack Payment
//   const paystackResponse = await paystack.transaction.initialize({
//     email: bookingData.userEmail,
//     amount: booking.totalPrice * 100, // Naira → Kobo
//     currency: "NGN",
//     callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
//   });

//   // ✅ Save booking with reference for verification later
//   await Booking.create({
//     ...bookingData,
//     paymentRef: paystackResponse.data.reference,
//     paymentStatus: "pending",
//   });

//   return NextResponse.json({
//     authorization_url: paystackResponse.data.authorization_url,
//     reference: paystackResponse.data.reference,
//   });
// }


import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import Paystack from "@paystack/paystack-sdk";

//const paystack = new Paystack(process.env.PAYSTACK_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    await dbConnect();
    const user = await currentUser();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { booking } = await req.json();

    const bookingData = {
      ...booking,
      userName: user.firstName,
      userId: user.id,
      userEmail: user.emailAddresses[0]?.emailAddress,
      currency: "NGN",
    };

    // ✅ Initialize Paystack Payment
    // const paystackResponse = await paystack.transaction.initialize({
    //   email: bookingData.userEmail,
    //   amount: booking.totalPrice * 100,
    //   currency: "NGN",
    //   callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
    // });

    // ✅ Save booking with payment reference
    await Booking.create({
      ...bookingData,
      // paymentRef: paystackResponse.data.reference,
    });

    // return NextResponse.json({
    //   authorization_url: paystackResponse.data.authorization_url,
    //   reference: paystackResponse.data.reference,
    // });

  } catch (error: any) {
    console.log("PAYSTACK ERROR:", error);
    return new NextResponse("Payment Initialization Failed", { status: 500 });
  }
}
