import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconRefresh } from "../../../atoms/icons/refresh";
import { RefreshBarProps } from "./interfaces";
import { IconArrowCircle } from "../../../atoms/icons/arrow-circle";

/**
 * https://www.framer.com/motion/component/
 */
export const motionPropsRefreshBar = {
  // NOTE: It does not like durations less than 1. Gets choppy.
  initial: {
    opacity: 0.1,
    // x: "-50%",
    x: 0,
    y: 30,
    z: 1,
    filter: "blur(100px)",
    transition: { duration: 1 },
  },
  animate: {
    opacity: 1,
    // x: "-50%",
    x: 0,
    y: 0,
    z: 0,
    filter: "blur(0)",
    transition: { duration: 1 },
  },
  exit: {
    opacity: 0.1,
    // x: "-50%",
    x: 0,
    y: -20,
    z: 1,
    filter: "blur(100px)",
    transition: { duration: 1 },
  },
  transition: { ease: "anticipate" },
};

export const RefreshBar: React.FC<RefreshBarProps> = ({
  refreshAction: action,
  refreshPossible,
}) => (
  <AnimatePresence>
    {refreshPossible && (
      <motion.nav
        onClick={action}
        {...motionPropsRefreshBar}
        className="cur
          sor-pointer w-150 max-w-xl px-7 py-2 z-50 fixed bottom-10 left-1/2 -translate-x-1/2 rounded-full border-b border-transparent bg-black text-white"
      >
        <h1 className="flex justify-between align-middle items-center text-base leading-none whitespace-nowrap mx-0 group dark:text-gray-300">
          <div className="text-lg text-slate-50">
            This <span className="">collection</span> has{" "}
            <span className="font-semibold text-yellow-500">fresh content</span>
          </div>
          <button className="font-medium p-0 w-11 h-11 rounded-full overflow-hidden relative bg-yellow-600 translate-x-0 group-hover:bg-white group-hover:translate-x-4 text-black duration-300 transition-all">
            {/* <IconRefresh className="w-20 h-24 max-w-none absolute -bottom-5 -left-4" /> */}
            <IconArrowCircle />
          </button>
        </h1>
      </motion.nav>
    )}
  </AnimatePresence>
);
