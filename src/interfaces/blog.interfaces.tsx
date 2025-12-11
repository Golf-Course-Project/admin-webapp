import { IApiResponse } from './api-response.interface';

export interface IBlog {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	author: string;
	publishedDate: string;
	isPublished: boolean;
	tags: string;
	createdDate: string;
	modifiedDate: string;
}

export interface IBlogListApiResponse extends IApiResponse {
	value: IBlog[];
}

export interface IFetchBlogApiResponse extends IApiResponse {
	value: IBlog | null;
}
