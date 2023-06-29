import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReferralService {
  constructor(private apiService: ApiService) {}

  async recordRetrieve(query = '') {
    const url = `referral${query}`;
    const proRes = this.apiService
      .getApi(url)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async withdrawEarnings(data: any) {
    const url = `referral/withdraw`;
    const proRes = this.apiService
      .postApi(url, data)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }
}
