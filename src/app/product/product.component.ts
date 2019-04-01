import { Component, Input, EventEmitter, Output, OnInit, ViewChild } from '@angular/core';

import { Product } from '../world';


declare var require;
const ProgressBar = require("progressbar.js");


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})


export class ProductComponent implements OnInit {

  product: Product;
  server= 'http://localhost:8080';
  progressbar: any;
  timeleft :number;
  lastupdate : number;

  @ViewChild('bar') progressBarItem;



  constructor() { }

  ngOnInit() {

    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
    setInterval(() => { this.calcScore(); }, 100);

  }


barprogression(){
  this.progressbar.animate(1, { duration: this.product.vitesse });
//  this.progressbar.set(progress);

  this.product.timeleft = this.product.vitesse;
  this.lastupdate =Date.now();
}

calcScore(){
  if(this.product.timeleft>0){
  //  var now = Date.now;
    this.product.timeleft = this.product.timeleft - (Date.now()-this.lastupdate);
    this.lastupdate = Date.now();

    if(this.product.timeleft<=0){
      this.product.timeleft = 0;
      this.progressbar.set(0);
      // on prévient le composant parent que ce produit a généré son revenu.
      this.notifyProduction.emit(this.product);
    }
}

}

  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();

 }
