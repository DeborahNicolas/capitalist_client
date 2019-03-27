declare var require;
const ProgressBar = require("progressbar.js");

import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';

import { Product } from '../world';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})


export class ProductComponent implements OnInit {


  product: Product;
  server= 'http://localhost:8080';
  progressbar: any;


  constructor() { }

  ngOnInit() {
  }



  @Input()
  set prod(value: Product) {
    this.product = value;
  }

 }
