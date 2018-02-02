import { Injectable } from '@angular/core';
import AbstractWebSocket from './abstract-websocket';

@Injectable()
export class ChatWebSocket extends AbstractWebSocket
{
	protected appName:string = 'CHAT';

	protected digestParsedMessage(msg:any):void
	{

	}
}