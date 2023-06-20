import { ChangeEvent } from "react";

type InputProps = React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>

export interface FieldProps extends InputProps {
    /** Input `value` but required */
    value: InputProps['value'],
    /** Change event handler */
    updater: (v: string, e?: ChangeEvent<HTMLInputElement>) => any
}

