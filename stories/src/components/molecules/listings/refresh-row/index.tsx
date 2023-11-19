import React from 'react'
import { RefreshRowProps } from './interfaces'

export const RefreshRow: React.FC<RefreshRowProps> = ({ refreshAction: action, refreshPossibe}) => {
    return (
        <button className="underline" onClick={action}>{refreshPossibe ? 'Show more recent' : 'Refresh for no reason'}</button>
    )
}