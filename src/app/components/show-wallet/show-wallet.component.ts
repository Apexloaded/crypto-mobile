import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UtilitiesService } from 'src/app/services';
import { Clipboard } from '@capacitor/clipboard';

type InputType = {
  payment_method: string;
  amount: number;
  to_wallet: string;
  from_wallet: string;
};

@Component({
  selector: 'app-show-wallet',
  templateUrl: './show-wallet.component.html',
  styleUrls: ['./show-wallet.component.scss'],
})
export class ShowWalletComponent implements OnInit {
  @Input() data: InputType | undefined;

  constructor(
    private modalCtrl: ModalController,
    private utilService: UtilitiesService
  ) {}

  ngOnInit() {}

  close() {
    this.modalCtrl.dismiss();
  }

  public async copy(wallet: any) {
    await Clipboard.write({
      string: wallet
    });
    this.utilService.presentToast('Wallet copied successfully', 3000);
  }

  public async paste() {
    const { type, value } = await Clipboard.read();
  }
}
