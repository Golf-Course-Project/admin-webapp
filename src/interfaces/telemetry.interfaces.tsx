import { IApiResponse } from './api-response.interface';

export interface ITelemetry {
	id: string;
	ipAddress: string;
	referer: string;
	courseId: string;
	controller: string;
	request: string;
	response: string;
	dateCreated: Date;
}

export interface ITelemetryListItem {
	id: string;
	courseId: string;
	name: string;
	title: string;
	state: string;
	ipAddress: string;
	referer: string;
	userAgent: string;
	controller: string;
	isFlagged: boolean | null;
	dateCreated: Date | null;
}

export interface ITelemetryListApiResponse extends IApiResponse {
	value: ITelemetryListItem[];
}

export interface IFetchTelemetryApiResponse extends IApiResponse {
	value: ITelemetry | null;
}
