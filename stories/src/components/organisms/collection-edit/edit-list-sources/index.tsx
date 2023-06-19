import React from 'react'
import { selectNestedSources, removeSources } from '../../../../redux/features/sourcesSlice'
import { useAppDispatch, useAppSelector } from '../../../../redux/hooks'
import { SourceDto } from '../../../../data/chirp-types'

import { EditList, EditListMapperOptions } from '../../../molecules/edit-list/edit-list'
import { EditListItem } from '../../../molecules/edit-list/edit-list-item'
import { selectCollectionId } from '../../../../redux/features/navSlice'
import { AddSource } from '../add-source'

export const EditListSources: React.FC = () => {
    const dispatch = useAppDispatch()

    const collectionId = useAppSelector(selectCollectionId)
    const sources = useAppSelector(selectNestedSources)

    const kindClass = (kind: SourceDto['kind']) => kind === 'RSS' ? 'text-red-600' : 'text-yellow-600'

    const sourceMapper = (o: EditListMapperOptions<SourceDto>) => {
        const {
            isChecked,
            list,
            handleCheckToggle
        } = o

        return list.sort((sA, sB) => (sA.name || '').localeCompare(sB.name || '')).map(s => {
            const title = s.name
            const subtitle = (<><span className={`font-bold ${kindClass(s.kind)}`}>{s.kind}&nbsp;</span>{s.url}</>)
    
            return (
                <EditListItem
                    key={s.id}
                    id={Number(s.id).toString()}
                    isChecked={isChecked(s.id)}
                    handleCheck={e => handleCheckToggle(e, s.id)}
                    title={title}
                    subtitle={subtitle}
                />
            )
        })
    }

    return (
        <div>
            <AddSource />
            <EditList
                title="sources"
                countColour="green"
                list={sources}
                mapper={sourceMapper}
                deleteDispatch={(selectedIds: number[]) => dispatch(removeSources({
                    collectionId: collectionId,
                    sourceIds: selectedIds
                }))}
            />
        </div>
    )
}