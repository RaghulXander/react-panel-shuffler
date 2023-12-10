import { useCallback, useEffect, useRef } from "react";

const useClickOutside = (handler: (event: MouseEvent) => void) => {
	const ref = useRef<HTMLDivElement>(null);

	const handleClick = useCallback(
		(event: MouseEvent) => {
			if (ref.current && !ref.current.contains(event.target as Node)) {
				handler(event);
			}
		},
		[handler]
	);

	useEffect(() => {
		document.addEventListener("mousedown", handleClick);
		return () => {
			document.removeEventListener("mousedown", handleClick);
		};
	}, [handleClick]);

	return ref;
};

export default useClickOutside;
