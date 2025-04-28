import { Button } from "@/components/ui/button"

export default function CTA() {
  return (
    <section className="border-t border-gray-200 bg-white">
      <div className="container flex flex-col items-center gap-4 py-24 text-center md:py-32">
        <h2 className="font-bold text-3xl leading-[1.1] sm:text-3xl md:text-5xl text-gray-900">
          Ready to revolutionize your business?
        </h2>
        <p className="max-w-[42rem] leading-normal text-gray-600 sm:text-xl sm:leading-8">
          Join leading companies who trust Amane Soft to drive their digital transformation and stay ahead in the
          rapidly evolving tech landscape.
        </p>
        <Button size="lg" className="mt-4">
          Get Started Today
        </Button>
      </div>
    </section>
  )
}

