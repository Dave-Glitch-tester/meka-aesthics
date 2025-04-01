"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import LoadingSpinner from "./loading-spinner"

interface Review {
  id: string
  productId: string
  productName: string
  userName: string
  userRole: string
  content: string
  rating: number
  avatar: string
}

export default function TestimonialSection() {
  const [testimonials, setTestimonials] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const carouselRef = useRef<HTMLDivElement>(null)

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch("/api/reviews?featured=true")
        if (!response.ok) throw new Error("Failed to fetch testimonials")
        const data = await response.json()

        // Get the reviews with highest ratings
        const topReviews = data.sort((a: Review, b: Review) => b.rating - a.rating).slice(0, 6)

        setTestimonials(topReviews)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  // Auto-slide functionality
  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
  }, [testimonials.length])

  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Set up auto-sliding
  useEffect(() => {
    if (testimonials.length > 0) {
      timerRef.current = setInterval(() => {
        nextSlide()
      }, 5000) // Change slide every 5 seconds
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [testimonials.length, nextSlide])

  // Pause auto-sliding when hovering over carousel
  const pauseAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  const resumeAutoSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    timerRef.current = setInterval(() => {
      nextSlide()
    }, 5000)
  }

  if (loading) {
    return (
      <section className="py-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-blue-900 mb-6 text-center">What Our Customers Say</h2>
          <div className="flex justify-center mb-8">
            <LoadingSpinner size={40} />
          </div>
          <p className="text-center text-blue-700 mb-8">Loading customer reviews...</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="bg-white border-blue-100 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4 animate-pulse">
                    <div className="h-5 bg-blue-100 w-24 rounded"></div>
                  </div>
                  <div className="h-24 bg-blue-100 rounded mb-6 animate-pulse"></div>
                  <div className="flex items-center">
                    <div className="h-12 w-12 rounded-full bg-blue-100 animate-pulse mr-4"></div>
                    <div>
                      <div className="h-4 bg-blue-100 rounded w-24 mb-2 animate-pulse"></div>
                      <div className="h-3 bg-blue-100 rounded w-16 animate-pulse"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (testimonials.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-blue-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-blue-900 mb-12 text-center">What Our Customers Say</h2>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={pauseAutoSlide}
          onMouseLeave={resumeAutoSlide}
          ref={carouselRef}
        >
          {/* Carousel Controls */}
          <div className="absolute inset-y-0 left-0 flex items-center -ml-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md text-blue-700 hover:text-blue-900 hover:bg-blue-50"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center -mr-4 z-10">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full bg-white shadow-md text-blue-700 hover:text-blue-900 hover:bg-blue-50"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>

          {/* Carousel Slides */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <Card className="bg-white border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < testimonial.rating ? "fill-blue-500 text-blue-500" : "fill-gray-200 text-gray-200"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-blue-700 mb-6 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                          <Image
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.userName}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-blue-900">{testimonial.userName}</h4>
                          <p className="text-sm text-blue-600">{testimonial.userRole}</p>
                          <Link
                            href={`/products/${testimonial.productId}`}
                            className="text-xs text-blue-500 hover:underline mt-1 inline-block"
                          >
                            Review for: {testimonial.productName}
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  activeIndex === index ? "w-8 bg-blue-600" : "w-2 bg-blue-300"
                }`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

