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
	rowNumber: number;
}

export interface ICourse {
	id: string;
	facilityId: string;
	courseName: string;
	facilityName: string;
	address1: string;
	city: string;
	state: string;
	countryRegion: string;
	localRegion: string;	
	rowNumber: number;
}

export interface ICourseSearch {
	state: string | null;
	text: string | null;
	address: string | null;
	city: string | null;
	email: string | null;
	phone: string | null;
	website: string | null;
	pageNumber: number;
}

export interface ICoursePatch {
	id: string;
	name: string;
}

export interface IPatchCourseApiResponse extends IApiResponse {
	value: ICourse | null;
}