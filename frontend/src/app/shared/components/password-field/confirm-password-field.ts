import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-password-field',
  standalone: true,
  templateUrl: './confirm-password-field.html',
})
export class ConfirmPasswordField {
  label = input('Konfirmasi Password');
  placeholder = input('Masukkan ulang password');
  password = input('');
  confirmPassword = input('');
  confirmPasswordChange = output<string>();
  showPassword = signal(false);
  touched = signal(false);

  isMismatch = computed(
    () =>
      this.touched() &&
      this.confirmPassword().length > 0 &&
      this.password() !== this.confirmPassword(),
  );

  isMatch = computed(
    () =>
      this.touched() &&
      this.confirmPassword().length > 0 &&
      this.password() === this.confirmPassword(),
  );

  onInput(value: string) {
    this.touched.set(true);

    this.confirmPasswordChange.emit(value);
  }
}
