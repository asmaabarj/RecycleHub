import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-delete-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-[#30323F] rounded-2xl shadow-xl max-w-md w-full p-6 transform transition-all border border-white/10">
        <div class="text-center">
          <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg class="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          
          <h3 class="text-lg font-medium text-white mb-4">{{ title }}</h3>
          <p class="text-sm text-gray-400 mb-6">
            {{ message }}
          </p>
          
          <div class="flex justify-center space-x-3">
            <button (click)="onCancel.emit()" 
                    class="px-4 py-2 text-sm font-medium text-gray-300 bg-[#383B4A] rounded-lg hover:bg-[#444752] 
                           transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
              Annuler
            </button>
            <button (click)="onConfirm.emit()" 
                    class="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 
                           transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DeleteAlertComponent {
  @Input() title: string = 'Supprimer le compte';
  @Input() message: string = 'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible et toutes vos données seront perdues.';
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
} 