import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioRoutingModule } from '../usuario-routing.module';
import { UsuarioListComponent } from './usuarioList.component';
import { UsuarioCreateModule } from '../create/usuarioCreate.module';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
	imports: [
		CommonModule,
		UsuarioRoutingModule,
		ButtonModule,
		ProgressSpinnerModule,
		TableModule,
		DialogModule,
		UsuarioCreateModule,
		InputTextModule,
		CheckboxModule,
		FormsModule,
		SharedModule
	],
	declarations: [UsuarioListComponent]
})
export class UsuarioModule { }
