# 🏗️ Calculadora de Diseño Estructural

<div align="center">

![React](https://img.shields.io/badge/React_18-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat&logo=tailwindcss&logoColor=white)
![Status](https://img.shields.io/badge/Estado-En%20desarrollo-orange?style=flat)

**Herramienta de cálculo de costos para proyectos de diseño estructural**  

 [Reportar un bug](https://github.com/FJSaladin/Calculadora-Estructural/issues)

</div>

---

## 📋 Descripción

Aplicación web desarrollada con React que permite calcular y desglosar los costos de servicios de diseño estructural según la normativa dominicana. Soporta 7 sistemas estructurales con sus respectivas restricciones sísmicas, valida los datos ingresados en tiempo real y genera un presupuesto detallado listo para exportar como PDF.

---

## ✨ Funcionalidades

### Sistemas estructurales soportados

| Sistema | Límite de niveles | Zona sísmica |
|---------|-------------------|--------------|
| Mampostería / Formaleta | Máx. 5 | — |
| Pórticos Intermedios de Hormigón | Máx. 12 | — |
| Pórticos Especiales de Hormigón | Sin límite | — |
| Sistema Dual de Hormigón | 4 (zona 1) / 6 (zona 2) | 1 y 2 |
| Pórticos Intermedios de Acero | Máx. 4 · Altura máx. 3m/nivel | Solo zona 2 |
| Pórticos Especiales de Acero | Altura máx. 50m (zona 1) | 1 y 2 |
| Sistema Dual Metálico | 4 (zona 1) / 6 (zona 2) | 1 y 2 |

### Cálculo de costos
- Planos estructurales según número de planchas e irregularidad
- Modelo computacional por m² de área total
- Memoria de cálculo y gestión de dictamen MIVED (opcional)


## 🚀 Instalación y ejecución local

### Prerrequisitos
- Node.js >= 16

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/FJSaladin/Calculadora-Estructural.git
cd Calculadora-Estructural

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`.

```bash
# Compilar para producción
npm run build

# Previsualizar el build
npm run preview
```

