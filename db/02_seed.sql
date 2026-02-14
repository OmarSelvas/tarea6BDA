-- ORDEN DE INSERCIÓN:
-- 1. Catálogos (sin dependencias)
-- 2. Entidades principales
-- 3. Relaciones/transacciones
-- ============================================

-- ============================================
-- 1. CATÁLOGOS
-- ============================================

INSERT INTO categorias (nombre, descripcion) VALUES
    -- Originales (1-5)
    ('Electrónica', 'Dispositivos electrónicos y accesorios'),
    ('Ropa', 'Vestimenta y accesorios de moda'),
    ('Hogar', 'Artículos para el hogar y decoración'),
    ('Deportes', 'Equipamiento y ropa deportiva'),
    ('Libros', 'Libros físicos y digitales'),
    -- Nuevos (6-20)
    ('Juguetes', 'Juegos de mesa, muñecos y construcción'),
    ('Automotriz', 'Accesorios y cuidado para vehículos'),
    ('Belleza', 'Cosméticos, cuidado de la piel y perfumes'),
    ('Jardinería', 'Herramientas, plantas y exteriores'),
    ('Mascotas', 'Alimentos y accesorios para animales'),
    ('Música', 'Instrumentos musicales y equipos de audio'),
    ('Videojuegos', 'Consolas, juegos y accesorios gaming'),
    ('Joyería', 'Relojes, collares y anillos'),
    ('Salud', 'Suplementos, primeros auxilios y cuidado'),
    ('Herramientas', 'Ferretería y equipamiento de construcción'),
    ('Oficina', 'Papelería y mobiliario corporativo'),
    ('Bebés', 'Ropa, alimentación y cuidado infantil'),
    ('Cine y TV', 'Películas, series y coleccionables'),
    ('Viajes', 'Maletas y accesorios de turismo'),
    ('Alimentos', 'Gourmet, snacks y bebidas no perecederos');

-- ============================================
-- 2. ENTIDADES PRINCIPALES
-- ============================================

-- Usuarios (Total 25)
INSERT INTO usuarios (email, nombre, password_hash, created_at) VALUES
    -- Originales (1-6)
    ('ada@example.com', 'Ada Lovelace', 'hash_placeholder_1', NOW() - INTERVAL '365 days'),
    ('alan@example.com', 'Alan Turing', 'hash_placeholder_2', NOW() - INTERVAL '320 days'),
    ('grace@example.com', 'Grace Hopper', 'hash_placeholder_3', NOW() - INTERVAL '280 days'),
    ('linus@example.com', 'Linus Torvalds', 'hash_placeholder_4', NOW() - INTERVAL '250 days'),
    ('margaret@example.com', 'Margaret Hamilton', 'hash_placeholder_5', NOW() - INTERVAL '200 days'),
    ('donald@example.com', 'Donald Knuth', 'hash_placeholder_6', NOW() - INTERVAL '180 days'),
    -- Nuevos (7-25)
    ('nikola@example.com', 'Nikola Tesla', 'hash_placeholder_7', NOW() - INTERVAL '150 days'),
    ('marie@example.com', 'Marie Curie', 'hash_placeholder_8', NOW() - INTERVAL '120 days'),
    ('albert@example.com', 'Albert Einstein', 'hash_placeholder_9', NOW() - INTERVAL '90 days'),
    ('isaac@example.com', 'Isaac Newton', 'hash_placeholder_10', NOW() - INTERVAL '60 days'),
    ('galileo@example.com', 'Galileo Galilei', 'hash_placeholder_11', NOW() - INTERVAL '45 days'),
    ('stephen@example.com', 'Stephen Hawking', 'hash_placeholder_12', NOW() - INTERVAL '30 days'),
    ('rosalind@example.com', 'Rosalind Franklin', 'hash_placeholder_13', NOW() - INTERVAL '25 days'),
    ('charles@example.com', 'Charles Darwin', 'hash_placeholder_14', NOW() - INTERVAL '20 days'),
    ('niels@example.com', 'Niels Bohr', 'hash_placeholder_15', NOW() - INTERVAL '15 days'),
    ('erwin@example.com', 'Erwin Schrödinger', 'hash_placeholder_16', NOW() - INTERVAL '10 days'),
    ('richard@example.com', 'Richard Feynman', 'hash_placeholder_17', NOW() - INTERVAL '8 days'),
    ('katherine@example.com', 'Katherine Johnson', 'hash_placeholder_18', NOW() - INTERVAL '5 days'),
    ('tim@example.com', 'Tim Berners-Lee', 'hash_placeholder_19', NOW() - INTERVAL '3 days'),
    ('steve@example.com', 'Steve Wozniak', 'hash_placeholder_20', NOW() - INTERVAL '2 days'),
    ('hedy@example.com', 'Hedy Lamarr', 'hash_placeholder_21', NOW() - INTERVAL '1 day'),
    ('dorothy@example.com', 'Dorothy Vaughan', 'hash_placeholder_22', NOW() - INTERVAL '12 hours'),
    -- Usuarios inactivos (sin compras recientes)
    ('inactive1@example.com', 'Usuario Inactivo 1', 'hash_placeholder_23', NOW() - INTERVAL '200 days'),
    ('inactive2@example.com', 'Usuario Inactivo 2', 'hash_placeholder_24', NOW() - INTERVAL '250 days'),
    ('inactive3@example.com', 'Usuario Inactivo 3', 'hash_placeholder_25', NOW() - INTERVAL '300 days');

