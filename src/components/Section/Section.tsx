import { Industry, SubIndustry } from "../../models/industry";
import { Minus, Plus } from "../../icons/Icons";
import React, { useCallback, useState } from "react";

import classNames from "classnames";
import styles from "./Section.module.scss";

interface TSectionProps {
	sKey: string;
	industries: Industry[];
	moveParentItem: (item: Industry, subIndustry?: Industry) => void;
	moveChildItem: (item: SubIndustry, subIndustry: Industry) => void;
	onMoveAllItems: () => void;
}

export const Section: React.FC<TSectionProps> = ({
	sKey,
	moveParentItem,
	moveChildItem,
	onMoveAllItems,
	industries
}) => {
	console.log("industries", industries);
	const [expandedItems, setExpandedItems] = useState<number[]>([]);

	const toggleExpand = useCallback((id: number) => {
		console.log("iddd", id);
		setExpandedItems((prevExpandedItems) => {
			if (prevExpandedItems.includes(id)) {
				return prevExpandedItems.filter((item) => item !== id);
			} else {
				return [...prevExpandedItems, id];
			}
		});
	}, []);

	return (
		<section className={styles.sectionWrapper}>
			<ul className={styles.sectionContainer}>
				{industries.map((industry, index) => (
					<li key={`${industry.industryUid}-${index}`} className={styles.item}>
						<div className={styles.label}>
							<button
								className={styles.toggleButton}
								onClick={(e) => {
									e.stopPropagation();
									toggleExpand(industry.industryId);
								}}
							>
								{expandedItems.includes(industry.industryId) ? (
									<Minus size={16} color="#73b892" />
								) : (
									<Plus size={16} color="#73b892" />
								)}
							</button>
							<input
								type="checkbox"
								onChange={(e) => {
									e.stopPropagation();
									moveParentItem(industry);
								}}
							/>
							<div className={styles.name}>{industry.name}</div>
						</div>
						<ul
							className={classNames(styles.subItems, {
								[styles.open]: expandedItems.includes(industry.industryId)
							})}
						>
							{industry.subIndustryList.map((subIndustry) => (
								<li
									key={`${industry.industryUid}-${subIndustry.subIndustryId}-${sKey}`}
									className={classNames(styles.item, styles.subItem)}
								>
									<label className={styles.label}>
										<input type="checkbox" onChange={() => moveChildItem(subIndustry, industry)} />
										<span className={styles.name} title={subIndustry.name}>
											{subIndustry.name}
										</span>
									</label>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
			<button className={styles.moveAll} onClick={() => onMoveAllItems()}>
				Move All
			</button>
		</section>
	);
};
