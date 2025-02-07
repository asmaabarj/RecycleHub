import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-collection-photos',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="photos?.length" class="mt-8 pt-8 border-t border-white/5">
      <div class="flex items-center gap-3 mb-6">
        <div class="p-2 rounded-full bg-[#559638]/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-[#559638]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h4 class="text-white/90 text-lg font-medium">Photos de la collecte</h4>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div *ngFor="let photo of photos" 
             class="relative rounded-2xl overflow-hidden bg-black/30 aspect-square 
                    ring-1 ring-white/10 hover:ring-[#559638]/40 
                    transition-all duration-500">
          <div class="relative w-full h-full group/image">
            <img [src]="photo" 
                 alt="Photo de la collecte" 
                 class="w-full h-full object-cover 
                        group-hover/image:scale-110 group-hover/image:opacity-90 
                        transition-all duration-700">
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent 
                        opacity-0 group-hover/image:opacity-100 transition-all duration-500">
              <div class="absolute bottom-4 inset-x-4">
                <button class="w-full px-4 py-3 text-sm font-medium text-white 
                             bg-white/15 backdrop-blur-md rounded-xl 
                             hover:bg-white/25 transition-all duration-300 
                             flex items-center justify-center gap-2 
                             shadow-lg shadow-black/30"
                        (click)="onPhotoClick(photo)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Agrandir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CollectionPhotosComponent {
  @Input() photos: string[] | undefined = [];
  @Output() photoClick = new EventEmitter<string>();

  onPhotoClick(photoUrl: string) {
    this.photoClick.emit(photoUrl);
  }
} 