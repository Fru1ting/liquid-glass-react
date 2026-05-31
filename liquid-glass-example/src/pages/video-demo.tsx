import { Geist } from "next/font/google"
import { useRef, useState } from "react"
import LiquidGlass from "liquid-glass-react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export default function LiquidGlassDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [videoError, setVideoError] = useState(false)

  return (
    <div className={`${geistSans.className} min-h-screen w-full overflow-hidden font-[family-name:var(--font-geist-sans)]`}>
      <div className="relative w-full h-screen">
        {!videoError ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            onError={() => setVideoError(true)}
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 animate-pulse" />
        )}

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full p-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-12 drop-shadow-lg">
            Liquid Glass Effect Demo
          </h1>

          <div className="relative" ref={containerRef}>
            <LiquidGlass
              displacementScale={100}
              blurAmount={0.5}
              saturation={140}
              aberrationIntensity={2}
              elasticity={0.3}
              cornerRadius={32}
              mouseContainer={containerRef}
              overLight={false}
              mode="standard"
              style={{
                width: "400px",
                maxWidth: "90vw",
                padding: "32px",
              }}
            >
              <div className="text-white">
                <h2 className="text-2xl font-semibold mb-6 text-center drop-shadow-lg">User Profile</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold shadow-lg">
                    A
                  </div>
                  <div>
                    <p className="text-xl font-semibold drop-shadow">Alex Chen</p>
                    <p className="text-white/80">Creative Director</p>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 px-3 bg-white/10 rounded-lg backdrop-blur">
                    <span className="text-white/70">Email</span>
                    <span>alex@company.com</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-white/10 rounded-lg backdrop-blur">
                    <span className="text-white/70">Location</span>
                    <span>San Francisco, CA</span>
                  </div>
                  <div className="flex justify-between py-2 px-3 bg-white/10 rounded-lg backdrop-blur">
                    <span className="text-white/70">Projects</span>
                    <span>24 completed</span>
                  </div>
                </div>
              </div>
            </LiquidGlass>
          </div>

          <p className="text-white/70 text-center mt-8 max-w-md">
            Move your mouse over the card to see the liquid glass refraction effect in real-time
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />
      </div>
    </div>
  )
}
