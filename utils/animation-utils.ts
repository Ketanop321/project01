// Linear interpolation helper
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

// Get appropriate clip-paths depending on animation direction
export const getClipPathsForDirection = (direction: string) => {
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
export const generateMotionPath = (startRect: DOMRect, endRect: DOMRect, steps: number, config: any) => {
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
    if (config.pathMotion === "sine") {
      const sineOffset = Math.sin(t * (config.sineFrequency || Math.PI)) * (config.sineAmplitude || 50)

      // Apply offset based on direction
      if (config.clipPathDirection === "left-right" || config.clipPathDirection === "right-left") {
        centerY += sineOffset
      } else {
        centerX += sineOffset
      }
    }

    // Add random wobble for more organic movement
    const wobbleX = (Math.random() - 0.5) * (config.wobbleStrength || 0)
    const wobbleY = (Math.random() - 0.5) * (config.wobbleStrength || 0)

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
