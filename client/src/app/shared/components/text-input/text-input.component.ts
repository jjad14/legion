import { Component, OnInit, ViewChild, ElementRef, Input, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', {static: true}) input: ElementRef;
  @Input() type = 'text';
  @Input() label: string;

  // @Self()  is for angular dependency injection and angular is going to look for where to locate what it's going to inject into itself
  // And if we already have a service activated somewhere and our application its going to walk up the tree
  // of the Dependency hierarchy looking for something that matches what we're injecting here
  // But if we used the @Self decorator here it's only going to use this inside itself and not look for any
  // other shared dependency that's already in use
  // So this guarantees that we're working with the the very specific control that we're injecting in here
  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
   }

  ngOnInit() {
    const control = this.controlDir.control;
    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator ? [control.asyncValidator] : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();
  }

  onChange(event) { }

  onTouched() { }

  // we need to get the value of our inputs and write it into here
  // this gives our control value accessor access to the values that are input into our input field
  writeValue(obj: any): void {
    this.input.nativeElement.value = obj || '';
  }

  // used by formControl to register a callback that is expected to be triggered every time the native form control is updated
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // used to indicate that a user interacted with a control.
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

}
