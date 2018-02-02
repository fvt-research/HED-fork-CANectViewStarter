import { Injectable } from '@angular/core';
import AbstractWebSocket from './abstract-websocket';

@Injectable()
export class GpsWebSocket extends AbstractWebSocket
{
	protected appName:string = 'GPS';

	protected digestParsedMessage(msg:any):void
	{

	}

	public stream()
	{
		this.send('?WATCH={"enable":true,"json":true}');
	}
}