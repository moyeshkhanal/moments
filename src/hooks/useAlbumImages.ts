// src/hooks/useAlbumImages.ts

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface ImageData {
  url: string;
  name: string;
}

export const useAlbumImages = (albumName: string) => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!albumName) return;

    const fetchImages = async () => {
      try {
        const { data, error } = await supabase
          .from('album_photos')
          .select('url, album_name')
          .eq('album_name', albumName);

        if (error) {
          throw error;
        }

        if (data) {
          const imagesData = data.map((row) => ({
            url: row.url,
            name: row.album_name,
          }));
          setImages(imagesData);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [albumName]);

  return { images, loading };
};
