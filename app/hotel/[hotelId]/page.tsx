import AddHotelForm from "@/components/hotel/AddHotelForm"
import { getHotelById } from "@/actions/getHotelById";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProps{
  params: {
    hotelId: string;
  }
}

const Hotel = async ({ params }: { params: Promise<{ hotelId: string }> }) => {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);

  const {userId} = await auth()
  if (!userId) return <div>Not Authenticated...</div>
  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>
  
  return (
    <div>
      <AddHotelForm hotel={hotel ?? undefined} />
    </div>
  )
}

export default Hotel;