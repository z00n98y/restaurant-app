import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { map, switchMap } from 'rxjs/operators';
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
export class HeaderComponent implements OnInit, AfterViewInit {
  products: any;
  productsFiltered: any;
  productsByCategories: any;
  category: any;
  subscription: any;
  totalItems: number = 0;
  collectionSize: number = 0;
  shoppingCart: any;

  appUser: AppUser;


  constructor(
    private route: ActivatedRoute,
    private resourceService: ResourceDataService,
    private shoppingCartService: ShoppingCartService,
    public auth: AuthService) {

    this.auth.appUser$().subscribe(value => {
      this.appUser = value;
    });
  }
  
  ngAfterViewInit(): void { 
    this.resourceService.getAll('products').snapshotChanges().pipe(
      map(value => { return value.map(
        snapVal => {
          const key = snapVal.payload.key;
          const data = snapVal.payload.val();
          return {key, data};
        }
      )}),
      switchMap((products: any) => {
        this.productsByCategories = this.products = products;
        this.collectionSize = products.length;
        return this.route.queryParamMap;
      })
    ).subscribe(params => {
      this.category = params.get('category');
      this.productsFiltered = this.productsByCategories = (this.category) ?
        this.products.filter((p: any) => p.data.category === this.category) :
        this.products;
    })
  }

  async ngOnInit() {
    this.subscription = (await this.shoppingCartService.getCart())
      .subscribe((value: any) => {
        if(!value) value = { items: []};
        this.shoppingCart = new ShoppingCart(value.items);
      });
  }

  filterProducts(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productsFiltered = this.productsByCategories.filter((el: any) => 
      el.data.title.toLowerCase().includes(filterValue.toLowerCase())
    );
  }

  logout() {
    this.auth.logout();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }


}
