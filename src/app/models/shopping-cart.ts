import { ShoppingCartItem } from "./product";


export class ShoppingCart {
    items: ShoppingCartItem[] = [];

    constructor(public itemsMap: {[id: string]: ShoppingCartItem}) {
        for (let id in itemsMap) {
            let item = itemsMap[id].product;
            this.items.push(new ShoppingCartItem(item, itemsMap[id].quantity))
        }
        
    }

    getTotalPrice() {
        let sum = 0;
        for (let id in this.items) 
            sum+= this.items[id].getProductPrice();
        return sum;
    }

    getTotalItems() {
        let count = 0;
        for (let productId in this.itemsMap) {
            count += this.itemsMap[productId].quantity;
        }
        return count;
    }
}