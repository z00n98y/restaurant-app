import { Component, OnInit } from '@angular/core';
import { ResourceDataService } from '../../services/resource-data.service';
import { finalize, map, take } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { FileUpload } from '../../services/data-interfaces.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
})
export class ProductsFormComponent  implements OnInit {
  selectedFiles?: FileList;
  currentFileUpload?: FileUpload;
  categories$: any;
  product: any = {};
  id: any;
  constructor(private router: Router, 
    private route: ActivatedRoute, 
    private productService: ResourceDataService,
    private storage: AngularFireStorage) 
  { 
    this.categories$ = this.productService.getAll('categories').snapshotChanges().pipe(
      map(value => { return value.map(
        snapVal => {
          const key = snapVal.payload.key;
          const data = snapVal.payload.val();
          return {key, data};
        }
      )}));

    this.id = this.route.snapshot.paramMap.get('id');
    if (this.id)  this.productService.get("products/" + this.id, "").valueChanges().pipe(take(1)).subscribe( p => 
      { 
        this.product = p;
    });
  }

  ngOnInit() {}

  save(product: any) {
    if(this.id) this.productService.update("products", this.id, product);
    else this.productService.create("products", product);

    this.router.navigate(['/admin/products']);
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
      this.selectedFiles = undefined;

      if (file) {
        this.currentFileUpload = new FileUpload(file);
        this.pushFileToStorage(this.currentFileUpload).subscribe(
          ( error: any) => {
            console.log(error);
          }
        );
      }
    }
  }

  pushFileToStorage(fileUpload: FileUpload): any {
    const filePath = `${fileUpload.file.name}`;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, fileUpload.file);

    uploadTask.snapshotChanges().pipe(
      finalize(() => {
        storageRef.getDownloadURL().subscribe(downloadURL => {
          this.product.imageUrl = downloadURL; 
        });
      })
    ).subscribe();

    return uploadTask.percentageChanges();
  }
}
