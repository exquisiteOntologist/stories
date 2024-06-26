import React from "react";

export const IconArrowCircle: React.FC = () => (
    <svg width="42" height="42" viewBox="0 0 42 42" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
            <circle id="arrow-circle-a" cx="21" cy="21" r="21" />
        </defs>
        <g fill="none" fill-rule="evenodd">
            <mask id="arrow-circle-b" fill="#fff">
                <use xlinkHref="#arrow-circle-a" />
            </mask>
            <use fill="#FFF" xlinkHref="#a" />
            <g mask="url(#arrow-circle-b)" stroke="#000" stroke-width="6">
                <path d="m16 9 14 12-14 12" />
                <path stroke-linecap="square" d="M24.5 21h-22" />
            </g>
        </g>
    </svg>
);
