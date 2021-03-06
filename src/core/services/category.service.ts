import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, BehaviorSubject } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as Globals from '../../core/global';

@Injectable()
export class CategoryService {

  constructor(private http: HttpClient) { }

  getCategoryList(categoryUrl): Observable<any> {
    return this.http.get(categoryUrl);
  }

  getSubCategoryList(cat_id,location_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'subcategorylist/' + cat_id + '/'+ location_id + '/')
  }

  getServicesListBySubCatId(subcat_id): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'serviceslistbysubcatid/' + subcat_id + '/')
  }
  
  getProductListByCategoryId(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getSearchProduct(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getProductList(productUrl): Observable<any> {
    return this.http.get(productUrl)
  }

  getGalleryImageList(galleryUrl): Observable<any> {
    return this.http.get(galleryUrl)
  }

  getLocationList(): Observable<any> {
    return this.http.get(Globals.apiEndpoint + 'locationlist/')
  }

  getProductDetails(productDeatilsUrl): Observable<any> {
    return this.http.get(productDeatilsUrl)
  }
  getOrderDetails(orderDeatilsUrl): Observable<any> {
    return this.http.get(orderDeatilsUrl)
  }

  getPopularProductList(popularProductUrl): Observable<any> {
    return this.http.get(popularProductUrl)
  }
  
  getattributesList(attributesUrl): Observable<any> {
    return this.http.get(attributesUrl)
  }

  getFilterProduct(filterUrl,data): Observable<any> {
    return this.http.post(filterUrl,data)
  }
}
