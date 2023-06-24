import React from "react";
import { Navigate, Location, useNavigate } from "react-router-dom";
import { routeCollectionView, routeSearch, routeSourcesEdit } from '../../../data/top-routes'
import { Button } from "../../atoms/button";
import { IconEllipsis } from "../../atoms/icons/ellipsis";
import { IconPaintRoller } from "../../atoms/icons/paint-roller";
import { IconSearch } from "../../atoms/icons/search";
import { IconShapes } from "../../atoms/icons/shapes";
import { ShortcutCommandF } from '../../atoms/icons/shortcuts/shortcut-cmd-f'
import { ShutEye } from "../../atoms/logo/shut-eye";
import { ButtonsGroup } from "../../molecules/buttons-group";
import { SearchShortcutHandlers } from "../../alternate/search-shortcut-handler";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { chooseCollection, selectHistory, setIsCustomizing } from "../../../redux/features/navSlice";

const scrollToTop = () => scrollTo({top: 0})

export interface AppMenuNavigationProps {
    location?: Location
}

const AppMenuNavigation: React.FC<AppMenuNavigationProps> = ({location}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const submergeHistoryIds = useAppSelector(selectHistory)
    
    return (
        <nav className="pointer-events-auto py-4">
            <Button
                Icon={ShutEye}
                label=""
                action={() => {
                    dispatch(setIsCustomizing(false))
                    
                    if (location?.pathname === routeCollectionView) {
                        if (submergeHistoryIds.length <= 1) return

                        const priorId = submergeHistoryIds[submergeHistoryIds.length - 2]

                        dispatch(chooseCollection(priorId))
                    } else {
                        navigate(routeCollectionView)
                    }
                }}
                usePadding={false}
                sideAction={() => {
                    const alreadyAtDest = location?.pathname === routeCollectionView
                    if (alreadyAtDest) scrollToTop()
                }}
            />
        </nav>
    )
}

const AppMenuActions: React.FC<AppHeaderProps> = ({location}) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    return (
        <ButtonsGroup className="grow justify-end pointer-events-auto pl-20 py-4" expands={true} IconExpand={IconEllipsis} leftward={true}>
            <Button
                Icon={IconPaintRoller}
                label="Customize"
                action={() => {
                    dispatch(setIsCustomizing(true))
                    navigate(routeCollectionView)
                }}
            />
            <Button
                Icon={IconShapes}
                label="Sources"
                // linkTo={`${location.pathname}/edit`}
                linkTo={routeSourcesEdit}
            />
            {/* <Button
                Icon={IconWidgets}
                label="Widgets"
                linkTo="/"
                disabled={true}
            /> */}
             {/* <Button
                Icon={IconMagic}
                label="Magic ID"
                action={() => console.log('magic ID')}
                disabled={true}
            /> */}
            <Button
                Icon={IconSearch}
                PopoverIcon={ShortcutCommandF}
                label="Search"
                linkTo={routeSearch}
                disabled={false}
            />
        </ButtonsGroup>
    )
}

const AppHeaderShortcutHandlers: React.FC = () => {
    const navigate = useNavigate()
    
    return (
        <>
            <SearchShortcutHandlers action={() => {
                navigate(routeSearch)
                const searchBox = document.querySelector('#search-box') as HTMLInputElement | null
                searchBox?.focus()
            }} />
        </>
    )
}

interface AppHeaderProps {
    location?: Location
}

const headerStyles: React.CSSProperties = {
    color: 'var(--primary)',
} as React.CSSProperties;

export const AppHeader: React.FC<AppHeaderProps> = ({location}) => (
    <header className="app-header flex items-start justify-between px-4 py-0 sticky top-0 right-0 left-0 z-50 pointer-events-none" style={headerStyles}>
        <AppHeaderShortcutHandlers />
        <div className="app-header--a flex items-center">
            <AppMenuNavigation location={location} />
        </div>
        <div className="app-header--b flex items-center">
            <AppMenuActions location={location} />
        </div>
    </header>
)
