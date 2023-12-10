import { Industry, SubIndustry } from "../models/industry";
import { updateSectionsChild, updateSectionsParent } from "../utils/updateDataHelper"; // Replace './yourFunctions' with the file path where your functions are located

describe("updateSectionsParent function", () => {
	let leftData: Industry[];
	let rightData: Industry[];

	beforeEach(() => {
		leftData = [
			{
				industryId: 18,
				industryUid: "I-18",
				name: "Accommodation and Food Services",
				subIndustryList: [
					{ subIndustryId: 283, name: "Traveler Accommodation" },
					{ subIndustryId: 284, name: "RV (Recreational Vehicle) Parks and Recreational Camps" }
				]
			}
		];

		rightData = [
			{
				industryId: 14,
				industryUid: "I-14",
				name: "Administrative and Support and Waste Management and Remediation Services",
				subIndustryList: [
					{ subIndustryId: 238, name: "Office Administrative Services" },
					{ subIndustryId: 239, name: "Facilities Support Services" }
				]
			}
		];
	});

	it("should move selected parent from leftData to rightData with direction LTR", () => {
		const parentId = 18;
		const direction = "LTR";
		const updatedData = updateSectionsParent(parentId, leftData, rightData, direction);

		expect(updatedData.leftData).toHaveLength(0);
		expect(updatedData.rightData).toHaveLength(2);
		expect(updatedData.rightData[1].industryId).toBe(parentId);
	});

	it("should move selected parent from rightData to leftData with direction RTL", () => {
		const parentId = 14;
		const direction = "RTL";
		const updatedData = updateSectionsParent(parentId, leftData, rightData, direction);

		expect(updatedData.leftData).toHaveLength(2);
		expect(updatedData.rightData).toHaveLength(0);
		expect(updatedData.leftData[1].industryId).toBe(parentId);
	});
});

describe("updateSectionsChild function", () => {
	let leftData: Industry[];
	let rightData: Industry[];

	beforeEach(() => {
		leftData = [
			{
				industryId: 18,
				industryUid: "18",
				name: "Accommodation and Food Services",
				subIndustryList: [
					{ subIndustryId: 283, name: "Traveler Accommodation" },
					{ subIndustryId: 284, name: "RV (Recreational Vehicle) Parks and Recreational Camps" }
				]
			}
		];

		rightData = [
			{
				industryId: 14,
				industryUid: "14",
				name: "Administrative and Support and Waste Management and Remediation Services",
				subIndustryList: [
					{ subIndustryId: 238, name: "Office Administrative Services" },
					{ subIndustryId: 239, name: "Facilities Support Services" }
				]
			}
		];
	});

	it("should move selected child from parent in leftData to rightData with direction LTR", () => {
		const parentId = 18;
		const childData: SubIndustry = { subIndustryId: 283, name: "Traveler Accommodation" };
		const direction = "LTR";
		const updatedData = updateSectionsChild(childData, parentId, leftData, rightData, direction);

		expect(updatedData.leftData[0].subIndustryList).toHaveLength(1);
		expect(updatedData.rightData[1].subIndustryList).toHaveLength(1);
		expect(updatedData.rightData[1].subIndustryList[0].subIndustryId).toBe(childData.subIndustryId);
	});

	it("should move selected child from parent in rightData to leftData with direction RTL", () => {
		const parentId = 14;
		const childData: SubIndustry = { subIndustryId: 238, name: "Office Administrative Services" };
		const direction = "RTL";
		const updatedData = updateSectionsChild(childData, parentId, leftData, rightData, direction);

		expect(updatedData.leftData[0].subIndustryList).toHaveLength(2);
		expect(updatedData.rightData[0].subIndustryList).toHaveLength(1);
		expect(updatedData.leftData[1].subIndustryList[0].subIndustryId).toBe(childData.subIndustryId);
	});
});

describe("Child addition when both leftData and rightData have the same parentId", () => {
	const parentId = 1;

	it("should add the child to leftData when both leftData and rightData have the same parentId", () => {
		const childData: SubIndustry = { subIndustryId: 5, name: "Other Crop Farming" };
		const direction = "LTR";

		const leftData: Industry[] = [
			{
				industryId: parentId,
				industryUid: `${parentId}`,
				name: "Agriculture, Forestry, Fishing and Hunting",
				subIndustryList: [
					{ subIndustryId: 1, name: "Oilseed and Grain Farming" },
					{ subIndustryId: 2, name: "Vegetable and Melon Farming" },
					{ subIndustryId: 5, name: "Other Crop Farming" }
				]
			}
		];

		const rightData: Industry[] = [
			{
				industryId: parentId,
				industryUid: `${parentId}`,
				name: "Agriculture, Forestry, Fishing and Hunting",
				subIndustryList: [
					{ subIndustryId: 3, name: "Fruit and Tree Nut Farming" },
					{ subIndustryId: 4, name: "Greenhouse, Nursery, and Floriculture Production" }
				]
			}
		];

		const updatedData = updateSectionsChild(childData, parentId, leftData, rightData, direction);

		expect(updatedData.leftData[0].subIndustryList).toHaveLength(2);
		expect(updatedData.rightData[0].subIndustryList).toHaveLength(3);
		expect(updatedData.rightData[0].subIndustryList[2].subIndustryId).toBe(childData.subIndustryId);
	});
});
