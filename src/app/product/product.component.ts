import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Product } from '../world';
import { ViewChild } from '@angular/core';


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
    }
}
}


  @Input()
  set prod(value: Product) {
    this.product = value;
  }

 }
