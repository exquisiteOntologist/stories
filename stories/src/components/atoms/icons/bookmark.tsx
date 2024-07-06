import React from "react";

interface IconBookmarkProps {
    active: boolean;
    fillColour?: string;
    strokeColour?: string;
}

export const IconBookmark: React.FC<IconBookmarkProps> = ({ active, fillColour = "transparent", strokeColour = "#C6B3B8" }) => (
    <svg width="16" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M14 .5c.414 0 .79.168 1.06.44.272.27.44.646.44 1.06v19.103c0 .414-.168.79-.44 1.06a1.495 1.495 0 0 1-1.592.343l-4.55-1.725a2.5 2.5 0 0 0-1.765-.003l-4.625 1.738c-.388.146-.798.12-1.148-.038a1.495 1.495 0 0 1-.88-1.366V2c0-.414.168-.79.44-1.06C1.21.667 1.585.5 2 .5Z" fill={active ? "#F0315D" : fillColour} stroke={active ? "#DD204B" : strokeColour} strokeWidth={active ? 1 : 2} fillRule="evenodd" />
    </svg>
);
