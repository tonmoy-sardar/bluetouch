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

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  rating;
  categoryList: any = [];
  popular_product_list: any;
  visible_key: boolean;
  recently_view_product:any =[];
  all_product_list:any =[];

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
    this.visible_key = false;
    this.menuCtrl.close();
    this.rating = [1, 2, 3, 4, 5];
    this.getCategory();
    this.getPopularProduct();
    this.getAllProduct();
    this.recently_view_product = JSON.parse(localStorage.getItem("recentlyViewdProduct"));
    console.log(this.recently_view_product);


  }
  ionViewDidEnter() {
    this.events1.publish('hideBackButton', true);
  }
  gotoProList(id) {
    this.navCtrl.push('ProductlistPage', { id: id });
  }
  gotoProDetails(id) {
    //this.navCtrl.push(page);
    this.navCtrl.push('ProductdetailsPage', { id: id });
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
    console.log("url", url);

    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log(res);
        this.categoryList = res;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getPopularProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'popular_product/';
    console.log("url", url);

    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log(res);
        this.popular_product_list = res.data;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getAllProduct() {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'products/';
    console.log("url", url);

    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log("All Product==>",res);
        this.all_product_list = res;
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

}
