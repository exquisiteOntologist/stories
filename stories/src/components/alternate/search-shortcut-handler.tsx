import React, { useCallback, useEffect } from 'react'

export interface SearchShortcutHandlersProps {
    action: () => any
}

export const SearchShortcutHandlers: React.FC<SearchShortcutHandlersProps> = ({action}) => {
    const listenerKeyDown = useCallback((e: KeyboardEvent) => {
        const shortcutPressed = (e.ctrlKey || e.metaKey) && e.key === 'f'
        // console.log('key down', e, shortcutPressed)
        if (shortcutPressed) action()
    }, [])
    
    const listenerKeyUp = useCallback((e: KeyboardEvent) => {
        // 
    }, [])

    useEffect(() => {
        addEventListener('keydown', listenerKeyDown, true)
        return () => removeEventListener('keydown', listenerKeyDown, true)
    }, [listenerKeyDown])

    useEffect(() => {
        addEventListener('keyup', listenerKeyUp, true)
        return () => removeEventListener('keyup', listenerKeyUp, true)
    }, [listenerKeyUp])

    return null
}

