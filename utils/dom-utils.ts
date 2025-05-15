// Calculate the center position of an element
export const getElementCenter = (el: HTMLElement) => {
  const rect = el.getBoundingClientRect()
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
}

// Compute stagger delays for grid item exit animations
export const computeStaggerDelays = (clickedItem: HTMLElement, items: NodeListOf<Element>, staggerFactor: number) => {
  const baseCenter = getElementCenter(clickedItem)
  const distances = Array.from(items).map((el) => {
    const center = getElementCenter(el as HTMLElement)
    return Math.hypot(center.x - baseCenter.x, center.y - baseCenter.y)
  })
  const max = Math.max(...distances)
  return distances.map((d) => (d / max) * staggerFactor)
}
