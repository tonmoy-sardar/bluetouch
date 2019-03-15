import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController,Events } from 'ionic-angular';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';

/**
 * Generated class for the SubcategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category',
  templateUrl: 'category.html',
})
export class CategoryPage {
  categoryList: any = [];
  visible_key: boolean;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
  ) {
    
  }

  ionViewDidLoad() {
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    console.log('ionViewDidLoad SubcategoryPage');
    this.getCategory();
  }
  getCategory() {
    this.spinnerDialog.show();
    let params = {
      customer: ''
    }
    let url = Globals.apiEndpoint + 'products/categories/';
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
  gotoProList(id) {
    this.navCtrl.push('ProductlistPage', { id: id });
  }
  goBack() {
    this.navCtrl.pop();
  }

}
