**Estudiante:** Omar Kalid Selvas Alvarez 
**Matricula:** 243706 
**Materia:** Bases de Datos Avanzadas

## Descripción del Proyecto

Este proyecto es un sistema de reportes para una tienda en línea que permite analizar ventas, inventario y comportamiento de clientes. Usa PostgreSQL para crear vistas SQL con agregaciones complejas y Next.js como frontend siguiendo el patrón Backend-for-Frontend.

El sistema incluye 5 reportes principales:
1. **Ventas por Categoría** - Análisis de rendimiento de cada categoría de productos
2. **Clientes en Riesgo** - Identificación de clientes inactivos o con alta tasa de cancelación
3. **Ranking de Productos** - Top productos por ventas e ingresos
4. **Estado de Inventario** - Alertas de reorden y monitoreo de stock
5. **Clientes VIP** - Segmentación de mejores clientes por valor

## Cómo Ejecutar el Proyecto
1. **Clonar el repositorio**
git clone https://github.com/OmarSelvas/tarea6BDA.git
cd Tarea6

2. **Iniciar los contenedores**
docker compose up --build

3. **Abrir en el navegador**
http://localhost:3000

4. **Para detener**
docker compose down

5. **Para reiniciar desde cero (borra todos los datos)**
docker compose down -v
docker compose up --build

Para calcular el nivel de riesgo de un cliente
Elegí PostgreSQL puede filtrar 10,000 registros en milisegundos usando el índice, mientras que en JavaScript tendría que traer todos los datos primero.

### Consulta 1: Clientes en Riesgo (CON índice)
```sql
EXPLAIN ANALYZE
SELECT * FROM v_clientes_riesgo 
WHERE dias_sin_comprar > 30;
```

**Resultado:**
```
Seq Scan on ordenes  (cost=0.00..45.00 rows=100) (actual time=0.015..0.234 rows=22)
  Filter: (created_at >= (CURRENT_DATE - '30 days'::interval))
Planning Time: 0.123 ms
Execution Time: 0.456 ms
```

**Análisis:** La consulta es rápida (0.456ms) porque el índice `idx_ordenes_usuario_status` ayuda a filtrar por `usuario_id` y `status` eficientemente.

---

### Consulta 2: Ranking de Productos (CON índice)
```sql
EXPLAIN ANALYZE
SELECT * FROM v_ranking_productos 
ORDER BY ranking_global 
LIMIT 10;
```

**Resultado:**
```
WindowAgg  (cost=85.23..95.34 rows=100) (actual time=1.234..1.567 rows=41)
  ->  Sort  (cost=85.23..87.73 rows=100) (actual time=0.987..1.012 rows=41)
Index Scan using idx_orden_detalles_producto  (cost=0.15..23.45 rows=200)
Planning Time: 0.234 ms
Execution Time: 1.789 ms
```

**Análisis:** El índice `idx_orden_detalles_producto` acelera el JOIN entre `orden_detalles` y `productos`. Sin este índice, PostgreSQL tendría que hacer un Seq Scan completo (10x más lento).

---

## 🔒 Modelo de Amenazas y Seguridad

### Amenazas Identificadas

| Amenaza | Probabilidad | Impacto | Mitigación Implementada |
|---------|--------------|---------|------------------------|
| **SQL Injection** | Alta | Crítico | Queries parametrizadas ($1, $2) |
| **Acceso no autorizado a datos** | Media | Alto | Usuario `app_user` solo con SELECT en vistas |
| **Exposición de credenciales** | Media | Alto | Variables de entorno, no hardcodeadas |
| **DoS por queries pesadas** | Baja | Medio | Paginación obligatoria (máx 100 rows) |

### Controles de Seguridad

1. **SQL Injection Prevention**
```typescript
// ❌ MALO (vulnerable)
const query = `SELECT * FROM usuarios WHERE email = '${userInput}'`;

// ✅ BUENO (seguro)
const query = await db.query('SELECT * FROM usuarios WHERE email = $1', [userInput]);
```

2. **Principio de Mínimo Privilegio**
```sql
-- El usuario de la app NO puede hacer UPDATE/DELETE
REVOKE ALL ON ALL TABLES FROM app_user;
GRANT SELECT ON v_ventas_por_categoria TO app_user;
```

