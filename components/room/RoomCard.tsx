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
  Loader2,
  MountainSnow,
  Pencil,
  Ship,
  Trash,
  Trees,
  Tv,
  Users,
  UtensilsCrossed,
  VolumeX,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import AddRoomForm from "./AddRoomForm";
import axios from "axios";
import DateRangePicker from "./DateRangePicker";
import { differenceInCalendarDays, eachDayOfInterval } from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { type DateRange } from "react-day-picker";
import { useAuth } from "@clerk/nextjs";
import useBookRoom from "@/hooks/useBookRoom";
import { useUser } from "@clerk/nextjs";




interface RoomCardProps {
  hotel?: IHotel & {
    rooms: IRoom[];
  };
  room: IRoom;
  bookings?: IBooking[];
}

type Range = DateRange | undefined;

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [internalRange, setInternalRange] = React.useState<Range>(undefined);
  const [totalPrice, setTotalPrice] = React.useState(room.roomPrice);
  const pathname = usePathname();
  const router = useRouter();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const [includeBreakfast, setIncludeBreakfast] = React.useState(false);
  const [days, setDays] = useState(0);
  const [bookingIsLoading, setBookingIsLoading] = React.useState(false);
  const { userId } = useAuth();
  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } = useBookRoom();
  const { user } = useUser();

  React.useEffect(() => {
    if (internalRange?.from && internalRange?.to) {
      const dayCount = differenceInCalendarDays(
        internalRange.to,
        internalRange.from
      );

      setDays(dayCount);

      if (dayCount > 0) {
        let baseCost = dayCount * room.roomPrice;

        if (includeBreakfast && room.breakFastPrice > 0) {
          baseCost += dayCount * room.breakFastPrice;
        }

        setTotalPrice(baseCost);
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [internalRange, includeBreakfast, room]);


  const disabledDates = React.useMemo(()=>{
    let dates: Date[] = []
    const roomBookings = bookings.filter((booking)=> booking.roomId === room._id)
    roomBookings.forEach((booking)=>{
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate)
      })
      dates = [...range, ...dates]
      // return dates
    })
    return dates
  }, [bookings])


  const handleDialogueOpen = () => {
    setOpen((prev) => !prev);
  };

  const handleRoomDelete = (room: IRoom) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", { imageKey }, { withCredentials: true })
      .then(() => {
        axios
          .delete(`/api/room/${room._id}`, { withCredentials: true })
          .then(() => {
            router.refresh();
            alert("ROOM DELETED");
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            alert("SOMETHING WENT WRONG");
          });
      })
      .catch(() => {
        setIsLoading(false);
        alert("SOMETHING WENT WRONG");
      });
  };

  const handleBookRoom = () => {
    if (!userId) {
      return alert("Please sign in to book a room");
    }

    if (!hotel?.userId) {
      return alert("Hotel owner not found. Something went wrong.");
    }

    if (!internalRange?.from || !internalRange?.to) {
      return alert("Please select a date range before booking.");
    }

    setBookingIsLoading(true);

    const bookingRoomData = {
      room,
      totalPrice,
      breakFastIncluded: includeBreakfast,
      startDate: internalRange.from,
      endDate: internalRange.to,
    };
    setRoomData(bookingRoomData);
    fetch("/api/book-room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        booking: {
          hotelOwnerID: hotel.userId,
          hotelId: hotel._id,
          roomId: room._id,
          startDate: internalRange.from,
          endDate: internalRange.to,
          totalPrice: totalPrice,
          breakFastIncluded: includeBreakfast,
        },
        userEmail: user?.emailAddresses[0]?.emailAddress,
        userName: user?.firstName,
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
          router.push("/book-room")
        } else {
          throw new Error("No payment URL received");
        }
      })
      .catch((err) => {
        console.error("Booking error:", err);
        setBookingIsLoading(false);
      });
      
    console.log("BOOKING DATA:", bookingRoomData);



//   const bookingRoomData = {
//   room,
//   totalPrice,
//   breakFastIncluded: includeBreakfast,
//   startDate: internalRange.from,
//   endDate: internalRange.to,
// };
// setRoomData(bookingRoomData);

