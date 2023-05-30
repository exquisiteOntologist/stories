import { Link } from '@reach/router'
import React from 'react'
import { ListingRowProps } from './interfaces'

export const ListingRow: React.FC<ListingRowProps> = ({ title, linkUrl, content, source }) => {
    // @TODO: Make `sourceLink` responsive!
    // const sourceLink = source && (
    //     <a
    //         className='font-semibold text-violet-100 pr-6 max-w-xs absolute right-full whitespace-nowrap group-hover:text-violet-600 transition-all duration-100'
    //         href={source.siteUrl}
    //         target="_blank"
    //         style={{ color: source?.metaBrand?.colourPrimary }}
    //     >
    //         {source.title.split(' ').map((word, i) =>
    //             <span key={i} className='inline-block first-letter:text-violet-200 group-hover:first-letter:text-violet-700'>
    //                 {`${word}`}&nbsp;
    //             </span>
    //         )}
    //     </a>
    // )

    const description = content && (
        <span className='font-normal ml-6 text-gray-300'>
            {content?.description?.slice(0, 100)}
        </span>
    )

    return (
        <article className="relative group border-b border-gray-100">
            <h1 className="text-base mx-0 my-2">
                {/* {sourceLink} */}
                <Link to={linkUrl}>
                    {title}
                    {description}
                </Link>
            </h1>
        </article>
    )
}
