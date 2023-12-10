///* eslint-disable @typescript-eslint/naming-convention */

//import React, { KeyboardEvent, useState } from "react";

//import { createPortal } from "react-dom";

import SvgSearch from "../../icons/Icons/Search";
import styles from "./Search.module.scss";
import { useState } from "react";

//import useClickOutside from "../../hooks/useClickOutside";

export const SearchInput: React.FC<{ onChange: (e: string) => void; value: string }> = ({ onChange, value }) => {
	const [updatedValue, setValue] = useState(value);
	return (
		<div className={styles.inputWrapper}>
			<input
				type="text"
				className={styles.input}
				value={updatedValue}
				onChange={(e) => {
					setValue(e.target.value);
					onChange(e.target.value);
				}}
				placeholder="Search location..."
			/>
			<span className={styles.icon}>
				<SvgSearch size={14} color="#85888c" />
			</span>
		</div>
	);
};
