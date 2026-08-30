-- Seeded database of schellingboard v3.0.0, dumped by
-- scripts/dump-release-db.ts. Fixture for the release-upgrade tests.
PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE "__drizzle_migrations" (
				id SERIAL PRIMARY KEY,
				hash text NOT NULL,
				created_at numeric
			);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'1107df38b4290b4fe1dd281c08573221561a93785a32d0f95120bc1abb2293bb',1776427018156);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'ffba427f6f60483ba8d47ffc022d5a078e1eefa9b820e30348dd46c6ad44b0c0',1776795822236);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'356e1628cb2abed39061f9958d073374db752a99959e1c7e023f7a379ecf6340',1777365674121);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'fb0024c12ea40cacadf432c3ecf9a38f70917be2e35fb2670c72695937b5d1e8',1777369604281);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'d92e421279d2ed826852535efb5075188ad8d3a95c299ed7e9369cda390c02e6',1782260306200);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'7b4b5653b9d3666e281c52a28d9aab6f81115daf5fbd2d9b6b983f1487fcfb23',1782331084625);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'be46c00b651f68f6c13cea7c8c60ba178eac563696ee4b8abc2d891461ad8656',1782396063145);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'4b28a6d190edd34912a1d2ce998419b53ffedb1a90f2e8afa83f1a3a8fcd3670',1783004074395);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'10b65f397b8eec06313e3b9ed40bb7812bfd37a2cfea5be1b6204b419b02ae07',1782451329873);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'f573093161db7ab68113a94c5ed65e33c9a8aa6142132a331ad9adee93a4ecf2',1783287753472);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'959b1b205942f98ae1430461005c5bd8ce98e8e3f38dd2336045b34b249f3b5c',1783288151579);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'f30a6e7a956bd34d19a1f85d90a90626e1ff862ac5d3505ef701a427692222f5',1783288200000);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'0a82023b26cb7e52fac9702ce1860077669bf9f2330d296716b41e354bde723d',1783662363022);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'c001b84f21fe61e440f384051526fcd33c37494d02fbb02c6e2c701b07dc9fea',1783663059092);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'e6d5910a78cc22431175bf8d68e7977a68083d224453f1c6d6aa32295957fc71',1783757368893);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'b8c8dd4789e283a3ac5b63729cb546a5f99041d27379eb9390ed5a83f46f536a',1783801789716);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'d6bda58a06b8be594dbe2bf6d09b8fe7c6462ef825b87fe863b80ce4d8914cbf',1783803215955);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'47e5fe9f141fc5ec50b0c1eed84b1301663ac88753e3ec1a7225e21454baae58',1783841298927);
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text);
INSERT INTO "guests" VALUES('hmeU5KNTWcdGa1doWjRd9','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/hmeU5KNTWcdGa1doWjRd9.webp?v=1788081880746','She/Her');
INSERT INTO "guests" VALUES('ste9pbf0hLH2a43accXCS','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/ste9pbf0hLH2a43accXCS.webp?v=1788081880746','He/Him');
INSERT INTO "guests" VALUES('3PdLZvpXKNLCLbPkaJoy3','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/3PdLZvpXKNLCLbPkaJoy3.webp?v=1788081880746','They/Them');
INSERT INTO "guests" VALUES('-coPgZYrCs5TTFyoBAcMD','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him');
INSERT INTO "guests" VALUES('2YuFDHTXeDrbQaU7CG2c1','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL);
INSERT INTO "guests" VALUES('iG4ETfikNNkaFMR-X-AO0','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her');
INSERT INTO "guests" VALUES('1puE4Cdyq9tNRE9pxcrRO','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/1puE4Cdyq9tNRE9pxcrRO.webp?v=1788081880746',NULL);
INSERT INTO "guests" VALUES('GDaU8eaGyH_MMopXdC3bg','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/GDaU8eaGyH_MMopXdC3bg.webp?v=1788081880746','She/Her');
INSERT INTO "guests" VALUES('gkbOFJBri0Y74DSbKGuEn','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/gkbOFJBri0Y74DSbKGuEn.webp?v=1788081880747','He/Him');
INSERT INTO "guests" VALUES('N99ZbmHNInlJIc0pzsDB3','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/N99ZbmHNInlJIc0pzsDB3.webp?v=1788081880747',NULL);
INSERT INTO "guests" VALUES('RzbNqOWciWpnsvL8yJnhx','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/RzbNqOWciWpnsvL8yJnhx.webp?v=1788081880747','He/Him');
INSERT INTO "guests" VALUES('-YwFojcWJ2z-AteCp7e5O','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/-YwFojcWJ2z-AteCp7e5O.webp?v=1788081880747',NULL);
INSERT INTO "guests" VALUES('dhyPdGQxc1eiHdm0-idx9','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/dhyPdGQxc1eiHdm0-idx9.webp?v=1788081880747','She/Her');
INSERT INTO "guests" VALUES('cUQpDPWN7IObgbla51ghT','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/cUQpDPWN7IObgbla51ghT.webp?v=1788081880747',NULL);
INSERT INTO "guests" VALUES('jqxLKnsgxzS-fcHRaReUI','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/jqxLKnsgxzS-fcHRaReUI.webp?v=1788081880747','She/Her');
INSERT INTO "guests" VALUES('tz3P2uFzzi0K1V-x4HMMR','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/tz3P2uFzzi0K1V-x4HMMR.webp?v=1788081880748',NULL);
INSERT INTO "guests" VALUES('lj9v1uZ2o8OtlHNj-3fvS','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/lj9v1uZ2o8OtlHNj-3fvS.webp?v=1788081880748','He/Him');
INSERT INTO "guests" VALUES('Ftftdc_6-yH9pLYxmZCx7','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/Ftftdc_6-yH9pLYxmZCx7.webp?v=1788081880748',NULL);
INSERT INTO "guests" VALUES('NFod0512W-UH1tU-kqqd8','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/NFod0512W-UH1tU-kqqd8.webp?v=1788081880748','She/Her');
INSERT INTO "guests" VALUES('zTPZvK-rtxMqZcVzoPRZ3','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/zTPZvK-rtxMqZcVzoPRZ3.webp?v=1788081880748',NULL);
INSERT INTO "guests" VALUES('m-FNvWV6j1B8yIWQPYY40','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/m-FNvWV6j1B8yIWQPYY40.webp?v=1788081880748','She/Her');
INSERT INTO "guests" VALUES('D6PSdN5NT0uvU-VFZX94M','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/D6PSdN5NT0uvU-VFZX94M.webp?v=1788081880748','They/Them');
INSERT INTO "guests" VALUES('7ZZ3fWif0qvvZJB3ndZMS','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/7ZZ3fWif0qvvZJB3ndZMS.webp?v=1788081880748',NULL);
INSERT INTO "guests" VALUES('LP0ZIKX53XhF0B9HBise0','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her');
INSERT INTO "guests" VALUES('OcUsDjmG5mPGWdD95qozb','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL);
INSERT INTO "guests" VALUES('XEnOXP8OC-9hk1Q9fPErA','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him');
INSERT INTO "guests" VALUES('354fllwixED-kiPUmddaE','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL);
INSERT INTO "guests" VALUES('v4WRDws9hUNrYunmPokrV','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL);
INSERT INTO "guests" VALUES('waBcbIXaH-j8w4SRAdfsi','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them');
INSERT INTO "guests" VALUES('wYJlokZ71siGUG8E7orKn','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL);
INSERT INTO "guests" VALUES('an4-5R62YaoMgJbqSkJNd','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL);
INSERT INTO "guests" VALUES('KEs5rqPHZMQSFnHn02fkG','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her');
INSERT INTO "guests" VALUES('81iMSJg7Ylm5WE34UaJ8T','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL);
INSERT INTO "guests" VALUES('gIItrWYGF5PJad8FE2opQ','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL);
INSERT INTO "guests" VALUES('-G-Xgn-agUctaWsOzil44','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.',NULL,'She/Her');
INSERT INTO "guests" VALUES('ru5-Wk1IPwzNhTjc6aeu9','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL);
INSERT INTO "guests" VALUES('sU8I1Y1zxKZt03uLqlUJt','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him');
INSERT INTO "guests" VALUES('p9NPINJOY-dogGJAap8eQ','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL);
INSERT INTO "guests" VALUES('2cdADeyRQA5uKgxmc46WZ','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL);
INSERT INTO "guests" VALUES('6qkUzJr_1ABY3_YG3ox0U','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They');
CREATE TABLE `locations` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`image_url` text DEFAULT '' NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`capacity` integer DEFAULT 0 NOT NULL,
	`color` text DEFAULT '' NOT NULL,
	`hidden` integer DEFAULT false NOT NULL,
	`bookable` integer DEFAULT false NOT NULL,
	`sort_index` integer DEFAULT 0 NOT NULL,
	`area_description` text
);
INSERT INTO "locations" VALUES('loc-main-hall','Main Hall','/locations/loc-main-hall.jpg','Our largest venue, featuring a professional stage with tiered seating. Equipped with full AV including projector and sound system. Ideal for keynotes, panels, and large-audience sessions.',100,'blue',0,1,1,'Ground floor, East Wing');
INSERT INTO "locations" VALUES('loc-room-a','Workshop Room','/locations/loc-room-a.jpg','A bright breakout room with whiteboards and flexible seating. Natural light and a relaxed atmosphere make it well suited for workshops and interactive sessions.',30,'green',0,1,2,'1st floor, West Wing');
INSERT INTO "locations" VALUES('loc-room-b','Garden Terrace','/locations/loc-room-b.jpg','An informal outdoor space with picnic tables overlooking the lake. Perfect for open-space sessions, unconference discussions, and casual networking.',25,'red',0,1,3,'Outdoor, South Courtyard');
CREATE TABLE "days" (
	`id` text PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`start_bookings` text NOT NULL,
	`end_bookings` text NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "days" VALUES('noH6YF86UXyArIW5khlFF','2026-10-11T07:00:00.000Z','2026-10-11T16:00:00.000Z','2026-10-11T07:00:00.000Z','2026-10-11T15:30:00.000Z','gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "days" VALUES('ELveQRXKSb7Sbzu62Emtm','2026-10-12T07:00:00.000Z','2026-10-12T16:00:00.000Z','2026-10-12T07:00:00.000Z','2026-10-12T15:30:00.000Z','gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "days" VALUES('H4tKHnxyv-e7-34-Sjeem','2026-10-13T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-10-13T07:00:00.000Z','2026-10-13T15:30:00.000Z','gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "days" VALUES('NJ1_LS_tj6sbrprTpt91s','2026-09-27T07:00:00.000Z','2026-09-27T16:00:00.000Z','2026-09-27T07:00:00.000Z','2026-09-27T15:30:00.000Z','5CEfgK22iDcfivfXUlzIK');
INSERT INTO "days" VALUES('Igm0UIx-eL3u0bAWWZDVg','2026-09-28T07:00:00.000Z','2026-09-28T16:00:00.000Z','2026-09-28T07:00:00.000Z','2026-09-28T15:30:00.000Z','5CEfgK22iDcfivfXUlzIK');
INSERT INTO "days" VALUES('MRwBY0WYv-6DCdesq8P1z','2026-09-29T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-09-29T07:00:00.000Z','2026-09-29T15:30:00.000Z','5CEfgK22iDcfivfXUlzIK');
INSERT INTO "days" VALUES('QiOHeFr78PR-JgmgnTnQl','2026-09-13T07:00:00.000Z','2026-09-13T16:00:00.000Z','2026-09-13T07:00:00.000Z','2026-09-13T15:30:00.000Z','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "days" VALUES('x0YexQuVPQhkRuAbtvh1k','2026-09-14T07:00:00.000Z','2026-09-14T16:00:00.000Z','2026-09-14T07:00:00.000Z','2026-09-14T15:30:00.000Z','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "days" VALUES('wQ890TYG4-BJic3ONikr5','2026-09-15T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-09-15T07:00:00.000Z','2026-09-15T15:30:00.000Z','qI_s7M26JrYRkOEO3JLC9');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','ste9pbf0hLH2a43accXCS');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','cUQpDPWN7IObgbla51ghT');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','NFod0512W-UH1tU-kqqd8');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','354fllwixED-kiPUmddaE');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','v4WRDws9hUNrYunmPokrV');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','wYJlokZ71siGUG8E7orKn');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','-G-Xgn-agUctaWsOzil44');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "event_guests" VALUES('gu4RdXjUv7HwTxd7IVXYE','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','ste9pbf0hLH2a43accXCS');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','cUQpDPWN7IObgbla51ghT');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','NFod0512W-UH1tU-kqqd8');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','354fllwixED-kiPUmddaE');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','v4WRDws9hUNrYunmPokrV');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','wYJlokZ71siGUG8E7orKn');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','-G-Xgn-agUctaWsOzil44');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "event_guests" VALUES('5CEfgK22iDcfivfXUlzIK','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','ste9pbf0hLH2a43accXCS');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','cUQpDPWN7IObgbla51ghT');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','NFod0512W-UH1tU-kqqd8');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','354fllwixED-kiPUmddaE');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','v4WRDws9hUNrYunmPokrV');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','wYJlokZ71siGUG8E7orKn');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','-G-Xgn-agUctaWsOzil44');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "event_guests" VALUES('qI_s7M26JrYRkOEO3JLC9','6qkUzJr_1ABY3_YG3ox0U');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('gu4RdXjUv7HwTxd7IVXYE','loc-main-hall');
INSERT INTO "event_locations" VALUES('gu4RdXjUv7HwTxd7IVXYE','loc-room-a');
INSERT INTO "event_locations" VALUES('gu4RdXjUv7HwTxd7IVXYE','loc-room-b');
INSERT INTO "event_locations" VALUES('5CEfgK22iDcfivfXUlzIK','loc-main-hall');
INSERT INTO "event_locations" VALUES('5CEfgK22iDcfivfXUlzIK','loc-room-a');
INSERT INTO "event_locations" VALUES('5CEfgK22iDcfivfXUlzIK','loc-room-b');
INSERT INTO "event_locations" VALUES('qI_s7M26JrYRkOEO3JLC9','loc-main-hall');
INSERT INTO "event_locations" VALUES('qI_s7M26JrYRkOEO3JLC9','loc-room-a');
INSERT INTO "event_locations" VALUES('qI_s7M26JrYRkOEO3JLC9','loc-room-b');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('IUwfe1aRfFkWVa7PMxHnb','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "proposal_hosts" VALUES('8waEFHlLVOkwRw8fdWrHC','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('nyrX71Mj217bZv6pXf2bf','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "proposal_hosts" VALUES('PVLZ1svF13zK-dcihHKbg','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "proposal_hosts" VALUES('PVLZ1svF13zK-dcihHKbg','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "proposal_hosts" VALUES('SqPDef3noFvIDq28DFwWb','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "proposal_hosts" VALUES('SqPDef3noFvIDq28DFwWb','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "proposal_hosts" VALUES('XokxW-A-I86WjwUr4-Fc_','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "proposal_hosts" VALUES('ZsB3A_6ed7iaJeGTQwjLi','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "proposal_hosts" VALUES('O1uF6oEHga2tW0zV1jrjl','ste9pbf0hLH2a43accXCS');
INSERT INTO "proposal_hosts" VALUES('KTQiBDa3P9fy1MiIHsJEx','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('BlKtBb0Tvca-lyv6jFc3h','ste9pbf0hLH2a43accXCS');
INSERT INTO "proposal_hosts" VALUES('V5B17QW5YEJuVSjHMDL5p','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('dGZJuJH7SYwkI4qhuCuvd','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "proposal_hosts" VALUES('dGZJuJH7SYwkI4qhuCuvd','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "proposal_hosts" VALUES('UMQf52WBtNorETgzVkLSW','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "proposal_hosts" VALUES('U9sHNwgZTgtF_OQMJDymZ','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "proposal_hosts" VALUES('yuVD_Manq87RpLmvvSrzc','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "proposal_hosts" VALUES('W422dBNSD2-QmPqkol9kU','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "proposal_hosts" VALUES('W422dBNSD2-QmPqkol9kU','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "proposal_hosts" VALUES('CalsDrB_y0I2s_ljI6Gob','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "proposal_hosts" VALUES('8eH3wtDPP6r_B9Th-_X_F','ste9pbf0hLH2a43accXCS');
INSERT INTO "proposal_hosts" VALUES('X7zP3cW2GBPeor7JE7AOj','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('vKiQbl76ZS1aubNTjedb4','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "proposal_hosts" VALUES('oD6jt9txnx4Uvx31HLant','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('-8txLCEu8vcQESc_tDTKs','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "proposal_hosts" VALUES('5F3Mvt-cCjQ3qSptvWU2q','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "proposal_hosts" VALUES('CODB-HHby_9JDHauPfvXn','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "proposal_hosts" VALUES('pR3qhD4wrMMebzWZ98jBq','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "proposal_hosts" VALUES('3EQeWJocskET5PllemdkF','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "proposal_hosts" VALUES('mjstEcea55Ib7G4aERzt9','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "proposal_hosts" VALUES('1MCFA1v1vbb-Snt3gkyfA','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "proposal_hosts" VALUES('9FD9MdIOCxs_bljKdML0c','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "proposal_hosts" VALUES('dU6PFdB1mdaie8JycD5b3','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "proposal_hosts" VALUES('jZd9vhNImirOMhmkrgci7','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "proposal_hosts" VALUES('VxF619A-RwJlD8wUO9jvI','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "proposal_hosts" VALUES('K2QYSpKe2bz5zb80oP0nM','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "proposal_hosts" VALUES('HpZmwXgQxAYZrSIvLNlYc','ste9pbf0hLH2a43accXCS');
INSERT INTO "proposal_hosts" VALUES('HpZmwXgQxAYZrSIvLNlYc','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "proposal_hosts" VALUES('2RrDDgXvCVZLkkgaWeCib','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "proposal_hosts" VALUES('ddfEz3v0G3MPpA8CGszD0','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "proposal_hosts" VALUES('SmjNwiPYUgMFsep5mYG-U','cUQpDPWN7IObgbla51ghT');
INSERT INTO "proposal_hosts" VALUES('s5dHLHyFPqZNCsYMenhXh','N99ZbmHNInlJIc0pzsDB3');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('rOIVe6IoPNtAzSmh9Owdr','DkfeMFj6BBFIXToTX6CJF','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "rsvps" VALUES('_-gRTd1yTGCHDZbHIDkh4','blkhHv_BtMJXt7aI7FK0e','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "rsvps" VALUES('S0OHoqT-3rB3khI7-HA4J','9nwSqZDnfNu2vzN7fDiXP','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "rsvps" VALUES('E5t-xp-IgY7YW66LMf8XP','p1JD-8qRY-3DYAS1IRz-b','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "rsvps" VALUES('EV0YjIHLCAi3pyX7Ojjcw','-oQBLASgnXYbbHFeIrAmO','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "rsvps" VALUES('BFgyIThDTf4UDr48amKRe','DkfeMFj6BBFIXToTX6CJF','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('CyIl_MQsWHhaXdzMFvRi9','blkhHv_BtMJXt7aI7FK0e','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('YTdJr4UVoHrlwiQRfICgh','9nwSqZDnfNu2vzN7fDiXP','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('zpRGJ6snTVYSDZIcuwqOZ','cM9LgnjJZdXQ6aKPuaIy5','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('gAH1_WyCvpEtRwV5hgdRy','kN5NZvEHg1F-3zsgLRMU1','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('tVNpTW-UaURTrs6SungY8','nvlK7D7EhHT6f3yF4eEIB','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('I2JVEaoI6xJyRHFOWZQIb','_80fvPJrQEa-QtAjanWer','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('VWTU-x_Cf3VEOebAT_szk','h9RLofNGtz_DOFNeOnPcv','ste9pbf0hLH2a43accXCS');
INSERT INTO "rsvps" VALUES('OLZ3e-Xivyb2BEmpeXquf','oh6zIo5h51yRCPh1hsAzL','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "rsvps" VALUES('aSSjWge3gguRX3flrgjCv','cM9LgnjJZdXQ6aKPuaIy5','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "rsvps" VALUES('neu20EW2TDbROvvG_NiAp','kN5NZvEHg1F-3zsgLRMU1','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "rsvps" VALUES('Wdu-uCdQomZdEHhudrl2x','1GRIWqjXjR8qLkBkMbpG6','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "rsvps" VALUES('EmFC8F318KIHWpcN_BpNX','kN5NZvEHg1F-3zsgLRMU1','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "rsvps" VALUES('RoiNId91T3MLmya389Rla','h1pOtrm3iDQOGQAZp0T8t','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('qLb0hdDaA-06hamI1aeYG','sLBMlWHTRFTozHcWi7q3Y','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('lJapmFHUJFjGYV7ZA6Ee1','MPFN48fLp-kpouDs7EdL4','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('opR_l9q94AaROo9cL9Qqw','-oQBLASgnXYbbHFeIrAmO','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('mRQ7ettaZGOYYcZaBO_EE','_80fvPJrQEa-QtAjanWer','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('7EB6FezxIi0kfBN-PTBgB','h9RLofNGtz_DOFNeOnPcv','2YuFDHTXeDrbQaU7CG2c1');
INSERT INTO "rsvps" VALUES('-6jTk2H55gwOhrnfieVo7','h1pOtrm3iDQOGQAZp0T8t','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('8_oJSpLK0E1NJZyTywsOP','oh6zIo5h51yRCPh1hsAzL','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('1CGE6WLtTQmZ1nT9fp_Kc','p1JD-8qRY-3DYAS1IRz-b','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('L1CqWsyluBdYuysW7BJF1','kN5NZvEHg1F-3zsgLRMU1','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('XB4MQGTKmXq5p7TP3vQRY','1GRIWqjXjR8qLkBkMbpG6','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('IXtf7KBY71-09KRqv1gnN','-oQBLASgnXYbbHFeIrAmO','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "rsvps" VALUES('G_cVlC2NGoKNcy6Uucd40','sLBMlWHTRFTozHcWi7q3Y','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "rsvps" VALUES('ulcFIuePLIsEaANsaUV7l','9nwSqZDnfNu2vzN7fDiXP','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "rsvps" VALUES('Zm3ySeuRdtTr1Tstt_c9H','kUJpF343wm50hBnMCSPBh','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "rsvps" VALUES('FZEpAJUkC85NZgmeiPKCj','nvlK7D7EhHT6f3yF4eEIB','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "rsvps" VALUES('gQdMos9-loLpTUK0SfY06','_80fvPJrQEa-QtAjanWer','1puE4Cdyq9tNRE9pxcrRO');
INSERT INTO "rsvps" VALUES('-FrhXtUAo_MokFVMvm10A','sLBMlWHTRFTozHcWi7q3Y','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('--IRuUxdlW3oZg-rBsUJl','oh6zIo5h51yRCPh1hsAzL','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('AEj2n8Yvv5TORtPj5n3mB','WB7SloVoHEkXO5i4n72UZ','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('Tt9GnMwsKUZMZNpES2vJB','1GRIWqjXjR8qLkBkMbpG6','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('DhgLx00xcE64bvLQGVh9W','nvlK7D7EhHT6f3yF4eEIB','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('Hxtsg84ujc8XSVJh4sKSK','_80fvPJrQEa-QtAjanWer','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "rsvps" VALUES('RuxOMvBA0hPL8I_UrugWw','DkfeMFj6BBFIXToTX6CJF','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "rsvps" VALUES('zWXZd-974Et9K7MqXU6TO','9nwSqZDnfNu2vzN7fDiXP','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "rsvps" VALUES('Ptlqc2bk6r4j3H4WN0D-P','MPFN48fLp-kpouDs7EdL4','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "rsvps" VALUES('jke9_aDkMnf8yy2ccUr2D','1GRIWqjXjR8qLkBkMbpG6','gkbOFJBri0Y74DSbKGuEn');
INSERT INTO "rsvps" VALUES('Q1ov2Vqr4D7HTJIyZcvrh','h1pOtrm3iDQOGQAZp0T8t','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('G7875mLHPnblYR9erLaeo','sLBMlWHTRFTozHcWi7q3Y','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('mPbQICdDDg8WEVh74Uzud','p1JD-8qRY-3DYAS1IRz-b','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('CrzkZNfprkDneElndgot6','kUJpF343wm50hBnMCSPBh','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('kem5ZWoFyrKLgfZOtMByC','kN5NZvEHg1F-3zsgLRMU1','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('7OF9te0fphv6tXHWlsoff','MPFN48fLp-kpouDs7EdL4','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "rsvps" VALUES('SCV6Hj0Srvbh5u0WQm_Xb','h1pOtrm3iDQOGQAZp0T8t','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "rsvps" VALUES('gtTi-rgLKK1no1o3Y3oXI','p1JD-8qRY-3DYAS1IRz-b','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "rsvps" VALUES('tTVuzrHas6x4LetUcLdBk','kUJpF343wm50hBnMCSPBh','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "rsvps" VALUES('B0PpDGr8Q4nRqZImd3nux','a9cdPah-6VIvoo6Py1gFz','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "rsvps" VALUES('laQMwFsH4DvBp8TdJxC1q','1GRIWqjXjR8qLkBkMbpG6','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "rsvps" VALUES('5ythK77gYKWrjWIkeNODI','h1pOtrm3iDQOGQAZp0T8t','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "rsvps" VALUES('z9niDb4NsvvVRRVd_BcR6','sLBMlWHTRFTozHcWi7q3Y','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "rsvps" VALUES('FUlA4Lb46KSroezW4p_IH','9nwSqZDnfNu2vzN7fDiXP','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "rsvps" VALUES('U3k5GChJadK60LSYGhURp','cM9LgnjJZdXQ6aKPuaIy5','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "rsvps" VALUES('OsLeFvWXlZdeE-5M9m2Vl','MPFN48fLp-kpouDs7EdL4','-YwFojcWJ2z-AteCp7e5O');
INSERT INTO "rsvps" VALUES('s2C0j3sGYfljQ2qZsujir','h1pOtrm3iDQOGQAZp0T8t','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('ZEi-_1Ttp3cL6tA5JYDsY','sLBMlWHTRFTozHcWi7q3Y','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('3YgdC1ujKvPajIQbm9aZA','9nwSqZDnfNu2vzN7fDiXP','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('wnMVFoin-If1HXj8IUTCh','a9cdPah-6VIvoo6Py1gFz','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('MtnDtBX3hfaNh8xEnlnxn','WB7SloVoHEkXO5i4n72UZ','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('7f7eAVYWR17D0fFA7KLkZ','1GRIWqjXjR8qLkBkMbpG6','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "rsvps" VALUES('8ENyWRnmc50ARFt05hBKs','h1pOtrm3iDQOGQAZp0T8t','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('Uy8k1_EKCAyu6K_0xGtJ8','sLBMlWHTRFTozHcWi7q3Y','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('2j1ci2-P2ahhH28NOVEJv','blkhHv_BtMJXt7aI7FK0e','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('x0qyLpFkYxwteaFaFcoFJ','cM9LgnjJZdXQ6aKPuaIy5','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('nu8iZFY9XiCEqLRNY_0JB','kN5NZvEHg1F-3zsgLRMU1','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('1nR6_0RkoUveDOtXaD_Sq','WB7SloVoHEkXO5i4n72UZ','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('3IXFpuFpz9acAvf5CZuDi','1GRIWqjXjR8qLkBkMbpG6','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('GNJ3cuLj49oEHkS775KKo','h9RLofNGtz_DOFNeOnPcv','cUQpDPWN7IObgbla51ghT');
INSERT INTO "rsvps" VALUES('y6CbL02E-wpqHxV9Vf1d-','blkhHv_BtMJXt7aI7FK0e','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "rsvps" VALUES('ZTYdaEfYjFycq3mQ4fQca','p1JD-8qRY-3DYAS1IRz-b','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "rsvps" VALUES('rMLfzbBt7-Ptg5LL-64BI','cM9LgnjJZdXQ6aKPuaIy5','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "rsvps" VALUES('FHMNsqjuDWaBEHX8GhuSa','h9RLofNGtz_DOFNeOnPcv','jqxLKnsgxzS-fcHRaReUI');
INSERT INTO "rsvps" VALUES('619bFNlfchYshboKQpHVU','DkfeMFj6BBFIXToTX6CJF','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('JcWehYlRW6LBbwrr5S6FA','blkhHv_BtMJXt7aI7FK0e','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('ij0pD7XowJLyxNGaBMtdg','9nwSqZDnfNu2vzN7fDiXP','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('YWFa5MpURzS-avnQVywss','p1JD-8qRY-3DYAS1IRz-b','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('NxjGQZy8o3Bznn6jsgwco','WB7SloVoHEkXO5i4n72UZ','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('jDnlNEfaqYkR_kz2dG0iq','nvlK7D7EhHT6f3yF4eEIB','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "rsvps" VALUES('-9PvYlX9GFmjXT8eI37EO','h1pOtrm3iDQOGQAZp0T8t','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('TuE3VRpikgK_Kgjpqu41l','blkhHv_BtMJXt7aI7FK0e','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('EZzxmyWVg9RRN3lsi7upW','p1JD-8qRY-3DYAS1IRz-b','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('FaAbXJHKIZfX0enHs7Cu4','kUJpF343wm50hBnMCSPBh','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('HCpd2wEujxPYyH-soSPxY','kN5NZvEHg1F-3zsgLRMU1','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('4txvaM1Sx6KcUOwvP3e2C','-oQBLASgnXYbbHFeIrAmO','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('HEgZpcPB-tDktETvuC3dg','_80fvPJrQEa-QtAjanWer','lj9v1uZ2o8OtlHNj-3fvS');
INSERT INTO "rsvps" VALUES('O4XREdhWI5jpdNgQblFsT','h1pOtrm3iDQOGQAZp0T8t','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('PsOYo8XDb6VJEw9Rqv1fw','blkhHv_BtMJXt7aI7FK0e','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('GXKn2WmTuRRnQPv7myQga','p1JD-8qRY-3DYAS1IRz-b','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('o3hSS6rlGgGz-VfY-R6Ar','cM9LgnjJZdXQ6aKPuaIy5','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('a2RyI3rx0XNeDo436IHrJ','a9cdPah-6VIvoo6Py1gFz','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('ertf856iGiI9q6hFweH-7','-oQBLASgnXYbbHFeIrAmO','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('_osYeuSVHmmFSPaxjaaOS','_80fvPJrQEa-QtAjanWer','Ftftdc_6-yH9pLYxmZCx7');
INSERT INTO "rsvps" VALUES('6uUjrVPR7lKghfsJsGOc_','h1pOtrm3iDQOGQAZp0T8t','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('reR4x5n2jlLJhg4QVmfMr','oh6zIo5h51yRCPh1hsAzL','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('RMvZX4ip7DQhsOzh0uHGq','9nwSqZDnfNu2vzN7fDiXP','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('5hPce1KBF9sv-JXjNXUnM','p1JD-8qRY-3DYAS1IRz-b','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('ypqrFA-jqfC98vYg8iZrO','kUJpF343wm50hBnMCSPBh','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('ZvmqNzec3nEzNp9ZR2zSf','MPFN48fLp-kpouDs7EdL4','NFod0512W-UH1tU-kqqd8');
INSERT INTO "rsvps" VALUES('Tr_vdDNSgfLfx2n-0Safk','h1pOtrm3iDQOGQAZp0T8t','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('s2-0OUprpTeQgJsT3_spQ','DkfeMFj6BBFIXToTX6CJF','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('KMqIzCMeB3zfKcWslESgC','blkhHv_BtMJXt7aI7FK0e','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('_VehB2p38bwBTpIKVxASt','kUJpF343wm50hBnMCSPBh','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('aS4AoxuifzlD3W15aVsQ6','MPFN48fLp-kpouDs7EdL4','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('FcDHef66j5cFAlo7aysoD','-oQBLASgnXYbbHFeIrAmO','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "rsvps" VALUES('ivZg0xvMA9p0SBCnnUmlj','MPFN48fLp-kpouDs7EdL4','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "rsvps" VALUES('sxA21kYhnaS0TySGdhNWG','1GRIWqjXjR8qLkBkMbpG6','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "rsvps" VALUES('o3-RBVtReKS-NTIVL4VKH','h1pOtrm3iDQOGQAZp0T8t','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "rsvps" VALUES('-uBxJBrND6qhAuN3iHbNo','p1JD-8qRY-3DYAS1IRz-b','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "rsvps" VALUES('eiLhjwDvGx05McAKhDA3n','-oQBLASgnXYbbHFeIrAmO','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "rsvps" VALUES('RYzVsoRcMdUm8w6L5wA91','_80fvPJrQEa-QtAjanWer','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "rsvps" VALUES('2X_iE_0-CDqmVXrdYVOuh','h9RLofNGtz_DOFNeOnPcv','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "rsvps" VALUES('14mZwX1dMswoEAUT1Kc8e','h1pOtrm3iDQOGQAZp0T8t','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "rsvps" VALUES('_RH9GPX9jqE2g1NC0RFMU','sLBMlWHTRFTozHcWi7q3Y','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "rsvps" VALUES('K7hNwhRn1kyEQlR09MDWc','kUJpF343wm50hBnMCSPBh','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "rsvps" VALUES('-I5pO1G2hwEI_QKgAPcmH','nvlK7D7EhHT6f3yF4eEIB','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "rsvps" VALUES('29XyaSV3eKfeM_-QuX8_y','h9RLofNGtz_DOFNeOnPcv','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "rsvps" VALUES('UausqX_FOqIObidz7XMIF','kUJpF343wm50hBnMCSPBh','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "rsvps" VALUES('6LIGfVW7LMOSt00jtb9fS','MPFN48fLp-kpouDs7EdL4','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "rsvps" VALUES('6X02WAANdl0ntepLcE5ka','1GRIWqjXjR8qLkBkMbpG6','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "rsvps" VALUES('vzkDeipE61JK4bMdpIbCi','_80fvPJrQEa-QtAjanWer','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "rsvps" VALUES('DIy2fN1g5Max5dRF-WagC','h9RLofNGtz_DOFNeOnPcv','LP0ZIKX53XhF0B9HBise0');
INSERT INTO "rsvps" VALUES('XOQ9SxjkvcEcAV-PoDWUt','h1pOtrm3iDQOGQAZp0T8t','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('E2iTXfg1oMv2D2zaidJ1a','sLBMlWHTRFTozHcWi7q3Y','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('iT-So6Rx5P9ePERMW53-4','oh6zIo5h51yRCPh1hsAzL','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('Hj0NVpC6e8MNeLJhS-paL','a9cdPah-6VIvoo6Py1gFz','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('nY2zYbCexmFC2deSkyU7l','MPFN48fLp-kpouDs7EdL4','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('dy4whkMuqbICA4XfwJgyC','_80fvPJrQEa-QtAjanWer','OcUsDjmG5mPGWdD95qozb');
INSERT INTO "rsvps" VALUES('oZF2ChEcl43OqbCSxVplt','h1pOtrm3iDQOGQAZp0T8t','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('nPIRS3-YvRXcY4snZgI8V','DkfeMFj6BBFIXToTX6CJF','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('ETBSolIk0X2N5o0ptx-ww','kN5NZvEHg1F-3zsgLRMU1','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('U1Tmv4whkN1uYtrTSLPR8','MPFN48fLp-kpouDs7EdL4','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('u348q-F5pO9tgI7L6LWKI','-oQBLASgnXYbbHFeIrAmO','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('cZqhH2GtuOraFmy79zHhD','_80fvPJrQEa-QtAjanWer','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('GgnCd9xlxTTbP_5v759K6','h9RLofNGtz_DOFNeOnPcv','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "rsvps" VALUES('Bx54eWLrz11QDBVq2iQdT','h1pOtrm3iDQOGQAZp0T8t','354fllwixED-kiPUmddaE');
INSERT INTO "rsvps" VALUES('r3YwQb4nOgeIE_U9owFHl','kUJpF343wm50hBnMCSPBh','354fllwixED-kiPUmddaE');
INSERT INTO "rsvps" VALUES('uo4-J8XlvhWAEkPlxR_z9','kN5NZvEHg1F-3zsgLRMU1','354fllwixED-kiPUmddaE');
INSERT INTO "rsvps" VALUES('3yodL9F188xJD8Z8MNZAF','1GRIWqjXjR8qLkBkMbpG6','354fllwixED-kiPUmddaE');
INSERT INTO "rsvps" VALUES('CJuLwuNTyXAaWqQloeLlb','-oQBLASgnXYbbHFeIrAmO','354fllwixED-kiPUmddaE');
INSERT INTO "rsvps" VALUES('tmE6bf1Ijb2X-U9-3vO3s','h1pOtrm3iDQOGQAZp0T8t','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('AUjzd20F2th2WcPi3FvVz','sLBMlWHTRFTozHcWi7q3Y','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('pauvGIlQJD5qrhUFTEHp6','kUJpF343wm50hBnMCSPBh','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('urfX1nC_9_e1n9VlXR0D-','WB7SloVoHEkXO5i4n72UZ','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('W_94xz7BDz-IcjlDPyNph','1GRIWqjXjR8qLkBkMbpG6','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('w8KbhY5lUcUws15cWlan3','nvlK7D7EhHT6f3yF4eEIB','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('R49GWVVfkwHTfMvxLsxRf','_80fvPJrQEa-QtAjanWer','v4WRDws9hUNrYunmPokrV');
INSERT INTO "rsvps" VALUES('LkYau5QAk6KtkrgX2cfEb','h1pOtrm3iDQOGQAZp0T8t','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('yriwu_3jO5NZnWZ5RKD3Y','sLBMlWHTRFTozHcWi7q3Y','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('hor3jx0e6C5Lxk8mgCTwP','p1JD-8qRY-3DYAS1IRz-b','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('0HdzxWYZCz1r30bdzAY6i','cM9LgnjJZdXQ6aKPuaIy5','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('ZIjn31rnoLcFnZa2lUi7R','kN5NZvEHg1F-3zsgLRMU1','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('pWFA54Ck2Y6aum5-rRXj7','-oQBLASgnXYbbHFeIrAmO','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('LLD1EsP-3wagHBtuyvdtv','h9RLofNGtz_DOFNeOnPcv','waBcbIXaH-j8w4SRAdfsi');
INSERT INTO "rsvps" VALUES('5fEvHg9dmvjYCgMbKSN97','oh6zIo5h51yRCPh1hsAzL','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('OxRKJgs2NB__PnCoyDV9v','p1JD-8qRY-3DYAS1IRz-b','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('SJO4XfuwpVvoyaRPoY44A','kUJpF343wm50hBnMCSPBh','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('MpFfTABSTQkqRhyZ-csJi','WB7SloVoHEkXO5i4n72UZ','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('MRBwwDK8QJmZq2NuBatfS','nvlK7D7EhHT6f3yF4eEIB','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('piYZhUR4_Rbo0NuCJ7kIi','_80fvPJrQEa-QtAjanWer','wYJlokZ71siGUG8E7orKn');
INSERT INTO "rsvps" VALUES('Echi1pDLY07ZqeeI6DH8S','blkhHv_BtMJXt7aI7FK0e','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('UBlYJ6qtvUlIhvAqHWqn-','9nwSqZDnfNu2vzN7fDiXP','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('S0QaUmN3GYE7Z6rpUo5cv','kN5NZvEHg1F-3zsgLRMU1','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('2zFHi11G6gKlAVcERSwcx','-oQBLASgnXYbbHFeIrAmO','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('REoqX8p9zcrAFKyhhoXjW','_80fvPJrQEa-QtAjanWer','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('dBKpzDubs4UzQsYfC0Woa','h9RLofNGtz_DOFNeOnPcv','an4-5R62YaoMgJbqSkJNd');
INSERT INTO "rsvps" VALUES('334xjXfjwc47nKMq-kcoM','DkfeMFj6BBFIXToTX6CJF','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "rsvps" VALUES('_gQqO9R_FKxygrDC4W3Zi','kUJpF343wm50hBnMCSPBh','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "rsvps" VALUES('f_CS-fgpWqfubWEb1tAcX','MPFN48fLp-kpouDs7EdL4','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "rsvps" VALUES('aQ2FuZy6fnWOJGvlA6wkr','h9RLofNGtz_DOFNeOnPcv','KEs5rqPHZMQSFnHn02fkG');
INSERT INTO "rsvps" VALUES('8oi01gkknV4-yM8qnP-pO','h1pOtrm3iDQOGQAZp0T8t','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "rsvps" VALUES('f1x-zTobCZ5yQ9j29TFsc','blkhHv_BtMJXt7aI7FK0e','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "rsvps" VALUES('ahG76XsR7KdWSynjv1NdG','p1JD-8qRY-3DYAS1IRz-b','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "rsvps" VALUES('x4DSPxYrDs126o9XSvYVA','MPFN48fLp-kpouDs7EdL4','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "rsvps" VALUES('sS14vvqizi-W3afmhE5HU','h9RLofNGtz_DOFNeOnPcv','81iMSJg7Ylm5WE34UaJ8T');
INSERT INTO "rsvps" VALUES('kCrlR3Wbq9PH7N2hCy5ep','sLBMlWHTRFTozHcWi7q3Y','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('wBMGh3BnazBAZWXQ59c8r','oh6zIo5h51yRCPh1hsAzL','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('KZYC8XJ5TDKT6kuwZn2MY','cM9LgnjJZdXQ6aKPuaIy5','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('oBDrnt8YCH-NRmKxhO-8o','kN5NZvEHg1F-3zsgLRMU1','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('VWqor6t1KjzCt-fE9sGV1','1GRIWqjXjR8qLkBkMbpG6','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('meICb0hgeomxE2RAyTAtl','nvlK7D7EhHT6f3yF4eEIB','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('T3-KyV2cMcayeDI_UHdJM','h9RLofNGtz_DOFNeOnPcv','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "rsvps" VALUES('rk0Vv7fuVnZaZiwkkGT3O','oh6zIo5h51yRCPh1hsAzL','-G-Xgn-agUctaWsOzil44');
INSERT INTO "rsvps" VALUES('gE5ZSaClWlk-kd-24wxna','p1JD-8qRY-3DYAS1IRz-b','-G-Xgn-agUctaWsOzil44');
INSERT INTO "rsvps" VALUES('a240iKZMCD04rX68_xpcQ','cM9LgnjJZdXQ6aKPuaIy5','-G-Xgn-agUctaWsOzil44');
INSERT INTO "rsvps" VALUES('n27mhQ01lcsyHKcG7at9r','WB7SloVoHEkXO5i4n72UZ','-G-Xgn-agUctaWsOzil44');
INSERT INTO "rsvps" VALUES('AaQCX1TvKI_4r7Gkg8Tkl','-oQBLASgnXYbbHFeIrAmO','-G-Xgn-agUctaWsOzil44');
INSERT INTO "rsvps" VALUES('qx42YTaKh3rmSSb3mKSDv','h1pOtrm3iDQOGQAZp0T8t','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "rsvps" VALUES('jBZzquXmcbf4onnGMGjGf','sLBMlWHTRFTozHcWi7q3Y','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "rsvps" VALUES('tE6qzIO1CrHjSB0yXj6Mu','_80fvPJrQEa-QtAjanWer','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "rsvps" VALUES('zxAiJxF-rzqk47zepuJgL','1GRIWqjXjR8qLkBkMbpG6','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "rsvps" VALUES('2l1X7ZZXms2pMyhPK0LWM','-oQBLASgnXYbbHFeIrAmO','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "rsvps" VALUES('CKu51Qt2I3sHppF0CTbI9','h9RLofNGtz_DOFNeOnPcv','sU8I1Y1zxKZt03uLqlUJt');
INSERT INTO "rsvps" VALUES('FdvDQ2Ml9hljgva2LaJQ7','DkfeMFj6BBFIXToTX6CJF','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "rsvps" VALUES('L3Lj_TJ-ZCr2hidIlQMgR','p1JD-8qRY-3DYAS1IRz-b','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "rsvps" VALUES('NqPreo4XmHWJ8ZNfDyXRW','kUJpF343wm50hBnMCSPBh','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "rsvps" VALUES('dqjUB7vNM-R9Jv4nn0aCp','a9cdPah-6VIvoo6Py1gFz','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "rsvps" VALUES('6wgiTlD1JNLf2GCurp-jW','_80fvPJrQEa-QtAjanWer','p9NPINJOY-dogGJAap8eQ');
INSERT INTO "rsvps" VALUES('XBun_NCTLYhCMmrYvpmgi','h1pOtrm3iDQOGQAZp0T8t','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('kSkmEHgcKwHXhCmQZGw9b','kUJpF343wm50hBnMCSPBh','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('FcGFA9CQYHUKr4f8FQG-Q','a9cdPah-6VIvoo6Py1gFz','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('pRbJcLiruNE0G8Z6WlmRT','MPFN48fLp-kpouDs7EdL4','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('2hsvASRFqE2umLNFmW8pX','1GRIWqjXjR8qLkBkMbpG6','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('_45bFhEqZmz5ZLlqzSRNG','h9RLofNGtz_DOFNeOnPcv','2cdADeyRQA5uKgxmc46WZ');
INSERT INTO "rsvps" VALUES('t7NSVqG2k2Z0W-ecTWg6_','h1pOtrm3iDQOGQAZp0T8t','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "rsvps" VALUES('aZv0qiAUarTxPGP_9f2VB','blkhHv_BtMJXt7aI7FK0e','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "rsvps" VALUES('unzqZG02PZ3VHB3_5_axx','kUJpF343wm50hBnMCSPBh','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "rsvps" VALUES('Ozo7BMuBI_pGrjtacGpRz','WB7SloVoHEkXO5i4n72UZ','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "rsvps" VALUES('pn1T2zgc4TRKr8WcUIdDO','-oQBLASgnXYbbHFeIrAmO','6qkUzJr_1ABY3_YG3ox0U');
INSERT INTO "rsvps" VALUES('kclQH5Sxtk9tUdPnzuMTz','h9RLofNGtz_DOFNeOnPcv','6qkUzJr_1ABY3_YG3ox0U');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('X4AQCvSiHkBSyU6g_d9Xb','hmeU5KNTWcdGa1doWjRd9');
INSERT INTO "session_hosts" VALUES('taF5nsZh3hcunfKTo9f-H','ste9pbf0hLH2a43accXCS');
INSERT INTO "session_hosts" VALUES('h1pOtrm3iDQOGQAZp0T8t','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "session_hosts" VALUES('sLBMlWHTRFTozHcWi7q3Y','-coPgZYrCs5TTFyoBAcMD');
INSERT INTO "session_hosts" VALUES('DkfeMFj6BBFIXToTX6CJF','iG4ETfikNNkaFMR-X-AO0');
INSERT INTO "session_hosts" VALUES('blkhHv_BtMJXt7aI7FK0e','m-FNvWV6j1B8yIWQPYY40');
INSERT INTO "session_hosts" VALUES('oh6zIo5h51yRCPh1hsAzL','ru5-Wk1IPwzNhTjc6aeu9');
INSERT INTO "session_hosts" VALUES('9nwSqZDnfNu2vzN7fDiXP','XEnOXP8OC-9hk1Q9fPErA');
INSERT INTO "session_hosts" VALUES('p1JD-8qRY-3DYAS1IRz-b','3PdLZvpXKNLCLbPkaJoy3');
INSERT INTO "session_hosts" VALUES('kUJpF343wm50hBnMCSPBh','dhyPdGQxc1eiHdm0-idx9');
INSERT INTO "session_hosts" VALUES('cM9LgnjJZdXQ6aKPuaIy5','tz3P2uFzzi0K1V-x4HMMR');
INSERT INTO "session_hosts" VALUES('kN5NZvEHg1F-3zsgLRMU1','GDaU8eaGyH_MMopXdC3bg');
INSERT INTO "session_hosts" VALUES('a9cdPah-6VIvoo6Py1gFz','7ZZ3fWif0qvvZJB3ndZMS');
INSERT INTO "session_hosts" VALUES('WB7SloVoHEkXO5i4n72UZ','ste9pbf0hLH2a43accXCS');
INSERT INTO "session_hosts" VALUES('WB7SloVoHEkXO5i4n72UZ','gIItrWYGF5PJad8FE2opQ');
INSERT INTO "session_hosts" VALUES('MPFN48fLp-kpouDs7EdL4','D6PSdN5NT0uvU-VFZX94M');
INSERT INTO "session_hosts" VALUES('1GRIWqjXjR8qLkBkMbpG6','zTPZvK-rtxMqZcVzoPRZ3');
INSERT INTO "session_hosts" VALUES('-oQBLASgnXYbbHFeIrAmO','RzbNqOWciWpnsvL8yJnhx');
INSERT INTO "session_hosts" VALUES('nvlK7D7EhHT6f3yF4eEIB','cUQpDPWN7IObgbla51ghT');
INSERT INTO "session_hosts" VALUES('_80fvPJrQEa-QtAjanWer','N99ZbmHNInlJIc0pzsDB3');
INSERT INTO "session_hosts" VALUES('h9RLofNGtz_DOFNeOnPcv','3PdLZvpXKNLCLbPkaJoy3');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('X4AQCvSiHkBSyU6g_d9Xb','loc-main-hall');
INSERT INTO "session_locations" VALUES('weGTGgAGBx-mboQwml9UZ','loc-main-hall');
INSERT INTO "session_locations" VALUES('weGTGgAGBx-mboQwml9UZ','loc-room-a');
INSERT INTO "session_locations" VALUES('weGTGgAGBx-mboQwml9UZ','loc-room-b');
INSERT INTO "session_locations" VALUES('_RQKFUCCjURj8hEgCNtsM','loc-main-hall');
INSERT INTO "session_locations" VALUES('_RQKFUCCjURj8hEgCNtsM','loc-room-a');
INSERT INTO "session_locations" VALUES('_RQKFUCCjURj8hEgCNtsM','loc-room-b');
INSERT INTO "session_locations" VALUES('qgeLpuXkxl2vwYEpQFDlb','loc-main-hall');
INSERT INTO "session_locations" VALUES('qgeLpuXkxl2vwYEpQFDlb','loc-room-a');
INSERT INTO "session_locations" VALUES('qgeLpuXkxl2vwYEpQFDlb','loc-room-b');
INSERT INTO "session_locations" VALUES('taF5nsZh3hcunfKTo9f-H','loc-main-hall');
INSERT INTO "session_locations" VALUES('e2Z_gFs00oWVxzNMl-tAc','loc-main-hall');
INSERT INTO "session_locations" VALUES('e2Z_gFs00oWVxzNMl-tAc','loc-room-a');
INSERT INTO "session_locations" VALUES('e2Z_gFs00oWVxzNMl-tAc','loc-room-b');
INSERT INTO "session_locations" VALUES('MBERbmEfBwCfy1KiG9Kn_','loc-main-hall');
INSERT INTO "session_locations" VALUES('MBERbmEfBwCfy1KiG9Kn_','loc-room-a');
INSERT INTO "session_locations" VALUES('MBERbmEfBwCfy1KiG9Kn_','loc-room-b');
INSERT INTO "session_locations" VALUES('WCyOjO-jYz7VGzvA-0G4m','loc-main-hall');
INSERT INTO "session_locations" VALUES('WCyOjO-jYz7VGzvA-0G4m','loc-room-a');
INSERT INTO "session_locations" VALUES('WCyOjO-jYz7VGzvA-0G4m','loc-room-b');
INSERT INTO "session_locations" VALUES('h1pOtrm3iDQOGQAZp0T8t','loc-main-hall');
INSERT INTO "session_locations" VALUES('Armbi6Zq6mGxQcIAhNNjR','loc-main-hall');
INSERT INTO "session_locations" VALUES('Armbi6Zq6mGxQcIAhNNjR','loc-room-a');
INSERT INTO "session_locations" VALUES('Armbi6Zq6mGxQcIAhNNjR','loc-room-b');
INSERT INTO "session_locations" VALUES('jJiUyLUwqPUlFGSOWaPoC','loc-main-hall');
INSERT INTO "session_locations" VALUES('jJiUyLUwqPUlFGSOWaPoC','loc-room-a');
INSERT INTO "session_locations" VALUES('jJiUyLUwqPUlFGSOWaPoC','loc-room-b');
INSERT INTO "session_locations" VALUES('i596107mFipbpapbnQ-fa','loc-main-hall');
INSERT INTO "session_locations" VALUES('i596107mFipbpapbnQ-fa','loc-room-a');
INSERT INTO "session_locations" VALUES('i596107mFipbpapbnQ-fa','loc-room-b');
INSERT INTO "session_locations" VALUES('sLBMlWHTRFTozHcWi7q3Y','loc-main-hall');
INSERT INTO "session_locations" VALUES('DkfeMFj6BBFIXToTX6CJF','loc-room-a');
INSERT INTO "session_locations" VALUES('blkhHv_BtMJXt7aI7FK0e','loc-main-hall');
INSERT INTO "session_locations" VALUES('oh6zIo5h51yRCPh1hsAzL','loc-room-b');
INSERT INTO "session_locations" VALUES('9nwSqZDnfNu2vzN7fDiXP','loc-room-a');
INSERT INTO "session_locations" VALUES('p1JD-8qRY-3DYAS1IRz-b','loc-main-hall');
INSERT INTO "session_locations" VALUES('kUJpF343wm50hBnMCSPBh','loc-room-b');
INSERT INTO "session_locations" VALUES('cM9LgnjJZdXQ6aKPuaIy5','loc-room-a');
INSERT INTO "session_locations" VALUES('kN5NZvEHg1F-3zsgLRMU1','loc-main-hall');
INSERT INTO "session_locations" VALUES('a9cdPah-6VIvoo6Py1gFz','loc-room-b');
INSERT INTO "session_locations" VALUES('WB7SloVoHEkXO5i4n72UZ','loc-main-hall');
INSERT INTO "session_locations" VALUES('MPFN48fLp-kpouDs7EdL4','loc-room-b');
INSERT INTO "session_locations" VALUES('1GRIWqjXjR8qLkBkMbpG6','loc-main-hall');
INSERT INTO "session_locations" VALUES('-oQBLASgnXYbbHFeIrAmO','loc-room-a');
INSERT INTO "session_locations" VALUES('nvlK7D7EhHT6f3yF4eEIB','loc-room-b');
INSERT INTO "session_locations" VALUES('_80fvPJrQEa-QtAjanWer','loc-main-hall');
INSERT INTO "session_locations" VALUES('h9RLofNGtz_DOFNeOnPcv','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('IUwfe1aRfFkWVa7PMxHnb','gu4RdXjUv7HwTxd7IVXYE','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('5y0OCA93O6DeE2rAP2QYh','gu4RdXjUv7HwTxd7IVXYE','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('8waEFHlLVOkwRw8fdWrHC','gu4RdXjUv7HwTxd7IVXYE','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('nyrX71Mj217bZv6pXf2bf','gu4RdXjUv7HwTxd7IVXYE','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('PVLZ1svF13zK-dcihHKbg','gu4RdXjUv7HwTxd7IVXYE','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('SqPDef3noFvIDq28DFwWb','gu4RdXjUv7HwTxd7IVXYE','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('jn-2zKBk_w0fhIOlYUF9o','gu4RdXjUv7HwTxd7IVXYE','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('XokxW-A-I86WjwUr4-Fc_','gu4RdXjUv7HwTxd7IVXYE','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('ZsB3A_6ed7iaJeGTQwjLi','gu4RdXjUv7HwTxd7IVXYE','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('O1uF6oEHga2tW0zV1jrjl','gu4RdXjUv7HwTxd7IVXYE','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('KTQiBDa3P9fy1MiIHsJEx','gu4RdXjUv7HwTxd7IVXYE','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:24:40.869Z');
INSERT INTO "session_proposals" VALUES('BlKtBb0Tvca-lyv6jFc3h','5CEfgK22iDcfivfXUlzIK','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('V5B17QW5YEJuVSjHMDL5p','5CEfgK22iDcfivfXUlzIK','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('Y71Qo7srCT-ihHg-Nf7PI','5CEfgK22iDcfivfXUlzIK','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('dGZJuJH7SYwkI4qhuCuvd','5CEfgK22iDcfivfXUlzIK','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('UMQf52WBtNorETgzVkLSW','5CEfgK22iDcfivfXUlzIK','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('U9sHNwgZTgtF_OQMJDymZ','5CEfgK22iDcfivfXUlzIK','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('yuVD_Manq87RpLmvvSrzc','5CEfgK22iDcfivfXUlzIK','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('W422dBNSD2-QmPqkol9kU','5CEfgK22iDcfivfXUlzIK','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('CalsDrB_y0I2s_ljI6Gob','5CEfgK22iDcfivfXUlzIK','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('NmxUEhFxPIeZaeb5NA59r','5CEfgK22iDcfivfXUlzIK','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('8eH3wtDPP6r_B9Th-_X_F','5CEfgK22iDcfivfXUlzIK','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('X7zP3cW2GBPeor7JE7AOj','5CEfgK22iDcfivfXUlzIK','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('vKiQbl76ZS1aubNTjedb4','5CEfgK22iDcfivfXUlzIK','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('9FD9MdIOCxs_bljKdML0c','qI_s7M26JrYRkOEO3JLC9','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('CODB-HHby_9JDHauPfvXn','qI_s7M26JrYRkOEO3JLC9','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('pR3qhD4wrMMebzWZ98jBq','qI_s7M26JrYRkOEO3JLC9','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('3EQeWJocskET5PllemdkF','qI_s7M26JrYRkOEO3JLC9','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('s5dHLHyFPqZNCsYMenhXh','qI_s7M26JrYRkOEO3JLC9','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('2RrDDgXvCVZLkkgaWeCib','qI_s7M26JrYRkOEO3JLC9','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('K2QYSpKe2bz5zb80oP0nM','qI_s7M26JrYRkOEO3JLC9','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('HpZmwXgQxAYZrSIvLNlYc','qI_s7M26JrYRkOEO3JLC9','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('1MCFA1v1vbb-Snt3gkyfA','qI_s7M26JrYRkOEO3JLC9','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('dU6PFdB1mdaie8JycD5b3','qI_s7M26JrYRkOEO3JLC9','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('ddfEz3v0G3MPpA8CGszD0','qI_s7M26JrYRkOEO3JLC9','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('jZd9vhNImirOMhmkrgci7','qI_s7M26JrYRkOEO3JLC9','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('mjstEcea55Ib7G4aERzt9','qI_s7M26JrYRkOEO3JLC9','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('SmjNwiPYUgMFsep5mYG-U','qI_s7M26JrYRkOEO3JLC9','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('VxF619A-RwJlD8wUO9jvI','qI_s7M26JrYRkOEO3JLC9','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('oD6jt9txnx4Uvx31HLant','qI_s7M26JrYRkOEO3JLC9','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('-8txLCEu8vcQESc_tDTKs','qI_s7M26JrYRkOEO3JLC9','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:24:40.870Z');
INSERT INTO "session_proposals" VALUES('5F3Mvt-cCjQ3qSptvWU2q','qI_s7M26JrYRkOEO3JLC9','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:24:40.870Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('7UQ0R1sJ8DgavC_3-g26A','BlKtBb0Tvca-lyv6jFc3h','hmeU5KNTWcdGa1doWjRd9','maybe');
INSERT INTO "votes" VALUES('Bxi2rBvH6opb3ahtfefIH','dGZJuJH7SYwkI4qhuCuvd','hmeU5KNTWcdGa1doWjRd9','interested');
INSERT INTO "votes" VALUES('8Rm0tJZUQKVpsENsK6tAj','U9sHNwgZTgtF_OQMJDymZ','hmeU5KNTWcdGa1doWjRd9','maybe');
INSERT INTO "votes" VALUES('MI31H4E6ACPS4UyquO8v5','yuVD_Manq87RpLmvvSrzc','hmeU5KNTWcdGa1doWjRd9','maybe');
INSERT INTO "votes" VALUES('gVFfMybKdrTv2cXuMqlj1','CalsDrB_y0I2s_ljI6Gob','hmeU5KNTWcdGa1doWjRd9','interested');
INSERT INTO "votes" VALUES('kWsAO59ZeOy3y7M9hX4Jv','NmxUEhFxPIeZaeb5NA59r','hmeU5KNTWcdGa1doWjRd9','skip');
INSERT INTO "votes" VALUES('YnKFmV9gPQ1gOneug1Dkv','V5B17QW5YEJuVSjHMDL5p','ste9pbf0hLH2a43accXCS','maybe');
INSERT INTO "votes" VALUES('UyFmfy8rp54aYK0mHy6it','dGZJuJH7SYwkI4qhuCuvd','ste9pbf0hLH2a43accXCS','interested');
INSERT INTO "votes" VALUES('JT26oh8GnnNPOcMahO0Vn','UMQf52WBtNorETgzVkLSW','ste9pbf0hLH2a43accXCS','skip');
INSERT INTO "votes" VALUES('bzDo3CjkC4-sXwbuV-xPM','CalsDrB_y0I2s_ljI6Gob','ste9pbf0hLH2a43accXCS','maybe');
INSERT INTO "votes" VALUES('mQHJWD_1RjRuY6SQfC-7V','UMQf52WBtNorETgzVkLSW','3PdLZvpXKNLCLbPkaJoy3','maybe');
INSERT INTO "votes" VALUES('2iQq_tHtrMYe-2sd2dQxh','U9sHNwgZTgtF_OQMJDymZ','3PdLZvpXKNLCLbPkaJoy3','maybe');
INSERT INTO "votes" VALUES('qMvV288o_3HySLiNFNyko','Y71Qo7srCT-ihHg-Nf7PI','-coPgZYrCs5TTFyoBAcMD','maybe');
INSERT INTO "votes" VALUES('1z2otOXOJak1AsQfly-6T','dGZJuJH7SYwkI4qhuCuvd','-coPgZYrCs5TTFyoBAcMD','interested');
INSERT INTO "votes" VALUES('q-s4ZY7U-oYnEBKs9ix_w','yuVD_Manq87RpLmvvSrzc','-coPgZYrCs5TTFyoBAcMD','maybe');
INSERT INTO "votes" VALUES('ZH__9t_fyP3YzYCkAh5or','W422dBNSD2-QmPqkol9kU','-coPgZYrCs5TTFyoBAcMD','interested');
INSERT INTO "votes" VALUES('hlipafDhytFKv57SjZWwL','CalsDrB_y0I2s_ljI6Gob','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('Y3oTWqolrIIso5VSkcJT9','V5B17QW5YEJuVSjHMDL5p','2YuFDHTXeDrbQaU7CG2c1','skip');
INSERT INTO "votes" VALUES('snUa9MPiEidKT78sYJ0eA','U9sHNwgZTgtF_OQMJDymZ','2YuFDHTXeDrbQaU7CG2c1','interested');
INSERT INTO "votes" VALUES('1dT_WSBfMg0lX--3tlPwC','BlKtBb0Tvca-lyv6jFc3h','iG4ETfikNNkaFMR-X-AO0','maybe');
INSERT INTO "votes" VALUES('G7CMbvdm4tTXHLczU3bMa','yuVD_Manq87RpLmvvSrzc','iG4ETfikNNkaFMR-X-AO0','maybe');
INSERT INTO "votes" VALUES('0PUXkzmmqRB-saVXvxzsV','CalsDrB_y0I2s_ljI6Gob','iG4ETfikNNkaFMR-X-AO0','skip');
INSERT INTO "votes" VALUES('b4heDsAzapXzN1flX7tyH','BlKtBb0Tvca-lyv6jFc3h','1puE4Cdyq9tNRE9pxcrRO','skip');
INSERT INTO "votes" VALUES('QwiBNbTU2ga29yWtVEqju','V5B17QW5YEJuVSjHMDL5p','1puE4Cdyq9tNRE9pxcrRO','skip');
INSERT INTO "votes" VALUES('k6W1XotORw-abYKxIPMrn','Y71Qo7srCT-ihHg-Nf7PI','1puE4Cdyq9tNRE9pxcrRO','skip');
INSERT INTO "votes" VALUES('HbNiRVpLGHfqJSDRoZWto','dGZJuJH7SYwkI4qhuCuvd','1puE4Cdyq9tNRE9pxcrRO','maybe');
INSERT INTO "votes" VALUES('RLJqsPOfo-CU-na7IPhv5','yuVD_Manq87RpLmvvSrzc','1puE4Cdyq9tNRE9pxcrRO','maybe');
INSERT INTO "votes" VALUES('dErI6_XLUj3ZQjYyLECbp','W422dBNSD2-QmPqkol9kU','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('H0I1-WoMGUpoYYnV9uEh2','CalsDrB_y0I2s_ljI6Gob','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('dnilSQd2saRQ-EmqmtsAW','NmxUEhFxPIeZaeb5NA59r','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('a0GTMubE1a74OfHNoxHFM','BlKtBb0Tvca-lyv6jFc3h','GDaU8eaGyH_MMopXdC3bg','interested');
INSERT INTO "votes" VALUES('3VRVcYbzOaIVK2gVhUZ0T','V5B17QW5YEJuVSjHMDL5p','GDaU8eaGyH_MMopXdC3bg','interested');
INSERT INTO "votes" VALUES('teFKnTL8wTx2celeBDUES','W422dBNSD2-QmPqkol9kU','GDaU8eaGyH_MMopXdC3bg','maybe');
INSERT INTO "votes" VALUES('FuvEykt6Y6xxkgVL2vqBy','NmxUEhFxPIeZaeb5NA59r','GDaU8eaGyH_MMopXdC3bg','skip');
INSERT INTO "votes" VALUES('-hk8KB4MSIBMWn74qLrwX','Y71Qo7srCT-ihHg-Nf7PI','gkbOFJBri0Y74DSbKGuEn','skip');
INSERT INTO "votes" VALUES('yjwk7R_8OXO05TPjO1W8N','U9sHNwgZTgtF_OQMJDymZ','gkbOFJBri0Y74DSbKGuEn','maybe');
INSERT INTO "votes" VALUES('M_JfDKiWPnWgwpOh8-xdl','NmxUEhFxPIeZaeb5NA59r','gkbOFJBri0Y74DSbKGuEn','maybe');
INSERT INTO "votes" VALUES('VK9j7A_hOnAog_jDV0GBQ','V5B17QW5YEJuVSjHMDL5p','N99ZbmHNInlJIc0pzsDB3','maybe');
INSERT INTO "votes" VALUES('HGK3p0Y_Dlh7UiwtLva-d','Y71Qo7srCT-ihHg-Nf7PI','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('Bw8IrzEE-cvz77CMbmFjc','dGZJuJH7SYwkI4qhuCuvd','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('7Z2Uth0kRfqWHe_Qm7ZtM','UMQf52WBtNorETgzVkLSW','N99ZbmHNInlJIc0pzsDB3','skip');
INSERT INTO "votes" VALUES('shpNtHupLXQT6cJ0PwMD9','NmxUEhFxPIeZaeb5NA59r','N99ZbmHNInlJIc0pzsDB3','skip');
INSERT INTO "votes" VALUES('g2sFuvWplwso6e6yhOjDR','W422dBNSD2-QmPqkol9kU','RzbNqOWciWpnsvL8yJnhx','maybe');
INSERT INTO "votes" VALUES('mSjulXacvuCOGbfhmfmss','CalsDrB_y0I2s_ljI6Gob','RzbNqOWciWpnsvL8yJnhx','maybe');
INSERT INTO "votes" VALUES('tDl7qVOPusZOyg5n0ibCb','NmxUEhFxPIeZaeb5NA59r','RzbNqOWciWpnsvL8yJnhx','interested');
INSERT INTO "votes" VALUES('WoQivgwG-hxdbjNOq5L6x','BlKtBb0Tvca-lyv6jFc3h','-YwFojcWJ2z-AteCp7e5O','skip');
INSERT INTO "votes" VALUES('VeMW0eHKBoK0bCvjVfL58','V5B17QW5YEJuVSjHMDL5p','-YwFojcWJ2z-AteCp7e5O','skip');
INSERT INTO "votes" VALUES('35ebx1JnAsgvLSxuiLEwW','dGZJuJH7SYwkI4qhuCuvd','-YwFojcWJ2z-AteCp7e5O','skip');
INSERT INTO "votes" VALUES('pI0iAJwD5SDs9NrMecbKp','UMQf52WBtNorETgzVkLSW','-YwFojcWJ2z-AteCp7e5O','interested');
INSERT INTO "votes" VALUES('w9KI-vy-EtdZ2usPaoBWV','U9sHNwgZTgtF_OQMJDymZ','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('-4CQE_wZDi6VfaXiT4Soa','yuVD_Manq87RpLmvvSrzc','-YwFojcWJ2z-AteCp7e5O','interested');
INSERT INTO "votes" VALUES('Qe-SDXEW084xkkMgFsa5X','Y71Qo7srCT-ihHg-Nf7PI','dhyPdGQxc1eiHdm0-idx9','maybe');
INSERT INTO "votes" VALUES('onFAQ2WEMpo4gO_yDzBEi','dGZJuJH7SYwkI4qhuCuvd','dhyPdGQxc1eiHdm0-idx9','skip');
INSERT INTO "votes" VALUES('jbBsCJrJqdW8OWCzwwQfS','UMQf52WBtNorETgzVkLSW','dhyPdGQxc1eiHdm0-idx9','interested');
INSERT INTO "votes" VALUES('M5b3RBDVuhKjb3X3Z63hT','U9sHNwgZTgtF_OQMJDymZ','dhyPdGQxc1eiHdm0-idx9','interested');
INSERT INTO "votes" VALUES('sRDXSPl1EyapvdzMKfTfx','CalsDrB_y0I2s_ljI6Gob','cUQpDPWN7IObgbla51ghT','interested');
INSERT INTO "votes" VALUES('d1lZW3ZjdbxTZcLhX8OKQ','V5B17QW5YEJuVSjHMDL5p','jqxLKnsgxzS-fcHRaReUI','maybe');
INSERT INTO "votes" VALUES('ZmzUmeqAjBi2ImZXq3rpP','dGZJuJH7SYwkI4qhuCuvd','jqxLKnsgxzS-fcHRaReUI','interested');
INSERT INTO "votes" VALUES('b-8nEx7D8auDxdgZuql_d','U9sHNwgZTgtF_OQMJDymZ','jqxLKnsgxzS-fcHRaReUI','maybe');
INSERT INTO "votes" VALUES('a0HJbmYp_tA9VMgzEbMRH','yuVD_Manq87RpLmvvSrzc','jqxLKnsgxzS-fcHRaReUI','interested');
INSERT INTO "votes" VALUES('VAMm2G4D2tefiJCwExpqi','CalsDrB_y0I2s_ljI6Gob','jqxLKnsgxzS-fcHRaReUI','maybe');
INSERT INTO "votes" VALUES('1Xi5Tk8H9w1dK7kkrGssC','NmxUEhFxPIeZaeb5NA59r','jqxLKnsgxzS-fcHRaReUI','interested');
INSERT INTO "votes" VALUES('5c917HX-pEnICVuz4bVv0','Y71Qo7srCT-ihHg-Nf7PI','tz3P2uFzzi0K1V-x4HMMR','skip');
INSERT INTO "votes" VALUES('L5d6GUbVhvpLcoy9jMMb0','dGZJuJH7SYwkI4qhuCuvd','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('wC082Bz3r6AT0UehL2ZFP','U9sHNwgZTgtF_OQMJDymZ','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('acK3-V_mPifyRDgBEXEAh','yuVD_Manq87RpLmvvSrzc','tz3P2uFzzi0K1V-x4HMMR','maybe');
INSERT INTO "votes" VALUES('kM41OKsGuegPBVBOLCoC_','W422dBNSD2-QmPqkol9kU','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('wI21DWTikjUZO9ZS2WT04','CalsDrB_y0I2s_ljI6Gob','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('Nb7dmUvCuTYCdGXHZU9uU','V5B17QW5YEJuVSjHMDL5p','lj9v1uZ2o8OtlHNj-3fvS','skip');
INSERT INTO "votes" VALUES('HNUs6Uc0XaOTuLT055ROx','Y71Qo7srCT-ihHg-Nf7PI','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('RWeJphA_Ft0S4r0koskXo','dGZJuJH7SYwkI4qhuCuvd','lj9v1uZ2o8OtlHNj-3fvS','skip');
INSERT INTO "votes" VALUES('Mf1PwOiDEXGRn2LK3CmR7','yuVD_Manq87RpLmvvSrzc','lj9v1uZ2o8OtlHNj-3fvS','maybe');
INSERT INTO "votes" VALUES('fJt5WUT9CHHQKS-Ukuw-I','CalsDrB_y0I2s_ljI6Gob','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('ZENrPG4TwG8C8PQhTb_gE','NmxUEhFxPIeZaeb5NA59r','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('0Sgr3J3ibhrOBQHjBFEZm','BlKtBb0Tvca-lyv6jFc3h','Ftftdc_6-yH9pLYxmZCx7','interested');
INSERT INTO "votes" VALUES('hVmbzcbviNtzxyCPng4iv','V5B17QW5YEJuVSjHMDL5p','Ftftdc_6-yH9pLYxmZCx7','interested');
INSERT INTO "votes" VALUES('aKV8uRgtEIlGnls_OnkJl','W422dBNSD2-QmPqkol9kU','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('B6N16UR5LRy_5I5mI5Pe-','CalsDrB_y0I2s_ljI6Gob','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('J5j1UuIEzTpeQR5KhD4Wm','BlKtBb0Tvca-lyv6jFc3h','NFod0512W-UH1tU-kqqd8','interested');
INSERT INTO "votes" VALUES('Vq8vNGi_UIVYGtI8-Z5iy','V5B17QW5YEJuVSjHMDL5p','NFod0512W-UH1tU-kqqd8','interested');
INSERT INTO "votes" VALUES('7E7TCTBWriOF4MdWkOx2d','Y71Qo7srCT-ihHg-Nf7PI','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('ttv3HSMqO7YKLdQnLIi5d','U9sHNwgZTgtF_OQMJDymZ','NFod0512W-UH1tU-kqqd8','maybe');
INSERT INTO "votes" VALUES('cT42I2bZu6Gy-_K-1NkJ1','CalsDrB_y0I2s_ljI6Gob','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('4GfvM2F3qYy5lg7aw38SP','NmxUEhFxPIeZaeb5NA59r','NFod0512W-UH1tU-kqqd8','interested');
INSERT INTO "votes" VALUES('WqRDaKABUi3GSoHMQqaO6','BlKtBb0Tvca-lyv6jFc3h','zTPZvK-rtxMqZcVzoPRZ3','maybe');
INSERT INTO "votes" VALUES('hQ6bWFqxEtZxMqpy8Bsys','U9sHNwgZTgtF_OQMJDymZ','zTPZvK-rtxMqZcVzoPRZ3','maybe');
INSERT INTO "votes" VALUES('DveXGbAY3Wj7iQ-VKFIUc','yuVD_Manq87RpLmvvSrzc','zTPZvK-rtxMqZcVzoPRZ3','interested');
INSERT INTO "votes" VALUES('3iW5SQ3avqVOhOZRqP5Ud','W422dBNSD2-QmPqkol9kU','zTPZvK-rtxMqZcVzoPRZ3','interested');
INSERT INTO "votes" VALUES('l_lMFaEdbPLlwnWnwPfn9','NmxUEhFxPIeZaeb5NA59r','zTPZvK-rtxMqZcVzoPRZ3','interested');
INSERT INTO "votes" VALUES('lAGuytA_Eojkzu8LTTiNt','dGZJuJH7SYwkI4qhuCuvd','m-FNvWV6j1B8yIWQPYY40','skip');
INSERT INTO "votes" VALUES('nRjDqMnP6Del03984MgEC','UMQf52WBtNorETgzVkLSW','m-FNvWV6j1B8yIWQPYY40','interested');
INSERT INTO "votes" VALUES('pIawWblT3wO_5ugaYzWyt','yuVD_Manq87RpLmvvSrzc','m-FNvWV6j1B8yIWQPYY40','maybe');
INSERT INTO "votes" VALUES('gUWQsSa6HT8jVLrAbw6CZ','W422dBNSD2-QmPqkol9kU','m-FNvWV6j1B8yIWQPYY40','maybe');
INSERT INTO "votes" VALUES('Mb8wXWP7FMLYurkBCo4Sm','BlKtBb0Tvca-lyv6jFc3h','D6PSdN5NT0uvU-VFZX94M','maybe');
INSERT INTO "votes" VALUES('xsl2DO_w9ND2XQaRgyiJJ','yuVD_Manq87RpLmvvSrzc','D6PSdN5NT0uvU-VFZX94M','interested');
INSERT INTO "votes" VALUES('B5zw_VSVpmOROHSdHzpfY','CalsDrB_y0I2s_ljI6Gob','D6PSdN5NT0uvU-VFZX94M','interested');
INSERT INTO "votes" VALUES('4xUPZwlZvz7AB9jZvJlj2','NmxUEhFxPIeZaeb5NA59r','D6PSdN5NT0uvU-VFZX94M','skip');
INSERT INTO "votes" VALUES('hg44sySOvSOpKoIyGizOF','BlKtBb0Tvca-lyv6jFc3h','7ZZ3fWif0qvvZJB3ndZMS','interested');
INSERT INTO "votes" VALUES('dVWv3ZQW83BHQld8qLpwN','Y71Qo7srCT-ihHg-Nf7PI','7ZZ3fWif0qvvZJB3ndZMS','maybe');
INSERT INTO "votes" VALUES('0jlrNcNavphJw2nU0_R7A','U9sHNwgZTgtF_OQMJDymZ','7ZZ3fWif0qvvZJB3ndZMS','interested');
INSERT INTO "votes" VALUES('7ycu9GjwhSqUTW7QWLFLQ','NmxUEhFxPIeZaeb5NA59r','7ZZ3fWif0qvvZJB3ndZMS','skip');
INSERT INTO "votes" VALUES('q65dfJaXqMz3Dh2mRI4H-','U9sHNwgZTgtF_OQMJDymZ','LP0ZIKX53XhF0B9HBise0','skip');
INSERT INTO "votes" VALUES('bkUyKVo3nX5ymr23Pxsjd','CalsDrB_y0I2s_ljI6Gob','LP0ZIKX53XhF0B9HBise0','interested');
INSERT INTO "votes" VALUES('AKwhx4kVvnI6NnspG0u23','NmxUEhFxPIeZaeb5NA59r','LP0ZIKX53XhF0B9HBise0','maybe');
INSERT INTO "votes" VALUES('tehiq37v2LRbzamqhc9Zs','BlKtBb0Tvca-lyv6jFc3h','OcUsDjmG5mPGWdD95qozb','maybe');
INSERT INTO "votes" VALUES('1QKXiJbc2DX79lQ4JewKN','V5B17QW5YEJuVSjHMDL5p','OcUsDjmG5mPGWdD95qozb','interested');
INSERT INTO "votes" VALUES('K6DWn1IZL6jrwsMifcYX3','U9sHNwgZTgtF_OQMJDymZ','OcUsDjmG5mPGWdD95qozb','interested');
INSERT INTO "votes" VALUES('ednyWT66w_bNRPcOVxZgI','yuVD_Manq87RpLmvvSrzc','OcUsDjmG5mPGWdD95qozb','interested');
INSERT INTO "votes" VALUES('Z4IwA8rlEs6FZV0SDWK3X','W422dBNSD2-QmPqkol9kU','OcUsDjmG5mPGWdD95qozb','interested');
INSERT INTO "votes" VALUES('QSK1nK2Poq2XmsnAw_uq-','CalsDrB_y0I2s_ljI6Gob','OcUsDjmG5mPGWdD95qozb','maybe');
INSERT INTO "votes" VALUES('g59KfNMDIDkk9MfQvL9Eo','BlKtBb0Tvca-lyv6jFc3h','XEnOXP8OC-9hk1Q9fPErA','maybe');
INSERT INTO "votes" VALUES('daGkqi9qX4p-Du7SP_u4Z','Y71Qo7srCT-ihHg-Nf7PI','XEnOXP8OC-9hk1Q9fPErA','skip');
INSERT INTO "votes" VALUES('H1W6NtNhwrqQ66WN4HRxF','NmxUEhFxPIeZaeb5NA59r','XEnOXP8OC-9hk1Q9fPErA','maybe');
INSERT INTO "votes" VALUES('yXiuOm-DTGnNx2MJJJYqz','V5B17QW5YEJuVSjHMDL5p','354fllwixED-kiPUmddaE','maybe');
INSERT INTO "votes" VALUES('dsx9Vv9qB7dtj8UPSy6w0','U9sHNwgZTgtF_OQMJDymZ','354fllwixED-kiPUmddaE','interested');
INSERT INTO "votes" VALUES('1o8ncd2Ikmur1DyzPYcYS','W422dBNSD2-QmPqkol9kU','354fllwixED-kiPUmddaE','skip');
INSERT INTO "votes" VALUES('9xAFBfqNEdhGW_5uS7ge2','BlKtBb0Tvca-lyv6jFc3h','v4WRDws9hUNrYunmPokrV','interested');
INSERT INTO "votes" VALUES('4080vl74bjroy5ORnc1WB','dGZJuJH7SYwkI4qhuCuvd','v4WRDws9hUNrYunmPokrV','skip');
INSERT INTO "votes" VALUES('TvXG7Hs05P5r84JlIBu9E','yuVD_Manq87RpLmvvSrzc','v4WRDws9hUNrYunmPokrV','interested');
INSERT INTO "votes" VALUES('kQp74F0T13RXTLki2zURF','BlKtBb0Tvca-lyv6jFc3h','waBcbIXaH-j8w4SRAdfsi','maybe');
INSERT INTO "votes" VALUES('-8V4gbpjfcIJL05ehbavW','Y71Qo7srCT-ihHg-Nf7PI','waBcbIXaH-j8w4SRAdfsi','interested');
INSERT INTO "votes" VALUES('TpVOgXRGinK945UdOENdQ','W422dBNSD2-QmPqkol9kU','waBcbIXaH-j8w4SRAdfsi','maybe');
INSERT INTO "votes" VALUES('8mNHRRhtk-GMU8uutQiZJ','CalsDrB_y0I2s_ljI6Gob','waBcbIXaH-j8w4SRAdfsi','maybe');
INSERT INTO "votes" VALUES('dEfRoI7QypIgexzQdQLCr','NmxUEhFxPIeZaeb5NA59r','waBcbIXaH-j8w4SRAdfsi','maybe');
INSERT INTO "votes" VALUES('9rIVv8lzNts7i5bIADguX','BlKtBb0Tvca-lyv6jFc3h','wYJlokZ71siGUG8E7orKn','maybe');
INSERT INTO "votes" VALUES('M9sk_joxp2WfHfyVz6mqr','Y71Qo7srCT-ihHg-Nf7PI','wYJlokZ71siGUG8E7orKn','interested');
INSERT INTO "votes" VALUES('IfbFNdWmcxVn79uCGsv9b','yuVD_Manq87RpLmvvSrzc','wYJlokZ71siGUG8E7orKn','interested');
INSERT INTO "votes" VALUES('nedyznd5ze7eP79JFP-5U','BlKtBb0Tvca-lyv6jFc3h','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('6pmG-0DWeM8nK4eP0-zkF','Y71Qo7srCT-ihHg-Nf7PI','an4-5R62YaoMgJbqSkJNd','maybe');
INSERT INTO "votes" VALUES('2bWkjlOoO35AIA65upYNz','dGZJuJH7SYwkI4qhuCuvd','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('qfMYKf61U4jbea3qtR7YD','U9sHNwgZTgtF_OQMJDymZ','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('5juNNAjvJrl7ackdg21Gb','BlKtBb0Tvca-lyv6jFc3h','KEs5rqPHZMQSFnHn02fkG','interested');
INSERT INTO "votes" VALUES('3HFYn49v2nrdlpU2J_Vtc','yuVD_Manq87RpLmvvSrzc','KEs5rqPHZMQSFnHn02fkG','maybe');
INSERT INTO "votes" VALUES('HJ2qfQTq3QuH6-oYLCEjQ','NmxUEhFxPIeZaeb5NA59r','KEs5rqPHZMQSFnHn02fkG','maybe');
INSERT INTO "votes" VALUES('2KR-qwYJhHBQpHkXY1YZq','BlKtBb0Tvca-lyv6jFc3h','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('jmEZCRm7htBh2jq4phYcN','V5B17QW5YEJuVSjHMDL5p','81iMSJg7Ylm5WE34UaJ8T','skip');
INSERT INTO "votes" VALUES('9r2qdYceRgn6QMYY2-YLd','UMQf52WBtNorETgzVkLSW','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('swVPNzOmOd8Fw1IQx0cAr','U9sHNwgZTgtF_OQMJDymZ','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('P-I-D8DfUsWMx_kh_-1z_','W422dBNSD2-QmPqkol9kU','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('Y67eqdtz6JsoPqNhyY7IW','CalsDrB_y0I2s_ljI6Gob','81iMSJg7Ylm5WE34UaJ8T','maybe');
INSERT INTO "votes" VALUES('TVsm8ZnW9anpc4ZwlbSDc','UMQf52WBtNorETgzVkLSW','gIItrWYGF5PJad8FE2opQ','interested');
INSERT INTO "votes" VALUES('GqP7cUS5Qis3S8Trxtz6D','BlKtBb0Tvca-lyv6jFc3h','-G-Xgn-agUctaWsOzil44','skip');
INSERT INTO "votes" VALUES('_x2Rf40PAY_xugx9x9-HS','V5B17QW5YEJuVSjHMDL5p','-G-Xgn-agUctaWsOzil44','interested');
INSERT INTO "votes" VALUES('50DXQCJ2fYEizzNpFG62X','W422dBNSD2-QmPqkol9kU','-G-Xgn-agUctaWsOzil44','skip');
INSERT INTO "votes" VALUES('zqjL4S3ATm8CVKECLNW2o','CalsDrB_y0I2s_ljI6Gob','-G-Xgn-agUctaWsOzil44','maybe');
INSERT INTO "votes" VALUES('5q6rFM2EA4UQ0smhIMZ6I','U9sHNwgZTgtF_OQMJDymZ','ru5-Wk1IPwzNhTjc6aeu9','interested');
INSERT INTO "votes" VALUES('i0f_gzzgpVEpLkO1c2kTB','W422dBNSD2-QmPqkol9kU','ru5-Wk1IPwzNhTjc6aeu9','interested');
INSERT INTO "votes" VALUES('Lhju5lqPOQ_I6BkqmkfA0','BlKtBb0Tvca-lyv6jFc3h','sU8I1Y1zxKZt03uLqlUJt','maybe');
INSERT INTO "votes" VALUES('jdS_frBmX8GVMf3BycVO5','dGZJuJH7SYwkI4qhuCuvd','sU8I1Y1zxKZt03uLqlUJt','interested');
INSERT INTO "votes" VALUES('cRZdUzijcFBxrV8Ci0K0N','UMQf52WBtNorETgzVkLSW','sU8I1Y1zxKZt03uLqlUJt','interested');
INSERT INTO "votes" VALUES('AVBPO9Vk7K6TxWnDN10f9','U9sHNwgZTgtF_OQMJDymZ','sU8I1Y1zxKZt03uLqlUJt','interested');
INSERT INTO "votes" VALUES('eoRPACEOm_TRutb7CkD-Y','W422dBNSD2-QmPqkol9kU','sU8I1Y1zxKZt03uLqlUJt','interested');
INSERT INTO "votes" VALUES('iBvBu5I9s3lmjXQ9QP4wh','CalsDrB_y0I2s_ljI6Gob','sU8I1Y1zxKZt03uLqlUJt','maybe');
INSERT INTO "votes" VALUES('S_kiR-6hxZ_ZWRYO2GNGj','dGZJuJH7SYwkI4qhuCuvd','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('70-xr__hKYbDaW7PzV77p','yuVD_Manq87RpLmvvSrzc','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('isgacT5ZioaFMNYCGEVOf','Y71Qo7srCT-ihHg-Nf7PI','2cdADeyRQA5uKgxmc46WZ','maybe');
INSERT INTO "votes" VALUES('W5xNLHrXgja8Ye-7SuMIp','dGZJuJH7SYwkI4qhuCuvd','2cdADeyRQA5uKgxmc46WZ','interested');
INSERT INTO "votes" VALUES('JWICDbFZDGjQPByHaPE6S','UMQf52WBtNorETgzVkLSW','2cdADeyRQA5uKgxmc46WZ','maybe');
INSERT INTO "votes" VALUES('BUW64zAmzUBsM0BYaeFtv','NmxUEhFxPIeZaeb5NA59r','2cdADeyRQA5uKgxmc46WZ','skip');
INSERT INTO "votes" VALUES('dv2Y04-SkKEgBVws-Hr_y','BlKtBb0Tvca-lyv6jFc3h','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('YqQYRUVNVTO2YL6qjJUa-','V5B17QW5YEJuVSjHMDL5p','6qkUzJr_1ABY3_YG3ox0U','maybe');
INSERT INTO "votes" VALUES('tyzdm18_uZV0_kL-B1mvA','Y71Qo7srCT-ihHg-Nf7PI','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('6mu8mdAEByMv9D8TuC47o','UMQf52WBtNorETgzVkLSW','6qkUzJr_1ABY3_YG3ox0U','maybe');
INSERT INTO "votes" VALUES('5VWlSWKgNL2Nk0iULmzPJ','U9sHNwgZTgtF_OQMJDymZ','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('Y78dxc3PHOmqpsAxnLj5F','W422dBNSD2-QmPqkol9kU','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('kv63jpr5JLPzX22PdEtO-','NmxUEhFxPIeZaeb5NA59r','6qkUzJr_1ABY3_YG3ox0U','maybe');
INSERT INTO "votes" VALUES('mFk_1tErdGVWbtBGe9KNM','CODB-HHby_9JDHauPfvXn','hmeU5KNTWcdGa1doWjRd9','maybe');
INSERT INTO "votes" VALUES('zIDYTMasc9YqXl8MyVBfX','pR3qhD4wrMMebzWZ98jBq','hmeU5KNTWcdGa1doWjRd9','skip');
INSERT INTO "votes" VALUES('JNMIt-1FMw8NWL7bICo4q','2RrDDgXvCVZLkkgaWeCib','hmeU5KNTWcdGa1doWjRd9','skip');
INSERT INTO "votes" VALUES('wPFwZLgpU_4HVZrGajOrL','1MCFA1v1vbb-Snt3gkyfA','hmeU5KNTWcdGa1doWjRd9','maybe');
INSERT INTO "votes" VALUES('kauaZtPmmVPvdlmUtySnk','ddfEz3v0G3MPpA8CGszD0','hmeU5KNTWcdGa1doWjRd9','skip');
INSERT INTO "votes" VALUES('caDs_0wzwME00JdmdxsHh','SmjNwiPYUgMFsep5mYG-U','hmeU5KNTWcdGa1doWjRd9','interested');
INSERT INTO "votes" VALUES('RkU_pof-gR5fLX_nQCr2g','9FD9MdIOCxs_bljKdML0c','ste9pbf0hLH2a43accXCS','interested');
INSERT INTO "votes" VALUES('ewiML8QQTbFth6rYkmYdy','3EQeWJocskET5PllemdkF','ste9pbf0hLH2a43accXCS','skip');
INSERT INTO "votes" VALUES('rBt_Y2B1UE0dC9VGlgdAp','2RrDDgXvCVZLkkgaWeCib','ste9pbf0hLH2a43accXCS','skip');
INSERT INTO "votes" VALUES('CMbXiS1WLrT7cmgNpKVy3','dU6PFdB1mdaie8JycD5b3','ste9pbf0hLH2a43accXCS','skip');
INSERT INTO "votes" VALUES('jicddhy0eIlToM-0rXT2H','ddfEz3v0G3MPpA8CGszD0','ste9pbf0hLH2a43accXCS','skip');
INSERT INTO "votes" VALUES('pxs83YQebPs6kunaLHg8P','mjstEcea55Ib7G4aERzt9','ste9pbf0hLH2a43accXCS','interested');
INSERT INTO "votes" VALUES('33fAgn-uawkvdIqRYp0zh','3EQeWJocskET5PllemdkF','3PdLZvpXKNLCLbPkaJoy3','skip');
INSERT INTO "votes" VALUES('N_kCGDzTdj5-e_nLnrmng','K2QYSpKe2bz5zb80oP0nM','3PdLZvpXKNLCLbPkaJoy3','maybe');
INSERT INTO "votes" VALUES('rocPOQU7STnx7F-5ohpJs','jZd9vhNImirOMhmkrgci7','3PdLZvpXKNLCLbPkaJoy3','maybe');
INSERT INTO "votes" VALUES('PYlcs4cJ9lyAbv3Py1Ekf','SmjNwiPYUgMFsep5mYG-U','3PdLZvpXKNLCLbPkaJoy3','interested');
INSERT INTO "votes" VALUES('pat7LP2T2n16l_0s5_boL','9FD9MdIOCxs_bljKdML0c','-coPgZYrCs5TTFyoBAcMD','interested');
INSERT INTO "votes" VALUES('k5PO8e2AcCVMZdjvxYEJd','3EQeWJocskET5PllemdkF','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('D5VgRoguxBjUazm2YwDkS','2RrDDgXvCVZLkkgaWeCib','-coPgZYrCs5TTFyoBAcMD','maybe');
INSERT INTO "votes" VALUES('FTY49GHjYOYQX_5eU1_Bw','K2QYSpKe2bz5zb80oP0nM','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('RofK5pnv-NlmAnxWduQU_','dU6PFdB1mdaie8JycD5b3','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('jnE9HEVGoQYQJsGaYQiXA','mjstEcea55Ib7G4aERzt9','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('5ykerQ7HDGXXcKZUOxjlz','SmjNwiPYUgMFsep5mYG-U','-coPgZYrCs5TTFyoBAcMD','skip');
INSERT INTO "votes" VALUES('D1mKUT-W81X3JA6PV8cV-','VxF619A-RwJlD8wUO9jvI','-coPgZYrCs5TTFyoBAcMD','interested');
INSERT INTO "votes" VALUES('NP7_AocO2f7V1UiGb26tz','CODB-HHby_9JDHauPfvXn','2YuFDHTXeDrbQaU7CG2c1','interested');
INSERT INTO "votes" VALUES('yFaJNxyhYAQvCSDJiGpqH','pR3qhD4wrMMebzWZ98jBq','2YuFDHTXeDrbQaU7CG2c1','interested');
INSERT INTO "votes" VALUES('ttGn3aqwzSVzkS10X3BAm','s5dHLHyFPqZNCsYMenhXh','2YuFDHTXeDrbQaU7CG2c1','maybe');
INSERT INTO "votes" VALUES('Ld5qSdHVPiaQ9buXi1HFA','HpZmwXgQxAYZrSIvLNlYc','2YuFDHTXeDrbQaU7CG2c1','maybe');
INSERT INTO "votes" VALUES('8x_1fWBug8-671z1NHizz','1MCFA1v1vbb-Snt3gkyfA','2YuFDHTXeDrbQaU7CG2c1','interested');
INSERT INTO "votes" VALUES('mbQKC6Sy3isR4-HcVktdX','mjstEcea55Ib7G4aERzt9','2YuFDHTXeDrbQaU7CG2c1','maybe');
INSERT INTO "votes" VALUES('AH5OPAqCibXi8aXrxJOY7','9FD9MdIOCxs_bljKdML0c','iG4ETfikNNkaFMR-X-AO0','interested');
INSERT INTO "votes" VALUES('qj8O-igPdFai2Jgdk-rqL','s5dHLHyFPqZNCsYMenhXh','iG4ETfikNNkaFMR-X-AO0','maybe');
INSERT INTO "votes" VALUES('OyYQ-Cx5dk7f3tGFi71_B','K2QYSpKe2bz5zb80oP0nM','iG4ETfikNNkaFMR-X-AO0','maybe');
INSERT INTO "votes" VALUES('ULI_RkbUbJBDGjx8Fgi85','mjstEcea55Ib7G4aERzt9','iG4ETfikNNkaFMR-X-AO0','interested');
INSERT INTO "votes" VALUES('Y_4xljDqJhYEDq_R63IOx','3EQeWJocskET5PllemdkF','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('RIbwtfoUQ9erT5o2ZGGTt','s5dHLHyFPqZNCsYMenhXh','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('VvG0nA13zbl8MS6IL-wQA','ddfEz3v0G3MPpA8CGszD0','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('O-rMYh4epbzXwzjBoW2-N','mjstEcea55Ib7G4aERzt9','1puE4Cdyq9tNRE9pxcrRO','maybe');
INSERT INTO "votes" VALUES('N8OkiAH853XyR1TG5tG-N','SmjNwiPYUgMFsep5mYG-U','1puE4Cdyq9tNRE9pxcrRO','skip');
INSERT INTO "votes" VALUES('3leqWtEZ1m9_AtLzaqibz','VxF619A-RwJlD8wUO9jvI','1puE4Cdyq9tNRE9pxcrRO','interested');
INSERT INTO "votes" VALUES('VxePthahPpMb8Fgpjqypg','9FD9MdIOCxs_bljKdML0c','GDaU8eaGyH_MMopXdC3bg','skip');
INSERT INTO "votes" VALUES('01xSfROzxIsWiWKCqKYKz','K2QYSpKe2bz5zb80oP0nM','GDaU8eaGyH_MMopXdC3bg','maybe');
INSERT INTO "votes" VALUES('apOzfoOCgMoU-npnl4-cJ','HpZmwXgQxAYZrSIvLNlYc','GDaU8eaGyH_MMopXdC3bg','maybe');
INSERT INTO "votes" VALUES('CCZzPc9ifuaK79LUZz-ZP','jZd9vhNImirOMhmkrgci7','GDaU8eaGyH_MMopXdC3bg','skip');
INSERT INTO "votes" VALUES('kRFBdd_nJcqqOwyzZ9g4e','mjstEcea55Ib7G4aERzt9','GDaU8eaGyH_MMopXdC3bg','interested');
INSERT INTO "votes" VALUES('IGlEudwPzmk1oPhnms-mp','9FD9MdIOCxs_bljKdML0c','gkbOFJBri0Y74DSbKGuEn','interested');
INSERT INTO "votes" VALUES('XSG_k6PjHHfErtoV5UAup','CODB-HHby_9JDHauPfvXn','gkbOFJBri0Y74DSbKGuEn','maybe');
INSERT INTO "votes" VALUES('eXicoBhP1xjfytMbZcvkp','2RrDDgXvCVZLkkgaWeCib','gkbOFJBri0Y74DSbKGuEn','maybe');
INSERT INTO "votes" VALUES('K1gYtwevgTU_UugcGULhF','HpZmwXgQxAYZrSIvLNlYc','gkbOFJBri0Y74DSbKGuEn','interested');
INSERT INTO "votes" VALUES('igqVP7o-uCrHzT5jcN53X','SmjNwiPYUgMFsep5mYG-U','gkbOFJBri0Y74DSbKGuEn','maybe');
INSERT INTO "votes" VALUES('88yUG-GlJzXnhTCnuhhHO','CODB-HHby_9JDHauPfvXn','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('QpJoa946XdcN_ey8iXGSY','pR3qhD4wrMMebzWZ98jBq','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('CWmooiO7NitBkKkW0D9lD','3EQeWJocskET5PllemdkF','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('d-hSRSSQ14hbNsgcKiScf','2RrDDgXvCVZLkkgaWeCib','N99ZbmHNInlJIc0pzsDB3','maybe');
INSERT INTO "votes" VALUES('MKnlC9gb_yXNKs1xhh7h-','HpZmwXgQxAYZrSIvLNlYc','N99ZbmHNInlJIc0pzsDB3','skip');
INSERT INTO "votes" VALUES('utzNmQ3cwgeyY9tYf_51h','ddfEz3v0G3MPpA8CGszD0','N99ZbmHNInlJIc0pzsDB3','interested');
INSERT INTO "votes" VALUES('WKR3T2fB-MEhhMd4UCpDY','mjstEcea55Ib7G4aERzt9','N99ZbmHNInlJIc0pzsDB3','maybe');
INSERT INTO "votes" VALUES('0LfqiZtg16AHipCR0gjhc','VxF619A-RwJlD8wUO9jvI','N99ZbmHNInlJIc0pzsDB3','maybe');
INSERT INTO "votes" VALUES('IEACkYCyfhrV20vZ4xYJK','CODB-HHby_9JDHauPfvXn','RzbNqOWciWpnsvL8yJnhx','maybe');
INSERT INTO "votes" VALUES('OS2xeoe6YtjHSPqTMKwwR','dU6PFdB1mdaie8JycD5b3','RzbNqOWciWpnsvL8yJnhx','skip');
INSERT INTO "votes" VALUES('0qdlk_lfLrCfYGth6aM16','jZd9vhNImirOMhmkrgci7','RzbNqOWciWpnsvL8yJnhx','maybe');
INSERT INTO "votes" VALUES('1VjobYz670uYNQ5wZmNHm','mjstEcea55Ib7G4aERzt9','RzbNqOWciWpnsvL8yJnhx','interested');
INSERT INTO "votes" VALUES('hk2I7piGVsMDOnirC13uy','SmjNwiPYUgMFsep5mYG-U','RzbNqOWciWpnsvL8yJnhx','interested');
INSERT INTO "votes" VALUES('fZHuyYuggzRcreKprgOnV','VxF619A-RwJlD8wUO9jvI','RzbNqOWciWpnsvL8yJnhx','interested');
INSERT INTO "votes" VALUES('B8dkH6Ri-JfLiCZ-PDMQa','9FD9MdIOCxs_bljKdML0c','-YwFojcWJ2z-AteCp7e5O','interested');
INSERT INTO "votes" VALUES('zfolOnuYBumDTu6lBKCYj','3EQeWJocskET5PllemdkF','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('V_LuoaJt035Vdfp2h5IEe','2RrDDgXvCVZLkkgaWeCib','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('_ON-oNasyCBQoJanizoMd','HpZmwXgQxAYZrSIvLNlYc','-YwFojcWJ2z-AteCp7e5O','interested');
INSERT INTO "votes" VALUES('mK05ao1uuDF6iZTAv4c4i','1MCFA1v1vbb-Snt3gkyfA','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('rG_XxQdNmYeD18YWPCZz5','dU6PFdB1mdaie8JycD5b3','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('yUJG6q8NZApdnJD7BSr9x','ddfEz3v0G3MPpA8CGszD0','-YwFojcWJ2z-AteCp7e5O','interested');
INSERT INTO "votes" VALUES('tEulFJMLf9FboITimDY63','mjstEcea55Ib7G4aERzt9','-YwFojcWJ2z-AteCp7e5O','maybe');
INSERT INTO "votes" VALUES('LUUkKyrfCjYWCPCfTDg6K','CODB-HHby_9JDHauPfvXn','dhyPdGQxc1eiHdm0-idx9','maybe');
INSERT INTO "votes" VALUES('9sR69RGGq-b2DC-LyWdjO','1MCFA1v1vbb-Snt3gkyfA','dhyPdGQxc1eiHdm0-idx9','maybe');
INSERT INTO "votes" VALUES('SHpq1Swd1rWBJUa5ZALqB','CODB-HHby_9JDHauPfvXn','cUQpDPWN7IObgbla51ghT','maybe');
INSERT INTO "votes" VALUES('bwZeNtwq2bwSxzelrxB2B','3EQeWJocskET5PllemdkF','cUQpDPWN7IObgbla51ghT','maybe');
INSERT INTO "votes" VALUES('asUYSPxogkyOA3sCjXkuK','2RrDDgXvCVZLkkgaWeCib','cUQpDPWN7IObgbla51ghT','skip');
INSERT INTO "votes" VALUES('y-98priyMOerEOG8SaRI2','HpZmwXgQxAYZrSIvLNlYc','cUQpDPWN7IObgbla51ghT','interested');
INSERT INTO "votes" VALUES('6i7E7u7-ns4ZuGVzjrsNs','1MCFA1v1vbb-Snt3gkyfA','cUQpDPWN7IObgbla51ghT','interested');
INSERT INTO "votes" VALUES('OkdqeoKx9OFzHOeXrPzQY','dU6PFdB1mdaie8JycD5b3','cUQpDPWN7IObgbla51ghT','skip');
INSERT INTO "votes" VALUES('GF5RQdADC8G2dQFz2OvIV','ddfEz3v0G3MPpA8CGszD0','cUQpDPWN7IObgbla51ghT','skip');
INSERT INTO "votes" VALUES('EkExUmwWcArNvfT14sLHd','mjstEcea55Ib7G4aERzt9','cUQpDPWN7IObgbla51ghT','interested');
INSERT INTO "votes" VALUES('yR25eWaFFBH9vx1TqYdmN','VxF619A-RwJlD8wUO9jvI','cUQpDPWN7IObgbla51ghT','interested');
INSERT INTO "votes" VALUES('cKaqpGFokG-py6CoeDglO','3EQeWJocskET5PllemdkF','jqxLKnsgxzS-fcHRaReUI','interested');
INSERT INTO "votes" VALUES('ajgAyL-dppT5r2Ku8Kjdl','VxF619A-RwJlD8wUO9jvI','jqxLKnsgxzS-fcHRaReUI','maybe');
INSERT INTO "votes" VALUES('F8dNJEEHFeirOhNpWMRur','s5dHLHyFPqZNCsYMenhXh','tz3P2uFzzi0K1V-x4HMMR','skip');
INSERT INTO "votes" VALUES('wYQ8HZWzv1yxBC7hUc08P','dU6PFdB1mdaie8JycD5b3','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('uAHcZpW4jm8UkbElClcto','ddfEz3v0G3MPpA8CGszD0','tz3P2uFzzi0K1V-x4HMMR','interested');
INSERT INTO "votes" VALUES('nLm7uztWm81Km5qprEfC9','SmjNwiPYUgMFsep5mYG-U','tz3P2uFzzi0K1V-x4HMMR','maybe');
INSERT INTO "votes" VALUES('ACK_fUxiK6FE0Kibw_4YE','pR3qhD4wrMMebzWZ98jBq','lj9v1uZ2o8OtlHNj-3fvS','maybe');
INSERT INTO "votes" VALUES('pb-KooibZuGZlfFspKPTB','s5dHLHyFPqZNCsYMenhXh','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('k6Tkw0C26QWdnJzcKerFW','2RrDDgXvCVZLkkgaWeCib','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('8IckwRF97m5ruQndjWRGB','HpZmwXgQxAYZrSIvLNlYc','lj9v1uZ2o8OtlHNj-3fvS','skip');
INSERT INTO "votes" VALUES('ZBnOS2Rj8EW99V7BUPK6G','1MCFA1v1vbb-Snt3gkyfA','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('LO5sQs4k09IR6meWd1viS','dU6PFdB1mdaie8JycD5b3','lj9v1uZ2o8OtlHNj-3fvS','interested');
INSERT INTO "votes" VALUES('i4ssWX-8P-774aDpH8qHn','ddfEz3v0G3MPpA8CGszD0','lj9v1uZ2o8OtlHNj-3fvS','skip');
INSERT INTO "votes" VALUES('ZyOku2405YtmLpVCPP9US','VxF619A-RwJlD8wUO9jvI','lj9v1uZ2o8OtlHNj-3fvS','skip');
INSERT INTO "votes" VALUES('dWSrWkvkH-p7fsziysBpQ','9FD9MdIOCxs_bljKdML0c','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('5h3YxiYvjynMy-FeVGcTu','2RrDDgXvCVZLkkgaWeCib','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('fQCBAhBilq7IuQAF8Zj4K','HpZmwXgQxAYZrSIvLNlYc','Ftftdc_6-yH9pLYxmZCx7','interested');
INSERT INTO "votes" VALUES('J1Jq1R_1ryCe5wCb42OeY','1MCFA1v1vbb-Snt3gkyfA','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('qZEcPjoIdeFUGTUaofbJT','dU6PFdB1mdaie8JycD5b3','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('ygsN5e9RFxP6Scw7ET_TN','ddfEz3v0G3MPpA8CGszD0','Ftftdc_6-yH9pLYxmZCx7','skip');
INSERT INTO "votes" VALUES('JloUsaKmKe5z9IXjouBWb','jZd9vhNImirOMhmkrgci7','Ftftdc_6-yH9pLYxmZCx7','maybe');
INSERT INTO "votes" VALUES('IuiT7UT1u51EzBjM7_5kk','CODB-HHby_9JDHauPfvXn','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('0JsTbe5TXE1cyoVuDbMKQ','3EQeWJocskET5PllemdkF','NFod0512W-UH1tU-kqqd8','maybe');
INSERT INTO "votes" VALUES('3miTnzSCJgfvmlLORa9kr','K2QYSpKe2bz5zb80oP0nM','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('lX3H33TNH4wxCc7-vayiA','HpZmwXgQxAYZrSIvLNlYc','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('ZonZEIeqnPN_g4D946C7i','ddfEz3v0G3MPpA8CGszD0','NFod0512W-UH1tU-kqqd8','interested');
INSERT INTO "votes" VALUES('zdfsPG3pBX8d9KkgCFhs5','jZd9vhNImirOMhmkrgci7','NFod0512W-UH1tU-kqqd8','interested');
INSERT INTO "votes" VALUES('GrzcN_45-26P2c8ODtuN1','VxF619A-RwJlD8wUO9jvI','NFod0512W-UH1tU-kqqd8','skip');
INSERT INTO "votes" VALUES('CxEQakRCcsRrec_Gsy9p4','s5dHLHyFPqZNCsYMenhXh','zTPZvK-rtxMqZcVzoPRZ3','maybe');
INSERT INTO "votes" VALUES('RTuz_-tZJdWrU13Vvft91','K2QYSpKe2bz5zb80oP0nM','zTPZvK-rtxMqZcVzoPRZ3','maybe');
INSERT INTO "votes" VALUES('tv5wW0ZHb3lgLDb7AjZxx','HpZmwXgQxAYZrSIvLNlYc','zTPZvK-rtxMqZcVzoPRZ3','skip');
INSERT INTO "votes" VALUES('KLjr1gchnZvAMvZ51l5VQ','ddfEz3v0G3MPpA8CGszD0','zTPZvK-rtxMqZcVzoPRZ3','interested');
INSERT INTO "votes" VALUES('-GXsTs7KgoaixPgtpW-H9','jZd9vhNImirOMhmkrgci7','zTPZvK-rtxMqZcVzoPRZ3','interested');
INSERT INTO "votes" VALUES('xIURBV3Cm6w-whJ--czH7','pR3qhD4wrMMebzWZ98jBq','m-FNvWV6j1B8yIWQPYY40','maybe');
INSERT INTO "votes" VALUES('Jdf-zLJSSLmCKaCdqsxPe','SmjNwiPYUgMFsep5mYG-U','m-FNvWV6j1B8yIWQPYY40','interested');
INSERT INTO "votes" VALUES('kVcO7ErillNHcqcXfbaco','VxF619A-RwJlD8wUO9jvI','m-FNvWV6j1B8yIWQPYY40','interested');
INSERT INTO "votes" VALUES('OciF2qujKnNlJSJ1DLQOf','3EQeWJocskET5PllemdkF','D6PSdN5NT0uvU-VFZX94M','maybe');
INSERT INTO "votes" VALUES('5AlAfAHRhZA604U6JlNdJ','HpZmwXgQxAYZrSIvLNlYc','D6PSdN5NT0uvU-VFZX94M','interested');
INSERT INTO "votes" VALUES('zlvWt86zNJPKFncsrtHQv','3EQeWJocskET5PllemdkF','7ZZ3fWif0qvvZJB3ndZMS','maybe');
INSERT INTO "votes" VALUES('mh8E7Vqab2kfDhcVgJiaa','s5dHLHyFPqZNCsYMenhXh','7ZZ3fWif0qvvZJB3ndZMS','interested');
INSERT INTO "votes" VALUES('Eqn_a_ij427V_s4616SPj','1MCFA1v1vbb-Snt3gkyfA','7ZZ3fWif0qvvZJB3ndZMS','interested');
INSERT INTO "votes" VALUES('MHTysDpzIUrmcdU62SeXQ','dU6PFdB1mdaie8JycD5b3','7ZZ3fWif0qvvZJB3ndZMS','skip');
INSERT INTO "votes" VALUES('YibiTgiRbBzTglCjIT8tc','ddfEz3v0G3MPpA8CGszD0','7ZZ3fWif0qvvZJB3ndZMS','skip');
INSERT INTO "votes" VALUES('ngBwMxdnZ0iafCX_TDUY4','CODB-HHby_9JDHauPfvXn','LP0ZIKX53XhF0B9HBise0','interested');
INSERT INTO "votes" VALUES('NSeO4Y_5LQ3yf23QX8LLD','s5dHLHyFPqZNCsYMenhXh','LP0ZIKX53XhF0B9HBise0','maybe');
INSERT INTO "votes" VALUES('8ECFV8WRSOgS3KLhgNo2R','2RrDDgXvCVZLkkgaWeCib','LP0ZIKX53XhF0B9HBise0','interested');
INSERT INTO "votes" VALUES('FZK0XY8QP4lXXdLC2mRJ_','SmjNwiPYUgMFsep5mYG-U','LP0ZIKX53XhF0B9HBise0','interested');
INSERT INTO "votes" VALUES('yD1KF6cN1hz4BDNDT4fPU','9FD9MdIOCxs_bljKdML0c','OcUsDjmG5mPGWdD95qozb','skip');
INSERT INTO "votes" VALUES('99kmSR1FgUtamoBWznG68','s5dHLHyFPqZNCsYMenhXh','OcUsDjmG5mPGWdD95qozb','skip');
INSERT INTO "votes" VALUES('MhEwZXuRP7Id1tPBO063-','2RrDDgXvCVZLkkgaWeCib','OcUsDjmG5mPGWdD95qozb','maybe');
INSERT INTO "votes" VALUES('C1UXibJVSjQLrP6OkFBr5','dU6PFdB1mdaie8JycD5b3','OcUsDjmG5mPGWdD95qozb','skip');
INSERT INTO "votes" VALUES('4n-ytQ5Xcwz7GFPPz-t09','jZd9vhNImirOMhmkrgci7','OcUsDjmG5mPGWdD95qozb','interested');
INSERT INTO "votes" VALUES('MiyG43gwg6A_JKZ5pO386','9FD9MdIOCxs_bljKdML0c','XEnOXP8OC-9hk1Q9fPErA','skip');
INSERT INTO "votes" VALUES('uxo2FPugYBhhhWLYTDzOZ','pR3qhD4wrMMebzWZ98jBq','XEnOXP8OC-9hk1Q9fPErA','skip');
INSERT INTO "votes" VALUES('_HQ1hNMpXtFqgRuHvVo8p','K2QYSpKe2bz5zb80oP0nM','XEnOXP8OC-9hk1Q9fPErA','maybe');
INSERT INTO "votes" VALUES('H0n0cmoJ_HC1huDS5w_A_','dU6PFdB1mdaie8JycD5b3','XEnOXP8OC-9hk1Q9fPErA','maybe');
INSERT INTO "votes" VALUES('Zdvi-Up0yJ_brMz_HMVsM','ddfEz3v0G3MPpA8CGszD0','XEnOXP8OC-9hk1Q9fPErA','interested');
INSERT INTO "votes" VALUES('X3IzFirevsRIMPfkZ9Fy_','CODB-HHby_9JDHauPfvXn','354fllwixED-kiPUmddaE','maybe');
INSERT INTO "votes" VALUES('km26cwATuw4Qf5lnDS8qf','pR3qhD4wrMMebzWZ98jBq','354fllwixED-kiPUmddaE','interested');
INSERT INTO "votes" VALUES('2nAt557PU4IA1Rn10qRTH','3EQeWJocskET5PllemdkF','354fllwixED-kiPUmddaE','skip');
INSERT INTO "votes" VALUES('DEOq8-sZ8Imj-JVl8B-lk','1MCFA1v1vbb-Snt3gkyfA','354fllwixED-kiPUmddaE','maybe');
INSERT INTO "votes" VALUES('ePLHg3aSG8GQQFxQMUyph','dU6PFdB1mdaie8JycD5b3','354fllwixED-kiPUmddaE','maybe');
INSERT INTO "votes" VALUES('erQQw87CcjCPxd5lccfsw','ddfEz3v0G3MPpA8CGszD0','354fllwixED-kiPUmddaE','maybe');
INSERT INTO "votes" VALUES('xWvdvZJU8Bd8-OL0V79oi','jZd9vhNImirOMhmkrgci7','354fllwixED-kiPUmddaE','skip');
INSERT INTO "votes" VALUES('-3mtPOMjxIGPeCqo1QbeZ','mjstEcea55Ib7G4aERzt9','354fllwixED-kiPUmddaE','interested');
INSERT INTO "votes" VALUES('H8DENNllfKkLhg0o9l2T2','3EQeWJocskET5PllemdkF','v4WRDws9hUNrYunmPokrV','maybe');
INSERT INTO "votes" VALUES('1evy-O4IrhezTSQlisFS3','HpZmwXgQxAYZrSIvLNlYc','v4WRDws9hUNrYunmPokrV','interested');
INSERT INTO "votes" VALUES('LitrP5CzAiDN-wLW-bGct','1MCFA1v1vbb-Snt3gkyfA','v4WRDws9hUNrYunmPokrV','maybe');
INSERT INTO "votes" VALUES('Jb47TD6cwYiPEHnGk6yxs','dU6PFdB1mdaie8JycD5b3','v4WRDws9hUNrYunmPokrV','maybe');
INSERT INTO "votes" VALUES('pI3txDz4FT_t41J4PEGqe','mjstEcea55Ib7G4aERzt9','v4WRDws9hUNrYunmPokrV','maybe');
INSERT INTO "votes" VALUES('x1gCQvtwXZdsrYXj0dffh','9FD9MdIOCxs_bljKdML0c','waBcbIXaH-j8w4SRAdfsi','interested');
INSERT INTO "votes" VALUES('ZWIyCPQkaZlobVH8-qQga','3EQeWJocskET5PllemdkF','waBcbIXaH-j8w4SRAdfsi','interested');
INSERT INTO "votes" VALUES('covdGWImjxvhC_UBAIsI_','2RrDDgXvCVZLkkgaWeCib','waBcbIXaH-j8w4SRAdfsi','skip');
INSERT INTO "votes" VALUES('pstduzxJAPj52Plxr4QM6','K2QYSpKe2bz5zb80oP0nM','waBcbIXaH-j8w4SRAdfsi','skip');
INSERT INTO "votes" VALUES('tpdKJsNMnCZ3V-uSItc41','HpZmwXgQxAYZrSIvLNlYc','waBcbIXaH-j8w4SRAdfsi','maybe');
INSERT INTO "votes" VALUES('mZ2M1atuca0L8hZFyivIU','dU6PFdB1mdaie8JycD5b3','waBcbIXaH-j8w4SRAdfsi','skip');
INSERT INTO "votes" VALUES('6MesaCr6aly3Ad5N3pzJY','CODB-HHby_9JDHauPfvXn','wYJlokZ71siGUG8E7orKn','interested');
INSERT INTO "votes" VALUES('alMmV_ZAJkOmHUvawJ1lL','s5dHLHyFPqZNCsYMenhXh','wYJlokZ71siGUG8E7orKn','maybe');
INSERT INTO "votes" VALUES('jc9eVjdKGpeGu5Ae-iXm9','1MCFA1v1vbb-Snt3gkyfA','wYJlokZ71siGUG8E7orKn','skip');
INSERT INTO "votes" VALUES('Ul0V9OqLyWqyoQnfLnAxw','ddfEz3v0G3MPpA8CGszD0','wYJlokZ71siGUG8E7orKn','skip');
INSERT INTO "votes" VALUES('uVeS77AKdsTXLPgiSVPQR','jZd9vhNImirOMhmkrgci7','wYJlokZ71siGUG8E7orKn','maybe');
INSERT INTO "votes" VALUES('xxhJHoGHQVyEMxx30Ys5E','mjstEcea55Ib7G4aERzt9','wYJlokZ71siGUG8E7orKn','maybe');
INSERT INTO "votes" VALUES('cwQsu8kNrPvpr6PaS89xb','pR3qhD4wrMMebzWZ98jBq','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('G6LxhXNK8P4imwwjl-BXX','2RrDDgXvCVZLkkgaWeCib','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('yGxoN-mCGGsCXv4sDhwlw','dU6PFdB1mdaie8JycD5b3','an4-5R62YaoMgJbqSkJNd','maybe');
INSERT INTO "votes" VALUES('6kYD36z2N2ZmQpT9Dwf2y','jZd9vhNImirOMhmkrgci7','an4-5R62YaoMgJbqSkJNd','interested');
INSERT INTO "votes" VALUES('MwDJaGKxTgahmOrZW64T_','mjstEcea55Ib7G4aERzt9','an4-5R62YaoMgJbqSkJNd','maybe');
INSERT INTO "votes" VALUES('Zx_ACy-QMbR-WR2JxUprg','9FD9MdIOCxs_bljKdML0c','KEs5rqPHZMQSFnHn02fkG','interested');
INSERT INTO "votes" VALUES('bxekuoQMH27SwmK4pP4r5','pR3qhD4wrMMebzWZ98jBq','KEs5rqPHZMQSFnHn02fkG','maybe');
INSERT INTO "votes" VALUES('bAea_STOhyttGqM5gRm_b','HpZmwXgQxAYZrSIvLNlYc','KEs5rqPHZMQSFnHn02fkG','interested');
INSERT INTO "votes" VALUES('mK4iKZuNVzWtNFwp-7-7x','SmjNwiPYUgMFsep5mYG-U','KEs5rqPHZMQSFnHn02fkG','maybe');
INSERT INTO "votes" VALUES('ek810YCmXjv-Ia-zeJDu0','VxF619A-RwJlD8wUO9jvI','KEs5rqPHZMQSFnHn02fkG','interested');
INSERT INTO "votes" VALUES('co-x-Jxf1MuWZH63KXiWB','9FD9MdIOCxs_bljKdML0c','81iMSJg7Ylm5WE34UaJ8T','skip');
INSERT INTO "votes" VALUES('F_-D4unIrIam5K9nphlK_','CODB-HHby_9JDHauPfvXn','81iMSJg7Ylm5WE34UaJ8T','maybe');
INSERT INTO "votes" VALUES('hr1_yz2b-V_bWp0H_aPDx','3EQeWJocskET5PllemdkF','81iMSJg7Ylm5WE34UaJ8T','skip');
INSERT INTO "votes" VALUES('lbrVaEvslxsxkreLulOy8','s5dHLHyFPqZNCsYMenhXh','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('2a4IxjfVHwllfj8h-XxXx','2RrDDgXvCVZLkkgaWeCib','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('xkFpVhifoT1yjqmJ95zVe','K2QYSpKe2bz5zb80oP0nM','81iMSJg7Ylm5WE34UaJ8T','interested');
INSERT INTO "votes" VALUES('HtHTl0VPLbAHsCXkMOkmc','ddfEz3v0G3MPpA8CGszD0','81iMSJg7Ylm5WE34UaJ8T','skip');
INSERT INTO "votes" VALUES('HkKRe_-K0D0jYKYe0jV5l','SmjNwiPYUgMFsep5mYG-U','81iMSJg7Ylm5WE34UaJ8T','maybe');
INSERT INTO "votes" VALUES('xDVzY7Xc2dN7q5sqFZECe','VxF619A-RwJlD8wUO9jvI','81iMSJg7Ylm5WE34UaJ8T','skip');
INSERT INTO "votes" VALUES('S7pCVvwg_ruyx_i3-6YUt','3EQeWJocskET5PllemdkF','gIItrWYGF5PJad8FE2opQ','skip');
INSERT INTO "votes" VALUES('-P_jBjlh8N-lpyjM-7RHY','s5dHLHyFPqZNCsYMenhXh','gIItrWYGF5PJad8FE2opQ','maybe');
INSERT INTO "votes" VALUES('GdlkPoehsc4nX2WrEogQH','2RrDDgXvCVZLkkgaWeCib','gIItrWYGF5PJad8FE2opQ','maybe');
INSERT INTO "votes" VALUES('luhSZsKiYc3KaFE_xP9mt','ddfEz3v0G3MPpA8CGszD0','gIItrWYGF5PJad8FE2opQ','interested');
INSERT INTO "votes" VALUES('mbRwOBRa8ZQeBXPLVOrKQ','pR3qhD4wrMMebzWZ98jBq','-G-Xgn-agUctaWsOzil44','skip');
INSERT INTO "votes" VALUES('XbCsNGZZb0bS5h1mfycLB','3EQeWJocskET5PllemdkF','-G-Xgn-agUctaWsOzil44','skip');
INSERT INTO "votes" VALUES('3KuEOJMMDMhN33mvIpREU','2RrDDgXvCVZLkkgaWeCib','-G-Xgn-agUctaWsOzil44','interested');
INSERT INTO "votes" VALUES('n2r98rweQuLCKONiXoi8z','K2QYSpKe2bz5zb80oP0nM','-G-Xgn-agUctaWsOzil44','maybe');
INSERT INTO "votes" VALUES('yamwbpDC-lkDgL94aUIEt','HpZmwXgQxAYZrSIvLNlYc','ru5-Wk1IPwzNhTjc6aeu9','maybe');
INSERT INTO "votes" VALUES('ozukVM-YNlEHq2wGulPrl','dU6PFdB1mdaie8JycD5b3','ru5-Wk1IPwzNhTjc6aeu9','maybe');
INSERT INTO "votes" VALUES('rQiO352x2jQDooZoq5ycW','jZd9vhNImirOMhmkrgci7','ru5-Wk1IPwzNhTjc6aeu9','interested');
INSERT INTO "votes" VALUES('qBm8IdIhyJz80AkF4i8-a','SmjNwiPYUgMFsep5mYG-U','ru5-Wk1IPwzNhTjc6aeu9','maybe');
INSERT INTO "votes" VALUES('iaialp8hI3OZFzGNTWmmJ','VxF619A-RwJlD8wUO9jvI','ru5-Wk1IPwzNhTjc6aeu9','maybe');
INSERT INTO "votes" VALUES('KDUGFo8zIzAKVuI0RCmQa','CODB-HHby_9JDHauPfvXn','sU8I1Y1zxKZt03uLqlUJt','skip');
INSERT INTO "votes" VALUES('vSdZKSaJW-RskULpR_MLg','1MCFA1v1vbb-Snt3gkyfA','sU8I1Y1zxKZt03uLqlUJt','maybe');
INSERT INTO "votes" VALUES('w1Cgyad4YkM0sGIFDj_Bk','dU6PFdB1mdaie8JycD5b3','sU8I1Y1zxKZt03uLqlUJt','maybe');
INSERT INTO "votes" VALUES('5AnQYQ4moFwBLjAnNppgs','ddfEz3v0G3MPpA8CGszD0','sU8I1Y1zxKZt03uLqlUJt','skip');
INSERT INTO "votes" VALUES('8Xf5rjXR0tcA4fFFs2M_G','jZd9vhNImirOMhmkrgci7','sU8I1Y1zxKZt03uLqlUJt','maybe');
INSERT INTO "votes" VALUES('SAk2_RZfXy8kdAEKut2oV','9FD9MdIOCxs_bljKdML0c','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('tCOthivS39A2xPy1ArswV','s5dHLHyFPqZNCsYMenhXh','p9NPINJOY-dogGJAap8eQ','maybe');
INSERT INTO "votes" VALUES('JdWREDWdbNDiX8eprEDP7','2RrDDgXvCVZLkkgaWeCib','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('gEZgWN4Cly2AtFrMo7Qk7','K2QYSpKe2bz5zb80oP0nM','p9NPINJOY-dogGJAap8eQ','maybe');
INSERT INTO "votes" VALUES('zVQsB7U1-y4IS_T5SO0WZ','HpZmwXgQxAYZrSIvLNlYc','p9NPINJOY-dogGJAap8eQ','maybe');
INSERT INTO "votes" VALUES('1nHMXtQ7Mu6W3PXH53EBV','ddfEz3v0G3MPpA8CGszD0','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('JjkJK6_hQFY1_2UMf4HSM','mjstEcea55Ib7G4aERzt9','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('B4aRSoGFr4ysXzoqAUl-3','SmjNwiPYUgMFsep5mYG-U','p9NPINJOY-dogGJAap8eQ','interested');
INSERT INTO "votes" VALUES('hPpFPrwIG30lVZFu2BBgc','CODB-HHby_9JDHauPfvXn','2cdADeyRQA5uKgxmc46WZ','skip');
INSERT INTO "votes" VALUES('O-jKj0lBqb0QI1FXf5UMc','pR3qhD4wrMMebzWZ98jBq','2cdADeyRQA5uKgxmc46WZ','interested');
INSERT INTO "votes" VALUES('ybjGg_UouPjqoqrj1h-Fx','s5dHLHyFPqZNCsYMenhXh','2cdADeyRQA5uKgxmc46WZ','skip');
INSERT INTO "votes" VALUES('DaM-gpWRgYjpLZ6DblTvP','jZd9vhNImirOMhmkrgci7','2cdADeyRQA5uKgxmc46WZ','interested');
INSERT INTO "votes" VALUES('g6UAn2kHvZu8-auIlqoXf','VxF619A-RwJlD8wUO9jvI','2cdADeyRQA5uKgxmc46WZ','maybe');
INSERT INTO "votes" VALUES('3nv1iUVSoHoCTOFL30neU','s5dHLHyFPqZNCsYMenhXh','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('5LZta-z00IuTAN24eTs6P','K2QYSpKe2bz5zb80oP0nM','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('_5bsk8Cc1NxijA7ucaAbj','dU6PFdB1mdaie8JycD5b3','6qkUzJr_1ABY3_YG3ox0U','interested');
INSERT INTO "votes" VALUES('Pyf2wSCbEptoJV1di31yp','jZd9vhNImirOMhmkrgci7','6qkUzJr_1ABY3_YG3ox0U','skip');
INSERT INTO "votes" VALUES('tcIKK2uKL86ww0WpZPSuX','mjstEcea55Ib7G4aERzt9','6qkUzJr_1ABY3_YG3ox0U','maybe');
INSERT INTO "votes" VALUES('VRswcBssjuU15ffzNzI3N','SmjNwiPYUgMFsep5mYG-U','6qkUzJr_1ABY3_YG3ox0U','maybe');
CREATE TABLE "events" (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`website` text DEFAULT '' NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`proposal_phase_start` text,
	`proposal_phase_end` text,
	`voting_phase_start` text,
	`voting_phase_end` text,
	`scheduling_phase_start` text,
	`scheduling_phase_end` text,
	`max_session_duration` integer DEFAULT 120 NOT NULL,
	`break_minutes` integer DEFAULT 10 NOT NULL,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`icon` text
, `slot_increment_minutes` integer DEFAULT 30 NOT NULL, `rsvp_capacity_hard_limit` integer DEFAULT false NOT NULL);
INSERT INTO "events" VALUES('gu4RdXjUv7HwTxd7IVXYE','Conference Alpha','Conference-Alpha','Event currently in proposal phase','test-event-1.example.com','2026-10-11T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-08-23T09:24:40.715Z','2026-09-06T09:24:40.715Z','2026-09-06T09:24:40.715Z','2026-09-20T09:24:40.715Z','2026-09-20T09:24:40.715Z','2026-10-13T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0);
INSERT INTO "events" VALUES('5CEfgK22iDcfivfXUlzIK','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','test-event-2.example.com','2026-09-27T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-08-09T09:24:40.715Z','2026-08-23T09:24:40.715Z','2026-08-23T09:24:40.715Z','2026-09-06T09:24:40.715Z','2026-09-06T09:24:40.715Z','2026-09-29T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0);
INSERT INTO "events" VALUES('qI_s7M26JrYRkOEO3JLC9','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','test-event-3.example.com','2026-09-13T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-07-26T09:24:40.715Z','2026-08-09T09:24:40.715Z','2026-08-09T09:24:40.715Z','2026-08-23T09:24:40.715Z','2026-08-23T09:24:40.715Z','2026-09-15T16:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0);
CREATE TABLE "sessions" (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`start_time` text,
	`end_time` text,
	`capacity` integer DEFAULT 0 NOT NULL,
	`admin_managed` integer DEFAULT true NOT NULL,
	`blocker` integer DEFAULT false NOT NULL,
	`closed` integer DEFAULT false NOT NULL,
	`proposal_id` text,
	`event_id` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "sessions" VALUES('X4AQCvSiHkBSyU6g_d9Xb','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-11T07:00:00.000Z','2026-10-11T08:30:00.000Z',100,1,0,0,NULL,'gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "sessions" VALUES('weGTGgAGBx-mboQwml9UZ','Lunch Break','','2026-10-11T10:30:00.000Z','2026-10-11T12:00:00.000Z',0,1,1,0,NULL,'gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "sessions" VALUES('_RQKFUCCjURj8hEgCNtsM','Lunch Break','','2026-10-12T10:30:00.000Z','2026-10-12T12:00:00.000Z',0,1,1,0,NULL,'gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "sessions" VALUES('qgeLpuXkxl2vwYEpQFDlb','Lunch Break','','2026-10-13T10:30:00.000Z','2026-10-13T12:00:00.000Z',0,1,1,0,NULL,'gu4RdXjUv7HwTxd7IVXYE');
INSERT INTO "sessions" VALUES('taF5nsZh3hcunfKTo9f-H','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-09-27T07:00:00.000Z','2026-09-27T08:30:00.000Z',100,1,0,0,NULL,'5CEfgK22iDcfivfXUlzIK');
INSERT INTO "sessions" VALUES('e2Z_gFs00oWVxzNMl-tAc','Lunch Break','','2026-09-27T10:30:00.000Z','2026-09-27T12:00:00.000Z',0,1,1,0,NULL,'5CEfgK22iDcfivfXUlzIK');
INSERT INTO "sessions" VALUES('MBERbmEfBwCfy1KiG9Kn_','Lunch Break','','2026-09-28T10:30:00.000Z','2026-09-28T12:00:00.000Z',0,1,1,0,NULL,'5CEfgK22iDcfivfXUlzIK');
INSERT INTO "sessions" VALUES('WCyOjO-jYz7VGzvA-0G4m','Lunch Break','','2026-09-29T10:30:00.000Z','2026-09-29T12:00:00.000Z',0,1,1,0,NULL,'5CEfgK22iDcfivfXUlzIK');
INSERT INTO "sessions" VALUES('h1pOtrm3iDQOGQAZp0T8t','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-13T07:00:00.000Z','2026-09-13T08:30:00.000Z',100,1,0,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('Armbi6Zq6mGxQcIAhNNjR','Lunch Break','','2026-09-13T10:30:00.000Z','2026-09-13T12:00:00.000Z',0,1,1,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('jJiUyLUwqPUlFGSOWaPoC','Lunch Break','','2026-09-14T10:30:00.000Z','2026-09-14T12:00:00.000Z',0,1,1,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('i596107mFipbpapbnQ-fa','Lunch Break','','2026-09-15T10:30:00.000Z','2026-09-15T12:00:00.000Z',0,1,1,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('sLBMlWHTRFTozHcWi7q3Y','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-13T09:00:00.000Z','2026-09-13T10:00:00.000Z',100,0,0,0,'CODB-HHby_9JDHauPfvXn','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('DkfeMFj6BBFIXToTX6CJF','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-13T09:00:00.000Z','2026-09-13T10:30:00.000Z',30,0,0,1,'pR3qhD4wrMMebzWZ98jBq','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('blkhHv_BtMJXt7aI7FK0e','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-13T12:00:00.000Z','2026-09-13T13:00:00.000Z',100,0,0,0,'3EQeWJocskET5PllemdkF','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('oh6zIo5h51yRCPh1hsAzL','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-13T12:00:00.000Z','2026-09-13T13:30:00.000Z',25,0,0,0,'mjstEcea55Ib7G4aERzt9','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('9nwSqZDnfNu2vzN7fDiXP','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-13T13:30:00.000Z','2026-09-13T14:30:00.000Z',30,0,0,0,'1MCFA1v1vbb-Snt3gkyfA','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('p1JD-8qRY-3DYAS1IRz-b','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-14T07:00:00.000Z','2026-09-14T08:00:00.000Z',100,0,0,0,'9FD9MdIOCxs_bljKdML0c','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('kUJpF343wm50hBnMCSPBh','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-14T08:00:00.000Z','2026-09-14T09:30:00.000Z',25,0,0,0,'dU6PFdB1mdaie8JycD5b3','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('cM9LgnjJZdXQ6aKPuaIy5','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-14T08:30:00.000Z','2026-09-14T10:00:00.000Z',30,0,0,0,'jZd9vhNImirOMhmkrgci7','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('kN5NZvEHg1F-3zsgLRMU1','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',100,0,0,0,'VxF619A-RwJlD8wUO9jvI','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('a9cdPah-6VIvoo6Py1gFz','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',25,0,0,0,'K2QYSpKe2bz5zb80oP0nM','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('WB7SloVoHEkXO5i4n72UZ','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-14T14:00:00.000Z','2026-09-14T15:00:00.000Z',100,0,0,0,'HpZmwXgQxAYZrSIvLNlYc','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('MPFN48fLp-kpouDs7EdL4','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-14T14:00:00.000Z','2026-09-14T14:30:00.000Z',15,0,0,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('1GRIWqjXjR8qLkBkMbpG6','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-15T07:00:00.000Z','2026-09-15T08:00:00.000Z',100,0,0,0,'2RrDDgXvCVZLkkgaWeCib','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('-oQBLASgnXYbbHFeIrAmO','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-15T08:00:00.000Z','2026-09-15T09:00:00.000Z',30,0,0,0,'ddfEz3v0G3MPpA8CGszD0','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('nvlK7D7EhHT6f3yF4eEIB','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-15T08:30:00.000Z','2026-09-15T09:30:00.000Z',25,0,0,0,'SmjNwiPYUgMFsep5mYG-U','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('_80fvPJrQEa-QtAjanWer','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-15T12:00:00.000Z','2026-09-15T13:00:00.000Z',100,0,0,0,'s5dHLHyFPqZNCsYMenhXh','qI_s7M26JrYRkOEO3JLC9');
INSERT INTO "sessions" VALUES('h9RLofNGtz_DOFNeOnPcv','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-15T14:00:00.000Z','2026-09-15T15:00:00.000Z',100,1,0,0,NULL,'qI_s7M26JrYRkOEO3JLC9');
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Example Conference Weekend' NOT NULL,
	`description` text DEFAULT 'Welcome! Browse the schedules for each event below.' NOT NULL,
	`map_image_url` text DEFAULT '' NOT NULL
);
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
COMMIT;
