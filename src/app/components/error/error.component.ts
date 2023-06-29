import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent  implements OnInit {
  @Input() icon: string | undefined;
  @Input() msg: string | undefined;
  @Input() title: string | undefined;
  @Input() redirectUrl?: string;
  @Input() btnTitle?: string;

  constructor(private router: Router) { }

  ngOnInit() {}

  redirect(url: string) {
    this.router.navigateByUrl(`${url}`);
  }
}
