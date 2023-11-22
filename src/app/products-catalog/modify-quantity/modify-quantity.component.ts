import { Component, Input, OnInit } from '@angular/core';
import { ShoppingCartService } from 'src/app/services/shopping-cart.service';

@Component({
  selector: 'modify-quantity',
  templateUrl: './modify-quantity.component.html',
  styleUrls: ['./modify-quantity.component.scss'],
})
export class ModifyQuantityComponent  implements OnInit {
  @Input('product') product: any;
  @Input('shopping-cart') shoppingCart: any; 

  constructor(private shoppingCartService: ShoppingCartService) { }

  ngOnInit() {}

  addToCart() {
    this.shoppingCartService.addToCart(this.product);
  }

  removeFromCart() {
    this.shoppingCartService.removeFromCart(this.product);
  }

  getQuantity() {
    if (!this.shoppingCart.itemsMap) return 0;
      
    let item = this.shoppingCart.itemsMap[this.product.key];
    return item ? item.quantity : 0;
  }

}
