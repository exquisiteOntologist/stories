import { Link } from '@reach/router'
import React from 'react'
import { ButtonProps } from './interfaces'

export const buttonClassesPadding = 'px-5 py-2'
export const buttonClassesHollow = 'border border-slate-800 border-solid text-black'

/**
 * Button with icon and label.
 */
export const Button: React.FC<ButtonProps> = ({ className, label, Icon, linkTo, href, action, usePadding = true, disabled }) => {
    const buttonIcon = Icon && <span className={`relative${label ? ' mr-5' : ''}`}><Icon /></span>
    const buttonLabel = label && <span className="relative">{label}</span>
    const buttonInner = (
        <>
            { buttonIcon }
            { buttonLabel }
        </>
    )

    const classNames: string[] = [
        'flex items-center relative',
        disabled ? '' : 'cursor-pointer',
        'select-none',
        usePadding ? buttonClassesPadding : '',
        'rounded-md contrast-200', // brightness-150 contrast-200
        disabled ? 'opacity-30' : 'opacity-60 hover:opacity-100',
        'focus:opacity-100',
        'transition duration-300',
        'before:block before:absolute before:-inset-0 before:rounded-md before:bg-current',
        'before:opacity-0 before:scale-105',
        disabled ? '' : 'hover:before:opacity-5 hover:before:scale-100',
        // 'focus:before:opacity-100 focus:before:scale-100',
        'before:transition before:duration-300',
    ]

    if (className) classNames.push(className)

    const asLink = () => <Link className={classNames.join(' ')} to={linkTo || ''}>{buttonInner}</Link>
    const asExternalLink = () => <a className={classNames.join(' ')} href={href} target="_blank">{buttonInner}</a>
    const asButton = () => <button className={classNames.join(' ')} onClick={action} disabled={disabled}>{buttonInner}</button>

    if (linkTo) return asLink()
    if (href) return asExternalLink()
    return asButton()
}
