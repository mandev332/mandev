CREATE DATABASE getter;

CREATE TABLE users (
    id serial PRIMARY KEY,
    username VARCHAR(32) NOT NULL,
    contact VARCHAR(9) UNIQUE NOT NULL,
    email VARCHAR(128) UNIQUE NOT NULL,
    password VARCHAR(64) NOT NULL,
    avatar VARCHAR(128) DEFAULT 'https://pbs.twimg.com/profile_images/1435865990059986945/eHkoYnjx_400x400.jpg',
    profession VARCHAR(32) NOT NULL,
    role VARCHAR(10) DEFAULT 'user',
    gender varchar(10) default 'male'
);
drop TABLE users;
Alter table users add column gender varchar(10) default 'male'; 
ALTER TABLE users ALTER COLUMN password type varchar(64) not null;

CREATE TABLE articles (
    id serial PRIMARY KEY,
    user_id bigint REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(256) NOT NULL,
    description TEXT NOT NULL,
    likes bigint DEFAULT 0,
    dislikes BIGINT DEFAULT 0,
    views BIGINT DEFAULT 0
);
drop TABLE articles;

CREATE TABLE comments (
    id serial,
    art_id BIGINT REFERENCES articles(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    comment VARCHAR(256) NOT NULL 
);

drop TABLE comments;
                                    
-- INSERT INTO users (username,contact,email,password,profession,role) VALUES 
-- ('Shaxboz D' ,'993521767','shaxa@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabbf','UX/UI Disayner' , 'admin')
INSERT INTO users (username,contact,email,password,profession) VALUES 
('Shaxboz D1' ,'993500001','shaxa1@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb1','UX/UI Disayner1'),
('Shaxboz D2' ,'993500002','shaxa2@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb2','UX/UI Disayner2'),
('Shaxboz D3' ,'993500003','shaxa3@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb3','UX/UI Disayner3'),
('Shaxboz D4' ,'993500004','shaxa4@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb4','UX/UI Disayner4'),
('Shaxboz D5' ,'993500005','shaxa5@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb5','UX/UI Disayner5'),
('Shaxboz D6' ,'993500006','shaxa6@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb6','UX/UI Disayner6'),
('Shaxboz D7' ,'993500007','shaxa7@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb7','UX/UI Disayner7'),
('Shaxboz D8' ,'993500008','shaxa8@gmail.com','038f270ca678c66f5bf393f958e8eebcf98b049e5a0d32a69cabf46b576cabb8','UX/UI Disayner8');



INSERT INTO articles (user_id,title,description) VALUES
(2,'Disaynda nimalar muhim','Mazkur darslikda marketing asoslarining asosiy holatlari yoritilgan. Marketing tushunchasi
va marketingning mohiyati batafsil bayon etilgan. Uning rivojlanish evolyusiyasi, konsepsiyalari,
funksiyalari, vazifalari va turlari yozilgan. Marketing faoliyatini axborot ta''minoti va marketing
muhiti muhokama etilgan. Iste''molchi va biznes - xaridorlar xulq-atvorini o''rganish, tovar va
xizmatlar: iste''mol qiymatini oshirish masalalariga katta e''tibor berilgan. Reklama faoliyati, chakana
savdo va ulgurji savdo, narx siyosati masalalari keng bayon etilgan. Shuningdek, darslikning har bir
mavzusi bo''yicha nazorat savollari, testlar va glossariy berilgan.
Mazkur darslik bakalavriatning “Marketing (tarmoqlar va sohalar bo''yicha)”, “Marketing
(reklama ishi)”, “Savdo ishi (turlari bo''yicha)” ta''lim yo''nalishlari talabalari, magistrlari, iqtisodiy
oliy ta''lim muassasalari va fakultetlari o''qituvchilari, qayta tayyorlash va malakasini oshirish kursi
tinglovchilari, marketing sohasi bo''yicha qiziquvchi keng kitobxonlar uchun mo''ljallangan.'),
(3,'Disaynda nimalar muhim','Mazkur darslikda marketing asoslarining asosiy holatlari yoritilgan. Marketing tushunchasi
va marketingning mohiyati batafsil bayon etilgan. Uning rivojlanish evolyusiyasi, konsepsiyalari,
funksiyalari, vazifalari va turlari yozilgan. Marketing faoliyatini axborot ta''minoti va marketing
muhiti muhokama etilgan. Iste''molchi va biznes - xaridorlar xulq-atvorini o''rganish, tovar va
xizmatlar: iste''mol qiymatini oshirish masalalariga katta e''tibor berilgan. Reklama faoliyati, chakana
savdo va ulgurji savdo, narx siyosati masalalari keng bayon etilgan. Shuningdek, darslikning har bir
mavzusi bo''yicha nazorat savollari, testlar va glossariy berilgan.
Mazkur darslik bakalavriatning “Marketing (tarmoqlar va sohalar bo''yicha)”, “Marketing
(reklama ishi)”, “Savdo ishi (turlari bo''yicha)” ta''lim yo''nalishlari talabalari, magistrlari, iqtisodiy
oliy ta''lim muassasalari va fakultetlari o''qituvchilari, qayta tayyorlash va malakasini oshirish kursi
tinglovchilari, marketing sohasi bo''yicha qiziquvchi keng kitobxonlar uchun mo''ljallangan.'),
(4,'Disaynda nimalar muhim','Mazkur darslikda marketing asoslarining asosiy holatlari yoritilgan. Marketing tushunchasi
va marketingning mohiyati batafsil bayon etilgan. Uning rivojlanish evolyusiyasi, konsepsiyalari,
funksiyalari, vazifalari va turlari yozilgan. Marketing faoliyatini axborot ta''minoti va marketing
muhiti muhokama etilgan. Iste''molchi va biznes - xaridorlar xulq-atvorini o''rganish, tovar va
xizmatlar: iste''mol qiymatini oshirish masalalariga katta e''tibor berilgan. Reklama faoliyati, chakana
savdo va ulgurji savdo, narx siyosati masalalari keng bayon etilgan. Shuningdek, darslikning har bir
mavzusi bo''yicha nazorat savollari, testlar va glossariy berilgan.
Mazkur darslik bakalavriatning “Marketing (tarmoqlar va sohalar bo''yicha)”, “Marketing
(reklama ishi)”, “Savdo ishi (turlari bo''yicha)” ta''lim yo''nalishlari talabalari, magistrlari, iqtisodiy
oliy ta''lim muassasalari va fakultetlari o''qituvchilari, qayta tayyorlash va malakasini oshirish kursi
tinglovchilari, marketing sohasi bo''yicha qiziquvchi keng kitobxonlar uchun mo''ljallangan.'),
(4,'Disaynda nimalar muhim','Mazkur darslikda marketing asoslarining asosiy holatlari yoritilgan. Marketing tushunchasi
va marketingning mohiyati batafsil bayon etilgan. Uning rivojlanish evolyusiyasi, konsepsiyalari,
funksiyalari, vazifalari va turlari yozilgan. Marketing faoliyatini axborot ta''minoti va marketing
muhiti muhokama etilgan. Iste''molchi va biznes - xaridorlar xulq-atvorini o''rganish, tovar va
xizmatlar: iste''mol qiymatini oshirish masalalariga katta e''tibor berilgan. Reklama faoliyati, chakana
savdo va ulgurji savdo, narx siyosati masalalari keng bayon etilgan. Shuningdek, darslikning har bir
mavzusi bo''yicha nazorat savollari, testlar va glossariy berilgan.
Mazkur darslik bakalavriatning “Marketing (tarmoqlar va sohalar bo''yicha)”, “Marketing
(reklama ishi)”, “Savdo ishi (turlari bo''yicha)” ta''lim yo''nalishlari talabalari, magistrlari, iqtisodiy
oliy ta''lim muassasalari va fakultetlari o''qituvchilari, qayta tayyorlash va malakasini oshirish kursi
tinglovchilari, marketing sohasi bo''yicha qiziquvchi keng kitobxonlar uchun mo''ljallangan.'),
(5,'Disaynda nimalar muhim','Mazkur darslikda marketing asoslarining asosiy holatlari yoritilgan. Marketing tushunchasi
va marketingning mohiyati batafsil bayon etilgan. Uning rivojlanish evolyusiyasi, konsepsiyalari,
funksiyalari, vazifalari va turlari yozilgan. Marketing faoliyatini axborot ta''minoti va marketing
muhiti muhokama etilgan. Iste''molchi va biznes - xaridorlar xulq-atvorini o''rganish, tovar va
xizmatlar: iste''mol qiymatini oshirish masalalariga katta e''tibor berilgan. Reklama faoliyati, chakana
savdo va ulgurji savdo, narx siyosati masalalari keng bayon etilgan. Shuningdek, darslikning har bir
mavzusi bo''yicha nazorat savollari, testlar va glossariy berilgan.
Mazkur darslik bakalavriatning “Marketing (tarmoqlar va sohalar bo''yicha)”, “Marketing
(reklama ishi)”, “Savdo ishi (turlari bo''yicha)” ta''lim yo''nalishlari talabalari, magistrlari, iqtisodiy
oliy ta''lim muassasalari va fakultetlari o''qituvchilari, qayta tayyorlash va malakasini oshirish kursi
tinglovchilari, marketing sohasi bo''yicha qiziquvchi keng kitobxonlar uchun mo''ljallangan.');




INSERT INTO comments (user_id, art_id, comment) VALUES
(2,3,'zo''r maqola bo''lindi'),
(2,4,'yaxshi maqola bo''lindi'),
(3,5,'maqola chala bo''lindi'),
(3,4,'maqola dabdala bo''lindi'),
(4,1,'zo''r'),
(4,2,'o''rtacha mavzu bo''libdi'),
(5,3,'tushunushga qiyin maqola bo''lindi'),
(5,2,'real maqola bo''lindi');