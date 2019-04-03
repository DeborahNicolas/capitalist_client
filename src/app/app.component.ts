import { Component, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ToasterModule, ToasterService} from 'angular2-toaster';
import { FormsModule } from '@angular/forms';

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

  @ViewChildren(ProductComponent) productsComponent : QueryList<ProductComponent>;

  constructor(service : RestserviceService, toaster : ToasterService) {
   this.server = service.getServer();
   this.toasterService = toaster;
   service.getWorld().then(
     world => {
      this.world = world;
    });
  }


  onProductionDone(p : Product) {
      this.world.money += (p.revenu * p.quantite);
      this.world.score += (p.revenu * p.quantite);
    }

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

managerHired(manager : Pallier) {
          if (this.world.money >= manager.seuil && this.world.products.product[manager.idcible-1].managerUnlocked == false) {
            this.world.money -= manager.seuil;
            this.world.products.product[manager.idcible-1].managerUnlocked = true;
            this.world.managers.pallier[manager.idcible-1].unlocked = true;
            this.toasterService.pop('success', 'Manager hired ! ', manager.name);
            console.log(manager.name);
          }
        }



}
