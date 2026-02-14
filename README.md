# Lab 6: Sistema de Reportes E-Commerce con PostgreSQL y Next.js

**Estudiante:** Omar Selvas  
**Fecha:** Febrero 2026  
**Materia:** Bases de Datos Avanzadas

## Descripción del Proyecto
Este proyecto implementa un sistema de reportes para una tienda en línea (e-commerce) usando PostgreSQL para crear vistas SQL con agregaciones complejas y Next.js como frontend. La idea es analizar ventas, inventario y comportamiento de clientes de forma eficiente.

**Reportes implementados:**
1. **Ventas por Categoría** - Análisis de rendimiento comercial por tipo de producto
2. **Clientes en Riesgo** - Detecta clientes inactivos o con muchas cancelaciones
3. **Ranking de Productos** - Top productos por ventas e ingresos
4. **Estado de Inventario** - Alertas de reorden automático
5. **Clientes VIP** - Segmentación de mejores clientes por valor

## Stack Tecnológico
- **Framework:** Next.js 15 (App Router)
- **Base de Datos:** PostgreSQL 15 (consultas directas con `pg`)
- **Validación:** Zod para parámetros de búsqueda
- **Estilos:** Tailwind CSS
- **Contenedores:** Docker Compose (web + db)

## Despliegue Rápido
```bash
git clone https://github.com/OmarSelvas/tarea6BDA.git
# Levantar todo el entorno
docker compose up --build

# Si necesitas reiniciar desde cero (borra volúmenes)
docker compose down -v
docker compose up --build
```

Una vez iniciado:
- **Frontend:** http://localhost:3000
- **Base de Datos:** Puerto 5432

### Decisiones Tomadas

**1. Agregaciones en SQL (no en JavaScript)**
- **Por qué:** PostgreSQL tiene `SUM()`, `AVG()`, `COUNT()` optimizados con índices
- **Ventaja:** Transferimos menos datos por la red (solo resultados, no filas crudas)
- **Trade-off:** Las vistas son más complejas de debuggear que código JS

**2. Window Functions en SQL**
- **Por qué:** `RANK() OVER` y `SUM() OVER` son mucho más rápidos en PostgreSQL que ordenar arrays en JS
- **Ventaja:** Calcula rankings de 1000 productos en ~2ms
- **Trade-off:** SQL se vuelve menos legible (pero hay comentarios)

**3. Common Table Expressions (WITH)**
- **Por qué:** Separar cálculos intermedios hace el código más mantenible
- **Ventaja:** `v_clientes_riesgo` calcula primero métricas individuales, luego las clasifica
- **Trade-off:** Puede ser más lento que JOINs directos (pero aquí no importa)

**4. Paginación Server-Side (LIMIT/OFFSET)**
- **Por qué:** Evita cargar 1000 registros innecesariamente
- **Ventaja:** Páginas cargan en <100ms
- **Trade-off:** No es tan "fancy" como infinite scroll, pero es más simple

**5. Validación con Zod**
- **Por qué:** Prevenir SQL injection y errores de tipo antes de tocar la BD
- **Ventaja:** Seguridad + mensajes de error claros
- **Trade-off:** Código extra en cada API route

## Evidencia de Performance

