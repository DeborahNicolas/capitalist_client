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
  nbmax : number;
  croissance : number;
  cout : number;

  @ViewChild('bar') progressBarItem;

  _qtmulti ="x1";
   @Input()
   set qtmulti(value: string) {
     this._qtmulti = value;
     if (this._qtmulti && this.product) this.calcMaxCanBuy();
   }

   _money : number;
@Input()
  set money(value: number) {
  this._money = value;
  if (this._qtmulti && this.product) this.calcMaxCanBuy();
}



  constructor() {
  }

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
      if (this.product.managerUnlocked) {
          this.barprogression();
        }
    }
}

}


calcMaxCanBuy() {
  var qtMax = 0;
  var cout = 0;

  if (this._qtmulti == "x1") {

    //  let qtMax =  this.product.cout * this.product.croissance;

    //  console.log(this.product);

  //  const qtMax = (Math.log((-this._money * (1 - this.product.croissance)) / this.product.cout + 1 )) / Math.log(this.product.croissance);
    //      this.nbBuy = 1;
      //    this.nbmax = Math.round(qtMax);


          if (this.product.quantite == 0) {
            qtMax =  this.product.cout;
            this.nbBuy = 1;
            cout = this.product.cout;
            this.nbmax = Math.round(qtMax);
          } else {
            qtMax =  this.product.cout * this.product.croissance;
            this.nbBuy = 1;
            cout = this.product.cout * this.product.croissance;
            this.nbmax = Math.round(qtMax);
          }

  }

  if (this._qtmulti == "x10") {
    //  const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 10))/(1-this.product.croissance));
  //  this.nbBuy = 10;
  //  this.nbmax =  Math.round(qtMax);

    if (this.product.quantite == 0) {
        qtMax =  (this.product.cout * (1 - Math.pow(this.product.croissance, 10))/(1-this.product.croissance));
        this.nbBuy = 10;
        cout = this.product.cout * Math.pow(this.product.croissance, 10);
        this.nbmax =  Math.round(qtMax);
    } else {
        qtMax =  (this.product.cout * this.product.croissance * (1 - Math.pow(this.product.croissance, 10))/(1-this.product.croissance));
        this.nbBuy = 10;
        cout = this.product.cout * Math.pow(this.product.croissance, 10);
        this.nbmax =  Math.round(qtMax);
      }

  }

  if (this._qtmulti == "x100") {
  //  const qtMax = (this.product.cout * (1 - Math.pow(this.product.croissance, 100))/(1-this.product.croissance));
  //  this.nbBuy = 100;
    //this.nbmax =  Math.round(qtMax);


    if (this.product.quantite == 0) {
        qtMax =  (this.product.cout * (1 - Math.pow(this.product.croissance, 100))/(1-this.product.croissance));
        this.nbBuy = 100;
        cout = this.product.cout * Math.pow(this.product.croissance, 100);
        this.nbmax =  Math.round(qtMax);
    } else {
        qtMax =  (this.product.cout * this.product.croissance * (1 - Math.pow(this.product.croissance, 100))/(1-this.product.croissance));
        this.nbBuy = 100;
        cout = this.product.cout * Math.pow(this.product.croissance, 100);
        this.nbmax =  Math.round(qtMax);
      }

  }

  if (this._qtmulti == "xMax") {


  //const qtMax = (Math.log((-this._money * (1- this.product.croissance)) * this.product.cout + 1)) / Math.log(this.product.croissance);



  let n = Math.log( 1 -
          (((1 - this.product.croissance) * this._money)
          / (this.product.cout * this.product.croissance)) )
       / Math.log(this.product.croissance);
      n = Math.floor(n);
    //  this.nbBuy = Math.round(this.product.cout * this.product.croissance ** n);

        //    this.nbmax =  Math.round(qtMax);


      //  let qtMax = 0;
        if (this.product.quantite == 0) {
          qtMax =  this.product.cout * this.product.croissance * (1- Math.pow(this.product.croissance, n))/(1-this.product.croissance);
        } else {
          qtMax =  this.product.cout * (1- Math.pow(this.product.croissance, n))/(1-this.product.croissance);
        }
        cout = this.product.cout * Math.pow(this.product.croissance, n);
        this.nbBuy = n;
        this.nbmax =  Math.round(qtMax);
        }


}


achat() {


  if (this._money >= this.nbmax && this.nbmax != 0) {
    this.product.cout = this.nbmax;
    console.log(this.product.cout);
    this.product.quantite += this.nbBuy;
    this._money -= this.product.cout;
    console.log(this._money);
    this.notifyBuyProduct.emit(this.nbmax);
        } else {
          console.log("pas assez d'argent");
        }


}



  @Input()
  set prod(value: Product) {
    this.product = value;
  }

  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
@Output() notifyBuyProduct: EventEmitter<number> = new EventEmitter<number>();
 }
