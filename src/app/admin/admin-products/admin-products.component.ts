import { Component, OnInit } from '@angular/core';
import { ResourceDataService } from '../../services/resource-data.service';
import { ProductEntry, Product } from '../../models/product';
import { map } from 'rxjs';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.scss'],
})
export class AdminProductsComponent {
  products: ProductEntry[] = [];
  productsFiltered: ProductEntry[] = [];
  collectionSize: number = 0;

  constructor(private resourceService: ResourceDataService) {
    this.resourceService.getAll('products').snapshotChanges().pipe(
      map((value: any[]) => { return value.map(
        snapVal => {
          const productEntry: ProductEntry = {key: snapVal.payload.key, data: snapVal.payload.val() as Product}
          return productEntry;
        }
    )}))
    .subscribe( products => {
      this.productsFiltered = this.products = products as ProductEntry[];
      this.collectionSize = products.length;
    });
   }

}
