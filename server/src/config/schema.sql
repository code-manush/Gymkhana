CREATE DATABASE IF NOT EXISTS gymkhana_db;
USE gymkhana_db;

-- ── Users ─────────────────────────────────────────────────────────────────────
-- id comes from Clerk (string), not auto-increment
CREATE TABLE IF NOT EXISTS users (
  id          VARCHAR(255) PRIMARY KEY,
  email       VARCHAR(255) NOT NULL UNIQUE,
  first_name  VARCHAR(100) NOT NULL DEFAULT '',
  last_name   VARCHAR(100) NOT NULL DEFAULT '',
  role        ENUM('student','coordinator','admin','visitor') NOT NULL DEFAULT 'student',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ── Clubs ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clubs (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  club_name         VARCHAR(150) NOT NULL,
  description       TEXT,
  long_description  TEXT,
  category          ENUM('Technical','Cultural','Sports','Literary') NOT NULL,
  coordinator_id    VARCHAR(255),
  founded           YEAR,
  is_active         TINYINT(1) NOT NULL DEFAULT 1,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (coordinator_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Club Memberships ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS club_memberships (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    VARCHAR(255) NOT NULL,
  club_id    INT NOT NULL,
  joined_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_member (user_id, club_id),
  FOREIGN KEY (user_id) REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (club_id) REFERENCES clubs(id)  ON DELETE CASCADE
);

-- ── Events ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id                INT AUTO_INCREMENT PRIMARY KEY,
  event_name        VARCHAR(200) NOT NULL,
  description       TEXT,
  long_description  TEXT,
  event_date        DATETIME NOT NULL,
  end_date          DATETIME,
  location          VARCHAR(200),
  capacity          INT NOT NULL DEFAULT 50,
  club_id           INT,
  category          ENUM('Technical','Cultural','Sports','Literary') NOT NULL,
  status            ENUM('upcoming','registration_open','ongoing','completed') NOT NULL DEFAULT 'upcoming',
  visitor_open      TINYINT(1) NOT NULL DEFAULT 0,
  team_size         VARCHAR(50),          -- e.g. "2–4 members"
  prizes            JSON,                 -- array of prize strings
  schedule          JSON,                 -- array of {time, event} objects
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE SET NULL
);

-- ── Event Coordinators (assignment table) ────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_coordinators (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  event_id    INT NOT NULL,
  user_id     VARCHAR(255) NOT NULL,
  assigned_by VARCHAR(255),
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_assignment (event_id, user_id),
  FOREIGN KEY (event_id)    REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)     REFERENCES users(id)  ON DELETE CASCADE,
  FOREIGN KEY (assigned_by) REFERENCES users(id)  ON DELETE SET NULL
);

-- ── Event Proposals ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS event_proposals (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  event_name     VARCHAR(200) NOT NULL,
  description    TEXT,
  proposed_date  DATETIME NOT NULL,
  location       VARCHAR(200),
  capacity       INT,
  club_id        INT,
  proposed_by    VARCHAR(255),
  status         ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  admin_notes    TEXT,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (club_id)     REFERENCES clubs(id) ON DELETE SET NULL,
  FOREIGN KEY (proposed_by) REFERENCES users(id) ON DELETE SET NULL
);

-- ── Registrations ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS registrations (
  id              INT AUTO_INCREMENT PRIMARY KEY,
  event_id        INT NOT NULL,
  user_id         VARCHAR(255) NOT NULL,
  status          ENUM('confirmed','cancelled','waitlisted') NOT NULL DEFAULT 'confirmed',
  registered_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_registration (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);

-- ── Results ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS results (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  event_id   INT NOT NULL,
  user_id    VARCHAR(255) NOT NULL,
  position   INT NOT NULL,
  score      DECIMAL(10,2),
  notes      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_result (event_id, user_id),
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE
);