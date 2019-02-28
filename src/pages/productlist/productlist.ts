import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController } from 'ionic-angular';

/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html',
})
export class ProductlistPage {

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public menuCtrl: MenuController,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductlistPage');
    this.menuCtrl.close();
  }

}
