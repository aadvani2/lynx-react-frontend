interface ScrollAnimationProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollAnimation = ({
  children,
  className = "",
}: ScrollAnimationProps) => {
  // Preload all content - show immediately without scroll-based animation
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default ScrollAnimation;
