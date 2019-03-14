import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,Navbar,Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Navbar) navBar: Navbar;
  rootPage: any;

  pages: Array<{title: string, component: any}>;
  hideBackButton:Boolean =true;

  constructor(
    public platform: Platform,
     public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public  events1:Events
      ) {
    this.initializeApp();

    this.events1.subscribe('hideBackButton', (data) =>{
      console.log("Emitted=======>", data); 
      this.hideBackButton = data;
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      //this.rootPage = '';
      this.nav.setRoot('HomePage');

      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.navBar.backButtonClick = (e:UIEvent)=>{        
        // todo something
        this.nav.pop();
       }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
  gotoPage(routePage)
  {
    console.log(routePage);
    this.nav.push(routePage);
  }

 
}
