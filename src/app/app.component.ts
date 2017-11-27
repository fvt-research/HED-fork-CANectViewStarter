import { Component, ViewChild } from '@angular/core';
import { Nav } from 'ionic-angular';

import { HomePage, LiveDataPage } from '../pages';

@Component({
  templateUrl: 'app.html'
})
export class MyApp
{
    @ViewChild(Nav) nav: Nav;

    rootPage: any = HomePage;

    public pages: Array<{title: string, component: any}> = [
        { title: 'Home', component: HomePage },
        { title: 'Live System Data', component: LiveDataPage }
    ];

    public constructor() {}

    public openPage(page)
    {
        this.nav.setRoot(page.component);
    }
}
