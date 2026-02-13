-- VISTA 1: Análisis de Ventas por Categoria
CREATE OR REPLACE VIEW v_ventas_por_categoria AS
SELECT 
    c.id AS categoria_id,
    c.nombre AS categoria,
    c.descripcion AS descripcion_categoria,
    COUNT(DISTINCT p.id) AS total_productos,
    COUNT(DISTINCT od.orden_id) AS ordenes_con_categoria,
    SUM(od.cantidad) AS unidades_vendidas,
    ROUND(SUM(od.subtotal), 2) AS total_vendido,
    ROUND(AVG(p.precio), 2) AS precio_promedio,
    MAX(p.precio) AS producto_mas_caro,
    MIN(p.precio) AS producto_mas_barato,
    ROUND(
        SUM(od.subtotal) / NULLIF(COUNT(DISTINCT od.orden_id), 0),
        2
    ) AS ticket_promedio,
    CASE 
        WHEN SUM(od.subtotal) >= 5000 THEN 'Top Seller'
        WHEN SUM(od.subtotal) >= 2000 THEN 'Alto Volumen'
        WHEN SUM(od.subtotal) >= 500 THEN 'Medio'
        ELSE 'Bajo Volumen'
    END AS clasificacion_ventas
FROM categorias c
LEFT JOIN productos p ON c.id = p.categoria_id
LEFT JOIN orden_detalles od ON p.id = od.producto_id
GROUP BY c.id, c.nombre, c.descripcion
HAVING COALESCE(SUM(od.subtotal), 0) > 0
ORDER BY total_vendido DESC NULLS LAST;

COMMENT ON VIEW v_ventas_por_categoria IS 
'Análisis de ventas por categoría con agregaciones y clasificación';

-- VISTA 2: Clientes en Riesgo de Abandono 
CREATE OR REPLACE VIEW v_clientes_riesgo AS
WITH actividad_cliente AS (
    SELECT 
        u.id AS usuario_id,
        COUNT(o.id) AS total_ordenes,
        SUM(CASE WHEN o.status = 'cancelado' THEN 1 ELSE 0 END) AS ordenes_canceladas,
        SUM(CASE WHEN o.status = 'entregado' THEN 1 ELSE 0 END) AS ordenes_completadas,
        SUM(o.total) AS total_gastado,
        MAX(o.created_at) AS ultima_compra,
        CURRENT_DATE - MAX(o.created_at)::DATE AS dias_sin_comprar
    FROM usuarios u
    LEFT JOIN ordenes o ON u.id = o.usuario_id
    GROUP BY u.id
),
metricas_cliente AS (
    SELECT 
        usuario_id,
        total_ordenes,
        ordenes_canceladas,
        ordenes_completadas,
        total_gastado,
        ultima_compra,
        dias_sin_comprar,
        ROUND(
            (ordenes_canceladas::DECIMAL / NULLIF(total_ordenes, 0)) * 100,
            2
        ) AS tasa_cancelacion
    FROM actividad_cliente
)
SELECT 
    u.id AS usuario_id,
    u.nombre,
    u.email,
    COALESCE(m.total_ordenes, 0) AS total_ordenes,
    COALESCE(m.ordenes_canceladas, 0) AS ordenes_canceladas,
    COALESCE(m.ordenes_completadas, 0) AS ordenes_completadas,
    COALESCE(m.total_gastado, 0) AS total_gastado,
    COALESCE(m.dias_sin_comprar, 9999) AS dias_sin_comprar,
    COALESCE(m.tasa_cancelacion, 0) AS tasa_cancelacion,
    CASE 
        WHEN m.dias_sin_comprar > 180 OR m.tasa_cancelacion > 50 THEN 'Riesgo Crítico'
        WHEN m.dias_sin_comprar > 90 OR m.tasa_cancelacion > 30 THEN 'Riesgo Alto'
        WHEN m.dias_sin_comprar > 30 OR m.tasa_cancelacion > 15 THEN 'Riesgo Moderado'
        ELSE 'Cliente Activo'
    END AS nivel_riesgo,
    ROUND(
        COALESCE(m.total_gastado, 0) / NULLIF(COALESCE(m.total_ordenes, 1), 0) * 
        GREATEST(m.dias_sin_comprar / 30, 1),
        2
    ) AS valor_potencial_perdido
