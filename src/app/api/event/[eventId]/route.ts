// src/app/api/event/[eventId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { Album } from '@/utils/types';

export async function GET(request: NextRequest) {
  // Extract the eventId from the URL
  const { pathname } = request.nextUrl;
  const segments = pathname.split('/');
  const eventId = segments[segments.length - 1]; // Should be 'cf6979fe-365a-4bcb-965f-6c11b748a062'

  console.log("API GET eventId:", eventId);

  if (!eventId) {
    console.error('No eventId provided');
    return NextResponse.json({ error: 'Event ID not provided' }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', eventId)
      .single();

    console.log('Supabase Data:', data);
    console.log('Supabase Error:', error);

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      console.warn('No data found for eventId:', eventId);
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    fetchAlbumsForEvent(eventId);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function fetchAlbumsForEvent(eventName: string): Promise<Album[]> {
  const { data, error } = await supabase
    .from('albums')
    .select('*')
    .eq('event_id', eventName); // Assuming your column is named 'event_name'

  if (error) {
    console.error('Error fetching albums:', error.message);
    throw new Error('Failed to fetch albums');
  }

  console.log("Albums:", data)

  return data || [];
}