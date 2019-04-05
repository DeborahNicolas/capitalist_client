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
  _qtmulti ="x1";

  @ViewChild('bar') progressBarItem;

//réceptionner la valeur de qtmulti (x1,x10,x100,xMax) via un setter pour pouvoir agir quand la valeur change
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
    //Création de la barre de progression pour la vente d'un produit. On appel calcScore pour qu'il calcule
    //notre score et notre argent quand la barre est chargée en entier
    this.progressbar = new ProgressBar.Line(this.progressBarItem.nativeElement, { strokeWidth: 50, color: '#00ff00' });
    setInterval(() => { this.calcScore(); }, 100);

  }

//Fonction barprogression qui est appelé lors d'un click sur l'image d'un produit.
//Si la quantité de notre produit est différent de 0, alors (au click) la barre s'anime puis se remet à 0 à la fin de son
//animation. Le temps est défini par la vitesse de production du produit.
barprogression(){
  if(this.product.quantite!=0){
    this.progressbar.animate(1, { duration: this.product.vitesse });
  //  this.progressbar.set(progress);

    this.product.timeleft = this.product.vitesse;
    this.lastupdate =Date.now();
  }
}


//fonction de calcul du score
//Pour chaque produit et en fonction du temps écoulé depuis la dernière fois, elle décrémente le temps restant de production du
//produit, et si ce temps devient négatif ou nul, elle ajoute l’argent généré au score et efface la barre de production.
calcScore(){
  if(this.product.timeleft>0){
  //  var now = Date.now;

  //On décrémente le temps restant.
    this.product.timeleft = this.product.timeleft - (Date.now()-this.lastupdate);
    this.lastupdate = Date.now();

    if(this.product.timeleft<=0){
      this.product.timeleft = 0;
      this.progressbar.set(0);
      // on prévient le composant parent que ce produit a généré son revenu.
      this.notifyProduction.emit(this.product);
      //Si le manager est débloqué, on lance la barre de progression automatiquement.
      if (this.product.managerUnlocked) {
          this.barprogression();
        }
    }
}}

//Calcul de la qté supplementaire maximale achetable
// selon si la qtmulti est x1; x10; x100 ou au max
//(prend en compte la croissance d'un cout)
//Utilisation d'un calcul d'une suite géométrique
calcMaxCanBuy() {
  var qtMax = 0;
  var cout = 0;

  if (this._qtmulti == "x1") {

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

    if (this.product.quantite == 0) {
        qtMax =  (this.product.cout * (1 - Math.pow(this.product.croissance, 10))/(1-this.product.croissance)); //pow : puissance
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


  let n = Math.log( 1 -
          (((1 - this.product.croissance) * this._money)
          / (this.product.cout * this.product.croissance)) )
       / Math.log(this.product.croissance);
      n = Math.floor(n);


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

//fonction achat :
// si j'ai assez d'argent et que je peux acheter, j'augmente ma quantité en stock et je depense la somme demandee
// sinon on me dit que je n'ai pas assez

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

  //Evenement de sortie
  //Le composant produit communique avec son parent pour indiquer qu'il faut augmenter l'argent possédé par le joueur
  @Output() notifyProduction: EventEmitter<Product> = new EventEmitter<Product>();
@Output() notifyBuyProduct: EventEmitter<number> = new EventEmitter<number>();
 }
