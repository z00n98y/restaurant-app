import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireObject } from '@angular/fire/compat/database';
import { take } from 'rxjs/operators';
import { ShoppingCartItem } from '../models/product';
import { ShoppingCart } from '../models/shopping-cart';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {

  constructor(private db: AngularFireDatabase) { }


  create(location: string, resource: any) {
    return this.db.list('/' + location).push(resource);
  }

  setObject(location: string, resource: any) {
    return this.db.object('/' + location).set(resource);
  }

  getAll(location: string) {
    return this.db.list('/' + location);
  }

  get(location: string) {
    return this.db.object(location);
  }

  update(location: string, resource: any){
    return this.db.object(location).update(resource);
  }

  delete(location: string, resourceId: any) {
    this.db.object('/' + location + '/' + resourceId).remove();
  }

  getCart(): Observable<any> {
    let cartId = this.getOrCreateCartId()
    return this.db.object('/shopping-carts/' + cartId).valueChanges();
  }


  public getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
    if (cartId) return cartId;

    console.log(cartId)
    let result = this.create("shopping-carts", { date: new Date().getTime(), items: [] })
    localStorage.setItem('cartId', result.key || '');
    return result.key;
  }

  addToCart(product: any) {
    this.updateItemQuantity(product, 1);
  }

  removeFromCart(product: any) {
    this.updateItemQuantity(product, -1);
  }

  private async updateItemQuantity ( product: any, change: number ) {
    let cartId = await this.getOrCreateCartId();

    let item$ = this.get('shopping-carts/' + cartId + '/items/' + product.key);
    item$.snapshotChanges().pipe(take(1)).subscribe((item: any) => {
      if (item.payload.exists()) {
        let savedItem = item.payload.val() as ShoppingCartItem;
        this.update('shopping-carts/' + cartId + '/items/' + product.key,
          {
            product: { key: product.key, data: product.data },
            quantity: (savedItem.quantity || 0) + change
          })
      }
      else {
        this.setObject('shopping-carts/' + cartId + '/items/' + product.key,
          {
            product: { key: product.key, data: product.data },
            quantity: 1
          })
      }
    })
  }





}
