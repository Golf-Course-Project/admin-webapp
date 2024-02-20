import { IApiResponse } from './api-response.interface';

export interface IRanking {
	id: string;
	facilityId: string;
	courseId: string;
	source: string;
	sourceRefValueId: number;
	name: string;
	nameRefValueId: number;
	year: number;
	value: number;
}

export interface IRankingPost {
	facilityId: string;
	courseId: string;
	sourceRefValueId: number;
	source: string;
	nameRefValueId: number;
	name: string;
	year: number;
	value: number;
}

export interface IRankingPost2 {
	courseId: string;
	sourceRefValueId: number;	
	nameRefValueId: number;	
	year: number;
	value: number;
}

export interface IOptions{
	sourceRefValueId: number; 
	nameRefValueId: number; 
	year: number;
  }

export interface IListRankingsApiResponse extends IApiResponse {
	value: IRanking[] | null;
}

export interface IPostRankingApiResponse extends IApiResponse {
	value: IRanking | null;
}


