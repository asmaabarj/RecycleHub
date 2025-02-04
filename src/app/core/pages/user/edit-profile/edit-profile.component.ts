import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from '../../../models/user.model';
import { updateProfile } from '../../../state/auth/auth.actions';

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

  constructor(
    private fb: FormBuilder,
    private store: Store<{ auth: { user: User | null } }>,
    private router: Router
  ) {
    this.store.select(state => state.auth.user).subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.initForm(user);
      }
    });
  }

  ngOnInit() {
    if (!this.currentUser) {
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
      birthDate: [user.birthDate, Validators.required],
      profileImage: [user.profileImage]
    });
  }

  onSubmit() {
    if (this.editForm.valid && this.currentUser) {
      const updatedUser: User = {
        ...this.currentUser,
        ...this.editForm.value,
        birthDate: new Date(this.editForm.value.birthDate)
      };
      this.store.dispatch(updateProfile({ user: updatedUser }));
      this.router.navigate(['/profile']);
    }
  }
}
