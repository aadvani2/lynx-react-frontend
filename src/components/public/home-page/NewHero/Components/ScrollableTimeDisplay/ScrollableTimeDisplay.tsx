import { useMemo, useRef, useCallback, useImperativeHandle, forwardRef } from "react";
import styles from "./ScrollableTimeDisplay.module.css";

interface ScrollableTimeDisplayProps<T> {
  values: T[];
  selectedValue: T;
  onValueChange: (value: T) => void;
  formatValue: (value: T) => string;
}

export interface ScrollableTimeDisplayHandle {
  increment: () => void;
  decrement: () => void;
}

const ITEM_HEIGHT = 32;              // ⬅ match actual item height in CSS
const ANIMATION_DURATION = 180;      // ⬅ slightly faster

const ScrollableTimeDisplay = forwardRef<
  ScrollableTimeDisplayHandle,
  ScrollableTimeDisplayProps<number>
>(function ScrollableTimeDisplay(
  { values, selectedValue, onValueChange, formatValue },
  ref
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef(false);

  const currentIndex = values.indexOf(selectedValue);
  const prevIndex = currentIndex === 0 ? values.length - 1 : currentIndex - 1;
  const nextIndex = currentIndex === values.length - 1 ? 0 : currentIndex + 1;

  const displayValues = useMemo(
    () => [values[prevIndex], values[currentIndex], values[nextIndex]],
    [values, prevIndex, currentIndex, nextIndex]
  );

  const animate = useCallback(
    (direction: "up" | "down") => {
      if (isAnimatingRef.current || !containerRef.current) return;

      isAnimatingRef.current = true;
      const el = containerRef.current;

      const translateY = direction === "up" ? ITEM_HEIGHT : -ITEM_HEIGHT;

      el.style.transition = `transform ${ANIMATION_DURATION}ms ease`;
      el.style.transform = `translateY(${translateY}px)`;

      setTimeout(() => {
        el.style.transition = "none";
        el.style.transform = "translateY(0)";

        const newIndex = direction === "up" ? prevIndex : nextIndex;
        onValueChange(values[newIndex]);

        requestAnimationFrame(() => {
          isAnimatingRef.current = false;
        });
      }, ANIMATION_DURATION);
    },
    [values, prevIndex, nextIndex, onValueChange]
  );

  // 🔑 expose animation to buttons
  useImperativeHandle(ref, () => ({
    increment: () => animate("down"),
    decrement: () => animate("up")
  }));

  return (
    <div
      className={styles.wrapper}
      role="listbox"
      aria-label="Time picker"
      onWheel={(e) => {
        e.preventDefault();
        if (e.deltaY > 0) animate("down");
        else animate("up");
      }}
    >
      <div className={styles.fadeTop} />

      <div ref={containerRef} className={styles.list}>
        {displayValues.map((value, index) => (
          <div
            key={`${value}-${index}`}
            className={`${styles.item} ${
              value === selectedValue ? styles.active : ""
            }`}
            role="option"
            aria-selected={value === selectedValue}
            onClick={() => {
              if (value === values[prevIndex]) animate("up");
              if (value === values[nextIndex]) animate("down");
            }}
          >
            {formatValue(value)}
          </div>
        ))}
      </div>

      <div className={styles.fadeBottom} />
      <div className={styles.indicator} />
    </div>
  );
});

export default ScrollableTimeDisplay;
