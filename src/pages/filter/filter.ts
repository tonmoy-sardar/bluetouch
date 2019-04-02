import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams ,ViewController} from 'ionic-angular';
import { WoocommerceService } from "../../core/services/woocommerce.service";
import * as Globals from '../../core/global';
import { CategoryService } from '../../core/services/category.service';
/**
 * Generated class for the FilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-filter',
  templateUrl: 'filter.html',
})
export class FilterPage {
  sizeList:any=[];
  selectedArray :any = [];
  product_variation: any = [];
  constructor(
    public navCtrl: NavController,
     public navParams: NavParams,
     public viewCtrl:ViewController,
     public woocommerceService: WoocommerceService,
     public categoryService: CategoryService,
     ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
    this.getSizeList();
  }

  public closeModal(){
    this.viewCtrl.dismiss();
  }

  getSizeList() {
    this.sizeList=[
      {id: 1, name: " M", checked: true},
      {id: 2, name: " S", checked: false},
      {id: 3, name: "L", checked: false},
      {id: 4, name: "XL", checked: false}
   ]
  }

  selectMember(data){
    if (data.checked == true) {
       this.selectedArray.push(data);
     } else {
      let newArray = this.selectedArray.filter(function(el) {
        return el.testID !== data.testID;
     });
      this.selectedArray = newArray;
    }
    console.log(this.selectedArray);
   }


}
