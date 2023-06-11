import React from "react";
// some reason @reach/router link does not work properly (because component outside router tags?)
import { WindowLocation } from "@reach/router";
import { routeAppLanding } from '../../../data/top-routes'
import { Button } from "../../atoms/button";
import { IconEllipsis } from "../../atoms/icons/ellipsis";
import { IconMagic } from "../../atoms/icons/magic";
import { IconPaintRoller } from "../../atoms/icons/paint-roller";
import { IconSearch } from "../../atoms/icons/search";
import { IconShapes } from "../../atoms/icons/shapes";
import { IconWidgets } from "../../atoms/icons/widgets";
import { IconShortcutSearch } from '../../atoms/icons/shortcuts/shortcut-cmd-f'
import { ShutEye } from "../../atoms/logo/shut-eye";
import { ButtonsGroup } from "../../molecules/buttons-group";

const scrollToTop = () => scrollTo({top: 0})

const AppMenuNavigation: React.FC = () => (
    <div className="pointer-events-auto py-4">
        <Button
            Icon={ShutEye}
            label=""
            linkTo={routeAppLanding}
            usePadding={false}
            sideAction={() => {
                const alreadyAtDest = location.pathname === routeAppLanding
                if (alreadyAtDest) scrollToTop()
            }}
        />
    </div>
)

const AppMenuActions: React.FC<AppHeaderProps> = ({location}) => (
    <ButtonsGroup className="grow justify-end pointer-events-auto pl-20 py-4" expands={true} IconExpand={IconEllipsis} leftward={true}>
        <Button
            Icon={IconShapes}
            label="Sources"
            // linkTo={`${location.pathname}/edit`}
            linkTo={`/edit`}
        />
        <Button
            Icon={IconPaintRoller}
            label="Customize"
            linkTo="/customize"
        />
        <Button
            Icon={IconWidgets}
            label="Widgets"
            linkTo="/customize"
            disabled={true}
        />
         {/* <Button
            Icon={IconMagic}
            label="Magic ID"
            action={() => console.log('magic ID')}
            disabled={true}
        /> */}
        <Button
            Icon={IconSearch}
            PopoverIcon={IconShortcutSearch}
            label="Search"
            action={() => console.log('search')}
            disabled={false}
        />
    </ButtonsGroup>
)

interface AppHeaderProps {
    location?: WindowLocation<unknown>
}

const headerStyles: React.CSSProperties = {
    color: 'var(--primary)',
} as React.CSSProperties;

export const AppHeader: React.FC<AppHeaderProps> = ({location}) => (
    <header className="app-header flex items-start justify-between px-4 py-0 sticky top-0 right-0 left-0 z-50 pointer-events-none" style={headerStyles}>
        <div className="app-header--a flex items-center">
            <AppMenuNavigation />
        </div>
        <div className="app-header--b flex items-center">
            <AppMenuActions location={location} />
        </div>
    </header>
)
