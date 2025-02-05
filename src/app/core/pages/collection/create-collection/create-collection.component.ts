import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import * as CollectionActions from '../../../state/collection/collection.actions';

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
    private store: Store,
    private router: Router
  ) {}

  ngOnInit() {
    this.initForm();
  }

  private initForm() {
    this.collectionForm = this.fb.group({
      wasteTypes: this.fb.array([]),
      collectionAddress: ['', [Validators.required]],
      collectionDate: ['', [Validators.required]],
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

  onSubmit() {
    if (this.collectionForm.valid) {
      const formValue = this.collectionForm.value;
      const totalWeight = formValue.wasteTypes.reduce(
        (sum: number, waste: any) => sum + Number(waste.weight), 0
      );

      if (totalWeight < 1000) {
        this.errorMessage = 'Le poids total doit être d\'au moins 1kg (1000g)';
        return;
      }

      if (totalWeight > 10000) {
        this.errorMessage = 'Le poids total ne peut pas dépasser 10kg (10000g)';
        return;
      }

      this.store.dispatch(CollectionActions.addCollection({
        collection: {
          ...formValue,
          totalWeight,
          status: 'en_attente'
        }
      }));

      this.router.navigate(['/collections']);
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
} 