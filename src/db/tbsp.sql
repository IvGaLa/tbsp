BEGIN TRANSACTION;

DROP TABLE IF EXISTS "users";
CREATE TABLE "users" (
	"id"	INTEGER,
	"telegramId"	INTEGER NOT NULL UNIQUE,
	"username"	TEXT,
	"firstName"	TEXT,
	"lastName"	TEXT,
	"timezone"	TEXT,
	"active"	INTEGER NOT NULL DEFAULT 1,
	"createdAt"	TEXT NOT NULL,
	"updatedAt"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "appSettings";
CREATE TABLE "appSettings" (
	"id"	INTEGER,
	"key"	TEXT NOT NULL UNIQUE,
	"value"	TEXT NOT NULL,
	"description"	TEXT,
	"updatedAt"	TEXT NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "conversationState";
CREATE TABLE "conversationState" (
	"id"	INTEGER,
	"userId"	INTEGER NOT NULL UNIQUE,
	"state"	TEXT NOT NULL DEFAULT 'IDLE',
	"payload"	TEXT,
	"updatedAt"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "logs";
CREATE TABLE "logs" (
	"id"	INTEGER,
	"userId"	INTEGER,
	"type"	TEXT NOT NULL DEFAULT 'INFO',
	"message"	TEXT NOT NULL,
	"createdAt"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

DROP TABLE IF EXISTS "reminders";
CREATE TABLE "reminders" (
	"id"	INTEGER,
	"userId"	INTEGER NOT NULL,
	"message"	TEXT NOT NULL,
	"scheduledAtUtc"	TEXT NOT NULL,
	"executedAtUtc"	TEXT,
	"status"	TEXT NOT NULL DEFAULT 'PENDING',
	"createdAt"	TEXT NOT NULL,
	"updatedAt"	TEXT NOT NULL,
	PRIMARY KEY("id"),
	FOREIGN KEY("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
COMMIT;
