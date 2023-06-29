import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  static setItem(key: string, value: string | number | {}, expires?: number) {
    try {
      if (typeof value === 'string' || typeof value === 'number') {
        window.localStorage.setItem(key, `${value}`);
      } else {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
      if (expires) {
        expires = Math.abs(expires);
        const schedule = Date.now() + expires * 1000;
        window.localStorage.setItem(`${key}_exp`, schedule.toString());
      }
      return true;
    } catch (e) {
      console.log('Error: ' + e);
      return false;
    }
  }
  static getItem(key: string) {
    const expires = window.localStorage.getItem(`${key}_exp`);
    if (expires) {
      if (Number(expires) < Date.now()) {
        window.localStorage.removeItem(key);
        window.localStorage.removeItem(`${key}_exp`);
      }
    }
    const data = window.localStorage.getItem(key);
    try {
      if (data != null) return JSON.parse(data);
    } catch (e) {
      return data;
    }
  }
  static removeItem(key: string) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      console.log('Error: ', e);
      return false;
    }
    return true;
  }
}
