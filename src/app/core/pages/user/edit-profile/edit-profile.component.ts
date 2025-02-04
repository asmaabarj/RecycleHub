import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../../models/user.model';
import { AuthService } from '../../../services/auth.service';

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

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // Récupérer l'utilisateur depuis le localStorage
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

  onSubmit() {
    if (this.editForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.editForm.value,
        birthDate: new Date(this.editForm.value.birthDate)
      };

      this.authService.updateUserProfile(this.currentUser.id, updatedUser).subscribe({
        next: (user) => {
          // Mettre à jour le localStorage avec les nouvelles informations
          localStorage.setItem('currentUser', JSON.stringify(user));
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
