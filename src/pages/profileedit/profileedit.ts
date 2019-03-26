import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import {UserService} from '../../core/services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  editProfileForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public woocommerceService: WoocommerceService,
    public userService:UserService,
    private formBuilder: FormBuilder
    ) {
      if (localStorage.getItem('isLoggedin')) {
        this.userId =  localStorage.getItem('logged_user_id');
      }

      this.editProfileForm = this.formBuilder.group({
        first_name: ['', Validators.required],
        last_name: ['', Validators.required],
        email: ['', [
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
        ]],
        username: ['', [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(10)
        ]],
      });
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

  updateProfile() {
    console.log("Update User");
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
    return !this.editProfileForm.get(field).valid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched);
  }

  displayFieldCss(field: string) {
    return {
      'is-invalid': this.editProfileForm.get(field).invalid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched),
      'is-valid': this.editProfileForm.get(field).valid && (this.editProfileForm.get(field).dirty || this.editProfileForm.get(field).touched)
    };
  }

}
