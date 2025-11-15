import { SurfaceProps } from "./interfaces";

/**
 * A Surface component that can be used in buttons/links/etc to create an intuitive clickable surface.
 */
export const Surface: React.FC<SurfaceProps> = ({
  Tag = "div",
  className,
  children,
  bold,
  hasBg,
}) => (
  <Tag
    className={`flex text-base ${bold ? "font-bold" : ""} mx-0 ${className} mb-0 px-4 relative z-10 whitespace-nowrap rounded-md ${hasBg ? "bg-[#F9F9F9] dark:bg-[#1A1E28]" : "bg-transparent"} dark:text-slate-400 select-none`}
  >
    {children}
  </Tag>
);
