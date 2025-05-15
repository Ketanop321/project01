"use client"

import type React from "react"
import { useRef, useEffect } from "react"
import { gsap } from "gsap"

interface PanelProps {
  isOpen: boolean
  content: {
    imgURL: string
    title: string
    desc: string
    position: string
  }
  onClose: () => void
}

const Panel: React.FC<PanelProps> = ({ isOpen, content, onClose }) => {
  const panelRef = useRef<HTMLElement>(null)
  const imgRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const prevOpenState = useRef(isOpen)

  // Handle panel animation when open state changes
  useEffect(() => {
    if (!panelRef.current || !imgRef.current || !contentRef.current) return

    // Only run animation if the state actually changed
    if (isOpen !== prevOpenState.current) {
      if (isOpen) {
        // Panel is opening - animate content and image
        gsap.fromTo(
          contentRef.current,
          { opacity: 0, y: 25 },
          { opacity: 1, y: 0, duration: 1, ease: "expo", delay: 0.5 },
        )
        
        // Animate the panel image
        gsap.fromTo(
          imgRef.current,
          { opacity: 0 },
          { 
            opacity: 0,
            duration: 0.01,
            onComplete: () => {
              gsap.to(imgRef.current, {
                opacity: 1,
                duration: 0.5,
                delay: 0.5 // Delay to match content animation
              })
            }
          }
        )
      } else {
        // Panel is closing
        gsap.to(panelRef.current, { 
          opacity: 0, 
          duration: 0.5, 
          ease: "expo",
          onComplete: () => {
            // Reset image opacity when panel closes
            gsap.set(imgRef.current, { opacity: 0 })
          }
        })
      }
      prevOpenState.current = isOpen
    }
  }, [isOpen])

  // Set panel position class based on content position
  const panelClass = `panel ${content.position === "right" ? "panel--right" : ""}`

  return (
    <figure
      ref={panelRef}
      className={panelClass}
      role="img"
      aria-labelledby="panel-caption"
      style={{ 
        opacity: isOpen ? 1 : 0, 
        pointerEvents: isOpen ? "auto" : "none",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div 
        ref={imgRef} 
        className="panel__img" 
        style={{ 
          backgroundImage: content.imgURL,
          opacity: 0,
          transition: "opacity 0.5s ease"
        }} 
      />
      <figcaption ref={contentRef} className="panel__content" id="panel-caption">
        <h3>{content.title}</h3>
        <p>{content.desc}</p>
        <button type="button" className="panel__close" aria-label="Close preview" onClick={onClose}>
          Close
        </button>
      </figcaption>
    </figure>
  )
}

export default Panel
