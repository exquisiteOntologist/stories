import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IconRefresh } from '../../../atoms/icons/refresh'
import { RefreshBarProps } from './interfaces'

/**
 * https://www.framer.com/motion/component/
 */
export const motionPropsRefreshBar = {
    // NOTE: It does not like durations less than 1. Gets choppy.
    initial:{ opacity: 0.1, x: '-50%', y: 30, z: 1, filter: 'blur(100px)', transition: { duration: 1 } },
    animate:{ opacity: 1, x: '-50%', y: 0, z: 0, filter: 'blur(0)', transition: { duration: 1 } },
    exit:{ opacity: 0.1, x: '-50%', y: -20, z: 1, filter: 'blur(100px)', transition: { duration: 1 } },
    transition: { ease: 'anticipate' }
}

export const RefreshBar: React.FC<RefreshBarProps> = ({ refreshAction: action, refreshPossibe }) => (
    <AnimatePresence>
        {(refreshPossibe || true) && (
            <motion.nav
                {...motionPropsRefreshBar}
                onClick={action}
                className="cursor-pointer w-2/3 max-w-xl px-7 py-2 z-50 fixed bottom-10 left-1/2 -translate-x-1/2 rounded-full border-b border-transparent bg-black text-white shadow-md shadow-white dark:shadow-black"
            >
                <h1 className="flex justify-between align-middle items-center text-base leading-none whitespace-nowrap mx-0 dark:text-gray-300">
                    <div className="text-lg">
                        This <span className="font-semibold">collection</span> has <span className="font-semibold">fresh content</span>
                    </div>
                    <button className="font-medium p-0 w-11 h-11 rounded-full overflow-hidden relative bg-rose-700 text-black">
                        <IconRefresh className="w-20 h-24 max-w-none absolute -bottom-5 -left-4" />
                    </button>
                </h1>
            </motion.nav>
        )}
    </AnimatePresence>
)
