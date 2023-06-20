import { AnimatePresence, motion } from "framer-motion";


/**
 * Default motion props for use with `motion.div`
 * 
 * https://www.framer.com/motion/component/
 */
export const motionProps = {
    initial:{ opacity: 0, translateX: 0, transition: { duration: 0.0 } },
    animate:{ opacity: 1, translateX: 0, transition: { duration: 0.1, staggerChildren: 0.3 } },
    exit:{ opacity: 0, translateX: -5, transition: { duration: 0.1 } },
}

