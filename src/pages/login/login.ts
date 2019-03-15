import { Component } from '@angular/core';
import { IonicPage, NavController, MenuController, NavParams,Events,ModalController } from 'ionic-angular';
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
  lastPage:any;
  isCart:any;
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
    public modalCtrl : ModalController
    ) {
      events.publish('hideHeader', { isHeaderHidden: true });
      this.loginForm = this.formBuilder.group({
        email_phone: ["", Validators.required],
        password: ["", Validators.required]
      });
      this.isCart = JSON.parse(sessionStorage.getItem("cart"));
      console.log(this.isCart);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.menuCtrl.close();
  }

  signIn() {
    if (this.loginForm.valid) {
      let params = {}
      let url = Globals.apiEndpoint + 'login/';
      let loginUserUrl:string = this.woocommerceService.authenticateApi('POST',url,params);
      console.log(this.loginForm.value);
      this.navCtrl.setRoot('HomePage');
      this.userService.userLogin(loginUserUrl,this.loginForm.value).subscribe(
        res => {
          console.log(res);
         
        },
        error => {
         console.log(error);
          
        }
      )
    }
    // if (this.loginForm.valid) {
    //   console.log(this.loginForm);
    //   //this.spinnerDialog.show();
    //   // this.loginService.userLogin(this.loginForm.value).subscribe(
    //   //   res => {
    //   //     localStorage.setItem('isLoggedin', 'true');
    //   //     localStorage.setItem('userId', res['result']['id']);
    //   //     localStorage.setItem('userName', res['result']['name']);
    //   //     localStorage.setItem('userEmail', res['result']['email']);
    //   //     localStorage.setItem('userContact', res['result']['contact']);
    //   //     localStorage.setItem('userImage', res['result']['profile_image']);
    //   //     this.loginService.loginStatus(true);
    //   //     this.presentToast("Succesfully Login");
    //   //     if(this.lastPage.id =='ForgotPasswordPage' || this.lastPage.id =='SignupPage' || this.lastPage.id =='ProductdetailsPage' || this.lastPage.id =='RecipedetailsPage'  ) {
    //   //       this.lastPage.id ='HomePage';
    //   //     }
    //   //     if(this.isCart ==null || this.isCart.length==0) {
    //   //       //this.navCtrl.setRoot('HomePage');
    //   //       this.navCtrl.setRoot(this.lastPage.id);
            
    //   //     }
    //   //     else if(this.lastPage.id =='ForgotPasswordPage' || this.lastPage.id =='SignupPage' || this.lastPage.id =='ProductdetailsPage' || this.lastPage.id =='RecipedetailsPage'  ) {
    //   //       this.navCtrl.setRoot('HomePage');
    //   //     }
    //   //     else {
    //   //       this.navCtrl.setRoot('CartPage');
    //   //     }
    //   //     this.spinnerDialog.hide();
    //   //   },
    //   //   error => {
    //   //     this.presentToast("Please enter valid login credentials");
    //   //     this.spinnerDialog.hide();

    //   //   }
    //   // )
    // }
     else {
      this.markFormGroupTouched(this.loginForm)
    }
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
