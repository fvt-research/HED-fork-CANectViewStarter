import { Subject } from 'rxjs/Subject';
import { $WebSocket, WebSocketSendMode, WebSocketConfig } from 'angular2-websocket/angular2-websocket';

import { ENV } from '@app/env';

export const SOCKET_CONFIG:WebSocketConfig = {
	initialTimeout: 1000,
	maxTimeout: 5000,
	reconnectIfNotNormalClose: true
};

abstract class AbstractWebSocket
{
	private rawJsonData:string = '';

	private queuedFrames:Array<any> = [];
	private waitingForResponse:boolean = false;

	protected socket:any;
	protected appName:string;

	public onOpen:Subject<any> = new Subject<any>();
	public onClose:Subject<any> = new Subject<any>();
	public messages:Subject<any> = new Subject<any>();

	public connect():this
	{
		if (this.socket) {
			return this;
		}

		// Create the WebSocket
		try {
			this.socket = new $WebSocket(this.getUrl(), null, SOCKET_CONFIG);
		} catch (e) {
			console.warn(e);
		}

		// Set the send mode
		this.socket.setSend4Mode(WebSocketSendMode.Direct);

		this.socket.onOpen((e) => {
			this.onOpen.next(e);
		});

		this.socket.onClose((e) => {
			this.rawJsonData = '';
			this.onClose.next(e);
		});

		this.socket.getDataStream().subscribe((response) => {
			// Parse the message
			this.parseRawMessage(response);

			// Check if there is a message to send in the queue
			if (this.queuedFrames.length) {
				let frame = this.queuedFrames.shift();
				if (frame) {
					this.socket.send(frame);
				}
			} else {
				this.waitingForResponse = false;
			}
		});

		return this;
	}

	private parseRawMessage(message:any)
	{
		try {
			this.rawJsonData += message.data;
			let newlineIndex;
			do {
				newlineIndex = this.rawJsonData.indexOf('\n');
				if (newlineIndex > -1) {
					// Cutoff newline
					let json = this.rawJsonData.substr(0, newlineIndex);

					// JSON decode
					let parsed = JSON.parse(json);

					// Invoke parsed message handlers/listeners
					this.digestParsedMessage(parsed);
					this.messages.next(parsed);

					if (newlineIndex + 1 < this.rawJsonData.length) {
						this.rawJsonData = this.rawJsonData.substr(newlineIndex + 1);
					} else {
						this.rawJsonData = '';
					}
				}
			} while (newlineIndex > -1);
		} catch (e) {
			console.warn(e);
		}
	}

	protected abstract digestParsedMessage(msg:any):void;

	public get connected():boolean
	{
		if (this.socket) {
			return this.socket.getReadyState() == WebSocket.OPEN;
		}

		return false;
	}

	public send(msg:any):void
	{
		if (!this.waitingForResponse) {
			this.socket.send(msg);
			this.waitingForResponse = true;
		} else {
			this.queuedFrames.push(msg);
		}
	}

	public requestParamValue(label:string)
	{
		this.send({WGP: label});
	}

	public requestPushGroupValues(name:string, max:number, min:number)
	{
		const r = {
			WPUSHG : {
				WPUSHGID : name,
				Maxrate: max,
				Minrate: min
			}
		};
		this.send(r);
	}

	public requestPushGroupMeta(name:string)
	{
		const r = {
			WGPMG: name
		};
		this.send(r);
	}

	public clearPushTopics()
	{
		this.waitingForResponse = true;
		this.socket.send({WPUSHC:''});
	}

	public close()
	{
		this.clearPushTopics();
		this.socket.close(true);
		this.socket = null;
	}

	private getUrl()
	{
		return ENV.WS_URL + this.appName;
	}
}

export default AbstractWebSocket;