import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

// Import Subscription class from RxJS
import { Subscription } from 'rxjs/Subscription';

// Import page components
import { LiveDataPage, AccelerometerPage, LogFilesPage } from '../';

// Import Web Socket providers
import { VpcaWebSocket, ChatWebSocket } from '../../providers';

// Local PageLink interface
interface PageLink
{
	icon: string;
	name: string;
	component: any;
}

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage
{
	// Web Socket connected flags
	public vpcaConnected:boolean = false;
	public chatConnected:boolean = false;

	// Local attribute to store subscriptions
	private subs:Array<Subscription> = [];

	// Array of pages to list on the home page
	// Each page could have an image
	public pages:Array<PageLink> = [
		{
			icon: 'analytics',
			name: 'Live Data Page',
			component : LiveDataPage
		},
		{
			icon: 'copy',
			name: 'Log Files Page',
			component: LogFilesPage
		},
		{
			icon: 'move',
			name: 'Acclerometer Page',
			component: AccelerometerPage
		}
	];

	public constructor(
		private navCtrl: NavController,
		private chat: ChatWebSocket,
		private vpca: VpcaWebSocket
	) {

	}

	public ionViewWillEnter()
	{
		this.listenToWebSocketsStatus();
	}

	private listenToWebSocketsStatus()
	{
		// Subscribe to CHAT connected subject
		let chatSub = this.chat.connected.subscribe((connected:boolean) => this.chatConnected = connected);

		// Subscribe to VPCA connected subject
		let vpcaSub = this.vpca.connected.subscribe((connected:boolean) => this.vpcaConnected = connected);

		// Push subscriptions onto array to unsubscribe when leaving page
		this.subs.push(vpcaSub, chatSub);
	}

	public openPage(page:any)
	{
		if (page != null) {
			this.navCtrl.setRoot(page);
		}
	}

	public ionViewWillLeave()
	{
		// Unsubscribe from each subscription
		this.subs.forEach(sub => sub.unsubscribe());
	}
}
