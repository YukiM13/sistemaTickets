import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioListComponent } from './list/usuarioList.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: UsuarioListComponent }
	])],
	exports: [RouterModule]
})
export class UsuarioRoutingModule { }
