import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-modal',
  standalone: true,
  template: `
    <div class="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
         (click)="close.emit()">
      <!-- Bouton fermer -->
      <button class="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
              (click)="close.emit()">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      
      <!-- Container de l'image -->
      <div class="relative max-w-7xl w-full mx-auto" (click)="$event.stopPropagation()">
        <img [src]="photoUrl" 
             alt="Photo en grand" 
             class="max-w-full max-h-[85vh] object-contain mx-auto 
                    rounded-lg shadow-2xl ring-1 ring-white/10">
      </div>
    </div>
  `
})
export class PhotoModalComponent {
  @Input() photoUrl!: string;
  @Output() close = new EventEmitter<void>();
} 