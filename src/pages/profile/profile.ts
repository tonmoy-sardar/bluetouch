import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  userId:any;
  logged_first_name:any;
  logged_last_name:any;
  logged_user_name:any;
  logged_user_contact_no:any
  logged_user_email:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public woocommerceService: WoocommerceService,
    public userService:UserService
  ) {
    if (localStorage.getItem('isLoggedin')) {
      this.userId =  localStorage.getItem('logged_user_id');
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
      this.logged_user_email = '';
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    this.events1.publish('hideBackButton', false);

  }
  
  gotoPage(routePage) {
    this.navCtrl.push(routePage);
  }

}
