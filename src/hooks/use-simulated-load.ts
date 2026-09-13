import { useEffect, useState } from "react";

/**
 * Mock data resolves synchronously, so screens that would hit an API in a real build
 * hold a skeleton for a beat. Swap this for the request's own pending state later.
 */
export function useSimulatedLoad(ms = 550): boolean {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), ms);
    return () => clearTimeout(timer);
  }, [ms]);
  return loading;
}
