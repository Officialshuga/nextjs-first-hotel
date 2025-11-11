import { getHotelById } from '@/actions/getHotelById'
import HotelDetailsClient from '@/components/hotel/HotelDetailsClient'

interface HotelDetailsProps{
    params: Promise<{
    hotelId: string
  }>
}

const HotelDetails = async ({params}:HotelDetailsProps) => {
    const { hotelId } = await params;
    const hotel = await getHotelById(hotelId);
    //const hotel = await getHotelById(params.hotelId)
    if(!hotel){
        return <div>Hotel with the given Id not found not found</div>
    }
  return (
    <div>
        <HotelDetailsClient hotel={hotel}/>
    </div>
  )
}

export default HotelDetails;