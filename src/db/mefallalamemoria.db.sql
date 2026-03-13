BEGIN TRANSACTION;

DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
	"id"	INTEGER,
	"telegram_id"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"timezone"	TEXT,
	"active"	INTEGER NOT NULL DEFAULT 1,
	"created_at"	TEXT NOT NULL,
	"updated_at"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "app_settings";
CREATE TABLE "app_settings" (
	"id"	INTEGER,
	"key"	TEXT NOT NULL UNIQUE,
	"value"	TEXT NOT NULL,
	"description"	TEXT,
	"updated_at"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "conversation_state";
CREATE TABLE "conversation_state" (
	"id"	INTEGER,
	"user_id"	INTEGER NOT NULL UNIQUE,
	"state"	TEXT NOT NULL DEFAULT 'IDLE',
	"payload"	TEXT,
	"updated_at"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "logs";
CREATE TABLE "logs" (
	"id"	INTEGER,
	"user_id"	INTEGER,
	"type"	TEXT NOT NULL DEFAULT 'INFO',
	"message"	TEXT NOT NULL,
	"created_at"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "reminders";
CREATE TABLE "reminders" (
	"id"	INTEGER,
	"user_id"	INTEGER NOT NULL,
	"message"	TEXT NOT NULL,
	"scheduled_at_utc"	TEXT NOT NULL,
	"executed_at_utc"	TEXT,
	"status"	TEXT NOT NULL DEFAULT 'PENDING',
	"created_at"	TEXT NOT NULL,
	"updated_at"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
COMMIT;
