INSERT INTO students (name, email, program, enrollment_year) VALUES
('Juan Pérez', 'juan.perez@university.edu', 'Ingeniería en Sistemas', 2023),
('María García', 'maria.garcia@university.edu', 'Ingeniería en Sistemas', 2023),
('Carlos López', 'carlos.lopez@university.edu', 'Ingeniería en Sistemas', 2024),
('Ana Martínez', 'ana.martinez@university.edu', 'Ingeniería en Sistemas', 2024),
('Luis Rodríguez', 'luis.rodriguez@university.edu', 'Ingeniería en Sistemas', 2023),
('Carmen Sánchez', 'carmen.sanchez@university.edu', 'Ingeniería en Sistemas', 2024),
('José Hernández', 'jose.hernandez@university.edu', 'Ingeniería en Sistemas', 2023),
('Laura Torres', 'laura.torres@university.edu', 'Ingeniería en Sistemas', 2024),
('Miguel Ramírez', 'miguel.ramirez@university.edu', 'Ingeniería en Sistemas', 2023),
('Sofía Flores', 'sofia.flores@university.edu', 'Ingeniería en Sistemas', 2024),
('Pedro Castro', 'pedro.castro@university.edu', 'Administración de Empresas', 2023),
('Daniela Morales', 'daniela.morales@university.edu', 'Administración de Empresas', 2023),
('Roberto Ortiz', 'roberto.ortiz@university.edu', 'Administración de Empresas', 2024),
('Valentina Ruiz', 'valentina.ruiz@university.edu', 'Administración de Empresas', 2024),
('Fernando Díaz', 'fernando.diaz@university.edu', 'Administración de Empresas', 2023),
('Isabella Vargas', 'isabella.vargas@university.edu', 'Administración de Empresas', 2024),
('Alejandro Romero', 'alejandro.romero@university.edu', 'Administración de Empresas', 2023),
('Camila Mendoza', 'camila.mendoza@university.edu', 'Administración de Empresas', 2024),
('Diego Silva', 'diego.silva@university.edu', 'Administración de Empresas', 2023),
('Lucía Gutiérrez', 'lucia.gutierrez@university.edu', 'Administración de Empresas', 2024),
('Ricardo Paredes', 'ricardo.paredes@university.edu', 'Medicina', 2023),
('Gabriela Vega', 'gabriela.vega@university.edu', 'Medicina', 2023),
('Andrés Medina', 'andres.medina@university.edu', 'Medicina', 2024),
('Paula Aguilar', 'paula.aguilar@university.edu', 'Medicina', 2024),
('Javier Ríos', 'javier.rios@university.edu', 'Medicina', 2023),
('Natalia Cruz', 'natalia.cruz@university.edu', 'Medicina', 2024),
('Sebastián Reyes', 'sebastian.reyes@university.edu', 'Medicina', 2023),
('Andrea Jiménez', 'andrea.jimenez@university.edu', 'Medicina', 2024),
('Mateo Navarro', 'mateo.navarro@university.edu', 'Medicina', 2023),
('Victoria Molina', 'victoria.molina@university.edu', 'Medicina', 2024);

INSERT INTO teachers (name, email) VALUES
('Dr. Alberto González', 'alberto.gonzalez@university.edu'),
('Dra. Patricia Herrera', 'patricia.herrera@university.edu'),
('Ing. Francisco Castillo', 'francisco.castillo@university.edu'),
('Mtra. Elena Campos', 'elena.campos@university.edu'),
('Dr. Raúl Méndez', 'raul.mendez@university.edu'),
('Dra. Mónica Salazar', 'monica.salazar@university.edu'),
('Lic. Héctor Ramos', 'hector.ramos@university.edu'),
('Mtra. Verónica León', 'veronica.leon@university.edu');

INSERT INTO courses (code, name, credits) VALUES
('CS101', 'Introducción a la Programación', 4),
('CS201', 'Estructuras de Datos', 4),
('CS301', 'Base de Datos', 4),
('CS401', 'Desarrollo Web', 4),
('ADM101', 'Fundamentos de Administración', 3),
('ADM201', 'Contabilidad Financiera', 4),
('ADM301', 'Gestión de Recursos Humanos', 3),
('ADM401', 'Marketing Estratégico', 3),
('MED101', 'Anatomía Humana', 5),
('MED201', 'Fisiología', 5),
('MED301', 'Farmacología', 4),
('MED401', 'Clínica Médica', 6);

INSERT INTO groups (course_id, teacher_id, term) VALUES
(1, 1, '2024-1'), 
(2, 3, '2024-1'), 
(5, 4, '2024-1'), 
(6, 7, '2024-1'), 
(9, 5, '2024-1'), 
(10, 6, '2024-1'), 
(1, 1, '2024-2'), 
(3, 3, '2024-2'), 
(4, 2, '2024-2'), 
(5, 4, '2024-2'), 
(7, 7, '2024-2'), 
(8, 8, '2024-2'), 
(9, 5, '2024-2'), 
(11, 6, '2024-2');

