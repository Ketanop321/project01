// Preloads images specified by the CSS selector
export const preloadImages = (selector = "img") => {
  return new Promise<void>((resolve) => {
    // Dynamically import imagesLoaded to avoid SSR issues
    import("imagesloaded").then((imagesLoaded) => {
      const imgLoad = imagesLoaded.default(document.querySelectorAll(selector), { background: true })

      imgLoad.on("done", () => resolve())
    })
  })
}
