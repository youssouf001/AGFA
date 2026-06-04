import AgfaLogo from "@/components/shared/AgfaLogo"
import { useEffect, useState } from "react"

const NAVY = "#0A192F"

const SPLASH_DURATION_MS = 2800
const FADE_OUT_MS = 450

type LoginSplashProps = {
  onComplete: () => void
}

const LoginSplash = ({ onComplete }: LoginSplashProps) => {
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animation de la barre de progression
    const startTime = Date.now()
    
    const animateProgress = () => {
      const elapsed = Date.now() - startTime
      // Calculer le pourcentage (0 à 100)
      const percentage = Math.min((elapsed / SPLASH_DURATION_MS) * 100, 100)
      setProgress(percentage)

      if (elapsed < SPLASH_DURATION_MS) {
        requestAnimationFrame(animateProgress)
      }
    }

    const progressFrame = requestAnimationFrame(animateProgress)

    // Timer pour le début de la disparition (fade)
    const fadeTimer = setTimeout(
      () => setExiting(true),
      SPLASH_DURATION_MS - FADE_OUT_MS
    )
    
    // Timer pour le composant complet
    const completeTimer = setTimeout(onComplete, SPLASH_DURATION_MS)

    return () => {
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
      cancelAnimationFrame(progressFrame)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center transition-opacity duration-450 ease-out ${
        exiting ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ backgroundColor: NAVY }}
      aria-hidden={exiting}
      role="presentation"
    >
      <div className="relative flex min-h-dvh w-full max-w-107.5px flex-col md:my-6 md:min-h-[calc(100dvh-3rem)] md:overflow-hidden md:rounded-3xl">
        <div className="flex flex-1 flex-col items-center justify-center px-8">
          <div className="agfa-splash-logo">
            <AgfaLogo size={104} />
          </div>

          <div className="agfa-splash-text mt-10 text-center">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-white sm:text-xs">
              Gestion financière
            </p>
            <p className="mt-3 text-sm font-medium tracking-wide text-white/85 sm:text-base">
              Amicale CERTT
            </p>
          </div>
        </div>

        <div className="px-12 pb-14 pt-6 sm:pb-16">
          <div
            className="h-[1.5px] w-full overflow-hidden rounded-full bg-white/20"
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Chargement"
          >
            {/* Ajout du style inline pour la largeur dynamique */}
            <div 
              className="absolute h-[full] rounded-full bg-[#10B981] transition-all duration-100 ease-linear"
              style={{ 
                width: `${progress}%`,
                height: '1px'
             }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginSplash