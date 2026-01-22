# 🔧 Solución al Error de Permisos en GitHub Pages

## Problema Identificado

El error `Permission denied to github-actions[bot]` ocurre porque la configuración del repositorio está limitando los permisos de los workflows.

## ✅ Solución Paso a Paso

### Paso 1: Cambiar Permisos del Repositorio

1. **Ve a tu repositorio en GitHub:**
   ```
   https://github.com/SoyEliezerRojas/SIFO_SistemaDeFacturacionOnline
   ```

2. **Abre Settings:**
   - Click en la pestaña **"Settings"** (arriba del repositorio)

3. **Ve a Actions → General:**
   - En el menú lateral izquierdo, busca **"Actions"** (dentro de "Code and automation")
   - Click en **"General"** (si no está ya seleccionado)

4. **Cambiar Workflow Permissions:**
   - Baja hasta la sección **"Workflow permissions"**
   - **IMPORTANTE**: Cambia de:
     - ❌ "Read repository contents and packages permissions"
   - A:
     - ✅ **"Read and write permissions"**
   
5. **Guardar:**
   - Click en el botón **"Save"** al final de la página

### Paso 2: Verificar Configuración de Pages

1. **Ve a Settings → Pages:**
   - En el menú lateral, click en **"Pages"**

2. **Verificar Source:**
   - Debe estar en **"GitHub Actions"** (ya lo tienes configurado ✅)

### Paso 3: Hacer Commit y Push de los Cambios

El workflow ya fue actualizado con permisos explícitos. Ahora necesitas subir los cambios:

```bash
git add .github/workflows/deploy.yml
git commit -m "Fix: Agregar permisos de escritura explícitos para GitHub Pages"
git push origin main
```

### Paso 4: Re-ejecutar el Workflow

1. **Ve a la pestaña Actions:**
   - En tu repositorio, click en **"Actions"**

2. **Abrir el workflow fallido:**
   - Click en el último workflow que falló

3. **Re-ejecutar:**
   - Click en el botón **"Re-run all jobs"** (arriba a la derecha)
   - O simplemente espera a que se ejecute automáticamente con el nuevo push

## 📋 Resumen de Cambios Necesarios

### En GitHub (Settings):

✅ **Actions → General → Workflow permissions:**
- Cambiar a: **"Read and write permissions"**
- Guardar cambios

### En el Workflow (Ya actualizado):

✅ **Permisos explícitos:**
- `contents: write` (en lugar de `read`)
- `pages: write`
- `id-token: write`

## ⚠️ Si el Problema Persiste

### Opción Alternativa: Usar Personal Access Token

Si después de cambiar los permisos sigue fallando:

1. **Crear Personal Access Token:**
   - GitHub → Tu perfil → Settings → Developer settings
   - Personal access tokens → Tokens (classic)
   - Generate new token (classic)
   - Nombre: "GitHub Pages Deploy"
   - Permisos: Marca **"repo"** (acceso completo)
   - Generate token
   - **COPIA EL TOKEN** (solo se muestra una vez)

2. **Agregar como Secret:**
   - Repositorio → Settings → Secrets and variables → Actions
   - New repository secret
   - Name: `GH_PAGES_TOKEN`
   - Value: Pega el token
   - Add secret

3. **Actualizar el workflow:**
   - Cambiar `github_token: ${{ secrets.GITHUB_TOKEN }}`
   - Por: `github_token: ${{ secrets.GH_PAGES_TOKEN }}`

## 🎯 Verificación

Después de hacer los cambios, el workflow debería:

1. ✅ Compilar correctamente (Build step)
2. ✅ Desplegar sin errores (Deploy step)
3. ✅ Mostrar la URL de tu sitio

Tu sitio estará disponible en:
```
https://soyeliezerrojas.github.io/SIFO_SistemaDeFacturacionOnline/
```

## 📝 Notas Importantes

- Los permisos del workflow en el YAML pueden ser sobrescritos por la configuración del repositorio
- Siempre verifica Settings → Actions → General después de crear un nuevo repositorio
- El cambio de permisos puede tardar unos segundos en aplicarse

---

**¿Necesitas ayuda con algún paso?** Revisa los logs del workflow en la pestaña Actions para ver errores específicos.

