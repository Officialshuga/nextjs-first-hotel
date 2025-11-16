// "use client";
// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
// } from "../ui/card";
// import Image from "next/image";
// import AmenityItem from "../AmenityItem";
// import {
//   AirVent,
//   Bath,
//   Bed,
//   BedDouble,
//   Castle,
//   Home,
//   MapPin,
//   MountainSnow,
//   Ship,
//   Trees,
//   Tv,
//   Users,
//   UtensilsCrossed,
//   VolumeX,
//   Wifi,
// } from "lucide-react";
// import { Separator } from "../ui/separator";
// import { useRouter } from "next/navigation";
// import { Button } from "../ui/button";
// import { differenceInCalendarDays } from "date-fns";
// import { useAuth } from "@clerk/nextjs";
// import useBookRoom from "@/hooks/useBookRoom";
// import moment from "moment";
// import useLocation from "@/hooks/useLocation";
// import { IBooking, IHotel, IRoom } from "@/models/Hotel";

// interface MyBookingClientProps {
//   booking: IBooking & {
//     Hotel: IHotel;
//     Room: IRoom;
//   };
// }

// const MyBookingClient: React.FC<MyBookingClientProps> = ({ booking }) => {
//   const [bookingIsLoading, setBookingIsLoading] = useState(false);
//   const { userId } = useAuth();
//   const router = useRouter();
//   const { setRoomData } = useBookRoom();
//   const { getCountryByCode, getStateByCode } = useLocation();

//   if (!booking?.Hotel || !booking?.Room) {
//     return <div>Loading booking information...</div>;
//   }

//   const { Hotel, Room } = booking;

//   const country = getCountryByCode(Hotel.country);
//   const state = getStateByCode(Hotel.country, Hotel.state);

//   const startDate = moment(booking.startDate).format("YYYY-MM-DD");
//   const endDate = moment(booking.endDate).format("YYYY-MM-DD");

//   const dayCount = differenceInCalendarDays(
//     new Date(booking.endDate),
//     new Date(booking.startDate)
//   );

//   const handleBookRoom = () => {
//     if (!userId) return alert("Please sign in to book a room");
//     if (!Hotel?.userId)
//       return alert("Hotel owner not found. Something went wrong.");

//     setBookingIsLoading(true);

//     const bookingRoomData = {
//       room: Room,
//       totalPrice: booking.totalPrice,
//       breakFastIncluded: booking.breakFastIncluded,
//       startDate: new Date(booking.startDate),
//       endDate: new Date(booking.endDate),
//     };

//     setRoomData(bookingRoomData);

//     fetch("/api/create-payment-intent", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         booking: {
//           hotelOwnerID: Hotel.userId,
//           hotelId: Hotel._id,
//           roomId: Room._id,
//           startDate: bookingRoomData.startDate,
//           endDate: bookingRoomData.endDate,
//           totalPrice: bookingRoomData.totalPrice,
//           breakFastIncluded: bookingRoomData.breakFastIncluded,
//         },
//       }),
//     })
//       .then(async (res) => {
//         if (res.status === 401) return router.push("/sign-in");
//         if (!res.ok) throw new Error(await res.text());
//         return res.json();
//       })
//       .then((data) => {
//         if (!data.authorization_url)
//           throw new Error("No payment URL received");

//         window.location.href = data.authorization_url;
//       })
//       .catch((err) => {
//         console.error("Booking error:", err);
//         setBookingIsLoading(false);
//       });
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>{Hotel.title}</CardTitle>
//         <CardDescription>
//           <div className="font-semibold mt-4">
//             <AmenityItem>
//               <MapPin className="h-4 w-4" /> {country?.name}, {state?.name},{" "}
//               {Hotel.city}
//             </AmenityItem>
//           </div>
//           <p className="py-2">{Hotel.locationDescription}</p>
//         </CardDescription>

//         <CardTitle>{Room.title}</CardTitle>
//         <CardDescription>{Room.description}</CardDescription>
//       </CardHeader>

//       <CardContent className="flex flex-col gap-4">
//         <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
//           {/* <Image
//             fill
//             //src={Room.image}
//             src={booking?.Hotel?.image}
//             alt={booking?.Hotel?.title}
//             className="object-cover"
//             width={300}
//   height={200}
//           /> */}
//         </div>

