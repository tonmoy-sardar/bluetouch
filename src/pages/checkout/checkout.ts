import { Component } from '@angular/core';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { IonicPage, NavController, NavParams, ToastController, ModalController ,Events} from 'ionic-angular';
import * as Globals from '../../core/global';
import { WoocommerceService } from "../../core/services/woocommerce.service";
//import { PaymentService } from '../../core/services/payment.service';
import { PaymentService, OrderModule, line_items,coupon_lines,meta_data, PaymentRadioOption, AddressRadioOption } from "../../core/services/payment.service";
import { AddressPage } from '../address/address';
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
  visible_key: boolean=false;
  userId:any;
  isLoggedin:boolean;
  payment_option_list:any;
  paymentOptions:any=[];
  payment_type: string;
  selectedAddres: any;
  customer_cart_data: any = [];
  address_selected: boolean;
  addressOptions?: Array<AddressRadioOption>;
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
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public toastCtrl: ToastController,
    private spinnerDialog: SpinnerDialog,
    public modalCtrl: ModalController,
    public woocommerceService: WoocommerceService,
    public events1: Events,
    public paymentService: PaymentService,
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');
    this.events1.publish('hideBackButton', false);
    if (localStorage.getItem('isLoggedin')) {
      this.userId = localStorage.getItem('logged_user_id');
      this.isLoggedin = true;
    }
    else {
      this.userId = '';
      this.isLoggedin = false;
    }
    this.listAddress(this.userId);
    this.getPaymentOption();
  }
  selectChange(e){
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
        console.log("All Address List==>", res);
       // this.product_list = res;
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
            console.log("Payment Option",res);
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
changeCheckedRadioAddress(radioOption: AddressRadioOption): void {
  if (this.addressOptions.length > 1) {
      radioOption.selected = !radioOption.selected;
      this.address_selected = true
      if (!radioOption.selected) {
          return;
      }

      this.selectedAddres = radioOption;

      this.addressOptions.forEach(option => {
          if (option.label !== radioOption.label) {
              option.selected = false;
          }
      });
  }

}

placeOrder() {
  //console.log("ssssss")
  if (this.address_selected == false) {
      // dialogs.alert("Please Select Shipping Address").then(() => {
      //     // console.log("Dialog closed!");
      // });
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
          this.order.payment_method = "cod";
          this.order.payment_method_title = "Cash On Delivery";
      }

      if (this.appliedCoupon) {
         
          var meta_data_array = []
          var meta_data_value = new meta_data();
          meta_data_value.key = "coupon_data";
          meta_data_value.value =
          {
              id:this.valid_offer[0]['id'],
              code:this.valid_offer[0]['code'],
              amount:this.valid_offer[0]['amount'].toString()

          }
          meta_data_array.push(meta_data_value);

          var coupon_lines_array = []
          var coupon_lines_value = new coupon_lines();
          coupon_lines_value.code = this.valid_offer[0]['code'];
          coupon_lines_value.discount = this.discountPrice.toString();
          coupon_lines_value.discount_tax = "0";
          coupon_lines_value.meta_data= meta_data_array;
          coupon_lines_array.push(coupon_lines_value);

          this.order.coupon_lines=coupon_lines_array;

      }
      else{
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
                      //this.pushNotf();
                  }
                  this.setCartData();
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

setCartData() {
  localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
}

pushNotf() {
 // this.onNavItemTap('ordersuccess/' + this.order_id);
  this.navCtrl.push('OrdersuccessPage',{order_id:this.order_id});
}

  openAddModal() {
    const modal = this.modalCtrl.create(AddressPage);
    modal.present();
  }

}
