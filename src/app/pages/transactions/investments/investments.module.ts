import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InvestmentsPageRoutingModule } from './investments-routing.module';

import { InvestmentsPage } from './investments.page';
import { SharedModule } from 'src/app/modules/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InvestmentsPageRoutingModule,
    SharedModule
  ],
  declarations: [InvestmentsPage]
})
export class InvestmentsPageModule {}
