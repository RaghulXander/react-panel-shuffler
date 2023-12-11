import { Industry, SubIndustry } from "../../models/industry";
import { Minus, Plus } from "../../icons/Icons";
import React, { useCallback, useState } from "react";
import { useDrag, useDrop } from "react-dnd";

import classNames from "classnames";
import styles from "./Section.module.scss";

export const ItemTypes = {
	PARENT_ITEM: "parent",
	CHILD_ITEM: "child"
};

interface TSectionProps {
	sKey: string;
	industries: Industry[];
	moveParentItem: (item: Industry) => void;
	moveChildItem: (item: SubIndustry, subIndustry: Industry) => void;
	onMoveAllItems: () => void;
}

const DraggableChild: React.FC<{ subIndustry: SubIndustry; industry: Industry; children: React.ReactElement }> = ({
	subIndustry,
	industry,
	children
}) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CHILD_ITEM,
		item: {
			industry,
			subIndustry
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging()
		})
	}));

	return (
		<li
			ref={drag} // Attach the drag ref to the component you want to drag
			key={`${subIndustry.subIndustryId}-${industry.industryId}`}
			style={{ opacity: isDragging ? 0.5 : 1 }}
			className={classNames(styles.item, styles.subItem)}
		>
			{children}
		</li>
	);
};

const DraggableParent: React.FC<{ industry: Industry; children: React.ReactElement }> = ({ industry, children }) => {
	const [{ isDragging }, drag] = useDrag(() => ({
		type: ItemTypes.CHILD_ITEM,
		item: {
			...industry
		},
		collect: (monitor) => ({
			isDragging: !!monitor.isDragging()
		})
	}));

	return (
		<div
			ref={drag}
			key={`${industry.industryUid}`}
			className={styles.label}
			style={{ opacity: isDragging ? 0.5 : 1 }}
		>
			{children}
		</div>
	);
};

export const Section: React.FC<TSectionProps> = ({
	sKey,
	moveParentItem,
	moveChildItem,
	onMoveAllItems,
	industries
}) => {
	const [expandedItems, setExpandedItems] = useState<number[]>([]);

	const toggleExpand = useCallback((id: number) => {
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
						<DraggableParent industry={industry}>
							<React.Fragment key={`fr-${industry.industryUid}-${index}`}>
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
							</React.Fragment>
						</DraggableParent>

						<ul
							className={classNames(styles.subItems, {
								[styles.open]: expandedItems.includes(industry.industryId)
							})}
						>
							{industry.subIndustryList.map((subIndustry) => (
								<DraggableChild subIndustry={subIndustry} industry={industry}>
									<div className={styles.label}>
										<input type="checkbox" onChange={() => moveChildItem(subIndustry, industry)} />
										<span className={styles.name} title={subIndustry.name}>
											{subIndustry.name}
										</span>
									</div>
								</DraggableChild>
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
