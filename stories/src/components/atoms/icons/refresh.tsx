import React from "react";

// this is a custom icon
export const IconRefresh: React.FC<{ className?: string }> = ({ className }) => (
    // <svg className={className} viewBox="0 0 64 88" xmlns="http://www.w3.org/2000/svg">
    //     <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="2">
    //         <path d="M16.062-.426c-.135 37.095-.135 56.39 0 57.882A15.94 15.94 0 0 0 18.144 64C22.562 71.653 32.347 74.275 40 69.856 47.653 65.438 50.275 55.653 45.856 48 41.438 40.347 31.653 37.725 24 42.144"/>
    //         <path d="M32.197 44.34 24 42.143l2.197-8.196"/>
    //     </g>
    // </svg>
    <svg className={className} viewBox="0 0 64 88" xmlns="http://www.w3.org/2000/svg">
        <g fill="none" fillRule="evenodd" stroke="#000" strokeWidth="2">
            <path d="M16.062-.426c-.135 37.095-.135 56.39 0 57.882A15.94 15.94 0 0 0 18.144 64C22.562 71.653 32.347 74.275 40 69.856 47.653 65.438 50.275 55.653 45.856 48c-3.117-5.4-8.908-8.295-14.736-7.98" />
            <path d="m36 46-6-6 6-6" />
        </g>
    </svg>
);
