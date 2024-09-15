import React from "react";
import { motion } from "framer-motion";
import { SourceLink } from "../source-link/source-link";
import { ListingCardProps } from "./interfaces";
import { motionProps } from "../../../../utilities/animate";
import { Bookmark } from "../../bookmark";
import { ImageCanvas } from '../../../atoms/image-canvas'
import { SettingsLayout } from "../../../../data/chirp-types";

export const ListingCard: React.FC<ListingCardProps> = ({ title, linkUrl, content, source }) => {
    const listingCoverImage = content?.media?.length ? [...content?.media][0] : undefined; //?.sort(m => m.isCover ? 0 : 1)[0]?.mediaImage[0]
    const perfectFit = (pxSize?: number) => (pxSize ? `min(100%, ${pxSize}px)` : "100%");
    const coverImage = listingCoverImage ? ( // && (!listingCoverImage?.width || (listingCoverImage.width > 300)) && (
        <img
            className="object-cover m-auto"
            crossOrigin={undefined}
            src={listingCoverImage?.src}
            alt={title}
            width={undefined /* listingCoverImage?.width */}
            height={undefined /* listingCoverImage?.height */}
            style={{
                width: "100%", // perfectFit(null /* listingCoverImage?.width */),
                height: "100%", // perfectFit(null /* listingCoverImage?.height */)
            }}
        />
    ) : null;

    // const description = content && (
    //     <span className='font-normal ml-6 text-gray-300'>
    //         {/* {content?.description?.slice(0, 100)} */}
    //     </span>
    // )

    const actionBookmark = content && linkUrl && <Bookmark content={content} layout={SettingsLayout.CARDS} />;

    return (
        <motion.article {...motionProps} className="group relative flex flex-col text-center mb-6">
            <a className="flex flex-col w-full" href={linkUrl} target="_blank">
                <picture className="flex flex-col grow w-full aspect-square my-1 rounded-md overflow-hidden empty:bg-gray-100">{coverImage}</picture>
                {
                    typeof listingCoverImage?.src !== 'undefined' && <ImageCanvas src={listingCoverImage?.src} />
                }
            </a>
            <h1 className="grow mx-0 my-2 text-sm">
                <a className="grow font-bold text-current dark:text-slate-300 opacity-70 group-hover:opacity-100 transition-all duration-50" href={linkUrl} target="_blank">
                    {title}
                    {/* {description} */}
                </a>
                <SourceLink source={source} isBlock={true} />
            </h1>
            {actionBookmark}
        </motion.article>
    );
};
