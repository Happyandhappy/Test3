import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Toast } from '@ionic-native/toast';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import {SearchPage} from '../pages/search/search';
import { SqliteProvider } from '../providers/sqlite/sqlite';
import { ServerProvider } from '../providers/server/server';
import { HttpModule } from '@angular/http';
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SearchPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    SearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    SqliteProvider,
    ServerProvider,
    Toast,
  ]
})
export class AppModule {}
