import { Component, OnInit } from '@angular/core';
import { Order } from '@stripe/stripe-js';
import { Observable, combineLatest, forkJoin, map, take } from 'rxjs';
import { OrderData, OrderInfo } from 'src/app/models/delivery-info';
import { ResourceDataService } from 'src/app/services/resource-data.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  orders: OrderData[];

  constructor(private resourceService: ResourceDataService) {
    const ordersObservable = this.resourceService.getAll('orders').snapshotChanges().pipe(
      map((value: any[]) => {
        return value.map(
          snapVal => {
            return { key: snapVal.payload.key, data: snapVal.payload.val() }
          }
        )
      }));

    const cartsObservable = this.resourceService.getAll('shopping-carts').snapshotChanges().pipe(
      map((value: any[]) => {
        return value.map(
          snapVal => {
            return { key: snapVal.payload.key, val:snapVal.payload.val()}
          }
        )
      }));

    combineLatest([ordersObservable, cartsObservable])
      .subscribe((values: any) => {
        this.orders = values[0] as OrderData[];
        this.orders.sort((a, b) =>  { 
          return new Date(b.data.date).getTime() - new Date(a.data.date).getTime(); 
        });
        
        const carts = values[1];

        this.orders.forEach((element:any) => {
          var index = carts.findIndex((item: any) => {
            return item.key === element.data.cartId
          }); 

          let obj: any[] = [];
          Object.keys(carts[index].val.items).forEach((item:any) => { 
            obj.push(carts[index].val.items[item])
          });

          element.data.cart = obj
        });

      });
  }

  ngOnInit() { }

  exploreOrder() {

  }

}
