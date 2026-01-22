# SIFO - Sistema de Facturación Online

Sistema web de facturación desarrollado con Angular que permite crear, gestionar y generar facturas en formato PDF. Este documento explica en detalle cómo funciona el sistema desde el punto de vista técnico y funcional.

> **Última actualización**: Enero 2024

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación](#instalación)
3. [Despliegue a GitHub Pages](#despliegue-a-github-pages)
4. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Flujo de Autenticación](#flujo-de-autenticación)
5. [Componentes del Sistema](#componentes-del-sistema)
6. [Servicios y Lógica de Negocio](#servicios-y-lógica-de-negocio)
7. [Protección de Rutas (Guards)](#protección-de-rutas-guards)
8. [Persistencia de Datos](#persistencia-de-datos)
9. [Generación de PDF](#generación-de-pdf)
10. [Flujos de Usuario](#flujos-de-usuario)
11. [Estructura de Datos](#estructura-de-datos)

---

## Requisitos Previos

- **Node.js** (versión 18 o superior)
- **npm** (versión 9 o superior)
- **Angular CLI** (se instalará automáticamente como dependencia)

---

## Instalación

### Paso 1: Instalar Dependencias

```bash
npm install
```

Este comando instala todas las dependencias necesarias:
- Angular 17 y sus módulos core
- jsPDF para generación de PDFs
- RxJS para programación reactiva
- TypeScript y herramientas de compilación

### Paso 2: Iniciar Servidor de Desarrollo

```bash
npm start
```

Esto inicia el servidor de desarrollo de Angular en `http://localhost:4200`. El servidor recarga automáticamente cuando detecta cambios en el código.

### Paso 3: Acceder a la Aplicación

Abre tu navegador en `http://localhost:4200`

---

## Despliegue a GitHub Pages

### Guía Rápida

Para subir el proyecto a GitHub y publicarlo en GitHub Pages, consulta:

- **📄 [QUICK_START_GITHUB.md](QUICK_START_GITHUB.md)** - Guía rápida paso a paso
- **📚 [DEPLOY.md](DEPLOY.md)** - Guía completa y detallada

### Resumen

1. **Crear repositorio en GitHub** (público para Pages gratuito)
2. **Conectar proyecto local** con `git remote add origin`
3. **Subir código** con `git push`
4. **Activar GitHub Pages** en Settings → Pages → GitHub Actions
5. **Acceder** a `https://tu-usuario.github.io/SIFO_SistemaDeFacturacionOnline/`

### Características del Despliegue

- ✅ **Despliegue automático** con GitHub Actions
- ✅ **Actualización automática** al hacer push
- ✅ **Sin configuración manual** de servidor
- ✅ **Gratuito** para repositorios públicos

**Nota**: El proyecto incluye un workflow de GitHub Actions (`.github/workflows/deploy.yml`) que se ejecuta automáticamente al hacer push a la rama `main` o `master`.

---

## Arquitectura del Sistema

### Estructura General

El sistema sigue la arquitectura de Angular basada en componentes y servicios:

```
src/
├── app/
│   ├── components/          # Componentes de UI (vistas)
│   ├── services/            # Lógica de negocio y comunicación
│   ├── guards/              # Protección de rutas
│   ├── app.module.ts        # Módulo principal
│   └── app-routing.module.ts # Configuración de rutas
├── data/                    # Archivos JSON de datos
└── styles.scss              # Estilos globales
```

### Principios de Diseño

1. **Separación de Responsabilidades**: Cada componente maneja solo su vista, la lógica está en servicios
2. **Inyección de Dependencias**: Angular gestiona automáticamente las dependencias
3. **Programación Reactiva**: Uso de RxJS Observables para manejo asíncrono
4. **Type Safety**: TypeScript garantiza tipos seguros en tiempo de compilación

---

## Flujo de Autenticación

### Proceso Técnico Detallado

#### 1. Usuario Accede al Login

**Componente**: `LoginComponent`  
**Ruta**: `/login`

Cuando el usuario accede a la aplicación, Angular redirige automáticamente a `/login` si no está autenticado (gracias al `AuthGuard`).

#### 2. Usuario Ingresa Credenciales

El formulario de login (`login.component.html`) captura:
- `username`: Nombre de usuario
- `password`: Contraseña

#### 3. Validación de Credenciales

**Servicio**: `AuthService.login()`

```typescript
login(username: string, password: string): Observable<boolean>
```

**Proceso interno**:

1. El servicio hace una petición HTTP GET a `data/users.json`
2. Busca en el array de usuarios uno que coincida con:
   - `username` exacto
   - `password` exacto
3. Si encuentra coincidencia:
   - Guarda el usuario en `currentUser`
   - Persiste la sesión en `localStorage` con clave `'currentUser'`
   - Retorna `Observable<true>`
4. Si no encuentra:
   - Retorna `Observable<false>`

#### 4. Manejo de Respuesta

**En el componente** (`login.component.ts`):

```typescript
this.authService.login(this.username, this.password).subscribe(
  (success) => {
    if (success) {
      this.router.navigate(['/dashboard']); // Redirige al dashboard
    } else {
      this.error = 'Usuario o contraseña incorrectos'; // Muestra error
    }
  }
);
```

#### 5. Persistencia de Sesión

El usuario autenticado se guarda en `localStorage`:

```javascript
{
  "username": "admin",
  "password": "Aa123456789",
  "role": "admin",
  "name": "Administrador"
}
```

**Ventajas**:
- La sesión persiste al recargar la página
- No requiere autenticación constante
- Acceso rápido a información del usuario

**Nota de Seguridad**: En producción, las contraseñas nunca deberían almacenarse en localStorage sin encriptar.

---

## Componentes del Sistema

### 1. LoginComponent

**Ruta**: `/login`  
**Propósito**: Autenticación de usuarios

**Funcionalidad**:
- Renderiza formulario de login
- Valida que los campos no estén vacíos
- Llama a `AuthService.login()`
- Maneja errores de autenticación
- Redirige al dashboard si la autenticación es exitosa

**Técnicamente**:
- Usa `FormsModule` para two-way data binding con `[(ngModel)]`
- Implementa `OnInit` para verificar si ya está autenticado al cargar
- Usa `Router` para navegación programática

### 2. DashboardComponent

**Ruta**: `/dashboard`  
**Protección**: `AuthGuard` (requiere autenticación)

**Propósito**: Panel principal con menú de opciones

**Funcionalidad**:
- Muestra información del usuario actual
- Proporciona acceso a "Nueva Factura"
- Muestra opción de "Gestión de Usuarios" solo si el usuario es admin
- Botón de cerrar sesión

**Técnicamente**:
- Obtiene usuario actual con `AuthService.getCurrentUser()`
- Verifica rol con `AuthService.isAdmin()`
- Usa `*ngIf` para mostrar/ocultar elementos según permisos

### 3. NewInvoiceComponent

**Ruta**: `/new-invoice`  
**Protección**: `AuthGuard` (requiere autenticación)

**Propósito**: Crear nuevas facturas

**Funcionalidad Completa**:

#### 3.1. Información de Factura
- **Número de Factura**: Generado automáticamente con formato `YYYYMMDD####`
- **Fecha**: Campo de fecha con valor por defecto (hoy)

#### 3.2. Información del Cliente
- Nombre del cliente (requerido)
- Contacto (teléfono)
- Dirección
- Email (requerido)

#### 3.3. Items de Factura
- **Agregar Items**: Formulario dinámico que permite agregar múltiples productos/servicios
  - Descripción
  - Cantidad
  - Precio unitario
  - Total (calculado automáticamente: cantidad × precio unitario)
- **Tabla de Items**: Muestra todos los items agregados con opción de eliminar
- **Cálculo Automático**: Los subtotales y totales se recalculan automáticamente al agregar/eliminar items

#### 3.4. Información Adicional
- Tiempo de entrega
- Validez de la oferta
- Condiciones de pago
- Notas

#### 3.5. Acciones
- **Generar PDF**: Crea un PDF con el formato exacto del modelo
- **Guardar Factura**: Persiste la factura en JSON

**Técnicamente**:
- Usa `ReactiveFormsModule` para formularios complejos
- Implementa validaciones en tiempo real
- Usa `InvoiceService` para persistencia
- Usa `PdfService` para generación de documentos

### 4. UserManagementComponent

**Ruta**: `/users`  
**Protección**: `AuthGuard` + `AdminGuard` (solo administradores)

**Propósito**: Gestión completa de usuarios del sistema

**Funcionalidad**:

#### 4.1. Crear Usuario
- Formulario para agregar nuevos usuarios
- Campos: username, nombre completo, contraseña, rol
- Validación de que el username no exista

#### 4.2. Listar Usuarios
- Tabla con todos los usuarios
- Muestra: username, nombre, rol
- Badges visuales para diferenciar roles

#### 4.3. Editar Usuario
- Modo de edición inline en la tabla
- Permite modificar: nombre, rol, contraseña
- Botones de guardar/cancelar

#### 4.4. Eliminar Usuario
- Botón de eliminar (deshabilitado para admin)
- Confirmación antes de eliminar
- No permite eliminar usuarios con rol 'admin'

**Técnicamente**:
- Usa `UserService` para todas las operaciones CRUD
- Implementa edición inline con `*ngIf` condicionales
- Usa operador de aserción no nula `!` para TypeScript strict mode

---

## Servicios y Lógica de Negocio

### 1. AuthService

**Ubicación**: `src/app/services/auth.service.ts`  
**Propósito**: Manejo completo de autenticación

**Métodos Principales**:

#### `login(username: string, password: string): Observable<boolean>`
- Lee `data/users.json` mediante HTTP
- Busca usuario con credenciales coincidentes
- Guarda sesión en localStorage
- Retorna Observable con resultado

#### `logout(): void`
- Limpia `currentUser`
- Elimina datos de localStorage
- No requiere HTTP (operación local)

#### `isAuthenticated(): boolean`
- Verifica si existe `currentUser`
- Retorna `true` si hay sesión activa

#### `getCurrentUser(): User | null`
- Retorna objeto usuario completo
- Incluye: username, password, role, name

#### `isAdmin(): boolean`
- Verifica si el usuario actual tiene rol 'admin'
- Usado para control de acceso a funcionalidades

**Flujo de Datos**:
```
LoginComponent → AuthService.login() → HTTP GET users.json → 
Validación → localStorage → Observable<boolean>
```

### 2. InvoiceService

**Ubicación**: `src/app/services/invoice.service.ts`  
**Propósito**: Gestión de facturas

**Métodos Principales**:

#### `createInvoice(invoice): Observable<Invoice>`
- Genera ID único (timestamp + random)
- Agrega timestamp de creación
- Agrega factura al array local
- Guarda en localStorage como respaldo
- Retorna Observable con factura creada

**Nota**: En producción, esto debería hacer POST a un backend real.

#### `getInvoices(): Observable<Invoice[]>`
- Retorna array de todas las facturas
- Lee desde localStorage si está disponible

#### `getInvoiceById(id: string): Observable<Invoice | undefined>`
- Busca factura por ID
- Retorna Observable con factura o undefined

**Estructura de Invoice**:
```typescript
interface Invoice {
  id: string;                    // ID único generado
  invoiceNumber: string;          // Número visible de factura
  date: string;                   // Fecha en formato ISO
  supplierName: string;          // Nombre del cliente
  supplierContact: string;        // Contacto del cliente
  supplierAddress: string;        // Dirección del cliente
  supplierEmail: string;          // Email del cliente
  items: InvoiceItem[];          // Array de items
  subtotal: number;              // Subtotal calculado
  total: number;                 // Total calculado
  deliveryTime: string;          // Tiempo de entrega
  offerValidity: string;         // Validez de oferta
  payConditions: string;         // Condiciones de pago
  notes: string;                 // Notas adicionales
  createdAt: string;             // Timestamp de creación
}
```

### 3. UserService

**Ubicación**: `src/app/services/user.service.ts`  
**Propósito**: Gestión de usuarios (solo para admin)

**Métodos Principales**:

#### `getUsers(): Observable<User[]>`
- Lee `data/users.json`
- Retorna Observable con array de usuarios
- Si falla HTTP, intenta leer desde localStorage

#### `createUser(user: User): Observable<boolean>`
- Valida que el username no exista
- Agrega usuario al array local
- Guarda en localStorage
- Retorna `true` si éxito, `false` si username duplicado

#### `updateUser(username: string, userData: Partial<User>): Observable<boolean>`
- Busca usuario por username
- Actualiza campos proporcionados
- Guarda cambios en localStorage
- Retorna `true` si éxito

#### `deleteUser(username: string): Observable<boolean>`
- Busca usuario por username
- Valida que no sea admin (no se puede eliminar)
- Elimina del array local
- Guarda cambios en localStorage
- Retorna `true` si éxito

**Protección**: Este servicio solo debería ser accesible desde componentes protegidos por `AdminGuard`.

### 4. PdfService

**Ubicación**: `src/app/services/pdf.service.ts`  
**Propósito**: Generación de PDFs idénticos al modelo

**Método Principal**:

#### `generateInvoice(invoice: Invoice): void`

**Proceso Técnico Detallado**:

1. **Inicialización del Documento**
   ```typescript
   const doc = new jsPDF();
   ```
   - Crea nuevo documento PDF
   - Tamaño estándar A4 (210mm × 297mm)

2. **Configuración de Estilos**
   - Fuente: 'helvetica' (estándar de jsPDF)
   - Colores: RGB personalizados para encabezados
   - Tamaños de fuente variables según sección

3. **Encabezado de Factura**
   - **Izquierda**: Información del proveedor (hardcodeada)
     - Nombre: "Daniel Chircovich"
     - RUC: "10155822932"
     - Dirección: "October 18 urbanization, house E 35. Huacho - Lima"
   - **Derecha**: Fecha y número de factura
     - Formato de fecha: DD/MM/YYYY
     - Número de factura del objeto invoice

4. **Información del Cliente**
   - Etiquetas en negrita, valores en normal
   - Campos: Supplier name, Contact, Address, Email
   - Posicionamiento con coordenadas X, Y

5. **Tabla de Items**
   - **Encabezado**: Fondo azul (#1a365d), texto blanco
   - Columnas: #, ITEM & DESCRIPTION, QTY, UNIT PRICE, TOTAL PRICE
   - **Filas**: Iteración sobre `invoice.items`
     - Soporte para descripciones multilínea
     - Formato numérico con 2 decimales
     - Ajuste automático de altura de fila

6. **Totales**
   - Subtotal: Suma de todos los items
   - Total: Igual al subtotal (sin impuestos por ahora)
   - Formato: Etiqueta alineada a la derecha, valor alineado a la derecha

7. **Información Adicional**
   - Delivery time, Offer Validity, Pay conditions, Notes
   - Soporte para texto multilínea en Notes

8. **Pie de Página**
   - Email: centritechs@gmail.com
   - Contactos telefónicos
   - Tamaño de fuente reducido, color gris

9. **Guardado**
   ```typescript
   doc.save(`Factura_${invoice.invoiceNumber}.pdf`);
   ```
   - Descarga automática del PDF
   - Nombre de archivo: `Factura_[número].pdf`

**Características Técnicas**:
- Manejo de paginación automática si hay muchos items
- Cálculo preciso de posiciones Y para evitar solapamientos
- Formato de números con `toFixed(2)`
- Manejo de texto largo con `splitTextToSize()`

---

## Protección de Rutas (Guards)

### AuthGuard

**Ubicación**: `src/app/guards/auth.guard.ts`  
**Propósito**: Proteger rutas que requieren autenticación

**Funcionamiento**:

```typescript
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;  // Permite acceso
  } else {
    this.router.navigate(['/login']);  // Redirige al login
    return false;  // Bloquea acceso
  }
}
```

**Rutas Protegidas**:
- `/dashboard` - Requiere autenticación
- `/new-invoice` - Requiere autenticación
- `/users` - Requiere autenticación + ser admin

**Flujo**:
1. Usuario intenta acceder a ruta protegida
2. Angular ejecuta `AuthGuard.canActivate()`
3. Guard verifica autenticación
4. Si autenticado: permite acceso
5. Si no autenticado: redirige a `/login`

### AdminGuard

**Ubicación**: `src/app/guards/admin.guard.ts`  
**Propósito**: Proteger rutas que requieren rol de administrador

**Funcionamiento**:

```typescript
canActivate(): boolean {
  if (this.authService.isAdmin()) {
    return true;  // Permite acceso
  } else {
    this.router.navigate(['/dashboard']);  // Redirige al dashboard
    return false;  // Bloquea acceso
  }
}
```

**Rutas Protegidas**:
- `/users` - Requiere rol 'admin'

**Flujo**:
1. Usuario autenticado intenta acceder a `/users`
2. `AuthGuard` permite (está autenticado)
3. `AdminGuard` verifica rol
4. Si es admin: permite acceso
5. Si no es admin: redirige a `/dashboard`

**Nota**: Los guards se ejecutan en orden. Si `AuthGuard` falla, `AdminGuard` no se ejecuta.

---

## Persistencia de Datos

### Estrategia Actual

El sistema usa una estrategia híbrida:

1. **Archivos JSON Estáticos** (`src/data/`)
   - `users.json`: Usuarios del sistema
   - `invoices.json`: Facturas creadas (inicialmente vacío)

2. **localStorage del Navegador**
   - Sesión de usuario (`currentUser`)
   - Facturas creadas (respaldo)
   - Usuarios modificados (respaldo)

### Flujo de Lectura

**Usuarios**:
```
UserService.getUsers() → HTTP GET data/users.json → 
Si falla → localStorage.getItem('users') → 
Retorna Observable<User[]>
```

**Facturas**:
```
InvoiceService.getInvoices() → 
localStorage.getItem('invoices') → 
Retorna Observable<Invoice[]>
```

### Flujo de Escritura

**Crear Factura**:
```
NewInvoiceComponent → InvoiceService.createInvoice() → 
Agrega a array local → localStorage.setItem('invoices') → 
Retorna Observable<Invoice>
```

**Crear/Editar Usuario**:
```
UserManagementComponent → UserService.createUser/updateUser() → 
Modifica array local → localStorage.setItem('users') → 
Retorna Observable<boolean>
```

### Limitaciones Actuales

⚠️ **Importante**: Esta implementación es para desarrollo. En producción:

1. **No hay sincronización entre navegadores**: Cada usuario ve solo sus datos locales
2. **No hay persistencia real**: Los datos en `src/data/` no se actualizan desde la app
3. **Seguridad**: Las contraseñas están en texto plano
4. **Escalabilidad**: localStorage tiene límite de ~5-10MB

**Recomendación para Producción**:
- Implementar backend con API REST
- Usar base de datos (PostgreSQL, MongoDB, etc.)
- Implementar autenticación con JWT tokens
- Encriptar contraseñas con bcrypt
- Usar HTTPS para todas las comunicaciones

---

## Generación de PDF

### Proceso Completo

#### 1. Usuario Completa Formulario

El usuario llena todos los campos de la factura en `NewInvoiceComponent`.

#### 2. Validación

Antes de generar PDF, se valida:
- Número y fecha de factura presentes
- Nombre y email del cliente presentes
- Al menos un item agregado

#### 3. Llamada al Servicio

```typescript
this.pdfService.generateInvoice(this.invoice);
```

#### 4. Generación del PDF

El `PdfService`:
1. Crea instancia de jsPDF
2. Configura estilos y fuentes
3. Dibuja cada sección del PDF
4. Calcula posiciones para evitar solapamientos
5. Maneja paginación si es necesario

#### 5. Descarga Automática

El PDF se descarga automáticamente con nombre:
```
Factura_[número_de_factura].pdf
```

### Formato del PDF

El PDF generado replica exactamente el modelo proporcionado:

- **Encabezado**: Información del proveedor (fija) + fecha/número (dinámico)
- **Cliente**: 4 campos con etiquetas en negrita
- **Tabla**: 5 columnas con encabezado azul
- **Totales**: Subtotal y Total alineados a la derecha
- **Información adicional**: 4 campos opcionales
- **Pie**: Información de contacto

### Personalización

Para modificar el formato del PDF, edita `src/app/services/pdf.service.ts`:

- **Colores**: Modifica valores RGB en `setFillColor()` y `setTextColor()`
- **Fuentes**: Cambia 'helvetica' por otras fuentes soportadas
- **Tamaños**: Ajusta valores en `setFontSize()`
- **Posiciones**: Modifica valores de `margin` y `yPosition`

---

## Flujos de Usuario

### Flujo 1: Login y Acceso al Sistema

```
1. Usuario accede a http://localhost:4200
   ↓
2. Angular redirige a /login (AuthGuard detecta no autenticado)
   ↓
3. Usuario ingresa credenciales
   ↓
4. LoginComponent llama AuthService.login()
   ↓
5. AuthService valida contra users.json
   ↓
6a. Si válido: Guarda en localStorage → Redirige a /dashboard
6b. Si inválido: Muestra mensaje de error
```

### Flujo 2: Crear Nueva Factura

```
1. Usuario autenticado accede a /dashboard
   ↓
2. Click en "Nueva Factura"
   ↓
3. Angular navega a /new-invoice
   ↓
4. NewInvoiceComponent se carga:
   - Genera número de factura automáticamente
   - Establece fecha por defecto (hoy)
   ↓
5. Usuario completa formulario:
   - Información de factura
   - Datos del cliente
   - Agrega items (múltiples)
   - Información adicional
   ↓
6a. Click "Generar PDF":
    - PdfService genera PDF
    - Descarga automática
6b. Click "Guardar Factura":
    - InvoiceService.createInvoice()
    - Guarda en localStorage
    - Muestra mensaje de éxito
    - Redirige a /dashboard después de 2 segundos
```

### Flujo 3: Gestión de Usuarios (Solo Admin)

```
1. Usuario admin accede a /dashboard
   ↓
2. Ve opción "Gestión de Usuarios" (solo visible para admin)
   ↓
3. Click en "Gestión de Usuarios"
   ↓
4. Angular navega a /users
   - AuthGuard verifica autenticación ✓
   - AdminGuard verifica rol admin ✓
   ↓
5. UserManagementComponent carga:
   - UserService.getUsers() obtiene lista
   - Muestra tabla con usuarios
   ↓
6a. Crear Usuario:
    - Llena formulario
    - UserService.createUser()
    - Valida username único
    - Guarda en localStorage
    - Actualiza tabla
6b. Editar Usuario:
    - Click "Editar" en fila
    - Modo edición inline
    - Modifica campos
    - UserService.updateUser()
    - Guarda cambios
6c. Eliminar Usuario:
    - Click "Eliminar"
    - Confirmación
    - UserService.deleteUser()
    - Valida que no sea admin
    - Elimina y actualiza tabla
```

### Flujo 4: Cerrar Sesión

```
1. Usuario click en "Cerrar Sesión" en dashboard
   ↓
2. DashboardComponent llama AuthService.logout()
   ↓
3. AuthService:
   - Limpia currentUser
   - Elimina localStorage
   ↓
4. Router navega a /login
   ↓
5. LoginComponent se carga (pantalla de login)
```

---

## Estructura de Datos

### Usuario (User)

```typescript
interface User {
  username: string;    // Identificador único (requerido)
  password: string;     // Contraseña en texto plano (requerido)
  role: 'admin' | 'user'; // Rol del usuario (requerido)
  name: string;         // Nombre completo (requerido)
}
```

**Ejemplo**:
```json
{
  "username": "admin",
  "password": "Aa123456789",
  "role": "admin",
  "name": "Administrador"
}
```

### Item de Factura (InvoiceItem)

```typescript
interface InvoiceItem {
  description: string;  // Descripción del producto/servicio
  quantity: number;      // Cantidad (debe ser > 0)
  unitPrice: number;    // Precio unitario (debe ser >= 0)
  totalPrice: number;   // Total calculado (quantity × unitPrice)
}
```

**Ejemplo**:
```json
{
  "description": "Servicio de consultoría",
  "quantity": 10,
  "unitPrice": 150.00,
  "totalPrice": 1500.00
}
```

### Factura Completa (Invoice)

```typescript
interface Invoice {
  id: string;                    // ID único generado automáticamente
  invoiceNumber: string;          // Número visible (formato: YYYYMMDD####)
  date: string;                   // Fecha en formato ISO (YYYY-MM-DD)
  supplierName: string;           // Nombre del cliente (requerido)
  supplierContact: string;        // Contacto del cliente (opcional)
  supplierAddress: string;        // Dirección del cliente (opcional)
  supplierEmail: string;          // Email del cliente (requerido)
  items: InvoiceItem[];          // Array de items (mínimo 1)
  subtotal: number;              // Suma de todos los items
  total: number;                 // Total (actualmente igual a subtotal)
  deliveryTime: string;           // Tiempo de entrega (opcional)
  offerValidity: string;         // Validez de oferta (opcional)
  payConditions: string;         // Condiciones de pago (opcional)
  notes: string;                 // Notas adicionales (opcional)
  createdAt: string;            // Timestamp de creación (ISO format)
}
```

**Ejemplo Completo**:
```json
{
  "id": "1705934520123abc",
  "invoiceNumber": "202401220001",
  "date": "2024-01-22",
  "supplierName": "Empresa XYZ S.A.",
  "supplierContact": "+51 987654321",
  "supplierAddress": "Av. Principal 123, Lima",
  "supplierEmail": "contacto@empresaxyz.com",
  "items": [
    {
      "description": "Servicio de desarrollo web",
      "quantity": 40,
      "unitPrice": 100.00,
      "totalPrice": 4000.00
    },
    {
      "description": "Hosting anual",
      "quantity": 1,
      "unitPrice": 500.00,
      "totalPrice": 500.00
    }
  ],
  "subtotal": 4500.00,
  "total": 4500.00,
  "deliveryTime": "15 días hábiles",
  "offerValidity": "30 días",
  "payConditions": "50% anticipo, 50% al finalizar",
  "notes": "Incluye mantenimiento por 3 meses",
  "createdAt": "2024-01-22T14:30:00.000Z"
}
```

---

## Usuarios por Defecto

El sistema viene preconfigurado con dos usuarios:

### Administrador
- **Username**: `admin`
- **Password**: `Aa123456789`
- **Rol**: `admin`
- **Permisos**: Acceso completo, incluyendo gestión de usuarios

### Usuario Regular
- **Username**: `lysdani`
- **Password**: `L.Chircovich`
- **Rol**: `user`
- **Permisos**: Crear facturas, generar PDFs, ver dashboard

---

## Tecnologías Utilizadas

### Frontend Framework
- **Angular 17**: Framework principal
  - Componentes reactivos
  - Inyección de dependencias
  - Routing y navegación
  - Forms (Template-driven y Reactive)

### Lenguaje
- **TypeScript 5.2**: Superset de JavaScript con tipos estáticos
  - Type safety en tiempo de compilación
  - Mejor autocompletado en IDEs
  - Refactoring más seguro

### Librerías Principales
- **jsPDF 2.5.1**: Generación de PDFs
  - API simple para crear documentos
  - Soporte para texto, tablas, formas
  - Personalización de estilos

- **RxJS 7.8**: Programación reactiva
  - Observables para operaciones asíncronas
  - Operadores para transformar datos
  - Manejo de eventos y HTTP

### Estilos
- **SCSS**: Preprocesador CSS
  - Variables CSS (paleta de colores)
  - Anidamiento
  - Mixins y funciones

### Herramientas de Desarrollo
- **Angular CLI**: Herramientas de línea de comandos
- **TypeScript Compiler**: Compilación a JavaScript
- **Webpack**: Bundling y optimización (manejado por Angular CLI)

---

## Desarrollo

### Compilar para Producción

```bash
npm run build
```

Esto genera archivos optimizados en `dist/sifo/`:
- JavaScript minificado
- CSS optimizado
- Assets copiados
- Source maps (opcional)

### Modo Watch (Desarrollo)

```bash
npm run watch
```

Compila en modo desarrollo y recarga automáticamente ante cambios.

### Estructura de Build

```
dist/sifo/
├── index.html          # HTML principal
├── main.[hash].js      # Código de la aplicación
├── polyfills.[hash].js # Polyfills para compatibilidad
├── runtime.[hash].js   # Runtime de Angular
├── styles.[hash].css   # Estilos compilados
└── assets/             # Recursos estáticos
    └── data/           # Archivos JSON (si se copian)
```

---

## Notas Importantes

### Seguridad

⚠️ **Este sistema es para desarrollo/demostración**. Para producción:

1. **Autenticación**: Implementar JWT tokens o sesiones del servidor
2. **Contraseñas**: Nunca almacenar en texto plano, usar bcrypt/argon2
3. **HTTPS**: Obligatorio para todas las comunicaciones
4. **Validación**: Validar y sanitizar todos los inputs en el backend
5. **CORS**: Configurar correctamente para APIs
6. **Rate Limiting**: Prevenir ataques de fuerza bruta

### Persistencia

⚠️ **localStorage es temporal**:
- Se limpiará si el usuario borra datos del navegador
- No se sincroniza entre dispositivos
- Tiene límite de tamaño (~5-10MB)

**Recomendación**: Implementar backend con base de datos real.

### Escalabilidad

El sistema actual está diseñado para:
- Pocos usuarios simultáneos
- Volumen bajo de facturas
- Uso en un solo navegador/dispositivo

Para escalar:
- Backend con API REST
- Base de datos (PostgreSQL, MongoDB)
- Cache (Redis)
- Load balancing para múltiples servidores

---

## Solución de Problemas

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 4200 already in use"

```bash
# Windows
netstat -ano | findstr :4200
taskkill /PID [PID] /F

# Linux/Mac
lsof -ti:4200 | xargs kill
```

### Error: "Module not found" en tiempo de ejecución

Verifica que los archivos JSON estén en `src/data/` y que `angular.json` incluya esta carpeta en `assets`.

### PDF no se genera correctamente

1. Verifica que jsPDF esté instalado: `npm list jspdf`
2. Revisa la consola del navegador para errores
3. Verifica que todos los campos requeridos estén llenos

---

## Licencia

Este proyecto es privado y de uso interno.

---

## Contacto y Soporte

Para preguntas o problemas técnicos, consulta la documentación de Angular o los issues del proyecto.

---

**Última actualización**: Enero 2024
