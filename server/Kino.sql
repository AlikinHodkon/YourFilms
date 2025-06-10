CREATE DATABASE online_cinema;
\c online_cinema;

CREATE TABLE "Genre" (
  "genre_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT
);

CREATE TABLE "Directors" (
  "director_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "birth_date" DATE,
  "biography" TEXT
);

CREATE TABLE "Movies" (
  "movie_id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "genre_id" INT REFERENCES "Genre"("genre_id"),
  "release_date" DATE,
  "director_id" INT REFERENCES "Directors"("director_id"),
  "rating" DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10),
  "image" VARCHAR(255)
);

CREATE TABLE "Users" (
  "user_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "registration_date" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE "WatchHistory" (
  "watch_id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "movie_id" INT REFERENCES "Movies"("movie_id") ON DELETE CASCADE,
  "watch_date" DATE NOT NULL,
  "watch_time" TIME NOT NULL
);

CREATE TABLE "Reviews" (
  "review_id" SERIAL PRIMARY KEY,
  "movie_id" INT REFERENCES "Movies"("movie_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "text" TEXT NOT NULL,
  "rating" INT CHECK (rating >= 1 AND rating <= 10),
  "review_date" DATE DEFAULT CURRENT_DATE
);

CREATE TABLE "Subscriptions" (
  "subscription_id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "subscription_type" VARCHAR(50) NOT NULL,
  "start_date" DATE DEFAULT CURRENT_DATE,
  "end_date" DATE
);

CREATE TABLE "Passwords" (
  "user_id" INT PRIMARY KEY REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "password" VARCHAR(255) NOT NULL
);

INSERT INTO "Users" ("first_name", "last_name", "email")
VALUES ('Admin', 'Root', 'root');
INSERT INTO "Passwords" ("user_id", "password")
VALUES (1, 'root');

INSERT INTO "Genre" ("name", "description")
VALUES
  ('Action', 'Dynamic movies with a lot of movement and fights'),
  ('Drama', 'Emotional and intense storytelling'),
  ('Comedy', 'Lighthearted movies with humorous elements'),
  ('Sci-Fi', 'Movies about futuristic technology and space exploration'),
  ('Horror', 'Suspenseful films designed to evoke fear'),
  ('Fantasy', 'Stories set in imaginary worlds with magical elements');

INSERT INTO "Directors" ("first_name", "last_name", "birth_date", "biography")
VALUES
  ('Christopher', 'Nolan', '1970-07-30', 'Known for complex and mind-bending narratives. Directed Inception, Interstellar, Tenet.'),
  ('Quentin', 'Tarantino', '1963-03-27', 'Famous for unique dialogue and unconventional storytelling. Directed Pulp Fiction, Django Unchained.'),
  ('Steven', 'Spielberg', '1946-12-18', 'Legendary director of sci-fi and adventure films such as Jurassic Park and E.T.'),
  ('Martin', 'Scorsese', '1942-11-17', 'Specializes in crime dramas and character-driven narratives like Goodfellas and The Irishman.'),
  ('James', 'Cameron', '1954-08-16', 'Known for epic storytelling and pioneering special effects. Directed Avatar and Titanic.');



CREATE SEQUENCE users_seq INCREMENT 1 START 16;
CREATE SEQUENCE password_seq INCREMENT 1 START 16;
CREATE SEQUENCE reviews_seq INCREMENT 1 START 16;
CREATE SEQUENCE movies_seq INCREMENT 1 START 16;
CREATE SEQUENCE watch_seq INCREMENT 1 START 12;

CREATE ROLE admin;
CREATE ROLE viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Movies" TO admin;
GRANT SELECT ON "Movies" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Users" TO admin;
GRANT INSERT ON "Users" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Reviews" TO admin;
GRANT SELECT, INSERT ON "Reviews" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Directors" TO admin;
GRANT SELECT ON "Directors" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "WatchHistory" TO admin;
GRANT SELECT, INSERT ON "WatchHistory" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Genre" TO admin;
GRANT SELECT ON "Genre" TO viewer;

GRANT SELECT, INSERT, UPDATE, DELETE ON "Subscriptions" TO admin;
GRANT SELECT, UPDATE ON "Subscriptions" TO viewer;

CREATE USER cinema_admin WITH PASSWORD 'secure_password';
GRANT admin TO cinema_admin;