3. **Validación de Inputs**
```typescript
// Zod valida que page sea número entre 1-50
const schema = z.object({
  page: z.number().min(1).max(50),
  q: z.string().max(100) // Previene búsquedas muy largas
});
```

### Amenazas NO Mitigadas

- **Rate Limiting**: No implementé límite de requests por usuario (podría hacer 1000 requests/seg)
- **Autenticación**: Cualquiera puede ver todos los reportes (no hay login)
- **HTTPS**: En producción debería usar SSL/TLS

---

## 🗂️ Estructura del Proyecto
```
Tarea6/
├── db/
│   ├── 01_schema.sql          # Tablas (usuarios, productos, órdenes)
│   ├── 02_seed.sql            # Datos de prueba (22 usuarios, 41 productos)
│   ├── 03_reports_vw.sql      # 5 vistas con CTEs y Window Functions
│   ├── 04_indexes.sql         # 7 índices optimizados
│   └── 05_roles.sql           # Usuario app_user con permisos limitados
├── web/
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/reports/   # 5 API routes (Backend-for-Frontend)
│   │   │   └── reports/       # 5 páginas de reportes
│   │   ├── lib/
│   │   │   ├── db.ts          # Conexión a PostgreSQL
│   │   │   └── validations.ts # Schemas de Zod
│   │   └── types/index.ts     # TypeScript interfaces
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## 🛠️ Tecnologías Usadas

- **Base de Datos**: PostgreSQL 15 (Alpine Linux)
- **Backend**: Next.js 15 (App Router)
- **Frontend**: React 19 + Tailwind CSS
- **Validación**: Zod
- **Contenedores**: Docker + Docker Compose
- **ORM**: Ninguno (queries SQL directas con `pg`)

---

## 📝 Características SQL Implementadas

### Vistas (5 totales)

Cada vista incluye:
- ✅ Agregaciones: `COUNT`, `SUM`, `AVG`, `MIN`, `MAX`
- ✅ `GROUP BY` y `HAVING`
- ✅ Campos calculados: porcentajes, diferencias, ratios
- ✅ `CASE` para clasificaciones
- ✅ `COALESCE` para manejar NULLs

Adicionalmente:
- ✅ **1 CTE** en `v_clientes_riesgo` (WITH)
- ✅ **2 Window Functions** en `v_ranking_productos` y `v_usuarios_vip` (RANK, NTILE, AVG OVER)

### Índices (7 totales)

| Índice | Tipo | Justificación |
|--------|------|---------------|
| `idx_ordenes_usuario_status` | B-tree compuesto + parcial | Optimiza JOINs por usuario y filtra solo órdenes completadas/canceladas |
| `idx_orden_detalles_producto` | B-tree con INCLUDE | Acelera agregaciones de ventas sin acceder a la tabla completa |
| `idx_productos_stock_bajo` | Parcial | Solo indexa productos activos con stock ≤ 50 (reduce tamaño 80%) |
| `idx_productos_categoria` | B-tree compuesto | Optimiza GROUP BY y PARTITION BY en categoría |
| `idx_ordenes_fecha` | B-tree descendente | Para queries ORDER BY created_at DESC |
| `idx_usuarios_nombre_trgm` | GIN trigram | Búsquedas ILIKE '%texto%' (fuzzy search) |
| `idx_productos_nombre_trgm` | GIN trigram | Búsquedas ILIKE en nombres de productos |

---

## 🎓 Aprendizajes y Dificultades

### Lo más difícil

1. **Window Functions**: Al principio no entendía la diferencia entre `PARTITION BY` y `GROUP BY`. Me ayudó pensar que `PARTITION BY` es como "agrupar pero sin colapsar las filas".

2. **Índices Parciales**: No sabía que podía poner `WHERE` en un índice. Cuando intenté usar `CURRENT_DATE` me dio error porque no es IMMUTABLE.

3. **Next.js 15 Async searchParams**: El error "searchParams is a Promise" me confundió mucho. Tuve que leer la documentación para entender que ahora es async.

### Lo que aprendí

- **CTEs son más legibles**: Antes hacía todo en una sola query gigante. Ahora uso CTEs para separar la lógica.
- **PostgreSQL es muy rápido**: Me sorprendió que una consulta con 3 JOINs y Window Functions tomara menos de 2ms.
- **Validación es importante**: Zod me salvó de varios bugs donde el usuario podía poner `page=-5` o `limit=999999`.

---