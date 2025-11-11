import { UserStatus } from 'helpers/enums';
import { IApiResponse } from './api-response.interface';

export interface IGetCodeResponse extends IApiResponse {
	value: ICode;
}

export interface ISignUpRequest {
	name: string;
	email: string;
	password: string;
	ipaddress: string;
}

export interface IResendCodeRequest {	
	email: string;
}

export interface ICode {	
	status: UserStatus;
	dateExpires: Date;
}

export interface IForgotPasswordRequest {
	email: string;
}

export interface IResetPasswordRequest {
	code: string;
	password: string;
}

export interface IValidateCodeRequest {
	code: string;
	status: UserStatus;
}