FROM usuarios u
LEFT JOIN metricas_cliente m ON u.id = m.usuario_id
WHERE m.dias_sin_comprar > 30 OR m.ordenes_canceladas > 1
GROUP BY u.id, u.nombre, u.email, m.total_ordenes, m.ordenes_canceladas, 
         m.ordenes_completadas, m.total_gastado, m.dias_sin_comprar, m.tasa_cancelacion
HAVING COALESCE(m.dias_sin_comprar, 9999) > 30 OR COALESCE(m.ordenes_canceladas, 0) > 1
ORDER BY nivel_riesgo, dias_sin_comprar DESC;

COMMENT ON VIEW v_clientes_riesgo IS 
'Clientes en riesgo de abandono usando CTE y clasificación por comportamiento';

-- VISTA 3: Ranking de Productos 
CREATE OR REPLACE VIEW v_ranking_productos AS
WITH ventas_producto AS (
    SELECT 
        p.id AS producto_id,
        p.codigo,
        p.nombre,
        p.precio,
        p.stock,
        c.nombre AS categoria,
        c.id AS categoria_id,
        COALESCE(SUM(od.cantidad), 0) AS unidades_vendidas,
        COALESCE(SUM(od.subtotal), 0) AS ingresos_totales,
        COUNT(DISTINCT od.orden_id) AS ordenes_con_producto
    FROM productos p
    JOIN categorias c ON p.categoria_id = c.id
    LEFT JOIN orden_detalles od ON p.id = od.producto_id
    GROUP BY p.id, p.codigo, p.nombre, p.precio, p.stock, c.nombre, c.id
)
SELECT 
    producto_id,
    codigo,
    nombre,
    categoria,
    precio,
    stock,
    unidades_vendidas,
    ROUND(ingresos_totales, 2) AS ingresos_totales,
    ordenes_con_producto,
    RANK() OVER (
        ORDER BY ingresos_totales DESC
    ) AS ranking_global,
    RANK() OVER (
        PARTITION BY categoria_id 
        ORDER BY ingresos_totales DESC
    ) AS ranking_categoria,
    ROUND(
        AVG(ingresos_totales) OVER (PARTITION BY categoria_id),
        2
    ) AS promedio_categoria,
    ROUND(
        ingresos_totales - AVG(ingresos_totales) OVER (PARTITION BY categoria_id),
        2
    ) AS diferencia_vs_promedio,
    CASE 
        WHEN ingresos_totales >= 5000 THEN 'Bestseller'
        WHEN ingresos_totales >= 2000 THEN 'Alto Rendimiento'
        WHEN ingresos_totales >= 500 THEN 'Rendimiento Medio'
        WHEN ingresos_totales > 0 THEN 'Bajo Rendimiento'
        ELSE 'Sin Ventas'
    END AS clasificacion_producto
FROM ventas_producto
ORDER BY ranking_global;

COMMENT ON VIEW v_ranking_productos IS 
'Ranking de productos con window functions para comparación global y por categoría';

-- VISTA 4: Estado de Inventario y Reorden

CREATE OR REPLACE VIEW v_estado_inventario AS
WITH ventas_recientes AS (
    SELECT 
        od.producto_id,
        COUNT(DISTINCT od.orden_id) AS ordenes_30dias,
        SUM(od.cantidad) AS unidades_vendidas_30dias,
        ROUND(AVG(od.cantidad), 2) AS promedio_por_orden
    FROM orden_detalles od
    JOIN ordenes o ON od.orden_id = o.id
    WHERE o.created_at >= CURRENT_DATE - INTERVAL '30 days'
    GROUP BY od.producto_id
)
SELECT 
    p.id AS producto_id,
    p.codigo,
    p.nombre,
    c.nombre AS categoria,
    p.precio,
    p.stock AS stock_actual,
    COALESCE(vr.unidades_vendidas_30dias, 0) AS unidades_vendidas_30dias,
    COALESCE(vr.ordenes_30dias, 0) AS ordenes_30dias,
    ROUND(
        COALESCE(vr.unidades_vendidas_30dias, 0) / 30.0,
        2
    ) AS velocidad_venta_diaria,
    CASE 
        WHEN COALESCE(vr.unidades_vendidas_30dias, 0) > 0 THEN
            ROUND(p.stock / (vr.unidades_vendidas_30dias / 30.0), 0)
        ELSE 9999
    END AS dias_inventario_restante,
    CASE 
        WHEN p.stock = 0 THEN 'Agotado'
        WHEN p.stock <= 10 THEN 'Crítico - Reorden Urgente'
        WHEN p.stock <= 30 THEN 'Bajo - Reorden Próximo'
        WHEN p.stock <= 100 THEN 'Normal'
        ELSE 'Sobrestock'
    END AS estado_stock,
    COALESCE(
        CEILING((vr.unidades_vendidas_30dias / 30.0) * 14),
        10
    ) AS punto_reorden_sugerido
