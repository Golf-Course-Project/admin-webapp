import { IApiResponse } from './api-response.interface';

export interface IAvatarUploadResponse extends IApiResponse {
	value: string;
}