import { motion, useReducedMotion } from "framer-motion";
import logoImage from "@assets/Photoroom_20260131_221621_1769915813253.png";

interface AnimatedLoaderProps {
  size?: "sm" | "md" | "lg";
  showLogo?: boolean;
  showText?: boolean;
  className?: string;
}

export function AnimatedLoader({ 
  size = "md", 
  showLogo = true, 
  showText = true,
  className = "" 
}: AnimatedLoaderProps) {
  const prefersReducedMotion = useReducedMotion();
  
  const sizeClasses = {
    sm: { container: "gap-3", logo: "w-12 h-12", ring: "w-16 h-16", text: "text-lg", dots: "w-1.5 h-1.5" },
    md: { container: "gap-4", logo: "w-20 h-20", ring: "w-28 h-28", text: "text-2xl", dots: "w-2 h-2" },
    lg: { container: "gap-6", logo: "w-28 h-28 sm:w-36 sm:h-36", ring: "w-36 h-36 sm:w-44 sm:h-44", text: "text-2xl sm:text-3xl", dots: "w-2 h-2" }
  };

  const s = sizeClasses[size];

  return (
    <div className={`flex flex-col items-center ${s.container} ${className}`}>
      <div className="relative flex items-center justify-center">
        {!prefersReducedMotion && (
          <div className="absolute -inset-20 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 blur-3xl rounded-full animate-pulse" />
        )}
        
        {!prefersReducedMotion && (
          <>
            <motion.div
              className={`absolute ${s.ring} rounded-full border-2 border-transparent`}
              style={{
                borderImage: "linear-gradient(135deg, #ff0080, #7928ca, #00d4ff) 1",
                borderImageSlice: 1
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className={`absolute ${s.ring} rounded-full`}
              style={{
                background: "conic-gradient(from 0deg, transparent, #ff0080, transparent)",
                maskImage: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))",
                WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 3px), white calc(100% - 3px))"
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className={`absolute ${s.ring} rounded-full opacity-60`}
              style={{
                background: "conic-gradient(from 180deg, transparent, #7928ca, transparent)",
                maskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))",
                WebkitMaskImage: "radial-gradient(farthest-side, transparent calc(100% - 2px), white calc(100% - 2px))"
              }}
              animate={{ rotate: -360 }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
            />
          </>
        )}
        
        {showLogo && (
          <motion.div
            className="relative z-10"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.08, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <img 
              src={logoImage} 
              alt="TrueNorthUGC" 
              width={144}
              height={144}
              loading="eager"
              className={`${s.logo} object-contain mix-blend-lighten drop-shadow-[0_0_30px_rgba(255,0,128,0.4)]`} 
            />
          </motion.div>
        )}
        
        {!showLogo && (
          <motion.div
            className="relative z-10 flex items-center justify-center"
            animate={prefersReducedMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400" />
          </motion.div>
        )}
      </div>
      
      {showText && (
        <div className="flex flex-col items-center gap-2">
          <span className={`${s.text} font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400`}>
            TrueNorthUGC
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className={`${s.dots} rounded-full`}
                style={{
                  background: i === 0 ? "#ff0080" : i === 1 ? "#7928ca" : "#00d4ff"
                }}
                animate={prefersReducedMotion ? {} : { y: [0, -6, 0] }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function SpinnerLoader({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  if (prefersReducedMotion) {
    return (
      <div className={`w-6 h-6 rounded-full border-2 border-primary border-t-transparent ${className}`} />
    );
  }
  
  return (
    <motion.div
      className={`w-6 h-6 rounded-full border-2 border-primary border-t-transparent ${className}`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function PulsingDots({ className = "" }: { className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2 h-2 rounded-full bg-primary"
          animate={prefersReducedMotion ? {} : { 
            scale: [1, 1.3, 1],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

export function GradientSpinner({ size = 24, className = "" }: { size?: number; className?: string }) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={prefersReducedMotion ? {} : { rotate: 360 }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        <defs>
          <linearGradient id="spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff0080" />
            <stop offset="50%" stopColor="#7928ca" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="url(#spinner-gradient)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
          fill="none"
        />
      </svg>
    </motion.div>
  );
}
