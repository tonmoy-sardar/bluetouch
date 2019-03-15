import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,Navbar,Events,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryService } from '../core/services/category.service';
import { CartService } from '../core/services/cart.service';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild(Navbar) navBar: Navbar;
  rootPage: any;

  pages: Array<{title: string, component: any}>;
  hideBackButton:Boolean =true;
  totalCart: number;
  constructor(
    public platform: Platform,
     public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public  events1:Events,
      public categoryService:CategoryService,
      public modalCtrl : ModalController,
      public cartService:CartService
      ) {
    this.initializeApp();

    this.events1.subscribe('hideBackButton', (data) =>{
      console.log("Emitted=======>", data); 
      this.hideBackButton = data;
    });

    // if (sessionStorage.getItem("cart")) {
    //   this.totalCart = JSON.parse(sessionStorage.getItem("cart")).length;
    // }
    cartService.getCartNumberStatus.subscribe(status => this.cartNumberStatus(status));
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

  cartNumberStatus(status: boolean) {
    if (status) {
      if (sessionStorage.getItem("cart")) {
        this.totalCart = JSON.parse(sessionStorage.getItem("cart")).length;
      }
      else {
        this.totalCart = 0;
      }
    }
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

  openModal(page) {
    var modalPage = this.modalCtrl.create(page);
    modalPage.present();
  }

 
}
