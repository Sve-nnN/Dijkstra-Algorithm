# Dijkstra Pathfinding App

## Descripción

La **Dijkstra Pathfinding App** es una aplicación interactiva diseñada para calcular y visualizar el camino más corto entre dos puntos en un grafo, usando el algoritmo de Dijkstra. Los usuarios pueden seleccionar puntos (nodos) y observar el cálculo en tiempo real del camino más corto, junto con la distancia total entre ellos. Esta herramienta es ideal para quienes deseen explorar el algoritmo de Dijkstra y comprender su aplicación en problemas de rutas y redes.

## Funcionalidades

- **Selección de Contexto Personalizado**: Los usuarios pueden elegir entre varios contextos (como ciudades, estaciones, redes de rutas, etc.) para personalizar los nodos y las distancias en el grafo.

- **Generación Automática de Matriz de Distancias**: La aplicación crea una matriz de distancias que representa las conexiones entre nodos, sirviendo como base para el cálculo del algoritmo.

- **Visualización Gráfica del Grafo**: La interfaz muestra los nodos y aristas del grafo, resaltando el camino más corto en un color distinto (rojo) para una interpretación más clara.

- **Cálculo Interactivo del Camino Más Corto**: Los usuarios pueden seleccionar dos puntos (A y B) en el grafo para ver el camino óptimo entre ellos, junto con la distancia total.

- **Interfaz Amigable y Responsiva**: Diseñada con accesibilidad en mente, la aplicación es intuitiva y facilita la navegación del usuario a través de las funcionalidades disponibles.

## Tecnologías y Herramientas Usadas

- **React**: Permite construir interfaces de usuario interactivas y basadas en componentes.
- **TypeScript**: Mejora la robustez y mantenibilidad del código con la tipificación estática.
- **Visx**: Librería de visualización para crear gráficos SVG interactivos y visualizaciones personalizadas.
- **Radix UI**: Proporciona componentes accesibles y predefinidos como diálogos, popovers y selectores.
- **Tailwind CSS**: Framework de utilidades CSS que facilita un diseño rápido y adaptable.

## Estructura del Proyecto y Scripts

- **dev**: Inicia un servidor de desarrollo con [Vite](https://vitejs.dev/).
- **build**: Realiza la construcción del proyecto, incluyendo la compilación de TypeScript y la generación de archivos optimizados.
- **lint**: Ejecuta ESLint para analizar y mejorar la calidad del código.
- **preview**: Muestra una vista previa del proyecto construido.
- **test**: Ejecuta las pruebas utilizando Jest.

## Dependencias Clave

El proyecto utiliza una serie de dependencias para funcionalidades específicas:

- **Radix UI** (`@radix-ui/react-*`): Componentes de interfaz de usuario accesibles y personalizables.
- **Visx** (`@visx/*`): Herramientas para la visualización de datos y gráficos en SVG.
- **Class Variance Authority** y **clsx**: Ayudan en la manipulación condicional de clases CSS.
- **Lucide React**: Librería de íconos en SVG.
- **Tailwind CSS** y **Tailwind Merge**: Para gestionar estilos CSS y combinar clases CSS en una estructura coherente.

## Instalación

1. Clona el repositorio:

  ```bash
  git clone https://github.com/Sve-nnN/Dijkstra-Algorithm.git
  ```
3. Navega al directorio del proyecto:

  ```bash
  cd dijkstra-pathfinding-app
  ```
3. Instala las dependencias:
   
  ```bash
  npm install
  ```
4. Ejecuta la aplicación:

  ```bash
  npm run dev
  ```

La aplicación estará disponible en [http://localhost:5173](http://localhost:5173/).

## Estructura de Archivos
El proyecto está estructurado de la siguiente manera:

- src/: Contiene el código fuente de la aplicación, dividido en componentes, servicios y estilos.
- public/: Archivos estáticos accesibles directamente desde el navegador.
- tests/: Pruebas unitarias y de integración, diseñadas para verificar la funcionalidad del código.
## Contribuciones
Las contribuciones son bienvenidas para mejorar y expandir la aplicación. Para contribuir:

1. Haz un fork del proyecto.
2. Crea una nueva rama para tus cambios.
  ```bash
  git checkout -b nombre-de-tu-rama
  ```
3. Realiza los cambios que desees, incluyendo mejoras en funcionalidades o arreglos de errores.
4. Asegúrate de que el código cumpla con las guías de estilo, ejecutando npm run lint.
5. Ejecuta las pruebas con npm run test y verifica que todas pasen correctamente.
6. Envía un pull request con una descripción detallada de los cambios realizados.
