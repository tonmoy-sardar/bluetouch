import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';

/**
 * Generated class for the OrdersuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ordersuccess',
  templateUrl: 'ordersuccess.html',
})
export class OrdersuccessPage {

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public events1: Events,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrdersuccessPage');
    this.events1.publish('hideBackButton', false);
  }

}
