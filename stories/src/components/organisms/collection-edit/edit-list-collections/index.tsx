import React from 'react'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { Collection } from '../../../../data/chirp-types'
import { EditList, EditListMapperOptions } from '../../../molecules/edit-list/edit-list'
import { EditListItem } from '../../../molecules/edit-list/edit-list-item'
import { selectCollectionId } from '../../../../redux/features/navSlice'
import { removeCollection, selectNestedCollections } from '../../../../redux/features/collectionsSlice'
import { AddCollection } from '../add-collection'

export const EditListCollections: React.FC = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const collections = useAppSelector(selectNestedCollections)

    const collectionMapper = (o: EditListMapperOptions<Collection>) => {
        const {
            isChecked,
            list,
            handleCheckToggle
        } = o

        return list.sort((cA, cB) => (cA.name || '').localeCompare(cB.name || '')).map(c => {
            const title = c.name
            
            return (
                <EditListItem
                    key={c.id}
                    id={Number(c.id).toString()}
                    isChecked={isChecked(c.id)}
                    handleCheck={e => handleCheckToggle(e, c.id)}
                    title={title}
                />
            )
        })
    }

    return (
        <div>
            <AddCollection />
            <EditList
                title="Collection"
                countColour="blue"
                list={collections}
                mapper={collectionMapper}
                deleteDispatch={(selectedIds: number[]) => dispatch(removeCollection({
                    parentCollectionId: collectionId,
                    collectionIds: selectedIds
                }))}
            />
        </div>
    )
}
