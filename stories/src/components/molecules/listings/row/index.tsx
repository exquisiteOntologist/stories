import React from 'react'
import { ListingRowProps } from './interfaces'

export const ListingRow: React.FC<ListingRowProps> = ({ title, linkUrl, action, content, source }) => {
    const description = content && (
        <span className='font-normal ml-6 text-gray-300'>
            {/* {content?.description?.slice(0, 100)} */}
        </span>
    )

    const actionInner = (
        <>
            {title}
            {description}
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
        <article className="relative group border-b border-gray-100">
            <h1 className="text-base mx-0 my-2">
                {/* {sourceLink} */}
                {titleInner}
            </h1>
        </article>
    )
}
