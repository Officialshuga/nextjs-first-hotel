"use client";

import React from "react";

const BookRoom = () => {
  const [bookings, setBookings] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch("/api/booking");

        if (!response.ok) {
          throw new Error("Failed to fetch bookings");
        }

        const data = await response.json();

        console.log("BOOKINGS:", data.bookings);

        setBookings(data.bookings || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1 className="text-xl font-bold">Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        bookings.map((booking: any) => (
          <div
            key={booking._id}
            className="p-3 border rounded mb-2 shadow-sm"
          >
            <p><strong>Hotel:</strong> {booking.hotelId}</p>
            <p><strong>User:</strong> {booking.userId}</p>
            <p><strong>Start Date:</strong> {new Date(booking.startDate).toDateString()}</p>
            <p><strong>End Date:</strong> {new Date(booking.endDate).toDateString()}</p>
            <p><strong>Status:</strong> {booking.paymentStatus}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default BookRoom;



// "use client";

// import { useEffect, useState } from "react";
// import { useUser } from "@clerk/nextjs";

// export default function BookRoomPage() {
//   const { user } = useUser();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchBookings = async () => {
//       try {
//         // ✅ Correct fetch URL
//         const response = await fetch("/api/book-room", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         });

//         if (!response.ok) {
//           throw new Error("Failed to fetch bookings");
//         }

//         const data = await response.json();
//         setBookings(data.bookings || []);
//       } catch (err: any) {
//         console.error("Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user) {
//       fetchBookings();
//     }
//   }, [user]);

//   if (loading) {
//     return <div className="p-8">Loading your bookings...</div>;
//   }

//   if (error) {
//     return <div className="p-8 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
//       {bookings.length === 0 ? (
//         <p>No bookings found</p>
//       ) : (
//         <div className="space-y-4">
//           {bookings.map((booking: any) => (
//             <div key={booking._id} className="border p-4 rounded-lg">
//               <h3 className="font-semibold">{booking.Hotel?.title}</h3>
//               <p>Room: {booking.Room?.title}</p>
//               <p>Total: ₦{booking.totalPrice}</p>
//               <p>Status: {booking.paymentStatus ? "Paid" : "Pending"}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
