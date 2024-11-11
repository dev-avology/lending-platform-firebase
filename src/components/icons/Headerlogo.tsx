import Image from 'next/image'

export function HeaderLogo({ width = 150, height = 150 }) {
  return (
    <Image
      src="/asset/NC_logo.png"
      alt="Company Logo"
      width={width}
      height={height}
      className="h-14 w-auto"
    />
  )
}
