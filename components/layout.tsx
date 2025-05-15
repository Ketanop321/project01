import type React from "react"
import Header from "./header"
import Footer from "./footer"

interface LayoutProps {
  children: React.ReactNode
  className?: string
}

const Layout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={className}>
      <Header />
      {children}
      <Footer />
    </div>
  )
}

export default Layout
