import React from 'react'
import { IconGrid } from '../../atoms/icons/grid'
import { IconList } from '../../atoms/icons/list'
import { IconAddCircle } from '../../atoms/icons/add-circle'
import { IconShapes } from '../../atoms/icons/shapes'
import { IconTickCircle } from '../../atoms/icons/tick-circle'
import { useAppDispatch } from '../../../redux/hooks'
import { Button } from '../../atoms/button'
import { CollectionSettings, SettingsLayout } from '../../../data/chirp-types'
import { setCollectionSettings } from '../../../redux/features/collectionSettingsSlice'
import { CollectionCustomizerProps } from './interfaces'
import { setIsCustomizing } from '../../../redux/features/navSlice'

export const CollectionCustomizer: React.FC<CollectionCustomizerProps> = ({ collectionSettings, isCustomizing }) => {
    const dispatch = useAppDispatch()

    const viewIsList = collectionSettings?.layout === SettingsLayout.ROWS

    return (
        <div className={`transition-all duration-100 ${isCustomizing ? 'opacity-1 translate-x-0 translate-y-0' : 'opacity-0 translate-x-3 -translate-y-3'} mb-6`}>
            <div className={`flex justify-start`}>
                <Button
                    label="Done"
                    Icon={IconTickCircle}
                    action={() => dispatch(setIsCustomizing(false))}
                />
                <Button 
                    label={`View as ${viewIsList ? 'Cards' : 'List'}`}
                    Icon={viewIsList ? IconGrid : IconList}
                    action={() => dispatch(setCollectionSettings({
                        ...collectionSettings,
                        layout: viewIsList ? 'CARDS' : 'ROWS'
                    } as CollectionSettings))}
                />
                <Button 
                    label="Add Widget"
                    Icon={IconAddCircle}
                    action={() => void 8}
                    disabled={true}
                />
                <Button
                    Icon={IconShapes}
                    label="Sources"
                    linkTo={`/edit`}
                />
            </div>
        </div>
    )
}
