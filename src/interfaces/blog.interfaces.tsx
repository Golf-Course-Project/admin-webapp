import { IApiResponse } from './api-response.interface';

export interface IBlog {
	id: string;
	title: string;
	pageName: string;
	description: string;
	shortDescription: string;
	defaultImagePath: string;
	isActive: boolean;
	isDraft: boolean;
	dateCreated: Date;
}

export interface IBlogListApiResponse extends IApiResponse {
	value: IBlog[];
}

export interface IFetchBlogApiResponse extends IApiResponse {
	value: IBlog | null;
}
