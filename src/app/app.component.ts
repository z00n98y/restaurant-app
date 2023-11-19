import { Component } from '@angular/core';
import { ResourceDataService } from './services/resource-data.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  categories: any;
  constructor(private resourceService: ResourceDataService
  ) {
    this.resourceService.getAll("categories").snapshotChanges().pipe(
      map(value => { return value.map(
      snapVal => {
        const key = snapVal.payload.key;
        const data = snapVal.payload.val();
        return {key, data};
      }
    )})).subscribe( data => {
        this.categories = data;
      }
    )
  }
}
