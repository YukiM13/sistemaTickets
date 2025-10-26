import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionMenuModule } from './components/action-menu/action-menu.module';
import { ActionMenuConfigService } from '../services/action-menu-config.service';

@NgModule({
  imports: [
    CommonModule,
    ActionMenuModule
  ],
  exports: [
    ActionMenuModule
  ],
  providers: [
    ActionMenuConfigService
  ]
})
export class SharedModule { }