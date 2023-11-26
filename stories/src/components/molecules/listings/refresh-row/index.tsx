import React from 'react'
import { RefreshRowProps } from './interfaces'
import { motion } from 'framer-motion'

export const RefreshRow: React.FC<RefreshRowProps> = ({ refreshAction: action, refreshPossibe}) => {
    const labelText = 'This collection has fresh content'

    return (
        <motion.nav onClick={action} className={`cursor-pointer w-2/3 max-w-xl px-7 py-2 z-50 fixed bottom-10 left-1/2 -translate-x-1/2 group border-b border-transparent bg-black text-white rounded-full to-transparent dark:text-slate-800 ${refreshPossibe ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <h1 className="flex justify-between align-middle items-center text-base leading-none whitespace-nowrap mx-0 dark:text-slate-300">
                <span className="text-lg truncate">
                    {labelText}
                </span>
                <button className="font-medium px-4 py-3 rounded-[3px] bg-orange-300 text-black">
                    Reveal
                </button>
            </h1>
        </motion.nav>
    )
}
