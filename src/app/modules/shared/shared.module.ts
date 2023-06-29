import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { OtpFormComponent } from 'src/app/components/otp-form/otp-form.component';
import { WalletDetailsComponent } from 'src/app/components/wallet-details/wallet-details.component';
import { ErrorComponent } from 'src/app/components/error/error.component';
import { NotificationMsgComponent } from 'src/app/components/notification-msg/notification-msg.component';
import { ProfilePopoverComponent } from 'src/app/components/profile-popover/profile-popover.component';
import { ProfileEditComponent } from 'src/app/components/profile-edit/profile-edit.component';

@NgModule({
  declarations: [
    OtpFormComponent,
    WalletDetailsComponent,
    ErrorComponent,
    NotificationMsgComponent,
    ProfilePopoverComponent,
    ProfileEditComponent
  ],
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  exports: [
    OtpFormComponent,
    WalletDetailsComponent,
    ErrorComponent,
    NotificationMsgComponent,
    ProfilePopoverComponent,
    ProfileEditComponent
  ]
})
export class SharedModule {}
