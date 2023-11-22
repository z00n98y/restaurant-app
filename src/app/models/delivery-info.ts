

export interface Delivery {
    name: string;
    streetName: string;
    streetNumber: string;
    postalCode: string;
    city: string;
}


export interface OrderInfo {
    deliveryInfo: Delivery;
    date: string;
    cart?: any;
    products?: any;
    cartId: string;
    paymentStatus?: string;
}

export interface OrderData {
    data: OrderInfo;
    key: string;
}
