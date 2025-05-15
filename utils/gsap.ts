"use client"

// This file is a wrapper for GSAP to ensure it's only imported on the client side
// and to provide a consistent API for using GSAP throughout the application

import { useEffect } from "react"

// Export a function to dynamically import GSAP
export const loadGSAP = async () => {
  // Dynamic import to avoid SSR issues
  const gsapModule = await import("gsap")
  return gsapModule
}

// Custom hook to use GSAP in components
export const useGSAP = (callback: (gsap: any) => void | (() => void), deps: any[] = []) => {
  useEffect(() => {
    let cleanup: (() => void) | void

    const initGSAP = async () => {
      const { gsap } = await loadGSAP()
      cleanup = callback(gsap)
    }

    initGSAP()

    return () => {
      if (typeof cleanup === "function") {
        cleanup()
      }
    }
  }, deps)
}
