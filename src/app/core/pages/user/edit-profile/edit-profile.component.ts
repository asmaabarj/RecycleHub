import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import * as AuthActions from '../../../state/auth/auth.actions';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.css'
})
export class EditProfileComponent implements OnInit {
  editForm!: FormGroup;
  currentUser: User | null = null;
  errorMessage: string = '';
  selectedImage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router,
    private authService: AuthService
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

  emailExistsValidator(currentEmail: string) {
    return (control: AbstractControl): Promise<ValidationErrors | null> => {
      return new Promise(resolve => {
        if (control.value === currentEmail) {
          resolve(null);
          return;
        }

        this.authService.checkEmailExists(control.value).subscribe({
          next: (exists) => {
            if (exists) {
              resolve({ emailExists: true });
            } else {
              resolve(null);
            }
          },
          error: () => {
            resolve(null);
          }
        });
      });
    };
  }

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser = user;
      this.initForm(user);
    } else {
      this.router.navigate(['/login']);
    }
  }

  private initForm(user: User) {
    this.editForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [
        user.email, 
        {
          validators: [Validators.required, Validators.email],
          asyncValidators: [this.emailExistsValidator(user.email)],
        }
      ],
      phone: [user.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: [user.address, Validators.required],
      city: [user.city, Validators.required],
      birthDate: [this.formatDate(user.birthDate), [Validators.required, this.pastDateValidator()]],
      profileImage: [user.profileImage]
    });
  }

  private formatDate(date: Date | string): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        this.selectedImage = e.target?.result as string;
        this.editForm.patchValue({
          profileImage: this.selectedImage
        });
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.editForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.editForm.value,
        birthDate: new Date(this.editForm.value.birthDate),
        profileImage: this.selectedImage || this.currentUser.profileImage
      };

      this.authService.updateUserProfile(this.currentUser.id, updatedUser).subscribe({
        next: (user) => {
          this.store.dispatch(AuthActions.updateProfile({ user }));
          this.errorMessage = '';
          this.router.navigate(['/profile']);
        },
        error: (error) => {
          if (error.status === 409) {
            this.errorMessage = 'Cette adresse email est déjà utilisée';
          } else {
            this.errorMessage = 'Erreur lors de la mise à jour du profil';
          }
          console.error('Erreur:', error);
        }
      });
    }
  }
}
