import { Injectable } from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {
  private previousUrl: string = '';
  private currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
    router.events.subscribe(ev => {
      if (ev instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = ev.url;
      }
    });
  }

  get getPreviousRoute() {
    return this.previousUrl;
  }
}
