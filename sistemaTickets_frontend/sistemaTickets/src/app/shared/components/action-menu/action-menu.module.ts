import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionMenuComponent } from './action-menu.component';

// PrimeNG modules
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
  declarations: [
    ActionMenuComponent
  ],
  imports: [
    CommonModule,
    MenuModule,
    ButtonModule,
    TooltipModule
  ],
  exports: [
    ActionMenuComponent
  ]
})
export class ActionMenuModule { }