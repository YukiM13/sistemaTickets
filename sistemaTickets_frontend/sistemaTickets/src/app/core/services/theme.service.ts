import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private colorTheme: string = '';

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  initTheme() {
    this.getColorTheme();
    this.renderer.addClass(document.body, this.colorTheme);
  }

  update(theme: 'dark' | 'light') {
    this.setColorTheme(theme);
    const previousColorTheme = theme === 'dark' ? 'light' : 'dark';
    this.renderer.removeClass(document.body, previousColorTheme);
    this.renderer.addClass(document.body, theme);
  }

  isDarkMode() {
    return this.colorTheme === 'dark';
  }

  private setColorTheme(theme: string) {
    this.colorTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('user-theme', theme);
  }

  private getColorTheme() {
    if (localStorage.getItem('user-theme')) {
      this.colorTheme = localStorage.getItem('user-theme')!;
    } else {
      this.colorTheme = 'light';
    }
    document.documentElement.setAttribute('data-theme', this.colorTheme);
  }
}
