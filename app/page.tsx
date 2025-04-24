import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import FeaturedProducts from "@/components/Home/fetchFeatured-product";
import ProductLoading from "@/components/Home/loading/productloading";
import TestimonialLoading from "@/components/Home/loading/Testimonialloading";
import TestimonialSection from "@/components/Home/fetchtestimonials";

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[600px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70 z-10" />
        <Image
          src="/herobg.jpg"
          alt="Beautiful living room"
          fill
          className="object-cover"
          priority
        />
        <div className="relative z-20 container mx-auto px-4 h-full flex flex-col justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            Transform Your Space
          </h1>
          <p className="text-xl text-blue-50 max-w-xl mb-8">
            Discover our curated collection of elegant room decor that brings
            harmony and style to your home.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="bg-blue-500 hover:bg-blue-600">
              <Link href="/products">
                Shop Collection <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-blue-900 mb-6">
                About Meka Aesthetics
              </h2>
              <p className="text-blue-700 mb-4">
                Founded in 2022, Meka Aesthetics has been transforming living
                spaces with our thoughtfully designed home accessories and decor
                items.
              </p>
              <p className="text-blue-700 mb-6">
                We believe that your home should reflect your personality and
                style. Our collections are crafted to bring elegance, comfort,
                and a touch of luxury to every corner of your home.
              </p>
              <Button asChild className="bg-blue-700 hover:bg-blue-800">
                <Link href="/contact">contact</Link>
              </Button>
            </div>
            <div className="md:w-1/2 relative h-[400px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="/showroom.jpg"
                alt="Our showroom"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <Suspense fallback={<ProductLoading />}>
        <FeaturedProducts />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={<TestimonialLoading />}>
        <TestimonialSection />,
      </Suspense>

      {/* CTA Section - Now matching the hero section gradient */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-blue-700/70" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl font-bold mb-6 text-white">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Join thousands of satisfied customers who have elevated their homes
            with our premium decor collections.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-white text-blue-800 hover:bg-blue-50"
          >
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
