import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
      email: [user.email, [Validators.required, Validators.email]],
      phone: [user.phone, [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: [user.address, Validators.required],
      city: [user.city, Validators.required],
      birthDate: [this.formatDate(user.birthDate), Validators.required],
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
          this.errorMessage = 'Erreur lors de la mise à jour du profil';
          console.error('Erreur:', error);
        }
      });
    }
  }
}
