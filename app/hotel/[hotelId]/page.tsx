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
  //const hotel = await getHotelById(hotelId);
  const bookings = await getBookings({ hotelId });

  let hotel = null;

  if (hotelId !== "new") {
    try {
      hotel = await getHotelById(hotelId);
    } catch (err) {
      console.error("Error fetching hotel:", err);
      hotel = null;
    }
  }


  // if (hotel) return <div>Hotel not found...</div>
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



// import AddHotelForm from "@/components/hotel/AddHotelForm";
// import { getHotelById } from "@/actions/getHotelById";
// //import { getBookings } from "@/actions/getBookings";

// interface HotelPageProps {
//   params: { hotelId: string };
// }

// export default async function Hotel({ params }: HotelPageProps) {
//   const { hotelId } = params;

//   let hotel = null;

//  // const bookings = await getBookings({ hotelId });
//   if (hotelId !== "new") {
//     try {
//       hotel = await getHotelById(hotelId);
//     } catch (err) {
//       console.error("Error fetching hotel:", err);
//       hotel = null;
//     }
//   }

//   return (
//     <div>
//       {/* <AddHotelForm hotel={hotel ?? undefined} bookings={bookings ?? undefined}/> */}
//       <AddHotelForm hotel={hotel ?? undefined} />
//     </div>
//   );
// }
