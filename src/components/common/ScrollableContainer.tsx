import React, { useRef, useEffect } from 'react';

interface ScrollableContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ScrollableContainer: React.FC<ScrollableContainerProps> = ({ children, className }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY; // 가로 방향으로 스크롤
    };

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      scrollContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div 
      className={`scrollable-container ${className || ''}`}
      ref={scrollContainerRef}
    >
      {children}
    </div>
  );
};

export default ScrollableContainer;