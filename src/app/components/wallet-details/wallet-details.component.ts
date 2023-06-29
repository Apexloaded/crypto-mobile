import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { UtilitiesService, WalletService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-wallet-details',
  templateUrl: './wallet-details.component.html',
  styleUrls: ['./wallet-details.component.scss'],
})
export class WalletDetailsComponent implements OnInit {
  @Input() data: any;
  public form: FormGroup = this.buildForm();

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilitiesService,
    private fb: FormBuilder,
    private wallet: WalletService
  ) {}

  ngOnInit() {
    this.buildForm();
    this.form.controls['wallet'].setValue(this.data.wallet.address);
  }

  buildForm() {
    return this.fb.group({
      wallet: new FormControl(null, {
        updateOn: 'change',
        validators: [Validators.required],
      }),
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  public async copy(wallet: any) {
    await Clipboard.write({
      string: wallet.address,
    });
    this.utilService.presentToast('Wallet copied successfully', 3000);
  }

  public updateWallet(walletId: string) {
    if (this.data.wallet.address === this.form.controls['wallet'].value) {
      this.utilService.presentToast('Nothing changed', 3000);
      return;
    }

    if (!this.form.valid) {
      this.utilService.presentToast('Enter your wallet address', 3000);
      return;
    }

    this.utilService.presentLoading('circles').then(() => {
      const data = {
        address: this.form.controls['wallet'].value,
        type: this.data.type,
      };

      this.wallet
        .updateWallet(walletId, data)
        .then((res) => {
          this.close();
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast('Wallet Successfully updated', 3000);
        })
        .catch((error) => {
          this.utilService.dismisLoadCtrl();
          this.utilService.presentToast(error.message, 3000);
        });
    });
  }
}
