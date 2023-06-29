import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { cleanObject } from '../helpers';
import { ApiResponse } from '../interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private apiService: ApiService) {}

  async recordRetrieve(query = '') {
    const url = `transactions${query}`;
    const proRes = this.apiService
      .getApi(url)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async getSingleRecord(param: string) {
    const url = `transactions/${param}`;
    const proRes = this.apiService
      .getApi(url)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async recordCreate(data: any) {
    const payload = cleanObject(data);
    const url = `investment`;
    const proRes = this.apiService
      .postApi(url, payload)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }
}
