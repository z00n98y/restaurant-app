import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy, RouterModule } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireDatabase, AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';

import { HttpClientModule } from '@angular/common/http';
// Import your library
import { NgxStripeModule } from 'ngx-stripe';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { HeaderComponent } from './header/header.component';
import { AdminProductsComponent } from './admin/admin-products/admin-products.component';
import { HomeComponent } from './home/home.component';
import { ProductsFormComponent } from './admin/products-form/products-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CategoriesComponent } from './categories/categories.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PaymentComponent } from './payment/payment.component';
import { authGuard } from './services/admin-auth-guard.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    AdminProductsComponent,
    ProductsFormComponent,
    CategoriesComponent,
    ShoppingCartComponent,
    ProductCardComponent,
    AdminDashboardComponent,
    LoginComponent,
    PaymentComponent
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxStripeModule.forRoot(environment.stripePublicKey),
    IonicModule.forRoot(),
    RouterModule.forRoot([
      { path: '', component: HomeComponent },
      { path: 'shopping-cart', component: ShoppingCartComponent},
      { path: 'login', component: LoginComponent},
      { path: 'admin/products/new', component: ProductsFormComponent, canActivate: [authGuard]},
      { path: 'admin/products/:id', component: ProductsFormComponent, canActivate: [authGuard]},
      { path: 'admin/products', component: AdminProductsComponent, canActivate: [authGuard] },
      { path: 'admin/dashboard', component: AdminDashboardComponent, canActivate: [authGuard]},
      { path: 'checkout', component: PaymentComponent},
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase())
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
