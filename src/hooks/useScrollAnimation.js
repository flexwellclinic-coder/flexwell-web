import { useEffect, useRef, useState, useMemo } from 'react';

export const useScrollAnimation = (options = {}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Memoize the options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => ({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    ...options
  }), [options.threshold, options.rootMargin]);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once animated, stop observing to prevent re-animation
          observer.unobserve(entry.target);
        }
      },
      memoizedOptions
    );

    observer.observe(currentElement);

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [memoizedOptions]);

  return [elementRef, isVisible];
};

export default useScrollAnimation; 