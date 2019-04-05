import { Component, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import { FormsModule } from '@angular/forms';
import { isNull } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'capitalist';
  world: World = new World();
  server= 'http://localhost:8080';
  qtmulti = "x1";
  seuil : number ;
  toasterService: ToasterService;
  username : string;

//Appel à l'enfant : product component
  @ViewChildren(ProductComponent) productsComponent : QueryList<ProductComponent>;

//Pseudo du joueur
//Sauvegarder la valeur : localStorage
// et mise à jour cette valeur
  constructor(service : RestserviceService, toaster : ToasterService) {
   this.server = service.getServer();
   this.toasterService = toaster;

   this.username = localStorage.getItem("username");
   if (isNull(this.username)) {
      this.username = "Captain" + Math.floor(Math.random()*10000);
      localStorage.setItem("username", this.username);
    }

//service.getWorld(this.username).then(
   service.getWorld().then(
     world => {
      this.world = world;
    });
  }

//Quand la production d'un produit est lancé, mon argent et mon score augmente.
  onProductionDone(p : Product) {
      this.world.money += (p.revenu * p.quantite);
      this.world.score += (p.revenu * p.quantite);
    }

//Effet du click sur le bouton :
//passe de x1 à x10 à x100 à xMax
  onClickqtMulti() {
      if (this.qtmulti == 'x1') {
        this.qtmulti = 'x10';
      } else if (this.qtmulti == "x10") {
        this.qtmulti = 'x100';
      } else if(this.qtmulti == "x100"){
        this.qtmulti = 'xMax';
      } else if (this.qtmulti == "xMax") {
        this.qtmulti = 'x1';
      }
    }

onBuy(buy : number) {
      this.world.money -= buy;
      }

//Engagement Manager :
//Si mon argent est suffisant pour l'acheter et si je l'ai pas encore débloqué :
//Je soustrais le cout du manager à mon argent
//Je débloque le managers
//je renvoi un message ephemere qui ne marche pas pour cause de version.
managerHired(manager : Pallier) {
          if (this.world.money >= manager.seuil && this.world.products.product[manager.idcible-1].managerUnlocked == false) {
            this.world.money -= manager.seuil;
            this.world.products.product[manager.idcible-1].managerUnlocked = true;
            this.world.managers.pallier[manager.idcible-1].unlocked = true;
            this.toasterService.pop('success', 'Manager hired ! ', manager.name);
            console.log(manager.name);
          }
        }

//Badge qui s'affiche sur le bouton Manager lorsque j'ai assez d'argent pour acheter un manager et que
//je ne l'ai pas encore acheté.
badgeManager() {
    let i : number;
      for (i = 0 ; i < this.world.managers.pallier.length; i++) {
        if (this.world.managers.pallier[i].seuil < this.world.money && !this.world.managers.pallier[i].unlocked) {
          return true;
              }
            }
          }





}
