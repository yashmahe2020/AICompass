import Image from "next/image"

export default function ProductPreview() {
  return (
    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <div className="relative rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-400/10 via-yellow-500/10 to-transparent" />
        <Image
          src="/ai-compass-preview.jpg"
          alt="AI Compass Interface"
          width={1200}
          height={800}
          className="w-full h-auto"
        />
      </div>
      {/* Glow effect */}
      <div className="absolute -inset-x-20 top-0 h-[500px] bg-yellow-500/5 opacity-30 blur-3xl" />
    </div>
  )
}

