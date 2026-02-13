Sistema de Reportes para Gestión Educativa 
Este proyecto implementa una arquitectura basada en PostgreSQL + Views + Next.js + Docker Compose. El sistema gestiona reportes académicos, control de asistencia y rankings de estudiantes, priorizando el rendimiento mediante el uso de índices y vistasen la base de datos.

## Stack de Trabajo
Frontend: Next.js 15 (App Router)

Base de Datos: PostgreSQL 15 (Alpine)

Contenedores: Docker & Docker Compose

Estilos: CSS Modules / Tailwind CSS

Validación: ESLint & TypeScript

## Flujo de Inicialización
La base de datos se construye siguiendo una secuencia estricta para garantizar la integridad referencial:

01_schema.sql: Definición de tablas base (students, courses, enrollments, attendance, evaluations).

02_seed.sql: Poblado de datos iniciales para pruebas.

03_indexes.sql: Creación de índices para optimizar consultas frecuentes.

04_reports.sql: Creación de Vistas (Views) para los módulos de reportes.

05_roles.sql: Configuración de roles y permisos de acceso para la aplicación.

## Estructura del Proyecto
front/: Aplicación Next.js que consume los datos. Contiene los módulos de reportes en src/app/reports/:

RankStudents: Ranking de alumnos por desempeño.

attendance: Reportes de asistencia.

course & teacher: Gestión de materias y docentes.

db/: Scripts SQL ordenados secuencialmente para el despliegue de la base de datos.

docker-compose.yml: Orquestación de los servicios db (puerto 5432) y front (puerto 3000).

.env: Variables de entorno para la conexión segura entre el cliente y el servidor de base de datos.

## Optimización (Uso de Indexes)
Se implementaron índices estratégicos en el archivo 03_indexes.sql para acelerar los reportes críticos. A continuación, se muestra la evidencia teórica de su impacto:

Ranking de Estudiantes (idx_evaluations_score)

Consulta: Utilizada en RankStudents para ordenar a los alumnos por promedio.

Impacto: Permite calcular promedios y ordenar sin realizar un Sequential Scan completo en la tabla de evaluaciones.

SQL
EXPLAIN ANALYZE 
SELECT student_id, AVG(score) as average 
FROM evaluations 
GROUP BY student_id 
ORDER BY average DESC;

-- RESULTADO ESPERADO:
-- Index Scan using idx_evaluations_score on evaluations
-- Execution Time: < 0.1 ms (vs 1.5ms seq scan)
Reporte de Asistencia (idx_attendance_date)

Consulta: Filtrado de asistencias por rango de fechas en el módulo attendance.

Impacto: Crucial para reportes mensuales o semanales, accediendo directamente a los registros del periodo seleccionado.

SQL
EXPLAIN ANALYZE 
SELECT * FROM attendance WHERE date BETWEEN '2025-01-01' AND '2025-01-31';

-- RESULTADO ESPERADO:
-- Bitmap Heap Scan on attendance
-- -> Bitmap Index Scan on idx_attendance_date
Búsqueda de Alumnos (idx_students_search)

Consulta: Buscador general en el dashboard para localizar alumnos por nombre o matrícula.

Impacto: Optimiza las búsquedas de texto parcial (ILIKE) para respuestas instantáneas en el frontend.

SQL
EXPLAIN ANALYZE 
SELECT name FROM students WHERE name ILIKE 'Omar%';

-- RESULTADO ESPERADO:
-- Index Scan using idx_students_search
Instalación y Despliegue
Este proyecto está contenerizado para ejecutarse fácilmente:

## Clonar el repositorio

Bash
git clone https://github.com/omarselvas/evaluacionpracticac1_nextjs-bda.git
cd evaluacionpracticac1_nextjs-bda
Configurar variables de entorno Crea un archivo .env en la raíz (y/o en la carpeta front si es necesario) basándote en .env.example.

Levantar con Docker

Bash
docker compose up --build
Una vez finalizado, accede a:

Frontend: http://localhost:3000
Base de Datos: localhost:5432

Autor
Omar Kalid Selvas Alvarez  - Evaluación Práctica Unidad 1 - BDA & Next.js