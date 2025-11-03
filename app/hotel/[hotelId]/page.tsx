import AddHotelForm from "@/components/hotel/AddHotelForm"
import { getHotelById } from "@/actions/getHotelById";
import { auth } from "@clerk/nextjs/server";

interface HotelPageProps{
  params: {
    hotelId: string;
  }
}

// const Hotel = async ({params}: HotelPageProps) => {unlock when i run server
const Hotel = async ({ params }: { params: Promise<{ hotelId: string }> }) => {
  const { hotelId } = await params;
  const hotel = await getHotelById(hotelId);

  const {userId} = await auth()
  if (!userId) return <div>Not Authenticated...</div>
  if (hotel && hotel.userId !== userId) return <div>Access denied...</div>


  // const { hotelId } =  await params;unlock when i run server
  
  // const { userId } = await auth();
  // if(!userId) return <div>Unauthorized</div>;
  // Check if creating new hotel
  // if (hotelId === 'new') {unlock when i run server
  //   return (unlock when i run server
  //     <div>unlock when i run server
  //       <AddHotelForm /> unlock when i run server
  //     </div>unlock when i run server
  //   );unlock when i run server
  // }unlock when i run server
  
  // Fetch existing hotel
  // const hotel = await getHotelById(hotelId);unlock when i run server
  
  //if(!hotel) return <div>Hotel not found</div>;
  //if(hotel.userId !== userId) return <div>Access denied</div>;
  
  return (
    <div>
      <AddHotelForm hotel={hotel} />
    </div>
  )
}

export default Hotel;