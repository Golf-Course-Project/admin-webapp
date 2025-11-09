import { IApiResponse } from './api-response.interface';

export interface IListUsersResponse extends IApiResponse {
	value: IUsers[];
}

export interface IUsers {
	id: string;
	name: string;
	email: string;
	role: string;
	status: number;
	statusText: string;
	isLocked: boolean;
	isDirtyDeleted: boolean;
	loginAttempts: number;	
	dateCreated: Date;
	dateUpdated: Date | null;
	dateLocked: Date | null;
	dateLastAttempt: Date | null;
	dateDeleted: Date | null;
	rowNumber: number;
}

export interface IListUsersRequest {
	name: string | null;
	email: string | null;
	role: string | null;
	status: number;
	isDeleted: boolean;
}

export interface IUserUpdatePatch {
	id: string;
	role: string;
	action: string;
}

