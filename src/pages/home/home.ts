import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,Events } from 'ionic-angular';

import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  rating;
  categoryList :any =[];
  visible_key:boolean;

  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public menuCtrl: MenuController,
     private spinnerDialog: SpinnerDialog,
     public categoryService:CategoryService,
     public woocommerceService:WoocommerceService,
     public  events1:Events
     ) {
  }

  ionViewDidLoad() {
    this.visible_key = false;
    this.menuCtrl.close();
    this.rating = [1, 2, 3, 4, 5];
    this.getCategory();
  }
  ionViewDidEnter(){
    this.events1.publish('hideBackButton', true);
  }
  gotoDetails(page) {
    this.navCtrl.push(page);
  }
  gotoPage(page) {
    this.navCtrl.push(page);
  }
  getCategory() {
    this.spinnerDialog.show();
    let params = {
      customer: ''
  }
  let url = Globals.apiEndpoint + 'products/categories/';
console.log("url",url);
  
  let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

  this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
          console.log(res);
          this.categoryList = res;
          this.visible_key = true;
      },
      error => {
        this.visible_key = true;
      }
  )
  }

}
