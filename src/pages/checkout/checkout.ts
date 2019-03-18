import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ModalController ,Events} from 'ionic-angular';


/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public modalCtrl: ModalController,
    public events1: Events,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    this.events1.publish('hideBackButton', false);
  }
  selectChange(e){
    console.log(e)
  }

  placeOrder() {
    this.navCtrl.push('OrdersuccessPage');
  }

}
