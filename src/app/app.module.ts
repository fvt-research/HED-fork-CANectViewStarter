/* Angular/Ionic imports */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule, Http, RequestOptions } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

/* Application imports */
import { MyApp } from './app.component';
// Pages
import { HomePage, LiveDataPage } from '../pages/';

import { RestProvider, VpcaWebSocket, ChatWebSocket } from '../providers';

/* 3rd Party imports */

// https://github.com/VadimDez/ngx-order-pipe
import { OrderModule } from 'ngx-order-pipe';

@NgModule({
    declarations: [
        MyApp,
        HomePage,
        LiveDataPage
    ],
    imports: [
        BrowserModule,
        HttpModule,
        OrderModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [ IonicApp ],
    entryComponents: [
        MyApp,
        HomePage,
        LiveDataPage
    ],
    providers: [
        RestProvider,
        VpcaWebSocket,
        ChatWebSocket,
        {
            provide: ErrorHandler,
            useClass: IonicErrorHandler
        }
    ]
})
export class AppModule {}
