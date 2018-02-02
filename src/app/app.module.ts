/* Angular/Ionic imports */
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

/* -----------------Application imports----------------- */
// App component
import { MyApp } from './app.component';

// App pages
import * as PAGES from '../pages';

// App service providers
import * as PROVIDERS from '../providers';

/* ------------------3rd Party imports------------------ */
// https://github.com/VadimDez/ngx-order-pipe
import { OrderModule } from 'ngx-order-pipe';

// Application pages
export const pages:Array<any> = [
    MyApp,
    Object.keys(PAGES).map((k) => PAGES[k])
];

// Application directives
export const directives:Array<any> = [
    // Define any application directives here
];

// Application pipes
export const pipes:Array<any> = [
    // Define any application pipes here
];

// Define our service providers
export const providers:Array<any> = [
    Object.keys(PROVIDERS).map((k) => PROVIDERS[k]),
    {
        provide: ErrorHandler,
        useClass: IonicErrorHandler
    }
];

// Helper for declarations
// This will be page components and directives, pipes, common components
export function getDeclarations() {
    // Unpack each array into single array
    // See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
    return [...pages, ...directives, ...pipes];
}

// Helper for entry components
// This will only be application pages
export function getEntryComponents() {
    return pages;
}

// Helper for service providers
// This will be application service providers
export function getProviders() {
    return providers;
}

/* -----------------App Module Definition----------------- */
@NgModule({
    declarations: getDeclarations(),
    imports: [
        BrowserModule,
        HttpModule,
        OrderModule,
        IonicModule.forRoot(MyApp),
    ],
    bootstrap: [ IonicApp ],
    entryComponents: getEntryComponents(),
    providers: getProviders()
})
export class AppModule {}
