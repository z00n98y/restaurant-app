import { Component, Input } from '@angular/core';
import { ResourceDataService } from '../services/resource-data.service';
import { AuthService } from '../services/auth.service';
import { AppUser } from '../models/app-user';

@Component({
  selector: 'categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
})
export class CategoriesComponent {
  @Input() category: string = "";
  categories$: any;

  appUser: AppUser|null;

  constructor(private resourceService: ResourceDataService,
    public auth: AuthService) { 
    this.categories$ = this.resourceService.getAll('categories').snapshotChanges();
    this.auth.appUser$().subscribe(value => {
      this.appUser = value;
    });
    
  }


}