-- Productos (Total 41)
INSERT INTO productos (codigo, nombre, descripcion, precio, stock, categoria_id) VALUES
    -- Originales Electrónica (1)
    ('ELEC-001', 'Laptop Pro 15"', 'Laptop de alto rendimiento', 1299.99, 50, 1),
    ('ELEC-002', 'Mouse Inalámbrico', 'Mouse ergonómico Bluetooth', 29.99, 200, 1),
    ('ELEC-003', 'Teclado Mecánico', 'Teclado RGB switches azules', 89.99, 75, 1),
    ('ELEC-004', 'Monitor 27"', 'Monitor 4K IPS', 399.99, 30, 1),
    ('ELEC-005', 'Webcam HD', 'Cámara 1080p con micrófono', 59.99, 100, 1),
    
    -- Originales Ropa (2)
    ('ROPA-001', 'Camiseta Básica', 'Camiseta 100% algodón', 19.99, 500, 2),
    ('ROPA-002', 'Jeans Clásico', 'Pantalón de mezclilla', 49.99, 200, 2),
    ('ROPA-003', 'Sudadera Tech', 'Sudadera con capucha', 39.99, 150, 2),
    ('ROPA-004', 'Zapatos Casual', 'Calzado cómodo diario', 69.99, 100, 2),
    ('ROPA-005', 'Gorra Deportiva', 'Gorra ajustable', 14.99, 300, 2),
    
    -- Originales Hogar (3)
    ('HOME-001', 'Lámpara LED', 'Lámpara de escritorio regulable', 34.99, 80, 3),
    ('HOME-002', 'Silla Ergonómica', 'Silla de oficina ajustable', 249.99, 25, 3),
    ('HOME-003', 'Organizador', 'Set de organizadores', 24.99, 120, 3),
    ('HOME-004', 'Planta Artificial', 'Decoración verde', 19.99, 200, 3),
    ('HOME-005', 'Cuadro Decorativo', 'Arte moderno 50x70cm', 44.99, 60, 3),

    -- NUEVOS PRODUCTOS
    -- Deportes (4)
    ('DEPO-001', 'Balón de Fútbol', 'Balón tamaño profesional 5', 25.00, 100, 4),
    ('DEPO-002', 'Yoga Mat', 'Tapete antideslizante 6mm', 29.99, 80, 4),
    ('DEPO-003', 'Mancuernas 5kg', 'Set de 2 mancuernas de vinilo', 45.50, 40, 4),
    
    -- Libros (5)
    ('BOOK-001', 'Clean Code', 'Manual de estilo de código ágil', 45.00, 60, 5),
    ('BOOK-002', 'Dune', 'Novela de ciencia ficción', 15.99, 120, 5),
    ('BOOK-003', 'El Quijote', 'Edición conmemorativa', 22.50, 90, 5),

    -- Juguetes (6)
    ('TOY-001', 'Set de bloques', '1000 piezas de construcción', 59.99, 45, 6),
    ('TOY-002', 'Juego de Mesa', 'Juego de estrategia familiar', 35.00, 60, 6),

    -- Automotriz (7)
    ('AUTO-001', 'Cera Líquida', 'Cera protectora para autos', 18.99, 55, 7),
    ('AUTO-002', 'Aspiradora Auto', 'Aspiradora portátil 12V', 32.50, 30, 7),

    -- Belleza (8)
    ('BEAU-001', 'Serum Facial', 'Hidratante con Vitamina C', 28.00, 90, 8),
    ('BEAU-002', 'Kit Maquillaje', 'Paleta de sombras y brochas', 42.00, 50, 8),

    -- Jardinería (9)
    ('GARD-001', 'Manguera Flex', 'Manguera extensible 15m', 29.99, 40, 9),
    ('GARD-002', 'Set Palas', 'Herramientas de mano jardín', 15.99, 70, 9),

    -- Mascotas (10)
    ('PET-001', 'Cama Perro M', 'Cama ortopédica lavable', 49.99, 25, 10),
    ('PET-002', 'Rascador Gato', 'Torre de 3 niveles', 39.99, 35, 10),

    -- Música (11)
    ('MUS-001', 'Guitarra Acústica', 'Guitarra para principiantes', 110.00, 15, 11),
    ('MUS-002', 'Afinador Digital', 'Clip para guitarra/bajo', 9.99, 200, 11),

    -- Videojuegos (12)
    ('GAME-001', 'Control Pro', 'Mando inalámbrico consola', 69.99, 60, 12),
    ('GAME-002', 'RPG Fantasy', 'Juego de rol mundo abierto', 59.99, 100, 12),

    -- Herramientas (15)
    ('TOOL-001', 'Taladro Percutor', 'Taladro 700W con maletín', 85.00, 20, 15),
    ('TOOL-002', 'Set Destornilladores', '32 piezas magnéticas', 19.99, 80, 15),

    -- Oficina (16)
    ('OFF-001', 'Resma Papel', '500 hojas A4', 6.50, 300, 16),
    ('OFF-002', 'Trituradora', 'Trituradora de papel corte cruzado', 55.00, 15, 16),

    -- Alimentos (20)
    ('FOOD-001', 'Café Grano', 'Bolsa 1kg Tostado Medio', 18.50, 60, 20),
    ('FOOD-002', 'Chocolate Negro', 'Barra 80% Cacao', 4.99, 150, 20);

