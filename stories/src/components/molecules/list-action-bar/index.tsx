import React from "react";
import { FloatingButton } from "../../atoms/floating-button";
import { IconRemove } from "../../atoms/icons/remove";
import { ListActionBarProps } from "./interface";

export const ListActionBar: React.FC<ListActionBarProps> = ({
  show,
  deleteAction,
}) => (
  <div
    className={`flex justify-center my-5 transition-all duration-150 ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
  >
    <FloatingButton Icon={IconRemove} action={deleteAction} />
  </div>
);
