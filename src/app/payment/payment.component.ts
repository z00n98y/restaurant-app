import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

import { StripeService } from 'ngx-stripe';
import {
  StripeElements,
  StripeElementsOptions,
  PaymentIntent,
  StripeCardNumberElement,
  StripeCardNumberElementOptions,
  StripeCardCvcElement,
  StripeCardCvcElementOptions,
  StripeCardExpiryElement,
} from '@stripe/stripe-js';
import { CardProperties } from '../models/properties';
import { Observable, switchMap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AppUser } from '../models/app-user';
import { AuthService } from '../services/auth.service';

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
  // @ViewChild(StripeCardComponent) card: StripeCardComponent;
  // cardOptions: StripeCardElementOptions = CardProperties.standardStandardOptions;
  appUser: AppUser|null;
  
  cartId: string = "";
  paymentStatus = status.default;

  cardNumberOptions: StripeCardNumberElementOptions = CardProperties.standardCardNumberOptions;
  cardStandardOptions: StripeCardCvcElementOptions = CardProperties.standardStandardOptions;

  elements: StripeElements;
  // card1: StripeCardElement;
  cardNumber: StripeCardNumberElement;
  cardCvc: StripeCardCvcElement;
  cardExpiryDate: StripeCardExpiryElement;

  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };

  stripeTest: FormGroup;
  constructor(private router: Router, 
    private http: HttpClient,
    private fb: FormBuilder,
    private stripeService: StripeService,
    public auth: AuthService) {

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

    this.stripeService.elements(this.elementsOptions)
      .subscribe(elements => {
        this.elements = elements;
        // Only mount the element the first time
        if (!this.cardNumber || !this.cardCvc || !this.cardExpiryDate) {
          // this.card = this.elements.create('card', this.cardOptions);
          // this.card.mount('#card-element');
          this.cardNumber = this.elements.create('cardNumber', this.cardNumberOptions);
          this.cardNumber.mount('#card-number');
          this.cardCvc = this.elements.create('cardCvc', this.cardStandardOptions);
          this.cardCvc.mount('#card-cvc');
          this.cardExpiryDate = this.elements.create('cardExpiry', this.cardStandardOptions);
          this.cardExpiryDate.mount('#card-expiry');
        }
      });

  }

  pay(): void {

    if (this.stripeTest.valid) {
      this.createPaymentIntent()
        .pipe(
          switchMap((pi) =>
            this.stripeService.confirmCardPayment(pi.client_secret, {
              payment_method: {
                card: this.cardNumber,
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
              localStorage.removeItem("cartId");
              setTimeout(() => {        
                this.router.navigate(['/']).then(() => {
                  window.location.reload();
                });
              }, 2000);
              
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
