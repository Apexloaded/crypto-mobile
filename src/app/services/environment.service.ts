import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  public env = environment;

  constructor() {}

  get environment(): any {
    return this.env;
  }
}