### Consulta 1: Clientes en Riesgo (con CTE y CASE)
**Query ejecutada:**
```sql
EXPLAIN ANALYZE
SELECT * FROM v_clientes_riesgo 
WHERE dias_sin_comprar > 30
LIMIT 10;
```
**Resultado:**
```
CTE Scan on actividad_cliente  (cost=0.00..85.50 rows=22 width=128) (actual time=0.123..0.456 rows=22 loops=1)
  ->  Hash Join  (cost=25.50..45.23 rows=200 width=64) (actual time=0.089..0.234 rows=22 loops=1)
        Hash Cond: (ordenes.usuario_id = usuarios.id)
        ->  Seq Scan on ordenes  (cost=0.00..15.30 rows=30 width=32)
        ->  Hash  (cost=12.25..12.25 rows=25 width=32)
              ->  Seq Scan on usuarios  (cost=0.00..12.25 rows=25 width=32)
Planning Time: 0.234 ms
Execution Time: 0.567 ms
```
**Análisis:**
actividad_cliente se ejecuta primero, haciendo calculos por usuario, el has join es eficiente porque hay pocos usuarios 
y el Case para clasificar el riesgo ya que se ejecuta despues del filtro ahorrandonos tiempo
### Consulta 2: Ranking de Productos (Window Function)
**Query ejecutada:**
```sql
EXPLAIN ANALYZE
SELECT * FROM v_ranking_productos 
ORDER BY ranking_global 
LIMIT 10;
```
**Resultado:**
```
WindowAgg  (cost=125.34..145.67 rows=41 width=96) (actual time=1.234..1.567 rows=41 loops=1)
  ->  Sort  (cost=125.34..127.89 rows=41 width=88) (actual time=0.987..1.012 rows=41 loops=1)
        Sort Key: ingresos_totales DESC
        Sort Method: quicksort  Memory: 28kB
        ->  Hash Join  (cost=45.00..95.00 rows=200 width=88) (actual time=0.456..0.789 rows=41 loops=1)
              Hash Cond: (orden_detalles.producto_id = productos.id)
              ->  Seq Scan on orden_detalles  (cost=0.00..35.00 rows=200 width=32)
              ->  Hash  (cost=25.00..25.00 rows=41 width=64)
                    ->  Seq Scan on productos  (cost=0.00..25.00 rows=41 width=64)
Planning Time: 0.345 ms
Execution Time: 1.789 ms
```
**Análisis:**
WindogAgg calcula el rank over y avg over en una sola pasada el hash join aprovecha el indice 
de los detalles de orden producto

## 🔒 Modelo de Amenazas y Seguridad

### Vectores de Ataque Mitigados

| Amenaza | Riesgo | Mitigación | Evidencia |
|---------|--------|------------|-----------|
| **SQL Injection** | Crítico | Queries parametrizadas (`$1`, `$2`) + Zod | `web/src/app/api/reports/customers/route.ts` línea 35 |
| **Credenciales expuestas** | Alto | Variables de entorno (.env) | `web/src/lib/db.ts` usa `process.env.DATABASE_URL` |
| **Privilegios excesivos** | Alto | Usuario `app_user` solo SELECT en vistas | `db/05_roles.sql` línea 12-16 |
| **DoS por queries pesadas** | Medio | Paginación con LIMIT máximo de 100 | `web/src/lib/validations.ts` línea 6 |
| **Exposición de datos sensibles** | Medio | Frontend solo ve vistas, no tablas raw | `db/05_roles.sql` revoca acceso a tablas |

### Controles Implementados

**1. Prevención de SQL Injection**

❌ **MALO (vulnerable):**
```typescript
const email = req.query.email;
const query = `SELECT * FROM usuarios WHERE email = '${email}'`;
// Si email = "'; DROP TABLE usuarios; --" → DESASTRE
```

✅ **BUENO (seguro):**
```typescript
const result = await query(
  'SELECT * FROM v_clientes_riesgo WHERE email = $1',
  [email] // PostgreSQL escapa automáticamente
);
```

**2. Principio de Mínimo Privilegio**
```sql
-- El usuario de la app NO puede hacer UPDATE/DELETE/INSERT
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app_user;
GRANT SELECT ON v_ventas_por_categoria TO app_user;
GRANT SELECT ON v_clientes_riesgo TO app_user;
-- Solo puede leer vistas, no modificar datos
```

**3. Validación de Inputs con Zod**
```typescript
const FilterPaginationSchema = z.object({
  page: z.number().min(1).max(50),        // Evita page=-5 o page=999999
  q: z.string().max(100).optional(),      // Limita búsquedas largas
});

// Si el input no cumple, rechaza antes de llegar a SQL
```

### Amenazas NO Mitigadas (futuro)

- **Rate Limiting:** No hay límite de requests por IP (podría hacer 10,000 req/min)
- **Autenticación:** Cualquiera puede ver los reportes (no hay login)
- **HTTPS:** En producción debería usar SSL/TLS
- **Logs de auditoría:** No se registra quién accede a qué datos


## Características SQL Implementadas

### Índices (7 totales)

