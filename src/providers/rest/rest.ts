import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http } from '@angular/http';

import { ENV } from '@app/env';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class RestProvider
{
	public constructor(private http: Http) {}

	public getLogFiles()
	{
		return this.getRequest(this.buildUrl('logs'));
	}

	private deleteRequest(url:string):Promise<any>
	{
		return new Promise((resolve, reject) => {
			this.http.delete(url)
				.map(res => res.json())
				.subscribe(
					data => resolve(data),
					error => reject(error)
				);
		});
	}

	private getRequest(url:string):Promise<any>
	{
		return new Promise((resolve, reject) => {
			this.http.get(url)
				.map(res => res.json())
				.subscribe(
					data => resolve(data),
					error => reject(error)
				);
		});
	}

	private buildUrl(path:string)
	{
		return ENV.API_URL + path;
	}
}