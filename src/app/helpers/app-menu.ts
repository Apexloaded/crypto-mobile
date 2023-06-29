import { Menu } from '../interface/app-menu.interface';

export const appMenu: Array<Menu> = [
  {
    name: 'Wallet',
    icons: 'wallet-outline',
    url: '/wallet',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Referral',
    icons: 'person-add',
    url: '/referral',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Deposit',
    icons: 'download-outline',
    url: '/deposit',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Buy',
    icons: 'logo-bitcoin',
    url: '/buy',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Withdraw',
    icons: 'push-outline',
    url: '/withdrawal',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Calculator',
    icons: 'calculator-outline',
    url: '/calculator',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Settings',
    icons: 'cog-outline',
    url: '/settings',
    color: 'primary',
    type: 'menu',
  },
  {
    name: 'Logout',
    icons: 'power-outline',
    url: 'logout',
    color: 'primary',
    type: 'button',
  },
];
