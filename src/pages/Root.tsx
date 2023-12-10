import { Industry, SubIndustry } from "../models/industry";
import React, { useCallback, useEffect, useState } from "react";
import { updateSectionsChild, updateSectionsParent } from "../utils/updateDataHelper";

import { Repeat } from "../icons/Icons";
import { Section } from "../components/Section/Section";
import classNames from "classnames";
import mockData from "../data/SampleData.json";
import styles from "./Root.module.scss";

const Root: React.FC = () => {
	const [leftItems, setLeftItems] = useState<Industry[]>([]);
	const [rightItems, setRightItems] = useState<Industry[]>([]);

	useEffect(() => {
		setLeftItems([...mockData]);
	}, []);

	const handleMoveAllItem = (direction: "RTL" | "LTR") => {
		if (direction === "RTL") {
			setLeftItems([...leftItems, ...rightItems]);
			setRightItems([]);
		} else {
			setRightItems([...rightItems, ...leftItems]);
			setLeftItems([]);
		}
	};

	const moveParentItem = useCallback(
		(item: Industry, direction: "RTL" | "LTR") => {
			const { leftData, rightData } = updateSectionsParent(item.industryId, leftItems, rightItems, direction);
			setLeftItems([...leftData]);
			setRightItems([...rightData]);
		},
		[leftItems, rightItems]
	);

	const onMoveChild = useCallback(
		(subItem: SubIndustry, parentIndustry: Industry, direction: "RTL" | "LTR") => {
			const { leftData, rightData } = updateSectionsChild(
				subItem,
				parentIndustry.industryId,
				leftItems,
				rightItems,
				direction
			);

			console.log(leftData, rightData, direction);

			setLeftItems([...leftData]);
			setRightItems([...rightData]);
		},
		[leftItems, rightItems]
	);

	return (
		<div className={styles.pageContainer}>
			<h2 className={styles.mainTitle}>Industries</h2>
			<div className={styles.sectionWrapper}>
				<div className={styles.sectionContainer}>
					<h3 className={styles.title}>Choose from</h3>
					<Section
						sKey="Left"
						key="Left"
						industries={leftItems}
						moveParentItem={(data) => moveParentItem(data, "LTR")}
						moveChildItem={(data, subIndustry) => onMoveChild(data, subIndustry, "LTR")}
						onMoveAllItems={() => handleMoveAllItem("LTR")}
					/>
				</div>
				<div className={classNames(styles.sectionContainer, styles.seperator)}>
					<Repeat size={32} />
				</div>
				<div className={styles.sectionContainer}>
					<h3 className={styles.title}>Selected</h3>
					<Section
						sKey="Right"
						key="Right"
						industries={rightItems}
						moveParentItem={(data) => moveParentItem(data, "RTL")}
						moveChildItem={(data, subIndustry) => onMoveChild(data, subIndustry, "RTL")}
						onMoveAllItems={() => handleMoveAllItem("RTL")}
					/>
				</div>
			</div>
		</div>
	);
};

export default Root;
