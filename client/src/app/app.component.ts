import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';

// Import application pages
import { HomePage, LiveDataPage, LogFilesPage, AccelerometerPage } from '../pages';

// Import VPCA Web Socket interface
import { VpcaWebSocket, ChatWebSocket } from '../providers';

// Page interface
interface Page
{
    title: string;
    component: any;
}

@Component({
  templateUrl: 'app.html'
})
export class CANectViewApp
{
    // Instance of the navigation in the template
    @ViewChild(Nav) nav: Nav;

    // Define our root page
    public rootPage: any = HomePage;

    // Array of pages to display in the sidemenu
    public sideMenuItems: Array<Page> = [
        { title: 'Home', component: HomePage },
        { title: 'Log Files', component: LogFilesPage },
        { title: 'Live System Data', component: LiveDataPage },
        { title: 'Accelerometer', component: AccelerometerPage }
    ];

    /**
     * App component constructor
     *
     * Called once when the application loads
     */
    public constructor(vpca: VpcaWebSocket, chat: ChatWebSocket)
    {
        // Open the connection to VPCA Web Socket
        vpca.connect();
        // Open the connection to CHAT Web Socket
        chat.connect();
    }

    /**
     * openPage
     *
     * Called from app.html whenever a user clicks a sidemenu item
     */
    public openPage(page:Page)
    {
        this.nav.setRoot(page.component);
    }
}
