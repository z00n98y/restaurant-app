import { Component, OnDestroy, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ResourceDataService } from '../services/resource-data.service';
import { ActivatedRoute } from '@angular/router';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';
import { PopoverController } from '@ionic/angular';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable, forkJoin } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  products: any;
  productsFiltered: any;
  category: any;
  subscription: any;
  totalItems: number = 0;
  collectionSize: number = 0;
  shoppingCart: any;

  appUser: AppUser;

  testproduct: any;
  testCart: ShoppingCart;

  constructor(
    route: ActivatedRoute,
    private resourceService: ResourceDataService,
    private shoppingCartService: ShoppingCartService,
    public auth: AuthService) {

    this.auth.appUser$().subscribe(value => {
      this.appUser = value;
    });

    this.resourceService.getAll('products').snapshotChanges().pipe(
      switchMap((products: any) => {
        this.productsFiltered = this.products = products;
        this.collectionSize = products.length;
        return route.queryParamMap;
      })
    ).subscribe(params => {
      this.category = params.get('category');
      this.productsFiltered = (this.category) ?
        this.products.filter((p: any) => p.payload.val().category === this.category) :
        this.products;
    })
    
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart()).valueChanges()
      .subscribe((cart: any) => {
        this.shoppingCart = cart;
        this.totalItems = 0;
        for (var key in this.shoppingCart.items) {
          this.totalItems += this.shoppingCart.items[key].quantity;
        }
      });

      
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
