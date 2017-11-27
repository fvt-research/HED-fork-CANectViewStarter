import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import {
	LiveDataPage
} from '../';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage
{
	public pages:Array<any> = [
		{
			img: 'assets/imgs/home/live-data.png',
			component : LiveDataPage
		}
	];

	public constructor(private navCtrl: NavController) {}

	public openPage(page)
	{
		if (page != null) {
			this.navCtrl.setRoot(page);
		}
	}
}
