import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ActivatedRoute, Router } from '@angular/router';
import * as fireAuth  from 'firebase/auth';
import { Observable, switchMap } from 'rxjs';
import { AppUser } from '../models/app-user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<fireAuth.User>;
  isLoggedIn: boolean;

  constructor(private userService: UserService, private afAuth: AngularFireAuth, private route: ActivatedRoute, private router: Router) { 
    this.user$ = afAuth.authState;

    afAuth.onAuthStateChanged( state => {
      this.isLoggedIn = (state) ? true : false; 
    });
  }

  login() {
    let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/';
    localStorage.setItem('returnUrl', returnUrl)

    this.afAuth.signInWithPopup(new fireAuth.GoogleAuthProvider());

    this.router.navigateByUrl(returnUrl);
  }

  logout() {
    this.afAuth.signOut();
    localStorage.setItem('returnUrl', '/');
    this.router.navigateByUrl('/');
  }

  appUser$() : Observable<AppUser> {
    return this.user$
    .pipe(switchMap(user => this.userService.get(user?.uid).valueChanges()));
  }
}
