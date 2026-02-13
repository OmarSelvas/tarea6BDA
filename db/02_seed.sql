-- ============================================
-- SEED.SQL - Datos Iniciales (Extendido)
-- ============================================
-- Equipo: [Nombre del equipo]
-- Fecha: [Fecha Actual]
-- ============================================
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

-- Usuarios (Total 22 + Edge Case)
INSERT INTO usuarios (email, nombre, password_hash) VALUES
    -- Originales (1-6)
    ('ada@example.com', 'Ada Lovelace', 'hash_placeholder_1'),
    ('alan@example.com', 'Alan Turing', 'hash_placeholder_2'),
    ('grace@example.com', 'Grace Hopper', 'hash_placeholder_3'),
    ('linus@example.com', 'Linus Torvalds', 'hash_placeholder_4'),
    ('margaret@example.com', 'Margaret Hamilton', 'hash_placeholder_5'),
    ('donald@example.com', 'Donald Knuth', 'hash_placeholder_6'),
    -- Nuevos (7-22)
    ('nikola@example.com', 'Nikola Tesla', 'hash_placeholder_7'),
    ('marie@example.com', 'Marie Curie', 'hash_placeholder_8'),
    ('albert@example.com', 'Albert Einstein', 'hash_placeholder_9'),
    ('isaac@example.com', 'Isaac Newton', 'hash_placeholder_10'),
    ('galileo@example.com', 'Galileo Galilei', 'hash_placeholder_11'),
    ('stephen@example.com', 'Stephen Hawking', 'hash_placeholder_12'),
    ('rosalind@example.com', 'Rosalind Franklin', 'hash_placeholder_13'),
    ('charles@example.com', 'Charles Darwin', 'hash_placeholder_14'),
    ('niels@example.com', 'Niels Bohr', 'hash_placeholder_15'),
    ('erwin@example.com', 'Erwin Schrödinger', 'hash_placeholder_16'),
    ('richard@example.com', 'Richard Feynman', 'hash_placeholder_17'),
    ('katherine@example.com', 'Katherine Johnson', 'hash_placeholder_18'),
    ('tim@example.com', 'Tim Berners-Lee', 'hash_placeholder_19'),
    ('steve@example.com', 'Steve Wozniak', 'hash_placeholder_20'),
    ('hedy@example.com', 'Hedy Lamarr', 'hash_placeholder_21'),
    ('dorothy@example.com', 'Dorothy Vaughan', 'hash_placeholder_22');

-- Productos (Total 40+)
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
    ('TOY-001', 'Set Bloques', '1000 piezas de construcción', 59.99, 45, 6),
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

-- Órdenes (Total 22)
INSERT INTO ordenes (usuario_id, total, status) VALUES
    -- Originales (1-6)
    (1, 1389.97, 'entregado'),
    (2, 69.98, 'enviado'),
    (3, 284.98, 'pagado'),
    (4, 99.98, 'pendiente'),
    (5, 1299.99, 'pagado'),
    (6, 399.99, 'pagado'),
    -- Nuevas (Usuarios 7-22)
    (7, 104.99, 'procesando'),    -- Tesla compró Herramientas + Ciencia
    (8, 28.00, 'enviado'),         -- Marie compró Belleza
    (9, 67.50, 'entregado'),       -- Einstein compró Libros
    (10, 129.98, 'cancelado'),     -- Newton (manzanas no hay, compró Juguetes y deportes)
    (11, 419.98, 'enviado'),       -- Galileo compró Telescopio (Monitor) + Libro
    (12, 1299.99, 'procesando'),   -- Hawking compró Laptop
    (13, 85.00, 'pagado'),         -- Rosalind compró Herramientas
    (14, 89.98, 'entregado'),      -- Darwin compró Mascotas y Jardín
    (15, 59.99, 'pendiente'),      -- Bohr compró Videojuego
    (16, 49.99, 'devolucion'),     -- Schrödinger (¿está vivo o muerto el pedido?) Cama gato
    (17, 119.99, 'pagado'),        -- Feynman compró Música
    (18, 12.00, 'entregado'),      -- Katherine compró Oficina
    (19, 1389.98, 'pagado'),       -- Tim Berners compró Laptop + Teclado
    (20, 240.48, 'enviado'),       -- Wozniak compró componentes varios
    (21, 55.00, 'entregado'),      -- Hedy compró Trituradora (secretos)
    (22, 60.99, 'pendiente');      -- Dorothy compró Libros

