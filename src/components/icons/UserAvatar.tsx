// src/components/UserAvatar.tsx
import Image from 'next/image'

interface UserAvatarProps {
  imageUrl?: string
  size?: number
}

export function UserAvatar({ imageUrl, size = 50 }: UserAvatarProps) {
  return (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt="User Avatar"
          width={size}
          height={size}
          className="rounded-full"
        />
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={size * 0.6}
          height={size * 0.6}
          fill="currentColor"
          viewBox="0 0 24 24"
          style={{ color: '#888' }}
        >
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
        </svg>
      )}
    </>
  )
}
