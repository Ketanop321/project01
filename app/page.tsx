"use client"

import { useEffect, useState, useRef } from "react"
import Layout from "@/components/layout"
import ImageGrid from "@/components/image-grid"
import Panel from "@/components/panel"
import RepeatingImageTransition from "@/components/repeating-image-transition"
import { preloadImages } from "@/utils/preload-images"
import "@/app/globals.css"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [panelContent, setPanelContent] = useState({
    imgURL: "",
    title: "",
    desc: "",
    position: "right",
  })
  const [transitionConfig, setTransitionConfig] = useState({})
  const [isTransitioning, setIsTransitioning] = useState(false)

  // References to source and target elements for the transition
  const sourceElementRef = useRef<HTMLElement | null>(null)
  const targetElementRef = useRef<HTMLElement | null>(null)

  // Animation state management
  const isAnimating = useRef(false)

  useEffect(() => {
    // Preload images and ensure GSAP is loaded
    const initializeApp = async () => {
      try {
        // Load GSAP first
        await import("gsap")
        console.log("GSAP loaded successfully")

        // Then preload images
        await preloadImages(".grid__item-image, .panel__img")
        setLoading(false)
      } catch (error) {
        console.error("Initialization error:", error)
        setLoading(false) // Still show content even if there's an error
      }
    }

    initializeApp()
  }, [])

  const handleItemClick = (content: any, itemElement: HTMLElement, config: any) => {
    if (isAnimating.current) return

    isAnimating.current = true

    // Store the source element (clicked grid item image)
    sourceElementRef.current = itemElement.querySelector(".grid__item-image") as HTMLElement

    // Set panel content and transition config
    setPanelContent(content)
    setTransitionConfig(config)

    // First show the panel
    setIsPanelOpen(true)

    // Wait for panel to be in the DOM
    const waitForPanel = () => {
      return new Promise((resolve) => {
        const interval = setInterval(() => {
          const panelImg = document.querySelector(".panel__img")
          if (panelImg) {
            clearInterval(interval)
            targetElementRef.current = panelImg as HTMLElement
            resolve(true)
          }
        }, 10)
      })
    }

    // Start transition after panel is mounted
    waitForPanel().then(() => {
      setIsTransitioning(true)
      
      // Reset animation flag after animation completes
      setTimeout(() => {
        isAnimating.current = false
        setIsTransitioning(false)
      }, 1500) // Adjust timing based on your animation duration
    })
  }

  const handlePanelClose = () => {
    if (isAnimating.current) return

    isAnimating.current = true
    setIsPanelOpen(false)

    // Reset animation flag after animation completes
    setTimeout(() => {
      isAnimating.current = false
    }, 1000)
  }

  return (
    <Layout className={loading ? "loading" : ""}>
      <ImageGrid onItemClick={handleItemClick} isPanelOpen={isPanelOpen} />
      <Panel isOpen={isPanelOpen} content={panelContent} onClose={handlePanelClose} />

      {/* Repeating Image Transition Component */}
      <RepeatingImageTransition
        isActive={isTransitioning}
        sourceElement={sourceElementRef.current}
        targetElement={targetElementRef.current}
        config={transitionConfig}
        onTransitionComplete={() => setIsTransitioning(false)}
      />
    </Layout>
  )
}
