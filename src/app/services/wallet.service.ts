import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { cleanObject } from '../helpers';
import { ApiResponse } from '../interface';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WalletService {
  public wallet: string = '';

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {
    let user = this.authService.getUser();
    //this.recordRetrieve(`?user_id=${user.id}`);
  }

  async recordRetrieve(query = '') {
    const url = `wallet${query}`;
    const proRes = this.apiService.getApi(url).pipe(
      map((res: ApiResponse) => {
        this.wallet = res.data.wallet;
        return res;
      })
    );
    return await proRes.toPromise();
  }

  get userWallet() {
    return this.wallet;
  }

  async recordCreate(data: any) {
    const payload = cleanObject(data);
    const url = `wallet`;
    const proRes = this.apiService
      .postApi(url, payload)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async initWithdraw(data: any) {
    const payload = cleanObject(data);
    const url = `withdraw`;
    const proRes = this.apiService
      .postApi(url, payload)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async updateWallet(walletId: string, payload: any) {
    const url = `wallet/${walletId}`;
    const proRes = this.apiService
      .updateApi(url, payload)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }
}
