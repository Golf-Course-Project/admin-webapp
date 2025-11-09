import { IApiResponse } from './api-response.interface';

export interface IGetMyProfileResponse extends IApiResponse {
	value: IMyProfile;
}

export interface IMyProfile {	
	name: string;
	email: string;
	avatar_Url: string;	
	isLocked: boolean;
}

export interface IUpdateMyProfileRequest {
	name: string,
	email: string
}


