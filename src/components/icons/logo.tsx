import Image from 'next/image'

export function Logo({ width = 150, height = 150 }) {
  return (
    <Image
      src="/asset/NC_logo.png"
      alt="Company Logo"
      width={width}
      height={height}
      className={`h-${height} w-${width}`}
    />
  )
}
