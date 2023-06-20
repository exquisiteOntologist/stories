import React, { useState } from 'react'
import { ColourNames, H2, Light } from '../../../atoms/headings'
import { ListActionBar } from '../../list-action-bar'

export interface EditListMapperOptions<ListT> {
    isChecked: (id: number) => boolean,
    list: ListT[],
    handleCheckToggle: (e: React.ChangeEvent<HTMLInputElement>, id: number) => void
}

export interface EditListProps<ListT> {
    title: React.ReactFragment | React.ReactElement
    countColour: ColourNames,
    list: ListT[],
    mapper: (o: EditListMapperOptions<ListT>) => JSX.Element[]
    deleteDispatch: (selectedIds: number[]) => unknown
}

export const EditList: React.FC<EditListProps<T>> = ({ title, countColour, list, mapper, deleteDispatch }) => {
    const [selectedIds, setSelectedIds] = useState<number[]>([])

    const handleCheckToggle = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
        const checked: boolean = (e.target as HTMLInputElement)?.checked
        const selected = [...selectedIds]
        if (checked) {
            selected.push(id)
        } else {
            selected.splice(selected.indexOf(id), 1)
        }
        setSelectedIds(selected)
    }

    const showContextActions: boolean = !!selectedIds.length

    const isChecked = (id: number): boolean => selectedIds.includes(id)

    const elList = mapper({
        isChecked,
        list,
        handleCheckToggle
    })

    return (
        <>
            <H2><Light colour={countColour}>{list?.length}</Light> {title}</H2>
            <div className='mb-5'>
                {elList}
            </div>
            <ListActionBar
                show={showContextActions}
                deleteAction={async () => {
                    await deleteDispatch(selectedIds)

                    setSelectedIds([])
                }}
            />
        </>
    )
}
