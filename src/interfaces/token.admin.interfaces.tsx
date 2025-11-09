import { IApiResponse } from './api-response.interface';

export interface IListTokensResponse extends IApiResponse {
	value: ITokens[];
}

export interface ITokens {
	id: string;
	type: string;
	timeStamp: Date;
	expiration: Date;
	lastChecked: Date;
	name: string;	
	email: string;	
	rowNumber: number;
}