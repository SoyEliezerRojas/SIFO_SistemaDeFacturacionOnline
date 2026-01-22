# 🗑️ Eliminar CNAME Manualmente de gh-pages

El workflow no está eliminando el CNAME correctamente. Aquí está cómo eliminarlo manualmente:

## Opción 1: Eliminar desde GitHub Web (Más Fácil)

1. **Ve a tu repositorio en GitHub**
2. **Cambia a la rama `gh-pages`** (selector de ramas arriba)
3. **Click en el archivo `CNAME`**
4. **Click en el ícono de papelera (Delete)** arriba a la derecha
5. **Haz commit** con el mensaje: "Remove CNAME file"
6. **Click en "Commit changes"**

## Opción 2: Eliminar desde Terminal

```bash
# Cambiar a la rama gh-pages
git checkout gh-pages

# Eliminar el archivo CNAME
git rm CNAME

# Hacer commit
git commit -m "Remove CNAME file"

# Subir cambios
git push origin gh-pages

# Volver a main
git checkout main
```

## Verificación

Después de eliminar el CNAME:

1. **Espera 10-15 minutos** para que GitHub Pages actualice
2. **Limpia la caché del navegador** (Ctrl+Shift+Delete)
3. **Prueba en modo incógnito**
4. **Accede a**: `https://soyeliezerrojas.github.io/SIFO_SistemaDeFacturacionOnline/`

## ¿Por qué el workflow no lo elimina?

El action `peaceiris/actions-gh-pages@v3` puede estar recreando el CNAME o no está respetando la eliminación. Por eso es mejor eliminarlo manualmente de la rama `gh-pages`.

---

**Nota**: Una vez eliminado manualmente, el workflow debería mantenerlo eliminado en futuros deployments.

