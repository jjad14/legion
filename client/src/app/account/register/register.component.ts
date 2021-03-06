import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AsyncValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { timer, of } from 'rxjs';

import { AccountService } from '../account.service';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(private fb: FormBuilder,
              private accountService: AccountService,
              private router: Router) { }

  ngOnInit() {
    this.createRegisterForm();
  }

  createRegisterForm() {
    // alt way of creating form (login form uses other method)
    this.registerForm = this.fb.group({
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required,
                     Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')],
                    [this.validateEmailAddress()]],
      password: [null, [Validators.required]],
    });
  }

  validateEmailAddress(): AsyncValidatorFn {
    return control => {
      return timer(500)
        .pipe(
          switchMap(() => {
            if (!control.value) {
              return of(null);
            }
            return this.accountService.checkEmailExists(control.value)
              .pipe(
                map(res => {
                  return res ? {emailExists: true} : null;
                })
              );
          })
        );
    };
  }

  onSubmit() {
    this.accountService.register(this.registerForm.value)
      .subscribe(res => {
        this.router.navigateByUrl('/shop');
      }, error => {
        console.log(error);
        this.errors = error.errors;
      });
  }

}
