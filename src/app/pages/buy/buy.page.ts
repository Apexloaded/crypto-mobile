import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buy',
  templateUrl: './buy.page.html',
  styleUrls: ['./buy.page.scss'],
})
export class BuyPage implements OnInit {
  public assetPath = '../../../assets/images/btc-vendor';
  public links = [
    {
      image: `${this.assetPath}/btcx.png`,
      desc: 'fast and secure swedish exchange service',
      url: 'https://bt.cx/sv/',
    },
    {
      image: `${this.assetPath}/luno.png`,
      desc: 'Buy, save & manage your crypto in one place',
      url: 'https://luno.com',
    },
    {
      image: `${this.assetPath}/coinbase.png`,
      desc: 'Coinbase is the easiest place to buy, sell and manage your cryptocurrency portfolio.',
      url: 'https://coinbase.com',
    },
    {
      image: `${this.assetPath}/krakin.png`,
      desc: 'Buy, save and manage your crypto in one place',
      url: 'https://www.kraken.com/',
    },
    {
      image: `${this.assetPath}/okex.png`,
      desc: 'The cryptocurrency exchange with the most options',
      url: 'https://okex.com/',
    },
    {
      image: `${this.assetPath}/blockchain.png`,
      desc: "The world's most popular way to buy, hold and use crypto",
      url: 'https://blockchain.com',
    },
    {
      image: `${this.assetPath}/localbitcoin.png`,
      desc: 'Buy and sell bitcoin everywhere, near you or around the globe',
      url: 'https://localbitcoin.com/',
    },
    {
      image: `${this.assetPath}/cexio.png`,
      desc: 'A trusted and secure bitcoin exchange',
      url: 'https://cex.io/',
    },
    {
      image: `${this.assetPath}/paxful.png`,
      desc: 'Welcome to the peer-to-peer finance revolution',
      url: 'https://paxful.com/',
    },
    {
      image: `${this.assetPath}/coinmama.png`,
      desc: 'The easiest way to purchase, hold and exchange cryptocurrency',
      url: 'https://coinmama.com/',
    },
    {
      image: `${this.assetPath}/spectrocoin.png`,
      desc: 'A trusted and secure bitcoin exchange',
      url: 'https://spectrocoin.com/',
    },
    {
      image: `${this.assetPath}/abra.png`,
      desc: 'The easiest way to buy and sell cryptocurrency',
      url: 'https://abra.com/',
    },
  ];

  constructor(private router: Router) {}

  ngOnInit() {}

  public back() {
    this.router.navigateByUrl('/home');
  }
}
