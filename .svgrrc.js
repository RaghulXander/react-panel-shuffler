module.exports = {
	dimensions: true,
	expandProps: false,
	typescript: true,
	svgProps: {
		width: "{props.size ?? 16}",
		height: "{props.size ?? 16}",
		fill: "{props.color}",
		className: "{[props.className ? props.className : undefined].join(' ')}"
	},
	replaceAttrValues: {
		"#000": "{props.color}",
		"#000000": "{props.color}"
	},
	svgoConfig: {
		plugins: [
			{
				name: "preset-default",
				params: {
					overrides: {
						// disable plugins
						removeViewBox: false
					}
				}
			}
		]
	},
	template({ componentName, jsx }, { tpl }) {
		return tpl`
		// THIS IS AUTO GENERATED
		import * as React from 'react';
		import { IconProps } from "../";

		const ${componentName} = (props: IconProps): JSX.Element => ${jsx};

		export default ${componentName};
	`;
	}
};
