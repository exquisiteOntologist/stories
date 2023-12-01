import React from 'react'
import { RefreshRowProps } from './interfaces'
import { AnimatePresence, motion } from 'framer-motion'

/**
 * https://www.framer.com/motion/component/
 */
export const motionPropsRefreshRow = {
    // NOTE: It does not like durations less than 1. Gets choppy.
    initial:{ opacity: 0.1, x: '-50%', y: 30, z: 1, filter: 'blur(100px)', transition: { duration: 1 } },
    animate:{ opacity: 1, x: '-50%', y: 0, z: 0, filter: 'blur(0)', transition: { duration: 1 } },
    exit:{ opacity: 0.1, x: '-50%', y: -20, z: 1, filter: 'blur(100px)', transition: { duration: 1 } },
    transition: { ease: 'anticipate' }
}

export const RefreshRow: React.FC<RefreshRowProps> = ({ refreshAction: action, refreshPossibe}) => (
    <AnimatePresence>
        {refreshPossibe && (
            <motion.nav
                {...motionPropsRefreshRow}
                onClick={action}
                className="cursor-pointer w-2/3 max-w-xl px-7 py-2 z-50 fixed bottom-10 left-1/2 -translate-x-1/2 rounded-full border-b border-transparent bg-black text-white shadow-md shadow-white dark:shadow-black"
            >
                <h1 className="flex justify-between align-middle items-center text-base leading-none whitespace-nowrap mx-0 dark:text-gray-300">
                    <div className="text-lg">
                        This <span className="font-semibold">collection</span> has <span className="font-semibold">fresh content</span>
                    </div>
                    <button className="font-medium px-4 py-3 rounded-[3px] bg-orange-300 text-black">
                        Reveal
                    </button>
                </h1>
            </motion.nav>
        )}
    </AnimatePresence>
)
