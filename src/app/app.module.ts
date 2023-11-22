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
import { ProductCardComponent } from './products-catalog/product-card/product-card.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { LoginComponent } from './login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { PaymentComponent } from './order-info/payment/payment.component';
import { authGuard } from './services/admin-auth-guard.service';
import { ModifyQuantityComponent } from './products-catalog/modify-quantity/modify-quantity.component';
import { OrdersComponent } from './order-info/orders/orders.component';


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
    ModifyQuantityComponent,
    LoginComponent,
    PaymentComponent,
    OrdersComponent
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
      { path: 'orders/:id', component: PaymentComponent},
      { path: 'orders', component: OrdersComponent, canActivate: [authGuard]},
    ]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase())
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
