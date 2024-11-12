// src/types/event.ts
export interface Event {
    id: string;
    title: string;
    description: string;
    date: string;
    location: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Album {
    id: string;
    event_id: string;
    title: string;
    description: string;
    created_at: string;
    updated_at: string;
    photos?: Photo[];
  }
  
  export interface Photo {
    id: string;
    album_id: string;
    url: string;
    caption?: string;
    created_at: string;
  }
  
  export type ApiResponse<T> = {
    data: T | null;
    error?: string;
  };