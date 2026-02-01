import { useState, useRef, useEffect, ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  srcSet?: string;
  sizes?: string;
  placeholderColor?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  srcSet,
  sizes,
  placeholderColor = "rgba(120, 40, 202, 0.1)",
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "50px",
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const imgProps: Record<string, unknown> = {
    ...props,
    ref: imgRef,
    src: isInView ? src : undefined,
    alt,
    width,
    height,
    loading: priority ? "eager" : "lazy",
    decoding: priority ? "sync" : "async",
    onLoad: handleLoad,
    className: cn(
      "transition-all duration-300",
      !isLoaded && "blur-sm scale-[1.02]",
      isLoaded && "blur-0 scale-100",
      className
    ),
    style: {
      ...((props as any).style || {}),
      backgroundColor: !isLoaded ? placeholderColor : undefined,
    },
  };

  if (priority) {
    (imgProps as any).fetchpriority = "high";
  }

  if (srcSet && isInView) {
    imgProps.srcSet = srcSet;
  }

  if (sizes) {
    imgProps.sizes = sizes;
  }

  return <img {...(imgProps as ImgHTMLAttributes<HTMLImageElement>)} />;
}

export default OptimizedImage;
