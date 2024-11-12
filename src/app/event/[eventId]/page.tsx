// src/app/event/[eventId]/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { Event } from '@/utils/types';
import { useState, useEffect } from 'react';
import { fetchEventByPath } from '@/helpers/eventHelpers';

export default function EventPage() {
  const params = useParams();
  const eventId = params?.eventId;
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Type narrowing to ensure eventId is a string
    if (typeof eventId === 'string') {
      console.log("Event ID", eventId);
      fetchEventByPath(eventId)
        .then(setEvent)
        .catch((error) => {
          console.error('Error fetching event:', error);
          setEvent(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.error('Invalid eventId:', eventId);
      setEvent(null);
      setLoading(false);
    }
  }, [eventId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!event) {
    return <div className="container mx-auto px-4 py-8">Event not found.</div>;
  }

  return (
    <div className="event-container">
      <h1 className="event-title">{event.title}</h1>
      <p className="event-date">Date: {new Date(event.date).toLocaleDateString()}</p>
      <p className="event-location">Location: {event.location}</p>
      <p className="event-description">{event.description}</p>
      {/* Add more event details as needed */}
    </div>
  );
}
