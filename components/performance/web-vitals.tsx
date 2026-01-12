"use client";

import { useEffect } from "react";
import { getCLS, getFID, getFCP, getLCP, getTTFB } from "web-vitals";

export function WebVitals() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    }
  }, []);

  return null;
}
