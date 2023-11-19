import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ResourceDataService {
  constructor(private db: AngularFireDatabase) { }

  create(location: string, resource: any) {
    return this.db.list('/' + location).push(resource);
  }

  setObject(location: string, resource: any) {
    return this.db.object('/' + location).set(resource);
  }

  setList(location: string, key: string, resource: any) {
    return this.db.list('/' + location).set(key, resource);
  }

  getAll(location: string) {
    return this.db.list('/' + location);
  }

  get(location: string, resourceId: any) {
    let locString = (resourceId == "") ? '/' + location : '/' + location + '/' + resourceId;
    return this.db.object(locString);
  }

  update(location: string, resourceId: any, resource: any){
    return this.db.object('/' + location + '/' + resourceId).update(resource);
  }

  delete(location: string, resourceId: any) {
    this.db.object('/' + location + '/' + resourceId).remove();
  }
}
