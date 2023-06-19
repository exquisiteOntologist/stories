import React from 'react'
import { FieldProps } from './interfaces'

export const Field: React.FC<FieldProps> = (props) => (
    <input
        {...props}
        className='block border border-slate-400 rounded-md w-full mr-2 px-4 py-2 bg-transparent'
        type="text"
        spellCheck={props.spellCheck ?? 'false'}
        value={props.value}
        onChange={e => props.updater(e.currentTarget.value, e)}
    />
)
