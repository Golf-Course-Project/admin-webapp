import { IApiResponse } from "./api-response.interface";

export interface IFetchReviewApiResponse extends IApiResponse {
	value: IReview;
}

export interface IReview {
	id: string;
	courseId: string;
	experience: number;
	value: number;
	content: string;	
}