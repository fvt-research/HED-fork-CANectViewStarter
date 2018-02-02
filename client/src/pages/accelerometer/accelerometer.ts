import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Import CHAT Web Socket interface
import { ChatWebSocket } from '../../providers/websocket';

// Import page constants
import { convertTilt, convertAccel, PARAM_GROUP, MIN_RATE, MAX_RATE } from './accelerometer.constants';

@Component({
  selector: 'page-accelerometer',
  templateUrl: 'accelerometer.html'
})
export class AccelerometerPage
{
	private chatSubscription:Subscription;

	// X-axis acceleration attribute
	public accelSway:string = '0';
	// Y-axis acceleration attribute
	public accelSurge:string = '0';
	// Z-axis acceleration attribute
	public accelHeave:string = '0';

	// X-axis tilt attribute
	public tiltRoll:string = '0';
	// Y-axis tilt attribute
	public tiltPitch:string = '0';
	// Z-axis tilt attribute
	public tiltYaw:string = '0';

	public constructor(private chat: ChatWebSocket)
	{
		// Any custom initialization logic
	}

	public ionViewWillEnter()
	{
		this.initWebSockets();
	}

	private initWebSockets()
	{
		// Create the 'subscription' to incoming messages from CHAT
		this.chatSubscription = this.chat.messages.subscribe((message:any) => {
			// Validate the message
			if (message.MGP) {
				// Parse the message
				this.parseChatMessage(message.MGP);
			}
		});

		// Request the push group values
		this.chat.requestPushGroupValues(PARAM_GROUP, MAX_RATE, MIN_RATE);
	}

	private parseChatMessage(msg:any)
	{
		let paramLabel = msg.MGPLabel;
		let paramValue = Number(msg.ParamVal);

		switch (paramLabel) {
			case 'X_tilt':
				this.tiltRoll = convertTilt(paramValue);
				break;
			case 'Y_tilt':
				this.tiltPitch = convertTilt(paramValue);
				break;
			case 'Z_tilt':
				this.tiltYaw = convertTilt(paramValue);
				break;
			case 'X_accel':
				this.accelSway = convertAccel(paramValue);
				break;
			case 'Y_accel':
				this.accelSurge = convertAccel(paramValue);
				break;
			case 'Z_accel':
				this.accelHeave = convertAccel(paramValue);
				break;
			default:
				break;
		}
	}

	public ionViewWillLeave()
	{
		this.chatSubscription.unsubscribe();
		this.chat.clearPushTopics();
	}
}
