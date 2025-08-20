// import { PageProps } from 'gatsby'
import * as React from "react";
import { useEffect, useState } from "react";
// import Helmet from "react-helmet"
import { contentBodiesSelectors } from "../../../redux/features/contentBodiesSlice";
import { contentsSelectors } from "../../../redux/features/contentsSlice";
import {
  selectColours,
  setThemeColours,
} from "../../../redux/features/themeSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { createHslaString } from "../../../utilities/graphics/colours";
import { ReaderViewProps } from "./reader.interfaces";
import "./reader.scss";

const ReaderView: React.FC<ReaderViewProps> = ({ contentId }) => {
  const dispatch = useAppDispatch();
  const content = useAppSelector((s) =>
    contentsSelectors.selectById(s, contentId),
  );
  const contentBody = useAppSelector((s) =>
    contentBodiesSelectors.selectById(s, contentId),
  );
  const colours = useAppSelector(selectColours);
  const coverImage = content?.media?.length ? content.media[0] : null; //.find(m => m.isCover)?.mediaImage[0]

  console.log("content", content);
  console.log("content body", contentBody);

  useEffect(() => {
    // TODO: Fetch content if it hasn't been loaded yet
    // if (!content) dispatch(fetchContent([Number(contentId)]))
  }, [dispatch]);

  // useEffect(() => {
  //     const coverDataUrl = coverImage ? coverImage?.dataUrl : undefined;
  //     if (coverDataUrl) generateContentColours(coverDataUrl).then(v => {
  //         dispatch(setThemeColours(v))
  //     })
  // }, [coverImage, dispatch])

  const showOriginalArticle = true; // future: if scraped article much longer than excerpt
  const [originalArticleLoaded, setOriginalArticleLoaded] = useState(true);

  console.log("original article loaded?", originalArticleLoaded);

  if (!content) return null;

  const articleSourceContent =
    /* contentBody.body?.length > 0 ? contentBody.body : */ ""; // content.description
  const articleHtml = articleSourceContent
    ?.replace(/data-src/gi, "src")
    .replace(/<script/gi, "[script")
    .replace(/script>/gi, "script]");

  const coverImageUrl = coverImage?.src;
  const headerImage = coverImage && (
    <img
      className="mb-20 mx-auto"
      src={coverImageUrl}
      width={/* coverImage?.width */ undefined}
      height={/* coverImage?.height */ undefined}
      alt={content.title}
    />
  );

  // const commentsUrl = content?.contentCommunity?.discussionUrl
  // const comments = commentsUrl && (
  //     <Button
  //         className={'inline-block'}
  //         Icon={IconChat}
  //         label="Comments"
  //         href={commentsUrl}
  //     />
  // )

  const articleTitle = content.title;
  const textContentWidths = `w-full max-w-7xl`;

  return (
    <>
      {/* <Helmet>
                <title>"{articleTitle}" | Semblance</title>
            </Helmet> */}
      <article
        className="reader w-full"
        style={
          {
            /* backgroundColor: colours?.background */
          }
        }
      >
        <header className="reader__header text-center mb-10">
          {headerImage}
          <h1
            className={`text-center text-5xl leading-normal px-4 mx-auto mb-10 ${textContentWidths} contrast-200`}
            style={{
              color: colours?.primaryLightnessAdjusted ?? "currentcolor",
            }}
          >
            <a href={content.url} target="_blank">
              {articleTitle}
            </a>
          </h1>
          {/* <div className='inline-block' style={{ color: colours?.primaryLightnessAdjusted }}>
                        {comments}
                    </div> */}
        </header>
        {showOriginalArticle && content.url ? (
          <iframe
            className={`w-[90vw] h-[80vh] mx-auto ${originalArticleLoaded ? "block" : "hidden"} border-2 border-solid border-slate-400`}
            style={{
              borderColor:
                colours.primaryHslVals &&
                createHslaString(...colours.primaryHslVals, 0.5),
            }}
            src={content.url}
            onLoad={(e) =>
              setOriginalArticleLoaded(
                !!(e.target as HTMLIFrameElement)?.contentWindow?.window.length,
              )
            }
          ></iframe>
        ) : (
          <section
            className={`reader__body w-full max-w-5xl px-4 mb-2 mx-auto ${coverImageUrl ? "has-cover" : ""}`}
            dangerouslySetInnerHTML={{ __html: articleHtml }}
          ></section>
        )}
      </article>
    </>
  );
};

export default ReaderView;
