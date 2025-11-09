import Hotel from "@/models/Hotel";
import dbConnect from "@/lib/dbConnect";

export const getHotels = async (searchParams: any) => {
  try {
    await dbConnect();
    const { title, country, state, city } = searchParams;

    const query: any = {};

    if (title) query.title = { $regex: title, $options: "i" };
    if (country) query.country = country;
    if (state) query.state = state;
    if (city) query.city = city;

    const hotels = await Hotel.find(query).populate("rooms").lean();

    return JSON.parse(JSON.stringify(hotels)); 

  } catch (error: any) {
    console.log("Error in getHotels:", error);
    throw new Error(error.message || "Failed to fetch hotels");
  }
};
