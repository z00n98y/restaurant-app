import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ShoppingCart } from '../models/shopping-cart';
import { Router } from '@angular/router';



@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent  {
  paymentOption: 'onDelivery' | 'creditCard' = 'creditCard';
  shoppingCart: any;
  totalItems: number = 0;

  constructor(private shoppingCartService: ShoppingCartService, private router: Router) { 
    this.shoppingCartService.getCart()
    .subscribe (value => {
      this.shoppingCart = new ShoppingCart(value.items);
    })
  }

  proceedtoCheckout() {
    this.router.navigate(['checkout']);
  }

}
