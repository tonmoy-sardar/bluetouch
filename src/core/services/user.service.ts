import { Injectable, EventEmitter, Output } from "@angular/core";
import { RequestOptions, Headers } from "@angular/http";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams,
} from "@angular/common/http";
import { Observable, BehaviorSubject, } from "rxjs";
import { map, catchError } from "rxjs/operators";
import * as Globals from '../../core/global';

@Injectable()
export class UserService {
  headers: any;
  @Output() getLoginStatus: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }

  loginStatus(status) {
    this.getLoginStatus.emit(status);
  }

  userLogin(loginUserUrl,data): Observable<any> {
    return this.http.post(loginUserUrl, data)
  }

  userRegister(createUserUrl, data): Observable<any> {
    return this.http.post(createUserUrl, data)
  }

  userForgetPasswordOtp(sendOtpUrl, data): Observable<any> {
    return this.http.post(sendOtpUrl, data)
  }

  userPasswordUpdate(userPasswordUpdateUrl, data): Observable<any> {
    return this.http.post(userPasswordUpdateUrl, data)
  }
  getUserDetails(userDeatilsUrl): Observable<any> {
    return this.http.get(userDeatilsUrl)
  }

  uploadUserImage(uploadUserImageUrl, data): Observable<any> {
    console.log(uploadUserImageUrl);
    console.log(data);
    console.log(data.params);
    
    return this.http.post(uploadUserImageUrl, data)
  }

  // updatemyProfile(id,profileImage,data): Observable<any> {
    
  //   // return this.http.post(environment.apiEndpoint + 'userprofileupdate/'+id, data)
  //    const formData: FormData = new FormData();
  //    if (data) {
  //      for (let key in data) {
  //          formData.append(key, data[key])
  //      }
  //      if(profileImage) { 
  //        formData.append('profile_image', profileImage, profileImage.name);
  //      }
       
  //      //console.log(formData);
  //    }
  //    return this.http.post(environment.apiEndpoint + 'userprofileupdate/'+id, formData)
  //  }

}
