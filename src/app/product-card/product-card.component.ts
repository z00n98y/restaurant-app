import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResourceDataService } from '../services/resource-data.service';
import { take } from 'rxjs';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit{
  @Input('product') product: any;
  @Input('shopping-cart') shoppingCart: any; 

  constructor(
    route: ActivatedRoute,
    private resourceService: ResourceDataService, 
    private shoppingCartService: ShoppingCartService
    ) { 
    }



  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }

  removeFromCart() {
    this.shoppingCartService.removeFromCart(this.product);
  }

  getQuantity() {
    if (!this.shoppingCart.items) return 0;
      
    let item = this.shoppingCart.items[this.product.key];
    return item ? item.quantity : 0;
  }

  ngOnInit(): void {
    
  }

}
