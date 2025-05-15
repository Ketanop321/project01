"use client"

import type React from "react"
import GridItem from "./grid-item"

interface GridSectionProps {
  items: any[]
  onItemClick: (item: any, element: HTMLElement) => void
  effectConfig?: Record<string, any>
}

const GridSection: React.FC<GridSectionProps> = ({ items, onItemClick, effectConfig = {} }) => {
  return (
    <div className="grid">
      {items.map((item, index) => (
        <GridItem key={index} item={item} onClick={onItemClick} effectConfig={effectConfig} />
      ))}
    </div>
  )
}

export default GridSection
