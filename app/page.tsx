import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";
import { connection } from 'next/server'

interface HomeProps {
  searchParams?: Promise<{
    title?: string;
    country?: string;
    state?: string;
    city?: string;
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams; 

  const hotels = await getHotels({
    title: params?.title || "",
    country: params?.country || "",
    state: params?.state || "",
    city: params?.city || "",
  });

  if (!hotels || hotels.length === 0) {
    return <div>No hotels found...</div>;
  }
  await connection()

  return (
    <div>
      <HotelList hotels={hotels} />
    </div>
  );
}
