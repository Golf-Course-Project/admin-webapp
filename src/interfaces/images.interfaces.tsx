import { IApiResponse } from './api-response.interface';

export interface IImage {	
	name: string;
	url: string;
}

export interface IFetchImagesApiResponse extends IApiResponse {
	value: IImage[] | null;
}

export interface IPostImagesApiResponse extends IApiResponse {
	value: IImage[] | null;
}
