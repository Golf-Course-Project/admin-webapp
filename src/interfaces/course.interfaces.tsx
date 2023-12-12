import { IApiResponse } from './api-response.interface';

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
}

export interface ICourseSearch {
	state: string | null;
	text: string | null;
	address: string | null;
	city: string | null;
	email: string | null;
	phone: string | null;
	website: string | null;
	type: string | null;
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
}

export interface IPatchCourseApiResponse extends IApiResponse {
	value: ICourse | null;
}

export interface IFetchCourseApiResponse extends IApiResponse {
	value: ICourse | null;
}