import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/interface';
import { UtilitiesService, AuthService, WalletService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  public user: User | undefined;
  public form: FormGroup = this.buildForm();

  constructor(
    private fb: FormBuilder,
    private utilService: UtilitiesService,
    private wallet: WalletService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    return this.fb.group({
      wallet: new FormControl(null, {
        updateOn: 'change',
      }),
    });
  }

  ionViewWillEnter() {
    this.user = this.authService.getUser();
  }

  submitWallet() {
    if (!this.form.valid) {
      this.utilService.presentToast('Enter your wallet address', 3000);
      return;
    }

    this.utilService.presentLoading('circles').then((el) => {
      const data = {
        btc_address: this.form.controls['wallet'].value,
        user_id: this.user?.id,
      };
      this.wallet
        .recordCreate(data)
        .then((res) => {
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(res?.message, 3000);
          this.router.navigateByUrl('/wallet');
          this.form.reset();
        })
        .catch((error) => {
          this.utilService.dismisLoadCtrl();
          if (error.name === 'HttpErrorResponse' && error.status == 0) {
            this.utilService.presentToast('Error from our end', 3000);
            return;
          }
          this.utilService.presentToast(error.message, 3000);
        });
    });
  }

  async paste() {
    const { type, value } = await Clipboard.read();
    this.form.controls['wallet'].setValue(value);
  }
}
