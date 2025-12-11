import { IApiResponse } from './api-response.interface';

export interface IBlog {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	author: string;
	datePublished: Date | null;
	isPublished: boolean;
	tags: string;
	dateCreated: Date;
	dateUpdated: Date | null;
}

export interface IBlogListApiResponse extends IApiResponse {
	value: IBlog[];
}

export interface IFetchBlogApiResponse extends IApiResponse {
	value: IBlog | null;
}
