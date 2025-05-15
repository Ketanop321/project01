"use client"

import type React from "react"
import { useRef } from "react"

interface GridItemProps {
  item: {
    id: string
    image: string
    title: string
    description: string
  }
  onClick: (item: any, element: HTMLElement) => void
  effectConfig?: Record<string, any>
}

const GridItem: React.FC<GridItemProps> = ({ item, onClick, effectConfig = {} }) => {
  const itemRef = useRef<HTMLElement>(null)

  // Convert effectConfig object to data attributes
  const dataAttributes: Record<string, string> = {}
  Object.entries(effectConfig).forEach(([key, value]) => {
    dataAttributes[`data-${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`] = String(value)
  })

  const handleClick = () => {
    if (itemRef.current) {
      onClick(item, itemRef.current)
    }
  }

  return (
    <figure
      ref={itemRef}
      className="grid__item"
      role="img"
      aria-labelledby={`caption-${item.id}`}
      onClick={handleClick}
      {...dataAttributes}
    >
      <div className="grid__item-image" style={{ backgroundImage: `url(/assets/${item.image})` }} />
      <figcaption className="grid__item-caption" id={`caption-${item.id}`}>
        <h3>{item.title}</h3>
        <p>{item.description}</p>
      </figcaption>
    </figure>
  )
}

export default GridItem
