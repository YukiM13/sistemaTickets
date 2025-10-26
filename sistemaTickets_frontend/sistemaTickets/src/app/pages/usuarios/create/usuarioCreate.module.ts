import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from '../usuario-routing.module';
import { UsuarioCreateComponent } from './usuarioCreate.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@NgModule({
	imports: [
		CommonModule,
		UsuarioRoutingModule,
		ButtonModule,
		DialogModule,
		InputTextModule,
		CheckboxModule,
		DropdownModule,
		ToastModule,
		FormsModule,
		SharedModule
	],
	declarations: [UsuarioCreateComponent],
	exports: [UsuarioCreateComponent],
	providers: [MessageService]
	})
export class UsuarioCreateModule { }
