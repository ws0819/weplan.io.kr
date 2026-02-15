CREATE SCHEMA IF NOT EXISTS weplan;

-- Drop order (FK-safe)
DROP TABLE IF EXISTS weplan.budget_items CASCADE;
DROP TABLE IF EXISTS weplan.links CASCADE;
DROP TABLE IF EXISTS weplan.meeting_members CASCADE;
DROP TABLE IF EXISTS weplan.meetings CASCADE;
DROP TABLE IF EXISTS weplan.users CASCADE;
DROP TABLE IF EXISTS meeting_base_points ;

-- =========================
-- users
-- =========================
CREATE TABLE weplan.users (
    id UUID PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(50),
    email VARCHAR(70),
    picture TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    refresh_token_hash TEXT,
    refresh_token_expires_at TIMESTAMP
);

-- =========================
-- meetings
-- =========================
CREATE TABLE weplan.meetings (
    id TEXT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title TEXT NOT NULL,
    -- date TIMESTAMP NOT NULL,
    description TEXT,
    thumbnail TEXT NOT NULL DEFAULT '',

    -- 추가 필드
    start_date DATE,
    end_date DATE,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    total_amount INTEGER DEFAULT 0,

    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- =========================
-- meeting_members
-- =========================
CREATE TABLE weplan.meeting_members (
    id UUID PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'member',
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT meeting_members_meeting_user_unique
        UNIQUE (meeting_id, user_id),

    CONSTRAINT meeting_members_role_check
        CHECK (role IN ('owner', 'member')),

    CONSTRAINT fk_meeting_members_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES weplan.meetings(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_meeting_members_user
        FOREIGN KEY (user_id)
        REFERENCES weplan.users(id)
        ON DELETE CASCADE
);


-- =========================
-- links
-- =========================
CREATE TABLE weplan.links (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    url TEXT NOT NULL,
    title TEXT,
    memo TEXT,
    images TEXT,
    category VARCHAR(50),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    rating INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_links_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES weplan.meetings(id)
        ON DELETE CASCADE,

    CONSTRAINT links_rating_range
        CHECK (rating BETWEEN 0 AND 5)
);

-- =========================
-- budget_leader
-- =========================
CREATE TABLE weplan.budget_leader (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    bank TEXT NOT NULL,
    acount TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_budget_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES weplan.meetings(id)
        ON DELETE CASCADE
);

-- =========================
-- budget_items
-- =========================
CREATE TABLE weplan.budget_items (
    id TEXT PRIMARY KEY,
    meeting_id TEXT NOT NULL,
    name TEXT NOT NULL,
    amount INTEGER NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_budget_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES weplan.meetings(id)
        ON DELETE CASCADE
);

CREATE TABLE weplan.meeting_base_points (
    meeting_id TEXT NOT NULL,
    link_id TEXT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    category TEXT NOT NULL,
    title TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT meeting_base_points_meeting_id_unique
        UNIQUE (meeting_id),

    CONSTRAINT fk_base_points_meeting
        FOREIGN KEY (meeting_id)
        REFERENCES weplan.meetings(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_base_points_link
        FOREIGN KEY (link_id)
        REFERENCES weplan.links(id)
        ON DELETE SET NULL
);


ALTER TABLE weplan.meeting_members
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id)
REFERENCES weplan.meetings(id)
ON DELETE CASCADE;

ALTER TABLE weplan.links
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id)
REFERENCES weplan.meetings(id)
ON DELETE CASCADE;

ALTER TABLE weplan.budget_items
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id)
REFERENCES weplan.meetings(id)
ON DELETE CASCADE;

ALTER TABLE weplan.budget_leader
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id)
REFERENCES weplan.meetings(id)
ON DELETE CASCADE;

ALTER TABLE weplan.budget_leader ADD CONSTRAINT budget_leader_meeting_id_uq UNIQUE (meeting_id);

ALTER TABLE weplan.meeting_base_points
ADD CONSTRAINT fk_meeting
FOREIGN KEY (meeting_id)
REFERENCES weplan.meetings(id)
ON DELETE CASCADE;

-- =========================
-- indexes
-- =========================
CREATE INDEX IF NOT EXISTS idx_meeting_members_meeting_id
    ON weplan.meeting_members(meeting_id);

CREATE INDEX IF NOT EXISTS idx_links_meeting_id
    ON weplan.links(meeting_id);

CREATE INDEX IF NOT EXISTS idx_budget_items_meeting_id
    ON weplan.budget_items(meeting_id);

