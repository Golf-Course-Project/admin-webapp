import { MessageCode, AuthMessageCode } from 'helpers/enums';

export interface IStandardApiResponse extends IApiResponse {
	value: string;
}

export interface IApiResponse {
	success: boolean | false;
	message: string;
	messageCode: MessageCode | MessageCode.ExceptionThrown;
	count: number | 0;
}

export interface IAuthApiResponse {
	success: boolean | false;
	message: string;
	messageCode: AuthMessageCode | AuthMessageCode.ExceptionThrown;
	count: number | 0;
	value: string;
}
