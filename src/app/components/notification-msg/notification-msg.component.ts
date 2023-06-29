import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notification-msg',
  templateUrl: './notification-msg.component.html',
  styleUrls: ['./notification-msg.component.scss'],
})
export class NotificationMsgComponent  implements OnInit {

  @Input() icon?: string;
  @Input() msg?: string;
  @Input() title?: string;
  @Input() redirectUrl?: string;
  @Input() btnTitle?: string;

  constructor(private router: Router) { }

  ngOnInit() {
    console.log(this.icon);
  }

  redirect(url: string) {
    this.router.navigateByUrl(`${url}`);
  }

}
