import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, AlertController } from 'ionic-angular';
import {CartService} from '../../core/services/cart.service';
/**
 * Generated class for the CartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-cart',
  templateUrl: 'cart.html',
})
export class CartPage {
  logged_user_id;
  customer_cart_data: any = [];
  all_cart_data: any = [];
  img_base_url;
  total_item_price: number;
  isLoggedin: boolean;
  visible_key: boolean;
  userId
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    public alertCtrl: AlertController,
    public cartService:CartService
  ) {
    if (localStorage.getItem('isLoggedin')) {
      this.userId = localStorage.getItem('logged_user_id');
      this.isLoggedin = true;
    }
    else {
      this.userId = '';
      this.isLoggedin = false;
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.populateData();
  }

  populateData() {
    //  this.loader.show(this.lodaing_options);
    if (localStorage.getItem("cart")) {
      this.all_cart_data = JSON.parse(localStorage.getItem("cart"));
      // this.customer_cart_data = this.all_cart_data;
      var filteredData = this.all_cart_data.filter(x => x.user_id == this.logged_user_id)
      this.customer_cart_data = filteredData;
      this.getTotalItemPrice();
      this.visible_key = true
    }
    else {
      this.customer_cart_data = [];
      this.visible_key = true
    }
    console.log(this.customer_cart_data);
  }

  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));    
    this.getTotalItemPrice();    
    console.log("k233",this.customer_cart_data)
  }

  increment(i) {
    var qty = this.customer_cart_data[i].quantity;
    this.customer_cart_data[i].quantity = qty + 1;
    var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id);
    if (index != -1) {
      this.all_cart_data[index].quantity = qty + 1;
      this.setCartData()
    }
    this.cartService.cartNumberStatus(true);
  }

  decrement(i) {
    var qty = this.customer_cart_data[i].quantity;
    if (qty > 1) {
      this.customer_cart_data[i].quantity = qty - 1;
      var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id);
      if (index != -1) {
        this.all_cart_data[index].quantity = qty - 1;
        this.setCartData()
      }
    }
    else {
      this.remove(this.customer_cart_data[i].product_id)
    }
    this.cartService.cartNumberStatus(true);
  }

  // remove(id) {
  //     var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id  && x.product_id == id);
  //     // console.log(index)
  //     if (index != -1) {
  //         this.all_cart_data.splice(index, 1);
  //         this.customer_cart_data.splice(index, 1);
  //         this.setCartData()
  //     }
  // }

  remove(id) {
    let alert = this.alertCtrl.create({
      message: 'Do you want to remove?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Remove',
          handler: () => {
            var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == id);
            console.log(index)
            if (index != -1) {
              this.all_cart_data.splice(index, 1);
              this.customer_cart_data.splice(index, 1);
              this.setCartData()
            }
           console.log("kkkkkkkkkkkkkk123");
           this.cartService.cartNumberStatus(true);
          }
        }
      ]
    });
    alert.present();
  }

  getTotalItemPrice() {
    this.total_item_price = 0;
    this.customer_cart_data.forEach(x => {
      if (x.price > 0) {
        this.total_item_price += (x.price * x.quantity);
      }
      else {
        this.total_item_price += (x.price * x.quantity);
      }
    })
  }

  checkout() {
    if (this.isLoggedin) {
      this.navCtrl.push('CheckoutPage');
    }
    else {
      this.navCtrl.push('LoginPage');
    }
  }

}
