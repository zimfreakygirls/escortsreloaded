
import { useLayoutEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";

interface AnimationWrapperProps {
  children: ReactNode;
  animation?: "fade" | "slide" | "scale" | "none";
  delay?: number;
  duration?: number;
  className?: string;
}

export function AnimationWrapper({
  children,
  animation = "fade",
  delay = 0,
  duration = 0.5,
  className,
}: AnimationWrapperProps) {
  const el = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (!el.current) return;

      const element = el.current;
      
      // Set initial states based on animation type
      if (animation === "fade") {
        gsap.set(element, { opacity: 0, y: 20 });
      } else if (animation === "slide") {
        gsap.set(element, { x: -50, opacity: 0 });
      } else if (animation === "scale") {
        gsap.set(element, { scale: 0.8, opacity: 0 });
      }

      // Apply animation if not "none"
      if (animation !== "none") {
        gsap.to(element, {
          opacity: 1,
          y: animation === "fade" ? 0 : undefined,
          x: animation === "slide" ? 0 : undefined,
          scale: animation === "scale" ? 1 : undefined,
          duration: duration,
          delay: delay,
          ease: "power2.out",
        });
      }
    }, el);

    return () => ctx.revert();
  }, [animation, delay, duration]);

  return (
    <div ref={el} className={className}>
      {children}
    </div>
  );
}
