"use client"

import { useEffect, useRef } from "react"

export const useSmoothScroll = () => {
  const lenisRef = useRef<any>(null)

  useEffect(() => {
    // Dynamic import of Lenis to avoid SSR issues
    const initSmoothScrolling = async () => {
      const { default: Lenis } = await import("@/utils/lenis.min.js")

      // Initialize Lenis for smooth scroll effects
      lenisRef.current = new Lenis({ lerp: 0.1 })

      // Ensure GSAP animations are in sync with Lenis' scroll frame updates
      const gsapTickerHandler = (time: number) => {
        lenisRef.current.raf(time * 1000) // Convert GSAP's time to milliseconds for Lenis
      }

      // Import GSAP dynamically
      const { gsap } = await import("gsap")
      gsap.ticker.add(gsapTickerHandler)
      gsap.ticker.lagSmoothing(0) // Turn off GSAP's default lag smoothing

      return () => {
        gsap.ticker.remove(gsapTickerHandler)
        lenisRef.current.destroy()
      }
    }

    const cleanup = initSmoothScrolling()

    return () => {
      cleanup.then((cleanupFn) => cleanupFn && cleanupFn())
    }
  }, [])

  return lenisRef
}
