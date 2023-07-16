import React from 'react'
import { SourceLinkProps } from './interfaces'

export const SourceLink: React.FC<SourceLinkProps> = ({source, isBlock }) => source ? (
    <a
        className={`${isBlock ? 'block' : 'inline ml-2'} text-violet-300 dark:opacity-70 group-hover:text-violet-600 transition-all duration-100`}
        href={source.site_url}
        target="_blank"
        // style={{ color: source?.metaBrand?.colourPrimary }}
    >
        {source.name.split(' ').map((word, i) =>
            <span key={i} className='inline-block first-letter:text-violet-400 group-hover:first-letter:text-violet-700'>
                {`${word}`}&nbsp;
            </span>
        )}
    </a>
) : null
