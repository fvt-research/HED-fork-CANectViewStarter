import { Component } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

// Import VPCA Web Socket interface
import { VpcaWebSocket } from '../../providers';

// Import LiveDataPage constants
import { NULL, MIN_RATE, MAX_RATE, PARAM_GROUP } from './live-data.constants';

@Component({
  selector: 'page-live-data',
  templateUrl: 'live-data.html',
})
export class LiveDataPage
{
	private vpcaSubscription:Subscription;

	public order:string = 'name';

	public reverse:boolean = false;

	public liveDataParameters:any=[];

	/**
	 * constructor
	 *
	 * Used to "inject" any dependencies and run any setup logic
	 */
	public constructor(private vpca: VpcaWebSocket)
	{
		/* Any custom initialization logic */
	}

	/**
	 * ionViewWillEnter
	 *
	 * Life cycle hook called whenever the "view" was entered
	 */
	public ionViewWillEnter()
	{
		this.initWebSockets();
	}

	/**
	 * setOrderBy
	 *
	 * Called from the template to order a column
	 */
	public setOrderBy(col:string)
	{
		this.reverse = !this.reverse;
		this.order = col;
	}

	private initWebSockets()
	{
		// Subscribe to any incoming messages from VPCA
		// Set the subscription to local attribute so it can be unsubscribed (destroyed) later
		this.vpcaSubscription = this.vpca.messages.subscribe((message:any) => {
			// Check for meta data response
			if (message.MGPMG && message.MGPMG == PARAM_GROUP) {
				// Parse the metadata
				this.parseParamMetaMessage(message.Values);

				// Request the parameter group at MIN/MAX rates (only have to request once)
				this.vpca.requestPushGroupValues(PARAM_GROUP, MAX_RATE, MIN_RATE);
			}

			// Check for parameter values response
			if (message.MGP) {
				// Parse param value message
				this.parseParamValueMessage(message.MGP);
			}
		});

		// Start by requesting parameter group metadata
		this.vpca.requestPushGroupMeta(PARAM_GROUP);
	}

	/**
	 * parseParamValueMessage
	 *
	 * Parses incoming parameter value messages from VCPA
	 * Updates the parameter in the liveDataParameters array
	 */
	private parseParamValueMessage(msg:any)
	{
		if (msg.ParamVal != NULL) {
			// Find the parameter by label in the array
			let foundParam = this.liveDataParameters.find(param => param.label == msg.MGPLabel);
			// Validate that it is found
			if (foundParam) {
				// Set the value
				let val = msg.ParamVal;

				// Typecast to a number with 2 decimals
				// Any custom logic for different data types could be done here
				if (val != NULL) {
					val = Number(val).toFixed(2);
				}

				// Set the found parameter value which will update it in the array
				foundParam.value = val;
			}
		}
	}

	/**
	 * parseParamMetaMessage
	 *
	 * Parses incoming parameter metadata VCPA
	 * Initializes liveDataParameters array with all parameter metadata
	 */
	private parseParamMetaMessage(values:Array<any>)
	{
		if (!this.liveDataParameters.length) {
			// Iterate over the array of metadata passed in, transform for readability
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

	/**
	 * ionViewWillLeave
	 *
	 * Life cycle hook called whenever the "view" is about to leave
	 * Unsubscribes from VPCA and clears any push topics
	 */
	public ionViewWillLeave()
	{
		this.vpcaSubscription.unsubscribe();
		this.vpca.clearPushTopics();
	}
}