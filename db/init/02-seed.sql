-- ==================================================================
-- Datos de prueba precargados (seed) para la base de datos MySQL.
-- ==================================================================
SET NAMES utf8mb4;

-- ---- Sucursales / Hubs ------------------------------------------------
INSERT INTO sucursal (id, nombre, departamento, cobertura) VALUES
  ('MIX-01', 'Sucursal Central Mixco',     'Guatemala',      JSON_ARRAY('Mixco', 'Guatemala', 'Villa Nueva')),
  ('GUA-02', 'Hub Metropolitano Zona 4',   'Guatemala',      JSON_ARRAY('Guatemala', 'Santa Catarina Pinula')),
  ('QTZ-03', 'Hub Quetzaltenango',         'Quetzaltenango', JSON_ARRAY('Quetzaltenango', 'Salcajá', 'Xela')),
  ('ESC-04', 'Sucursal Escuintla',         'Escuintla',      JSON_ARRAY('Escuintla', 'Palín', 'Santa Lucía')),
  ('PET-05', 'Hub Petén Santa Elena',      'Petén',          JSON_ARRAY('Flores', 'Santa Elena', 'San Benito'));

-- ---- Solicitudes de recolección --------------------------------------
INSERT INTO recoleccion
  (codigo, direccion, fecha_recoleccion, franja_horaria, peso_aproximado, estado_actual, sucursal_id, cliente_nombre, cliente_email, cliente_telefono, created_at, updated_at)
VALUES
  ('REC-2026-CARGO001', '5a Avenida 12-34, Zona 1, Ciudad de Guatemala', '2026-09-18', '08:00-12:00',  3.50, 'PENDIENTE_ASIGNACION', 'GUA-02', 'María López',    'maria.lopez@example.com',    '+502 5555-1001', '2026-09-17 09:15:00', '2026-09-17 09:15:00'),
  ('REC-2026-CARGO002', 'Calzada Roosevelt 22-15, Zona 11, Mixco',       '2026-09-18', '12:00-16:00', 12.00, 'RECOLECTOR_EN_CAMINO', 'MIX-01', 'Carlos Ramírez', 'carlos.ramirez@example.com', '+502 5555-1002', '2026-09-16 14:00:00', '2026-09-17 08:30:00'),
  ('REC-2026-CARGO003', '4a Calle 8-90, Zona 3, Quetzaltenango',         '2026-09-15', '08:00-12:00',  1.20, 'RECOLECTADO',          'QTZ-03', 'Ana Say',        'ana.say@example.com',        '+502 5555-1003', '2026-09-14 10:00:00', '2026-09-15 09:40:00'),
  ('REC-2026-CARGO004', 'Avenida Centroamérica 5-01, Zona 1, Escuintla', '2026-09-16', '16:00-20:00', 25.75, 'CANCELADA',            'ESC-04', 'Jorge Pérez',    'jorge.perez@example.com',    '+502 5555-1004', '2026-09-15 18:20:00', '2026-09-16 07:00:00'),
  ('REC-2026-CARGO005', 'Barrio Santa Elena, 3a Avenida 2-45, Flores, Petén', '2026-09-19', '12:00-16:00', 8.30, 'PENDIENTE_ASIGNACION', 'PET-05', 'Lucía Morales', 'lucia.morales@example.com', '+502 5555-1005', '2026-09-17 11:45:00', '2026-09-17 11:45:00'),
  ('REC-2026-CARGO006', 'Diagonal 6 10-01, Zona 10, Ciudad de Guatemala', '2026-09-20', '08:00-12:00', 5.00, 'RECOLECTOR_EN_CAMINO', 'GUA-02', 'Diego Castillo', 'diego.castillo@example.com', '+502 5555-1006', '2026-09-17 07:30:00', '2026-09-17 12:10:00');

-- ---- Historial de estados --------------------------------------------
INSERT INTO evento_historial (recoleccion_codigo, estado, fecha, descripcion) VALUES
  ('REC-2026-CARGO001', 'PENDIENTE_ASIGNACION', '2026-09-17 09:15:00', 'Solicitud registrada. En espera de asignación de recolector.'),

  ('REC-2026-CARGO002', 'PENDIENTE_ASIGNACION', '2026-09-16 14:00:00', 'Solicitud registrada. En espera de asignación de recolector.'),
  ('REC-2026-CARGO002', 'RECOLECTOR_EN_CAMINO', '2026-09-17 08:30:00', 'Recolector asignado. La unidad se dirige a la dirección indicada.'),

  ('REC-2026-CARGO003', 'PENDIENTE_ASIGNACION', '2026-09-14 10:00:00', 'Solicitud registrada. En espera de asignación de recolector.'),
  ('REC-2026-CARGO003', 'RECOLECTOR_EN_CAMINO', '2026-09-15 08:05:00', 'Recolector asignado. La unidad se dirige a la dirección indicada.'),
  ('REC-2026-CARGO003', 'RECOLECTADO',          '2026-09-15 09:40:00', 'Paquete recolectado exitosamente e ingresado al hub.'),

  ('REC-2026-CARGO004', 'PENDIENTE_ASIGNACION', '2026-09-15 18:20:00', 'Solicitud registrada. En espera de asignación de recolector.'),
  ('REC-2026-CARGO004', 'CANCELADA',            '2026-09-16 07:00:00', 'Solicitud cancelada a petición del cliente.'),

  ('REC-2026-CARGO005', 'PENDIENTE_ASIGNACION', '2026-09-17 11:45:00', 'Solicitud registrada. En espera de asignación de recolector.'),

  ('REC-2026-CARGO006', 'PENDIENTE_ASIGNACION', '2026-09-17 07:30:00', 'Solicitud registrada. En espera de asignación de recolector.'),
  ('REC-2026-CARGO006', 'RECOLECTOR_EN_CAMINO', '2026-09-17 12:10:00', 'Recolector asignado. La unidad se dirige a la dirección indicada.');
