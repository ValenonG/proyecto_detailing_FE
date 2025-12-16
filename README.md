# 🚗 FUTURA DETAILING - Sistema de Gestión

Sistema web completo para la gestión de un taller de detailing automotriz. Permite administrar clientes, vehículos, trabajos, productos y servicios de manera eficiente.

---

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Funcionalidades](#-funcionalidades)
- [Roles de Usuario](#-roles-de-usuario)
- [Scripts Disponibles](#-scripts-disponibles)
- [API Integration](#-api-integration)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)

---

## ✨ Características

- 🔐 **Autenticación y Autorización**: Sistema completo de login/registro con JWT
- 👥 **Gestión de Clientes**: CRUD completo de clientes con información detallada
- 🚙 **Gestión de Vehículos**: Administración de vehículos asociados a clientes
- 🛠️ **Gestión de Trabajos**: Control de trabajos realizados con estado y seguimiento
- 📦 **Gestión de Productos**: Inventario de productos con stock
- 🧾 **Gestión de Servicios**: Catálogo de servicios ofrecidos
- 🎨 **Interfaz Moderna**: UI/UX premium con diseño responsive
- 🔒 **Control de Acceso**: Rutas protegidas según roles de usuario
- 🌐 **Página Pública**: Landing page con información y servicios

---

## 🛠 Tecnologías

### Frontend Framework
- **React 19.1** - Biblioteca de UI
- **TypeScript 5.8** - Tipado estático
- **Vite 7.1** - Build tool y dev server

### Estado y Routing
- **Redux Toolkit 2.9** - Gestión de estado global
- **React Router 7.9** - Enrutamiento
- **React Redux 9.2** - Integración React-Redux

### UI y Estilos
- **Tailwind CSS 4.1** - Framework CSS utility-first
- **Lucide React** - Íconos modernos

### Formularios y Validación
- **React Hook Form 7.65** - Gestión de formularios
- **Joi 18.0** - Validación de esquemas

### HTTP y Backend
- **Axios 1.12** - Cliente HTTP
- **Firebase 12.5** - Servicios de backend

### Desarrollo
- **ESLint 9.36** - Linter
- **TypeScript ESLint 8.44** - Linting para TypeScript

---

## 📦 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 (viene con Node.js)
- **Git** (para clonar el repositorio)

---

## 🚀 Instalación

1. **Clonar el repositorio**

```bash
git clone https://github.com/ValenonG/proyecto_detailing_FE.git
cd proyecto_detailing_FE
```

2. **Instalar dependencias**

```bash
npm install
```

---

## ⚙️ Configuración

1. **Crear archivo de variables de entorno**

Copia el archivo de ejemplo y configúralo:

```bash
cp .env.example .env
```

2. **Configurar variables de entorno**

Edita el archivo `.env` con tus valores:

```env
VITE_API_URL=http://localhost:3000
```

> **Nota**: Asegúrate de que la URL del backend esté correctamente configurada.

---

## 🏃 Ejecución

### Modo Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173/`

### Build de Producción

```bash
npm run build
```

Los archivos de producción se generarán en la carpeta `dist/`

### Preview de Producción

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

---

## 📁 Estructura del Proyecto

```
proyecto_detailing_FE/
├── src/
│   ├── components/          # Componentes reutilizables
│   │   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   │   ├── productos/      # Componentes de productos
│   │   ├── trabajos/       # Componentes de trabajos
│   │   └── ui/             # Componentes UI generales
│   ├── pages/              # Páginas/Vistas principales
│   │   ├── Home.tsx        # Landing page pública
│   │   ├── Login.tsx       # Página de login
│   │   ├── Register.tsx    # Página de registro
│   │   ├── Dashboard.tsx   # Panel principal
│   │   ├── Clientes.tsx    # Gestión de clientes
│   │   ├── Vehiculos.tsx   # Gestión de vehículos
│   │   ├── TrabajosPage.tsx # Gestión de trabajos
│   │   ├── ProductosPage.tsx # Gestión de productos
│   │   └── Servicios.tsx   # Gestión de servicios
│   ├── router/             # Configuración de rutas
│   │   └── AppRouter.tsx   # Router principal
│   ├── services/           # Servicios API
│   │   ├── api.ts          # Configuración Axios
│   │   ├── authService.ts  # Servicio de autenticación
│   │   ├── clienteService.ts
│   │   ├── vehiculoService.ts
│   │   ├── trabajoService.ts
│   │   ├── productoService.ts
│   │   └── tareaService.ts
│   ├── store/              # Redux Store
│   │   ├── index.ts        # Store principal
│   │   ├── hooks.ts        # Hooks tipados de Redux
│   │   └── slices/         # Redux slices
│   │       ├── authSlice.ts
│   │       ├── clienteSlice.ts
│   │       ├── vehiculoSlice.ts
│   │       ├── trabajosSlice.ts
│   │       └── productosSlice.ts
│   ├── types/              # TypeScript types/interfaces
│   │   ├── auth.types.ts
│   │   └── ...
│   ├── validations/        # Esquemas de validación Joi
│   │   └── auth.validation.ts
│   ├── utils/              # Utilidades
│   ├── App.tsx             # Componente raíz
│   ├── main.tsx            # Punto de entrada
│   └── index.css           # Estilos globales
├── public/                 # Archivos públicos
├── .env.example            # Ejemplo de variables de entorno
├── index.html              # HTML principal
├── package.json            # Dependencias y scripts
├── tsconfig.json           # Configuración TypeScript
├── vite.config.ts          # Configuración Vite
├── vercel.json             # Configuración Vercel
└── README.md              # Este archivo
```

---

## 🎯 Funcionalidades

### 🌐 Página Pública

- Landing page moderna con información del negocio
- Catálogo de servicios disponibles
- Formulario de contacto
- Diseño responsive y atractivo

### 🔐 Autenticación

- **Registro de usuarios**
  - Validación de formularios con Joi
  - Creación de cuenta con rol de Cliente por defecto
  - Auto-login después del registro

- **Inicio de sesión**
  - Autenticación con email y contraseña
  - Generación y almacenamiento de JWT
  - Redirección según rol del usuario

- **Cierre de sesión**
  - Limpieza de token y estado
  - Redirección a página pública

### 👥 Gestión de Clientes

- Listado de clientes con búsqueda y filtros
- Crear nuevo cliente
- Editar información del cliente
- Eliminar cliente
- Vista detallada de cada cliente

### 🚙 Gestión de Vehículos

- Registro de vehículos asociados a clientes
- CRUD completo de vehículos
- Información: marca, modelo, patente, año
- Asignación a clientes

### 🛠️ Gestión de Trabajos

- Creación de trabajos/órdenes de servicio
- Asignación de cliente y vehículo
- Seguimiento de estado (Pendiente, En Proceso, Completado)
- Lista de tareas incluidas
- Precio total
- Filtrado por estado

### 📦 Gestión de Productos

- Inventario de productos
- Control de stock
- Precios y descripciones
- CRUD completo

### 🧾 Gestión de Servicios

- Catálogo de servicios ofrecidos
- Descripción y precios
- Tiempo estimado
- Estado activo/inactivo

---

## 👤 Roles de Usuario

El sistema implementa control de acceso basado en roles:

### 🔵 Cliente
- Acceso limitado al dashboard
- Visualización de sus propios trabajos y vehículos

### 🟢 Empleado
- Acceso a gestión de clientes
- Gestión de vehículos
- Gestión de trabajos
- Gestión de productos
- Gestión de servicios

### 🔴 Administrador
- Acceso completo a todas las funcionalidades
- Gestión de configuración del sistema
- Control total del panel de administración

---

## 📜 Scripts Disponibles

```json
{
  "dev": "Inicia el servidor de desarrollo",
  "build": "Genera el build de producción",
  "lint": "Ejecuta el linter para verificar el código",
  "preview": "Previsualiza el build de producción"
}
```

### Ejemplos de uso:

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm run preview

# Verificar código
npm run lint
```

---

## 🔌 API Integration

La aplicación se conecta a un backend REST API. Todas las peticiones HTTP están centralizadas en la carpeta `services/`.

### Configuración de Axios

El archivo `services/api.ts` incluye:

- **Interceptor de Request**: Agrega automáticamente el token JWT a cada petición
- **Interceptor de Response**: Maneja errores 401 y redirige al login en rutas protegidas
- **Base URL**: Configurada desde variables de entorno

### Endpoints Principales

```typescript
// Autenticación
POST /persona/login
POST /persona/register

// Clientes
GET    /persona
POST   /persona
PUT    /persona/:id
DELETE /persona/:id

// Vehículos
GET    /vehiculo
POST   /vehiculo
PUT    /vehiculo/:id
DELETE /vehiculo/:id

// Trabajos
GET    /trabajo
POST   /trabajo
PUT    /trabajo/:id
DELETE /trabajo/:id

// Productos
GET    /producto
POST   /producto
PUT    /producto/:id
DELETE /producto/:id

// Servicios/Tareas
GET    /tarea
POST   /tarea
PUT    /tarea/:id
DELETE /tarea/:id
```

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. **Conectar repositorio a Vercel**
   
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu repositorio de GitHub

2. **Configurar variables de entorno**
   
   En la configuración del proyecto en Vercel, agrega:
   ```
   VITE_API_URL=https://tu-api-backend.com
   ```

3. **Deploy automático**
   
   Vercel detectará automáticamente Vite y configurará el build

### Otras plataformas

El proyecto es compatible con cualquier servicio de hosting estático:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

Asegúrate de:
1. Ejecutar `npm run build`
2. Subir el contenido de la carpeta `dist/`
3. Configurar variables de entorno

---

## 🎨 Personalización

### Colores y Tema

Los colores principales están definidos con Tailwind CSS:

- **Primario**: Blue (azul)
- **Secundario**: Slate (gris oscuro)
- **Acentos**: Cyan, Red

Para personalizar, modifica las clases de Tailwind en los componentes.

### Íconos

Los íconos provienen de **Lucide React**. Para agregar nuevos íconos:

```tsx
import { NombreIcono } from 'lucide-react';

<NombreIcono size={24} />
```

---

## 🤝 Contribución

Las contribuciones son bienvenidas. Para contribuir:

1. **Fork** el proyecto
2. Crea una **rama** para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. Abre un **Pull Request**

### Estándares de Código

- Usar TypeScript para todo el código
- Seguir las reglas de ESLint
- Usar nombres descriptivos para variables y funciones
- Comentar código complejo
- Mantener componentes pequeños y reutilizables

---

## 📝 Notas Adicionales

### Gestión de Estado

El proyecto usa **Redux Toolkit** para:
- Estado de autenticación (user, token, isAuthenticated)
- Estado de clientes
- Estado de vehículos
- Estado de trabajos
- Estado de productos

### Rutas Protegidas

El componente `ProtectedRoute` verifica:
1. Si el usuario está autenticado
2. Si el usuario tiene el rol necesario para acceder a la ruta
3. Redirige a login o dashboard según corresponda

### Validación de Formularios

Todos los formularios usan:
- **React Hook Form**: Gestión del estado del formulario
- **Joi**: Validación de esquemas
- **@hookform/resolvers**: Integración entre ambos

---

## 🐛 Solución de Problemas

### Error: Cannot find module

```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: Port already in use

```bash
# El puerto 5173 está ocupado, Vite automáticamente usará otro
# O puedes especificar un puerto manualmente
npm run dev -- --port 3000
```

### Error: API Connection Failed

Verifica:
1. Que el backend esté corriendo
2. Que la variable `VITE_API_URL` esté correctamente configurada
3. Que no haya problemas de CORS en el backend

---

## 📄 Licencia

Este proyecto es parte de un trabajo universitario para la materia Metodologías de Desarrollo Web.

---

## 👨‍💻 Autor

**Leonardo La Rosa**
- GitHub: [@ValenonG](https://github.com/ValenonG)

---

## 🙏 Agradecimientos

- Universidad
- Profesores de Metodologías de Desarrollo Web
- Comunidad de React y Redux

---

**¿Preguntas o sugerencias?** Abre un issue en el repositorio.

**FUTURA DETAILING** - Sistema de Gestión para Talleres de Detailing Automotriz 🚗✨