//         <div className="grid grid-cols-2 gap-4 text-sm">
//           <AmenityItem>
//             <Bed className="h-4 w-4" /> {Room.bedCount} Bed(s)
//           </AmenityItem>
//           <AmenityItem>
//             <Users className="h-4 w-4" /> {Room.guestCount} Guest(s)
//           </AmenityItem>
//           <AmenityItem>
//             <Bath className="h-4 w-4" /> {Room.bathroomCount} Bathroom(s)
//           </AmenityItem>

//           {Room.kingBed > 0 && (
//             <AmenityItem>
//               <BedDouble className="h-4 w-4" /> {Room.kingBed} King Bed(s)
//             </AmenityItem>
//           )}
//           {Room.queenBed > 0 && (
//             <AmenityItem>
//               <BedDouble className="h-4 w-4" /> {Room.queenBed} Queen Bed(s)
//             </AmenityItem>
//           )}

//           {Room.roomService && (
//             <AmenityItem>
//               <UtensilsCrossed className="h-4 w-4" /> Room Service
//             </AmenityItem>
//           )}
//           {Room.TV && (
//             <AmenityItem>
//               <Tv className="h-4 w-4" /> TV
//             </AmenityItem>
//           )}
//           {Room.balcony && (
//             <AmenityItem>
//               <Home className="h-4 w-4" /> Balcony
//             </AmenityItem>
//           )}
//           {Room.freeWifi && (
//             <AmenityItem>
//               <Wifi className="h-4 w-4" /> Free Wifi
//             </AmenityItem>
//           )}

//           {Room.cityView && (
//             <AmenityItem>
//               <Castle className="h-4 w-4" /> City View
//             </AmenityItem>
//           )}
//           {Room.oceanView && (
//             <AmenityItem>
//               <Ship className="h-4 w-4" /> Ocean View
//             </AmenityItem>
//           )}
//           {Room.forestView && (
//             <AmenityItem>
//               <Trees className="h-4 w-4" /> Forest View
//             </AmenityItem>
//           )}
//           {Room.mountainView && (
//             <AmenityItem>
//               <MountainSnow className="h-4 w-4" /> Mountain View
//             </AmenityItem>
//           )}
//           {Room.airCondition && (
//             <AmenityItem>
//               <AirVent className="h-4 w-4" /> Air Conditioning
//             </AmenityItem>
//           )}
//           {Room.soundProofed && (
//             <AmenityItem>
//               <VolumeX className="h-4 w-4" /> Sound Proofed
//             </AmenityItem>
//           )}
//         </div>

//         <Separator />

//         <div className="flex justify-between">
//           <div>
//             Room Price: <span className="font-bold">₦{Room.roomPrice}</span>
//           </div>

//           {Room.breakFastPrice > 0 && (
//             <div>
//               Breakfast:{" "}
//               <span className="font-bold">₦{Room.breakFastPrice}</span>
//             </div>
//           )}
//         </div>

//         <Separator />

//         <CardTitle>Booking Details</CardTitle>
//         <div className="text-primary/90">
//           <div>
//             {/* Room booked by {booking.userName || "a guest"} for {dayCount} days -{" "} */}
//             {moment(booking.bookedAt).fromNow()}
//           </div>
//           <div>Check-in: {startDate} at 5PM</div>
//           <div>Check-out: {endDate} at 5PM</div>
//           {booking.breakFastIncluded && <div>Breakfast will be served</div>}
//           {booking.paymentStatus ? (
//             <div className="text-teal-500">
//               Paid ₦{booking.totalPrice} - Room Reserved
//             </div>
//           ) : (
//             <div className="text-rose-500">
//               Not Paid ₦{booking.totalPrice} - Room Not Reserved
//             </div>
//           )}
//         </div>
//       </CardContent>

//       <CardFooter className="flex gap-4">
//         <Button onClick={() => router.push(`/hotel-details/${Hotel._id}`)}>
//           View Hotel
//         </Button>

//         {!booking.paymentStatus && booking.userId === userId && (
//           <Button onClick={handleBookRoom} disabled={bookingIsLoading}>
//             {bookingIsLoading ? "Processing..." : "Pay Now"}
//           </Button>
//         )}
//       </CardFooter>
//     </Card>
//   );
// };

// export default MyBookingClient;















