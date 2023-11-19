
export interface Product {
    title: string;
    price: number;
    imageUrl: string;
    category: string;
}

export interface ProductEntry {
    key: string;
    data: Product;
}

export class ShoppingCartItem {

    constructor(public product: ProductEntry, public quantity: number) {

    }

    getProductPrice () {
        return this.product.data.price * this.quantity;
    }
}