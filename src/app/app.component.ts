import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from './core/shared/components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex">
      <app-sidebar />
      <div class="flex-1 ml-64">
        <router-outlet />
      </div>
    </div>
  `
})
export class AppComponent {
  title = 'RecycleHub';
}
