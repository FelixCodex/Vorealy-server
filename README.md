# Vorealy Server

**Vorealy Server** es el backend de una aplicación de gestión de tareas y proyectos, desarrollado con Node.js, Express y SQLite. Implementa una arquitectura modular y escalable, integrando validaciones con Zod y comunicación en tiempo real mediante Socket.IO.

## 🚀 Características

- **API RESTful** para gestionar entidades como listas, tareas y espacios de trabajo.
- **Validaciones robustas** utilizando Zod para garantizar la integridad de los datos.
- **Comunicación en tiempo real** con Socket.IO para actualizaciones instantáneas.
- **Base de datos SQLite** con esquemas definidos en `Vorealy Schema.sql`.
- **Arquitectura modular** que separa controladores, casos de uso y repositorios.

## 📁 Estructura del Proyecto

```
vorealy-server/
├── src/
│   ├── infrastructure/
│   ├── modules/
│   ├── routes/
│   ├── shared/
│   └── index.js
├── package.json
└── README.md
```

## ⚙️ Instalación

1. **Clonar el repositorio:**

   ```bash
   git clone https://github.com/FelixCodex/Vorealy-server.git
   cd Vorealy-server
   ```

2. **Instalar dependencias:**

   ```bash
   npm install
   npm run dev
   ```

> **Nota:** Se requiere autenticación para ciertos endpoints. Asegúrate de incluir el token JWT en los encabezados de las solicitudes.

Para conectarte al servidor de sockets:

```javascript
const socket = io('http://localhost:3000', {
	auth: {
		userId: 'tu-uuid-sin-guiones',
	},
});
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** y **Express** para el servidor.
- **SQLite** como base de datos.
- **Zod** para validaciones de esquemas.
- **Socket.IO** para comunicación en tiempo real.
