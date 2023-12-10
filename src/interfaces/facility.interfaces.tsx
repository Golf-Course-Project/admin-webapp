import { IApiResponse } from "./api-response.interface";

export interface IFetchFacilityApiResponse extends IApiResponse {
	value: IFacility;
}

export interface IFacility {
	id: string;
	name: string;
	description: string;
	address1: string;
	address2: string;
	city: string;
	state: string;
	postalCode: number;
	longitude: number;
	latitude: number;
	phone: string;
	email: string;
	website: string;
	instagram: string;	
	facebook: string;
	type: number;
}

export interface IPatchFacilityApiResponse extends IApiResponse {
	value: IFacility | null;
}
