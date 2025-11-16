import { getBookingsByHotelOwnerId } from '@/actions/getBookingsByHotelOwnerId'
import { getBookingsByUserId } from '@/actions/getBookingsByUserId';
import MyBookingClient from '@/components/booking/MyBookingsClient';
import React from 'react'

const MyBookings = async() => {
    const bookingsFromVisitors = await getBookingsByHotelOwnerId();
    const bookingsIHaveMade = await getBookingsByUserId(); 
    if(!bookingsFromVisitors && !bookingsIHaveMade) return <div>No Bookings Found</div>
  return (
    <div className='flex flex-col gap-10'>
        {!!bookingsIHaveMade?.length && <div>
            <h2 className='text-xl md:text-2xl font-semibold mb-6 mt-2'>Here are bookings you have made</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'> 
                {bookingsIHaveMade.map((booking: any) => <MyBookingClient key={booking._id} booking={booking} />)}
            </div>
         </div>
        } 

        {!!bookingsFromVisitors?.length && <div>
        <h2 className='text-xl md:text-2xl font-semibold mb-6 mt-2'>Here are bookings Visitors have made on your Properties</h2>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'> 
            {bookingsFromVisitors.map((booking: any) => <MyBookingClient key={booking._id} booking={booking} />)}
        </div>
        </div>}
    </div>
  )
}

export default MyBookings

// import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
// import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
// import MyBookingClient from "@/components/booking/MyBookingsClient";
// //import React from "react";

// const MyBookings = async () => {
//   const bookingsFromVisitors = await getBookingsByHotelOwnerId();
//   const bookingsIHaveMade = await getBookingsByUserId();

//   const hasMyBookings = bookingsIHaveMade && bookingsIHaveMade.length > 0;
//   const hasVisitorBookings =
//     bookingsFromVisitors && bookingsFromVisitors.length > 0;

//   return (
//     <div className="flex flex-col gap-10">
//       Bookings I have made
//       {hasMyBookings && (
//         <div>
//           <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
//             Here are bookings you have made
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {bookingsIHaveMade!.map((booking) => (
//               <MyBookingClient key={booking._id} booking={booking} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Bookings visitors made on my hotels */}
//       {hasVisitorBookings && (
//         <div>
//           <h2 className="text-xl md:text-2xl font-semibold mb-6 mt-2">
//             Here are bookings visitors have made on your properties
//           </h2>

//           <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
//             {bookingsFromVisitors!.map((booking) => (
//               <MyBookingClient key={booking._id} booking={booking} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Show empty state if no bookings at all */}
//       {!hasMyBookings && !hasVisitorBookings && (
//         <div className="text-center py-10 text-gray-500">
//           <h2 className="text-xl font-semibold">No bookings found</h2>
//           <p>You have not made any bookings yet, and no one has booked your properties.</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyBookings;
