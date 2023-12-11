import { Industry, SubIndustry } from "../models/industry";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { updateSectionsChild, updateSectionsParent } from "../utils/updateDataHelper";

import { Repeat } from "../icons/Icons";
import { SearchInput } from "../components/Search/Search";
import { Section } from "../components/Section/Section";
import classNames from "classnames";
import mockData from "../data/SampleData.json";
import styles from "./Root.module.scss";

const Root: React.FC = () => {
	const [leftItems, setLeftItems] = useState<Industry[]>([]);
	const [rightItems, setRightItems] = useState<Industry[]>([]);
	const [searchLeftQuery, setLeftSearchQuery] = useState<string>("");
	const [searchRightQuery, setRightSearchQuery] = useState<string>("");

	useEffect(() => {
		setLeftItems([...mockData]);
	}, []);

	const handleMoveAllItem = (direction: "RTL" | "LTR") => {
		if (direction === "RTL") {
			const updatedRightItems = [...rightItems, ...leftItems.map((item) => ({ ...item }))];
			setLeftItems([]);
			setRightItems(updatedRightItems);
		} else {
			const updatedLeftItems = [...leftItems, ...rightItems.map((item) => ({ ...item }))];
			setRightItems([]);
			setLeftItems(updatedLeftItems);
		}
	};

	const onMoveParentItem = useCallback(
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

			setLeftItems([...leftData]);
			setRightItems([...rightData]);
		},
		[leftItems, rightItems]
	);

	const filteredLeftIndustries = useMemo(
		() => leftItems.filter((industry) => industry.name.toLowerCase().includes(searchLeftQuery.toLowerCase())),
		[leftItems, searchLeftQuery]
	);

	const filteredRightIndustries = useMemo(
		() => rightItems.filter((industry) => industry.name.toLowerCase().includes(searchRightQuery.toLowerCase())),
		[rightItems, searchRightQuery]
	);

	return (
		<div className={styles.pageContainer}>
			<h2 className={styles.mainTitle}>Industries</h2>
			<div className={styles.sectionWrapper}>
				<div className={styles.sectionContainer}>
					<div className={styles.header}>
						<h3 className={styles.title}>Choose from</h3>
						<SearchInput value={searchLeftQuery} onChange={(s) => setLeftSearchQuery(s)} />
					</div>
					<Section
						sKey="Left"
						key="Left"
						industries={filteredLeftIndustries}
						moveParentItem={(data) => onMoveParentItem(data, "LTR")}
						moveChildItem={(data, subIndustry) => onMoveChild(data, subIndustry, "LTR")}
						onMoveAllItems={() => handleMoveAllItem("LTR")}
					/>
				</div>
				<div className={classNames(styles.sectionContainer, styles.seperator)}>
					<Repeat size={32} />
				</div>
				<div className={styles.sectionContainer}>
					<div className={styles.header}>
						<h3 className={styles.title}>Selected</h3>
						<SearchInput value={searchLeftQuery} onChange={(s) => setRightSearchQuery(s)} />
					</div>
					<Section
						sKey="Right"
						key="Right"
						industries={filteredRightIndustries}
						moveParentItem={(data) => onMoveParentItem(data, "RTL")}
						moveChildItem={(data, subIndustry) => onMoveChild(data, subIndustry, "RTL")}
						onMoveAllItems={() => handleMoveAllItem("RTL")}
					/>
				</div>
			</div>
		</div>
	);
};

export default Root;
