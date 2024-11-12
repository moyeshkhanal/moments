// src/pages/event/[eventId]/album/[albumId].tsx
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { Album } from '@/utils/types';

interface Props {
  album: Album;
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    const res = await fetch(
      `/api/event/${params?.eventId}/album/${params?.albumId}`
    );
    const { data, error } = await res.json();

    if (error || !data) {
      return { notFound: true };
    }

    return {
      props: {
        album: data,
      },
    };
  } catch (error) {
    return { notFound: true };
  }
};

export default function AlbumPage({ album }: Props) {
  const router = useRouter();

  if (router.isFallback) {
    return <AlbumSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
     
        </div>

        
  );
}

function AlbumSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="animate-pulse">
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="mt-4 h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-200 rounded-lg"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}