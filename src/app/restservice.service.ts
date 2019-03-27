import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { World, Pallier, Product } from './world';

@Injectable({
  providedIn: 'root'
})
export class RestserviceService {

constructor(private http: HttpClient) {

 }

 _server = "http://localhost:8080/"
 _user = "";

 getUser(){
   return this._user;
 }

 getServer(){
   return this._server;
 }

 setUser(val){
   this._user = val;
 }

 setServer(val){
   this._server = val;
 }

 private handleError(error: any): Promise<any> {
  console.error('An error occurred', error);
  return Promise.reject(error.message || error);
 }
 getWorld(): Promise<World> {
  return this.http.get(this._server + "capitalist/generic/world")
  .toPromise().catch(this.handleError);
 };


}
