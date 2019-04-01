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
  nbBuy : number;
  achat : number;
  croissance : number;

  @ViewChild('bar') progressBarItem;

  _qtmulti: string;
   @Input()
   set qtmulti(value: string) {
     this._qtmulti = value;
     if (this._qtmulti && this.product) this.calcMaxCanBuy();
   }

   _money : number;
@Input()
  set money(value: number) {
  this._money = value;
}



  constructor() { }

  ngOnInit() {

    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
    setInterval(() => { this.calcScore(); }, 100);

  }


barprogression(){
  if(this.product.quantite!=0){
    this.progressbar.animate(1, { duration: this.product.vitesse });
  //  this.progressbar.set(progress);

    this.product.timeleft = this.product.vitesse;
    this.lastupdate =Date.now();
  }
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


calcMaxCanBuy() {

  if (this._qtmulti == "x1") {

      let qtMax =  this.product.cout * this.product.croissance;

  //  const qtMax = (Math.log((-this._money * (1 - this.product.croissance)) / this.product.cout + 1 )) / Math.log(this.product.croissance);
          this.nbBuy = 1;
          return Math.round(qtMax);

  }

  if (this._qtmulti == "x10") {
      const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 10))/(1-this.product.croissance));
    this.nbBuy = 10;
  }

  if (this._qtmulti == "x100") {
    const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 100))/(1-this.product.croissance));
    this.nbBuy = 100;
  }

  if (this._qtmulti == "xMax") {
    //  let n = Math.round(this.money / this.product.cout );
    //  console.log(n);
    //  const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 4))/(1-this.product.croissance));
    //    console.log(Math.round(qtMax));
    const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 4))/(1-this.product.croissance));
    //    console.log(Math.round(qtMax));
    this.nbBuy = 600; //Pour tester
  }

}



  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
@Output() notifyBuyProduct: EventEmitter<number> = new EventEmitter<number>();
 }
