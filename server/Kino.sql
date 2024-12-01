CREATE TABLE "Фильмы" (
  "id_фильма" int PRIMARY KEY,
  "название" varchar NOT NULL,
  "id_жанра" int,
  "дата_выпуска" date,
  "id_режиссера" int,
  "рейтинг" float CHECK (рейтинг >= 0 AND рейтинг <= 10),
  FOREIGN KEY ("id_жанра") REFERENCES "Жанр"("id_жанра"),
  FOREIGN KEY ("id_режиссера") REFERENCES "Режиссеры"("id_режиссера")
);

CREATE TABLE "Пользователи" (
  "id_пользователя" int PRIMARY KEY,
  "имя" varchar NOT NULL,
  "фамилия" varchar NOT NULL,
  "электронная_почта" varchar UNIQUE NOT NULL,
  "дата_регистрации" date DEFAULT CURRENT_DATE
);

CREATE TABLE "Просмотры" (
  "id_просмотра" int PRIMARY KEY,
  "id_пользователя" int,
  "id_фильма" int,
  "дата_просмотра" date NOT NULL,
  "время_просмотра" time NOT NULL,
  FOREIGN KEY ("id_пользователя") REFERENCES "Пользователи"("id_пользователя") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_фильма") REFERENCES "Фильмы"("id_фильма") ON DELETE CASCADE
);

CREATE TABLE "Отзывы" (
  "id_отзыва" int PRIMARY KEY,
  "id_фильма" int,
  "id_пользователя" int,
  "текст" text NOT NULL,
  "оценка" int CHECK (оценка >= 1 AND оценка <= 10),
  "дата_отзыва" date DEFAULT CURRENT_DATE,
  FOREIGN KEY ("id_фильма") REFERENCES "Фильмы"("id_фильма") ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY ("id_пользователя") REFERENCES "Пользователи"("id_пользователя") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Подписки" (
  "id_подписки" int PRIMARY KEY,
  "id_пользователя" int,
  "тип_подписки" varchar NOT NULL,
  "дата_начала" date DEFAULT CURRENT_DATE,
  "дата_окончания" date,
  FOREIGN KEY ("id_пользователя") REFERENCES "Пользователи"("id_пользователя") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Жанр" (
  "id_жанра" int PRIMARY KEY,
  "название" varchar NOT NULL,
  "описание" text
);

CREATE TABLE "Режиссеры" (
  "id_режиссера" int PRIMARY KEY,
  "имя" varchar NOT NULL,
  "фамилия" varchar NOT NULL,
  "дата_рождения" date,
  "биография" text
);

CREATE TABLE "Пароли" (
  "id_пользователя" int PRIMARY KEY,
  "пароль" varchar NOT NULL,
  FOREIGN KEY ("id_пользователя") REFERENCES "Пользователи"("id_пользователя") ON DELETE CASCADE ON UPDATE CASCADE
);

INSERT INTO Пароли (id_пользователя, пароль) VALUES
(1, 'abcd'),
(2, '1234'),
(3, 'pass'),
(4, 'word'),
(5, 'qwer'),
(6, 'asdf'),
(7, 'zxcv'),
(8, '0987'),
(9, '5678'),
(10, 'home'),
(11, 'base'),
(12, 'test'),
(13, 'lock'),
(14, 'open'),
(15, 'safe');

CREATE SEQUENCE users
	INCREMENT 1
	START 16

CREATE SEQUENCE password
	INCREMENT 1
	START 16

CREATE SEQUENCE reviews
	INCREMENT 1
	START 16

CREATE SEQUENCE films
    INCREMENT 1
    START 16

CREATE ROLE admin;
CREATE ROLE watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Фильмы" TO admin;
GRANT SELECT ON "Фильмы" TO watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Пользователи" TO admin;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Отзывы" TO admin;
GRANT SELECT, INSERT ON "Отзывы" TO watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Режиссеры" TO admin;
GRANT SELECT ON "Режиссеры" TO watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Просмотры" TO admin;
GRANT SELECT, INSERT ON "Просмотры" TO watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Жанр" TO admin;
GRANT SELECT ON "Жанр" TO watcher;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Подписки" TO admin;
GRANT SELECT, UPDATE ON "Подписки" TO watcher;