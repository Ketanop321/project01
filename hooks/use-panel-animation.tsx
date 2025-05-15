"use client"

import { useCallback, useRef } from "react"
import { gsap } from "gsap"
import { getClipPathsForDirection, generateMotionPath } from "@/utils/animation-utils"

export const usePanelAnimation = (config: any) => {
  // Keep track of created movers to clean them up later
  const moversRef = useRef<HTMLElement[]>([])

  // Animate panel opening with transition effect
  const animatePanel = useCallback(
    (panel: HTMLElement, panelImg: HTMLElement, panelContent: HTMLElement) => {
      // Get the clicked item image
      const clickedItemImg = document.querySelector(
        '.grid__item[style*="opacity: 0"][style*="scale(1)"] .grid__item-image',
      ) as HTMLElement
      if (!clickedItemImg) return

      // Clean up any existing movers
      moversRef.current.forEach((mover) => mover.remove())
      moversRef.current = []

      // Set initial panel state
      gsap.set(panelContent, { opacity: 0, y: 25 })
      gsap.set(panel, { opacity: 1, pointerEvents: "auto" })

      const clipPaths = getClipPathsForDirection(config.clipPathDirection)
      gsap.set(panelImg, { clipPath: clipPaths.hide })

      // Generate path between clicked item and panel image
      const path = generateMotionPath(
        clickedItemImg.getBoundingClientRect(),
        panelImg.getBoundingClientRect(),
        config.steps,
        config,
      )

      // Create and animate movers
      path.forEach((step, index) => {
        const mover = document.createElement("div")
        mover.className = "mover"
        moversRef.current.push(mover)

        // Set mover style
        gsap.set(mover, {
          backgroundImage: clickedItemImg.style.backgroundImage,
          position: "fixed",
          left: step.left + "px",
          top: step.top + "px",
          width: step.width + "px",
          height: step.height + "px",
          clipPath: clipPaths.from,
          zIndex: 1000 + index,
          backgroundPosition: "50% 50%",
          backgroundSize: "cover",
          rotationZ: gsap.utils.random(-config.rotationRange, config.rotationRange),
          ...(config.moverBlendMode ? { mixBlendMode: config.moverBlendMode } : {}),
        })

        document.body.appendChild(mover)

        // Animate mover
        const delay = index * config.stepInterval
        gsap
          .timeline({ delay })
          .fromTo(
            mover,
            { opacity: 0.4, clipPath: clipPaths.hide },
            {
              opacity: 1,
              clipPath: clipPaths.reveal,
              duration: config.stepDuration,
              ease: config.moverEnterEase,
            },
          )
          .to(
            mover,
            {
              clipPath: clipPaths.from,
              duration: config.stepDuration,
              ease: config.moverExitEase,
              onComplete:
                index === path.length - 1
                  ? () => {
                      // Only remove movers after the last one completes its exit animation
                      setTimeout(() => {
                        moversRef.current.forEach((m) => m.remove())
                        moversRef.current = []
                      }, 300)
                    }
                  : undefined,
            },
            `+=${config.moverPauseBeforeExit}`,
          )
      })

      // Reveal panel
      gsap
        .timeline({
          defaults: {
            duration: config.stepDuration * config.panelRevealDurationFactor,
            ease: config.panelRevealEase,
          },
          delay: config.steps * config.stepInterval,
        })
        .to(panelImg, {
          clipPath: clipPaths.reveal,
          pointerEvents: "auto",
        })
        .to(
          panelContent,
          {
            duration: 1,
            ease: "expo",
            opacity: 1,
            y: 0,
          },
          "<+=0.1",
        )
    },
    [config],
  )

  // Reset panel animation (when closing)
  const resetPanel = useCallback(
    (panel: HTMLElement, panelImg: HTMLElement, panelContent: HTMLElement) => {
      // Clean up any existing movers
      moversRef.current.forEach((mover) => mover.remove())
      moversRef.current = []

      gsap
        .timeline({
          defaults: { duration: config.stepDuration, ease: "expo" },
        })
        .to(panel, { opacity: 0 })
        .set(panel, { opacity: 0, pointerEvents: "none" })
        .set(panelImg, {
          clipPath: "inset(0% 0% 100% 0%)",
        })
    },
    [config],
  )

  return { animatePanel, resetPanel }
}
