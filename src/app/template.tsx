"use client";

import { motion } from "motion/react";
import { easeExpo } from "@/components/Reveal";

/** Re-mounts on every navigation, giving each page a soft fade-up entrance. */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: easeExpo }}
    >
      {children}
    </motion.div>
  );
}