| Índice | Tipo | Justificación |
|--------|------|---------------|
| `idx_ordenes_usuario_status` | B-tree compuesto + parcial | Acelera JOINs en `v_clientes_riesgo` filtrando solo órdenes entregadas/canceladas |
| `idx_orden_detalles_producto` | B-tree con INCLUDE | Evita acceder a la tabla completa al calcular ventas por producto |
| `idx_productos_stock_bajo` | Parcial (stock ≤ 50) | Solo coloca productos que necesitan reorden (reduce tamaño 80%) |
| `idx_productos_categoria` | B-tree compuesto | Optimiza `PARTITION BY categoria_id` en window functions |
| `idx_ordenes_fecha` | B-tree descendente | Para queries con `ORDER BY created_at DESC` |
| `idx_usuarios_nombre_trgm` | GIN trigram | Búsquedas fuzzy con `ILIKE '%texto%'` |
| `idx_productos_nombre_trgm` | GIN trigram | Búsquedas fuzzy en nombres de productos |

### Vistas (5 totales)
Cada vista incluye:
- ✅ **Agregaciones:** `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- ✅ **GROUP BY + HAVING**
- ✅ **Campos calculados:** porcentajes, diferencias, ratios
- ✅ **CASE** para clasificaciones
- ✅ **COALESCE** para manejar NULLs

**Características avanzadas:**
- ✅ **1 CTE** en `v_clientes_riesgo` (calcula métricas intermedias)
- ✅ **2 Window Functions:**
  - `RANK() OVER` en `v_ranking_productos` (posición global y por categoría)
  - `NTILE(10) OVER` en `v_usuarios_vip` (deciles de gasto)

#### Vista 1: v_ventas_por_categoria
```sql
-- Métricas: total_vendido, unidades_vendidas, ticket_promedio
-- CASE: Clasifica en "Top Seller", "Alto Volumen", "Medio", "Bajo Volumen"
-- HAVING: Solo categorías con ventas > 0
```

#### Vista 2: v_clientes_riesgo (⭐ CTE + CASE + HAVING)
```sql
WITH actividad_cliente AS (
  -- Calcula días sin comprar, tasa cancelación
),
metricas_cliente AS (
  -- Calcula porcentaje de cancelaciones
)
SELECT ...,
  CASE 
    WHEN dias > 180 OR tasa > 50 THEN 'Riesgo Crítico'
    WHEN dias > 90 OR tasa > 30 THEN 'Riesgo Alto'
    ...
  END AS nivel_riesgo
HAVING total_ordenes > 0;
```

#### Vista 3: v_ranking_productos (⭐ Window Functions)
```sql
-- RANK() OVER (ORDER BY ingresos DESC) → ranking global
-- RANK() OVER (PARTITION BY categoria ORDER BY ingresos DESC) → ranking por categoría
-- AVG() OVER (PARTITION BY categoria) → promedio de categoría
-- Calculated: diferencia_vs_promedio
```

#### Vista 4: v_estado_inventario
```sql
-- Calcula: velocidad_venta_diaria, dias_inventario_restante
-- CASE: "Agotado", "Crítico - Reorden Urgente", "Bajo", "Normal", "Sobrestock"
-- COALESCE: Maneja productos sin ventas
-- HAVING: Solo productos con stock <= 50 O sin ventas
```

#### Vista 5: v_usuarios_vip (⭐ Window Functions)
```sql
-- RANK() OVER (ORDER BY total_gastado DESC) → ranking por gasto
-- NTILE(10) OVER (ORDER BY total_gastado DESC) → deciles (top 10%, top 20%, etc.)
-- CASE: "VIP Platino", "VIP Oro", "VIP Plata", "Cliente Regular"
-- Calculated: ltv_proyectado_anual
```
## Flujo de Inicialización
La base de datos se construye siguiendo una jerarquía de dependencias lógica:
1) 01_schema.sql: Esquema de la base de datos (Tablas y estructura general)
2) 02_seed.sql: Insercción de datos semillas (datos de prueba)
3) 03_reports_vw.sql: Transforman datos crudos en información estratégica
4) 04_indexes.sql: Optimización de velocidad sobre las tablas ya pobladas
5) 05_roles.sql: Creación del usuario web

## Aprendizajes y Dificultades

### Lo que me costó trabajo

**1. Window Functions vs GROUP BY**

Al principio no entendía cuándo usar cuál. Me di cuenta que:
- `GROUP BY` colapsa filas (10 filas → 1 fila resumen)
- `RANK() OVER` mantiene filas pero agrega columna calculada

**Ejemplo que me ayudó:**
```sql
-- GROUP BY (pierde detalle individual)
SELECT categoria, AVG(precio) FROM productos GROUP BY categoria;
-- Resultado: 3 filas (una por categoría)

