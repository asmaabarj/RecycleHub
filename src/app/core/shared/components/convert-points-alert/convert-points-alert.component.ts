import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-convert-points-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-[#30323F] rounded-2xl max-w-md w-full p-6 shadow-xl border border-white/10">
        <div class="text-center mb-6">
          <div class="w-16 h-16 bg-[#559638]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg class="w-8 h-8 text-[#559638]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-white mb-2">Convertir vos points</h3>
          <p class="text-gray-400">Félicitations ! Vous pouvez convertir vos points en bon d'achat.</p>
        </div>

        <div class="bg-[#383B4A]/50 rounded-xl p-4 mb-6 text-center">
          <p class="text-sm text-gray-400 mb-2">Valeur du bon d'achat</p>
          <div class="text-3xl font-bold text-[#559638]">{{ amount }} Dh</div>
        </div>

        <div class="text-sm text-gray-400 mb-6">
          <p class="mb-2">Barème de conversion :</p>
          <ul class="space-y-1">
            <li>• 100-199 points = 50 Dh</li>
            <li>• 200-499 points = 120 Dh</li>
            <li>• 500+ points = 350 Dh</li>
          </ul>
        </div>

        <div class="flex gap-3">
          <button (click)="onConfirm.emit()" 
                  class="flex-1 px-4 py-2.5 rounded-xl text-white bg-gradient-to-r from-[#559638] to-[#447A2D] 
                         hover:from-[#447A2D] hover:to-[#3A672B] transition-all duration-300">
            Confirmer la conversion
          </button>
          <button (click)="onCancel.emit()"
                  class="px-4 py-2.5 rounded-xl text-gray-400 bg-white/5 hover:bg-white/10 
                         transition-all duration-300">
            Annuler
          </button>
        </div>
      </div>
    </div>
  `
})
export class ConvertPointsAlertComponent {
  @Input() amount: number = 0;
  @Output() onConfirm = new EventEmitter<void>();
  @Output() onCancel = new EventEmitter<void>();
} 