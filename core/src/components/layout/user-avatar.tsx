'use client';

import { useState } from 'react';
import Image from 'next/image';
// Images
import { UserCircleIcon } from '@heroicons/react/16/solid';

export function UserAvatar({ image }: { image?: string | null }) {
  const [isItemImageError, setIsItemImageError] = useState(false);
  return (
    <div className="avatar">
      <div className="relative h-8 w-8 rounded-full">
        {isItemImageError || !image ? (
          <UserCircleIcon className="h-full w-full" />
        ) : (
          <Image
            src={image}
            alt="Profile Photo"
            fill
            className="object-cover"
            unoptimized={true}
            onError={(_e) => setIsItemImageError(true)}
          />
        )}
      </div>
    </div>
  );
}
