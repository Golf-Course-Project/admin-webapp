import { IApiResponse } from './api-response.interface';

export interface IReview {
	id: string;
	courseId: string;
	rating: number;
	content: string;
	dateUpdated: Date;	
}

export interface IReviewPost {	
	rating: number;
	content: string;	
}

export interface IFetchReviewApiResponse extends IApiResponse {
	value: IReview | null;
}

export interface IPostReviewApiResponse extends IApiResponse {
	value: IReview | null;
}