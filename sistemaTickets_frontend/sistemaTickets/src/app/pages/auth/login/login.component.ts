import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule, ButtonModule, ToastModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  returnUrl: string | null = null;

  constructor(private auth: AuthService, private router: Router, private route: ActivatedRoute, private messageService: MessageService) {
    this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
  }

  login() {
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading = false;
        // Basic validation: backend may return an empty list for invalid credentials
        const token = this.auth.getToken();
        const user = this.auth.getUser();
        const isEmptyArray = Array.isArray(res) && res.length === 0;
        const successLike = !!(token || user || (res && (res.ntoken || res.token || res.idToken)));
        if (isEmptyArray || !successLike) {
          // treat as login failure
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Usuario o contraseña inválidos', life: 4000 });
          return;
        }
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Login correcto', life: 2000 });
        const dest = this.returnUrl || '/tickets';
        this.router.navigateByUrl(dest);
      },
      error: (err) => {
        this.loading = false;
        console.error('Login error', err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: err?.error?.message || err?.message || 'Error en login', life: 4000 });
      }
    });
  }
}
