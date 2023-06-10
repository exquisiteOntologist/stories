import React from 'react'
import { Button } from '../../atoms/button'
import { IconRemove } from '../../atoms/icons/remove'
import { ListActionBarProps } from './interface'

export const ListActionBar: React.FC<ListActionBarProps> = ({ show, deleteAction }) => (
    <div className={`flex justify-center my-5 transition-all duration-0 ${show ? 'opacity-1' : 'opacity-0'}`}>
        <Button 
            Icon={IconRemove}
            action={deleteAction}
        />
    </div>
)