-- ============================================
-- 3. TRANSACCIONES/RELACIONES
-- ============================================

-- Órdenes (Total 30 - con fechas variadas y diferentes status)
INSERT INTO ordenes (usuario_id, total, status, created_at) VALUES
    -- Ada Lovelace - Cliente VIP (365 días)
    (1, 1389.97, 'entregado', NOW() - INTERVAL '360 days'),
    (1, 399.99, 'entregado', NOW() - INTERVAL '300 days'),
    (1, 89.99, 'entregado', NOW() - INTERVAL '240 days'),
    (1, 1299.99, 'entregado', NOW() - INTERVAL '180 days'),
    (1, 249.99, 'entregado', NOW() - INTERVAL '120 days'),
    
    -- Alan Turing - Cliente activo
    (2, 69.98, 'entregado', NOW() - INTERVAL '310 days'),
    (2, 159.98, 'entregado', NOW() - INTERVAL '200 days'),
    (2, 89.99, 'entregado', NOW() - INTERVAL '100 days'),
    
    -- Grace Hopper - Con cancelaciones
    (3, 284.98, 'entregado', NOW() - INTERVAL '270 days'),
    (3, 150.00, 'cancelado', NOW() - INTERVAL '200 days'),
    (3, 99.99, 'cancelado', NOW() - INTERVAL '150 days'),
    
    -- Linus Torvalds
    (4, 99.98, 'entregado', NOW() - INTERVAL '240 days'),
    (4, 1299.99, 'entregado', NOW() - INTERVAL '100 days'),
    
    -- Margaret Hamilton
    (5, 1299.99, 'entregado', NOW() - INTERVAL '190 days'),
    (5, 249.99, 'entregado', NOW() - INTERVAL '80 days'),
    
    -- Donald Knuth
    (6, 399.99, 'entregado', NOW() - INTERVAL '170 days'),
    
    -- Tesla
    (7, 104.99, 'entregado', NOW() - INTERVAL '140 days'),
    (7, 200.00, 'entregado', NOW() - INTERVAL '60 days'),
    
    -- Marie Curie
    (8, 28.00, 'entregado', NOW() - INTERVAL '115 days'),
    
    -- Einstein
    (9, 67.50, 'entregado', NOW() - INTERVAL '85 days'),
    (9, 110.00, 'entregado', NOW() - INTERVAL '30 days'),
    
    -- Newton - Con cancelación reciente
    (10, 129.98, 'cancelado', NOW() - INTERVAL '55 days'),
    
    -- Galileo
    (11, 419.98, 'entregado', NOW() - INTERVAL '40 days'),
    
    -- Hawking
    (12, 1299.99, 'entregado', NOW() - INTERVAL '25 days'),
    
    -- Darwin
    (14, 89.98, 'entregado', NOW() - INTERVAL '15 days'),
    
    -- Tim Berners-Lee - Cliente reciente
    (19, 1389.98, 'entregado', NOW() - INTERVAL '2 days'),
    
    -- Usuarios inactivos (última compra hace 200+ días)
    (23, 150.00, 'entregado', NOW() - INTERVAL '195 days'),
    (24, 200.00, 'entregado', NOW() - INTERVAL '245 days'),
    (25, 100.00, 'entregado', NOW() - INTERVAL '295 days');

