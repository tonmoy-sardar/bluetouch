import { Component } from '@angular/core';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { IonicPage, NavController, NavParams, ToastController, ModalController, Events } from 'ionic-angular';
import * as Globals from '../../core/global';
import { WoocommerceService } from "../../core/services/woocommerce.service";
//import { PaymentService } from '../../core/services/payment.service';
import { PaymentService, OrderModule, line_items, coupon_lines, meta_data, PaymentRadioOption, AddressRadioOption } from "../../core/services/payment.service";
import { AddressPage } from '../address/address';
import { CartService } from '../../core/services/cart.service';
/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {
  visible_key: boolean = false;
  isLoggedin: boolean;
  payment_option_list: any;
  paymentOptions: any = [];
  payment_type: string;
  selectedAddres: any;
  customer_cart_data: any = [];
  address_selected: boolean;
  //addressOptions?: Array<AddressRadioOption>;
  addressoption: any = '';
  order: OrderModule;
  appliedCoupon: boolean;
  valid_offer;
  discountPrice;
  logged_user_id;
  logged_user_email;
  logged_user_contact_no;
  all_cart_data: any = [];
  order_id: number;
  order_total_price: number;
  address_list: any = [];
  customer_adress_list: any = [];
  total_item_price;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private spinnerDialog: SpinnerDialog,
    public modalCtrl: ModalController,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    public paymentService: PaymentService,
    public cartService:CartService
  ) {
    this.order = new OrderModule();
    if (localStorage.getItem('isLoggedin')) {
      this.logged_user_id = localStorage.getItem('logged_user_id');
      this.isLoggedin = true;
    }
    else {
      this.logged_user_id = '';
      this.isLoggedin = false;
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);

    this.listAddress(this.logged_user_id);
    this.getPaymentOption();
    this.populateData();
  }

  

  populateData() {
    //  this.loader.show(this.lodaing_options);
    if (localStorage.getItem("cart")) {
      this.all_cart_data = JSON.parse(localStorage.getItem("cart"));
      console.log(this.all_cart_data);
      var filteredData = this.all_cart_data.filter(x => x.user_id == this.logged_user_id)
      this.customer_cart_data = filteredData;
      console.log(this.customer_cart_data);
      this.getTotalItemPrice();
      this.visible_key = true
    }
    else {
      this.customer_cart_data = [];
      this.visible_key = true
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

    console.log("Total Price ==>", this.total_item_price);
  }


  selectChange(e) {
    console.log(e)
  }

  // placeOrder() {
  //   this.navCtrl.push('OrdersuccessPage');
  // }

  listAddress(id) {
    this.spinnerDialog.show();
    let params = {}
    let url = Globals.apiEndpoint + 'get_user_multiple_address/';
    console.log("url", url);

    let addressUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
    let data = {
      user_id: id
    }
    this.paymentService.getCustomerAddressList(addressUrl, data).subscribe(
      res => {
        //console.log("All Address List==>", res);
        this.address_list = res['user_multiple_address'];
        console.log("All Address List==>", this.address_list);
        // this.addressOptions = [];

        // this.customer_adress_list.forEach(x => {
        //     var d = new AddressRadioOption(x.label, x.shipping_first_name, x.shipping_last_name, x.shipping_city, x.shipping_address_1, x.shipping_state, x.shipping_postcode)
        //     this.addressOptions.push(d)
        // })
        // this.addressOptions[0]['selected'] = true;
        // this.address_selected = true
        // //console.log(this.addressOptions);
        // this.selectedAddres = this.addressOptions[0];
        this.visible_key = true;
        this.spinnerDialog.hide();
      },
      error => {
        this.visible_key = true;
        this.spinnerDialog.hide();
      }
    )
  }

  getPaymentOption() {
    let params = {

    }
    let url = Globals.apiEndpoint + 'payment_gateways';
    let getPeaymentOptionUrl: string = this.woocommerceService.authenticateApi('GET', url, params);


    this.paymentService.getPeaymentOption(getPeaymentOptionUrl).subscribe(
      res => {
        console.log("Payment Option", res);
        this.payment_option_list = res;
        this.paymentOptions = [];

        this.payment_option_list.forEach(x => {
          if (x.enabled == true) {
            var d = new PaymentRadioOption(x.method_title, x.id)
            this.paymentOptions.push(d)
          }

        })
        this.paymentOptions[0]['selected'] = true;

        this.payment_type = this.paymentOptions[0].id;
        //console.log(this.addressOptions);
        //this.selectedAddres = this.addressOptions[0];
      },
      error => {
        // console.log(error)
      }
    )
  }

  changeCheckedRadioPaymentMode(radioOption: PaymentRadioOption): void {
    radioOption.selected = !radioOption.selected;
    this.payment_type = radioOption.id;
    console.log(this.payment_type);
    if (!radioOption.selected) {
      return;
    }

    // uncheck all other options
    this.paymentOptions.forEach(option => {
      if (option.title !== radioOption.title) {
        option.selected = false;
      }
    });
  }

  getselectedAddress(address) {
    console.log("kkkkkkk", address);
    this.selectedAddres = address;
  }
  // changeCheckedRadioAddress(radioOption: AddressRadioOption): void {
  //   if (this.addressOptions.length > 1) {
  //       radioOption.selected = !radioOption.selected;
  //       this.address_selected = true
  //       if (!radioOption.selected) {
  //           return;
  //       }

  //       this.selectedAddres = radioOption;

  //       this.addressOptions.forEach(option => {
  //           if (option.label !== radioOption.label) {
  //               option.selected = false;
  //           }
  //       });
  //   }

  // }

  // getOfferList() {
  //   this.loader.show(this.lodaing_options);

  //   let params = {

  //   }
  //   let url = Globals.apiEndpoint + 'coupons';
  //   let offerUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

  //   this.paymentService.getOfferList(offerUrl).subscribe(
  //       res => {
  //           //console.log(res);

  //           this.offer_list = res;
  //           console.log("offer");
  //           console.log(this.offer_list);
  //           console.log("offer");


  //           this.loader.hide();
  //           // console.log(this.state_list);
  //       },
  //       error => {
  //           // console.log(error)
  //           this.loader.hide();
  //       }
  //   )
  // }

  // applyOffer() {


  //   if (this.cuponForm.valid) {
  //       this.valid_offer = this.offer_list.filter(x => x.code.toUpperCase() == this.cuponForm.value.coupon.toUpperCase())
  //       console.log(this.valid_offer);
  //       if (this.valid_offer.length > 0) {
  //           //this.offer_price = valid[0].offer_value;
  //           this.coupon_code = this.valid_offer[0].code;
  //           this.appliedCoupon = true;

  //           this.successNotification("Coupon code accepted");

  //       }
  //       else {

  //           console.log("qweqw")
  //           this.errorNotification('Invalid Coupon code!');

  //       }
  //   } else {
  //       this.markFormGroupTouched(this.cuponForm)
  //   }

  // }

  getDiscountPrice() {

    if (this.valid_offer[0].discount_type == "percent") {
      this.discountPrice = (this.total_item_price * this.valid_offer[0].amount) / 100;
      return (this.discountPrice).toFixed(2);
    }
    else {

      this.discountPrice = this.valid_offer.amount;
      return (this.discountPrice).toFixed(2);
    }


    // var totalPrice = this.subscription_value * this.totalPrice;
    // var totalAfterOffer = totalPrice - this.offer_price;
    // return (totalAfterOffer).toFixed(2);

  }


  getPaidTotalAfterOffer() {
    var totalAfterOffer = this.total_item_price - this.discountPrice;
    return (totalAfterOffer).toFixed(2);

  }

  placeOrder() {
    if (this.address_selected == false) {
      console.log("Address Not Selected");
    }
    else {
      console.log("aa");
      console.log(this.payment_type);
      if (this.payment_type == 'wc_paytm') {
        this.order.payment_method = "wc_paytm";
        this.order.payment_method_title = "Paytm";
      }
      else {
        console.log("zzzz");
        this.order.payment_method = "cod";
        this.order.payment_method_title = "Cash On Delivery";
      }

      if (this.appliedCoupon) {

        var meta_data_array = []
        var meta_data_value = new meta_data();
        meta_data_value.key = "coupon_data";
        meta_data_value.value =
          {
            id: this.valid_offer[0]['id'],
            code: this.valid_offer[0]['code'],
            amount: this.valid_offer[0]['amount'].toString()

          }
        meta_data_array.push(meta_data_value);

        var coupon_lines_array = []
        var coupon_lines_value = new coupon_lines();
        coupon_lines_value.code = this.valid_offer[0]['code'];
        coupon_lines_value.discount = this.discountPrice.toString();
        coupon_lines_value.discount_tax = "0";
        coupon_lines_value.meta_data = meta_data_array;
        coupon_lines_array.push(coupon_lines_value);

        this.order.coupon_lines = coupon_lines_array;
      }
      else {
        this.order.coupon_lines = []
      }
      this.order.set_paid = false;
      this.order.billing =
        {
          first_name: this.selectedAddres.shipping_first_name,
          last_name: this.selectedAddres.shipping_last_name,
          address_1: this.selectedAddres.shipping_address_1,
          address_2: "",
          city: this.selectedAddres.shipping_city,
          state: this.selectedAddres.shipping_state,
          postcode: this.selectedAddres.shipping_postcode,
          country: "IN",
          email: this.logged_user_email,
          phone: this.logged_user_contact_no,

        };
      this.order.shipping =
        {
          first_name: this.selectedAddres.shipping_first_name,
          last_name: this.selectedAddres.shipping_last_name,
          address_1: this.selectedAddres.shipping_address_1,
          address_2: "",
          city: this.selectedAddres.shipping_city,
          state: this.selectedAddres.shipping_state,
          postcode: this.selectedAddres.shipping_postcode,
          country: "IN"
        };
      this.order.customer_id = this.logged_user_id;

      var all_details_data = [];
      this.customer_cart_data.forEach(x => {
        var details_data = new line_items();
        details_data.quantity = x.quantity;
        details_data.product_id = x.product_id;
        details_data.size = x.size;
        details_data.variation_id = x.variation_id;
        all_details_data.push(details_data);
        var index = this.all_cart_data.findIndex(y => y.user_id == this.logged_user_id && y.product_id == x.product_id);
        if (index != -1) {
          this.all_cart_data.splice(index, 1);
        }
      })
      this.order.line_items = all_details_data;
      console.log(this.order_id);
      if (this.order_id == undefined) {
        // this.loader.show(this.lodaing_options);
        let params = {}
        let url = Globals.apiEndpoint + 'orders/';
        let orderAddUrl: string = this.woocommerceService.authenticateApi('POST', url, params);
        console.log("Order details Data ==>",this.order);
        this.paymentService.createOrder(orderAddUrl, this.order).subscribe(
          res => {

            console.log(res);
            this.order_id = res['id']
            this.order_total_price = res['total'];
            // this.loader.hide();
            if (this.payment_type == 'wc_paytm') {
              console.log(this.order_total_price)
              console.log(this.order_id)
              // this.getPaytmFormValue(this.order_total_price, this.order_id)
            }
            else {
              this.pushNotf();
            }
            //this.setCartData();
            localStorage.setItem("cart", "");
            this.cartService.cartNumberStatus(true);
          },
          error => {
            //this.loader.hide();
            // console.log(error)
          }
        )
      }
      else if (this.order_id != undefined && this.payment_type == 'wc_paytm') {

        //this.getPaytmFormValue(this.order_total_price, this.order_id)
      }
      else {
        this.pushNotf()
      }
    }
  }

  // setCartData() {
  //   console.log("Cart After Payment==>",this.customer_cart_data);
  //   localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
  //  // this.cartService.cartNumberStatus(true);
  // }

  pushNotf() {
    // this.onNavItemTap('ordersuccess/' + this.order_id);
    this.navCtrl.push('OrdersuccessPage', { id: this.order_id });
  }

  openAddModal() {
    const modal = this.modalCtrl.create(AddressPage);
    modal.present();
  }

}