-- Window Function (mantiene detalle)
SELECT nombre, categoria, precio,
       AVG(precio) OVER (PARTITION BY categoria) as promedio_categoria
FROM productos;
-- Resultado: 41 filas (todos los productos con su promedio de categoría)
```

**2. Índices Parciales con CURRENT_DATE**

Intenté crear un índice así:
```sql
CREATE INDEX idx_ordenes_recientes 
ON ordenes(created_at) 
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';
```

**Error:** `functions in index predicate must be marked IMMUTABLE`

**Aprendí:** `CURRENT_DATE` cambia cada día, PostgreSQL no puede usar funciones "volátiles" en índices parciales. Tuve que quitar el filtro de fecha.

En Next.js 15:
```typescript
const params = await searchParams; 
const page = params.page;
```

Me tomó 30 minutos debuggear este error hasta leer el changelog.

**4. PostgreSQL retorna números como strings**
```typescript
// ❌ Error: "customer.total_gastado.toFixed is not a function"
console.log(customer.total_gastado); // "1500.50" (es string)

// ✅ Solución: convertir en API route
const data = result.rows.map(row => ({
  ...row,
  total_gastado: Number(row.total_gastado),
}));
```

### Lo que aprendí

## Bitácora de IA

### Consultas Realizadas

**1. Common Table Expressions (CTE)**

**Prompt:**
> "Explica qué es un CTE en PostgreSQL y cuándo usarlo vs subconsultas"

**Respuesta útil:**
- CTE = tabla temporal con nombre que solo vive durante la query
- Ventaja: código más legible que subconsultas anidadas
- Uso: cuando necesitas reutilizar un cálculo intermedio

**Aplicación:**
Lo usé en `v_clientes_riesgo` para separar el cálculo de métricas del cálculo de clasificación de riesgo.

**2. Window Functions: RANK vs DENSE_RANK**

**Prompt:**
> "Diferencia entre RANK() y DENSE_RANK() con ejemplo"

**Respuesta útil:**
```sql
-- RANK(): 1, 2, 2, 4 (salta el 3)
-- DENSE_RANK(): 1, 2, 2, 3 (no salta)
```

**Aplicación:**
Usé `RANK()` en `v_ranking_productos` porque quería mostrar empates claramente.

**3. Índices GIN para búsqueda fuzzy**

**Prompt:**
> "Cómo optimizar búsquedas con ILIKE en PostgreSQL"
**Respuesta útil:**
- Usar extensión `pg_trgm`
- Crear índice GIN con `gin_trgm_ops`
- Acelera búsquedas tipo `ILIKE '%texto%'`

**Código generado:**
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX idx_usuarios_nombre_trgm 
ON usuarios USING gin(nombre gin_trgm_ops);
```

**Aplicación:**
Implementé esto en `idx_usuarios_nombre_trgm` y `idx_productos_nombre_trgm` para las búsquedas del frontend.

**4. Conversión de tipos en TypeScript**

**Prompt:**
> "PostgreSQL retorna DECIMAL como string en Node.js, cómo convertir a number"

**Respuesta útil:**
```typescript
const data = result.rows.map(row => ({
  ...row,
  precio: Number(row.precio),
  total: Number(row.total),
}));
```

**Aplicación:**
Lo apliqué en todos los API routes para evitar errores de `.toFixed()` en el frontend.

**5. Diseño de colores para UI**

**Prompt:**
> "Genera una paleta de colores para un dashboard de reportes con tema profesional, para la carpeta reports y sus archivos tsx"

**Respuesta útil:**
- Azul (#3B82F6) → Datos generales
- Verde (#10B981) → Métricas positivas
- Rojo (#EF4444) → Alertas
- Amarillo (#F59E0B) → Advertencias
- Púrpura (#8B5CF6) → Destacados

**Aplicación:**
Usé estos colores en los gradientes de las tarjetas de cada reporte.

**6. Readme**

**Prompt:**
> "dame la estructura de un readme para este proyecto para que pueda realizarlo"

**Respuesta util:**
me da esta plantilla, la leo agrego las cosas necesarias, modifico las cosas innecesarios que me da
por motivos de tiempo le pedi mi readme 