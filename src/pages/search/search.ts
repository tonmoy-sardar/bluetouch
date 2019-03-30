import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events } from 'ionic-angular';
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

@IonicPage({ segment: 'search/:keyword' })
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {
  rating;
  product_list: any = [];
  visible_key: boolean;
  searchKey: any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.rating = [1, 2, 3, 4, 5];
    this.searchKey =this.navParams.get('keyword');
    if (this.searchKey != 0) {
      this.searchProduct(this.navParams.get('keyword'));
    }
    else {
      this.getAllProduct();
    }

  }

  // search(keyword) {
  //   this.searchProduct(keyword);
  // }
  searchProduct(keywords) {
    this.spinnerDialog.show();
    let params = {
      search: keywords,
    }
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getSearchProduct(orderUrl).subscribe(
      res => {
        this.product_list = res;
        this.visible_key = true;
      },
      error => {
        this.visible_key = true;
      }
    )
  }

  getAllProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.product_list = res;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  gotoProDetails(id) {
    //this.navCtrl.push(page);
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }
  goBack() {
    this.navCtrl.pop();
  }

}