-- Detalle de órdenes (correspondientes a las órdenes de arriba)
INSERT INTO orden_detalles (orden_id, producto_id, cantidad, precio_unitario) VALUES
    -- Orden 1 (Ada - día 360)
    (1, 1, 1, 1299.99), (1, 2, 1, 29.99), (1, 3, 1, 89.99),
    -- Orden 2 (Ada - día 300)
    (2, 4, 1, 399.99),
    -- Orden 3 (Ada - día 240)
    (3, 3, 1, 89.99),
    -- Orden 4 (Ada - día 180)
    (4, 1, 1, 1299.99),
    -- Orden 5 (Ada - día 120)
    (5, 12, 1, 249.99),
    
    -- Orden 6-8 (Alan)
    (6, 6, 2, 19.99), (6, 5, 1, 29.99),
    (7, 7, 2, 49.99), (7, 8, 1, 39.99),
    (8, 3, 1, 89.99),
    
    -- Orden 9-11 (Grace - con cancelaciones)
    (9, 12, 1, 249.99), (9, 11, 1, 34.99),
    (10, 1, 1, 150.00),
    (11, 7, 2, 49.99),
    
    -- Orden 12-13 (Linus)
    (12, 7, 1, 49.99), (12, 8, 1, 39.99),
    (13, 1, 1, 1299.99),
    
    -- Orden 14-15 (Margaret)
    (14, 1, 1, 1299.99),
    (15, 12, 1, 249.99),
    
    -- Orden 16 (Donald)
    (16, 4, 1, 399.99),
    
    -- Orden 17-18 (Tesla)
    (17, 33, 1, 85.00), (17, 34, 1, 19.99),
    (18, 1, 1, 200.00),
    
    -- Orden 19 (Marie)
    (19, 25, 1, 28.00),
    
    -- Orden 20-21 (Einstein)
    (20, 19, 1, 45.00), (20, 21, 1, 22.50),
    (21, 30, 1, 110.00),
    
    -- Orden 22 (Newton - cancelada)
    (22, 22, 1, 59.99), (22, 16, 2, 25.00), (22, 10, 1, 14.99),
    
    -- Orden 23 (Galileo)
    (23, 4, 1, 399.99), (23, 20, 1, 15.99),
    
    -- Orden 24 (Hawking)
    (24, 1, 1, 1299.99),
    
    -- Orden 25 (Darwin)
    (25, 28, 1, 49.99), (25, 29, 1, 39.99),
    
    -- Orden 26 (Tim Berners)
    (26, 1, 1, 1299.99), (26, 3, 1, 89.99),
    
    -- Órdenes inactivos
    (27, 7, 3, 49.99),
    (28, 6, 10, 19.99),
    (29, 11, 4, 24.99);
