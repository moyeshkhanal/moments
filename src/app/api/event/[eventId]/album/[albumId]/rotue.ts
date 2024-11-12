import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { eventId: string; albumId: string } }) {
  const { eventId, albumId } = params;
  // Fetch album data using eventId and albumId
  return NextResponse.json({ message: `Album ${albumId} of Event ${eventId} data` });
}

export async function POST(request: Request, { params }: { params: { eventId: string; albumId: string } }) {
  const { eventId, albumId } = params;
  // Handle album update or other operations for albumId within eventId
  return NextResponse.json({ message: `Album ${albumId} of Event ${eventId} created/updated` });
}
