import { Injectable , EventEmitter, Output} from "@angular/core";
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

  @Output() getLoginStatus: EventEmitter<any> = new EventEmitter();
  constructor(private http: HttpClient) { }

  loginStatus(status) {
    this.getLoginStatus.emit(status);
  }
  userLogin(loginUserUrl,data): Observable<any> {
    return this.http.post(loginUserUrl, data)
  }

  userRegister(createUserUrl,data): Observable<any> {
    return this.http.post(createUserUrl, data)
  }

  userForgetPasswordOtp(sendOtpUrl,data): Observable<any> {
    return this.http.post(sendOtpUrl, data)
  }
  
  userPasswordUpdate(userPasswordUpdateUrl,data): Observable<any> {
    return this.http.post(userPasswordUpdateUrl, data)
  }
  
  
}