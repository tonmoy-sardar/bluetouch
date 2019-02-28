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
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {
  productdetailsType: string = "details";
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public menuCtrl: MenuController,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductdetailsPage');
    this.menuCtrl.close();
  }

}
