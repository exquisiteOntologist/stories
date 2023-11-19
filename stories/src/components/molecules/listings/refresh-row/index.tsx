import React from 'react'
import { RefreshRowProps } from './interfaces'
import { motion } from 'framer-motion'

export const RefreshRow: React.FC<RefreshRowProps> = ({ refreshAction: action, refreshPossibe}) => {
    const labelText = refreshPossibe ? 'Show more recent' : 'Refresh for no reason'

    return (
        <motion.article onClick={action} className={`cursor-pointer -ml-2 relative group border-b border-transparent bg-gradient-to-r from-yellow-500 to-transparent dark:text-slate-800 ${refreshPossibe ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <h1 className="flex text-base whitespace-nowrap mx-0 px-2 py-2 dark:text-slate-300">
                <span className="truncate">
                    {labelText}
                </span>
            </h1>
        </motion.article>
    )
}
