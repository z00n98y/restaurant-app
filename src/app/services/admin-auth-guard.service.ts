import { inject } from '@angular/core';
import {  Router } from '@angular/router';
import { map, Observable, switchMap } from 'rxjs';
import { AuthService } from './auth.service';


export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  authService.appUser$()
  .pipe(map(appUser =>  appUser.userRole === 'admin'))
  .subscribe( value => {

    if (value) {
      return true;
    }
  
    // Redirect to the home page
    return router.navigateByUrl('/');
  })

  
};