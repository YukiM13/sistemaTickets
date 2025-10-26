import { Component, OnInit } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button class="theme-toggle" (click)="toggleTheme()" [title]="isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'">
      <span class="material-icons">{{ isDark ? 'light_mode' : 'dark_mode' }}</span>
    </button>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class ThemeToggleComponent implements OnInit {
  isDark = false;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.isDark = this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.isDark = !this.isDark;
    this.themeService.update(this.isDark ? 'dark' : 'light');
  }
}
