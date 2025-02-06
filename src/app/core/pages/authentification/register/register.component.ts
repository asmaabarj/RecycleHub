import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage: string = '';
  selectedImage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthDate: ['', Validators.required],
      profileImage: ['']
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
        this.registerForm.patchValue({
          profileImage: this.selectedImage
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;
      const userData = {
        ...formValue,
        birthDate: new Date(formValue.birthDate),
        profileImage: this.selectedImage,
        userType: 'particular' as const
      };

      const isRegistered = this.storageService.saveUser(userData);
      
      if (isRegistered) {
        this.router.navigate(['/login']);
      } else {
        this.errorMessage = 'Un utilisateur avec cet email existe déjà';
      }
    }
  }
}