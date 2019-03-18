import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';

/**
 * Generated class for the ProfileeditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profileedit',
  templateUrl: 'profileedit.html',
})
export class ProfileeditPage {
  userId:any;
  logged_first_name:any;
  logged_last_name:any;
  logged_user_name:any;
  logged_user_contact_no:any
  logged_user_email:any;
  user_details:any ={};
  visible_key :boolean =false;
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
      }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfileeditPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    console.log('ionViewDidLoad ProfileviewPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.userDetails();
  }
  userDetails() {
    this.spinnerDialog.show();
    let params = {
    }
    let url = Globals.apiEndpoint + 'customers/' + this.userId;
    let userDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.userService.getUserDetails(userDeatilsUrl).subscribe(
      res => {
        this.user_details = res;
        console.log("User Details ==>", this.user_details);
        this.visible_key =true;
      },
      error => {
        console.log(error);
        this.spinnerDialog.hide();
        this.visible_key =true;
      }
    )
  }

}
