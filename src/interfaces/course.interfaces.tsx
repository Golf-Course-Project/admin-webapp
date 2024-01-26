import { IApiResponse } from './api-response.interface';
import { IFacility } from './facility.interfaces';

export interface IListCoursesApiResponse extends IApiResponse {
	value: ICourses[];
}

export interface ICourses {
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
	rowNumber: number;
}

export interface ICourse {
	id: string;
	facilityId: string;
	facilityName: string;
	name: string;
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
	isSynced: boolean;
}

export interface ICourseSearch {
	state: string | null;
	name: string | null;
	text: string | null;	
	city: string | null;
	postalCode: string | null;	
	type: string | null;
	tag: string | null;
	pageNumber: number;
}

export interface ICoursePatch {
	id: string;
	name: string;
	longitude: number;
	latitude: number;
	address1: string;
	city: string;
	postalCode: number;
	phone: string;
	email: string;
	website: string;
	description: string;
	isSynced: boolean;
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