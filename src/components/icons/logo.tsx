import Image from 'next/image'

export function Logo() {
  return (
    <Image
      src="/asset/NC_logo.png"
      alt="Company Logo"
      width={150}
      height={150}
      className="h-150 w-150"
    />
  )
}