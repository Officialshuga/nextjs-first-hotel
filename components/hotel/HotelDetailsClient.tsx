"use client"
import { IBooking } from "@/models/Hotel"
import { HotelWithRooms } from "./AddHotelForm"
import useLocation from "@/hooks/useLocation"
import Image from "next/image"
import AmenityItem from "../AmenityItem"
import { Car, Clapperboard, MapPin, ShoppingBasket, Utensils, Waves } from "lucide-react"
import { FaCoffee, FaSpa, FaSwimmer } from "react-icons/fa"
import {MdDryCleaning} from "react-icons/md"
import RoomCard from "../room/RoomCard"



const HotelDetailsClient = ({hotel, bookings}: {hotel: HotelWithRooms, bookings?: IBooking[]}) => {
  const {getCountryByCode, getStateByCode} = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);
  return (
    <div className="flex flex-col gap-6 pb-2">
      <div className="aspect-square overflow-hidden relative w-full h-[200px] md:h-[400px] rounded-lg">
        <Image src={hotel.image} alt={hotel.title} fill className="object-contain" />
      </div>
      <div>
        <h3 className="font-semibold text-xl md:text-3xl">{hotel.title}</h3>
        <div className="font-semibold mt-4">
          <AmenityItem><MapPin className="h-4 w-4"/>{country?.name}, {state?.name}, {hotel.city}</AmenityItem>
        </div>
        <h3 className="font-semibold text-lg mt-4 mb-2">Location Details</h3>
        <p className="text-primare/90 mb-2">{hotel.locationDescription}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">About this hotel</h3>
        <p className="text-primare/90 mb-2">{hotel.description}</p>
        <h3 className="font-semibold text-lg mt-4 mb-2">Popular Amenities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 content-start text-sm">
          {hotel.swimmingPool && <AmenityItem> <FaSwimmer/> Swimming Pool</AmenityItem>}
          {hotel.gym && <AmenityItem> <Waves/> Gym</AmenityItem>}
          {hotel.spa && <AmenityItem> <FaSpa/> Spa</AmenityItem>}
          {hotel.laundry && <AmenityItem> <MdDryCleaning /> Laundry</AmenityItem>}
          {hotel.restaurant && <AmenityItem> <Utensils/> Restaurant</AmenityItem>}
          {hotel.shopping && <AmenityItem> <ShoppingBasket/>  Shopping</AmenityItem>}
          {hotel.freeParking && <AmenityItem> <Car/> Free Parking</AmenityItem>}
          {hotel.movieNights && <AmenityItem> <Clapperboard/> Movie Nights</AmenityItem>}
          {hotel.coffeShop && <AmenityItem> <FaCoffee/> Coffee Shop</AmenityItem>}
        </div>
      </div>
      <div>
        {!!hotel.rooms.length && <div>
          <h3 className="font-semibold text-lg my-4"> Hotel Rooms</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {hotel.rooms.map((room)=>{
              return <RoomCard bookings={bookings} hotel={hotel} key={room._id} room={room}/>
            })}
          </div>
          </div>}
      </div>
    </div>
  )
}

export default HotelDetailsClient