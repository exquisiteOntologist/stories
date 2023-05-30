import { Link } from '@reach/router'
import React from 'react'
import { ListingCardProps } from './interfaces'

export const ListingCard: React.FC<ListingCardProps> = ({ title, linkUrl, content, source }) => {
    // const listingCoverImage = [...content?.media]?.sort(m => m.isCover ? 0 : 1)[0]?.mediaImage[0]
    // const perfectFit = (pxSize?: number) => pxSize ? `min(100%, ${pxSize}px)` : '100%'
    // const coverImage = listingCoverImage && (!listingCoverImage?.width || (listingCoverImage.width > 300)) && (
    //     <img
    //         className='object-cover m-auto'
    //         src={listingCoverImage?.url}
    //         alt={title}
    //         width={listingCoverImage?.width}
    //         height={listingCoverImage?.height}
    //         style={{
    //             width: perfectFit(listingCoverImage?.width),
    //             height: perfectFit(listingCoverImage?.height)
    //         }}
    //     />
    // )

    const sourceLink = source && (
        <a
            className='block text-violet-100 group-hover:text-violet-600 transition-all duration-100'
            href={source.siteUrl}
            target="_blank"
            style={{ color: source?.metaBrand?.colourPrimary }}
        >
            {source.title.split(' ').map((word, i) =>
                <span key={i} className='inline-block first-letter:text-violet-200 group-hover:first-letter:text-violet-700'>
                    {`${word}`}&nbsp;
                </span>
            )}
        </a>
    )

    const description = content && (
        <span className='font-normal ml-6 text-gray-300'>
            {/* {content?.description?.slice(0, 100)} */}
        </span>
    )

    return (
        <article className='group flex flex-col text-center mb-6'>
            <Link className='flex flex-col w-full' to={linkUrl}>
                <picture className='flex flex-col grow w-full aspect-square my-1 rounded-md overflow-hidden empty:bg-gray-100'>
                    {/* {coverImage} */}
                </picture>
            </Link>
            <h1 className="text-base grow mx-0 my-2">
                <Link className='grow font-semibold text-gray-500 group-hover:text-black transition-all duration-50' to={linkUrl}>
                    {title}
                    {/* {description} */}
                </Link>
                {sourceLink}
            </h1>
        </article>
    )
}
