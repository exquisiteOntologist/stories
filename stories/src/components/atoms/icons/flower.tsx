import React from "react";
import { FilterButtonIconProps } from "./interfaces";

interface IconFlowerProps extends FilterButtonIconProps {
    filled: boolean;
    fillColour?: string;
    strokeColour?: string;
}

export const IconFlower: React.FC<IconFlowerProps> = () => (
    <svg width="32" height="31" viewBox="0 0 32 31" xmlns="http://www.w3.org/2000/svg">
        <g transform="translate(-.27 -.719)" fill="#2F959F" fillRule="evenodd">
            <circle cx="16.271" cy="15.719" r="3" />
            <ellipse cx="16.271" cy="26.219" rx="3" ry="5.5" />
            <ellipse transform="rotate(51 8.061 22.265)" cx="8.061" cy="22.265" rx="3" ry="5.5" />
            <ellipse transform="rotate(103 6.034 13.382)" cx="6.034" cy="13.382" rx="3" ry="5.5" />
            <ellipse transform="rotate(154 11.715 6.258)" cx="11.715" cy="6.258" rx="3" ry="5.5" />
            <ellipse transform="rotate(-154 20.826 6.258)" cx="20.826" cy="6.258" rx="3" ry="5.5" />
            <ellipse transform="rotate(-103 26.507 13.382)" cx="26.507" cy="13.382" rx="3" ry="5.5" />
            <ellipse transform="rotate(-51 24.48 22.265)" cx="24.48" cy="22.265" rx="3" ry="5.5" />
        </g>
    </svg>
);
