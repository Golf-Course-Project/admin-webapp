import { IApiResponse } from './api-response.interface';

export interface IBlogListApiResponse extends IApiResponse {
	value: IBlogList[];
}

export interface IBlogList {
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

export interface IFetchBlogApiResponse extends IApiResponse {
	value: IBlog | null;
}
