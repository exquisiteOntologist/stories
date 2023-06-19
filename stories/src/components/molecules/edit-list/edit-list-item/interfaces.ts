export interface EditListItemProps {
    key: string | number
    id: string
    isChecked: boolean
    handleCheck: (e: React.ChangeEvent<HTMLInputElement>) => any
    title: React.ReactFragment | React.ReactElement
    subtitle?: React.ReactFragment | React.ReactElement
}
