import { IApiResponse } from './api-response.interface';

export interface IBlog {
	id: string;
	title: string;
	pageName: string;
	description: string;
	shortDescription: string;
	defaultImagePath: string;
	isActive: boolean;
	isPublished: boolean;
	dateCreated: Date;
	datePublished: Date | null;
}

export interface IBlogPatch {
	id: string;
	title: string;
	pageName: string;
	description: string;
	shortDescription: string;	
}

export interface IBlogPublishPatch {
	id: string;	
	isPublished: boolean;	
}

export interface IBlogListApiResponse extends IApiResponse {
	value: IBlog[];
}

export interface IFetchBlogApiResponse extends IApiResponse {
	value: IBlog | null;
}