//my code
"use client";
import React, { useState } from "react";
import { IHotel, IRoom, IBooking } from "@/models/Hotel";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import Image from "next/image";
import AmenityItem from "../AmenityItem";
import {
  AirVent,
  Bath,
  Bed,
  BedDouble,
  Castle,
  Home,
  MapPin,
  MountainSnow,
  Ship,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { differenceInCalendarDays } from "date-fns";
//import { type DateRange } from "react-day-picker";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import moment from "moment";
import useLocation from "@/hooks/useLocation";

interface MyBookingClientProps {
  booking: IBooking & { Room: IRoom | null } & { Hotel: IHotel | null };
}


// type Range = DateRange | undefined;

const MyBookingClient: React.FC<MyBookingClientProps> = ({ booking }) => {
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRoom();
  const { getCountryByCode, getStateByCode } = useLocation();
  const { Hotel, Room } = booking;
  const country = getCountryByCode(Hotel.country);
  const state = getStateByCode(Hotel.country, Hotel.state);
  const startDate = moment(booking.startDate).format("YYYY-MM-DD");
  const endDate = moment(booking.endDate).format("YYYY-MM-DD");
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);





if (!booking.Hotel || !booking.Room) {
  return <div>Loading booking information...</div>;
}

  const handleBookRoom = () => {
    if (!userId) {
      return alert("Please sign in to book a room");
    }

    if (!Hotel?.userId) {
      return alert("Hotel owner not found. Something went wrong.");
    }

    setBookingIsLoading(true);

    const bookingRoomData = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };

    setRoomData(bookingRoomData);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking: {
          hotelOwnerID: Hotel.userId,
          hotelId: Hotel._id,
          roomId: Room._id,
          startDate: bookingRoomData.startDate,
          endDate: bookingRoomData.endDate,
          totalPrice: bookingRoomData.totalPrice,
          breakFastIncluded: bookingRoomData.breakFastIncluded,
        },
      }),
    })
      .then(async (res) => {
        if (res.status === 401) return router.push("/sign-in");
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText || "Booking failed");
        }
        return res.json();
      })
      .then((data) => {
        if (data.authorization_url) {
          window.location.href = data.authorization_url;
          router.push("/book-room");
        } else {
          throw new Error("No payment URL received");
        }
      })
      .catch((err) => {
        console.error("Booking error:", err);
        setBookingIsLoading(false);
      });

    console.log("BOOKING DATA:", bookingRoomData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-4">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name}, {state?.name}, {Hotel.city}
            </AmenityItem>
          </div>
          <p className="py-2 ">{Hotel.locationDescription}</p>
        </CardDescription>
        <CardTitle>{Room?.title}</CardTitle>
        <CardDescription>{Room?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title || "Room Image"}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {Room.bedCount} Bed(s)
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" /> {Room.guestCount} Guest(s)
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" /> {Room.bathroomCount} Bathroom(s)
          </AmenityItem>
          {Room.kingBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.kingBed} King Bed(s)
            </AmenityItem>
          )}
          {Room.queenBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.queenBed} Queen Bed(s)
            </AmenityItem>
          )}
          {Room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" /> Room Service
            </AmenityItem>
          )}
          {Room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" /> TV
            </AmenityItem>
          )}
          {Room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" /> Balcony
            </AmenityItem>
          )}
          {Room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" /> Free Wifi
            </AmenityItem>
          )}
          {Room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" /> City View
            </AmenityItem>
          )}
          {Room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" /> Ocean View
            </AmenityItem>
          )}
          {Room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" /> Forest View
            </AmenityItem>
          )}
          {Room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" /> Mountain View
            </AmenityItem>
          )}
          {Room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" /> Air Conditioning
            </AmenityItem>
          )}
          {Room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" /> Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">₦{Room.roomPrice}</span>
            <span className="text-xs">/24hrs</span>
          </div>
          {Room.breakFastPrice > 0 && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">₦{Room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle>Booking Details</CardTitle>
          <div className="text-primary/90">
            <div>
              {/* Room booked by {booking.userName} for {dayCount} days -{" "} */}
              {moment(booking.bookedAt).fromNow()}
            </div>
            <div>Check-in: {startDate} at 5PM</div>
            <div>Check-out: {endDate} at 5PM</div>
            {booking.breakFastIncluded && <div>Breakfast will be served</div>}
            {booking.paymentStatus ? (
              <div className="text-teal-500">
                Paid ${booking.totalPrice} - Room Reserved
              </div>
            ) : (
              <div className="text-rose-500">
                Not Paid ${booking.totalPrice} - Room Not Reserved
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          disabled={bookingIsLoading}
          variant="outline"
          onClick={() => router.push(`/hotel-details/${Hotel.id}`)}
        >
          View Hotel
        </Button>
        {!booking.paymentStatus && booking.userId === userId && <Button 
          onClick={() => handleBookRoom()} disabled={bookingIsLoading}>Pay Now</Button>} 
      </CardFooter>
    </Card>
  );
};

export default MyBookingClient;
