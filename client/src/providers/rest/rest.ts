/* tslint:disable */
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';

import { ENV } from '@app/env';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

// Enumeration of API endpoints
const enum API_ENDPOINTS
{
	DEMO = 'demo.php',
	LOG_FILES = 'log-files.php'
}

@Injectable()
export class RestProvider
{
	public constructor(private http: Http) {}

	public getLogFiles()
	{
		return this.getRequest(this.buildUrl(API_ENDPOINTS.LOG_FILES)).timeout(5000);
	}

	private getRequest(url:string):Observable<any>
	{
		return this.http.get(url)
			.map(res => res.json())
			.catch((error:any) => Observable.throw(this.handleRequestError(error)));
	}

	private handleRequestError(error)
	{
		console.warn(`RestProvider.handleRequestError: ${error}`);
		return error;
	}

	private buildUrl(path:string)
	{
		return ENV.API_URL + path;
	}
}