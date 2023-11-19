import { AfterViewInit, Component } from '@angular/core';
import { map } from 'rxjs';
import { ResourceDataService } from 'src/app/services/resource-data.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
})
export class AdminDashboardComponent  implements AfterViewInit {
  users: any;
  
  constructor(private resourceService: ResourceDataService) { }

  ngAfterViewInit(): void {
    this.resourceService.getAll("users").snapshotChanges().pipe(
      map(value => { return value.map(
      snapVal => {
        const key = snapVal.payload.key;
        const data = snapVal.payload.val();
        return {key, data};
      }
    )})).subscribe( usersData => {
        this.users = usersData ;
      }
    )
  }

  changeRow (e: any, user: any) {
    this.resourceService.update("users", user.key, 
    {
      name: user.data.name,
      email: user.data.email,
      userRole: e.detail.value
    });
  }

}