// fetch("/api/book-room", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     booking: {
//       hotelOwnerID: hotel.userId,
//       hotelId: hotel._id,
//       roomId: room._id,
//       startDate: internalRange.from,
//       endDate: internalRange.to,
//       totalPrice: totalPrice,
//       breakFastIncluded: includeBreakfast,
//     },
//     userEmail: user?.emailAddresses[0]?.emailAddress,
//     userName: user?.firstName,
//   }),
// })
//   .then(async (res) => {
//     if (res.status === 401) return router.push("/sign-in");
//     if (!res.ok) {
//       const errorText = await res.text();
//       throw new Error(errorText || "Booking failed");
//     }
//     return res.json();
//   })
//   .then((data) => {
//     if (data.authorization_url) {
//       // ✅ Just redirect to Paystack - they'll handle the rest
//       window.location.href = data.authorization_url;
//     } else {
//       throw new Error("No payment URL received");
//     }
//   })
//   .catch((err) => {
//     console.error("Booking error:", err);
//     setBookingIsLoading(false);
//   });

// console.log("BOOKING DATA:", bookingRoomData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room?.title}</CardTitle>
        <CardDescription>{room?.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 content-start text-sm">
          <AmenityItem>
            <Bed className="h-4 w-4" /> {room.bedCount} Bed(s)
          </AmenityItem>
          <AmenityItem>
            <Users className="h-4 w-4" /> {room.guestCount} Guest(s)
          </AmenityItem>
          <AmenityItem>
            <Bath className="h-4 w-4" /> {room.bathroomCount} Bathroom(s)
          </AmenityItem>
          {room.kingBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed(s)
            </AmenityItem>
          )}
          {room.queenBed > 0 && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.queenBed} Queen Bed(s)
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <UtensilsCrossed className="h-4 w-4" /> Room Service
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Tv className="h-4 w-4" /> TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" /> Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" /> Free Wifi
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <Castle className="h-4 w-4" /> City View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" /> Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" /> Forest View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <MountainSnow className="h-4 w-4" /> Mountain View
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" /> Air Conditioning
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <VolumeX className="h-4 w-4" /> Sound Proofed
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex gap-4 justify-between">
          <div>
            Room Price: <span className="font-bold">₦{room.roomPrice}</span>
            <span className="text-xs">/24hrs</span>
          </div>
          {room.breakFastPrice > 0 && (
            <div>
              Breakfast Price:{" "}
              <span className="font-bold">₦{room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div className="flex flex-col gap-6">
            <div>
              <div className="mb-2">
                Select days you will spend in this room
              </div>
              <DateRangePicker
                disabledDates={disabledDates}
                setInternalRange={setInternalRange}
                internalRange={internalRange}
              />
            </div>
            {room.breakFastPrice > 0 && (
              <div>
                <div className="mb-2">
                  {" "}
                  Do you want to be served Breakfast each Day
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="breakfast"
                    onCheckedChange={(checked) =>
                      setIncludeBreakfast(!!checked)
                    }
                  />
                  <label htmlFor="breakFast" className="text-sm">
                    Include BreakFast
                  </label>
                </div>
              </div>
            )}
            <div>
              Total Price: <span className="font-bold">₦{totalPrice}</span> for{" "}
              <span className="font-bold">{days} Days </span>
            </div>
            <Button
              onClick={() => handleBookRoom()}
              disabled={bookingIsLoading}
              type="button"
            >
              {bookingIsLoading ? (
                <Loader2 className="mr-2 h-4 w-4" />
              ) : (
                <Wand2 className="mr-2 h-4 w-4" />
              )}
              {bookingIsLoading ? "Loading..." : "Book Room"}
            </Button>
          </div>
        ) : (
          <div className="flex w-full justify-between">
            <Button
              disabled={isLoading}
              type="button"
              variant="ghost"
              onClick={() => handleRoomDelete(room)}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...
                </>
              ) : (
                <>
                  <Trash className="mr-2 h-4 w-4" /> Delete
                </>
              )}
            </Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="max-w-[150px]"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Update Room
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[900px] w-[90%]">
                <DialogHeader className="px-2">
                  <DialogTitle>Update Room</DialogTitle>
                  <DialogDescription>
                    Make changes to this room
                  </DialogDescription>
                </DialogHeader>
                <AddRoomForm
                  hotel={hotel}
                  room={room}
                  handleDialogueOpen={handleDialogueOpen}
                />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
