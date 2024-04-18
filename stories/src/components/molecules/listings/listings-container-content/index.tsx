import React, { useState } from "react";
import { SettingsLayout } from "../../../../data/chirp-types";
import { ListingCard } from "../card";
import ListingsContainer from "../listings-container";
import { ListingRow } from "../row";
import { ListingsContainerContentProps } from "./interfaces";
import { IconBookmark } from "../../../atoms/icons/bookmark";

const ActionBookmark: React.FC<{ mouseY: number }> = ({ mouseY }) => {
    const [isDown, setIsDown] = useState(false);
    const [isMoving, setIsMoving] = useState(false);

    setInterval(() => {
        setIsDown(Math.random() > 0.5);
        setIsMoving(true);
    }, 1000);

    setInterval(() => {
        setIsMoving(!isMoving);
    }, 500);

    //  ${isDown ? "translate-y-16" : "translate-y-0"}
    return (
        <button className={`absolute top-0 ${isMoving ? "-rotate-12" : "rotate-0"} -left-6 right-full pr-2 bg-transparent text-rose-500 opacity-50 group-hover:opacity-100 transition-all duration-200`} style={{ transform: `translateY(${mouseY}px)` }}>
            <IconBookmark active={false} />
        </button>
    );
};

const roundUp = (numToRound: number, multiple: number): number => {
    return ((numToRound + multiple - 1) / multiple) * multiple;
};

export const ListingsContainerContent: React.FC<ListingsContainerContentProps> = ({ className, view, contents, sources }) => {
    const [mouseY, setMouseY] = useState(0);

    return (
        <ListingsContainer className={className} view={view} onMouseOver={(e) => setMouseY(roundUp(e.pageY - 604, 48 + 16))}>
            <ActionBookmark mouseY={mouseY} />
            {view === SettingsLayout.CARDS ? contents.map((c, cI) => <ListingCard key={c.id} id={c.id} title={c.title} linkUrl={c.url} content={c} source={sources?.find((s) => s?.id == c.source_id)} />) : contents.map((c, cI) => <ListingRow key={c.id} id={c.id} title={c.title} linkUrl={c.url} content={c} source={sources?.find((s) => s?.id == c.source_id)} />)}
        </ListingsContainer>
    );
};
