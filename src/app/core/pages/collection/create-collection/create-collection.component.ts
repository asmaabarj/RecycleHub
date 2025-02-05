import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as CollectionActions from '../../../state/collection/collection.actions';
import { take } from 'rxjs/operators';
import { User } from '../../../models/user.model';

interface AppState {
  collection: {
    requests: any[];
  }
}

@Component({
  selector: 'app-create-collection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-collection.component.html'
})
export class CreateCollectionComponent implements OnInit {
  collectionForm!: FormGroup;
  timeSlots: string[] = this.generateTimeSlots();
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router,
    private authStore: Store<{ auth: { user: User | null } }>
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.collectionForm = this.fb.group({
      wasteTypes: this.fb.array([]),
      collectionAddress: ['', [Validators.required]],
      collectionDate: ['', [Validators.required, this.futureDateValidator()]],
      timeSlot: ['', [Validators.required]],
      notes: [''],
      photos: [[]]
    });

    // Ajouter le premier type de déchet par défaut
    this.addWasteType();
  }

  get wasteTypes() {
    return this.collectionForm.get('wasteTypes') as FormArray;
  }

  addWasteType() {
    const wasteType = this.fb.group({
      type: ['', Validators.required],
      weight: ['', [Validators.required, Validators.min(100)]]
    });
    this.wasteTypes.push(wasteType);
  }

  removeWasteType(index: number) {
    this.wasteTypes.removeAt(index);
  }

  private generateTimeSlots(): string[] {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  }

  private validateCollection(formValue: any): string | null {
    // Vérifier le nombre de demandes en attente
    let pendingRequestsCount = 0;
    this.store.select(state => state.collection.requests)
      .pipe(take(1))
      .subscribe(requests => {
        pendingRequestsCount = requests.filter(req => req.status === 'en_attente').length;
      });

    if (pendingRequestsCount >= 3) {
      return 'Vous avez déjà 3 demandes en attente';
    }

    // Vérifier le poids total
    const totalWeight = formValue.wasteTypes.reduce(
      (sum: number, waste: any) => sum + Number(waste.weight), 0
    );

    if (totalWeight < 1000) {
      return 'Le poids total doit être d\'au moins 1kg (1000g)';
    }

    if (totalWeight > 10000) {
      return 'Le poids total ne peut pas dépasser 10kg';
    }

    return null;
  }

  onSubmit() {
    if (this.collectionForm.valid) {
      const error = this.validateCollection(this.collectionForm.value);
      if (error) {
        this.errorMessage = error;
        return;
      }
      const formValue = this.collectionForm.value;
      const totalWeight = formValue.wasteTypes.reduce(
        (sum: number, waste: any) => sum + Number(waste.weight), 0
      );

      // Récupérer l'ID de l'utilisateur connecté
      this.authStore.select(state => state.auth.user).pipe(take(1)).subscribe(user => {
        if (user) {
          this.store.dispatch(CollectionActions.addCollection({
            collection: {
              ...formValue,
              userId: user.id,
              totalWeight,
              status: 'en_attente',
              createdAt: new Date(),
              updatedAt: new Date()
            }
          }));
          this.router.navigate(['/collections']);
        }
      });
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      const photos: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          photos.push(e.target.result);
          if (photos.length === files.length) {
            this.collectionForm.patchValue({ photos });
          }
        };
        reader.readAsDataURL(files[i]);
      }
    }
  }

  private futureDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const selectedDate = new Date(control.value);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      return selectedDate >= today ? null : { pastDate: true };
    };
  }
} 