"use client"

import { useCallback } from "react"
import { gsap } from "gsap"
import { getClipPathsForDirection } from "@/utils/animation-utils"
import { getElementCenter } from "@/utils/dom-utils"

export const useGridAnimation = (config: any) => {
  // Compute stagger delays for grid item animations
  const computeStaggerDelays = useCallback(
    (clickedItem: HTMLElement, items: NodeListOf<Element>) => {
      const baseCenter = getElementCenter(clickedItem)
      const distances = Array.from(items).map((el) => {
        const center = getElementCenter(el as HTMLElement)
        return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y)
      })
      const max = Math.max(...distances)
      return distances.map((d) => (d / max) * config.gridItemStaggerFactor)
    },
    [config.gridItemStaggerFactor],
  )

  // Animate all grid items (fade out non-clicked items)
  const animateGridItems = useCallback(
    (items: NodeListOf<Element>, clickedItem: HTMLElement) => {
      const clipPaths = getClipPathsForDirection(config.clipPathDirection)
      const delays = computeStaggerDelays(clickedItem, items)

      // First, set initial state for all items
      gsap.set(items, {
        clearProps: "opacity,scale,clipPath",
      })

      // Then animate them with staggered delays
      gsap.to(items, {
        opacity: (i, el) => (el === clickedItem ? 1 : 0),
        scale: (i, el) => (el === clickedItem ? 1 : 0.8),
        duration: (i, el) => (el === clickedItem ? config.stepDuration * config.clickedItemDurationFactor : 0.3),
        ease: config.gridItemEase || "sine",
        clipPath: (i, el) => (el === clickedItem ? clipPaths.from : "none"),
        delay: (i) => delays[i],
      })

      // Hide frame elements
      gsap.to(".frame, .heading", {
        opacity: 0,
        duration: 0.5,
        ease: "sine.inOut",
        pointerEvents: "none",
      })
    },
    [config, computeStaggerDelays],
  )

  // Reset grid items animation (when closing panel)
  const resetGridItems = useCallback(
    (items: NodeListOf<Element>, clickedItem: HTMLElement) => {
      const delays = computeStaggerDelays(clickedItem, items)

      // Set initial state
      gsap.set(items, {
        clipPath: "none",
        opacity: 0,
        scale: 0.8,
      })

      // Animate items back in with staggered delays
      gsap.to(items, {
        opacity: 1,
        scale: 1,
        delay: (i) => delays[i],
        duration: 0.5,
        ease: "expo",
        clearProps: "opacity,scale,clipPath",
      })

      // Show frame elements
      gsap.to(".frame, .heading", {
        opacity: 1,
        duration: 0.5,
        ease: "sine.inOut",
        pointerEvents: "auto",
      })
    },
    [computeStaggerDelays],
  )

  return { animateGridItems, resetGridItems }
}
