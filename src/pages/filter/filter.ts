import { Component, TemplateRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
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
  sizeList: any = [];
  selectedArray: any = [];
  product_variation: any = [];
  listAttributes: any = [];
  listAttributesValue: any = [];
  allAttributeList: any = [];
  selectedValue: any = [];
  sendList: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public woocommerceService: WoocommerceService,
    public categoryService: CategoryService,
  ) {
    this.attributesList();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FilterPage');
    this.getSizeList();

  }

  public closeModal() {
    this.viewCtrl.dismiss();
  }

  getSizeList() {
    this.sizeList = [
      { id: 1, name: " M", checked: true },
      { id: 2, name: " S", checked: false },
      { id: 3, name: "L", checked: false },
      { id: 4, name: "XL", checked: false }
    ]
  }

  // selectMember(data) {
  //   if (data.checked == true) {
  //     this.selectedArray.push(data);
  //   } else {
  //     let newArray = this.selectedArray.filter(function (el) {
  //       return el.testID !== data.testID;
  //     });
  //     this.selectedArray = newArray;
  //   }
  //   console.log(this.selectedArray);
  // }

  attributesList() {
    let params = {}
    let url = Globals.apiEndpoint + 'products/attributes';
    let attributesUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

    this.categoryService.getattributesList(attributesUrl).subscribe(
      res => {
        console.log(res);
        this.listAttributes = res;
        this.allAttributeList = [];
        this.listAttributes.forEach(x => {
          console.log(x.id);
          // this.getAttributeValue(x.id)
          // if (option.title !== radioOption.title) {
          //   option.selected = false;
          // }
          let params = {}
          let url = Globals.apiEndpoint + 'products/attributes/' + x.id + '/terms';
          let attributeValueUrl: string = this.woocommerceService.authenticateApi('GET', url, params);

          this.categoryService.getCategoryList(attributeValueUrl).subscribe(
            res => {
              console.log("Attribute Value===>", res);
              this.listAttributesValue = res;
              this.allAttributeList.push(
                {
                  "name": x.name,
                  "pa_name": x.slug,
                  "list": this.listAttributesValue
                }
              );


            },
            error => {

            }
          )
        });
        console.log("zzzz==>", this.allAttributeList);
      },
      error => {

      }
    )
  }

  selectMember(data) {
    console.log(data);

  }

  getselectedValue(list) {
    this.selectedValue.push(
      {
        "name": list.name
      }
    );
    console.log("Selected Value==>", this.selectedValue);
  }

  // getCheckboxValues(ev, data) {
  //   let obj = {
  //     "filterValue" : data
  //   }
  //   console.log(ev);
  //   if(ev.target.checked){
  //     // Pushing the object into array
  //     this.selectedValue.push(obj);

  //   }else {
  //     let removeIndex = this.selectedValue.findIndex(itm => itm.order==data);

  //     if(removeIndex !== -1)
  //       this.selectedValue.splice(removeIndex,1);
  //   }

  //   //Duplicates the obj if we uncheck it
  //   //How to remove the value from array if we uncheck it
  //   console.log(this.selectedValue);
  // }

  getCheckboxValues(event, data, attributes) {
    console.log(attributes, data);
    var index = this.selectedValue.findIndex(x => x.filterList == data);
    // If checked then push
    if (event.checked == true) {
      if (this.sendList.length > 0) {
        this.sendList.forEach(element => {
          console.log("aaa",element.attribute);
          console.log("bbb",attributes.pa_name);
          if (element.attribute === attributes.pa_name) {
            element.term.push(data.name)
          } else {
            this.sendList.push({
              "attribute": attributes.pa_name,
              "term": [data.name]
            });
          }
        });

      } else {
        this.sendList.push({
          "attribute": attributes.pa_name,
          "term": [data.name]
        });
      }

      console.log(this.sendList)
      // Pushing the object into array
      // this.selectedValue.push(obj);
    }
    else {
      this.selectedValue.splice(index, 1);
      this.sendList = [];
    }
    // console.log(this.selectedValue);
  }

  getFilterProduct(data) {
    console.log(data);
    //var str = { "product_attribute": data }
    //this.navCtrl.push('ProductlistPage', { filterData: data });
    this.viewCtrl.dismiss(data);
  }

  // public closeModal(data){
  //   this.viewCtrl.dismiss(data);
  // }

 

}
