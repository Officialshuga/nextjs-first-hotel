import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Hotel from '@/models/Hotel';


export async function GET() {
  try {
    await dbConnect();

    const hotelCount: number = await Hotel.countDocuments({});

    return NextResponse.json({
      success: true,
      message: 'MongoDB connection successful and query executed.',
      hotels_found: hotelCount,
    });
  } catch (error) {
    console.error('Database Connection Test Failed:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed at runtime. Check the MONGODB_URI and console logs.',
        error: error instanceof Error ? error.message : 'An unknown error occurred.',
      },
      { status: 500 }
    );
  }
}
