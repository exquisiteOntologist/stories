import React, { useEffect } from "react";
import { Collection } from "../../../data/chirp-types";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { collectionsSelectors, fetchCollection } from "../../../redux/features/collectionsSlice";
import { chooseCollection, selectHistory as selectHistoryIds } from "../../../redux/features/navSlice";
import { TitleCrumbsProps } from "./interfaces";

export const TitleCrumbs: React.FC<TitleCrumbsProps> = ({ collectionId, title }) => {
    const dispatch = useAppDispatch();
    const submergeHistoryIds = useAppSelector(selectHistoryIds);
    const submergeHistoryItems = useAppSelector((s) => submergeHistoryIds.map((id) => collectionsSelectors.selectById(s, id))).filter((x) => typeof x !== "undefined") as Collection[];

    useEffect(() => {
        dispatch(fetchCollection(submergeHistoryIds));
    }, [submergeHistoryIds]);

    const historyItems = submergeHistoryItems.map((hi) => {
        const last = collectionId === hi.id;
        const cursorStyle = last ? "cursor-default" : "cursor-pointer";
        const colour = last ? "text-yellow-500" : "inherit";
        return (
            <span key={hi.id} className={`text-current ${cursorStyle} mr-3 ${colour}`} onClick={() => dispatch(chooseCollection(hi.id))}>
                {hi.name}
            </span>
        );
    });

    return (
        <hgroup className="mb-24">
            <h1 className="text-4xl font-semibold" title={`hello or ${title}`}>
                {title}
            </h1>
            <h2 className="text-2xl font-semibold select-none">{historyItems}</h2>
        </hgroup>
    );
};
