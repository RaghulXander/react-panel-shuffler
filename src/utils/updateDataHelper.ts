import { Industry, SubIndustry } from "../models/industry";

export function updateSectionsParent(
	parentId: number,
	leftData: Industry[],
	rightData: Industry[],
	direction: "LTR" | "RTL"
): { leftData: Industry[]; rightData: Industry[] } {
	const selectedParentIndexLeft = leftData.findIndex((industry) => industry.industryId === parentId);
	const selectedParentIndexRight = rightData.findIndex((industry) => industry.industryId === parentId);

	if (direction === "LTR" && selectedParentIndexLeft !== -1) {
		const selectedParent = leftData.splice(selectedParentIndexLeft, 1)[0];
		rightData.push(selectedParent);
	} else if (direction === "RTL" && selectedParentIndexRight !== -1) {
		const selectedParent = rightData.splice(selectedParentIndexRight, 1)[0];
		leftData.push(selectedParent);
	}

	return { leftData, rightData };
}

export function updateSectionsChild(
	childData: SubIndustry,
	parentId: number,
	leftData: Industry[],
	rightData: Industry[],
	direction: "LTR" | "RTL"
): { leftData: Industry[]; rightData: Industry[] } {
	const selectedParentInLeft = leftData.find((industry) => industry.industryId === parentId);
	const selectedParentInRight = rightData.find((industry) => industry.industryId === parentId);

	if (selectedParentInLeft !== undefined || selectedParentInRight !== undefined) {
		const selectedLeftChildIndex =
			selectedParentInLeft?.subIndustryList.findIndex(
				(subIndustry) => subIndustry.subIndustryId === childData.subIndustryId
			) ?? -1;

		const selectedRightChildIndex =
			selectedParentInRight?.subIndustryList.findIndex(
				(subIndustry) => subIndustry.subIndustryId === childData.subIndustryId
			) ?? -1;

		console.log("dfdfd", selectedParentInRight, selectedParentInLeft);

		if (direction === "LTR" && selectedLeftChildIndex !== -1) {
			const selectedChild = selectedParentInLeft!.subIndustryList[selectedLeftChildIndex];
			if (selectedParentInRight) {
				selectedParentInRight.subIndustryList.push(selectedChild);
				selectedParentInLeft!.subIndustryList.splice(selectedLeftChildIndex, 1);
			} else {
				rightData.push({
					industryId: parentId,
					industryUid: selectedParentInLeft?.industryUid ?? "",
					name: selectedParentInLeft!.name,
					subIndustryList: [selectedChild]
				});
				selectedParentInLeft!.subIndustryList.splice(selectedLeftChildIndex, 1);
			}
		} else if (direction === "RTL" && selectedRightChildIndex !== -1) {
			const selectedChild = selectedParentInRight!.subIndustryList[selectedRightChildIndex];
			if (selectedParentInLeft) {
				selectedParentInLeft.subIndustryList.push(selectedChild);
				selectedParentInRight!.subIndustryList.splice(selectedRightChildIndex, 1);
			} else {
				leftData.push({
					industryId: parentId,
					name: selectedParentInRight!.name,
					subIndustryList: [selectedChild],
					industryUid: selectedParentInRight?.industryUid ?? ""
				});
				selectedParentInRight!.subIndustryList.splice(selectedRightChildIndex, 1);
			}
		}
	}

	console.log("leftData", leftData, rightData);

	return { leftData, rightData };
}
