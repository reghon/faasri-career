import { Component, computed, input, output, signal } from '@angular/core';

@Component({
  selector: 'app-password-field',
  standalone: true,
  templateUrl: './password-field.html',
})
export class PasswordField {
  label = input('Password');
  placeholder = input('Masukkan password');
  value = input('');
  showValidation = input(true);
  valueChange = output<string>();
  showPassword = signal(false);
  touched = signal(false);

  hasMinLength = computed(() => this.value().length >= 8);
  hasUppercase = computed(() => /[A-Z]/.test(this.value()));
  hasNumber = computed(() => /[0-9]/.test(this.value()));
  hasSymbol = computed(() => /[^a-zA-Z0-9]/.test(this.value()));

  isValid = computed(
    () => this.hasMinLength() && this.hasUppercase() && this.hasNumber() && this.hasSymbol(),
  );

  showHints = computed(() => this.touched() && this.value().length > 0);

  onInput(value: string) {
    this.touched.set(true);

    this.valueChange.emit(value);
  }
}
