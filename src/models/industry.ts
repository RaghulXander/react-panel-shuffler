export interface Industry {
	industryId: number;
	name: string;
	subIndustryList: SubIndustry[];
	industryUid: string;
}

export interface SubIndustry {
	subIndustryId: number;
	name: string;
}
