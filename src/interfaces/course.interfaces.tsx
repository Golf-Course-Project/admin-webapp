import { IApiResponse } from './api-response.interface';
import { IFacility } from './facility.interfaces';

export interface ICourseListApiResponse extends IApiResponse {
	value: ICourseList[];
}

export interface ICourseListWithRankingApiResponse extends IApiResponse {
	value: ICourseListWithRanking[];
}

export interface ICourseList {
	id: string;
	facilityId: string;
	courseName: string;
	facilityName: string;
	address1: string;
	city: string;
	state: string;
	countryRegion: string;
	localRegion: string;	
	type: number | null;
	tier: string;
	isReviewed: boolean;
	isRanked: boolean;
	isFeatured: boolean;
	rowNumber: number;
	rankingCount: number;
}

export interface ICourseListWithRanking {
	courseId: string;
	facilityId: string;
	courseName: string;
	facilityName: string;
	city: string;
	state: string;	
	type: number | null;
	tier: string;
	isRanked: boolean;
	isFeatured: boolean;
	isReviewed: boolean;
	isFlagged: boolean;
	rankingSource: string;
	rankingName: string;
	rankingYear: number;
	rankingValue: number;
}

export interface ICourse {
	id: string;
	facilityId: string;
	facilityName: string;
	name: string;
	title: string;
	description: string;
	longitude: number;
	latitude: number;
	address1: string;
	city: string;
	state: string;
	postalCode: number;		
	phone: string;
	email: string;
	website: string;
	type: number;
	designer: string;
	yearOpened: number | null;
	tier:string;
	tags: string;
	priceLow: number;
	priceHigh: number;
	isFeatured: boolean;
	isFlagged: boolean;
	defaultPhoto: string;
	isSynced: boolean;
}

export interface ICourseSearchCriteriaProps {
	state: string | null;
	name: string | null;
	text: string | null;	
	city: string | null;
	postalCode: string | null;	
	type: string | null;
	tag: string | null;
	tier: string | null;
	pageNumber: number;
	isRanked: string | null;
	isFeatured: string | null;
	isFlagged: string | null;
}

export interface ICourseSearchCriteriaBody {
	state: string | null;
	name: string | null;
	text: string | null;	
	city: string | null;	
	isRanked: string | null;
	isFeatured: string | null;
	isFlagged: string | null;
	year: number | null;
	tier: string | null;
	sourceRefValueId: number | null;
	nameRefValueId: number | null;
}

export interface ICoursePatch {
	id: string;
	name: string;
	title: string;
	longitude: number;
	latitude: number;
	address1: string;
	city: string;
	state: string;
	postalCode: number;
	phone: string;
	email: string;
	website: string;
	description: string;
	designer: string;
	yearOpened: number | null;
	tier: string;
	tags: string;
	priceLow: number;
	priceHigh: number;
	isFeatured: boolean;
	isSynced: boolean;
	isFlagged: boolean;
}

export interface ICoursePatchForDefaultPhoto {
	id: string;
	defaultPhoto: string;
}

export interface IPatchCourseApiResponse extends IApiResponse {
	value: ICourse | null;
}

export interface IFetchCourseApiResponse extends IApiResponse {
	value: ICourse | null;
}

export interface IFetchCourseAndFacilityApiResponse extends IApiResponse {
	value: { course: ICourse | null, facility: IFacility | null };
}