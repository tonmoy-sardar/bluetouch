import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events,ModalController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { FilterPage } from '../filter/filter';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({ segment: 'productlist/:id' })
@Component({
  selector: 'page-productlist',
  templateUrl: 'productlist.html',
})
export class ProductlistPage {
  rating;
  product_list: any = [];
  visible_key: boolean=false;
  catId: any;
  filterUrl:any;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    public modalCtrl: ModalController,
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductlistPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.rating = [1, 2, 3, 4, 5];
    this.catId = this.navParams.get('id');
    if (this.catId != "") {
      this.getProduct(this.navParams.get('id'));
    }
    else {
      this.getAllProduct();
    }

  }

  getProduct(category_id) {
    this.spinnerDialog.show();
    let params = {
      category: category_id,
    }
    let url = Globals.apiEndpoint + 'products/';
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        console.log(res);
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


  getSortedProductList(order_by,meta_key) {
    this.spinnerDialog.show();
    var params;
    if(this.catId !="") {
      params = {
        category:this.catId,
        order:order_by,
        orderby_meta_key:meta_key,
    }
    }
    else {
      params = {
        order:order_by,
        orderby_meta_key:meta_key,
    }
      
    }
    let url = Globals.apiEndpoint + 'products';
    let productUrl:string = this.woocommerceService.authenticateApi('GET',url,params);

    this.categoryService.getProductListByCategoryId(productUrl).subscribe(
        res => {
          this.product_list = res;
          this.visible_key = true;
          this.spinnerDialog.hide();
        },
        error => {
          this.spinnerDialog.hide();
        }
    )
}


  gotoProDetails(id) {
    //this.navCtrl.push(page);
    this.navCtrl.push('ProductdetailsPage', { id: id });
  }
  searchProduct(keyword) {
    this.navCtrl.push('SearchPage', { keyword: keyword });
  }
  goBack() {
    this.navCtrl.pop();
  }

  public filterProductModal(address){
    var data = { type : 'edit',addressData:address };
    var modalPage = this.modalCtrl.create(FilterPage,data);
    modalPage.onDidDismiss(() => {
      // Call the method to do whatever in your home.ts
      console.log('Modal closed');
    });
    modalPage.present();
  } 

 

}
