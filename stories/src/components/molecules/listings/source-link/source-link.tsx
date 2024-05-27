import React from "react";
import { SourceLinkProps } from "./interfaces";
// import { open } from '@tauri-apps/plugin-shell';

export const SourceLink: React.FC<SourceLinkProps> = ({ source, isBlock }) => {
    if (!source) return null;

    // const openLink = () => {
    //     alert('to openn' + source.site_url)
    //     open(source.site_url)
    // }

    return (
        <a
            className={`group source-link ${isBlock ? "block" : "inline"} truncate text-sm text-gray-300 dark:opacity-70 hover:text-gray-400 transition-all duration-100`}
            href={source.site_url}
            target="_blank"
            // style={{ color: source?.metaBrand?.colourPrimary }}
        >
            {source.name.split(" ").map((word, i) => (
                <span key={i} className="inline-block first-letter:text-gray-300 group-[.source-link]:group-hover:first-letter:text-gray-500">
                    {`${word}`}&nbsp;
                </span>
            ))}
        </a>
    );
};
