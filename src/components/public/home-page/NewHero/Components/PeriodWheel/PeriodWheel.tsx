import { useRef, useEffect, useMemo, useCallback } from "react";
import styles from "./PeriodWheel.module.css";

interface PeriodWheelProps {
  selectedValue: "AM" | "PM";
  onValueChange: (value: "AM" | "PM") => void;
}

export default function PeriodWheel({ selectedValue, onValueChange }: PeriodWheelProps) {
  const wheelRef = useRef<HTMLDivElement>(null);
  const isUserInteractingRef = useRef(false);
  const values: ("AM" | "PM")[] = useMemo(() => ["AM", "PM"], []);
  const itemHeight = 36; // Smaller height

  // Initialize scroll position - only show AM and PM (no infinite loop)
  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel || isUserInteractingRef.current) return;

    const selectedIndex = values.indexOf(selectedValue);
    const targetScroll = selectedIndex * itemHeight;
    
    // Only update if significantly different
    if (Math.abs(wheel.scrollTop - targetScroll) > 2) {
      wheel.scrollTop = targetScroll;
    }
  }, [selectedValue, itemHeight, values]);

  // Handle user scroll - only update when user actually scrolls
  const handleScroll = useCallback(() => {
    if (!isUserInteractingRef.current) {
      isUserInteractingRef.current = true;
      setTimeout(() => {
        isUserInteractingRef.current = false;
      }, 200);
    }

    const wheel = wheelRef.current;
    if (!wheel) return;

    const scrollTop = wheel.scrollTop;
    const currentIndex = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(1, currentIndex)); // Clamp to 0 or 1
    const newValue = values[clampedIndex];

    if (newValue !== selectedValue) {
      onValueChange(newValue);
    }

    // Snap to correct position
    const targetScroll = clampedIndex * itemHeight;
    if (Math.abs(wheel.scrollTop - targetScroll) > 2) {
      wheel.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  }, [selectedValue, itemHeight, onValueChange, values]);

  useEffect(() => {
    const wheel = wheelRef.current;
    if (!wheel) return;

    let scrollTimeout: NodeJS.Timeout;
    
    const debouncedHandleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        handleScroll();
      }, 150);
    };

    wheel.addEventListener('scroll', debouncedHandleScroll, { passive: true });

    return () => {
      wheel.removeEventListener('scroll', debouncedHandleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [handleScroll]);

  // Handle click on items for direct selection
  const handleItemClick = useCallback((value: "AM" | "PM") => {
    if (value !== selectedValue) {
      onValueChange(value);
    }
  }, [selectedValue, onValueChange]);

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.fade} ${styles.fadeTop}`} />
      <div
        ref={wheelRef}
        className={styles.wheel}
        role="listbox"
        aria-label="Select period"
        onWheel={(e) => {
          e.preventDefault();
          const wheel = wheelRef.current;
          if (!wheel) return;
          isUserInteractingRef.current = true;
          wheel.scrollTop += e.deltaY * 0.3;
          setTimeout(() => {
            isUserInteractingRef.current = false;
          }, 200);
        }}
      >
        {values.map((value) => (
          <div
            key={value}
            className={styles.item}
            role="option"
            aria-selected={value === selectedValue}
            onClick={() => handleItemClick(value)}
          >
            {value}
          </div>
        ))}
      </div>
      <div className={`${styles.fade} ${styles.fadeBottom}`} />
      <div className={styles.indicator} />
    </div>
  );
}

