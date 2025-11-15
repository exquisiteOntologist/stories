import { IconButtonProps } from "../icons/interfaces";

export interface PillButtonProps {
  label: string;
  Icon?: React.FC<IconButtonProps>;
  action?: () => void;
  active?: boolean;
  activeClass?: string;
}
