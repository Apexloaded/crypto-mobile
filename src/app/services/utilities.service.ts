import { ComponentRef, Injectable } from '@angular/core';
import {
  ToastController,
  AlertController,
  ModalController,
  PopoverController,
  LoadingController,
  IonicSafeString,
  SpinnerTypes,
  ModalOptions,
} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  constructor(
    private toast: ToastController,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private popoverCtrl: PopoverController,
    private LoadingCtrl: LoadingController
  ) {}

  async presentToast(
    message: string | IonicSafeString | undefined,
    time: number
  ) {
    const toast = await this.toast.create({
      message,
      duration: time,
      cssClass: 'toast',
      position: 'bottom',
    });
    toast.present();
  }

  async presentAlert(title: string, msg: string, func: () => void) {
    const alert = await this.alertCtrl.create({
      header: `${title}`,
      message: `${msg}`,
      buttons: [
        {
          text: 'Yes',
          handler: func,
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });
    alert.present();
  }

  async presentModal(props: ModalOptions) {
    const modal = await this.modalCtrl.create({
      ...props,
    });
    modal.present();
  }

  async noPresentModal(modalEl: any, modalProp: any, cssStyle?: any) {
    const modal = await this.modalCtrl.create({
      component: modalEl,
      backdropDismiss: false,
      cssClass: cssStyle,
      componentProps: {
        data: modalProp,
      },
    });
    return modal;
  }

  async presentPopover(ev: Event, popoverEl: any) {
    const popover = await this.popoverCtrl.create({
      component: popoverEl,
      event: ev,
      translucent: true,
    });
    return await popover.present();
  }

  async presentLoading(spinner: SpinnerTypes) {
    const loader = await this.LoadingCtrl.create({
      spinner: spinner,
      translucent: true,
      animated: true,
      cssClass: ['text-dark'],
    });
    return await loader.present();
  }

  async displayError(error: any) {
    if (error.name === 'HttpErrorResponse') {
      return this.presentToast(error.statusText, 3000);
    }
  }

  public dismisLoadCtrl() {
    this.LoadingCtrl.dismiss();
  }

  public dismisModal() {
    this.modalCtrl.dismiss();
  }
}
