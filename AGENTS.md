# Guía del agente — Next.js + React + Tailwind (web sencilla)

Documento de referencia para mantener coherencia, calidad y buenas prácticas en un proyecto pequeño con **React**, **Next.js** y **Tailwind CSS**.

---

## Alcance y filosofía

- Priorizar **simplicidad**: menos abstracciones, código fácil de leer y de borrar.
- **App Router** (`app/`) como convención por defecto en Next.js 13+.
- **TypeScript** recomendado; si el proyecto es JS, aplicar las mismas ideas sin anotaciones de tipos.

---

## Estructura de carpetas (orientativa)

```
app/                 # Rutas, layouts, loading, error, page.tsx
components/          # Componentes reutilizables (UI pura cuando sea posible)
components/ui/       # Piezas atómicas (botones, inputs, cards)
lib/                 # Utilidades, helpers, constantes
public/              # Estáticos servidos tal cual
```

- Colocar componentes **específicos de una ruta** dentro de `app/<ruta>/` o en una carpeta `_components` junto a la ruta si ayuda a la claridad.
- Evitar carpetas genéricas vacías “por si acaso”.

---

## Next.js

### Rutas y datos

- Usar **`page.tsx`** para la UI de la ruta y **`layout.tsx`** para shells compartidos (cabecera, pie, fuentes).
- **Datos en el servidor por defecto**: `async` en Server Components y `fetch` con caché/revalidación según necesidad (`cache`, `next: { revalidate }`, etc.).
- **`loading.tsx`** y **`error.tsx`** cuando mejoren la UX sin complicar el flujo.

### Server vs Client Components

- Por defecto los componentes en `app/` son **Server Components**: no usar `useState`, `useEffect` ni APIs del navegador ahí.
- Añadir **`"use client"`** solo en el archivo (o subárbol mínimo) que necesite interactividad, hooks del cliente o eventos del DOM.
- No marcar toda la app como cliente; mantener el bundle del cliente pequeño.

### Metadatos y SEO (web sencilla)

- Exportar **`metadata`** o **`generateMetadata`** en `page`/`layout` para título y descripción.
- Imágenes con **`next/image`** cuando aporten rendimiento (tamaños y `alt` descriptivos).

### Navegación y enlaces

- Enlaces internos con **`Link`** de `next/link`, no `<a href>` a rutas propias.
- Rutas y nombres de archivos en **kebab-case** o convención consistente del equipo.

---

## React

- **Solo componentes funcionales** y hooks; no clases.
- **Un componente, una responsabilidad** razonable; extraer cuando el JSX crezca o se repita.
- **Hooks**: reglas de React (no condicionales que rompan el orden); lógica reutilizable en **custom hooks** (`useThing`) en `hooks/` o junto al dominio.
- **Listas**: `key` estable (id), no índice si el orden cambia.
- **Props**: interfaces o tipos claros; evitar “prop drilling” excesivo; para estado global mínimo, Context está bien en proyectos pequeños.

---

## Tailwind CSS

- Estilo **utility-first** en el JSX; clases legibles y agrupadas (layout → spacing → tipografía → color → estado).
- **`@apply`** solo para patrones muy repetidos y documentados; no sustituir todo el CSS por capas de `@apply` opacas.
- Usar **breakpoints** (`sm:`, `md:`) de forma consistente; diseño **mobile-first**.
- **Dark mode**: si se usa, acordar estrategia (`class` o `media`) y aplicarla de forma uniforme.
- Componentes de UI: extraer a React cuando un bloque de clases se repita **tres o más veces** o tenga variantes.

### Accesibilidad con Tailwind

- Contraste suficiente; estados **`focus-visible`**, **`disabled:`**, **`aria-*`** cuando corresponda.
- No depender solo del color para transmitir información.

---

## Calidad de código

- **Nombres** descriptivos en inglés o español, pero **consistentes** en todo el repo.
- **Imports**: orden habitual — externos (React, Next), internos (`@/`), relativos; sin imports no usados.
- **Manejo de errores**: en Server Actions y rutas API, respuestas claras; en UI, mensajes comprensibles para el usuario.
- **No** dejar `console.log` en código que vaya a producción salvo logging deliberado.

---

## Rendimiento (sin obsesionarse en una web pequeña)

- Cargar en cliente solo lo necesario (`dynamic` con `ssr: false` solo cuando haya razón).
- Imágenes optimizadas y tamaños adecuados; fuentes con **`next/font`** si se usan tipografías web.
- Evitar listados enormes sin paginación o virtualización cuando crezcan.

---

## Seguridad básica

- No exponer secretos en el cliente; variables sensibles solo en **`process.env`** del servidor y prefijo correcto en Next (`NEXT_PUBLIC_` solo para lo que debe ser público).
- Sanitizar o validar entradas en formularios y APIs; no confiar en datos del cliente.

---

## Git y entregas

- Commits **pequeños y con mensaje claro** (imperativo o convención acordada).
- **`.env.local`** en `.gitignore`; nunca subir claves.

---

## Resumen para el asistente / agente

1. Next.js **App Router**, Server Components por defecto, `"use client"` mínimo.
2. React funcional, hooks ordenados, componentes enfocados.
3. Tailwind en el markup, diseño responsive mobile-first, accesibilidad presente.
4. Metadatos, `Link`, `next/image` y fuentes según el caso.
5. Código simple, tipado si hay TypeScript, sin sobre-ingeniería para una web sencilla.
