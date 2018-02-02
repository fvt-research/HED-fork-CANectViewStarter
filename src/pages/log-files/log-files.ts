import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

// Import the REST API Provider
import { RestProvider } from '../../providers';

// Expose the "InputEvent" class
declare var InputEvent:any;

@Component({
  selector: 'page-log-files',
  templateUrl: 'log-files.html',
})
export class LogFilesPage
{
	// Attribute used to display log files
	public rows:Array<any> = [];

	// Attribute to store ALL log files
	public logFiles:Array<any> = [];

	// Flat to indicate if an error occured
	public errorFetching:boolean = false;

	// Flag to indicate first load
	public initialLoad:boolean = true;

	/**
	 * constructor
	 *
	 * Used to "inject" any dependencies and run any setup logic
	 */
	public constructor(private rest: RestProvider, private loadingCtrl: LoadingController) {}

	/**
	 * ionViewWillEnter
	 *
	 * Life cycle hook called whenever the "view" was entered
	 */
	public ionViewWillLoad()
	{
		this.requestLogFiles();
	}

	/**
	 * handleSearch
	 *
	 * Called from the HTML template whenever the text input has changed
	 */
	public handleSearch(event:any)
	{
		// Only handle InputEvents
		if (event instanceof InputEvent) {
			// Capture the search text
			const search = event.target.value;

			// Validate that search text has length and there are log files
			if (search.length && this.logFiles.length) {
				// Filter the log files, set the 'rows' attribute
				this.rows = this.logFiles.filter((file:any) => {
					// Lower case search and file name, check if search exists in file name
					return (file.raw_name.toLowerCase().indexOf(search.toLowerCase()) > -1);
				});
			}
		} else {
			// Set the rows to all files on cancel
			this.rows = this.logFiles;
		}
	}

	/**
	 * requestLogFiles
	 *
	 * Handles calling the rest service to make an API get request to fetch log files
	 * Called from ionViewWillEnter and the HTML template when the "refresh" icon is clicked
	 */
	public requestLogFiles()
	{
		// Create a loading instance while API request is made
		let loading = this.loadingCtrl.create();

		// Show the loading instance
		loading.present();

		// The request 'success' callback function
		// Called on successful request
		const success = (response:any) => {
			// Make sure the 'files' key exists
			if (response.files) {
				// Set the rows attribute to all files
				this.rows = response.files;
				// Set the logFiles attribute to all files
				this.logFiles = response.files;
			}
		};

		// The request 'error' callback function
		// Called on request error
		const error = (error) => {
			// Catch the request error
			this.errorFetching = true;
			complete();
		};

		// The request 'complete' callback function
		// Called when request is complete
		const complete = () => {
			this.initialLoad = false;
			loading.dismiss();
		};

		// Call the rest service to fetch log files
		this.rest.getLogFiles().subscribe(success, error, complete);
	}
}
