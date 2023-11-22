import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { StripeCardNumberComponent, StripeService } from 'ngx-stripe';
import {
  StripeElements,
  StripeElementsOptions,
  PaymentIntent,
  StripeCardNumberElement,
  StripeCardNumberElementOptions,
  StripeCardCvcElement,
  StripeCardCvcElementOptions,
  StripeCardExpiryElement,
  StripeCardElementOptions,
} from '@stripe/stripe-js';
import { CardProperties } from '../../models/properties';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppUser } from '../../models/app-user';
import { AuthService } from '../../services/auth.service';
import { Delivery } from 'src/app/models/delivery-info';
import { ResourceDataService } from 'src/app/services/resource-data.service';

const status = {
  success: {
    color: 'success',
    text: 'Payment successfull'
  },
  default: {
    color: 'warning',
    text: 'Pay'
  }
}


@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
})
export class PaymentComponent implements OnInit {
  @ViewChild(StripeCardNumberComponent) card: StripeCardNumberComponent;

  appUser: AppUser | null;
  deliveryInformation: Delivery = {
    name: "",
    streetName: "",
    streetNumber: "",
    postalCode: "",
    city: " Perth (WA)"
  }

  cartId: string = "";
  paymentStatus = status.default;

  cardOptions: StripeCardElementOptions = CardProperties.standardCardNumberOptions;


  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;
  constructor(private router: Router,
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    public auth: AuthService,
    private resourceService: ResourceDataService) {

    // Get cart id
    this.cartId = localStorage.getItem('cartId');
    this.auth.appUser$().subscribe(value => {
      this.appUser = value;
    });

  }


  ngOnInit() {
    this.stripeTest = this.fb.group({
      name: ['Angular v10', [Validators.required]],
      amount: [1000, [Validators.required, Validators.pattern(/\d+/)]],
    });
  }

  pay(deliveryInfo: any): void {

    if (this.stripeTest.valid) {
      this.createPaymentIntent()
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.card.element,
                billing_details: {
                  name: this.stripeTest.get('name').value,
                },
              },
            })
          )
        )
        .subscribe((result) => {
          if (result.error) {
            // Show error to your customer (e.g., insufficient funds)
            console.log(result.error.message);
          } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
              // Show a success message to your customer
              this.paymentStatus = status.success;
              this.resourceService.create('orders', 
              { 
                cartId: localStorage.getItem("cartId"),
                deliveryInfo: deliveryInfo,
                date: new Date().getTime(),
                paymentStatus: 'paid'
              })

              localStorage.removeItem("cartId");
              setTimeout(() => {
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              }, 3000);

            }
          }
        });
    } else {
      console.log(this.stripeTest);
    }
  }

  createPaymentIntent(): Observable<PaymentIntent> {
    return this.http.post<PaymentIntent>(
      environment.confirmPaymentApi,
      { "cartId": this.cartId }
    )
  }
}
