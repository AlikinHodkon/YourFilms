-- Create database
CREATE DATABASE online_cinema;
\c online_cinema;

-- Create "Genre" table
CREATE TABLE "Genre" (
  "genre_id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT
);

-- Create "Directors" table
CREATE TABLE "Directors" (
  "director_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "birth_date" DATE,
  "biography" TEXT
);

-- Create "Movies" table
CREATE TABLE "Movies" (
  "movie_id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "genre_id" INT REFERENCES "Genre"("genre_id"),
  "release_date" DATE,
  "director_id" INT REFERENCES "Directors"("director_id"),
  "rating" DECIMAL(3,1) CHECK (rating >= 0 AND rating <= 10)
);

-- Create "Users" table
CREATE TABLE "Users" (
  "user_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(100) NOT NULL,
  "last_name" VARCHAR(100) NOT NULL,
  "email" VARCHAR(255) UNIQUE NOT NULL,
  "registration_date" DATE DEFAULT CURRENT_DATE
);

-- Create "WatchHistory" table
CREATE TABLE "WatchHistory" (
  "watch_id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "movie_id" INT REFERENCES "Movies"("movie_id") ON DELETE CASCADE,
  "watch_date" DATE NOT NULL,
  "watch_time" TIME NOT NULL
);

-- Create "Reviews" table
CREATE TABLE "Reviews" (
  "review_id" SERIAL PRIMARY KEY,
  "movie_id" INT REFERENCES "Movies"("movie_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "text" TEXT NOT NULL,
  "rating" INT CHECK (rating >= 1 AND rating <= 10),
  "review_date" DATE DEFAULT CURRENT_DATE
);

-- Create "Subscriptions" table
CREATE TABLE "Subscriptions" (
  "subscription_id" SERIAL PRIMARY KEY,
  "user_id" INT REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "subscription_type" VARCHAR(50) NOT NULL,
  "start_date" DATE DEFAULT CURRENT_DATE,
  "end_date" DATE
);

-- Create "Passwords" table
CREATE TABLE "Passwords" (
  "user_id" INT PRIMARY KEY REFERENCES "Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE,
  "password" VARCHAR(255) NOT NULL
);

-- Create sequences
CREATE SEQUENCE users_seq INCREMENT 1 START 16;
CREATE SEQUENCE password_seq INCREMENT 1 START 16;
CREATE SEQUENCE reviews_seq INCREMENT 1 START 16;
CREATE SEQUENCE movies_seq INCREMENT 1 START 16;
CREATE SEQUENCE watch_seq INCREMENT 1 START 12;

-- Create roles
CREATE ROLE admin;
CREATE ROLE viewer;

-- Grant permissions to roles
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

-- Create admin user and assign role
CREATE USER cinema_admin WITH PASSWORD 'secure_password';
GRANT admin TO cinema_admin;