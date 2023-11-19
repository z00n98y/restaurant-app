import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { Observable } from 'rxjs';
import { ShoppingCart } from '../models/shopping-cart';
import { ShoppingCartItem } from '../models/product';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent  {
  shoppingCart: ShoppingCart;
  totalItems: number = 0;

  constructor(private shoppingCartService: ShoppingCartService) { 
    this.shoppingCartService.getCart2()
    .subscribe (value => {
      this.shoppingCart = new ShoppingCart(value.items);
    })
  }

}
