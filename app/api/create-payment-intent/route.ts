import dbConnect from "@/lib/dbConnect";
import { Booking } from "@/models/Hotel";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect(); 

  const user = await currentUser();
  if (!user) {
    return new NextResponse("Unauthorized from payment page", { status: 401 });
  }

  const body = await req.json();
  const { booking } = body;

  const bookingData = {
    ...booking,
    userName: user.firstName,
    userId: user.id,
    userEmail: user.emailAddresses[0]?.emailAddress,
    currency: "NGN",
  };

  try {
    // 1️⃣ Initialize Paystack transaction
    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: bookingData.userEmail,
        amount: bookingData.totalPrice * 100, // Paystack requires kobo
        currency: "NGN",
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
      }),
    });

    const data = await response.json();

    if (!data.status) {
      console.error("Paystack initialization failed:", data);
      return new NextResponse("Payment initialization failed", { status: 400 });
    }

    // 2️⃣ Save the booking to MongoDB
    await Booking.create({
      ...bookingData,
      paymentReference: data.data.reference,
      paymentUrl: data.data.authorization_url,
      paymentStatus: "pending",
    });

    // 3️⃣ Return payment info to frontend
    return NextResponse.json({
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Error initializing Paystack transaction:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

















//the former code is for paystack
// import dbConnect from "@/lib/dbConnect";
// import { Booking } from "@/models/Hotel";
// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Paystack from "@paystack/paystack-sdk";

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

//   // ✅ Initialize Paystack payment
//   const paystackResponse = await paystack.transaction.initialize({
//     email: bookingData.userEmail,
//     amount: booking.totalPrice * 100, // Convert Naira → Kobo
//     currency: "NGN",
//     callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`, 
//   });

//   // ✅ Save booking with paystack reference (not yet confirmed)
//   await Booking.create({
//     ...bookingData,
//     paymentRef: paystackResponse.data.reference,
//   });

//   return NextResponse.json({
//     authorization_url: paystackResponse.data.authorization_url,
//     reference: paystackResponse.data.reference,
//   });
// }







//the code below is for stripe

// import { currentUser } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import Stripe from "stripe";

// const stripe = new Stripe(process.env.PAYSTACK_SECRET_KEY as string, {
//   apiVersion: "2023-10-16",
// });

// export async function POST(req: Request) {
//   const user = await currentUser();

//   if (!user) {
//     return new NextResponse("Unauthorized from payment page", { status: 401 });
//   }

//   const body = await req.json();
//   const { booking, payment_intent_id } = body;

//   const bookingData = {
//     ...booking,
//     userName: user.firstName,
//     userId: user.id,
//     currency: "NGN",
//     paymentIntentId: payment_intent_id,
//     userEmail: user.emailAddresses,
//   };

//   let foundBooking;
//   if (payment_intent_id) {
//     foundBooking = await prismadb.booking.findUnique({
//       where: { paymentIntentId: payment_intent_id, userId: user.id },
//     });
//   }

//   if (foundBooking && payment_intent_id) {
//     const current_intent = await stripe.paymentIntents.retrieve(payment_intent_id);
//     if (current_intent) {
//       const updated_intent  = await stripe.paymentIntents.update(payment_intent_id, {
//         amount: booking.totalPrice * 100,
//       });

//       const res = await prismadb.booking.update({
//         where: { paymentIntentId: payment_intent_id, userId: user.id },
//         data: bookingData
//       });

//       if(!res){
//         return NextResponse.error()
//       }

//       return NextResponse.json({paymentIntent: updated_intent})
//     }
//   } else {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: booking.totalPrice * 100,
//       currency: bookingData.currency,
//       automatic_payment_methods: { enabled: true },
//     });

//     bookingData.paymentIntentId = paymentIntent.id;

//     await prismadb.booking.create({
//       data: bookingData,
//     })

//     return NextResponse.json({paymentIntent})
//   }
//   return new NextResponse("Internal Server Error", {status: 500})
// }
