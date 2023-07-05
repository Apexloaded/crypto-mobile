import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../pages/home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'wallet',
        loadChildren: () => import('../pages/wallet/wallet.module').then(m => m.WalletPageModule)
      },
      {
        path: 'investments',
        loadChildren: () => import('../pages/transactions/investments/investments.module').then(m => m.InvestmentsPageModule)
      },
      {
        path: 'referral',
        loadChildren: () => import('../pages/referral/referral.module').then(m => m.ReferralPageModule)
      },
      {
        path: '',
        redirectTo: '/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule {}
