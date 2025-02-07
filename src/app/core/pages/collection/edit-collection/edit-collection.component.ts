import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CollectionRequest } from '../../../models/collection-request.model';
import * as CollectionActions from '../../../state/collection/collection.actions';
import { take } from 'rxjs/operators';
import { CollectionState } from '../../../state/collection/collection.reducer';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-edit-collection',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './edit-collection.component.html'
})
export class EditCollectionComponent implements OnInit {
  collectionForm!: FormGroup;
  collection!: CollectionRequest;
  timeSlots: string[] = this.generateTimeSlots();
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<{
      collection: CollectionState,
      auth: { user: User | null }
    }>
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.store.select(state => state.collection.requests)
      .pipe(take(1))
      .subscribe(collections => {
        const collection = collections.find(c => c.id === id);
        if (!collection || collection.status !== 'en_attente') {
          this.router.navigate(['/collections']);
          return;
        }
        this.collection = collection;
        this.initForm();
      });
  }

  private initForm() {
    this.collectionForm = this.fb.group({
      wasteTypes: this.fb.array([], [Validators.required]),
      city: [this.collection.city, [Validators.required]],
      collectionDate: [
        this.formatDate(this.collection.collectionDate), 
        [Validators.required, this.futureDateValidator()]
      ],
      timeSlot: [this.collection.timeSlot, [Validators.required]],
      notes: [this.collection.notes || ''],
      photos: [this.collection.photos || []]
    });

    this.collection.wasteTypes.forEach(waste => {
      this.addWasteType(waste);
    });
  }

  private formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0];
  }

  get wasteTypes() {
    return this.collectionForm.get('wasteTypes') as FormArray;
  }

  addWasteType(waste?: { type: string; weight: number }) {
    const wasteType = this.fb.group({
      type: [waste?.type || '', [Validators.required]],
      weight: [waste?.weight || '', [Validators.required, Validators.min(100)]]
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

  onSubmit() {
    if (this.collectionForm.valid) {
      const formValue = this.collectionForm.value;
      const totalWeight = formValue.wasteTypes.reduce(
        (sum: number, waste: any) => sum + Number(waste.weight), 0
      );

      if (totalWeight < 1000 || totalWeight > 10000) {
        this.errorMessage = 'Le poids total doit être entre 1kg et 10kg';
        return;
      }

      this.store.dispatch(CollectionActions.updateCollection({
        id: this.collection.id,
        updates: {
          ...formValue,
          totalWeight,
          updatedAt: new Date()
        }
      }));

      this.router.navigate(['/collections']);
    }
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    if (files) {
      const photos: string[] = [...(this.collectionForm.get('photos')?.value || [])];
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

  removePhoto(index: number) {
    const photos = [...(this.collectionForm.get('photos')?.value || [])];
    photos.splice(index, 1);
    this.collectionForm.patchValue({ photos });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.collectionForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getWasteTypeControl(index: number, controlName: string) {
    return this.wasteTypes.at(index).get(controlName);
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