import React from "react";
import { Navigate, Location, useNavigate } from "react-router-dom";
import { routeCollectionView, routeSearch, routeSourcesEdit } from "../../../data/top-routes";
import { Button } from "../../atoms/button";
// import { IconEllipsis } from "../../atoms/icons/ellipsis";
// import { IconPaintRoller } from "../../atoms/icons/paint-roller";
// import { IconSearch } from "../../atoms/icons/search";
// import { IconShapes } from "../../atoms/icons/shapes";
import { ShortcutCommandF } from "../../atoms/icons/shortcuts/shortcut-cmd-f";
import { ShutEye } from "../../atoms/logo/shut-eye";
import { ButtonsGroup } from "../../molecules/buttons-group";
import { SearchShortcutHandlers } from "../../alternate/search-shortcut-handler";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { chooseCollection, selectHistory, selectIsCustomizing, setIsCustomizing, toggleIsCustomizing } from "../../../redux/features/navSlice";
import { IconFinger } from "../../atoms/icons/finger";
import { IconDisembodied } from "../../atoms/icons/disembodied";
import { IconDiagonalEye } from "../../atoms/icons/diagonal-eye";
// import { IconJoin } from "../../atoms/icons/join";
import { IconOsCheek } from "../../atoms/icons/oscheek";

const scrollToTop = () => scrollTo({ top: 0 });

export interface AppMenuNavigationProps {
    location?: Location;
}

const AppMenuNavigation: React.FC<AppMenuNavigationProps> = ({ location }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const submergeHistoryIds = useAppSelector(selectHistory);

    return (
        <nav className="pointer-events-auto py-4">
            <Button
                Icon={ShutEye}
                label=""
                action={() => {
                    dispatch(setIsCustomizing(false));

                    if (location?.pathname === routeCollectionView) {
                        if (submergeHistoryIds.length <= 1) return;

                        const priorId = submergeHistoryIds[submergeHistoryIds.length - 2];

                        dispatch(chooseCollection(priorId));
                    } else {
                        navigate(routeCollectionView);
                    }
                }}
                usePadding={false}
                sideAction={() => {
                    const alreadyAtDest = location?.pathname === routeCollectionView;
                    if (alreadyAtDest) scrollToTop();
                }}
            />
        </nav>
    );
};

const AppMenuActions: React.FC<AppHeaderProps> = ({ location }) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isCustomizing = useAppSelector(selectIsCustomizing);

    console.log("is custom", isCustomizing);

    return (
        <ButtonsGroup className="pointer-events-auto grow justify-end py-4 pl-20" expands={true} IconExpand={IconOsCheek} leftward={true}>
            <Button
                Icon={IconDiagonalEye}
                label="Style"
                action={() => {
                    const needScroll = !isCustomizing;

                    if (location?.pathname === routeCollectionView) {
                        dispatch(toggleIsCustomizing());
                    } else {
                        dispatch(setIsCustomizing(true));
                        navigate(routeCollectionView);
                    }

                    if (needScroll) scrollToTop();
                }}
            />
            <Button
                Icon={IconDisembodied}
                label="Contents"
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
            <Button Icon={IconFinger} PopoverIcon={ShortcutCommandF} label="Search" linkTo={routeSearch} disabled={false} />
        </ButtonsGroup>
    );
};

const AppHeaderShortcutHandlers: React.FC = () => {
    const navigate = useNavigate();

    return (
        <>
            <SearchShortcutHandlers
                action={() => {
                    navigate(routeSearch);
                    const searchBox = document.querySelector("#search-box") as HTMLInputElement | null;
                    searchBox?.focus();
                }}
            />
        </>
    );
};

interface AppHeaderProps {
    location?: Location;
}

const headerStyles: React.CSSProperties = {
    color: "var(--primary)",
} as React.CSSProperties;

export const AppHeader: React.FC<AppHeaderProps> = ({ location }) => (
    // <header className="app-header pointer-events-none sticky left-0 right-0 top-8 z-50 flex items-start justify-between px-4 py-0" style={headerStyles}>
    <header className="app-header pointer-events-none absolute left-0 right-0 top-0 z-50 flex items-start justify-between px-4 py-0" style={headerStyles}>
        <AppHeaderShortcutHandlers />
        <div className="app-header--a flex items-center">
            <AppMenuNavigation location={location} />
        </div>
        <div className="app-header--b flex items-center">
            <AppMenuActions location={location} />
        </div>
    </header>
);
