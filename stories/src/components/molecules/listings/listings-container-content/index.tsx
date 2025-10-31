import React, { useState } from "react";
import {
  ContentDto,
  SettingsLayout,
  SourceDto,
} from "../../../../data/chirp-types";
import { ListingCard } from "../card";
import ListingsContainer from "../listings-container";
import { ListingRow } from "../row";
import { ListingsContainerContentProps } from "./interfaces";
import { Bookmark } from "../../bookmark";
import { RelativeDate } from "../../../atoms/relative-date";
import { SourceLink } from "../source-link/source-link";

export const ListingsContainerContent: React.FC<
  ListingsContainerContentProps
> = ({ className, view, contents, sources }) => {
  const ListingTag = view === SettingsLayout.CARDS ? ListingCard : ListingRow;

  return (
    <ListingsContainer className={className} view={view}>
      {contents.map((c, cI) => {
        const s = sources?.find((s) => s?.id == c.source_id);

        return (
          <ListingTag
            key={c.id}
            id={c.id}
            title={c.title}
            linkUrl={c.url}
            content={c}
            source={s}
            leadingContent={bookmarkAction(c, view)}
            metaDetail={metaDetail(c, s)}
          />
        );
      })}
    </ListingsContainer>
  );
};

const bookmarkAction = (c: ContentDto, v: SettingsLayout) =>
  c && c.url && <Bookmark content={c} layout={v} />;

const metaDetail = (c: ContentDto, s?: SourceDto) => {
  const nodeRecency = c?.date_published && (
    <span className="ml-2 text-sm text-gray-300 dark:text-gray-500 select-none cursor-default">
      <RelativeDate date={c?.date_published} />
    </span>
  );

  const meta = (
    <div className="px-4">
      <SourceLink source={s} isBlock={false} />
      {nodeRecency}
    </div>
  );

  return meta;
};
