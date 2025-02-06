import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
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

  pastDateValidator(): ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const inputDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0); 

      if (inputDate >= today) {
        return { futureDateNotAllowed: true };
      }

      const minAge = 13;
      const minAgeDate = new Date();
      minAgeDate.setFullYear(minAgeDate.getFullYear() - minAge);
      
      if (inputDate > minAgeDate) {
        return { minimumAge: true };
      }

      return null;
    };
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      address: ['', Validators.required],
      city: ['', Validators.required],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      birthDate: ['', [Validators.required, this.pastDateValidator()]],
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
    } else {
      this.errorMessage = 'Veuillez remplir correctement tous les champs requis';
    }
  }
}