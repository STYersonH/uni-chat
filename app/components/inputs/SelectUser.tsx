"use client";

import ReactSelect from "react-select";

interface SelectUserProps {
	label: string;
	value?: Record<string, any>; // Record<string, unknown> es un objeto que puede tener cualquier propiedad
	onChange: (value: Record<string, any>) => void; // onChange es una funcion que toma un objeto de tipo Record<string, unknown> como argumento y no retorna nada
	options: Record<string, any>[]; // options es un array de objetos de tipo Record<string, unknown>
	disabled?: boolean;
}

const SelectUser: React.FC<SelectUserProps> = ({
	label,
	value,
	onChange,
	options,
	disabled,
}) => {
	return (
		<div className="z-[100]">
			<label className="block text-sm font-medium leading-6 text-gray-900">
				{label}
			</label>
			<div className="mt-2">
				<ReactSelect
					isDisabled={disabled}
					value={value}
					onChange={onChange}
					options={options}
					menuPortalTarget={document.body}
					styles={{
						menuPortal: (base) => ({ ...base, zIndex: 9999 }),
					}}
					classNames={{
						control: () => "text-sm",
					}}
				/>
			</div>
		</div>
	);
};

export default SelectUser;
