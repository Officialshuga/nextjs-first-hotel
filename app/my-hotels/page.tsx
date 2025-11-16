import { getHotelByUserId } from '@/actions/getHotelsByUserId';
import HotelList from '@/components/hotel/HotelList';

const myHotels = async () => {
  const hotels = await getHotelByUserId();

  if (!hotels || hotels.length === 0) {
    return (
      <div>
        <h2>No hotels found</h2>
      </div>
    );
  }

  return (
    <div>
      <h2>Here are your Properties</h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default myHotels;
