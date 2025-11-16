import AddHotelForm from "@/components/hotel/AddHotelForm"
import { getHotelById } from "@/actions/getHotelById";
import { auth } from "@clerk/nextjs/server";
import { getBookings } from "@/actions/getBookings";

interface HotelPageProps{
  params: {
    hotelId: string;
  }
}

const Hotel = async ({ params }: { params: Promise<{ hotelId: string }> }) => {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);
  const bookings = await getBookings({ hotelId });
  //const { hotelId } = await params;
  //const hotel = await getHotelById(hotelId);
  //const bookings = await getBookings({hotelId: params.hotelId})

  if (!hotel) return <div>Hotel not found...</div>
  const {userId} = await auth()
  if (!userId) return <div>Not Authenticated from ...</div>
  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>
  
  return (
    <div>
      <AddHotelForm hotel={hotel ?? undefined} bookings={bookings ?? undefined}/>
    </div>
  )
}

export default Hotel;