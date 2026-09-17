-- ==================================================================
-- Esquema de la base de datos de recolecciones (MySQL 8)
-- Se ejecuta automáticamente al inicializar el contenedor de MySQL
-- (docker-entrypoint-initdb.d) y también con `npm run db:setup`.
-- ==================================================================
SET NAMES utf8mb4;

-- Orden de borrado respetando las llaves foráneas
DROP TABLE IF EXISTS evento_historial;
DROP TABLE IF EXISTS recoleccion;
DROP TABLE IF EXISTS sucursal;

-- ---- Sucursales / Hubs ------------------------------------------------
CREATE TABLE sucursal (
  id           VARCHAR(10)  PRIMARY KEY,
  nombre       VARCHAR(120) NOT NULL,
  departamento VARCHAR(80),
  cobertura    JSON,
  CONSTRAINT chk_cobertura_arr CHECK (cobertura IS NULL OR JSON_VALID(cobertura))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Solicitudes de recolección --------------------------------------
CREATE TABLE recoleccion (
  codigo            VARCHAR(24)  PRIMARY KEY,
  direccion         VARCHAR(255) NOT NULL,
  fecha_recoleccion DATE         NOT NULL,
  franja_horaria    VARCHAR(20)  NOT NULL,
  peso_aproximado   DECIMAL(6,2) NOT NULL,
  estado_actual     VARCHAR(30)  NOT NULL,
  sucursal_id       VARCHAR(10),
  cliente_nombre    VARCHAR(120),
  cliente_email     VARCHAR(120),
  cliente_telefono  VARCHAR(30),
  created_at        DATETIME     NOT NULL,
  updated_at        DATETIME     NOT NULL,
  CONSTRAINT chk_peso_positivo CHECK (peso_aproximado > 0),
  CONSTRAINT fk_recoleccion_sucursal FOREIGN KEY (sucursal_id) REFERENCES sucursal(id),
  INDEX idx_estado (estado_actual)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---- Historial de estados (1 solicitud -> N eventos) ------------------
CREATE TABLE evento_historial (
  id                 BIGINT AUTO_INCREMENT PRIMARY KEY,
  recoleccion_codigo VARCHAR(24)  NOT NULL,
  estado             VARCHAR(30)  NOT NULL,
  fecha              DATETIME     NOT NULL,
  descripcion        VARCHAR(255),
  CONSTRAINT fk_evento_recoleccion FOREIGN KEY (recoleccion_codigo)
    REFERENCES recoleccion(codigo) ON DELETE CASCADE,
  INDEX idx_recoleccion (recoleccion_codigo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
