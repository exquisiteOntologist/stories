import React from "react";

export const IconLoadingRing: React.FC = () => (
    <svg width="64" viewBox="0 0 92 92" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink">
        <defs>
            <filter x="-108.7%" y="-106.5%" width="317.4%" height="317.4%" filterUnits="objectBoundingBox" id="ring-c">
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="33" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" in="shadowBlurOuter1" />
            </filter>
            <filter x="-108.7%" y="-106.5%" width="317.4%" height="317.4%" filterUnits="objectBoundingBox" id="ring-f">
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="33" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" in="shadowBlurOuter1" />
            </filter>
            <filter x="-108.7%" y="-106.5%" width="317.4%" height="317.4%" filterUnits="objectBoundingBox" id="ring-h">
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="33" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" in="shadowBlurOuter1" />
            </filter>
            <filter x="-108.7%" y="-106.5%" width="317.4%" height="317.4%" filterUnits="objectBoundingBox" id="ring-j">
                <feOffset dy="2" in="SourceAlpha" result="shadowOffsetOuter1" />
                <feGaussianBlur stdDeviation="33" in="shadowOffsetOuter1" result="shadowBlurOuter1" />
                <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" in="shadowBlurOuter1" />
            </filter>
            <circle id="ring-d" cx="46" cy="23" r="46" />
            <circle id="ring-g" cx="69" cy="46" r="46" />
            <circle id="ring-i" cx="46" cy="68" r="46" />
            <circle id="ring-k" cx="23" cy="46" r="46" />
            <radialGradient cx="50%" cy="0%" fx="50%" fy="0%" r="100%" id="ring-e">
                <stop stop-color="#F9DBA3" offset="0%" />
                <stop stop-color="#F1B569" offset="100%" />
            </radialGradient>
            <path d="M46 0c25.405 0 46 20.595 46 46S71.405 92 46 92 0 71.405 0 46 20.595 0 46 0Zm0 16.851c-16.098 0-29.149 13.05-29.149 29.149 0 16.098 13.05 29.149 29.149 29.149 16.098 0 29.149-13.05 29.149-29.149 0-16.098-13.05-29.149-29.149-29.149Z" id="ring-a" />
        </defs>
        <g fill="none" fill-rule="evenodd">
            <g id="ring" opacity=".487" className="origin-center animate-spin">
                <mask id="ring-b" fill="#fff">
                    <use xlinkHref="#ring-a" />
                </mask>
                <use fill="#000" xlinkHref="#ring-a" />
                <g opacity=".857" mask="url(#ring-b)">
                    <use fill="#000" filter="url(#ring-c)" xlinkHref="#ring-d" />
                    <use fill="url(#ring-e)" xlinkHref="#ring-d" />
                </g>
                <g opacity=".857" mask="url(#ring-b)">
                    <use fill="#000" filter="url(#ring-f)" xlinkHref="#ring-g" />
                    <use fill="url(#ring-e)" xlinkHref="#ring-g" />
                </g>
                <g opacity=".857" mask="url(#ring-b)">
                    <use fill="#000" filter="url(#ring-h)" xlinkHref="#ring-i" />
                    <use fill="url(#ring-e)" xlinkHref="#ring-i" />
                </g>
                <g opacity=".857" mask="url(#ring-b)">
                    <use fill="#000" filter="url(#ring-j)" xlinkHref="#ring-k" />
                    <use fill="url(#ring-e)" xlinkHref="#ring-k" />
                </g>
            </g>
            <path className="origin-center animate-[wiggle_1s_linear_infinite]" d="m48.591 27.442 15.777 27.046A3 3 0 0 1 61.777 59H30.223a3 3 0 0 1-2.591-4.512l15.777-27.046a3 3 0 0 1 5.182 0Z" fill="#EF866C" />
        </g>
    </svg>
);