INSERT INTO enrollments (student_id, group_id) VALUES
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(1, 2), (2, 2), (5, 2), (7, 2), (9, 2),
(11, 3), (12, 3), (13, 3), (14, 3), (15, 3), (16, 3), (17, 3), (18, 3), (19, 3), (20, 3),
(11, 4), (12, 4), (15, 4), (17, 4), (19, 4),
(21, 5), (22, 5), (23, 5), (24, 5), (25, 5), (26, 5), (27, 5), (28, 5), (29, 5), (30, 5),
(21, 6), (22, 6), (25, 6), (27, 6), (29, 6);

INSERT INTO enrollments (student_id, group_id) VALUES
(3, 7), (4, 7), (6, 7), (8, 7), (10, 7),
(1, 8), (2, 8), (5, 8), (7, 8), (9, 8),
(1, 9), (5, 9), (9, 9),
(13, 10), (14, 10), (16, 10), (18, 10), (20, 10),
(11, 11), (12, 11), (15, 11), (17, 11), (19, 11),
(11, 12), (15, 12), (19, 12),
(23, 13), (24, 13), (26, 13), (28, 13), (30, 13),
(21, 14), (22, 14), (25, 14), (27, 14), (29, 14);

INSERT INTO grades (enrollment_id, partial1, partial2, final) VALUES
(1, 85, 90, 88), (2, 92, 95, 94), (3, 65, 70, 68), (4, 78, 82, 80),
(5, 88, 85, 87), (6, 60, 55, 58), (7, 95, 98, 97), (8, 75, 78, 77),
(9, 82, 88, 85), (10, 70, 68, 69),
(11, 90, 88, 89), (12, 85, 90, 88), (13, 78, 75, 76), (14, 92, 95, 94), (15, 88, 85, 87),
(16, 80, 85, 83), (17, 75, 78, 77), (18, 88, 90, 89), (19, 65, 60, 62),
(20, 92, 95, 94), (21, 58, 62, 60), (22, 85, 88, 87), (23, 78, 80, 79),
(24, 90, 92, 91), (25, 72, 75, 74),
(26, 85, 88, 87), (27, 90, 92, 91), (28, 78, 82, 80), (29, 88, 85, 87), (30, 95, 98, 97),
(31, 88, 90, 89), (32, 92, 95, 94), (33, 70, 68, 69), (34, 85, 88, 87),
(35, 78, 75, 76), (36, 62, 65, 64), (37, 95, 98, 97), (38, 80, 82, 81),
(39, 88, 85, 87), (40, 75, 78, 77),
(41, 90, 92, 91), (42, 85, 88, 87), (43, 92, 95, 94), (44, 88, 90, 89), (45, 95, 98, 97),
(46, 75, 78, 77), (47, 85, 88, 87), (48, 68, 65, 66), (49, 90, 92, 91), (50, 82, 85, 84),
(51, 88, 90, 89), (52, 92, 95, 94), (53, 85, 88, 87), (54, 90, 92, 91), (55, 95, 98, 97),
(56, 92, 95, 94), (57, 88, 90, 89), (58, 95, 98, 97),
(59, 78, 80, 79), (60, 85, 88, 87), (61, 65, 68, 67), (62, 90, 92, 91), (63, 75, 78, 77),
(64, 88, 90, 89), (65, 92, 95, 94), (66, 85, 88, 87), (67, 90, 92, 91), (68, 88, 85, 87),
(69, 92, 95, 94), (70, 90, 92, 91), (71, 95, 98, 97),
(72, 80, 82, 81), (73, 88, 90, 89), (74, 70, 68, 69), (75, 92, 95, 94), (76, 85, 88, 87),
(77, 90, 92, 91), (78, 88, 90, 89), (79, 95, 98, 97), (80, 92, 95, 94), (81, 90, 88, 89);

DO $$
DECLARE
    enrollment_id_var INTEGER;
    day_offset INTEGER;
    attendance_pattern DECIMAL;
BEGIN
    FOR enrollment_id_var IN 1..81 LOOP
        IF enrollment_id_var IN (3, 6, 10, 19, 21, 33, 36, 48, 61, 74) THEN
            attendance_pattern := 0.55;
        ELSIF enrollment_id_var IN (4, 8, 16, 23, 25, 34, 40, 46, 59, 72) THEN
            attendance_pattern := 0.72;
        ELSE
            attendance_pattern := 0.90;
        END IF;
        
        FOR day_offset IN 0..19 LOOP
            INSERT INTO attendance (enrollment_id, date, present)
            VALUES (
                enrollment_id_var,
                '2024-01-15'::DATE + (day_offset * 3),
                random() < attendance_pattern
            );
        END LOOP;
    END LOOP;
END $$;