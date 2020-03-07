import { useEffect } from "react";

export const useMountEffect = (func: (...args: any[]) => void) =>
  useEffect(func, []);
