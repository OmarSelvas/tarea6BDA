CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_ordenes_usuario_status 
ON ordenes(usuario_id, status, created_at DESC)
WHERE status IN ('entregado', 'cancelado');

CREATE INDEX IF NOT EXISTS idx_orden_detalles_producto 
ON orden_detalles(producto_id, orden_id)
INCLUDE (cantidad, subtotal);

CREATE INDEX IF NOT EXISTS idx_productos_stock_bajo 
ON productos(stock, categoria_id)
WHERE activo = TRUE AND stock <= 50;

CREATE INDEX IF NOT EXISTS idx_productos_categoria 
ON productos(categoria_id, id)
WHERE activo = TRUE;

CREATE INDEX IF NOT EXISTS idx_ordenes_recientes 
ON ordenes(created_at DESC, id)
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

CREATE INDEX IF NOT EXISTS idx_usuarios_nombre_trgm 
ON usuarios USING gin(nombre gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_productos_nombre_trgm 
ON productos USING gin(nombre gin_trgm_ops);