FROM productos p
JOIN categorias c ON p.categoria_id = c.id
LEFT JOIN ventas_recientes vr ON p.id = vr.producto_id
WHERE p.activo = TRUE
GROUP BY p.id, p.codigo, p.nombre, c.nombre, p.precio, p.stock, 
         vr.unidades_vendidas_30dias, vr.ordenes_30dias
HAVING p.stock <= 50 OR COALESCE(vr.unidades_vendidas_30dias, 0) = 0
ORDER BY estado_stock, stock_actual ASC;

COMMENT ON VIEW v_estado_inventario IS 
'Monitoreo de inventario con alertas de reorden y proyección de días restantes';

-- VISTA 5: Performance de Usuarios VIP 
CREATE OR REPLACE VIEW v_usuarios_vip AS
WITH metricas_usuario AS (
    SELECT 
        u.id AS usuario_id,
        u.nombre,
        u.email,
        COUNT(DISTINCT o.id) AS total_ordenes,
        SUM(CASE WHEN o.status = 'entregado' THEN 1 ELSE 0 END) AS ordenes_completadas,
        SUM(CASE WHEN o.status = 'cancelado' THEN 1 ELSE 0 END) AS ordenes_canceladas,
        SUM(o.total) AS total_gastado,
        ROUND(AVG(o.total), 2) AS ticket_promedio,
        MAX(o.created_at) AS ultima_compra,
        MIN(o.created_at) AS primera_compra,
        CURRENT_DATE - MIN(o.created_at)::DATE AS dias_como_cliente
    FROM usuarios u
    JOIN ordenes o ON u.id = o.usuario_id
    GROUP BY u.id, u.nombre, u.email
)
SELECT 
    usuario_id,
    nombre,
    email,
    total_ordenes,
    ordenes_completadas,
    ordenes_canceladas,
    ROUND(total_gastado, 2) AS total_gastado,
    ticket_promedio,
    ultima_compra,
    dias_como_cliente,
    RANK() OVER (ORDER BY total_gastado DESC) AS ranking_por_gasto,
    NTILE(10) OVER (ORDER BY total_gastado DESC) AS decil_gasto,
    ROUND(
        (ordenes_completadas::DECIMAL / NULLIF(dias_como_cliente / 30.0, 0)),
        2
    ) AS frecuencia_mensual,
    CASE 
        WHEN total_gastado >= 2000 AND ordenes_completadas >= 5 THEN 'VIP Platino'
        WHEN total_gastado >= 1000 AND ordenes_completadas >= 3 THEN 'VIP Oro'
        WHEN total_gastado >= 500 OR ordenes_completadas >= 2 THEN 'VIP Plata'
        ELSE 'Cliente Regular'
    END AS segmento_cliente,
    ROUND(
        (total_gastado / NULLIF(dias_como_cliente, 0)) * 365,
        2
    ) AS ltv_proyectado_anual
FROM metricas_usuario
WHERE ordenes_completadas > 1
GROUP BY usuario_id, nombre, email, total_ordenes, ordenes_completadas, 
         ordenes_canceladas, total_gastado, ticket_promedio, ultima_compra, 
         primera_compra, dias_como_cliente
HAVING ordenes_completadas > 1
ORDER BY ranking_por_gasto;

COMMENT ON VIEW v_usuarios_vip IS 
'Segmentación de clientes VIP con ranking y proyección de lifetime value';
