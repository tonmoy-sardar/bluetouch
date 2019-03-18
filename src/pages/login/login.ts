import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams, Events, ModalController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

import { UserService } from "../../core/services/user.service";
import { WoocommerceService } from "../../core/services/woocommerce.service";
//var Globals = require("../core/globals");
import * as Globals from '../../core/global';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  loginForm: FormGroup;
  lastPage: any;
  isCart: any;
  customer_cart_data: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public events: Events,
    private toastCtrl: ToastController,
    public menuCtrl: MenuController,
    private formBuilder: FormBuilder,
    private spinnerDialog: SpinnerDialog,
    private userService: UserService,
    private woocommerceService: WoocommerceService,
    public modalCtrl: ModalController
  ) {
    events.publish('hideHeader', { isHeaderHidden: true });
    this.loginForm = this.formBuilder.group({
      email_phone: ["", Validators.required],
      password: ["", Validators.required]
    });
    this.isCart = JSON.parse(localStorage.getItem("cart"));
    console.log("Cart Data==>", this.isCart);
    if (this.isCart != null) {
      this.customer_cart_data = this.isCart;
    }
    else {
      this.customer_cart_data = [];
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.close();
  }

  signIn() {
    if (this.loginForm.valid) {
      let params = {}
      let url = Globals.apiEndpoint + 'login/';
      let loginUserUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
      console.log(this.loginForm.value);
      localStorage.setItem('logged_first_name', 'Rupam')
      localStorage.setItem('logged_last_name', 'Hazra')
      localStorage.setItem('logged_user_name', '9038698104')
      localStorage.setItem('logged_user_contact_no', '9038698104')
      localStorage.setItem('logged_user_email', 'rupam.hazra@gmail.com')
      localStorage.setItem('logged_user_id', '16')
      localStorage.setItem('isLoggedin', 'true')
      this.userService.loginStatus(true)
      this.navCtrl.setRoot('HomePage');
      this.userService.loginStatus(true)
      this.userService.userLogin(loginUserUrl, this.loginForm.value).subscribe(
        res => {
          console.log(res);
          localStorage.setItem('logged_first_name', res.user['first_name'])
          localStorage.setItem('logged_last_name', res.user['last_name'])
          localStorage.setItem('logged_user_email', res.user['email'])
          localStorage.setItem('logged_user_name', res.user['first_name'] + ' ' + res.user['last_name'])
          localStorage.setItem('logged_user_contact_no', res.user['username'])
          localStorage.setItem('logged_user_id', res.user['user_id'].toString())
          this.userService.loginStatus(true)
          this.navCtrl.setRoot('HomePage');
          if (this.customer_cart_data.length > 0) {
            this.customer_cart_data.forEach(x => {
              x.user_id = res.user['user_id'].toString()
            })
            this.setCartData();
            //var navItemRoute = '/cart/'
            this.navCtrl.push('CartPage');
          }
          else {
            this.navCtrl.push('HomePage');
          }
        },
        error => {
          console.log(error);

        }
      )
    }
    else {
      this.markFormGroupTouched(this.loginForm)
    }
  }

  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
  }

  gotoPage(page) {
    this.navCtrl.setRoot(page);
  }

  markFormGroupTouched(formGroup: FormGroup) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        control.controls.forEach(c => this.markFormGroupTouched(c));
      }
    });
  }

  isFieldValid(field: string) {
    return !this.loginForm.get(field).valid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.loginForm.get(field).invalid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched),
      'is-valid': this.loginForm.get(field).valid && (this.loginForm.get(field).dirty || this.loginForm.get(field).touched)
    };
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // openModal(page) {
  //   var modalPage = this.modalCtrl.create(page);
  //   modalPage.present();
  // }


}
