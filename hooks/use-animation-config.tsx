"use client"

import { useState, useCallback } from "react"

// Default configuration for animations
const defaultConfig = {
  clipPathDirection: "top-bottom", // Direction of clip-path animation
  autoAdjustHorizontalClipPath: true, // Auto flip horizontal clip-path direction based on panel side
  steps: 6, // Number of mover elements generated between grid item and panel
  stepDuration: 0.35, // Duration (in seconds) for each animation step
  stepInterval: 0.05, // Delay between each mover's animation start
  moverPauseBeforeExit: 0.14, // Pause before mover elements exit after entering
  rotationRange: 0, // Maximum random rotation applied to each mover's Z-axis
  wobbleStrength: 0, // Random positional wobble applied to each mover path
  panelRevealEase: "sine.inOut", // Easing function for panel reveal animation
  gridItemEase: "sine", // Easing function for grid item exit animation
  moverEnterEase: "sine.in", // Easing function for mover entering animation
  moverExitEase: "sine", // Easing function for mover exit animation
  panelRevealDurationFactor: 2, // Multiplier to adjust panel reveal animation duration
  clickedItemDurationFactor: 2, // Multiplier to adjust clicked grid item animation duration
  gridItemStaggerFactor: 0.3, // Max delay factor when staggering grid item animations
  moverBlendMode: false, // Optional CSS blend mode for mover elements
  pathMotion: "linear", // Type of path movement ('linear' or 'sine')
  sineAmplitude: 50, // Amplitude of sine wave for pathMotion 'sine'
  sineFrequency: Math.PI, // Frequency of sine wave for pathMotion 'sine'
}

export const useAnimationConfig = () => {
  const [config, setConfigState] = useState(defaultConfig)

  // Update config with new values
  const setConfig = useCallback((newConfig: Partial<typeof defaultConfig>) => {
    setConfigState((prevConfig) => ({
      ...prevConfig,
      ...newConfig,
    }))
  }, [])

  // Reset config to defaults
  const resetConfig = useCallback(() => {
    setConfigState(defaultConfig)
  }, [])

  return { config, setConfig, resetConfig }
}
