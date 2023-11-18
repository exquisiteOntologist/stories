import React from 'react'
import { motion } from 'framer-motion'
import { motionProps } from '../../../../utilities/animate'
import { SourceLink } from '../source-link/source-link'
import { ListingRowProps } from './interfaces'
import { RelativeDate } from '../../../atoms/relative-date'

export const ListingRow: React.FC<ListingRowProps> = ({ title, linkUrl, action, content, source }) => {
    // const description = content && (
    //     <span className='font-normal ml-6 text-gray-300'>
    //         {/* {content?.description?.slice(0, 100)} */}
    //     </span>
    // )

    const actionInner = (
        <>
            {title}
            {/* {description} */}
        </>
    )

    const titleInner = linkUrl ? (
        <a href={linkUrl} target="_blank">
            {actionInner}
        </a>
    ) : (action && (
        <span className="cursor-pointer" onClick={action}>
            {actionInner}
        </span>
    ))

    return (
        <motion.article {...motionProps} className="relative group border-b border-gray-100 dark:border-slate-800">
            <h1 className="flex text-base whitespace-nowrap mx-0 my-2 dark:text-slate-300">
                <span className="truncate">
                    {titleInner}
                    <SourceLink source={source} isBlock={false} />
                </span>
                <span className="ml-2 text-gray-300">
                    <RelativeDate date={content?.date_published} />    
                </span>
            </h1>
        </motion.article>
    )
}
