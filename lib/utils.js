import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import * as React from "react";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export default function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      window.clearTimeout(id);
    };
  }, [value, delay]);

  return debouncedValue;
}
