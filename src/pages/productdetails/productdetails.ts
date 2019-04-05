import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, MenuController, Events, ToastController } from 'ionic-angular';
import { SpinnerDialog } from '@ionic-native/spinner-dialog';
import { CategoryService } from '../../core/services/category.service';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { CartService } from "../../core/services/cart.service";
import { ModalController } from 'ionic-angular';
import { GalleryModal } from 'ionic-gallery-modal';
/**
 * Generated class for the HomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@IonicPage({ segment: 'productdetails/:id' })
@Component({
  selector: 'page-productdetails',
  templateUrl: 'productdetails.html',
})
export class ProductdetailsPage {
  productdetailsType: string = "details";
  rating;
  avg_rating;
  product_details: any = {};
  img_base_url;
  product_id;
  logged_user_id;
  customer_cart_data: any = [];
  recently_view_product: any = [];
  product_details_img: any = [];
  package_name;
  visible_key: boolean;
  selectedColor: any;
  selectedSize: any;
  color: any;
  activeIndex: any;
  selectedIndex: number;
  product_variation: any = [];
  proImageList: any = [];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public menuCtrl: MenuController,
    public events1: Events,
    private spinnerDialog: SpinnerDialog,
    public categoryService: CategoryService,
    public woocommerceService: WoocommerceService,
    public cartService: CartService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
  ) {
    this.events1.publish('isHeaderHidden', false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductdetailsPage');
    this.menuCtrl.close();
    this.events1.publish('hideBackButton', false);
    this.events1.publish('isHeaderHidden', false);
    this.getProductDetails(this.navParams.get('id'))
    this.getProductVariations(this.navParams.get('id'))

    if (localStorage.getItem('isLoggedin')) {
      this.logged_user_id = localStorage.getItem('logged_user_id');
    }
    else {
      this.logged_user_id = '';
    }

  }
  ionViewWillEnter() {
    if (localStorage.getItem("cart")) {
      this.customer_cart_data = JSON.parse(localStorage.getItem("cart"));
    }
    else {
      this.customer_cart_data = [];
    }
    console.log(this.customer_cart_data);
    this.getProductDetails(this.navParams.get('id'))
  }
  getProductDetails(product_id) {
    this.visible_key = false;
    this.spinnerDialog.show();
    let params = {
    }
    let url = Globals.apiEndpoint + 'products/' + product_id;
    let productDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getProductDetails(productDeatilsUrl).subscribe(
      res => {

        console.log("Pro Details ==>", res);
        this.product_details = res;
        this.product_details_img = this.product_details.images;
        console.log(this.product_details_img);
        res.images.forEach(x => {
          this.proImageList.push({ url: x.src })
        })
        console.log(this.proImageList);

        // this.selectedColor = 'red';
        // this.selectedIndex = 1;
        // this.selectedSize = 'M';
        // this.activeIndex = 1;

        var index = this.customer_cart_data.findIndex(y => y.product_id == this.product_details.id && y.user_id == this.logged_user_id);

        if (index != -1) {
          this.product_details['isCart'] = true;
          this.product_details['quantity'] = this.customer_cart_data[index].quantity
          this.product_details['price'] = parseFloat(this.product_details['price'])
          this.product_details['regular_price'] = parseFloat(this.product_details['regular_price'])


        }
        else {
          this.product_details['isCart'] = false;
          this.product_details['quantity'] = 0;
          this.product_details['price'] = parseFloat(this.product_details['price'])
          this.product_details['regular_price'] = parseFloat(this.product_details['regular_price'])
        }

        this.visible_key = true
        this.recentlyViewdProduct(this.product_details);
        this.spinnerDialog.hide();

        console.log();
      },
      error => {
        this.spinnerDialog.hide();

      }
    )
  }

  getProductVariations(product_id) {
    let params = {
    }
    let url = Globals.apiEndpoint + 'products/' + product_id + '/variations';
    let productDeatilsUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getProductDetails(productDeatilsUrl).subscribe(
      res => {
        console.log("Pro Variation ==>", res);
        this.product_variation = res;
        console.log(this.product_variation);
      },
      error => {
        console.log(error);

      }
    )
  }

  recentlyViewdProduct(product_details) {
    var data = {
      product_id: product_details.id,
      product_name: product_details.name,
      description: product_details.short_description,
      price: product_details.price,
      discounted_price: product_details.sale_price,
      image_small: product_details.images[0].src,
    }
    var index = this.recently_view_product.findIndex(y => y.product_id == product_details.id);
    if (index == -1) {
      console.log(data);
      this.recently_view_product.push(data);
      console.log("Recently View Product==>", this.recently_view_product);
      this.setRecentlyViewdProduct();
    }

  }

  setRecentlyViewdProduct() {
    localStorage.setItem("recentlyViewdProduct", JSON.stringify(this.recently_view_product));
  }

  
  setBuyNowCartData() {

    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
    this.navCtrl.push('CartPage');
  }

  addToCart(product_details) {
    var data = {
      user_id: this.logged_user_id,
      product_id: product_details.id,
      product_name: product_details.name,
      description: product_details.short_description,
      price: product_details.price,
      regular_price: product_details.regular_price,
      image_small: product_details.images[0].src,
      quantity: product_details.quantity + 1
    }
    //console.log(data);
    var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);

    if (index == -1) {
      if (this.product_variation.length > 0) {
        this.product_variation.forEach(y => {
          if (y.attributes[0].option == this.selectedColor && y.attributes[1].option == this.selectedSize) {
            data['color'] = this.selectedColor;
            data['size'] = this.selectedSize;
            data['variation_id'] = y.id;
          }
        })
        if (this.selectedColor == undefined || this.selectedSize == undefined) {
          this.presentToast("Please Select color and Size");
        }
        else {
          this.product_details['isCart'] = true;
          this.product_details['quantity'] = this.product_details['quantity'] + 1;
          this.customer_cart_data.push(data);
          console.log("Pro details Cart==>", this.customer_cart_data);
          this.setCartData();
          this.cartService.cartNumberStatus(true);
        }

      }
      else {
        this.product_details['isCart'] = true;
        this.product_details['quantity'] = this.product_details['quantity'] + 1;
        this.customer_cart_data.push(data);
        console.log("Pro details Cart==>", this.customer_cart_data);
        this.setCartData();
        this.cartService.cartNumberStatus(true);
      }

    }

  }

  buyNow(product_details) {
    console.log(product_details);
    if (product_details.quantity >= 1) {
      var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
      if (index != -1) {
        this.customer_cart_data[index].quantity = product_details.quantity + 1;
        this.setBuyNowCartData();
      }
      this.product_details.quantity = product_details.quantity + 1
    }
    else {
      var data = {
        user_id: this.logged_user_id,
        product_id: product_details.id,
        product_name: product_details.name,
        description: product_details.short_description,
        price: product_details.price,
        regular_price: product_details.regular_price,
        image_small: product_details.images[0].src,
        quantity: product_details.quantity + 1
      }
      var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
      // this.product_details['isCart'] = true;
      // this.product_details['quantity'] = this.product_details['quantity'] + 1;
      if (index == -1) {
        console.log(this.product_variation.length);
        if (this.product_variation.length > 0) {
          this.product_variation.forEach(y => {
            if (y.attributes[0].option == this.selectedColor && y.attributes[1].option == this.selectedSize) {
              data['color'] = this.selectedColor;
              data['size'] = this.selectedSize;
              data['variation_id'] = y.id;
            }
          })

          console.log(this.selectedColor);
          console.log(this.selectedSize);
          if (this.selectedColor == undefined || this.selectedSize == undefined) {
            this.presentToast("Please Select color and Size");
          }
          else {
            this.product_details['isCart'] = true;
            this.product_details['quantity'] = this.product_details['quantity'] + 1;
            this.customer_cart_data.push(data);
            this.setBuyNowCartData();
            this.cartService.cartNumberStatus(true);
          }

        }
        else {
          this.product_details['isCart'] = true;
          this.product_details['quantity'] = this.product_details['quantity'] + 1;
          this.customer_cart_data.push(data);
          console.log("Pro details Cart==>", this.customer_cart_data);
          this.setCartData();
          this.cartService.cartNumberStatus(true);
        }

        // this.customer_cart_data.push(data);
        // this.setBuyNowCartData();
      }
    }
    // this.cartService.cartNumberStatus(true);

  }


  setCartData() {
    localStorage.setItem("cart", JSON.stringify(this.customer_cart_data));
  }

  decrement(product_details) {
    if (product_details.quantity > 1) {
      var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
      if (index != -1) {
        this.customer_cart_data[index].quantity = product_details.quantity - 1;
        this.setCartData();
      }
      this.product_details['quantity'] = product_details.quantity - 1


    }
    else {
      var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
      if (index != -1) {
        this.customer_cart_data.splice(index, 1);
        console.log(this.customer_cart_data);
        this.setCartData();
      }
      this.product_details.isCart = false;
      this.product_details.quantity = product_details.quantity - 1
    }
    this.cartService.cartNumberStatus(true);

  }
  increment(product_details) {
    var index = this.customer_cart_data.findIndex(y => y.product_id == product_details.id && y.user_id == this.logged_user_id);
    if (index != -1) {
      this.customer_cart_data[index].quantity = product_details.quantity + 1;
      console.log(this.customer_cart_data);
      this.setCartData();
    }
    this.product_details.quantity = product_details.quantity + 1
    this.cartService.cartNumberStatus(true);
  }
  getDiscount(price, regular_price) {
    return Math.floor(((regular_price - price) * 100) / regular_price) + '%';
  }
  goBack() {
    this.navCtrl.pop();
  }

  selectColor(color, i) {
    console.log("Select color==>", color);
    this.selectedColor = color;
    this.selectedIndex = i;

    var index = this.customer_cart_data.findIndex(y => y.product_id == this.product_details.id && y.user_id == this.logged_user_id);
    if (index != -1) {
      if (this.product_variation.length > 0) {
        this.product_variation.forEach(y => {
          if (y.attributes[0].option == this.selectedColor && y.attributes[1].option == this.selectedSize) {
            this.customer_cart_data[index].color = this.selectedColor;
            this.customer_cart_data[index].size = this.selectedSize;
            this.customer_cart_data[index].variation_id = y.id;
          }

        })

      }
      console.log(this.customer_cart_data);
      this.setCartData();
    }
  }
  selectSize(size, i) {
    console.log("Select size==>", size);
    this.selectedSize = size;
    this.activeIndex = i;
    var index = this.customer_cart_data.findIndex(y => y.product_id == this.product_details.id && y.user_id == this.logged_user_id);
    if (index != -1) {
      if (this.product_variation.length > 0) {
        this.product_variation.forEach(y => {
          if (y.attributes[0].option == this.selectedColor && y.attributes[1].option == this.selectedSize) {
            this.customer_cart_data[index].color = this.selectedColor;
            this.customer_cart_data[index].size = this.selectedSize;
            this.customer_cart_data[index].variation_id = y.id;
          }

        })

      }
      console.log(this.customer_cart_data);
      this.setCartData();
    }

  }

  openModal(index) {
    console.log(index);
    let modal = this.modalCtrl.create(GalleryModal, {
      photos: this.proImageList,
      initialSlide: index, // The second image
    });
    modal.present();
  }

  presentToast(msg) {
    const toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
