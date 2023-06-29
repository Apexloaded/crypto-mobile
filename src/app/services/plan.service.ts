import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { ApiResponse } from '../interface';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class PlanService {
  constructor(private apiService: ApiService) {}

  async recordRetrieve() {
    const url = `plans`;
    const proRes = this.apiService
      .getApi(url)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }

  async getSingleRecord(param: string) {
    const url = `plans/${param}`;
    const proRes = this.apiService
      .getApi(url)
      .pipe(map((res: ApiResponse) => res));
    return await proRes.toPromise();
  }
}
