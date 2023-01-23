CREATE DATABASE getter;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    contact VARCHAR(9) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(32) NOT NULL,
    avatar VARCHAR(128) DEFAULT 'https://pbs.twimg.com/profile_images/1435865990059986945/eHkoYnjx_400x400.jpg',
    profession VARCHAR(32) NOT NULL,
    role VARCHAR(10) DEFAULT 'user'
);


CREATE TABLE articles (
    id serial PRIMARY KEY,
    user_id bigint REFERENCES users(id),
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    likes bigint DEFAULT 0,
    dislikes BIGINT DEFAULT 0,
    views BIGINT DEFAULT 0
);

CREATE TABLE comments (
    id serial,
    art_id BIGINT REFERENCES articles(id),
    user_id BIGINT REFERENCES users(id),
    comment VARCHAR(256) NOT NULL 
);



