import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent {
  @Input('product') product: any;
  @Input('shopping-cart') shoppingCart: any; 

  constructor(private shoppingCartService: ShoppingCartService) { }

  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }

  getQuantity() {
    if (!this.shoppingCart.itemsMap) return 0;
      
    let item = this.shoppingCart.itemsMap[this.product.key];
    return item ? item.quantity : 0;
  }

}
