import { EditListItemProps } from "./interfaces";

/** A selectable item that goes in a list */
export const EditListItem: React.FC<EditListItemProps> = ({
    id,
    isChecked,
    handleCheck,
    title,
    subtitle
}) => (
    <div className="select-none">
        <input className="hidden" type="checkbox" id={id} name={id} onChange={handleCheck} />
        <label htmlFor={id} className={`block p-2 p2-3 px-2 -mt-2 -ml-2 -mr-2 max-w-none rounded-md ${isChecked ? 'bg-yellow-200' : ''}`}>
            <h3 className={`${isChecked ? 'text-gray-900' : 'text-current'}`}>{title}</h3>
            {
                subtitle
                    ? <p className={`${isChecked ? 'text-gray-900' : 'text-current'} opacity-30`}>{subtitle}</p>
                    : null
            }
        </label>
    </div>
)
