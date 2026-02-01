import { useEffect, useRef, useState } from "react";
import { motion, useSpring, useTransform, useInView, useReducedMotion } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  formatNumber?: boolean;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  duration = 2,
  formatNumber = true,
  className = ""
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const prefersReducedMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  const spring = useSpring(0, {
    stiffness: 50,
    damping: 30,
    duration: duration * 1000
  });

  const formatted = useTransform(spring, (latest) => {
    const rounded = Math.round(latest);
    if (formatNumber) {
      return formatWithCommas(rounded);
    }
    return rounded.toString();
  });

  useEffect(() => {
    if (isInView) {
      if (prefersReducedMotion) {
        setDisplayValue(value);
      } else {
        spring.set(value);
      }
    }
  }, [isInView, value, spring, prefersReducedMotion]);

  useEffect(() => {
    if (!prefersReducedMotion) {
      const unsubscribe = formatted.on("change", (v) => {
        setDisplayValue(parseInt(v.replace(/,/g, "")) || 0);
      });
      return () => unsubscribe();
    }
  }, [formatted, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <span ref={ref} className={className}>
        {prefix}{formatNumber ? formatWithCommas(value) : value}{suffix}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      <motion.span>{formatted}</motion.span>
      {suffix}
    </span>
  );
}

function formatWithCommas(num: number): string {
  return num.toLocaleString("en-US");
}

export function formatCompact(num: number): { value: number; suffix: string } {
  if (num >= 1000000) {
    return { value: Math.floor(num / 1000000), suffix: "M+" };
  }
  if (num >= 1000) {
    return { value: Math.floor(num / 1000), suffix: "K+" };
  }
  return { value: num, suffix: "+" };
}

interface StatCardProps {
  value: number;
  label: string;
  suffix?: string;
  prefix?: string;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
}

export function StatCard({
  value,
  label,
  suffix = "",
  prefix = "",
  icon,
  className = "",
  valueClassName = "",
  labelClassName = ""
}: StatCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: prefersReducedMotion ? 0.1 : 0.4, ease: "easeOut" }}
      className={`flex flex-col items-center text-center p-6 ${className}`}
    >
      {icon && (
        <motion.div 
          className="mb-4"
          initial={{ scale: prefersReducedMotion ? 1 : 0.8 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          {icon}
        </motion.div>
      )}
      <div className={`text-4xl sm:text-5xl md:text-6xl font-black tracking-tight ${valueClassName}`}>
        <AnimatedCounter 
          value={value} 
          suffix={suffix} 
          prefix={prefix}
          duration={1.5}
        />
      </div>
      <p className={`mt-2 text-base sm:text-lg text-muted-foreground font-medium ${labelClassName}`}>
        {label}
      </p>
    </motion.div>
  );
}

interface AnimatedStatsGridProps {
  stats: Array<{
    value: number;
    label: string;
    suffix?: string;
    prefix?: string;
    icon?: React.ReactNode;
  }>;
  className?: string;
}

export function AnimatedStatsGrid({ stats, className = "" }: AnimatedStatsGridProps) {
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: prefersReducedMotion ? 0 : 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ 
            duration: prefersReducedMotion ? 0.1 : 0.4, 
            delay: prefersReducedMotion ? 0 : index * 0.1,
            ease: "easeOut"
          }}
          className="bg-card/50 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/10 hover:border-pink-500/30 transition-colors"
        >
          {stat.icon && (
            <div className="flex justify-center mb-3 sm:mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/20 flex items-center justify-center">
                {stat.icon}
              </div>
            </div>
          )}
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400">
              <AnimatedCounter 
                value={stat.value} 
                suffix={stat.suffix || ""} 
                prefix={stat.prefix || ""}
                duration={1.5}
              />
            </div>
            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-muted-foreground font-medium">
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
