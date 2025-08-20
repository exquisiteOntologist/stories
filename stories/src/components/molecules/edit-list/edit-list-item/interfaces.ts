export interface EditListItemProps {
  id: string;
  isChecked: boolean;
  handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => any;
  title: React.ReactElement | String;
  subtitle?: React.ReactElement;
}
