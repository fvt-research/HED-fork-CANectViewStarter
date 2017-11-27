import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { VpcaWebSocket } from '../../providers';

import { NULL, MIN_RATE, MAX_RATE, PARAM_GROUP } from './live-data.constants';

@Component({
  selector: 'page-live-data',
  templateUrl: 'live-data.html',
})
export class LiveDataPage
{
	private vpcaSubscription:Subscription;

	public liveDataParameters:any=[];

	public order:string = 'name';
	public reverse:boolean = false;

	public constructor(private vpca: VpcaWebSocket) {}

	public ionViewDidEnter()
	{
		this.initWebSockets();
	}

	public setOrderBy(col:string)
	{
		if (col == this.order) {
			this.reverse = !this.reverse;
		}

		this.order = col;
	}

	private initWebSockets()
	{
		this.vpcaSubscription = this.vpca.connect().messages.subscribe((message:any) => {
			if (message.MGPMG && message.MGPMG == PARAM_GROUP) {
				// Parse meta
				this.parseParamMetaMessage(message.Values);
				// Request param values
				this.vpca.requestPushGroupValues(PARAM_GROUP, MAX_RATE, MIN_RATE);
			}

			if (message.MGP) {
				// Parse param value message
				this.parseParamValueMessage(message.MGP);
			}
		});

		this.vpca.requestPushGroupMeta(PARAM_GROUP);
	}

	private parseParamValueMessage(msg:any)
	{
		if (msg.ParamVal != NULL) {
			let foundParam = this.liveDataParameters.find(param => param.label == msg.MGPLabel);
			if (foundParam) {
				let val = msg.ParamVal;
				if (val != NULL) {
					val = Number(val).toFixed(2);
				}

				foundParam.value = val;
			}
		}
	}

	private parseParamMetaMessage(values:Array<any>)
	{
		if (!this.liveDataParameters.length) {
			this.liveDataParameters = values.map((value:any) => {
				let meta = value.MGPM;
				return {
					label : meta.MGPMLabel,
					name : meta.MGPMName,
					units : meta.UnitsStr,
					value : null
				};
			}).sort((a, b) => b.units.length - a.units.length);
		}
	}

	public ionViewWillLeave()
	{
		this.vpcaSubscription.unsubscribe();
		this.vpca.clearPushTopics();
	}
}