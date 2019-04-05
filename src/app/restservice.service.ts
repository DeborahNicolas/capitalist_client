import { Injectable } from '@angular/core';
import { World, Pallier, Product } from './world';
import {Headers} from '@angular/http';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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

 //transmettre le nom de l’utilisateur dans l’entête http avec un header

 private handleError(error: any): Promise<any> {
  console.error('An error occurred', error);
  return Promise.reject(error.message || error);
 }


 private setHeaders(user : string) : Headers {
  var headers = new Headers();
  headers.append("X-User", user);
  return headers;
 }

//Tentative d'ajout d'un monde propre à chaque utilisateur, il y a peut être un problème de version

// comme version supérieure à 4.3, pas besoin de mettre en json car les nouvelles versions angular convertissent automatiquement en json.
 //getWorld(username: string): Promise<World> {
   //const httpOpntions = {
  //   headers: new HttpHeaders({
    //   'X-User': username
  //   })
  // }
  //return this.http.get(this._server + "capitalist/generic/world", httpOpntions)
  //.toPromise().catch(this.handleError);
 //};


//méthode getWorld() qui réalise l’appel GET /world au service web. 
 getWorld(): Promise<World> {

  return this.http.get(this._server + "capitalist/generic/world", {

 headers: this.setHeaders(this._user)})

  .toPromise().catch(this.handleError);

 };


}
