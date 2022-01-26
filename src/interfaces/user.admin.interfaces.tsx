import { IApiResponse } from "./api-response.interface";

export interface IListUsersResponse extends IApiResponse {
	value: IUserList[];
}

export interface IUserList {
	id: string;
	name: string;
	email: string;
	role: string;
	status: number;
	statusText: string;
	loginAttempts: number;	
	dateCreated: Date;
	dateUpdated: Date | null;
	dateLastAttempt: Date | null;
	rowNumber: number;
}

export interface IListUsersRequest {
	name: string | null;
	email: string | null;
	role: string | null;
	status: number;
}