-- Detalle de órdenes (Total 45+)
INSERT INTO orden_detalles (orden_id, producto_id, cantidad, precio_unitario) VALUES
    -- Originales (1-6)
    (1, 1, 1, 1299.99), (1, 2, 1, 29.99), (1, 3, 1, 89.99),
    (2, 6, 2, 19.99), (2, 5, 1, 59.99),
    (3, 12, 1, 249.99), (3, 11, 1, 34.99),
    (4, 7, 1, 49.99), (4, 8, 1, 39.99),
    (5, 1, 1, 1299.99),
    (6, 4, 1, 399.99),
    
    -- Orden 7 (Tesla - Herramientas)
    (7, 33, 1, 85.00), -- Taladro
    (7, 34, 1, 19.99), -- Destornilladores
    
    -- Orden 8 (Curie)
    (8, 25, 1, 28.00), -- Serum
    
    -- Orden 9 (Einstein)
    (9, 19, 1, 45.00), -- Clean Code
    (9, 21, 1, 22.50), -- Quijote
    
    -- Orden 10 (Newton)
    (10, 22, 1, 59.99), -- Bloques
    (10, 16, 2, 25.00), -- 2 Balones
    (10, 10, 1, 14.99), -- Gorra
    
    -- Orden 11 (Galileo)
    (11, 4, 1, 399.99), -- Monitor
    (11, 20, 1, 15.99), -- Dune
    
    -- Orden 12 (Hawking)
    (12, 1, 1, 1299.99), -- Laptop
    
    -- Orden 13 (Rosalind)
    (13, 33, 1, 85.00), -- Taladro
    
    -- Orden 14 (Darwin - Naturaleza)
    (14, 28, 1, 49.99), -- Cama perro
    (14, 29, 1, 39.99), -- Rascador gato
    
    -- Orden 15 (Bohr)
    (15, 32, 1, 59.99), -- Juego RPG
    
    -- Orden 16 (Schrödinger - Gato)
    (16, 28, 1, 49.99), -- Cama perro (para el gato)
    
    -- Orden 17 (Feynman - Bongos/Musica)
    (17, 30, 1, 110.00), -- Guitarra
    (17, 31, 1, 9.99),   -- Afinador
    
    -- Orden 18 (Katherine)
    (18, 35, 2, 6.50), -- Papel (Calculos)
    
    -- Orden 19 (Tim BL)
    (19, 1, 1, 1299.99), -- Laptop
    (19, 3, 1, 89.99),   -- Teclado
    
    -- Orden 20 (Wozniak)
    (20, 3, 1, 89.99),   -- Teclado
    (20, 2, 2, 29.99),   -- 2 Mouses
    (20, 34, 1, 19.99),  -- Destornilladores
    (20, 5, 1, 59.99),   -- Webcam
    
    -- Orden 21 (Hedy)
    (21, 36, 1, 55.00), -- Trituradora
    
    -- Orden 22 (Dorothy)
    (22, 19, 1, 45.00), -- Libro
    (22, 20, 1, 15.99); -- Libro

-- ============================================
-- 4. EDGE CASES (para versión 3 horas)
-- ============================================

-- Caso: String largo pero válido
INSERT INTO usuarios (email, nombre, password_hash) VALUES
    ('usuario.con.email.muy.largo.pero.valido@subdominio.empresa.ejemplo.com', 
     'Usuario Con Nombre Extremadamente Largo Para Probar Límites', 
     'hash_muy_largo_12345678901234567890');

-- Caso: Valores en el límite
INSERT INTO productos (codigo, nombre, precio, stock, categoria_id) VALUES
    ('EDGE-001', 'Producto Gratuito', 0.00, 0, 1);  -- Precio y stock en 0

-- ============================================
-- FIN DEL SEED
-- ============================================
-- Para ejecutar: \i db/seed.sql