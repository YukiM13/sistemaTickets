# TicketSy - Sistema de Gestión de Tickets Internos

TicketSy es un sistema web para la gestión de tickets de incidencias internas en empresas. Permite administrar usuarios, roles y tickets de manera organizada, con un **frontend en Angular** y un **backend en .NET Core**.

---

## 📁 Estructura del proyecto Backend

```
sistemaTickets_backend/
├─ sistemaTickets_backend.API/        # Proyecto Web API
│  ├─ Controllers/                   # Controladores (usuarios, roles, tickets, categorías)
│  ├─ Helpers/                       # Clases auxiliares (ApiKey, filtros, validaciones)
│  ├─ ViewModels/                     # Modelos de vista (usuariosViewModel, ticketsViewModel, etc.)
│  ├─ appsettings.json                # Configuración de la API
│  └─ Program.cs                      # Inicialización del backend
├─ sistemaTickets_backend.BusinessLogic/
│  └─ Services/                       # Servicios para cada entidad
├─ sistemaTickets_backend.DataAcces/
│  └─ Repositorys/                    # Repositorios para cada entidad
├─ sistemaTickets_backend.Entities/
│  └─ Entities/                       # Declaración de entidades
```

---

## 🖥️ Tecnologías utilizadas

**Backend**
- .NET Core 8
- C#
- Firebase (DB y Auth)
- Arquitectura Onion

**Frontend**
- Angular 18
- TypeScript
- SCSS
- Vite / Angular CLI
- Plantilla de diseño para temas

---

## 🚀 Instalación

1. Clonar el repositorio:
```bash
git clone <url-del-repositorio>
```

2. Descargar el archivo JSON con credenciales de Firebase.

3. Configurar la variable de entorno `GOOGLE_APPLICATION_CREDENTIALS`:

**Windows**
1. Presiona `Win + R` → escribe `sysdm.cpl` → Enter.
2. Ve a **Opciones avanzadas** → **Variables de entorno**.
3. Crea una nueva variable:
   - Nombre: `GOOGLE_APPLICATION_CREDENTIALS`
   - Valor: `C:\ruta\al\archivo\clave.json`

**Linux / Mac**
```bash
export GOOGLE_APPLICATION_CREDENTIALS="/ruta/al/archivo/clave.json"
```

4. Instalar dependencias backend y frontend:
```bash
# Backend
cd sistemaTickets_backend.API
dotnet restore

# Frontend
cd ../../frontend
npm install
```

5. Levantar la aplicación:
```bash
# Backend
dotnet run --project sistemaTickets_backend.API

# Frontend
npm run dev
```

---

## ⚙️ Uso

- Accede al frontend en `http://localhost:4200` (o puerto configurado).  
- Endpoints principales del backend:
  - `/api/usuarios` → Gestión de usuarios
  - `/api/roles` → Gestión de roles
  - `/api/tickets` → Gestión de tickets
  - `/api/categorias` → Gestión de categorías



---

## 🏗️ Arquitectura

```
Frontend (Angular) <---> Backend API (.NET Core) <---> Firebase (DB & Auth)
      |                       |
      |-- Components           |-- Controllers
      |-- Services             |-- BusinessLogic (Services)
      |-- SCSS/Assets          |-- DataAccess (Repositorys)
                               |-- Entities
```

- **Frontend:** Maneja la interfaz de usuario y consume la API.
- **Backend:** Lógica de negocio, controladores y acceso a datos.
- **Firebase:** Base de datos y autenticación de usuarios.

---



## 📝 Licencia

Este proyecto está bajo la licencia MIT.
