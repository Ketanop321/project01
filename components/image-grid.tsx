"use client"

import React, { useRef } from "react"
import GridSection from "./grid-section"
import { gridData } from "@/data/grid-data"

interface ImageGridProps {
  onItemClick: (content: any, itemElement: HTMLElement, config: any) => void
  isPanelOpen: boolean
}

const ImageGrid: React.FC<ImageGridProps> = ({ onItemClick, isPanelOpen }) => {
  const gridRef = useRef<HTMLDivElement>(null)

  // Handle click on a grid item
  const handleItemClick = (item: any, itemElement: HTMLElement, effectConfig: any = {}) => {
    if (isPanelOpen) return

    // Extract item-specific config overrides
    const overrides = extractItemConfigOverrides(itemElement)
    const config = { ...effectConfig, ...overrides }

    // Determine panel position based on click position
    const centerX = getElementCenter(itemElement).x
    const windowHalf = window.innerWidth / 2
    const position = centerX < windowHalf ? "right" : "left"

    // Extract content data
    const imgDiv = itemElement.querySelector(".grid__item-image") as HTMLElement
    const caption = itemElement.querySelector("figcaption") as HTMLElement
    const title = caption.querySelector("h3")?.textContent || ""
    const desc = caption.querySelector("p")?.textContent || ""

    // Pass content to parent for panel display
    onItemClick(
      {
        imgURL: imgDiv.style.backgroundImage,
        title,
        desc,
        position,
      },
      itemElement,
      config,
    )
  }

  return (
    <>
      {gridData.map((section, index) => (
        <React.Fragment key={index}>
          <div className="heading">
            <h2 className="heading__title">{section.title}</h2>
            <span className="heading__meta">{section.description}</span>
          </div>
          <GridSection
            items={section.items}
            onItemClick={(item, element) => handleItemClick(item, element, section.effectConfig)}
            effectConfig={section.effectConfig}
          />
        </React.Fragment>
      ))}
    </>
  )
}

// Helper function to extract config overrides from data attributes
const extractItemConfigOverrides = (item: HTMLElement) => {
  const overrides: Record<string, any> = {}

  if (item.dataset.clipPathDirection) overrides.clipPathDirection = item.dataset.clipPathDirection
  if (item.dataset.steps) overrides.steps = Number(item.dataset.steps)
  if (item.dataset.stepDuration) overrides.stepDuration = Number(item.dataset.stepDuration)
  if (item.dataset.stepInterval) overrides.stepInterval = Number(item.dataset.stepInterval)
  if (item.dataset.rotationRange) overrides.rotationRange = Number(item.dataset.rotationRange)
  if (item.dataset.moverPauseBeforeExit) overrides.moverPauseBeforeExit = Number(item.dataset.moverPauseBeforeExit)
  if (item.dataset.moverEnterEase) overrides.moverEnterEase = item.dataset.moverEnterEase
  if (item.dataset.moverExitEase) overrides.moverExitEase = item.dataset.moverExitEase
  if (item.dataset.panelRevealEase) overrides.panelRevealEase = item.dataset.panelRevealEase
  if (item.dataset.moverBlendMode) overrides.moverBlendMode = item.dataset.moverBlendMode
  if (item.dataset.pathMotion) overrides.pathMotion = item.dataset.pathMotion
  if (item.dataset.sineAmplitude) overrides.sineAmplitude = Number(item.dataset.sineAmplitude)
  if (item.dataset.wobbleStrength) overrides.wobbleStrength = Number(item.dataset.wobbleStrength)

  return overrides
}

// Helper function to get the center position of an element
const getElementCenter = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

export default ImageGrid
