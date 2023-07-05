import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  ApiResponse,
  AuthData,
  HasLaunched,
  IsOTPEnabled,
  LoginResponse,
  User,
} from '../interface';
import { Observable, Subject } from 'rxjs';
import { ApiService, StorageService } from '.';
import { cleanObject } from '../helpers';
import { tap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user: User | undefined = undefined;
  isLoggedIn = false;
  isLoggedInChanged: Subject<boolean> = new Subject<boolean>();
  token = null;

  constructor(private router: Router, private apiService: ApiService) {
    this.isLoggedInChanged.subscribe((val) => {
      this.isLoggedIn = val;
    });
  }

  get isUserLoggedIn(): boolean {
    return this.isLoggedIn;
  }

  async postLogin(data: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    const payload = cleanObject(data);
    const url = `login`;
    const response = this.apiService.postApi(url, payload).pipe(
      tap((res: any) => {
        if (res.status) {
          if (res.data == 'otp') return;
          const { user, token } = res.data;
          const authData = {
            userId: user.id,
            userToken: token,
          };
          this.storeAuthData(authData, 'axs_auth_data');
          this.storeAuthData(user, 'axs_user_data');
          this.storeHasLaunchedApp(true);
          this.isLoggedInChanged.next(true);
        } else {
          this.isLoggedIn = false;
        }
      })
    );
    return await response.toPromise();
  }

  creatCustomer(data: any): Observable<any> {
    const payload = cleanObject(data);
    const url = `register`;
    return this.apiService.postApi(url, payload).pipe(
      map((res: ApiResponse) => {
        if (res.status) {
          const { user, token, expires } = res.data;
          const authData = {
            userId: user.id,
            userToken: token,
            expiresIn: expires,
          };
          this.storeAuthData(authData, 'axs_auth_data');
          this.storeAuthData(user, 'axs_user_data');
          this.storeHasLaunchedApp(true);
          this.isLoggedIn = true;
          return res;
        }
        return res;
      })
    );
  }

  public getUser() {
    try {
      const user = StorageService.getItem('axs_user_data');
      return user;
    } catch (e) {
      return e;
    }
  }

  public getEmailAuth() {
    try {
      const emailAuth = StorageService.getItem('axs_email_auth');
      if (emailAuth) {
        return !!emailAuth.is_enabled;
      }
      return null;
    } catch (e) {
      return e;
    }
  }

  getOtp(data: any): Observable<ApiResponse> {
    const url = `otp/${data}`;
    return this.apiService.getApi(url).pipe(
      map((res: ApiResponse) => {
        if (res.status) {
          let data = { is_enabled: false };
          switch (res.data.is_enabled) {
            case 1:
              data.is_enabled = true;
              this.storeAuthData(data, 'axs_email_auth');
              break;
            case 0:
              data.is_enabled = false;
              this.storeAuthData(data, 'axs_email_auth');
              break;
          }
          return res;
        }
        return res;
      })
    );
  }

  requestOTP() {
    const url = `otp/request`;
    return this.apiService.getApi(url).pipe(
      map((res: ApiResponse) => {
        if (res.status) {
          return res;
        }
        return res;
      })
    );
  }

  requestOTPByEmail(data: { email: string }) {
    const url = `otp/request`;
    return this.apiService.postApi(url, data).pipe(
      map((res: ApiResponse) => {
        if (res.status) {
          return res;
        }
        return res;
      })
    );
  }

  updateOtp(data: any, user_id: string): Observable<ApiResponse> {
    const url = `otp/${user_id}`;
    return this.apiService.updateApi(url, data).pipe(
      map((res: ApiResponse) => {
        if (res.status) {
          let data = { is_enabled: false };
          switch (res.data.is_enabled) {
            case 1:
              data.is_enabled = true;
              this.storeAuthData(data, 'axs_email_auth');
              break;
            case 0:
              data.is_enabled = false;
              this.storeAuthData(data, 'axs_email_auth');
              break;
          }
          return res;
        }
        return res;
      })
    );
  }

  updateUser(data: any, id: string): Promise<ApiResponse | undefined> {
    const cData = cleanObject(data);
    const url = `user/${id}`;
    return this.apiService
      .updateApi(url, cData)
      .pipe(
        map((res: ApiResponse) => {
          if (res.status) {
            this.storeAuthData(res.data, 'axs_user_data');
          }
          return res;
        })
      )
      .toPromise();
  }

  resetPassword(obj: any, user_id?: string): Promise<ApiResponse | undefined> {
    const payload = cleanObject(obj);
    let url;
    switch (obj.type) {
      case 'forgot':
        url = `forgot-password/reset`;
        return this.apiService
          .updateApi(url, payload.data)
          .pipe(
            map((res: ApiResponse) => {
              if (res.status) {
                return res;
              }
              return res;
            })
          )
          .toPromise();
      default:
        url = `user/password/${user_id}`;
        return this.apiService
          .updateApi(url, payload)
          .pipe(
            map((res: ApiResponse) => {
              if (res.status) {
                return res;
              }
              return res;
            })
          )
          .toPromise();
    }
  }

  forgotPassword(obj: any): Promise<ApiResponse | undefined> {
    const payload = cleanObject(obj);
    let url;
    switch (obj.type) {
      case 'verify':
        url = `forgot-password/verify`;
        return this.apiService
          .postApi(url, payload)
          .pipe(
            map((res: ApiResponse) => {
              if (res.status) {
                return res;
              }
              return res;
            })
          )
          .toPromise();
      default:
        url = `forgot-password`;
        return this.apiService
          .postApi(url, payload)
          .pipe(
            map((res: ApiResponse) => {
              if (res.status) {
                return res;
              }
              return res;
            })
          )
          .toPromise();
    }
  }

  private storeAuthData(
    data: AuthData | HasLaunched | IsOTPEnabled,
    name: string
  ) {
    StorageService.setItem(name, data);
  }

  private storeHasLaunchedApp(value: boolean) {
    const hasLaunched = {
      hasLaunched: value,
    };
    this.storeAuthData(hasLaunched, 'hasLaunched');
  }

  public async getToken(): Promise<any> {
    try {
      const token = StorageService.getItem('axs_auth_data');
      if (token != null) {
        this.token = token;
        this.isLoggedIn = true;
      } else {
        this.token = null;
        this.isLoggedIn = false;
      }
      return token;
    } catch (e) {
      return e;
    }
  }

  userLogOut() {
    const url = `logout`;
    return this.apiService.getApi(url).pipe(
      tap((res: ApiResponse) => {
        if (res.status) {
          StorageService.removeItem('axs_auth_data');
          StorageService.removeItem('axs_user_data');
          this.router.navigate(['/login']);
          return;
        }
        return res;
      })
    );
  }

  autoLogout() {
    StorageService.removeItem('axs_auth_data');
    StorageService.removeItem('axs_user_data');
    this.router.navigate(['/login']);
  }

  public hasLaunchedApp() {
    const parsedData = StorageService.getItem('hasLaunched');
    if (!parsedData) {
      return false;
    }
    return !!parsedData.hasLaunched;
  }

  isAuthenticated() {
    const parsedData = StorageService.getItem('axs_auth_data');
    if (!parsedData) {
      return false;
    }
    this.isLoggedInChanged.next(true);
    return !!parsedData.userToken;
  }
}
