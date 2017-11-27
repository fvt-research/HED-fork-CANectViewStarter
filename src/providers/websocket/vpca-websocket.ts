import { Injectable } from '@angular/core';
import AbstractWebSocket from './abstract-websocket';

@Injectable()
export class VpcaWebSocket extends AbstractWebSocket
{
	protected appName:string = 'VPCA';

	protected digestParsedMessage(msg:any):void
	{

	}
}