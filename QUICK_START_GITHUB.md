# 🚀 Guía Rápida: Subir a GitHub y GitHub Pages

## Pasos Rápidos

### 1. Inicializar Git (si no está hecho)
```bash
git init
git add .
git commit -m "Initial commit: SIFO Sistema de Facturación Online"
```

### 2. Crear Repositorio en GitHub
1. Ve a https://github.com/new
2. Nombre: `SIFO_SistemaDeFacturacionOnline` (o el que prefieras)
3. Marca como **Public** (para GitHub Pages gratuito)
4. **NO** marques "Initialize with README"
5. Click "Create repository"

### 3. Conectar y Subir
```bash
# Reemplaza TU-USUARIO con tu usuario de GitHub
git remote add origin https://github.com/TU-USUARIO/SIFO_SistemaDeFacturacionOnline.git
git branch -M main
git push -u origin main
```

### 4. Activar GitHub Pages
1. Ve a tu repositorio → **Settings** → **Pages**
2. En **Source**, selecciona: **GitHub Actions**
3. Guarda

### 5. ¡Listo!
Tu sitio estará en:
```
https://TU-USUARIO.github.io/SIFO_SistemaDeFacturacionOnline/
```

**Nota**: El workflow se ejecutará automáticamente. Espera 2-5 minutos.

---

## ⚠️ Importante: Cambiar el Nombre del Repositorio

Si tu repositorio tiene un nombre diferente a `SIFO_SistemaDeFacturacionOnline`, debes actualizar:

### 1. Archivo `.github/workflows/deploy.yml`
Línea 27, cambia:
```yaml
run: npm run build -- --base-href /TU-NOMBRE-REPO/
```

### 2. Archivo `angular.json`
Línea 21, cambia:
```json
"baseHref": "/TU-NOMBRE-REPO/",
```

---

## 📝 Actualizar el Sitio

Cada vez que hagas cambios:
```bash
git add .
git commit -m "Descripción de cambios"
git push origin main
```

El sitio se actualizará automáticamente en 2-5 minutos.

---

Para más detalles, consulta `DEPLOY.md`

