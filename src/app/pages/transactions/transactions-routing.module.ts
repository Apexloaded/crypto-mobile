import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TransactionsPage } from './transactions.page';

const routes: Routes = [
  {
    path: '',
    component: TransactionsPage
  },
  {
    path: 'investments',
    redirectTo: '/investments',
    pathMatch: 'full',
  },
  {
    path: 'details',
    children: [
      {
        path: '',
        loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
      },
      {
        path: ':id',
        loadChildren: () => import('./details/details.module').then( m => m.DetailsPageModule)
      }
    ]
    
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsPageRoutingModule {}
