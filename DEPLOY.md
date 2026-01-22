# Guía de Despliegue a GitHub Pages

Esta guía te ayudará a subir tu proyecto SIFO a GitHub y publicarlo en GitHub Pages.

## 📋 Requisitos Previos

1. Cuenta de GitHub (gratuita)
2. Git instalado en tu computadora
3. Proyecto funcionando localmente

---

## Paso 1: Preparar el Proyecto Localmente

### 1.1. Inicializar Git (si no está inicializado)

Abre la terminal en la carpeta del proyecto y ejecuta:

```bash
git init
```

### 1.2. Verificar que .gitignore esté configurado

El archivo `.gitignore` ya está creado y excluye:
- `node_modules/`
- `.angular/`
- `dist/`
- Archivos temporales

### 1.3. Hacer el primer commit

```bash
# Agregar todos los archivos
git add .

# Hacer commit inicial
git commit -m "Initial commit: SIFO Sistema de Facturación Online"
```

---

## Paso 2: Crear Repositorio en GitHub

### 2.1. Crear nuevo repositorio

1. Ve a [GitHub.com](https://github.com) e inicia sesión
2. Click en el botón **"+"** (arriba derecha) → **"New repository"**
3. Completa el formulario:
   - **Repository name**: `SIFO_SistemaDeFacturacionOnline` (o el nombre que prefieras)
   - **Description**: "Sistema de Facturación Online desarrollado con Angular"
   - **Visibility**: 
     - ✅ **Public** (para GitHub Pages gratuito)
     - ⚠️ **Private** (requiere GitHub Pro para Pages)
   - ⚠️ **NO marques** "Initialize with README" (ya tienes uno)
   - ⚠️ **NO agregues** .gitignore ni license (ya los tienes)
4. Click en **"Create repository"**

### 2.2. Copiar la URL del repositorio

GitHub te mostrará una URL como:
```
https://github.com/tu-usuario/SIFO_SistemaDeFacturacionOnline.git
```

**Cópiala**, la necesitarás en el siguiente paso.

---

## Paso 3: Conectar el Proyecto Local con GitHub

### 3.1. Agregar el remoto

En la terminal, ejecuta (reemplaza con tu URL):

```bash
git remote add origin https://github.com/tu-usuario/SIFO_SistemaDeFacturacionOnline.git
```

### 3.2. Verificar la rama principal

Asegúrate de estar en la rama `main` o `master`:

```bash
# Ver rama actual
git branch

# Si estás en otra rama, cambiar a main
git branch -M main
```

### 3.3. Subir el código

```bash
# Subir código a GitHub
git push -u origin main
```

Si GitHub te pide autenticación:
- **Token de acceso personal**: Necesitarás crear uno en GitHub Settings → Developer settings → Personal access tokens
- O usa **GitHub CLI** si lo tienes instalado

---

## Paso 4: Configurar GitHub Pages

### Opción A: Usando GitHub Actions (Recomendado - Automático)

El proyecto ya incluye un workflow de GitHub Actions que despliega automáticamente.

#### 4.1. Habilitar GitHub Pages

1. Ve a tu repositorio en GitHub
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Pages**
4. En **Source**, selecciona:
   - **Source**: `GitHub Actions`
5. Guarda los cambios

#### 4.2. Verificar el Workflow

El archivo `.github/workflows/deploy.yml` ya está configurado. Se ejecutará automáticamente cuando:
- Hagas push a la rama `main` o `master`
- El workflow compilará el proyecto
- Desplegará a GitHub Pages

#### 4.3. Verificar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio
2. Verás el workflow ejecutándose
3. Cuando termine (verde ✓), tu sitio estará disponible en:
   ```
   https://tu-usuario.github.io/SIFO_SistemaDeFacturacionOnline/
   ```

### Opción B: Despliegue Manual (Alternativa)

Si prefieres desplegar manualmente:

#### 4.1. Instalar gh-pages

```bash
npm install --save-dev gh-pages
```

#### 4.2. Agregar script en package.json

Agrega este script en `package.json`:

```json
"scripts": {
  "deploy": "ng build --base-href /SIFO_SistemaDeFacturacionOnline/ && npx gh-pages -d dist/sifo"
}
```

#### 4.3. Compilar y Desplegar

```bash
npm run deploy
```

#### 4.4. Configurar GitHub Pages

1. Ve a Settings → Pages
2. En **Source**, selecciona:
   - **Branch**: `gh-pages`
   - **Folder**: `/ (root)`
3. Guarda

---

## Paso 5: Configurar Base Href

### 5.1. Verificar angular.json

El workflow ya está configurado con el base-href correcto. Si necesitas cambiarlo manualmente:

En `angular.json`, el build ya incluye:
```json
"baseHref": "/SIFO_SistemaDeFacturacionOnline/"
```

**Importante**: El base-href debe coincidir con el nombre de tu repositorio.

### 5.2. Si cambias el nombre del repositorio

Si tu repositorio tiene otro nombre, actualiza:

1. `.github/workflows/deploy.yml`:
   ```yaml
   run: npm run build -- --base-href /TU-NOMBRE-REPO/
   ```

2. `angular.json` (si lo haces manual):
   ```json
   "baseHref": "/TU-NOMBRE-REPO/"
   ```

---

## Paso 6: Acceder a tu Aplicación

Una vez desplegado, tu aplicación estará disponible en:

```
https://tu-usuario.github.io/SIFO_SistemaDeFacturacionOnline/
```

**Nota**: Puede tardar unos minutos en estar disponible después del primer despliegue.

---

## Actualizaciones Futuras

### Cada vez que quieras actualizar el sitio:

1. Haz tus cambios en el código
2. Commit y push:

```bash
git add .
git commit -m "Descripción de los cambios"
git push origin main
```

3. El workflow de GitHub Actions se ejecutará automáticamente
4. En 2-5 minutos, los cambios estarán en GitHub Pages

---

## Solución de Problemas

### Error: "Repository not found"

- Verifica que la URL del remoto sea correcta:
  ```bash
  git remote -v
  ```
- Asegúrate de tener permisos en el repositorio

### Error: "Authentication failed"

- Crea un Personal Access Token en GitHub
- Úsalo como contraseña al hacer push
- O configura SSH keys

### El sitio no carga o muestra 404

1. Verifica que el base-href coincida con el nombre del repo
2. Espera 5-10 minutos (primera vez puede tardar)
3. Verifica en Settings → Pages que esté habilitado
4. Revisa la pestaña Actions para ver si hay errores

### Los assets (JSON) no cargan

- Verifica que `angular.json` incluya `src/data` en assets
- Los archivos JSON deben estar en `src/data/`
- GitHub Pages sirve archivos estáticos, asegúrate de que se copien al build

### Error en el workflow de GitHub Actions

1. Ve a la pestaña **Actions** en GitHub
2. Click en el workflow fallido
3. Revisa los logs para ver el error específico
4. Errores comunes:
   - Node version incorrecta
   - Dependencias faltantes
   - Errores de compilación de TypeScript

---

## Configuración Adicional

### Dominio Personalizado (Opcional)

Si tienes un dominio propio:

1. Ve a Settings → Pages
2. En **Custom domain**, ingresa tu dominio
3. Configura los registros DNS según las instrucciones de GitHub

### Proteger la Rama Main (Recomendado)

1. Settings → Branches
2. Agrega regla para `main`:
   - ✅ Require pull request reviews
   - ✅ Require status checks to pass

---

## Comandos Útiles

```bash
# Ver estado de Git
git status

# Ver ramas remotas
git branch -r

# Ver configuración del remoto
git remote -v

# Cambiar URL del remoto (si cambiaste el nombre del repo)
git remote set-url origin https://github.com/nuevo-usuario/nuevo-repo.git

# Forzar actualización del remoto
git fetch origin
git pull origin main
```

---

## Notas Importantes

⚠️ **GitHub Pages es para sitios estáticos**:
- No hay backend
- Los datos en JSON se cargan desde el repositorio
- No hay base de datos
- Las modificaciones de datos solo persisten en localStorage del navegador

⚠️ **Límites de GitHub Pages**:
- 1GB de espacio
- 100GB de ancho de banda/mes
- Solo archivos estáticos

⚠️ **Seguridad**:
- No subas archivos con información sensible
- Las contraseñas en `users.json` son visibles públicamente
- Considera usar variables de entorno o un backend real para producción

---

## Recursos Adicionales

- [Documentación de GitHub Pages](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Angular Deployment Guide](https://angular.io/guide/deployment)

---

¡Listo! Tu aplicación debería estar funcionando en GitHub Pages. 🚀

