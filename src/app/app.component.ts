import { Component, ViewChildren, QueryList } from '@angular/core';
import { RestserviceService } from './restservice.service';
import { World, Product, Pallier } from './world';
import { ProductComponent } from './product/product.component';

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

  @ViewChildren(ProductComponent) productsComponent : QueryList<ProductComponent>;

  constructor(private service: RestserviceService) {
   this.server = service.getServer();
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



}
