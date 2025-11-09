"use client"

import { IBooking } from "@/models/Hotel"
import { HotelWithRooms } from "./AddHotelForm"


const HotelDetailsClient = ({hotel, bookings}: {hotel: HotelWithRooms, bookings?: IBooking[]}) => {
  return (
    <div>HotelDetailsClient</div>
  )
}

export default HotelDetailsClient