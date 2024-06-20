import { Link } from "react-router-dom";
import React from "react";
import { ButtonProps } from "./interfaces";

export const buttonClassesPadding = "px-3 py-2";
export const buttonClassesHollow = "border border-current border-solid current";

/**
 * Button with icon and label.
 */
export const Button: React.FC<ButtonProps> = ({ className, children, label, Icon, PopoverIcon, linkTo, href, action, sideAction, usePadding = true, disabled }) => {
    const buttonIcon = Icon && (
        <span className={`relative${label ? " mr-2" : ""}`}>
            <Icon />
        </span>
    );
    const buttonLabel = label && <span className="relative">{label}</span>;
    const buttonPopoverIcon = PopoverIcon && (
        <span className="absolute -bottom-6 right-2 opacity-0 group-hover:opacity-100 transition-all duration-100">
            <PopoverIcon />
        </span>
    );
    const buttonInner = (
        <>
            {buttonIcon}
            {buttonLabel}
            {children}
            {buttonPopoverIcon}
        </>
    );

    const classNames: string[] = [
        "flex items-center relative group",
        disabled ? "cursor-default pointer-events-none" : "cursor-pointer",
        "select-none",
        usePadding ? buttonClassesPadding : "",
        "rounded-md contrast-200", // brightness-150 contrast-200
        disabled ? "opacity-30" : "opacity-60 hover:opacity-100",
        "focus:opacity-100",
        "transition duration-300",
        "before:block before:absolute before:-inset-0 before:rounded-md before:bg-current",
        "before:opacity-0 before:scale-105",
        disabled ? "" : "hover:before:opacity-5 hover:before:scale-100",
        // 'focus:before:opacity-100 focus:before:scale-100',
        "before:transition before:duration-300",
    ];

    if (className) classNames.push(className);

    const asLink = () => (
        <Link className={classNames.join(" ")} to={linkTo || ""} onClick={() => sideAction && sideAction()}>
            {buttonInner}
        </Link>
    );
    const asExternalLink = () => (
        <a className={classNames.join(" ")} href={href} target="_blank">
            {buttonInner}
        </a>
    );
    const asButton = () => (
        <button
            className={classNames.join(" ")}
            onClick={() => {
                action && action();
                sideAction && sideAction();
            }}
            disabled={disabled}
        >
            {buttonInner}
        </button>
    );

    if (linkTo) return asLink();
    if (href) return asExternalLink();
    return asButton();
};
