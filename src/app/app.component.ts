import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,Navbar,Events,ModalController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CategoryService } from '../core/services/category.service';
import { CartService } from '../core/services/cart.service';
import { UserService } from '../core/services/user.service';
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
  logged_first_name:any;
  logged_last_name:any;
  logged_user_name:any;
  logged_user_contact_no:any
  logged_user_email:any;
  isLoggedin:boolean;

  constructor(
    public platform: Platform,
     public statusBar: StatusBar,
      public splashScreen: SplashScreen,
      public  events1:Events,
      public categoryService:CategoryService,
      public modalCtrl : ModalController,
      public cartService:CartService,
      public userService:UserService
      ) {
    this.initializeApp();

    this.events1.subscribe('hideBackButton', (data) =>{
      console.log("Emitted=======>", data); 
      this.hideBackButton = data;
    });

    // if (localStorage.getItem("cart")) {
    //   this.totalCart = JSON.parse(localStorage.getItem("cart")).length;
    // }
    cartService.getCartNumberStatus.subscribe(status => {this.cartNumberStatus(status)});
    userService.getLoginStatus.subscribe(status => this.changeStatus(status));
    this.loadUserInfo();
   
  }

  loadUserInfo() {
    if (localStorage.getItem('isLoggedin')) {
      this.isLoggedin = true;
      this.logged_first_name = localStorage.getItem('logged_first_name');
      this.logged_last_name = localStorage.getItem('logged_last_name');
      this.logged_user_name = localStorage.getItem('logged_user_name');
      this.logged_user_contact_no = localStorage.getItem('logged_user_contact_no');
      this.logged_user_email = localStorage.getItem('logged_user_email');
    }
    else {
      this.logged_first_name = '';
      this.logged_last_name = '';
      this.logged_user_name = '';
      this.logged_user_contact_no = '';
    }
    if (localStorage.getItem("cart")) {
      this.totalCart = JSON.parse(localStorage.getItem("cart")).length;
    }
    else {
      this.totalCart = 0;
    }
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
    console.log(status)
    if (status) {
      if (localStorage.getItem("cart")) {
        this.totalCart = JSON.parse(localStorage.getItem("cart")).length;
      }
      else {
        this.totalCart = 0;
      }
    }
    else{

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

  gotoProductList(routePage) {
    this.nav.push(routePage,{id:''});
  }

  openModal(page) {
    var modalPage = this.modalCtrl.create(page);
    modalPage.present();
  }

  private changeStatus(status: boolean) {
    if (status) {
      this.loadUserInfo();
    }
  }

  logOut() {
    localStorage.clear();
    this.loadUserInfo();
    this.nav.setRoot('LoginPage');
  }

 
}
