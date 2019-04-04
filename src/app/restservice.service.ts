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


 private setHeaders(user : string) : Headers {
  var headers = new Headers();
  headers.append("X-User",user);
  return headers;
 }

// comme version supérieure à 4.3, pas besoin de mettre en json car les nouvelles versions angular convertissent automatiquement en json.
 getWorld(): Promise<World> {
  return this.http.get(this._server + "capitalist/generic/world", {
 headers: this.setHeaders(this._user)})
  .toPromise().catch(this.handleError);
 };


}
