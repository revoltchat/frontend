/**
 * Debounce a function calls
 * @param cb Callback
 * @param duration Time to wait
 * @returns New function
 */
export function debounce<T, A extends T[]>(
  cb: (...args: A) => void,
  duration: number
) {
  // Store the timer variable.
  let timer: number;
  // This function is given to React.
  return (...args: A) => {
    // Get rid of the old timer.
    clearTimeout(timer);
    // Set a new timer.
    timer = setTimeout(() => {
      // Instead calling the new function.
      // (with the newer data)
      cb(...args);
    }, duration) as never;
  };
}
