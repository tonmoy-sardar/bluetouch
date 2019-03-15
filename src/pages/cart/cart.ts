import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,Events } from 'ionic-angular';

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
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public menuCtrl: MenuController,
     public events1: Events,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CartPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.populateData();
  }

  populateData() {
  //  this.loader.show(this.lodaing_options);
  if (sessionStorage.getItem("cart")) {
    this.all_cart_data = JSON.parse(sessionStorage.getItem("cart"));
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
    sessionStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.getTotalItemPrice();
    console.log(this.customer_cart_data)
}

increment(i) {
  var qty = this.customer_cart_data[i].quantity;
  this.customer_cart_data[i].quantity = qty + 1;
  var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id && x.product_id == this.customer_cart_data[i].product_id);
  if (index != -1) {
      this.all_cart_data[index].quantity = qty + 1;
      this.setCartData()
  }
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
}

remove(id) {
    var index = this.all_cart_data.findIndex(x => x.user_id == this.logged_user_id  && x.product_id == id);
    // console.log(index)
    if (index != -1) {
        this.all_cart_data.splice(index, 1);
        this.customer_cart_data.splice(index, 1);
        this.setCartData()
    }
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

checkout()
{
  alert(1);
    if(this.isLoggedin)
    {
      this.navCtrl.push('CheckoutPage');
    }
    else
    {
      this.navCtrl.push('LoginPage');
    }
}

}
