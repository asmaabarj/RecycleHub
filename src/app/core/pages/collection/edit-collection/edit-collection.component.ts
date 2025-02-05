import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CollectionRequest } from '../../../models/collection-request.model';
import * as CollectionActions from '../../../state/collection/collection.actions';

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
    private store: Store
  ) {}

  ngOnInit() {
    this.route.data.subscribe(({ collection }) => {
      if (!collection) {
        this.router.navigate(['/collections']);
        return;
      }
      this.collection = collection;
      this.initForm();
    });
  }

  private initForm() {
    this.collectionForm = this.fb.group({
      wasteTypes: this.fb.array([]),
      collectionAddress: [this.collection.collectionAddress, [Validators.required]],
      collectionDate: [this.formatDate(this.collection.collectionDate), [Validators.required]],
      timeSlot: [this.collection.timeSlot, [Validators.required]],
      notes: [this.collection.notes || ''],
      photos: [this.collection.photos || []]
    });

    // Initialiser les types de déchets existants
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
      type: [waste?.type || '', Validators.required],
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

      if (totalWeight < 1000) {
        this.errorMessage = 'Le poids total doit être d\'au moins 1kg (1000g)';
        return;
      }

      if (totalWeight > 10000) {
        this.errorMessage = 'Le poids total ne peut pas dépasser 10kg (10000g)';
        return;
      }

      this.store.dispatch(CollectionActions.updateCollection({
        id: this.collection.id,
        collection: {
          ...this.collection,
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
} 