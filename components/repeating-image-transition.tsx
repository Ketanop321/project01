"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import gsap from "gsap"

interface RepeatingImageTransitionProps {
  isActive: boolean
  sourceElement: HTMLElement | null
  targetElement: HTMLElement | null
  onTransitionComplete?: () => void
  config?: {
    steps?: number
    stepDuration?: number
    stepInterval?: number
    rotationRange?: number
    wobbleStrength?: number
    clipPathDirection?: string
    moverPauseBeforeExit?: number
    moverEnterEase?: string
    moverExitEase?: string
    pathMotion?: string
    sineAmplitude?: number
    sineFrequency?: number
    moverBlendMode?: string
  }
}

const RepeatingImageTransition: React.FC<RepeatingImageTransitionProps> = ({
  isActive,
  sourceElement,
  targetElement,
  onTransitionComplete,
  config = {},
}) => {
  // Store references to created movers for cleanup
  const moversRef = useRef<HTMLElement[]>([])
  const timelineRef = useRef<gsap.core.Timeline | null>(null)

  // Default configuration
  const {
    steps = 6,
    stepDuration = 0.35,
    stepInterval = 0.05,
    rotationRange = 0,
    wobbleStrength = 0,
    clipPathDirection = "top-bottom",
    moverPauseBeforeExit = 0.14,
    moverEnterEase = "sine.in",
    moverExitEase = "sine",
    pathMotion = "linear",
    sineAmplitude = 50,
    sineFrequency = Math.PI,
    moverBlendMode = "",
  } = config

  // Linear interpolation helper
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t

  // Get appropriate clip-paths depending on animation direction
  const getClipPathsForDirection = (direction: string) => {
    switch (direction) {
      case "bottom-top":
        return {
          from: "inset(0% 0% 100% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(100% 0% 0% 0%)",
        }
      case "left-right":
        return {
          from: "inset(0% 100% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 0% 0% 100%)",
        }
      case "right-left":
        return {
          from: "inset(0% 0% 0% 100%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 100% 0% 0%)",
        }
      case "top-bottom":
      default:
        return {
          from: "inset(100% 0% 0% 0%)",
          reveal: "inset(0% 0% 0% 0%)",
          hide: "inset(0% 0% 100% 0%)",
        }
    }
  }

  // Generate motion path between start and end elements
  const generateMotionPath = (startRect: DOMRect, endRect: DOMRect, steps: number) => {
    const path = []
    const fullSteps = steps + 2 // Add extra steps for smoother transition
    const startCenter = {
      x: startRect.left + startRect.width / 2,
      y: startRect.top + startRect.height / 2,
    }
    const endCenter = {
      x: endRect.left + endRect.width / 2,
      y: endRect.top + endRect.height / 2,
    }

    for (let i = 0; i < fullSteps; i++) {
      const t = i / (fullSteps - 1)
      const width = lerp(startRect.width, endRect.width, t)
      const height = lerp(startRect.height, endRect.height, t)

      // Calculate base position
      let centerX = lerp(startCenter.x, endCenter.x, t)
      let centerY = lerp(startCenter.y, endCenter.y, t)

      // Apply sine motion if configured
      if (pathMotion === "sine") {
        const sineOffset = Math.sin(t * sineFrequency) * sineAmplitude

        // Apply offset based on direction
        if (clipPathDirection === "left-right" || clipPathDirection === "right-left") {
          centerY += sineOffset
        } else {
          centerX += sineOffset
        }
      }

      // Add random wobble for more organic movement
      const wobbleX = (Math.random() - 0.5) * wobbleStrength
      const wobbleY = (Math.random() - 0.5) * wobbleStrength

      path.push({
        left: centerX - width / 2 + wobbleX,
        top: centerY - height / 2 + wobbleY,
        width,
        height,
      })
    }

    // Return only the intermediate steps (remove first and last)
    return path.slice(1, -1)
  }

  // Clean up any existing movers
  const cleanupMovers = () => {
    if (timelineRef.current) {
      timelineRef.current.kill()
      timelineRef.current = null
    }

    moversRef.current.forEach((mover) => {
      if (mover.parentNode) {
        mover.parentNode.removeChild(mover)
      }
    })
    moversRef.current = []
  }

  // Create and animate the transition
  const createTransition = () => {
    if (!sourceElement || !targetElement) return

    // Clean up any existing movers first
    cleanupMovers()

    const sourceRect = sourceElement.getBoundingClientRect()
    const targetRect = targetElement.getBoundingClientRect()

    // Get background image from source element
    const computedStyle = window.getComputedStyle(sourceElement)
    const backgroundImage = computedStyle.backgroundImage

    // Get clip paths based on direction
    const clipPaths = getClipPathsForDirection(clipPathDirection)

    // Generate path for movers
    const path = generateMotionPath(sourceRect, targetRect, steps)

    // Create timeline for coordinating animations
    const timeline = gsap.timeline()
    timelineRef.current = timeline

    // Create and animate movers
    path.forEach((step, index) => {
      // Create mover element
      const mover = document.createElement("div")
      mover.className = "mover"
      moversRef.current.push(mover)

      // Set initial styles
      gsap.set(mover, {
        position: "fixed",
        left: step.left + "px",
        top: step.top + "px",
        width: step.width + "px",
        height: step.height + "px",
        backgroundImage: backgroundImage,
        backgroundSize: "cover",
        backgroundPosition: "50% 50%",
        zIndex: 2000 + index,
        clipPath: clipPaths.from,
        opacity: 0,
        rotationZ: gsap.utils.random(-rotationRange, rotationRange),
        ...(moverBlendMode ? { mixBlendMode: moverBlendMode } : {}),
      })

      // Add to DOM
      document.body.appendChild(mover)

      // Create animation sequence for this mover
      const delay = index * stepInterval

      timeline.fromTo(
        mover,
        {
          opacity: 0.4,
          clipPath: clipPaths.hide,
        },
        {
          opacity: 1,
          clipPath: clipPaths.reveal,
          duration: stepDuration,
          ease: moverEnterEase,
          delay: delay,
        },
        0,
      )

      timeline.to(
        mover,
        {
          clipPath: clipPaths.from,
          duration: stepDuration,
          ease: moverExitEase,
          delay: moverPauseBeforeExit,
          onComplete: index === path.length - 1 ? onTransitionComplete : undefined,
        },
        `>-${moverPauseBeforeExit}`,
      )
    })

    // Set a timeout to clean up movers after animation completes
    const totalDuration = steps * stepInterval + stepDuration * 2 + moverPauseBeforeExit + 0.5
    setTimeout(cleanupMovers, totalDuration * 1000)
  }

  // Run transition when isActive changes
  useEffect(() => {
    if (isActive && sourceElement && targetElement) {
      createTransition()
    } else {
      cleanupMovers()
    }

    return () => {
      cleanupMovers()
    }
  }, [isActive, sourceElement, targetElement])

  // This component doesn't render anything visible
  return null
}

export default RepeatingImageTransition
