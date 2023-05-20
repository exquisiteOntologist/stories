import React from 'react'
import { ButtonGroupProps } from './interfaces'

/**
 * A group of buttons
 * 
 * @NOTE For the classNames we cannot dynamically create part of a class as TailWind won't work
 */
export const ButtonsGroup: React.FC<ButtonGroupProps> = ({ children, className, expands, IconExpand, leftward = true }) => {   
    const createButtonWrapperClassName = (index: number): string => {
        const buttonWrapperClassNames: string[] = [
            expands ? `${leftward ? 'translate-x-8' : '-translate-x-8'} opacity-0` : '',
            'group-hover:translate-x-0 group-hover:opacity-100',
            // note that sometimes it seems Tailwind doesn't add the duration classes in
            `transition ease-in-out`,
        ]

        return buttonWrapperClassNames.join(' ');
    }

    // Has to be a style instead of a class as Tailwind doesn't do dynamic
    const createButtonWrapperDelayStyle = (index: number): {[key: string]: string | number} => {
        const delay = index * 30; // so visibly reacts immediately 1st is 0 delay
        const duration = 75 + (index ? (75 / index) : 0) // 75 good min. Ternary or infinity.

        const delayStyle = {
            transitionDelay: `${delay}ms`,
            transitionDuration: `${duration}ms`
        }
        
        return delayStyle
    }
    
    const nestedButtons = React.Children.toArray(children).map((child, i) => (
        <span className={createButtonWrapperClassName(i)} style={createButtonWrapperDelayStyle(i)} key={i}>{child}</span>
    ))

    const menuIconClassNames: string[] = [
        'expand-icon flex content-center absolute',
        'px-5',
        'overflow-hidden pointer-events-none',
        'top-1/2 -translate-y-1/2 scale-100',
        `translate-x-0 ${leftward ? 'group-hover:-translate-x-8' : 'group-hover:translate-x-8'} group-hover:scale-150`,
        'opacity-100 group-hover:opacity-0',
        'transition duration-150'
    ]

    const menuIcon = IconExpand && (
        <span className={menuIconClassNames.join(' ')}>
            <IconExpand />
        </span>
    )


    const classNames: string[] = [
        className || '',
        'flex',
        'overflow-x-hidden'
    ]

    return (
        // has pseudo element which overhangs bottom that picks up hover event before cursor reaches
        // using "group" and "group-hover" with the buttons in relation to the parent and overhang
        <div className='buttons-group group relative pointer-events-auto before:absolute before:-inset-0 before:top-full before:h-full'>
            <nav className={classNames.join(' ')}>
                {nestedButtons}
                {menuIcon}
            </nav>
        </div>
    )
}
