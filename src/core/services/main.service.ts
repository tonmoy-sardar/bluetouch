import { Injectable, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../global';

@Injectable()
export class MainService {
  constructor(private http: HttpClient) { }


  getGalleryImageList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get_image_gallery.php/')
  }
  getBranchList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-branches.php/')
  }

  getWhoWeAre(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-page.php?page_id='+page_id)
  }

  getWhatWeDo(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-page.php?page_id='+page_id)
  }

  getWhyProtect(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-page.php?page_id='+page_id)
  }
  
  getWhyNative(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-page.php?page_id='+page_id)
  }

  getPageText(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-page.php?page_id='+page_id)
  }

  getDonationText(page_id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-donation.php?donation_page_id='+page_id)
  }

  

  getProductList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-product.php/')
  }

  getServiceList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-service.php/')
  }

  getYojanaList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-youjna.php/')
  }

  getProductServiceDetails(id): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-product-service-details.php?product_service_id='+id)
  }

  submitContact(data): Observable<any> {
    return this.http.post(environment.apiEndpoint + 'contact_us.php/',data)
  }

  getManagementList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get-management-catwise.php')
  }

  getMagazineList(): Observable<any> {
    return this.http.get(environment.apiEndpoint + 'get_magazine.php')
  }
  

  

  
}
