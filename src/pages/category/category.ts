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
  subCatList:any=[];
  subCatListt:any=[];

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
    this.events1.publish('isHeaderHidden', false);
    this.getCategory();
  }
  // getCategory() {
  //   this.spinnerDialog.show();
  //   let params = {
  //     customer: ''
  //   }
  //   let url = Globals.apiEndpoint + 'products/categories/';
  //   let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
  //   this.categoryService.getCategoryList(orderUrl).subscribe(
  //     res => {
  //       this.categoryList = res;
  //       this.visible_key = true;
  //     },
  //     error => {
  //       this.visible_key = true;
  //     }
  //   )
  // }
  gotoProList(id) {
    this.navCtrl.push('ProductlistPage', { id: id });
  }
  goBack() {
    this.navCtrl.pop();
  }

  getCategory() {
    this.spinnerDialog.show();
    let params = {
      customer: ''
    }
  //  let url = Globals.apiEndpoint + 'products/categories/';
  let url = Globals.apiEndpoint + 'product_category/';
  
    let orderUrl: string = this.woocommerceService.authenticateApi('GET', url, params);
    this.categoryService.getCategoryList(orderUrl).subscribe(
      res => {
        this.spinnerDialog.hide();
        this.categoryList = res['data'];
        console.log(this.categoryList);
        var subcat = []
        console.log(this.categoryList);
        this.visible_key = true;
      //  //this.flatListToTreeViewData(this.categoryList)
      //   this.categoryList.forEach((x,i)=> {
      //     if(x.parent_id == 0) {
      //       console.log(x);
      //      var subcat = this.recursiveCat(x.id,this.categoryList)
      //      x[i]['child_s'] = [];
      //      x[i]['child_s'].push(subcat);
      //      // if(x.parent) {
      //         //this.categoryList.children.push(x)
      //      // }
      //     }
      //     console.log('x=',x);
      //   })

        

       
      },
      error => {
        this.spinnerDialog.hide();
        this.visible_key = true;
      }
    )
  }
  // recursiveCat(child_id,categories_list){
  //   var child_e = [];
  //   categories_list.forEach(y => {
  //       if(child_id==y.parent_id){
  //         child_e['category_id'] = y.id;
  //         child_e['category_name'] = y.category_name;

  //       }
  //   });
  //   return child_e
  //   console.log()
  // }

//   flatListToTreeViewData(dataList) {
//     var tree = [],
//         mappedArr = {},
//         arrElem,
//         mappedElem;

//     for (var i = 0, len = dataList.length; i < len; i++) {
//         arrElem = dataList[i];
//         mappedArr[arrElem.id] = arrElem;
//         mappedArr[arrElem.id]['children'] = [];
//     }

//     for (var id in mappedArr) {
//         if (mappedArr.hasOwnProperty(id)) {
//             mappedElem = mappedArr[id];
//            // array of children.
//             if (mappedElem.parent_id) {
//                 mappedArr[mappedElem['parent_id']]['children'].push(mappedElem);
//             }else {
//                 tree.push(mappedElem);
//             }
//         }
//     }
//     //return tree;
//     console.log(mappedArr);
// }

showSubCat(id) {
  console.log(id);
  if (this.categoryList.length > 0) {
    this.categoryList.forEach(y => {
      if(y.category_id==id) {
        this.subCatList = y.child;
        console.log(this.subCatList);
      }
    })

  }
}

showSubCatt(id) {
  console.log(id);
  if (this.subCatList.length > 0) {
    this.subCatList.forEach(y => {
      if(y.category_id==id) {
        this.subCatListt = y.child;
        console.log(this.subCatList);
      }
    })

  }
}


}
