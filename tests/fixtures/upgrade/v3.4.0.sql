-- Seeded database of schellingboard v3.4.0, dumped by
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
INSERT INTO "__drizzle_migrations" VALUES(NULL,'06cec3b2494c8db2cf67f5745f3e59226ff7ee04364d6f6fd5c3a5212b91e104',1784110051953);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'e0d86b181f1852f4ff7d449d570e835ec6f1e38b61b627663c3c1572113e24db',1784367197755);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'bfa65f0fa84b99d4e420a90b7e5a7b54345fd871682dbdbaf5085da90ed4f286',1784389404349);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'d5404cae79c27b1b45c3ac2bc0683ac8183b6506156e98174ba4ebc873ba255c',1784721166667);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'2e72787d10a9ac51c279679608dd0c47f2c5c8afadf903dc851ec421dd9a6ea1',1785244239059);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'024501d900cc0ba16b52c41d7daab9f11a2aa690acc45f455bfb149f81818188',1785333843585);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'485683124132b5fe564716885bfda1a274000782dc4d37a9bc02637e74a706b3',1785596621720);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'176bc0daad9320c72598eebe3df68b9a800cc87ccf314555508c119954244676',1786525223340);
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text, `email_on_rsvp_change` integer DEFAULT true NOT NULL, `email_on_host_change` integer DEFAULT true NOT NULL, `email_on_cohost_add` integer DEFAULT true NOT NULL, `based_in` text, `prompts` text, `languages` text, `contacts` text, `auth_protected` integer DEFAULT false NOT NULL, `password_hash` text, `email_on_proposal_comment` integer DEFAULT true NOT NULL, `email_on_comment_thread` integer DEFAULT false NOT NULL, `profile_updated_at` text);
INSERT INTO "guests" VALUES('QjSYwq0q5Wl5F6SuIzbb5','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/QjSYwq0q5Wl5F6SuIzbb5.webp?v=1788081930023','She/Her',1,1,1,'Osaka, Japan','[{"prompt":"Ask me about","answer":"Accessible design patterns and Japanese web typography"},{"prompt":"Offering","answer":"Code review swaps and coffee-machine debugging sessions"}]','["Japanese","English"]','[{"type":"website","value":"https://alice-test.example.com"},{"type":"telegram","value":"@alice_frontend"}]',0,NULL,1,0,'2026-08-30T06:25:30.023Z');
INSERT INTO "guests" VALUES('D_KKgOp9oye8dMYNu8rUE','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/D_KKgOp9oye8dMYNu8rUE.webp?v=1788081930024','He/Him',1,1,1,'Lagos, Nigeria','[{"prompt":"Looking for","answer":"Speakers for an inclusive product design meetup back home"},{"prompt":"Offering","answer":"Feedback on your product roadmap over coffee"}]','["English","Yoruba"]','[{"type":"email","value":"bob.organizes@example.com"},{"type":"whatsapp","value":"+234 801 234 5678"}]',0,NULL,1,0,'2026-08-29T11:25:30.024Z');
INSERT INTO "guests" VALUES('v1LWH3w7-LKJl-6gC-n6r','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/v1LWH3w7-LKJl-6gC-n6r.webp?v=1788081930024','They/Them',1,1,1,'Guadalajara, Mexico','[{"prompt":"Ask me about","answer":"Stream processing pipelines, or my sourdough starter"},{"prompt":"My weirdest skill","answer":"Naming Kafka topics that still make sense a year later"}]','["Spanish","English"]','[{"type":"discord","value":"charlie.streams"},{"type":"website","value":"https://charlie.dev"}]',0,NULL,1,0,'2026-08-28T16:25:30.024Z');
INSERT INTO "guests" VALUES('7wppeVFZl5b7RQuuEYSbt','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him',1,1,1,NULL,'[{"prompt":"Ask me about","answer":"Retro handheld consoles"}]',NULL,NULL,0,NULL,1,0,'2026-08-27T21:25:30.024Z');
INSERT INTO "guests" VALUES('6eHa7YiDL-FaJJSm0Ez7n','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL);
INSERT INTO "guests" VALUES('_PH-RjjLi9r4grie1eW3g','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her',1,1,1,NULL,NULL,NULL,NULL,1,'scrypt$MVSyc8/cYrC80s6duOqEAQ==$WGJPnNba4c0CcYuH1SVFTAoI1E1doKV9ne+wWqGWEhg=',1,0,'2026-08-26T07:25:30.112Z');
INSERT INTO "guests" VALUES('3Pu8go-_UUJtIVkmUGi-3','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/3Pu8go-_UUJtIVkmUGi-3.webp?v=1788081930025',NULL,1,1,1,'Shanghai, China','[{"prompt":"Ask me about","answer":"Build caching strategies that hold up under real CI load"}]','["Mandarin Chinese","English"]','[{"type":"telegram","value":"@weichen_dev"}]',1,'scrypt$2pkZmwfvbrxPce3sTN+zbw==$QH5zNwIisSicu+wzMII1ionnp/YBYqHYCW8XBeQaKhQ=',1,0,'2026-08-25T12:25:30.113Z');
INSERT INTO "guests" VALUES('HVXX4b0kZPE2S87I_d8-8','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/HVXX4b0kZPE2S87I_d8-8.webp?v=1788081930025','She/Her',1,1,1,'Bengaluru, India','[{"prompt":"Ask me about","answer":"Fairness metrics for recommender systems"},{"prompt":"Looking for","answer":"A conference buddy — this is my first time here!"}]','["Hindi","Kannada","English"]','[{"type":"website","value":"https://priyasharma.example.com"}]',0,NULL,1,0,'2026-08-24T17:25:30.025Z');
INSERT INTO "guests" VALUES('bcmhGiTYaUrkuiHoDhOlY','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/bcmhGiTYaUrkuiHoDhOlY.webp?v=1788081930025','He/Him',1,1,1,'Gothenburg, Sweden','[{"prompt":"Offering","answer":"Strong opinions about Rust, mild opinions about saunas"}]','["Swedish","English"]','[{"type":"signal","value":"lars.eriksson.99"}]',1,'scrypt$murbSCcwX1hfmzehoIBLTA==$Ssgyb1VRQlFUbe5UDXI2INTcUDKDMAFr/VpOr1Ppvzs=',1,0,'2026-08-23T22:25:30.093Z');
INSERT INTO "guests" VALUES('v5tZAbb7YSFl5PJzo21s-','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/v5tZAbb7YSFl5PJzo21s-.webp?v=1788081930025',NULL,1,1,1,'Muscat, Oman','[{"prompt":"Ask me about","answer":"Threat modeling for teams too small to have a security hire"}]','["Arabic","English"]','[{"type":"email","value":"fatima.breaks.things@example.com"}]',1,'scrypt$2m3q9qTOiIMai8PmguPm0g==$RY1S+e5SEG22daCDfbwdYobrJLF548V6ulXw30kbla0=',1,0,'2026-08-23T03:25:30.097Z');
INSERT INTO "guests" VALUES('9g0CZRnXO7QGjOEubveKk','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/9g0CZRnXO7QGjOEubveKk.webp?v=1788081930025','He/Him',1,1,1,'Accra, Ghana','[{"prompt":"Offering","answer":"War stories about building for 2G networks"}]','["Twi","English"]','[{"type":"whatsapp","value":"+233 24 555 0187"}]',1,'scrypt$oApfwzJZU0tap5QeaWf/2Q==$G6aZeKMzjIkLICSxe4qO20oxJ54qyIY/GYujJ9psWYY=',1,0,'2026-08-22T08:25:30.162Z');
INSERT INTO "guests" VALUES('nq1-w7m5KRdP6EM7aGUap','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/nq1-w7m5KRdP6EM7aGUap.webp?v=1788081930026',NULL,1,1,1,'Yokohama, Japan','[{"prompt":"My weirdest skill","answer":"Debugging a blinking LED by ear"}]','["Japanese"]',NULL,1,'scrypt$EwDPhGhP7XpDurhd4AMxCQ==$TXLoJQRH8PAvm9My+a76EMHOQpDeQlsoIf7LMK94Rgk=',1,0,'2026-08-21T13:25:30.166Z');
INSERT INTO "guests" VALUES('8MHg-dZjICzw4uMa1DmJ8','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/8MHg-dZjICzw4uMa1DmJ8.webp?v=1788081930026','She/Her',1,1,1,'Berlin, Germany','[{"prompt":"Ask me about","answer":"Research ethics for multilingual user studies"}]','["French","Wolof","English","German"]','[{"type":"website","value":"https://aishadiallo.example.com"},{"type":"other","label":"Mastodon","value":"@aisha@ux.social"}]',1,'scrypt$1pzkZpMmZ42mn2G9SJleQg==$sH+pXvbFNm7RAxSCuauRpi+IZqyuBFxrAUJ9go3cXn0=',1,0,'2026-08-20T18:25:30.182Z');
INSERT INTO "guests" VALUES('83A_jeq0VHVMn_8_sXYT5','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/83A_jeq0VHVMn_8_sXYT5.webp?v=1788081930026',NULL,1,1,1,'Buenos Aires, Argentina','[{"prompt":"Offering","answer":"A rundown of the worst incident I ever caused, for entertainment purposes"}]','["Spanish","English"]','[{"type":"telegram","value":"@diego_sre"}]',1,'scrypt$NsLblfHBWUsw82c7oed20Q==$M7wDC+frA5SDeC09P6L5RVFDJuOFGsc50Yw1CcAzjzM=',1,0,'2026-08-19T23:25:30.183Z');
INSERT INTO "guests" VALUES('WmJuQ9CYHC091pooqSZFZ','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/WmJuQ9CYHC091pooqSZFZ.webp?v=1788081930026','She/Her',1,1,1,'Taipei, Taiwan','[{"prompt":"Ask me about","answer":"Turning a wall of Slack threads into docs people read"}]','["Mandarin Chinese","English"]',NULL,1,'scrypt$J2vk1ba5t/G+MooDaAdlAQ==$M5mstdVIsovxquc5G3OX5l16kIGB1LOYks7cu9sS/A4=',1,0,'2026-08-19T04:25:30.215Z');
INSERT INTO "guests" VALUES('fZqYxnoseVCyKIsZHt8CO','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/fZqYxnoseVCyKIsZHt8CO.webp?v=1788081930027',NULL,1,1,1,'Novosibirsk, Russia','[{"prompt":"Offering","answer":"A very detailed opinion about your slow query, whether you want it or not"}]','["Russian","English"]','[{"type":"email","value":"olga.petrova.db@example.com"}]',1,'scrypt$/o5k3GSNgWuhSX9sPt/WWw==$maIb/mFkFEakLCKC8wfcI8aRmcg4wmv27aHoH6gy45k=',1,0,'2026-08-18T09:25:30.219Z');
INSERT INTO "guests" VALUES('jB_BrN3R2pe9d9dJmVD-Z','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/jB_BrN3R2pe9d9dJmVD-Z.webp?v=1788081930027','He/Him',1,1,1,'Lyon, France','[{"prompt":"Looking for","answer":"Cheese recommendations near the venue"}]','["French","English"]','[{"type":"whatsapp","value":"+33 6 12 34 56 78"}]',0,NULL,1,0,'2026-08-17T14:25:30.027Z');
INSERT INTO "guests" VALUES('cZMLUBfa0F6S6I5EfHRYz','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/cZMLUBfa0F6S6I5EfHRYz.webp?v=1788081930028',NULL,1,1,1,'Johannesburg, South Africa','[{"prompt":"Ask me about","answer":"Building civic tech that survives contact with real government data"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-16T19:25:30.028Z');
INSERT INTO "guests" VALUES('9FroXFwPtFCmLcWR5Or3U','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/9FroXFwPtFCmLcWR5Or3U.webp?v=1788081930028','She/Her',1,1,1,'Kraków, Poland','[{"prompt":"Offering","answer":"Trades: I''ll find your worst bug for a board game recommendation"}]','["Polish","English"]','[{"type":"discord","value":"anna.qa"}]',0,NULL,1,0,'2026-08-16T00:25:30.028Z');
INSERT INTO "guests" VALUES('0YSe4489kcFwbDkAXLkP0','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/0YSe4489kcFwbDkAXLkP0.webp?v=1788081930028',NULL,1,1,1,'Cairo, Egypt','[{"prompt":"A hill I will die on","answer":"Boring architecture beats clever architecture, every time"}]','["Arabic","English"]',NULL,0,NULL,1,0,'2026-08-15T05:25:30.029Z');
INSERT INTO "guests" VALUES('e82w5UT6LusUDYXvbVNHN','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/e82w5UT6LusUDYXvbVNHN.webp?v=1788081930029','She/Her',1,1,1,'Milan, Italy','[{"prompt":"Ask me about","answer":"Getting design tokens to survive contact with production"}]','["English","French"]','[{"type":"website","value":"https://isabellarossi.example.com"}]',0,NULL,1,0,'2026-08-14T10:25:30.029Z');
INSERT INTO "guests" VALUES('Q6eo854u23kBy9QQk8N_m','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/Q6eo854u23kBy9QQk8N_m.webp?v=1788081930029','They/Them',1,1,1,'Seoul, South Korea','[{"prompt":"Currently obsessed with","answer":"CRDTs, and why conflict-free replication is harder than it sounds"}]','["Korean","English"]','[{"type":"discord","value":"minjunkim"}]',0,NULL,1,0,'2026-08-13T15:25:30.029Z');
INSERT INTO "guests" VALUES('QFCjX9dTA-lh3ykbA1bj9','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/QFCjX9dTA-lh3ykbA1bj9.webp?v=1788081930029',NULL,1,1,1,'Porto, Portugal','[{"prompt":"Offering","answer":"A talk about automating yourself out of a job, repeatedly"}]','["Portuguese","English"]',NULL,0,NULL,1,0,'2026-08-12T20:25:30.029Z');
INSERT INTO "guests" VALUES('G8OmLmmELGnP-WhARRWhV','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her',1,1,1,'Beirut, Lebanon','[{"prompt":"Looking for","answer":"Mentors and mentees for a women-in-tech circle back home"}]','["Arabic","French","English"]','[{"type":"other","label":"Instagram","value":"@nadia.builds"}]',0,NULL,1,0,'2026-08-12T01:25:30.029Z');
INSERT INTO "guests" VALUES('Dn1JfrOPKM3MN_1FblphI','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL,1,1,1,'Copenhagen, Denmark','[{"prompt":"Offering","answer":"A free accessibility pass on your slides — bring your laptop"}]','["Danish","English"]','[{"type":"email","value":"freya.a11y@example.com"}]',0,NULL,1,0,'2026-08-11T06:25:30.029Z');
INSERT INTO "guests" VALUES('RU9nYsEcJzqc_ednIERw_','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him',1,1,1,'Kochi, India','[{"prompt":"Currently obsessed with","answer":"Consensus protocols, and where filter coffee ranks among them"}]','["Malayalam","English"]',NULL,0,NULL,1,0,'2026-08-10T11:25:30.029Z');
INSERT INTO "guests" VALUES('AihenfK1lc_DtRCbGnZMz','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL,1,1,1,'Istanbul, Turkey','[{"prompt":"Looking for","answer":"Session recommendations — I''m new here and excited about everything"}]','["Turkish","English"]',NULL,0,NULL,1,0,'2026-08-09T16:25:30.029Z');
INSERT INTO "guests" VALUES('zsNXiSggm-32OG1Nltfh9','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL,1,1,1,'Ibadan, Nigeria',NULL,'["Yoruba","English"]',NULL,0,NULL,1,0,'2026-08-08T21:25:30.029Z');
INSERT INTO "guests" VALUES('tNgPrenwfsyWgXdmhTkJT','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them',1,1,1,'Ho Chi Minh City, Vietnam','[{"prompt":"Offering","answer":"Static site generator recommendations, unsolicited and opinionated"}]','["Vietnamese","English"]','[{"type":"telegram","value":"@linh_jamstack"}]',0,NULL,1,0,'2026-08-08T02:25:30.029Z');
INSERT INTO "guests" VALUES('szr8__xh9YMN2LpGWETIj','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL,1,1,1,'Zagreb, Croatia','[{"prompt":"A hill I will die on","answer":"Estimates are a communication tool, not a promise"}]','["Croatian","English"]',NULL,0,NULL,1,0,'2026-08-07T07:25:30.029Z');
INSERT INTO "guests" VALUES('9JooMeSbTSmEaLKsrVarM','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL,1,1,1,NULL,'[{"prompt":"My weirdest skill","answer":"Reading language specs for fun, apparently"}]',NULL,NULL,0,NULL,1,0,'2026-08-06T12:25:30.029Z');
INSERT INTO "guests" VALUES('K4DHbqaIN6Zb6a4ytDqH8','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her',1,1,1,'Bologna, Italy','[{"prompt":"Ask me about","answer":"Making public health research reproducible without a data team"}]',NULL,'[{"type":"website","value":"https://chiarabianchi.example.com"}]',0,NULL,1,0,'2026-08-05T17:25:30.029Z');
INSERT INTO "guests" VALUES('WxXF_iMmKJO_lrRfx13Gj','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL,1,1,1,'Durban, South Africa','[{"prompt":"Offering","answer":"Container query wizardry, upon request"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-04T22:25:30.029Z');
INSERT INTO "guests" VALUES('0SRqfXklt5i26mv0cAGEN','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL,1,1,1,'São Paulo, Brazil','[{"prompt":"Offering","answer":"Mentoring conversations for junior devs finding their footing"}]','["Portuguese","English"]','[{"type":"website","value":"https://rafaelsouza.example.com"}]',0,NULL,1,0,'2026-08-04T03:25:30.029Z');
INSERT INTO "guests" VALUES('NC-tL-XUUw3FX9uldEzIL','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.','/media/avatars/NC-tL-XUUw3FX9uldEzIL.webp?v=1788081930029','She/Her',1,1,1,'Kyoto, Japan','[{"prompt":"I collect","answer":"Conference stickers, competitively"}]','["Japanese","English"]','[{"type":"website","value":"https://hanakobayashi.example.com"},{"type":"other","label":"Bluesky","value":"@hanak.dev"}]',0,NULL,1,0,'2026-08-03T08:25:30.029Z');
INSERT INTO "guests" VALUES('Ckbuc6jH9wq5YwCRbj_gd','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL,1,1,1,'Prague, Czechia','[{"prompt":"Ask me about","answer":"Sustainable maintainership for projects that outlive their funding"}]','["Czech","English"]','[{"type":"website","value":"https://github.example.com/tereza"}]',0,NULL,1,0,'2026-08-02T13:25:30.029Z');
INSERT INTO "guests" VALUES('pBNXg_yJ-sQ89E9eCqKrN','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him',1,1,1,'Amsterdam, Netherlands','[{"prompt":"Currently obsessed with","answer":"Developer tooling, and slowly learning Dutch"}]','["Persian","Dutch","English"]',NULL,0,NULL,1,0,'2026-08-01T18:25:30.029Z');
INSERT INTO "guests" VALUES('J9p4xEZXtxzquUK9fsube','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL,1,1,1,'Thessaloniki, Greece','[{"prompt":"Offering","answer":"Loosely held opinions on everything except testing"}]','["Greek","English"]',NULL,0,NULL,1,0,'2026-07-31T23:25:30.029Z');
INSERT INTO "guests" VALUES('PFXj1v5wYnR0J3WGRzfNw','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL);
INSERT INTO "guests" VALUES('W4iFiQGvwqDY93_6-w66L','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They',1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,'2026-07-30T09:25:30.029Z');
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
INSERT INTO "locations" VALUES('loc-library','Reading Room','/locations/loc-library.jpg','A quiet, book-lined room with a grand skylight and long communal tables. Great for focused breakout sessions or attendees who need a calm space to work between talks.',40,'amber',0,1,4,'2nd floor, North Wing');
INSERT INTO "locations" VALUES('loc-boardroom','Boardroom','/locations/loc-boardroom.jpg','A compact meeting room with a glass-walled conference table and video conferencing setup. Well suited for small-group discussions, interviews, or sponsor meetings.',10,'indigo',0,1,5,'1st floor, East Wing');
INSERT INTO "locations" VALUES('loc-auditorium','Auditorium','/locations/loc-auditorium.jpg','A tiered lecture theatre with fixed seating and a large presentation screen. Best for high-attendance keynotes and formal talks that don''t need audience interaction.',200,'orange',0,1,6,'Ground floor, West Wing');
INSERT INTO "locations" VALUES('loc-courtyard','Courtyard','/locations/loc-courtyard.jpg','A dramatic covered courtyard framed by stone arches, open to the sky above. Works well as a striking gathering point between sessions or a quiet spot to reflect.',50,'sky',0,1,7,'Ground floor, Central Courtyard');
INSERT INTO "locations" VALUES('loc-rooftop','Rooftop Terrace','/locations/loc-rooftop.jpg','An open-air rooftop space with skyline views and casual seating. Ideal for informal chats, evening socials, or breakout conversations away from the main venue.',20,'teal',0,1,8,'Rooftop, East Wing');
CREATE TABLE "days" (
	`id` text PRIMARY KEY NOT NULL,
	`start` text NOT NULL,
	`end` text NOT NULL,
	`start_bookings` text NOT NULL,
	`end_bookings` text NOT NULL,
	`event_id` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "days" VALUES('Yw5pt89ZE0fFHzvLtzxeI','2026-10-11T07:00:00.000Z','2026-10-11T16:00:00.000Z','2026-10-11T07:00:00.000Z','2026-10-11T15:30:00.000Z','3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "days" VALUES('oqTY0Uaz5nZEmQ6hopVYm','2026-10-12T07:00:00.000Z','2026-10-12T16:00:00.000Z','2026-10-12T07:00:00.000Z','2026-10-12T15:30:00.000Z','3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "days" VALUES('Vf11hqXA4x9G2h9mlS2qb','2026-10-13T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-10-13T07:00:00.000Z','2026-10-13T15:30:00.000Z','3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "days" VALUES('8cJLTOpcGEd5RSOaXhM4a','2026-09-27T07:00:00.000Z','2026-09-27T16:00:00.000Z','2026-09-27T07:00:00.000Z','2026-09-27T15:30:00.000Z','4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "days" VALUES('tA5u56ge99c8J84h2VL38','2026-09-28T07:00:00.000Z','2026-09-28T16:00:00.000Z','2026-09-28T07:00:00.000Z','2026-09-28T15:30:00.000Z','4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "days" VALUES('RTfcff676yx67iDxPXUrM','2026-09-29T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-09-29T07:00:00.000Z','2026-09-29T15:30:00.000Z','4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "days" VALUES('obApOpfTsDdP2Vr6OnKSy','2026-09-13T07:00:00.000Z','2026-09-13T16:00:00.000Z','2026-09-13T07:00:00.000Z','2026-09-13T15:30:00.000Z','CHvVvgFcGB3sglCOcForn');
INSERT INTO "days" VALUES('H-DtumFkXGg8VqREpgRGe','2026-09-14T07:00:00.000Z','2026-09-14T16:00:00.000Z','2026-09-14T07:00:00.000Z','2026-09-14T15:30:00.000Z','CHvVvgFcGB3sglCOcForn');
INSERT INTO "days" VALUES('v2zobRi50Yz14kjjian05','2026-09-15T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-09-15T07:00:00.000Z','2026-09-15T15:30:00.000Z','CHvVvgFcGB3sglCOcForn');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','szr8__xh9YMN2LpGWETIj');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','K4DHbqaIN6Zb6a4ytDqH8');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','J9p4xEZXtxzquUK9fsube');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "event_guests" VALUES('3JBdGjXrB1T9H4gI-JYno','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','szr8__xh9YMN2LpGWETIj');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','K4DHbqaIN6Zb6a4ytDqH8');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','J9p4xEZXtxzquUK9fsube');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "event_guests" VALUES('4XWaXczC8a1QUvqs1AKd7','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','szr8__xh9YMN2LpGWETIj');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','K4DHbqaIN6Zb6a4ytDqH8');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','J9p4xEZXtxzquUK9fsube');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "event_guests" VALUES('CHvVvgFcGB3sglCOcForn','W4iFiQGvwqDY93_6-w66L');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-main-hall');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-room-a');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-room-b');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-library');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-boardroom');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-auditorium');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-courtyard');
INSERT INTO "event_locations" VALUES('3JBdGjXrB1T9H4gI-JYno','loc-rooftop');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-main-hall');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-room-a');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-room-b');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-library');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-boardroom');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-auditorium');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-courtyard');
INSERT INTO "event_locations" VALUES('4XWaXczC8a1QUvqs1AKd7','loc-rooftop');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-main-hall');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-room-a');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-room-b');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-library');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-boardroom');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-auditorium');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-courtyard');
INSERT INTO "event_locations" VALUES('CHvVvgFcGB3sglCOcForn','loc-rooftop');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('uKkN7nF36cChUf4h3SAfV','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "proposal_hosts" VALUES('Es5LmtcfmlDqv318zWYQb','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('6JYvzosE4dBD43v-dLkaw','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "proposal_hosts" VALUES('QgEImm_yXX32n4tiJ_DOK','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "proposal_hosts" VALUES('QgEImm_yXX32n4tiJ_DOK','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "proposal_hosts" VALUES('QjEHrYmV8K7jXdwd6ZDwQ','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "proposal_hosts" VALUES('QjEHrYmV8K7jXdwd6ZDwQ','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "proposal_hosts" VALUES('W3PWAva29sxJXUDgc7fSI','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "proposal_hosts" VALUES('IuiI0Fq37gvR3Hrd_OKrt','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "proposal_hosts" VALUES('02qM4mTRR-wdrXIf4hvlY','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "proposal_hosts" VALUES('oByP1Pwi_jqe-TLQHRBBm','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('NxVBA84y5Vu0ekOdY0RB5','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "proposal_hosts" VALUES('ltjNzmJ4dhwhl1LP42vVu','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('YaSbCK1umgVe7drTjOrK2','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "proposal_hosts" VALUES('YaSbCK1umgVe7drTjOrK2','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "proposal_hosts" VALUES('kxphdJ2BxA05lMLa4kKOX','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "proposal_hosts" VALUES('rdU8Jm1oec1_dnNAgbowj','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "proposal_hosts" VALUES('j24Rk9cefwEyxKgVFVj7r','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "proposal_hosts" VALUES('BdG9XohDwXo_pCFYiGcjC','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "proposal_hosts" VALUES('BdG9XohDwXo_pCFYiGcjC','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "proposal_hosts" VALUES('6XVQh9-v29HSuPdYKXrpL','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "proposal_hosts" VALUES('8JzKrswYwD_GkmvZFXbjG','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "proposal_hosts" VALUES('5_NY-3opQ-QzljJlKpUae','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('VYQpZLD0KsUIeoZM0Trf2','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "proposal_hosts" VALUES('UaO7U8UuiXftocloVxkMW','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('jaogdcQ99_I2gwQyssP40','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "proposal_hosts" VALUES('btzW4kYdULn5zYL4kVHrB','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "proposal_hosts" VALUES('gEEzQKfwB0F1VqX8XdsVc','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "proposal_hosts" VALUES('CG923Mfo1qJerOc8lfVvk','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "proposal_hosts" VALUES('j1caYlMIZ_35jKZxfy9Z_','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "proposal_hosts" VALUES('apy4H5nkDRao_kihnmMQ2','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "proposal_hosts" VALUES('_sfDFAgSBjNWIheuO7ZUa','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "proposal_hosts" VALUES('zqBRJPWIPPHHxviN0l12p','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "proposal_hosts" VALUES('S5GTVBmSZd551jTwDwPmW','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "proposal_hosts" VALUES('4W2Y467pxZDCbDYB5akWV','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "proposal_hosts" VALUES('OoMfwjFaJeu2uCXGoahVm','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "proposal_hosts" VALUES('VClgJ7Z1EQ470p0exGiXI','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "proposal_hosts" VALUES('xIRenXNxw_VgkpNxi0Pz1','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "proposal_hosts" VALUES('kPA9ReCYTzqVA30iy_ukb','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "proposal_hosts" VALUES('PnKSnU0YmB2ki07qfIPD8','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "proposal_hosts" VALUES('PnKSnU0YmB2ki07qfIPD8','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "proposal_hosts" VALUES('8XrT2WvYSlN2PTBb8sYCi','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "proposal_hosts" VALUES('F3zGeyUV6kZtglwIwyx2D','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "proposal_hosts" VALUES('bX4EIi6blbPnA0cWa7Xlg','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "proposal_hosts" VALUES('6SSVlh6hmMl1gDCA5ByEu','v5tZAbb7YSFl5PJzo21s-');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('2kR7UcWYlkrzcWXa9TaXt','NutVkebXzRLt5hsx9X46b','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('C7iwFAy9UbY6yIHwL8_Ks','Ct3lN9o2qFEuV-3UlcHqW','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('ASqC3qDBUFCgyKAeiMCR3','IVpdJlFl76HZM-RgM5gyK','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('RAY5dMc7Z202q5R5qX467','__t5S8yaaoivxf-p9eRL-','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('KSUciFIMhsgpSnY7cJ5aV','pXDgZEi8Zkx-hEtNHkEyp','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('vY9aiNtuLm_ZE3_yIToci','Ih8Y9wPG8g6_zTL9twNq9','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "rsvps" VALUES('opbejxKmstg7rR06PChIK','GlnS6ieKGMKzQ5OVIEEg2','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "rsvps" VALUES('dtBjK8fIpZZrp142o8Le9','POA9K_G3bPA0Yep9GL4WX','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "rsvps" VALUES('4_ikqE1YSup2yp1c5K0EI','rD0ZoLJZMAwf6tb1YwZH6','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "rsvps" VALUES('NHNNOo5mnfeKk4eZWPNTf','8I-5-yNyIbRS5jU2y1LFw','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "rsvps" VALUES('7fwVeTw1b5xj2TUu1CK6t','Ct3lN9o2qFEuV-3UlcHqW','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "rsvps" VALUES('9oZLYEU9I9JIT3E9MRhrK','IVpdJlFl76HZM-RgM5gyK','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "rsvps" VALUES('fub0UlEFBnu42-Bmef6KJ','QjneSDqv143qZmclBOZp3','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "rsvps" VALUES('ZCSuytk2JTmCl1i_kfclA','__t5S8yaaoivxf-p9eRL-','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "rsvps" VALUES('u6x2FaY_dqLMtUpIAzIGK','h1iEOElcXfu6ohFLxx2Eb','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "rsvps" VALUES('oOBQwT5E_G2vIFYyKVw1d','rD0ZoLJZMAwf6tb1YwZH6','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "rsvps" VALUES('7IVXRxMjv3XWDX3dRwNH7','8I-5-yNyIbRS5jU2y1LFw','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "rsvps" VALUES('WV9HlRtFxSxVy89G1PRsb','__t5S8yaaoivxf-p9eRL-','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "rsvps" VALUES('A8fEPHv7OUCYTta3kM9_0','MXJB8cB3QNZXzm0ohZ8kS','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "rsvps" VALUES('RAwTsrgGunSJm1Fhx9tqV','h1iEOElcXfu6ohFLxx2Eb','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "rsvps" VALUES('gvQMvhKrZ76pWbJnaI25t','NutVkebXzRLt5hsx9X46b','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('kw0aYg89bhOY18M6QU_Q2','POA9K_G3bPA0Yep9GL4WX','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('xkGTSnpUvL6c4vMyf2j0w','bH5fF1MXNMLk_FfKTNdzK','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('K0OzOBSCWEScnxj9WQIqQ','QjneSDqv143qZmclBOZp3','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('7GvcW2Iqs8XG8h2nwHFsj','OXyNEs_J831PJ3CbysOFx','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('JdxP_qrUc1Vhl_sH964Ex','pXDgZEi8Zkx-hEtNHkEyp','6eHa7YiDL-FaJJSm0Ez7n');
INSERT INTO "rsvps" VALUES('6XrmCmOyVcwpdWM5Y5Ggk','POA9K_G3bPA0Yep9GL4WX','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('hDWsiloY1Z63TWf-Dn5h6','uaqISzRkWL0F9AoDLH3VS','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('FhL-Y2F55DotOJWNrfno_','QjneSDqv143qZmclBOZp3','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('gave6LcXu8jDw6nEIpJqK','__t5S8yaaoivxf-p9eRL-','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('AAKRhwRv2YvUQhfjDw8io','MXJB8cB3QNZXzm0ohZ8kS','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('StyClcwclwIHNI6x63WqL','hwm7mZHl-FImuaEKXEc55','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('wM3BIlGJOmvZSEubx1y3O','pXDgZEi8Zkx-hEtNHkEyp','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "rsvps" VALUES('ZOP3-QVGU_DswliwJu6Hk','in1eYBhjmt1VvNjg9LXS6','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('rdRFsoyg-PzRH254GfU4P','IVpdJlFl76HZM-RgM5gyK','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('W8egezTVYzzv1MXBRdIFg','POA9K_G3bPA0Yep9GL4WX','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('Mv1f--NQLZVJTMUFJx_K7','QjneSDqv143qZmclBOZp3','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('2bghYqb7RpR_wWJ_seFvi','__t5S8yaaoivxf-p9eRL-','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('oPHuwY57hq8TzrAkalp6r','Ih8Y9wPG8g6_zTL9twNq9','3Pu8go-_UUJtIVkmUGi-3');
INSERT INTO "rsvps" VALUES('qXxTMXb432bBLTcN24xlv','Ct3lN9o2qFEuV-3UlcHqW','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "rsvps" VALUES('OZsAgw7tqLLHUYqhL5FPS','GlnS6ieKGMKzQ5OVIEEg2','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "rsvps" VALUES('IDXm95pZSmOJ6LM0VL5uO','rD0ZoLJZMAwf6tb1YwZH6','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "rsvps" VALUES('ewgQkgbzRXE0Wa_A2izFg','MXJB8cB3QNZXzm0ohZ8kS','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "rsvps" VALUES('-sRz8pDhWk5aG_eFfT1Ga','h1iEOElcXfu6ohFLxx2Eb','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "rsvps" VALUES('Gs0wtlJUriHsxcluW-e6g','in1eYBhjmt1VvNjg9LXS6','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('IW30z-_zwQeQjzvuvbXrJ','GlnS6ieKGMKzQ5OVIEEg2','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('HZ-WYGVfmkp4WSXtD191N','uaqISzRkWL0F9AoDLH3VS','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('faIbomizT_pMDPUpNUXVT','__t5S8yaaoivxf-p9eRL-','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('_txHXEUMS_LX67M-yKhYD','MXJB8cB3QNZXzm0ohZ8kS','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('Dqt0zncn1HrMkwY_hiLJa','h1iEOElcXfu6ohFLxx2Eb','bcmhGiTYaUrkuiHoDhOlY');
INSERT INTO "rsvps" VALUES('ovKdaLYvZCTElHlXrMVcN','NutVkebXzRLt5hsx9X46b','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "rsvps" VALUES('ueVPjd6f-BJfAS2vDgntw','POA9K_G3bPA0Yep9GL4WX','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "rsvps" VALUES('zEY9TfoLeN1VbX57YdawB','QjneSDqv143qZmclBOZp3','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "rsvps" VALUES('snos0HRbk3kHLfCbeoqJi','hwm7mZHl-FImuaEKXEc55','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "rsvps" VALUES('rFEQMCb7tyw1aUxCTRkfn','in1eYBhjmt1VvNjg9LXS6','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "rsvps" VALUES('Z7ZuwyEmYf94VM5_bNwqk','IVpdJlFl76HZM-RgM5gyK','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "rsvps" VALUES('ziEas9zZ0M-0RvAAkUtAX','8I-5-yNyIbRS5jU2y1LFw','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "rsvps" VALUES('392MF-kNCnp2g8hiBfnh4','Ih8Y9wPG8g6_zTL9twNq9','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "rsvps" VALUES('4Ljt1iuEa54Qb-JxnUAIa','Ct3lN9o2qFEuV-3UlcHqW','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('TTljgATxjcC298ErVNLo2','IVpdJlFl76HZM-RgM5gyK','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('LEabGKIqwnXcAB6XXiT11','uaqISzRkWL0F9AoDLH3VS','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('fmBTlZ8OnKFB0jsIq2rsV','QjneSDqv143qZmclBOZp3','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('LeODjUvDkJCApPW1Yx9Fp','OXyNEs_J831PJ3CbysOFx','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('TAtSXxyjpaL5woCjv9k_G','h1iEOElcXfu6ohFLxx2Eb','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('FFKFrISZZpp6J1Xf-1RZ4','Ih8Y9wPG8g6_zTL9twNq9','nq1-w7m5KRdP6EM7aGUap');
INSERT INTO "rsvps" VALUES('bNkKnmM5406i2MdiNWqs5','IVpdJlFl76HZM-RgM5gyK','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "rsvps" VALUES('5YryaEa3cbn1iIx19cYAn','bH5fF1MXNMLk_FfKTNdzK','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "rsvps" VALUES('ABuviyMw6DU0a7XnBnEiD','8I-5-yNyIbRS5jU2y1LFw','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "rsvps" VALUES('TcbEGcF665B5GPGFFsw0O','MXJB8cB3QNZXzm0ohZ8kS','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "rsvps" VALUES('7JNqz-ZH_JzlD_M537bOL','hwm7mZHl-FImuaEKXEc55','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "rsvps" VALUES('b-bklaUu4rRc9gPrVSW8Z','NutVkebXzRLt5hsx9X46b','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "rsvps" VALUES('GhNOaoxr7lCwItA-4Iay5','Ct3lN9o2qFEuV-3UlcHqW','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "rsvps" VALUES('aXOxgZTbe_B1BYP5f7AMQ','pXDgZEi8Zkx-hEtNHkEyp','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "rsvps" VALUES('a49y0TlshaKQxE_HawEpA','MXJB8cB3QNZXzm0ohZ8kS','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "rsvps" VALUES('GTC86CSnPVYpbJNQ2x1Fl','h1iEOElcXfu6ohFLxx2Eb','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "rsvps" VALUES('293h8gkauceEf8PfFREaH','Ih8Y9wPG8g6_zTL9twNq9','WmJuQ9CYHC091pooqSZFZ');
INSERT INTO "rsvps" VALUES('O81VEHgWUdFP8BTlU9YKZ','in1eYBhjmt1VvNjg9LXS6','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "rsvps" VALUES('LZ2hveWj0_snNgHdMeBOh','bH5fF1MXNMLk_FfKTNdzK','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "rsvps" VALUES('uduuXe56L6pTcw28fvJX9','QjneSDqv143qZmclBOZp3','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "rsvps" VALUES('5H901pHg73RL6Q4YzVzFT','__t5S8yaaoivxf-p9eRL-','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "rsvps" VALUES('JgWMoC-VTVsgPlPNGxpeG','NutVkebXzRLt5hsx9X46b','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "rsvps" VALUES('7SLCJ489QX1BQMvCnl56f','QjneSDqv143qZmclBOZp3','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "rsvps" VALUES('HnseIhtzRPH2AXP6hmX23','__t5S8yaaoivxf-p9eRL-','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "rsvps" VALUES('x4lMcQYKUal92AswH9Rvz','h1iEOElcXfu6ohFLxx2Eb','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "rsvps" VALUES('MSv9o3JICIXjav6PNbJOd','pXDgZEi8Zkx-hEtNHkEyp','jB_BrN3R2pe9d9dJmVD-Z');
INSERT INTO "rsvps" VALUES('4qnpt4bcqhh0skZJXvuIt','in1eYBhjmt1VvNjg9LXS6','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('fmlDo3SIDQ7VxynHM9_1h','GlnS6ieKGMKzQ5OVIEEg2','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('rV-Zgu2xZa2M4PFPIFiUI','rD0ZoLJZMAwf6tb1YwZH6','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('kKDQGmPfUjaHeKQwQlPT1','OXyNEs_J831PJ3CbysOFx','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('QVxQVUQv4FyFi7ScmmbqA','hwm7mZHl-FImuaEKXEc55','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('0Ta-S2V0vwsyx2oL2qmRv','Ih8Y9wPG8g6_zTL9twNq9','cZMLUBfa0F6S6I5EfHRYz');
INSERT INTO "rsvps" VALUES('_c6HSaIdlCw8qopO3R0zC','NutVkebXzRLt5hsx9X46b','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "rsvps" VALUES('KzwpqaSVEeVYwwSxjSoUO','Ct3lN9o2qFEuV-3UlcHqW','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "rsvps" VALUES('aIduYwNNhVwOwQvTnmdRe','MXJB8cB3QNZXzm0ohZ8kS','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "rsvps" VALUES('I52jHo9rxlufB6ZnXgpv_','pXDgZEi8Zkx-hEtNHkEyp','9FroXFwPtFCmLcWR5Or3U');
INSERT INTO "rsvps" VALUES('ZyneC2Ugt0XqS08T3O-Qw','Ct3lN9o2qFEuV-3UlcHqW','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "rsvps" VALUES('5Bq2RCknCsHX3bAVhDnnC','GlnS6ieKGMKzQ5OVIEEg2','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "rsvps" VALUES('HVI9V13oHF36vTe7TVOnA','rD0ZoLJZMAwf6tb1YwZH6','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "rsvps" VALUES('5aFX_Rajp2Q00nD4DrI-n','h1iEOElcXfu6ohFLxx2Eb','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "rsvps" VALUES('_4XqzTS5KhE7bF2qF7YAR','NutVkebXzRLt5hsx9X46b','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('fnGo5MfVkkKpwWDtDBUUw','Ct3lN9o2qFEuV-3UlcHqW','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('LUar0ZuXI9c0d1P5zYVRW','POA9K_G3bPA0Yep9GL4WX','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('DOTfwm36pgMU5tFkiCu9p','QjneSDqv143qZmclBOZp3','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('L78Jvdg4b01OPMg7XYFVS','__t5S8yaaoivxf-p9eRL-','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('bs2x1gYVsJNKi4p9N7JET','hwm7mZHl-FImuaEKXEc55','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('1htCz0LyVJy3vD2e8Uas4','pXDgZEi8Zkx-hEtNHkEyp','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "rsvps" VALUES('hdOag-msSXlnV9-2eLrms','GlnS6ieKGMKzQ5OVIEEg2','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('pEu8viDHQ1MFoU6HALrFl','POA9K_G3bPA0Yep9GL4WX','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('rp2OXs0ZINcscPMUICkJW','bH5fF1MXNMLk_FfKTNdzK','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('ABAHPAmGiUIDWNlyijLjT','QjneSDqv143qZmclBOZp3','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('GfB8ru-QJVhbNKSnr2LX9','hwm7mZHl-FImuaEKXEc55','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('8XvFkeTKAjvnd0zOkrcyd','Ih8Y9wPG8g6_zTL9twNq9','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "rsvps" VALUES('2oZlh1PswsUP8L-5D4Jws','NutVkebXzRLt5hsx9X46b','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "rsvps" VALUES('3FNnU1l8Ntbcp1p2q215n','in1eYBhjmt1VvNjg9LXS6','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "rsvps" VALUES('OC_zZ_Ykp8Vnen2uxI_HQ','GlnS6ieKGMKzQ5OVIEEg2','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "rsvps" VALUES('MK1U_Bjyd4pA0Hk7EVp14','OXyNEs_J831PJ3CbysOFx','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "rsvps" VALUES('SCSIuFpgS6q2k9dkP8ikG','pXDgZEi8Zkx-hEtNHkEyp','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "rsvps" VALUES('kf4cXUI26q8_GDE7vP4_C','GlnS6ieKGMKzQ5OVIEEg2','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('eQfTE6dfNupWoIH6MWYG5','bH5fF1MXNMLk_FfKTNdzK','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('tA3YyQ8Piw_m5fAuMDh2w','8I-5-yNyIbRS5jU2y1LFw','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('mdNHMGqggUGYrC9o1myDd','__t5S8yaaoivxf-p9eRL-','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('Pmw9foe2AOCeynIPBDXqJ','MXJB8cB3QNZXzm0ohZ8kS','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('tz5J8OIoTx0DzQ-PjHS3o','pXDgZEi8Zkx-hEtNHkEyp','G8OmLmmELGnP-WhARRWhV');
INSERT INTO "rsvps" VALUES('Q4qT46kMSBrd68--CHJ1T','NutVkebXzRLt5hsx9X46b','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('GquYR-DnZ8_6rH9vbDJmT','GlnS6ieKGMKzQ5OVIEEg2','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('P7pa5SumWBvpzR7fUdhIy','POA9K_G3bPA0Yep9GL4WX','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('KyqTc4HQn1wUBFZwri7Ob','uaqISzRkWL0F9AoDLH3VS','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('DEFLReu6xxj8MsEBf5E8L','8I-5-yNyIbRS5jU2y1LFw','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('TSg1nuP4PgHLfljFlCfHv','OXyNEs_J831PJ3CbysOFx','Dn1JfrOPKM3MN_1FblphI');
INSERT INTO "rsvps" VALUES('RIuFtOshqUON2lA8gDycy','NutVkebXzRLt5hsx9X46b','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "rsvps" VALUES('Metw4gxCE1qsredCqvJk-','Ct3lN9o2qFEuV-3UlcHqW','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "rsvps" VALUES('tnhIn5bnl3pYcgVlT96dC','GlnS6ieKGMKzQ5OVIEEg2','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "rsvps" VALUES('338E4IbgWF4FzDIMvOofI','uaqISzRkWL0F9AoDLH3VS','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "rsvps" VALUES('TJy2TKhY9P1aEVakNLwIG','MXJB8cB3QNZXzm0ohZ8kS','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "rsvps" VALUES('lgnAExgp31sO_YGYq1TNe','NutVkebXzRLt5hsx9X46b','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('_9gYTwUeyfaEaWLBlmnry','rD0ZoLJZMAwf6tb1YwZH6','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('gaPeAMisiS6vsYAWDDkAK','QjneSDqv143qZmclBOZp3','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('nk7qZZ6KDhQQvu2l-L77H','OXyNEs_J831PJ3CbysOFx','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('d26pUROrsj2dDw96TbXHn','hwm7mZHl-FImuaEKXEc55','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('ROi8FYmjl2xutapPmILIN','pXDgZEi8Zkx-hEtNHkEyp','AihenfK1lc_DtRCbGnZMz');
INSERT INTO "rsvps" VALUES('mD0ISpDsGEK8eg6nMHwgs','NutVkebXzRLt5hsx9X46b','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('nrWBkAY9pFzOjy_jd6RjM','POA9K_G3bPA0Yep9GL4WX','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('ecH21-raDippLFUKl_D3e','bH5fF1MXNMLk_FfKTNdzK','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('pV1ygTPIYORLOB3pCIuHM','rD0ZoLJZMAwf6tb1YwZH6','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('hlcKJd3oHCeBsJuebbipt','8I-5-yNyIbRS5jU2y1LFw','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('_zpiKSjeEmmv8LC8OXMRo','hwm7mZHl-FImuaEKXEc55','zsNXiSggm-32OG1Nltfh9');
INSERT INTO "rsvps" VALUES('B8Km69l0me2V72_GE59U7','NutVkebXzRLt5hsx9X46b','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "rsvps" VALUES('R9Z-2mWnppH1D4hPMaq-O','in1eYBhjmt1VvNjg9LXS6','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "rsvps" VALUES('AepoQF8GdDR-l8lXfJiGs','GlnS6ieKGMKzQ5OVIEEg2','tNgPrenwfsyWgXdmhTkJT');
INSERT INTO "rsvps" VALUES('_P2zeX19zOHggBoNACCkp','in1eYBhjmt1VvNjg9LXS6','szr8__xh9YMN2LpGWETIj');
INSERT INTO "rsvps" VALUES('O3PRD7zH7MgTakvvqInYj','bH5fF1MXNMLk_FfKTNdzK','szr8__xh9YMN2LpGWETIj');
INSERT INTO "rsvps" VALUES('ib4Yx42EWqvLmMvyWG6pK','QjneSDqv143qZmclBOZp3','szr8__xh9YMN2LpGWETIj');
INSERT INTO "rsvps" VALUES('U-xI8NpPk8G3_rz-G3PEC','__t5S8yaaoivxf-p9eRL-','szr8__xh9YMN2LpGWETIj');
INSERT INTO "rsvps" VALUES('N5_ge8U8Adlwsj_RCeUc4','MXJB8cB3QNZXzm0ohZ8kS','szr8__xh9YMN2LpGWETIj');
INSERT INTO "rsvps" VALUES('0rWcOa51q8QS9KSYK8aNr','NutVkebXzRLt5hsx9X46b','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('S9GKyXJoUMNYt3jKFwgqt','in1eYBhjmt1VvNjg9LXS6','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('ra8XzG163nqGFDO_Du1Vp','GlnS6ieKGMKzQ5OVIEEg2','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('FYvpB7poUypMfjLFS_0Py','POA9K_G3bPA0Yep9GL4WX','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('xAFlky9l-zSR-ucdkhyti','bH5fF1MXNMLk_FfKTNdzK','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('8GzwU5ZRv8dQG4rTDCMZ3','8I-5-yNyIbRS5jU2y1LFw','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('JNvQoMXpKcmF9PEUg76qp','__t5S8yaaoivxf-p9eRL-','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('Dk4gb9DLcU6GzwRhbj0F4','h1iEOElcXfu6ohFLxx2Eb','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('t6kR9NZU4EvEmUuxcViP6','Ih8Y9wPG8g6_zTL9twNq9','9JooMeSbTSmEaLKsrVarM');
INSERT INTO "rsvps" VALUES('LrK0GLaKZfQHhCu2H9czN','IVpdJlFl76HZM-RgM5gyK','K4DHbqaIN6Zb6a4ytDqH8');
INSERT INTO "rsvps" VALUES('tyIVWo2sR4ybaTsJa2dZq','pXDgZEi8Zkx-hEtNHkEyp','K4DHbqaIN6Zb6a4ytDqH8');
INSERT INTO "rsvps" VALUES('Xvl_IV7VefHChb41EDNsd','NutVkebXzRLt5hsx9X46b','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "rsvps" VALUES('hm6b-Da1OSmRyRmpUOfGN','Ct3lN9o2qFEuV-3UlcHqW','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "rsvps" VALUES('AihqyYfkUkV8yYopAEuH7','IVpdJlFl76HZM-RgM5gyK','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "rsvps" VALUES('nrd_77KHmZSj0RB6SjGVR','__t5S8yaaoivxf-p9eRL-','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "rsvps" VALUES('1aNERPpCP4PBiZ6kQMkfq','h1iEOElcXfu6ohFLxx2Eb','WxXF_iMmKJO_lrRfx13Gj');
INSERT INTO "rsvps" VALUES('PrjihzU0hvWLrzTM3cnV_','NutVkebXzRLt5hsx9X46b','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "rsvps" VALUES('823MF60CobwJnIO_AdBwH','IVpdJlFl76HZM-RgM5gyK','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "rsvps" VALUES('Tr-Bb5SOeoBTexY9_1wO_','rD0ZoLJZMAwf6tb1YwZH6','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "rsvps" VALUES('lsq2ZpoZZS96H91dpJmqV','pXDgZEi8Zkx-hEtNHkEyp','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "rsvps" VALUES('1E9TSsWSOKRp7L17YAgg6','Ct3lN9o2qFEuV-3UlcHqW','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "rsvps" VALUES('zATs_3tu_-jMckm96EDc8','uaqISzRkWL0F9AoDLH3VS','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "rsvps" VALUES('pOIMhX8KX_nqApQ5bmlbD','pXDgZEi8Zkx-hEtNHkEyp','NC-tL-XUUw3FX9uldEzIL');
INSERT INTO "rsvps" VALUES('FSEmKWc1dzdcgRDCeVEyL','NutVkebXzRLt5hsx9X46b','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "rsvps" VALUES('HhitwArz888OXY02oz8F9','POA9K_G3bPA0Yep9GL4WX','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "rsvps" VALUES('20a319VKBqrZbqjtoNpAi','NutVkebXzRLt5hsx9X46b','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "rsvps" VALUES('tjivyJMJ2x730vIy8E88d','GlnS6ieKGMKzQ5OVIEEg2','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "rsvps" VALUES('nFP-SaXNccwNhc-Uu8tBT','rD0ZoLJZMAwf6tb1YwZH6','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "rsvps" VALUES('-spMIVA0xqHYOK1eUMEUN','8I-5-yNyIbRS5jU2y1LFw','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "rsvps" VALUES('zJfumePrxrttGxzjsj5cR','OXyNEs_J831PJ3CbysOFx','pBNXg_yJ-sQ89E9eCqKrN');
INSERT INTO "rsvps" VALUES('rBxdkmlsOs1tt_MCtPOCA','NutVkebXzRLt5hsx9X46b','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('nZQL0bs9BACxKcnay_3yK','Ct3lN9o2qFEuV-3UlcHqW','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('ngpIJfboGRBs2aOoWi9Ke','POA9K_G3bPA0Yep9GL4WX','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('n55R9KxQd5h9h5W_d4cnL','8I-5-yNyIbRS5jU2y1LFw','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('jxxxMmfcH4CBryC5Soroq','OXyNEs_J831PJ3CbysOFx','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('r4PYG49SF0yLtiQ4mESs0','MXJB8cB3QNZXzm0ohZ8kS','J9p4xEZXtxzquUK9fsube');
INSERT INTO "rsvps" VALUES('tbTkdtzZ10P0-bDNjM6I9','IVpdJlFl76HZM-RgM5gyK','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "rsvps" VALUES('u_R2aTOs9ftSuGujp4Vb9','rD0ZoLJZMAwf6tb1YwZH6','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "rsvps" VALUES('Y7pehHkzhz3u3_j3ASKxH','QjneSDqv143qZmclBOZp3','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "rsvps" VALUES('wOHNFI5ar1eVEih3pOXo2','hwm7mZHl-FImuaEKXEc55','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "rsvps" VALUES('_tr9GfmlcpMz9FmR_Kh12','Ih8Y9wPG8g6_zTL9twNq9','PFXj1v5wYnR0J3WGRzfNw');
INSERT INTO "rsvps" VALUES('PwnfWm7J2h6lXJV9yqO80','NutVkebXzRLt5hsx9X46b','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "rsvps" VALUES('Hf3e73Hs6StyVkcNnqZR7','in1eYBhjmt1VvNjg9LXS6','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "rsvps" VALUES('NkMtDTNIciYRjIOnvzxbH','GlnS6ieKGMKzQ5OVIEEg2','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "rsvps" VALUES('maz19oDtyvlZCCNC-9u1e','bH5fF1MXNMLk_FfKTNdzK','W4iFiQGvwqDY93_6-w66L');
INSERT INTO "rsvps" VALUES('XMsV9161-y817ChR4Mjhk','pXDgZEi8Zkx-hEtNHkEyp','W4iFiQGvwqDY93_6-w66L');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('nnul7TLDWIVjRZ7Fq8d1M','QjSYwq0q5Wl5F6SuIzbb5');
INSERT INTO "session_hosts" VALUES('4s3FVmNNs_Q6Ya4h_7oIy','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "session_hosts" VALUES('NutVkebXzRLt5hsx9X46b','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "session_hosts" VALUES('Ct3lN9o2qFEuV-3UlcHqW','7wppeVFZl5b7RQuuEYSbt');
INSERT INTO "session_hosts" VALUES('in1eYBhjmt1VvNjg9LXS6','_PH-RjjLi9r4grie1eW3g');
INSERT INTO "session_hosts" VALUES('GlnS6ieKGMKzQ5OVIEEg2','e82w5UT6LusUDYXvbVNHN');
INSERT INTO "session_hosts" VALUES('IVpdJlFl76HZM-RgM5gyK','Ckbuc6jH9wq5YwCRbj_gd');
INSERT INTO "session_hosts" VALUES('POA9K_G3bPA0Yep9GL4WX','RU9nYsEcJzqc_ednIERw_');
INSERT INTO "session_hosts" VALUES('bH5fF1MXNMLk_FfKTNdzK','v1LWH3w7-LKJl-6gC-n6r');
INSERT INTO "session_hosts" VALUES('rD0ZoLJZMAwf6tb1YwZH6','8MHg-dZjICzw4uMa1DmJ8');
INSERT INTO "session_hosts" VALUES('uaqISzRkWL0F9AoDLH3VS','fZqYxnoseVCyKIsZHt8CO');
INSERT INTO "session_hosts" VALUES('QjneSDqv143qZmclBOZp3','HVXX4b0kZPE2S87I_d8-8');
INSERT INTO "session_hosts" VALUES('8I-5-yNyIbRS5jU2y1LFw','QFCjX9dTA-lh3ykbA1bj9');
INSERT INTO "session_hosts" VALUES('OXyNEs_J831PJ3CbysOFx','D_KKgOp9oye8dMYNu8rUE');
INSERT INTO "session_hosts" VALUES('OXyNEs_J831PJ3CbysOFx','0SRqfXklt5i26mv0cAGEN');
INSERT INTO "session_hosts" VALUES('__t5S8yaaoivxf-p9eRL-','Q6eo854u23kBy9QQk8N_m');
INSERT INTO "session_hosts" VALUES('MXJB8cB3QNZXzm0ohZ8kS','0YSe4489kcFwbDkAXLkP0');
INSERT INTO "session_hosts" VALUES('h1iEOElcXfu6ohFLxx2Eb','9g0CZRnXO7QGjOEubveKk');
INSERT INTO "session_hosts" VALUES('hwm7mZHl-FImuaEKXEc55','83A_jeq0VHVMn_8_sXYT5');
INSERT INTO "session_hosts" VALUES('pXDgZEi8Zkx-hEtNHkEyp','v5tZAbb7YSFl5PJzo21s-');
INSERT INTO "session_hosts" VALUES('Ih8Y9wPG8g6_zTL9twNq9','v1LWH3w7-LKJl-6gC-n6r');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('nnul7TLDWIVjRZ7Fq8d1M','loc-main-hall');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-main-hall');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-room-a');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-room-b');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-library');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-boardroom');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-auditorium');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-courtyard');
INSERT INTO "session_locations" VALUES('UtpuIxKkgIcqPNNe13uMU','loc-rooftop');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-main-hall');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-room-a');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-room-b');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-library');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-boardroom');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-auditorium');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-courtyard');
INSERT INTO "session_locations" VALUES('RE-xaBc2FXcYRx_YbYTrq','loc-rooftop');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-main-hall');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-room-a');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-room-b');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-library');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-boardroom');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-auditorium');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-courtyard');
INSERT INTO "session_locations" VALUES('zPL8Bea2YK1-wrSqgOEjp','loc-rooftop');
INSERT INTO "session_locations" VALUES('4s3FVmNNs_Q6Ya4h_7oIy','loc-main-hall');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-main-hall');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-room-a');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-room-b');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-library');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-boardroom');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-auditorium');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-courtyard');
INSERT INTO "session_locations" VALUES('VD5N6yF4VjSZN7RdY-Tg5','loc-rooftop');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-main-hall');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-room-a');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-room-b');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-library');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-boardroom');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-auditorium');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-courtyard');
INSERT INTO "session_locations" VALUES('J-OJpQwkW7l_0GtSrjK6U','loc-rooftop');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-main-hall');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-room-a');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-room-b');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-library');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-boardroom');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-auditorium');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-courtyard');
INSERT INTO "session_locations" VALUES('qAiNyb60QqqfQNaiDtwe2','loc-rooftop');
INSERT INTO "session_locations" VALUES('NutVkebXzRLt5hsx9X46b','loc-main-hall');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-main-hall');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-room-a');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-room-b');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-library');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-boardroom');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-auditorium');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-courtyard');
INSERT INTO "session_locations" VALUES('PS9FLOWMLcuxTTDxOE7Lw','loc-rooftop');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-main-hall');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-room-a');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-room-b');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-library');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-boardroom');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-auditorium');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-courtyard');
INSERT INTO "session_locations" VALUES('-CsK3j7Ahb4LbnPshFOfC','loc-rooftop');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-main-hall');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-room-a');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-room-b');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-library');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-boardroom');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-auditorium');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-courtyard');
INSERT INTO "session_locations" VALUES('AGazrn_Lz_BnT3QVYLMUl','loc-rooftop');
INSERT INTO "session_locations" VALUES('Ct3lN9o2qFEuV-3UlcHqW','loc-main-hall');
INSERT INTO "session_locations" VALUES('in1eYBhjmt1VvNjg9LXS6','loc-room-a');
INSERT INTO "session_locations" VALUES('GlnS6ieKGMKzQ5OVIEEg2','loc-main-hall');
INSERT INTO "session_locations" VALUES('IVpdJlFl76HZM-RgM5gyK','loc-room-b');
INSERT INTO "session_locations" VALUES('POA9K_G3bPA0Yep9GL4WX','loc-room-a');
INSERT INTO "session_locations" VALUES('bH5fF1MXNMLk_FfKTNdzK','loc-main-hall');
INSERT INTO "session_locations" VALUES('rD0ZoLJZMAwf6tb1YwZH6','loc-room-b');
INSERT INTO "session_locations" VALUES('uaqISzRkWL0F9AoDLH3VS','loc-room-a');
INSERT INTO "session_locations" VALUES('QjneSDqv143qZmclBOZp3','loc-main-hall');
INSERT INTO "session_locations" VALUES('8I-5-yNyIbRS5jU2y1LFw','loc-room-b');
INSERT INTO "session_locations" VALUES('OXyNEs_J831PJ3CbysOFx','loc-main-hall');
INSERT INTO "session_locations" VALUES('__t5S8yaaoivxf-p9eRL-','loc-room-b');
INSERT INTO "session_locations" VALUES('MXJB8cB3QNZXzm0ohZ8kS','loc-main-hall');
INSERT INTO "session_locations" VALUES('h1iEOElcXfu6ohFLxx2Eb','loc-room-a');
INSERT INTO "session_locations" VALUES('hwm7mZHl-FImuaEKXEc55','loc-room-b');
INSERT INTO "session_locations" VALUES('pXDgZEi8Zkx-hEtNHkEyp','loc-main-hall');
INSERT INTO "session_locations" VALUES('Ih8Y9wPG8g6_zTL9twNq9','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('uKkN7nF36cChUf4h3SAfV','3JBdGjXrB1T9H4gI-JYno','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-08-30T09:25:30.341Z');
INSERT INTO "session_proposals" VALUES('eoEi79pQ58ZWjpcPY8Kx4','3JBdGjXrB1T9H4gI-JYno','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-08-30T09:25:30.341Z');
INSERT INTO "session_proposals" VALUES('Es5LmtcfmlDqv318zWYQb','3JBdGjXrB1T9H4gI-JYno','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('6JYvzosE4dBD43v-dLkaw','3JBdGjXrB1T9H4gI-JYno','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('QgEImm_yXX32n4tiJ_DOK','3JBdGjXrB1T9H4gI-JYno','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('QjEHrYmV8K7jXdwd6ZDwQ','3JBdGjXrB1T9H4gI-JYno','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('EqVbTyYNSFCr32DLq7cY-','3JBdGjXrB1T9H4gI-JYno','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('W3PWAva29sxJXUDgc7fSI','3JBdGjXrB1T9H4gI-JYno','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('IuiI0Fq37gvR3Hrd_OKrt','3JBdGjXrB1T9H4gI-JYno','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('02qM4mTRR-wdrXIf4hvlY','3JBdGjXrB1T9H4gI-JYno','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('oByP1Pwi_jqe-TLQHRBBm','3JBdGjXrB1T9H4gI-JYno','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('NxVBA84y5Vu0ekOdY0RB5','4XWaXczC8a1QUvqs1AKd7','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:30.342Z');
INSERT INTO "session_proposals" VALUES('ltjNzmJ4dhwhl1LP42vVu','4XWaXczC8a1QUvqs1AKd7','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('CgpQDcDFLOupqYvpPLXbt','4XWaXczC8a1QUvqs1AKd7','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('YaSbCK1umgVe7drTjOrK2','4XWaXczC8a1QUvqs1AKd7','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('kxphdJ2BxA05lMLa4kKOX','4XWaXczC8a1QUvqs1AKd7','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('rdU8Jm1oec1_dnNAgbowj','4XWaXczC8a1QUvqs1AKd7','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('j24Rk9cefwEyxKgVFVj7r','4XWaXczC8a1QUvqs1AKd7','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('BdG9XohDwXo_pCFYiGcjC','4XWaXczC8a1QUvqs1AKd7','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('6XVQh9-v29HSuPdYKXrpL','4XWaXczC8a1QUvqs1AKd7','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('_5UcfhakvLSsj3zaafax5','4XWaXczC8a1QUvqs1AKd7','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('8JzKrswYwD_GkmvZFXbjG','4XWaXczC8a1QUvqs1AKd7','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('5_NY-3opQ-QzljJlKpUae','4XWaXczC8a1QUvqs1AKd7','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('VYQpZLD0KsUIeoZM0Trf2','4XWaXczC8a1QUvqs1AKd7','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('4W2Y467pxZDCbDYB5akWV','CHvVvgFcGB3sglCOcForn','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('j1caYlMIZ_35jKZxfy9Z_','CHvVvgFcGB3sglCOcForn','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('apy4H5nkDRao_kihnmMQ2','CHvVvgFcGB3sglCOcForn','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('_sfDFAgSBjNWIheuO7ZUa','CHvVvgFcGB3sglCOcForn','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('6SSVlh6hmMl1gDCA5ByEu','CHvVvgFcGB3sglCOcForn','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('8XrT2WvYSlN2PTBb8sYCi','CHvVvgFcGB3sglCOcForn','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('kPA9ReCYTzqVA30iy_ukb','CHvVvgFcGB3sglCOcForn','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('PnKSnU0YmB2ki07qfIPD8','CHvVvgFcGB3sglCOcForn','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('S5GTVBmSZd551jTwDwPmW','CHvVvgFcGB3sglCOcForn','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('OoMfwjFaJeu2uCXGoahVm','CHvVvgFcGB3sglCOcForn','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('F3zGeyUV6kZtglwIwyx2D','CHvVvgFcGB3sglCOcForn','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('VClgJ7Z1EQ470p0exGiXI','CHvVvgFcGB3sglCOcForn','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('zqBRJPWIPPHHxviN0l12p','CHvVvgFcGB3sglCOcForn','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('bX4EIi6blbPnA0cWa7Xlg','CHvVvgFcGB3sglCOcForn','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('xIRenXNxw_VgkpNxi0Pz1','CHvVvgFcGB3sglCOcForn','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('UaO7U8UuiXftocloVxkMW','CHvVvgFcGB3sglCOcForn','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('jaogdcQ99_I2gwQyssP40','CHvVvgFcGB3sglCOcForn','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('btzW4kYdULn5zYL4kVHrB','CHvVvgFcGB3sglCOcForn','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('gEEzQKfwB0F1VqX8XdsVc','CHvVvgFcGB3sglCOcForn','Writing Documentation People Actually Read','Most documentation is written once, in a hurry, by whoever shipped the feature. This session is about the opposite: treating docs as a product with readers, a first minute that has to land, and a maintenance cost you plan for.

We''ll look at real examples — a few good, several painfully bad — and pull out what separates them: task-shaped titles, examples before explanations, and the courage to delete a page.

Bring a page you''re unhappy with and we''ll rework it together.',60,'2026-08-30T09:25:30.343Z');
INSERT INTO "session_proposals" VALUES('CG923Mfo1qJerOc8lfVvk','CHvVvgFcGB3sglCOcForn','Your First Conference Talk: From Idea to Stage','You have something worth saying and no idea how to turn it into 30 minutes on a stage. Let''s fix that.

We''ll cover finding a topic that''s genuinely yours, writing an abstract that survives a review committee, building slides that support you instead of competing with you, and what to do when your demo dies in front of 200 people (it will, eventually).

Aimed at people who have *never* spoken before. No slides of my own — we work on yours.',90,'2026-08-30T09:25:30.344Z');
INSERT INTO "session_proposals" VALUES('FfQbC272xq3c_OMG11pJt','CHvVvgFcGB3sglCOcForn','Ask Me Anything: Migrating a Legacy Monolith','**Looking for someone to host this!**

Several of us are staring down the same problem: a monolith that works, pays the bills, and is slowly becoming impossible to change. We''d love to hear from somebody who has actually come out the other side of a migration — what you''d do again, and what you''d never repeat.

If you''ve lived through one, please add yourself as host. An honest hour of war stories beats a polished talk.',60,'2026-08-30T09:25:30.344Z');
INSERT INTO "session_proposals" VALUES('qnHohhacgiwgk8Fi8ZUVE','CHvVvgFcGB3sglCOcForn','Board Games for People Who Are Tired of Talking','By day three, everyone''s social battery is empty. This is a quiet room with a table, a stack of games, and no agenda.

Nobody has volunteered to bring the games yet — if you''re travelling with something short and easy to teach, add yourself as host and we''ll make it happen.',120,'2026-08-30T09:25:30.344Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('cVEOYHrch7KG5m96FjoRr','NxVBA84y5Vu0ekOdY0RB5','QjSYwq0q5Wl5F6SuIzbb5','maybe');
INSERT INTO "votes" VALUES('Bx1DdGLjfIj4fl14sAe3P','YaSbCK1umgVe7drTjOrK2','QjSYwq0q5Wl5F6SuIzbb5','interested');
INSERT INTO "votes" VALUES('30Jj81JXvAKyI-12yUnKM','rdU8Jm1oec1_dnNAgbowj','QjSYwq0q5Wl5F6SuIzbb5','maybe');
INSERT INTO "votes" VALUES('HxuVYoJpSpSL-wjdSp9O2','j24Rk9cefwEyxKgVFVj7r','QjSYwq0q5Wl5F6SuIzbb5','maybe');
INSERT INTO "votes" VALUES('3ZjHU9_fR16XaNlEPlGDZ','6XVQh9-v29HSuPdYKXrpL','QjSYwq0q5Wl5F6SuIzbb5','interested');
INSERT INTO "votes" VALUES('ALffOnIPBdM903dMPLlkv','_5UcfhakvLSsj3zaafax5','QjSYwq0q5Wl5F6SuIzbb5','skip');
INSERT INTO "votes" VALUES('M7d3T6jgCwR1FAg-uXmCE','ltjNzmJ4dhwhl1LP42vVu','D_KKgOp9oye8dMYNu8rUE','maybe');
INSERT INTO "votes" VALUES('wVU8riZq53IiDrTHpfEMd','YaSbCK1umgVe7drTjOrK2','D_KKgOp9oye8dMYNu8rUE','interested');
INSERT INTO "votes" VALUES('syqKF_7EIYsT-lf2bqqJF','kxphdJ2BxA05lMLa4kKOX','D_KKgOp9oye8dMYNu8rUE','skip');
INSERT INTO "votes" VALUES('E4-qE89Zt4Wd9T3brcv-z','6XVQh9-v29HSuPdYKXrpL','D_KKgOp9oye8dMYNu8rUE','maybe');
INSERT INTO "votes" VALUES('CmcEKVkxj_A4SA4eEddd_','kxphdJ2BxA05lMLa4kKOX','v1LWH3w7-LKJl-6gC-n6r','maybe');
INSERT INTO "votes" VALUES('UcPscgTdnIeKyejzR23xW','rdU8Jm1oec1_dnNAgbowj','v1LWH3w7-LKJl-6gC-n6r','maybe');
INSERT INTO "votes" VALUES('q5E0vtelvJ_QGkOK-08xP','CgpQDcDFLOupqYvpPLXbt','7wppeVFZl5b7RQuuEYSbt','maybe');
INSERT INTO "votes" VALUES('HJ8_9NA6jsUDvMAlH79PB','YaSbCK1umgVe7drTjOrK2','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('lNsb-JiswIwe0SlfQer3g','j24Rk9cefwEyxKgVFVj7r','7wppeVFZl5b7RQuuEYSbt','maybe');
INSERT INTO "votes" VALUES('oKDNAo_fsfMO_svnB32HI','BdG9XohDwXo_pCFYiGcjC','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('sZFFSgfWjUmzxklM8GlxF','6XVQh9-v29HSuPdYKXrpL','7wppeVFZl5b7RQuuEYSbt','skip');
INSERT INTO "votes" VALUES('U5atwFHfB9yg4IuTFO9Np','ltjNzmJ4dhwhl1LP42vVu','6eHa7YiDL-FaJJSm0Ez7n','skip');
INSERT INTO "votes" VALUES('-S8aZe0h8fL5L-ciTJ3Z6','rdU8Jm1oec1_dnNAgbowj','6eHa7YiDL-FaJJSm0Ez7n','interested');
INSERT INTO "votes" VALUES('RHpy1IEcvRw5bftMQvSLI','NxVBA84y5Vu0ekOdY0RB5','_PH-RjjLi9r4grie1eW3g','maybe');
INSERT INTO "votes" VALUES('60LvS5h2z-Dnq4rc-uq0g','j24Rk9cefwEyxKgVFVj7r','_PH-RjjLi9r4grie1eW3g','maybe');
INSERT INTO "votes" VALUES('Bw7d7h8FnQL6p-QPOpnfM','6XVQh9-v29HSuPdYKXrpL','_PH-RjjLi9r4grie1eW3g','skip');
INSERT INTO "votes" VALUES('wrjvMusUTZqX8EWq0shJ9','NxVBA84y5Vu0ekOdY0RB5','3Pu8go-_UUJtIVkmUGi-3','skip');
INSERT INTO "votes" VALUES('5rn7_hsBzFOmzehLgXS6z','ltjNzmJ4dhwhl1LP42vVu','3Pu8go-_UUJtIVkmUGi-3','skip');
INSERT INTO "votes" VALUES('uSkQQ2ciH9hpgKGJr6S2_','CgpQDcDFLOupqYvpPLXbt','3Pu8go-_UUJtIVkmUGi-3','skip');
INSERT INTO "votes" VALUES('QCsF5FEaBM-rKstWitzh5','YaSbCK1umgVe7drTjOrK2','3Pu8go-_UUJtIVkmUGi-3','maybe');
INSERT INTO "votes" VALUES('KzfUX8JYOG2GbvyOPoSOJ','j24Rk9cefwEyxKgVFVj7r','3Pu8go-_UUJtIVkmUGi-3','maybe');
INSERT INTO "votes" VALUES('NHw0mkY5rJ8fap_tf3HdQ','BdG9XohDwXo_pCFYiGcjC','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('Bxtv1R4XuS_ZrKkszjTEb','6XVQh9-v29HSuPdYKXrpL','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('ent7U6_oBufFrZkUCq9az','_5UcfhakvLSsj3zaafax5','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('o5qLjORPsMw7RWIP7JXho','NxVBA84y5Vu0ekOdY0RB5','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('EDqWGPzObgJ_-MJRibm4d','ltjNzmJ4dhwhl1LP42vVu','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('_Dy5hDQYGeoCF1iiAx_XI','BdG9XohDwXo_pCFYiGcjC','HVXX4b0kZPE2S87I_d8-8','maybe');
INSERT INTO "votes" VALUES('D1KCV-QGEjRACosrXxXny','_5UcfhakvLSsj3zaafax5','HVXX4b0kZPE2S87I_d8-8','skip');
INSERT INTO "votes" VALUES('dnxOwRMRJK1osdPL_tjx-','CgpQDcDFLOupqYvpPLXbt','bcmhGiTYaUrkuiHoDhOlY','skip');
INSERT INTO "votes" VALUES('nmj1NTO9wd72ZdArAvUSQ','rdU8Jm1oec1_dnNAgbowj','bcmhGiTYaUrkuiHoDhOlY','maybe');
INSERT INTO "votes" VALUES('hqJpXHiVHnAfDWOSM5WIz','_5UcfhakvLSsj3zaafax5','bcmhGiTYaUrkuiHoDhOlY','maybe');
INSERT INTO "votes" VALUES('W8sOL4CHO-jiztACq2XFG','ltjNzmJ4dhwhl1LP42vVu','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('Ob31eoQnPLfFDQ10YPlb0','CgpQDcDFLOupqYvpPLXbt','v5tZAbb7YSFl5PJzo21s-','interested');
INSERT INTO "votes" VALUES('OtfpnxlB_Jjsd8FBmMC7k','YaSbCK1umgVe7drTjOrK2','v5tZAbb7YSFl5PJzo21s-','interested');
INSERT INTO "votes" VALUES('VdtoKJ6Pt7SOSozkLY2Ez','kxphdJ2BxA05lMLa4kKOX','v5tZAbb7YSFl5PJzo21s-','skip');
INSERT INTO "votes" VALUES('9LF-E054CrKIqrWQMi34v','_5UcfhakvLSsj3zaafax5','v5tZAbb7YSFl5PJzo21s-','skip');
INSERT INTO "votes" VALUES('DkHBIQWN3iFc5ctIPycD5','BdG9XohDwXo_pCFYiGcjC','9g0CZRnXO7QGjOEubveKk','maybe');
INSERT INTO "votes" VALUES('uWt_ZDXJ8LY7_WsmLznc8','6XVQh9-v29HSuPdYKXrpL','9g0CZRnXO7QGjOEubveKk','maybe');
INSERT INTO "votes" VALUES('H_jF5AXdWmRfbbKiWPG6s','_5UcfhakvLSsj3zaafax5','9g0CZRnXO7QGjOEubveKk','interested');
INSERT INTO "votes" VALUES('OTpLOn0F6_47FvyyTpcLv','NxVBA84y5Vu0ekOdY0RB5','nq1-w7m5KRdP6EM7aGUap','skip');
INSERT INTO "votes" VALUES('Z7fxhfo-SVplArhmkNEGF','ltjNzmJ4dhwhl1LP42vVu','nq1-w7m5KRdP6EM7aGUap','skip');
INSERT INTO "votes" VALUES('qFO8NnQ2ywHLWlou2HbBl','YaSbCK1umgVe7drTjOrK2','nq1-w7m5KRdP6EM7aGUap','skip');
INSERT INTO "votes" VALUES('_Lu5XzEkBiGLCQ4T37udm','kxphdJ2BxA05lMLa4kKOX','nq1-w7m5KRdP6EM7aGUap','interested');
INSERT INTO "votes" VALUES('nT9jjeKBYKDRoKeAh3wtW','rdU8Jm1oec1_dnNAgbowj','nq1-w7m5KRdP6EM7aGUap','maybe');
INSERT INTO "votes" VALUES('28KEqTPcw9jw0WXjnI0jF','j24Rk9cefwEyxKgVFVj7r','nq1-w7m5KRdP6EM7aGUap','interested');
INSERT INTO "votes" VALUES('eArQNAzIO50t9jKFBqaZu','CgpQDcDFLOupqYvpPLXbt','8MHg-dZjICzw4uMa1DmJ8','maybe');
INSERT INTO "votes" VALUES('39JKuT1KPdpsNKumg6Dn0','YaSbCK1umgVe7drTjOrK2','8MHg-dZjICzw4uMa1DmJ8','skip');
INSERT INTO "votes" VALUES('h0h-1CdTANMJvdiGRiqAt','kxphdJ2BxA05lMLa4kKOX','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('CVVeAEftt1XUHTSGiyZ9G','rdU8Jm1oec1_dnNAgbowj','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('EYvf0we--K4DgyjSFw3KV','6XVQh9-v29HSuPdYKXrpL','83A_jeq0VHVMn_8_sXYT5','interested');
INSERT INTO "votes" VALUES('ReiglFe1c2UTk3RVyujdp','ltjNzmJ4dhwhl1LP42vVu','WmJuQ9CYHC091pooqSZFZ','maybe');
INSERT INTO "votes" VALUES('Pm4_gGGp7JW8UxMnHQuls','YaSbCK1umgVe7drTjOrK2','WmJuQ9CYHC091pooqSZFZ','interested');
INSERT INTO "votes" VALUES('3OIZk_OHC_OZsMaqPxorn','rdU8Jm1oec1_dnNAgbowj','WmJuQ9CYHC091pooqSZFZ','maybe');
INSERT INTO "votes" VALUES('0xm9oKpHygrgmwqd13X-0','j24Rk9cefwEyxKgVFVj7r','WmJuQ9CYHC091pooqSZFZ','interested');
INSERT INTO "votes" VALUES('T_MIpxqMECoeATWjVTD0A','6XVQh9-v29HSuPdYKXrpL','WmJuQ9CYHC091pooqSZFZ','maybe');
INSERT INTO "votes" VALUES('Fq7Sy1kv-i9PmNJaHBShQ','_5UcfhakvLSsj3zaafax5','WmJuQ9CYHC091pooqSZFZ','interested');
INSERT INTO "votes" VALUES('o2LFF6f6XpD7U3aLG5aau','CgpQDcDFLOupqYvpPLXbt','fZqYxnoseVCyKIsZHt8CO','skip');
INSERT INTO "votes" VALUES('OEoXXmtIXbcqvtza8rVPn','YaSbCK1umgVe7drTjOrK2','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('VJ4SXABDf8Djgt7733xAF','rdU8Jm1oec1_dnNAgbowj','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('E_V5aEzp-n6sSeFj2UKH_','j24Rk9cefwEyxKgVFVj7r','fZqYxnoseVCyKIsZHt8CO','maybe');
INSERT INTO "votes" VALUES('nqgpqpeYI4r_No_Vu-j-Z','BdG9XohDwXo_pCFYiGcjC','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('uEZxkbKVDbSD5A2HUc2uB','6XVQh9-v29HSuPdYKXrpL','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('-sBl-PFBua0tiLv-7YuWl','ltjNzmJ4dhwhl1LP42vVu','jB_BrN3R2pe9d9dJmVD-Z','skip');
INSERT INTO "votes" VALUES('DwC5o00N17jSky_s2a_oS','CgpQDcDFLOupqYvpPLXbt','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('rsTkUydwcMxrY-n2KchI_','YaSbCK1umgVe7drTjOrK2','jB_BrN3R2pe9d9dJmVD-Z','skip');
INSERT INTO "votes" VALUES('SlMQ0JGry5fLj6SD9n7n_','j24Rk9cefwEyxKgVFVj7r','jB_BrN3R2pe9d9dJmVD-Z','maybe');
INSERT INTO "votes" VALUES('JOvAu9ZIW8ELisv0yfiWK','6XVQh9-v29HSuPdYKXrpL','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('EmkwWAYwhSUJR27HvR8zr','_5UcfhakvLSsj3zaafax5','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('K1B7YWTdilz_a-S12QCUR','NxVBA84y5Vu0ekOdY0RB5','cZMLUBfa0F6S6I5EfHRYz','interested');
INSERT INTO "votes" VALUES('N4cqsK0MIVEuEFgHEhf-7','ltjNzmJ4dhwhl1LP42vVu','cZMLUBfa0F6S6I5EfHRYz','interested');
INSERT INTO "votes" VALUES('TAEQv0uOLT8KLGBXQJLVi','BdG9XohDwXo_pCFYiGcjC','cZMLUBfa0F6S6I5EfHRYz','maybe');
INSERT INTO "votes" VALUES('wXhKa9ns0LfELX1aDV8GY','6XVQh9-v29HSuPdYKXrpL','cZMLUBfa0F6S6I5EfHRYz','maybe');
INSERT INTO "votes" VALUES('3iSq_U9hjWg7mFTl4RjNE','NxVBA84y5Vu0ekOdY0RB5','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('uihUBeUB-1TnZWho4PB42','ltjNzmJ4dhwhl1LP42vVu','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('6m1VNidua8GHzFqr7k4GF','CgpQDcDFLOupqYvpPLXbt','9FroXFwPtFCmLcWR5Or3U','skip');
INSERT INTO "votes" VALUES('lQBPfeRvQ6vYx91G5AzXM','rdU8Jm1oec1_dnNAgbowj','9FroXFwPtFCmLcWR5Or3U','maybe');
INSERT INTO "votes" VALUES('bRvs47MlLy4FKpd9R0syK','6XVQh9-v29HSuPdYKXrpL','9FroXFwPtFCmLcWR5Or3U','skip');
INSERT INTO "votes" VALUES('SfNRGbhIszgQGNpan4u8c','_5UcfhakvLSsj3zaafax5','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('MPBSUKJjdIAEJnfPabl-6','NxVBA84y5Vu0ekOdY0RB5','0YSe4489kcFwbDkAXLkP0','maybe');
INSERT INTO "votes" VALUES('J1g7Ft4bwJvtcYQF8_wJ4','rdU8Jm1oec1_dnNAgbowj','0YSe4489kcFwbDkAXLkP0','maybe');
INSERT INTO "votes" VALUES('s5Zf70FpOD6zVrh8FxTLs','j24Rk9cefwEyxKgVFVj7r','0YSe4489kcFwbDkAXLkP0','interested');
INSERT INTO "votes" VALUES('OsVPAlv0wPtnWArftg9-E','BdG9XohDwXo_pCFYiGcjC','0YSe4489kcFwbDkAXLkP0','interested');
INSERT INTO "votes" VALUES('jqem7CABE_R0q34B3Xq8r','_5UcfhakvLSsj3zaafax5','0YSe4489kcFwbDkAXLkP0','interested');
INSERT INTO "votes" VALUES('tfI-JMnV5Mb1pH66CLS2C','YaSbCK1umgVe7drTjOrK2','e82w5UT6LusUDYXvbVNHN','skip');
INSERT INTO "votes" VALUES('_RaOMBoA9FtyBXEa-v_96','kxphdJ2BxA05lMLa4kKOX','e82w5UT6LusUDYXvbVNHN','interested');
INSERT INTO "votes" VALUES('YYlV9XNIL4xyhi8EkxG1B','j24Rk9cefwEyxKgVFVj7r','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('uuFJKNsS7krBd1Jga_bsp','BdG9XohDwXo_pCFYiGcjC','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('M6NnpMXWsBJqPNbLz8prS','NxVBA84y5Vu0ekOdY0RB5','Q6eo854u23kBy9QQk8N_m','maybe');
INSERT INTO "votes" VALUES('fRDAdKaz6XyEI8XmhFSsK','j24Rk9cefwEyxKgVFVj7r','Q6eo854u23kBy9QQk8N_m','interested');
INSERT INTO "votes" VALUES('64YSdcqzhUNmpJZU0hhvE','6XVQh9-v29HSuPdYKXrpL','Q6eo854u23kBy9QQk8N_m','interested');
INSERT INTO "votes" VALUES('zJ5VXuqMLx0SZsMTcUBy1','_5UcfhakvLSsj3zaafax5','Q6eo854u23kBy9QQk8N_m','skip');
INSERT INTO "votes" VALUES('vhnUfAJ2u4MNO0QN9fyzX','NxVBA84y5Vu0ekOdY0RB5','QFCjX9dTA-lh3ykbA1bj9','interested');
INSERT INTO "votes" VALUES('Nb5bwYmVbm5oogWaeCo4w','CgpQDcDFLOupqYvpPLXbt','QFCjX9dTA-lh3ykbA1bj9','maybe');
INSERT INTO "votes" VALUES('xecJombZmtnt4zfKVur3p','rdU8Jm1oec1_dnNAgbowj','QFCjX9dTA-lh3ykbA1bj9','interested');
INSERT INTO "votes" VALUES('aVuNp928NcB1Nile-LFj1','_5UcfhakvLSsj3zaafax5','QFCjX9dTA-lh3ykbA1bj9','skip');
INSERT INTO "votes" VALUES('DX4MdPugHhezXhqpLFCrb','rdU8Jm1oec1_dnNAgbowj','G8OmLmmELGnP-WhARRWhV','skip');
INSERT INTO "votes" VALUES('wH6PTirAvUbD_s4xqtCMo','6XVQh9-v29HSuPdYKXrpL','G8OmLmmELGnP-WhARRWhV','interested');
INSERT INTO "votes" VALUES('fVRp2Tmw5HD9R-vc6PexV','_5UcfhakvLSsj3zaafax5','G8OmLmmELGnP-WhARRWhV','maybe');
INSERT INTO "votes" VALUES('bwOgqQb2oqn7DU39LuJG_','NxVBA84y5Vu0ekOdY0RB5','Dn1JfrOPKM3MN_1FblphI','maybe');
INSERT INTO "votes" VALUES('3AdHq2MvI-1JAwuPhWoc8','ltjNzmJ4dhwhl1LP42vVu','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('DFChtBp1BrCnsTetPGqxv','rdU8Jm1oec1_dnNAgbowj','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('j9XktKPWWqTNvxxuU5zki','j24Rk9cefwEyxKgVFVj7r','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('M2x50w051AkwlB4YZBH9U','BdG9XohDwXo_pCFYiGcjC','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('q0qLrUZsbdfCAx5U4VRP1','6XVQh9-v29HSuPdYKXrpL','Dn1JfrOPKM3MN_1FblphI','maybe');
INSERT INTO "votes" VALUES('Ul9ZYNmj6gwFM7yD7SzSw','NxVBA84y5Vu0ekOdY0RB5','RU9nYsEcJzqc_ednIERw_','maybe');
INSERT INTO "votes" VALUES('1BEORzngwnhsNKsjZu_m-','CgpQDcDFLOupqYvpPLXbt','RU9nYsEcJzqc_ednIERw_','skip');
INSERT INTO "votes" VALUES('L5J6X9ohMwsScIP13AVbS','_5UcfhakvLSsj3zaafax5','RU9nYsEcJzqc_ednIERw_','maybe');
INSERT INTO "votes" VALUES('HJqQYQ7rWIBhhdsXPMDhH','ltjNzmJ4dhwhl1LP42vVu','AihenfK1lc_DtRCbGnZMz','maybe');
INSERT INTO "votes" VALUES('yMBVsqFBcJhAdfVXxnP4p','rdU8Jm1oec1_dnNAgbowj','AihenfK1lc_DtRCbGnZMz','interested');
INSERT INTO "votes" VALUES('wQPDSyQj_oqU3Wc1sWvEx','BdG9XohDwXo_pCFYiGcjC','AihenfK1lc_DtRCbGnZMz','skip');
INSERT INTO "votes" VALUES('Fhrw53SxJeHmcGCEvhHWq','NxVBA84y5Vu0ekOdY0RB5','zsNXiSggm-32OG1Nltfh9','interested');
INSERT INTO "votes" VALUES('K3dfwpc9SAK5kZKEFfNqG','YaSbCK1umgVe7drTjOrK2','zsNXiSggm-32OG1Nltfh9','skip');
INSERT INTO "votes" VALUES('8rvhei_sJAuDZzHd-ysqV','j24Rk9cefwEyxKgVFVj7r','zsNXiSggm-32OG1Nltfh9','interested');
INSERT INTO "votes" VALUES('IhMfEF3LSAN3h3rfSsefe','NxVBA84y5Vu0ekOdY0RB5','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('gxnNztoyKmGASRcHhGNgH','CgpQDcDFLOupqYvpPLXbt','tNgPrenwfsyWgXdmhTkJT','interested');
INSERT INTO "votes" VALUES('8ZFmxvKi1tJNVqbkGWU0X','BdG9XohDwXo_pCFYiGcjC','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('fiR8G16yNSJArHbvZxb-8','6XVQh9-v29HSuPdYKXrpL','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('OjXaUiCFMgaxWN9XJIH_X','_5UcfhakvLSsj3zaafax5','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('Pn1p-qqWXwQtRRzVNx5dL','NxVBA84y5Vu0ekOdY0RB5','szr8__xh9YMN2LpGWETIj','maybe');
INSERT INTO "votes" VALUES('i8GlbTgtpu5TDxk1u3083','CgpQDcDFLOupqYvpPLXbt','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('KnDrv3xx9T2-NPjIIHl5r','j24Rk9cefwEyxKgVFVj7r','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('PFPBLZ3cZ6ywDKgikqw-m','NxVBA84y5Vu0ekOdY0RB5','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('5ReK5kp_skGuLXdfxdJ3-','CgpQDcDFLOupqYvpPLXbt','9JooMeSbTSmEaLKsrVarM','maybe');
INSERT INTO "votes" VALUES('b4kWQEuQ8oW-354fLMrhA','YaSbCK1umgVe7drTjOrK2','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('twzwxB_ZXks9a0qlGL2sX','rdU8Jm1oec1_dnNAgbowj','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('_8BhzBkg4pfcgZzRld2TX','NxVBA84y5Vu0ekOdY0RB5','K4DHbqaIN6Zb6a4ytDqH8','interested');
INSERT INTO "votes" VALUES('Yn6VZ21zW14NoOQ6dBYPA','j24Rk9cefwEyxKgVFVj7r','K4DHbqaIN6Zb6a4ytDqH8','maybe');
INSERT INTO "votes" VALUES('cXCyy7Kqhli3zk2YY7b_K','_5UcfhakvLSsj3zaafax5','K4DHbqaIN6Zb6a4ytDqH8','maybe');
INSERT INTO "votes" VALUES('OscevasoR2QVbb8EG7Ry6','NxVBA84y5Vu0ekOdY0RB5','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('0gLqWVvQZKN7f-CX6XSx8','ltjNzmJ4dhwhl1LP42vVu','WxXF_iMmKJO_lrRfx13Gj','skip');
INSERT INTO "votes" VALUES('1CORJGv9BB_VKG5tSgMQE','kxphdJ2BxA05lMLa4kKOX','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('qkvJ1xAS_yBCQ2qHQI_zN','rdU8Jm1oec1_dnNAgbowj','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('25tSlbrU45QJPSQD004cr','BdG9XohDwXo_pCFYiGcjC','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('YBsj1gJSvHcZfVmWKZQdr','6XVQh9-v29HSuPdYKXrpL','WxXF_iMmKJO_lrRfx13Gj','maybe');
INSERT INTO "votes" VALUES('2DUa14qVDYXlEPByxBR0X','kxphdJ2BxA05lMLa4kKOX','0SRqfXklt5i26mv0cAGEN','interested');
INSERT INTO "votes" VALUES('HeUPBiSmfu4hCmgdzy0VX','NxVBA84y5Vu0ekOdY0RB5','NC-tL-XUUw3FX9uldEzIL','skip');
INSERT INTO "votes" VALUES('G3Wv_CzJdhUSD3Q1OcYs0','ltjNzmJ4dhwhl1LP42vVu','NC-tL-XUUw3FX9uldEzIL','interested');
INSERT INTO "votes" VALUES('5_nw0oSU8OKWHUiJvpfLc','BdG9XohDwXo_pCFYiGcjC','NC-tL-XUUw3FX9uldEzIL','skip');
INSERT INTO "votes" VALUES('qfjxnN77vEWG5aVwfn9vn','6XVQh9-v29HSuPdYKXrpL','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('NO0IJgAVjhD3LDCIxtnJe','rdU8Jm1oec1_dnNAgbowj','Ckbuc6jH9wq5YwCRbj_gd','interested');
INSERT INTO "votes" VALUES('pKOn0AnS64yAAIjXutkgS','BdG9XohDwXo_pCFYiGcjC','Ckbuc6jH9wq5YwCRbj_gd','interested');
INSERT INTO "votes" VALUES('v7a6yB1KiNHjXUjyXIxDc','NxVBA84y5Vu0ekOdY0RB5','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('GykUFTno0itsKq2Ghcmiu','YaSbCK1umgVe7drTjOrK2','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('k_o1Z4zdK_SswWcf4vPIK','kxphdJ2BxA05lMLa4kKOX','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('MHqgy5Gf6SWAzTzaiAAfy','rdU8Jm1oec1_dnNAgbowj','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('4WaOmQVmKPfigYExReYTZ','BdG9XohDwXo_pCFYiGcjC','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('7agi4IauO6wQsmgueu8SL','6XVQh9-v29HSuPdYKXrpL','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('TPn3-rOioosI621FXunP5','YaSbCK1umgVe7drTjOrK2','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('0SCRQvdaJmaXltg-yxCPa','j24Rk9cefwEyxKgVFVj7r','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('Itrxtw2CVt6alrgwUmp7B','CgpQDcDFLOupqYvpPLXbt','PFXj1v5wYnR0J3WGRzfNw','maybe');
INSERT INTO "votes" VALUES('mDNPSt4hgOpAQTPOsV-mH','YaSbCK1umgVe7drTjOrK2','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('LEUi_Ff6u6MW2aZonjJjc','kxphdJ2BxA05lMLa4kKOX','PFXj1v5wYnR0J3WGRzfNw','maybe');
INSERT INTO "votes" VALUES('CawIawnuPO5HHVYRo_-SJ','_5UcfhakvLSsj3zaafax5','PFXj1v5wYnR0J3WGRzfNw','skip');
INSERT INTO "votes" VALUES('p-PcBdMSrnlOb8wMYhixy','NxVBA84y5Vu0ekOdY0RB5','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('O8JYOaSx8hmg-lRpNr5uL','ltjNzmJ4dhwhl1LP42vVu','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('rEc9eCh7NGCeSHRHHBxyM','CgpQDcDFLOupqYvpPLXbt','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('IJGi4Sezk4vieF3rqx0N_','kxphdJ2BxA05lMLa4kKOX','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('wl_shTT77WCVNkqCuoqb0','rdU8Jm1oec1_dnNAgbowj','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('6n-P__WsT8SdJ4EuBnbFn','BdG9XohDwXo_pCFYiGcjC','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('mLOBoR1lktouj7gSFRh8V','_5UcfhakvLSsj3zaafax5','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('oL193WYuFTQabpoyNkqqt','j1caYlMIZ_35jKZxfy9Z_','QjSYwq0q5Wl5F6SuIzbb5','maybe');
INSERT INTO "votes" VALUES('KgY4sL5eHzi6fVAn3k54A','apy4H5nkDRao_kihnmMQ2','QjSYwq0q5Wl5F6SuIzbb5','skip');
INSERT INTO "votes" VALUES('8tDuW9CpBBkilmIJ508gl','8XrT2WvYSlN2PTBb8sYCi','QjSYwq0q5Wl5F6SuIzbb5','skip');
INSERT INTO "votes" VALUES('uVaAg77pocEJK6LmIq6Bi','S5GTVBmSZd551jTwDwPmW','QjSYwq0q5Wl5F6SuIzbb5','maybe');
INSERT INTO "votes" VALUES('KIPKPs_SOTQ7-NMrflyVv','F3zGeyUV6kZtglwIwyx2D','QjSYwq0q5Wl5F6SuIzbb5','skip');
INSERT INTO "votes" VALUES('xFX08Fp9GkRMjJXpjlMJ4','bX4EIi6blbPnA0cWa7Xlg','QjSYwq0q5Wl5F6SuIzbb5','interested');
INSERT INTO "votes" VALUES('dL1AxtLG2caR2aH7PND-k','gEEzQKfwB0F1VqX8XdsVc','QjSYwq0q5Wl5F6SuIzbb5','interested');
INSERT INTO "votes" VALUES('T4JmM2YbjkFjVJC7wLm5v','qnHohhacgiwgk8Fi8ZUVE','QjSYwq0q5Wl5F6SuIzbb5','skip');
INSERT INTO "votes" VALUES('Dnzi9Kig9z_pvKOcdSDiy','j1caYlMIZ_35jKZxfy9Z_','D_KKgOp9oye8dMYNu8rUE','skip');
INSERT INTO "votes" VALUES('RdPW8xMKbOfoKr7Lm98Df','6SSVlh6hmMl1gDCA5ByEu','D_KKgOp9oye8dMYNu8rUE','skip');
INSERT INTO "votes" VALUES('U18Hu0DEMH3Q9KA08X5KU','8XrT2WvYSlN2PTBb8sYCi','D_KKgOp9oye8dMYNu8rUE','skip');
INSERT INTO "votes" VALUES('88EOBLhK1Mz4N39zZW_JF','S5GTVBmSZd551jTwDwPmW','D_KKgOp9oye8dMYNu8rUE','interested');
INSERT INTO "votes" VALUES('Bncqe4uoynCRgQy-HLnLq','bX4EIi6blbPnA0cWa7Xlg','D_KKgOp9oye8dMYNu8rUE','skip');
INSERT INTO "votes" VALUES('1_u9mPk9T0FfN_WOTrrrm','CG923Mfo1qJerOc8lfVvk','D_KKgOp9oye8dMYNu8rUE','maybe');
INSERT INTO "votes" VALUES('KA78P4kcRNvMnO8j_mAdI','_sfDFAgSBjNWIheuO7ZUa','v1LWH3w7-LKJl-6gC-n6r','maybe');
INSERT INTO "votes" VALUES('UeCYYAyz_VVAIFPXG84So','8XrT2WvYSlN2PTBb8sYCi','v1LWH3w7-LKJl-6gC-n6r','interested');
INSERT INTO "votes" VALUES('5hM7fNJJ_9vFUnTYrnzlJ','PnKSnU0YmB2ki07qfIPD8','v1LWH3w7-LKJl-6gC-n6r','interested');
INSERT INTO "votes" VALUES('LekhzWSvqkeEVGrn4CP8z','OoMfwjFaJeu2uCXGoahVm','v1LWH3w7-LKJl-6gC-n6r','skip');
INSERT INTO "votes" VALUES('TUuwjdQrBI2QEZPD-7kYJ','VClgJ7Z1EQ470p0exGiXI','v1LWH3w7-LKJl-6gC-n6r','maybe');
INSERT INTO "votes" VALUES('E5LsalEGa4rueVxT5uHJo','zqBRJPWIPPHHxviN0l12p','v1LWH3w7-LKJl-6gC-n6r','skip');
INSERT INTO "votes" VALUES('LD7HufHLiPsmWBCPl3gq_','gEEzQKfwB0F1VqX8XdsVc','v1LWH3w7-LKJl-6gC-n6r','skip');
INSERT INTO "votes" VALUES('DtAeBvwGxzwNCkg45uDfu','qnHohhacgiwgk8Fi8ZUVE','v1LWH3w7-LKJl-6gC-n6r','skip');
INSERT INTO "votes" VALUES('HwICN-3wTO_YLKw6dQbDq','4W2Y467pxZDCbDYB5akWV','7wppeVFZl5b7RQuuEYSbt','skip');
INSERT INTO "votes" VALUES('GIUWycCEU-dRoYFL1vIaa','apy4H5nkDRao_kihnmMQ2','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('_rTrPl6DaNoMUJ3ORZ5OO','6SSVlh6hmMl1gDCA5ByEu','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('2523cyyYL2-VcJhbzpHlL','8XrT2WvYSlN2PTBb8sYCi','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('8KPPasGAKeMVFWoBQA9Xc','PnKSnU0YmB2ki07qfIPD8','7wppeVFZl5b7RQuuEYSbt','maybe');
INSERT INTO "votes" VALUES('IzCpRjKiA20RX-ev0RLWd','F3zGeyUV6kZtglwIwyx2D','7wppeVFZl5b7RQuuEYSbt','maybe');
INSERT INTO "votes" VALUES('QJmRZJ67OUW92c7DKewsv','VClgJ7Z1EQ470p0exGiXI','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('IK1SYYPVAdEeWl11Y__r6','gEEzQKfwB0F1VqX8XdsVc','7wppeVFZl5b7RQuuEYSbt','maybe');
INSERT INTO "votes" VALUES('TQcBTUUpKTE8C8bT5btMu','qnHohhacgiwgk8Fi8ZUVE','7wppeVFZl5b7RQuuEYSbt','interested');
INSERT INTO "votes" VALUES('2r9FApC7bygWtegzv9mDl','apy4H5nkDRao_kihnmMQ2','6eHa7YiDL-FaJJSm0Ez7n','maybe');
INSERT INTO "votes" VALUES('wcIy6jjYUS5AcAnnDLG1F','6SSVlh6hmMl1gDCA5ByEu','6eHa7YiDL-FaJJSm0Ez7n','maybe');
INSERT INTO "votes" VALUES('3M4etq2RhGvm9Y8MZWFS6','F3zGeyUV6kZtglwIwyx2D','6eHa7YiDL-FaJJSm0Ez7n','interested');
INSERT INTO "votes" VALUES('A2XdLVNsCLICfzuh36gJ1','CG923Mfo1qJerOc8lfVvk','6eHa7YiDL-FaJJSm0Ez7n','interested');
INSERT INTO "votes" VALUES('iuD8at4ANxXP6me4j0FM-','FfQbC272xq3c_OMG11pJt','6eHa7YiDL-FaJJSm0Ez7n','interested');
INSERT INTO "votes" VALUES('wnkCwxIziLc2t0kQVYcqL','8XrT2WvYSlN2PTBb8sYCi','_PH-RjjLi9r4grie1eW3g','interested');
INSERT INTO "votes" VALUES('OPugauttcxsj3jph_mesp','PnKSnU0YmB2ki07qfIPD8','_PH-RjjLi9r4grie1eW3g','maybe');
INSERT INTO "votes" VALUES('V7P_BIposp5gplDzqhRxj','S5GTVBmSZd551jTwDwPmW','_PH-RjjLi9r4grie1eW3g','skip');
INSERT INTO "votes" VALUES('HWewcTmAoKLP7oyeftZjh','OoMfwjFaJeu2uCXGoahVm','_PH-RjjLi9r4grie1eW3g','interested');
INSERT INTO "votes" VALUES('S8XAm78XUIWRQC2SoUbIG','F3zGeyUV6kZtglwIwyx2D','_PH-RjjLi9r4grie1eW3g','skip');
INSERT INTO "votes" VALUES('Z5s45a5Yd0bTCJ_J1yEf5','CG923Mfo1qJerOc8lfVvk','_PH-RjjLi9r4grie1eW3g','maybe');
INSERT INTO "votes" VALUES('KOGptHeO9bUBQyefOqccX','FfQbC272xq3c_OMG11pJt','_PH-RjjLi9r4grie1eW3g','maybe');
INSERT INTO "votes" VALUES('ljSWvcFxQ415zCIH-WIOT','apy4H5nkDRao_kihnmMQ2','3Pu8go-_UUJtIVkmUGi-3','skip');
INSERT INTO "votes" VALUES('m8s23iV8bf7sQYzmozYCR','_sfDFAgSBjNWIheuO7ZUa','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('ncozcbO_brG-vip8ezTWH','8XrT2WvYSlN2PTBb8sYCi','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('SD0kFEb6NgsSQud3qCvLk','kPA9ReCYTzqVA30iy_ukb','3Pu8go-_UUJtIVkmUGi-3','maybe');
INSERT INTO "votes" VALUES('BxYu1VoL4z61dmLGg8haC','F3zGeyUV6kZtglwIwyx2D','3Pu8go-_UUJtIVkmUGi-3','maybe');
INSERT INTO "votes" VALUES('Q0GpEVhnovAmLNJAZqvSc','zqBRJPWIPPHHxviN0l12p','3Pu8go-_UUJtIVkmUGi-3','interested');
INSERT INTO "votes" VALUES('60PLPxGT8x6MlJD3Ciuth','qnHohhacgiwgk8Fi8ZUVE','3Pu8go-_UUJtIVkmUGi-3','maybe');
INSERT INTO "votes" VALUES('ZKr_alC4FRqwDOyxuOfvw','apy4H5nkDRao_kihnmMQ2','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('_Q7L7yioLPl1rYp4LMZH9','_sfDFAgSBjNWIheuO7ZUa','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('rC3UcmAy39dw4ElzQMoSh','6SSVlh6hmMl1gDCA5ByEu','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('ixuRP_NbiB1tKB6cq064S','8XrT2WvYSlN2PTBb8sYCi','HVXX4b0kZPE2S87I_d8-8','maybe');
INSERT INTO "votes" VALUES('224MrrvvTd_Hv-ZHwtoA7','PnKSnU0YmB2ki07qfIPD8','HVXX4b0kZPE2S87I_d8-8','skip');
INSERT INTO "votes" VALUES('AyxIvh1Z-RYnI8muqez3r','F3zGeyUV6kZtglwIwyx2D','HVXX4b0kZPE2S87I_d8-8','interested');
INSERT INTO "votes" VALUES('F2tQarl9wz4KlYDSMY63i','zqBRJPWIPPHHxviN0l12p','HVXX4b0kZPE2S87I_d8-8','maybe');
INSERT INTO "votes" VALUES('qJPXHP024DsVJdzlCZ_MH','gEEzQKfwB0F1VqX8XdsVc','HVXX4b0kZPE2S87I_d8-8','maybe');
INSERT INTO "votes" VALUES('A0nmnzP0c0DXv4oTYvo8N','FfQbC272xq3c_OMG11pJt','HVXX4b0kZPE2S87I_d8-8','maybe');
INSERT INTO "votes" VALUES('dmRfYf6EC69tYCfnh6ouk','kPA9ReCYTzqVA30iy_ukb','bcmhGiTYaUrkuiHoDhOlY','skip');
INSERT INTO "votes" VALUES('aImsS2C14VrS1NV7dxqUA','PnKSnU0YmB2ki07qfIPD8','bcmhGiTYaUrkuiHoDhOlY','maybe');
INSERT INTO "votes" VALUES('7-2G-hbxVXnIpCY0utYhv','S5GTVBmSZd551jTwDwPmW','bcmhGiTYaUrkuiHoDhOlY','interested');
INSERT INTO "votes" VALUES('7kaeW6OHp3dzAnwkiZwqJ','OoMfwjFaJeu2uCXGoahVm','bcmhGiTYaUrkuiHoDhOlY','interested');
INSERT INTO "votes" VALUES('2nNCkEivlsxEX4x1VV_U_','F3zGeyUV6kZtglwIwyx2D','bcmhGiTYaUrkuiHoDhOlY','interested');
INSERT INTO "votes" VALUES('oN8jM5N37mv_u9W41P7B0','VClgJ7Z1EQ470p0exGiXI','bcmhGiTYaUrkuiHoDhOlY','interested');
INSERT INTO "votes" VALUES('85NC3YRs3aMDHOHU9TCCW','xIRenXNxw_VgkpNxi0Pz1','bcmhGiTYaUrkuiHoDhOlY','maybe');
INSERT INTO "votes" VALUES('Ssu8L9d9Bk3MWvbcSGjf_','CG923Mfo1qJerOc8lfVvk','bcmhGiTYaUrkuiHoDhOlY','maybe');
INSERT INTO "votes" VALUES('1HTeTirI26LsiyPFca44-','qnHohhacgiwgk8Fi8ZUVE','bcmhGiTYaUrkuiHoDhOlY','interested');
INSERT INTO "votes" VALUES('gThwYrdeumfd334XQKwS6','4W2Y467pxZDCbDYB5akWV','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('qieOTVccTrXi_Z5d3I7IB','j1caYlMIZ_35jKZxfy9Z_','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('V8zwFGNOx4VoKZY7gZwDz','apy4H5nkDRao_kihnmMQ2','v5tZAbb7YSFl5PJzo21s-','interested');
INSERT INTO "votes" VALUES('gzb-AdKmySKdrWvpsKslO','8XrT2WvYSlN2PTBb8sYCi','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('wfcJ9OS4pfWoIyqzGQRwe','OoMfwjFaJeu2uCXGoahVm','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('nzvnCSKmOFXH92A_YXikt','CG923Mfo1qJerOc8lfVvk','v5tZAbb7YSFl5PJzo21s-','maybe');
INSERT INTO "votes" VALUES('8Y5ZQlQ4R559D1IoSS4xx','6SSVlh6hmMl1gDCA5ByEu','9g0CZRnXO7QGjOEubveKk','maybe');
INSERT INTO "votes" VALUES('uNmQ7OSsA89VnS1ZdWi2d','kPA9ReCYTzqVA30iy_ukb','9g0CZRnXO7QGjOEubveKk','maybe');
INSERT INTO "votes" VALUES('b8u2dBAxNddUMW72HaURJ','S5GTVBmSZd551jTwDwPmW','9g0CZRnXO7QGjOEubveKk','skip');
INSERT INTO "votes" VALUES('wXzZD40Gi6QtKJNpnkZED','VClgJ7Z1EQ470p0exGiXI','9g0CZRnXO7QGjOEubveKk','interested');
INSERT INTO "votes" VALUES('jUnfbjItQzTDqL2rVHT_C','zqBRJPWIPPHHxviN0l12p','9g0CZRnXO7QGjOEubveKk','interested');
INSERT INTO "votes" VALUES('ltAuqvZiLThWpm0tzx9Bc','bX4EIi6blbPnA0cWa7Xlg','9g0CZRnXO7QGjOEubveKk','skip');
INSERT INTO "votes" VALUES('wyb9G31rX2-FH4zokUS3O','xIRenXNxw_VgkpNxi0Pz1','9g0CZRnXO7QGjOEubveKk','skip');
INSERT INTO "votes" VALUES('nezVg_oKHHAaMpJ7LEG1f','CG923Mfo1qJerOc8lfVvk','9g0CZRnXO7QGjOEubveKk','interested');
INSERT INTO "votes" VALUES('R4YjsmjfhUrIR5ZPKLwsr','FfQbC272xq3c_OMG11pJt','9g0CZRnXO7QGjOEubveKk','interested');
INSERT INTO "votes" VALUES('OBDjNzLm6lGqK5_ANzedb','apy4H5nkDRao_kihnmMQ2','nq1-w7m5KRdP6EM7aGUap','interested');
INSERT INTO "votes" VALUES('4qIwttwzxjCxiAw8cKQnU','bX4EIi6blbPnA0cWa7Xlg','nq1-w7m5KRdP6EM7aGUap','maybe');
INSERT INTO "votes" VALUES('P8PgxSFnFxQa-7pEqV5lo','qnHohhacgiwgk8Fi8ZUVE','nq1-w7m5KRdP6EM7aGUap','skip');
INSERT INTO "votes" VALUES('JsBvYWetj_87CrWLz5C6p','6SSVlh6hmMl1gDCA5ByEu','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('7IwBz4qbJKFe4zDiBsmrv','8XrT2WvYSlN2PTBb8sYCi','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('3zgcvMHkfU3YACGk7Cf7Z','PnKSnU0YmB2ki07qfIPD8','8MHg-dZjICzw4uMa1DmJ8','maybe');
INSERT INTO "votes" VALUES('sI3iyBZMNBg6LbrTWF7EG','zqBRJPWIPPHHxviN0l12p','8MHg-dZjICzw4uMa1DmJ8','maybe');
INSERT INTO "votes" VALUES('48DhJCCQtKC5yKrXMC_-J','xIRenXNxw_VgkpNxi0Pz1','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('bIsVpbnikSUYyNncKx_OF','gEEzQKfwB0F1VqX8XdsVc','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('gTUiF_azpb9GwhkYlSi8z','FfQbC272xq3c_OMG11pJt','8MHg-dZjICzw4uMa1DmJ8','skip');
INSERT INTO "votes" VALUES('K1U6DgNBbOA-waoVFN4uY','qnHohhacgiwgk8Fi8ZUVE','8MHg-dZjICzw4uMa1DmJ8','interested');
INSERT INTO "votes" VALUES('vPenQWBadJOzGyKeSNciV','4W2Y467pxZDCbDYB5akWV','83A_jeq0VHVMn_8_sXYT5','interested');
INSERT INTO "votes" VALUES('OvBW3Tw4cl4C7XgfUnQTT','j1caYlMIZ_35jKZxfy9Z_','83A_jeq0VHVMn_8_sXYT5','skip');
INSERT INTO "votes" VALUES('Qm_XrmHu8EcDOCD7pjRdE','8XrT2WvYSlN2PTBb8sYCi','83A_jeq0VHVMn_8_sXYT5','skip');
INSERT INTO "votes" VALUES('0bynlSuroqz7qbc_vcsF5','kPA9ReCYTzqVA30iy_ukb','83A_jeq0VHVMn_8_sXYT5','maybe');
INSERT INTO "votes" VALUES('C5ovOCCKqoZVTmiK-WKvj','VClgJ7Z1EQ470p0exGiXI','83A_jeq0VHVMn_8_sXYT5','maybe');
INSERT INTO "votes" VALUES('KDbVwfs0blnrGaauRXyzb','xIRenXNxw_VgkpNxi0Pz1','83A_jeq0VHVMn_8_sXYT5','interested');
INSERT INTO "votes" VALUES('6qA7ZQN_gDBRXLpfq6yJO','gEEzQKfwB0F1VqX8XdsVc','83A_jeq0VHVMn_8_sXYT5','maybe');
INSERT INTO "votes" VALUES('UrwH2uT3MN9pcxPqcz5zi','CG923Mfo1qJerOc8lfVvk','83A_jeq0VHVMn_8_sXYT5','maybe');
INSERT INTO "votes" VALUES('cU4p5RdEVH0IG0OjRwrD0','FfQbC272xq3c_OMG11pJt','83A_jeq0VHVMn_8_sXYT5','skip');
INSERT INTO "votes" VALUES('gTWi7n1VlWEiWVVy9L8IF','qnHohhacgiwgk8Fi8ZUVE','83A_jeq0VHVMn_8_sXYT5','maybe');
INSERT INTO "votes" VALUES('TW8p0yzDEw_m_XOcFOANg','6SSVlh6hmMl1gDCA5ByEu','WmJuQ9CYHC091pooqSZFZ','skip');
INSERT INTO "votes" VALUES('tijQgYnu2YRGzRDiiQnAl','kPA9ReCYTzqVA30iy_ukb','WmJuQ9CYHC091pooqSZFZ','maybe');
INSERT INTO "votes" VALUES('tNACsL-4IeZxRbjJvRqS7','OoMfwjFaJeu2uCXGoahVm','WmJuQ9CYHC091pooqSZFZ','skip');
INSERT INTO "votes" VALUES('3uhPcHmzBKrpoZ_wmmOPC','F3zGeyUV6kZtglwIwyx2D','WmJuQ9CYHC091pooqSZFZ','skip');
INSERT INTO "votes" VALUES('3_m3fjovYVsBeNUoEAFVe','bX4EIi6blbPnA0cWa7Xlg','WmJuQ9CYHC091pooqSZFZ','interested');
INSERT INTO "votes" VALUES('m3mrl7D0coZ4D3-o1FwjE','xIRenXNxw_VgkpNxi0Pz1','WmJuQ9CYHC091pooqSZFZ','interested');
INSERT INTO "votes" VALUES('FZOrerbWAs2QMG3IulshS','FfQbC272xq3c_OMG11pJt','WmJuQ9CYHC091pooqSZFZ','skip');
INSERT INTO "votes" VALUES('juKCp9qfW_0gvYbYV48fs','_sfDFAgSBjNWIheuO7ZUa','fZqYxnoseVCyKIsZHt8CO','maybe');
INSERT INTO "votes" VALUES('bBbf_DuTc9SVAy0A0oX9B','6SSVlh6hmMl1gDCA5ByEu','fZqYxnoseVCyKIsZHt8CO','maybe');
INSERT INTO "votes" VALUES('r1v8JvQf4Z4W61S2UyiZz','8XrT2WvYSlN2PTBb8sYCi','fZqYxnoseVCyKIsZHt8CO','skip');
INSERT INTO "votes" VALUES('hXnoB9fVx690CXwI8cZI5','S5GTVBmSZd551jTwDwPmW','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('WbhEcs334uGbiq1lJ6VRv','OoMfwjFaJeu2uCXGoahVm','fZqYxnoseVCyKIsZHt8CO','interested');
INSERT INTO "votes" VALUES('8n7RJNsnP-h7Wi95aSHXE','CG923Mfo1qJerOc8lfVvk','fZqYxnoseVCyKIsZHt8CO','maybe');
INSERT INTO "votes" VALUES('RfjSNfyAc-796l5rFDe7T','PnKSnU0YmB2ki07qfIPD8','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('dmzlh8fIAm2ME0ZLj7iYy','S5GTVBmSZd551jTwDwPmW','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('8gmOdEPAYEo9TAxnsyoL6','zqBRJPWIPPHHxviN0l12p','jB_BrN3R2pe9d9dJmVD-Z','maybe');
INSERT INTO "votes" VALUES('iue5_CJ6nRNHzQY6oFnnn','CG923Mfo1qJerOc8lfVvk','jB_BrN3R2pe9d9dJmVD-Z','interested');
INSERT INTO "votes" VALUES('w3wM4CH_3RtVaWMS3rMfX','S5GTVBmSZd551jTwDwPmW','cZMLUBfa0F6S6I5EfHRYz','maybe');
INSERT INTO "votes" VALUES('aCnVyZ8PFLqYTH2vrrccs','OoMfwjFaJeu2uCXGoahVm','cZMLUBfa0F6S6I5EfHRYz','interested');
INSERT INTO "votes" VALUES('dM95nMrjjzRXGfULtbYYs','zqBRJPWIPPHHxviN0l12p','cZMLUBfa0F6S6I5EfHRYz','interested');
INSERT INTO "votes" VALUES('jaB1mmfQFqwR0dTjNMetE','bX4EIi6blbPnA0cWa7Xlg','cZMLUBfa0F6S6I5EfHRYz','skip');
INSERT INTO "votes" VALUES('2-YnzaOoJEtjKW7j3AjVo','xIRenXNxw_VgkpNxi0Pz1','cZMLUBfa0F6S6I5EfHRYz','skip');
INSERT INTO "votes" VALUES('DuBPHennuSbQk0wYUwAXD','j1caYlMIZ_35jKZxfy9Z_','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('bnDmm5kWO7zXs4bclWrMB','6SSVlh6hmMl1gDCA5ByEu','9FroXFwPtFCmLcWR5Or3U','maybe');
INSERT INTO "votes" VALUES('R0KaHDe-dzIeDzXBw8x1O','8XrT2WvYSlN2PTBb8sYCi','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('2RJCTbO2JceqLGWdV-hHX','bX4EIi6blbPnA0cWa7Xlg','9FroXFwPtFCmLcWR5Or3U','interested');
INSERT INTO "votes" VALUES('et2paH2RBW5_DdDuQPHH4','gEEzQKfwB0F1VqX8XdsVc','9FroXFwPtFCmLcWR5Or3U','skip');
INSERT INTO "votes" VALUES('CXKfdAKwGkK1XwcRnMY4y','4W2Y467pxZDCbDYB5akWV','0YSe4489kcFwbDkAXLkP0','skip');
INSERT INTO "votes" VALUES('tynGPoKwUhoLNcNZ_USUc','j1caYlMIZ_35jKZxfy9Z_','0YSe4489kcFwbDkAXLkP0','maybe');
INSERT INTO "votes" VALUES('Vq8NM017Ewp1dNQEmJXEO','kPA9ReCYTzqVA30iy_ukb','0YSe4489kcFwbDkAXLkP0','skip');
INSERT INTO "votes" VALUES('e3X83MoKyGNsktcPN06uC','S5GTVBmSZd551jTwDwPmW','0YSe4489kcFwbDkAXLkP0','interested');
INSERT INTO "votes" VALUES('DOxM5kaaQBbNSzUeKd-xW','zqBRJPWIPPHHxviN0l12p','0YSe4489kcFwbDkAXLkP0','skip');
INSERT INTO "votes" VALUES('O8HEMoHZqK2oFr7LFqhOz','xIRenXNxw_VgkpNxi0Pz1','0YSe4489kcFwbDkAXLkP0','skip');
INSERT INTO "votes" VALUES('J01Qyw5Gn7_081mcz8Dc-','qnHohhacgiwgk8Fi8ZUVE','0YSe4489kcFwbDkAXLkP0','maybe');
INSERT INTO "votes" VALUES('2C3AhMnDkmDKXWzXQa0zM','j1caYlMIZ_35jKZxfy9Z_','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('3X3ltgFNDIHJHScofbRql','apy4H5nkDRao_kihnmMQ2','e82w5UT6LusUDYXvbVNHN','interested');
INSERT INTO "votes" VALUES('CleAbt0dgJnFi2qVqy-vu','OoMfwjFaJeu2uCXGoahVm','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('b3GcFwASddTAgQovT8qqj','F3zGeyUV6kZtglwIwyx2D','e82w5UT6LusUDYXvbVNHN','interested');
INSERT INTO "votes" VALUES('nCK9P4raPG272eYCKWV8M','VClgJ7Z1EQ470p0exGiXI','e82w5UT6LusUDYXvbVNHN','skip');
INSERT INTO "votes" VALUES('kwGvAiy4vYUPiT61_5VFf','CG923Mfo1qJerOc8lfVvk','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('4LuoM4OTy4RSfXI1ot4lq','FfQbC272xq3c_OMG11pJt','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('P6y6atPojCgFLls0V4C1E','qnHohhacgiwgk8Fi8ZUVE','e82w5UT6LusUDYXvbVNHN','maybe');
INSERT INTO "votes" VALUES('eyh80OJcvs4t9LCM-2Who','4W2Y467pxZDCbDYB5akWV','Q6eo854u23kBy9QQk8N_m','skip');
INSERT INTO "votes" VALUES('ILS4IBH8KWAxt0ZBgWCI8','j1caYlMIZ_35jKZxfy9Z_','Q6eo854u23kBy9QQk8N_m','interested');
INSERT INTO "votes" VALUES('U2i0yegmo2SpMcnhUJMKO','PnKSnU0YmB2ki07qfIPD8','Q6eo854u23kBy9QQk8N_m','maybe');
INSERT INTO "votes" VALUES('rGhrNuOBm5jIcsTnBo5rh','VClgJ7Z1EQ470p0exGiXI','Q6eo854u23kBy9QQk8N_m','interested');
INSERT INTO "votes" VALUES('DtCvyXB5eq_0UI0mF-FQZ','zqBRJPWIPPHHxviN0l12p','Q6eo854u23kBy9QQk8N_m','maybe');
INSERT INTO "votes" VALUES('n-bUCoPkrX4_v3vxIsh8N','bX4EIi6blbPnA0cWa7Xlg','Q6eo854u23kBy9QQk8N_m','maybe');
INSERT INTO "votes" VALUES('L0KMA9zbuoSxkMpxpu1fU','CG923Mfo1qJerOc8lfVvk','Q6eo854u23kBy9QQk8N_m','maybe');
INSERT INTO "votes" VALUES('WP0fx4AVhOZ449Jxa14gY','4W2Y467pxZDCbDYB5akWV','QFCjX9dTA-lh3ykbA1bj9','interested');
INSERT INTO "votes" VALUES('hH2UwPmSCne9coCzm7J2_','_sfDFAgSBjNWIheuO7ZUa','QFCjX9dTA-lh3ykbA1bj9','interested');
INSERT INTO "votes" VALUES('3aeSZ_CXpuLjvnUOKasfx','8XrT2WvYSlN2PTBb8sYCi','QFCjX9dTA-lh3ykbA1bj9','skip');
INSERT INTO "votes" VALUES('WQV67GCS6He9SIzVD6iXZ','PnKSnU0YmB2ki07qfIPD8','QFCjX9dTA-lh3ykbA1bj9','skip');
INSERT INTO "votes" VALUES('rsMekPEsl_83I9pQw3WtL','S5GTVBmSZd551jTwDwPmW','QFCjX9dTA-lh3ykbA1bj9','maybe');
INSERT INTO "votes" VALUES('Ar5MGMSWN0j-frO32jRnX','F3zGeyUV6kZtglwIwyx2D','QFCjX9dTA-lh3ykbA1bj9','skip');
INSERT INTO "votes" VALUES('80bATNjyjMaoGb4oD9nSi','FfQbC272xq3c_OMG11pJt','QFCjX9dTA-lh3ykbA1bj9','interested');
INSERT INTO "votes" VALUES('RySJB7I38jUiHFA1t_Yz6','j1caYlMIZ_35jKZxfy9Z_','G8OmLmmELGnP-WhARRWhV','maybe');
INSERT INTO "votes" VALUES('xOo0kSVR4dG2ku_RIrkcV','8XrT2WvYSlN2PTBb8sYCi','G8OmLmmELGnP-WhARRWhV','skip');
INSERT INTO "votes" VALUES('QNtH1lSHjb8xNVCaZhfA8','PnKSnU0YmB2ki07qfIPD8','G8OmLmmELGnP-WhARRWhV','skip');
INSERT INTO "votes" VALUES('XTx-Tm8WqQv7cTIDIK-lJ','S5GTVBmSZd551jTwDwPmW','G8OmLmmELGnP-WhARRWhV','maybe');
INSERT INTO "votes" VALUES('2E5PAaptuWdHLUo_kNWKE','OoMfwjFaJeu2uCXGoahVm','G8OmLmmELGnP-WhARRWhV','maybe');
INSERT INTO "votes" VALUES('Tx5lZzQF9BmjAfz_9Rtnp','xIRenXNxw_VgkpNxi0Pz1','G8OmLmmELGnP-WhARRWhV','interested');
INSERT INTO "votes" VALUES('rUaDaa9b2mGbahM7460AC','FfQbC272xq3c_OMG11pJt','G8OmLmmELGnP-WhARRWhV','interested');
INSERT INTO "votes" VALUES('QgOms5g9d-NVqufxX7GRD','apy4H5nkDRao_kihnmMQ2','Dn1JfrOPKM3MN_1FblphI','maybe');
INSERT INTO "votes" VALUES('d06Ui38ro_H2wcXo7I040','6SSVlh6hmMl1gDCA5ByEu','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('ZDSvMTPJfgrl17XIR0rzs','8XrT2WvYSlN2PTBb8sYCi','Dn1JfrOPKM3MN_1FblphI','maybe');
INSERT INTO "votes" VALUES('XCjqzSQKN4FmOhzQBfwxY','S5GTVBmSZd551jTwDwPmW','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('qQGXDExDh2W-WIOHFbHok','F3zGeyUV6kZtglwIwyx2D','Dn1JfrOPKM3MN_1FblphI','maybe');
INSERT INTO "votes" VALUES('cvinVBbygWDBDYIgEPq0U','gEEzQKfwB0F1VqX8XdsVc','Dn1JfrOPKM3MN_1FblphI','interested');
INSERT INTO "votes" VALUES('80zyqg1uiNW7Z67tKPWQo','apy4H5nkDRao_kihnmMQ2','RU9nYsEcJzqc_ednIERw_','maybe');
INSERT INTO "votes" VALUES('xJz8ShKj6asDiDg4YaCZw','_sfDFAgSBjNWIheuO7ZUa','RU9nYsEcJzqc_ednIERw_','interested');
INSERT INTO "votes" VALUES('VHEsXV9FEcuXcF0w_Ulba','6SSVlh6hmMl1gDCA5ByEu','RU9nYsEcJzqc_ednIERw_','skip');
INSERT INTO "votes" VALUES('_cW_ctYDQfsu3jj2vn0CS','8XrT2WvYSlN2PTBb8sYCi','RU9nYsEcJzqc_ednIERw_','maybe');
INSERT INTO "votes" VALUES('EHfWlFlP1qEFYZseTxBny','PnKSnU0YmB2ki07qfIPD8','RU9nYsEcJzqc_ednIERw_','skip');
INSERT INTO "votes" VALUES('xmLtX-8HyAEIhsLMSUF1A','OoMfwjFaJeu2uCXGoahVm','RU9nYsEcJzqc_ednIERw_','interested');
INSERT INTO "votes" VALUES('2zhis054pvhtA8nD8l_EK','F3zGeyUV6kZtglwIwyx2D','RU9nYsEcJzqc_ednIERw_','interested');
INSERT INTO "votes" VALUES('LHFT4xUNMrGb5pprK6G_C','VClgJ7Z1EQ470p0exGiXI','RU9nYsEcJzqc_ednIERw_','interested');
INSERT INTO "votes" VALUES('RGM6MDCB4DsdZttwUEKNZ','gEEzQKfwB0F1VqX8XdsVc','RU9nYsEcJzqc_ednIERw_','skip');
INSERT INTO "votes" VALUES('V3BczbyJQ_hfgaCvSD8mR','qnHohhacgiwgk8Fi8ZUVE','RU9nYsEcJzqc_ednIERw_','maybe');
INSERT INTO "votes" VALUES('sPNtwfspoc-1xgtXn4YvY','4W2Y467pxZDCbDYB5akWV','AihenfK1lc_DtRCbGnZMz','skip');
INSERT INTO "votes" VALUES('_70FeBL3Wo7woPX0fOOl9','6SSVlh6hmMl1gDCA5ByEu','AihenfK1lc_DtRCbGnZMz','skip');
INSERT INTO "votes" VALUES('puA_Udag9E26Oq2jr5Nfa','8XrT2WvYSlN2PTBb8sYCi','AihenfK1lc_DtRCbGnZMz','maybe');
INSERT INTO "votes" VALUES('LBtElKPLenUVXyNPWQlPs','kPA9ReCYTzqVA30iy_ukb','AihenfK1lc_DtRCbGnZMz','maybe');
INSERT INTO "votes" VALUES('cMA9En8gjGr0N96Ue_gf9','F3zGeyUV6kZtglwIwyx2D','AihenfK1lc_DtRCbGnZMz','interested');
INSERT INTO "votes" VALUES('7G6w_F-mDYhIWrzZxo12q','FfQbC272xq3c_OMG11pJt','AihenfK1lc_DtRCbGnZMz','skip');
INSERT INTO "votes" VALUES('Fy-52d3-lqYdcKRVGfOKj','qnHohhacgiwgk8Fi8ZUVE','AihenfK1lc_DtRCbGnZMz','skip');
INSERT INTO "votes" VALUES('DBa0Cp8T37WqYou78jhLJ','j1caYlMIZ_35jKZxfy9Z_','zsNXiSggm-32OG1Nltfh9','interested');
INSERT INTO "votes" VALUES('6wSBeM1UwrASBiQAQxkEB','apy4H5nkDRao_kihnmMQ2','zsNXiSggm-32OG1Nltfh9','maybe');
INSERT INTO "votes" VALUES('-uOi_xvppdLwUugGLvzRQ','qnHohhacgiwgk8Fi8ZUVE','zsNXiSggm-32OG1Nltfh9','maybe');
INSERT INTO "votes" VALUES('TFr5kWX0U4jt69PPvukSP','j1caYlMIZ_35jKZxfy9Z_','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('wcdTVJug6WTLRe1Rw84IE','_sfDFAgSBjNWIheuO7ZUa','tNgPrenwfsyWgXdmhTkJT','interested');
INSERT INTO "votes" VALUES('QfJP5bEkeCqoKd3fJZ5xR','6SSVlh6hmMl1gDCA5ByEu','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('A1cGcdRNE8L-fFesJiFvg','8XrT2WvYSlN2PTBb8sYCi','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('-Pb5tvti21G102RGkWbtQ','PnKSnU0YmB2ki07qfIPD8','tNgPrenwfsyWgXdmhTkJT','skip');
INSERT INTO "votes" VALUES('AR6yOfE1ue_b3Gdd5-0--','xIRenXNxw_VgkpNxi0Pz1','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('8Hx4B4np1iNv_v9V7N70v','gEEzQKfwB0F1VqX8XdsVc','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('oG0ZaQu72VIpNE51Zd7U8','CG923Mfo1qJerOc8lfVvk','tNgPrenwfsyWgXdmhTkJT','skip');
INSERT INTO "votes" VALUES('f8Uj4nf1cuEeCrZFNMjOo','FfQbC272xq3c_OMG11pJt','tNgPrenwfsyWgXdmhTkJT','maybe');
INSERT INTO "votes" VALUES('1iwCyezLhEqnz9Nxp668R','apy4H5nkDRao_kihnmMQ2','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('pKpMyUOMwyXGByMk2R38L','kPA9ReCYTzqVA30iy_ukb','szr8__xh9YMN2LpGWETIj','maybe');
INSERT INTO "votes" VALUES('HqasqG6f7kDXpE6qEW1ns','PnKSnU0YmB2ki07qfIPD8','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('pbgTblCZ5hkOkIrzjsNGh','S5GTVBmSZd551jTwDwPmW','szr8__xh9YMN2LpGWETIj','maybe');
INSERT INTO "votes" VALUES('8uEXH4iVNFHAEnsy1bLdy','OoMfwjFaJeu2uCXGoahVm','szr8__xh9YMN2LpGWETIj','maybe');
INSERT INTO "votes" VALUES('l7oQfrQ_Omwq8HKGYjVCE','zqBRJPWIPPHHxviN0l12p','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('OShGJ8zwrRso9QBEpwV0I','xIRenXNxw_VgkpNxi0Pz1','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('fwW7ZMu4YGmPy1068I-3-','gEEzQKfwB0F1VqX8XdsVc','szr8__xh9YMN2LpGWETIj','interested');
INSERT INTO "votes" VALUES('QSXiHIo1lqyeNRwtfnkmb','qnHohhacgiwgk8Fi8ZUVE','szr8__xh9YMN2LpGWETIj','skip');
INSERT INTO "votes" VALUES('7s4j4gg3Tv_ky80tCJN_w','4W2Y467pxZDCbDYB5akWV','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('Po7N66Fviu3r3fkGyJkAt','apy4H5nkDRao_kihnmMQ2','9JooMeSbTSmEaLKsrVarM','skip');
INSERT INTO "votes" VALUES('qnUHQbb93is0Kaoa0cvTB','OoMfwjFaJeu2uCXGoahVm','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('5M6Je1vHRjJ1UI5Fpft-K','zqBRJPWIPPHHxviN0l12p','9JooMeSbTSmEaLKsrVarM','maybe');
INSERT INTO "votes" VALUES('RDyPEvc_TrjU17BCC06vf','FfQbC272xq3c_OMG11pJt','9JooMeSbTSmEaLKsrVarM','interested');
INSERT INTO "votes" VALUES('JHUtm9VMVv_2aFVDVBjDI','4W2Y467pxZDCbDYB5akWV','K4DHbqaIN6Zb6a4ytDqH8','interested');
INSERT INTO "votes" VALUES('c6ZGA0PX7YcQ2Q91CYueQ','_sfDFAgSBjNWIheuO7ZUa','K4DHbqaIN6Zb6a4ytDqH8','interested');
INSERT INTO "votes" VALUES('fRc3mkcljM0wM_14vg-7p','8XrT2WvYSlN2PTBb8sYCi','K4DHbqaIN6Zb6a4ytDqH8','skip');
INSERT INTO "votes" VALUES('RZxSW-C32JZ7_65JpqxFU','kPA9ReCYTzqVA30iy_ukb','K4DHbqaIN6Zb6a4ytDqH8','maybe');
INSERT INTO "votes" VALUES('S-glUOq1dB4_n49mfZM8W','PnKSnU0YmB2ki07qfIPD8','K4DHbqaIN6Zb6a4ytDqH8','maybe');
INSERT INTO "votes" VALUES('0Didl2QTlJ6n6-7dKVwmW','VClgJ7Z1EQ470p0exGiXI','K4DHbqaIN6Zb6a4ytDqH8','interested');
INSERT INTO "votes" VALUES('WlVW9U8vVhRURVrNftUzM','zqBRJPWIPPHHxviN0l12p','K4DHbqaIN6Zb6a4ytDqH8','interested');
INSERT INTO "votes" VALUES('l69PJaqiRDIQEY_p0cPxe','j1caYlMIZ_35jKZxfy9Z_','WxXF_iMmKJO_lrRfx13Gj','maybe');
INSERT INTO "votes" VALUES('V_ut9wTP9rWK_89iSCaVi','6SSVlh6hmMl1gDCA5ByEu','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('Bf71_cBPiyR2_75tkbrSY','8XrT2WvYSlN2PTBb8sYCi','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('R18IF9Z-75LBdTy9CyDJf','PnKSnU0YmB2ki07qfIPD8','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('D9PtkubSxGpC__79E-tFM','S5GTVBmSZd551jTwDwPmW','WxXF_iMmKJO_lrRfx13Gj','maybe');
INSERT INTO "votes" VALUES('8mKtisabfX-9Cie8IFZgg','OoMfwjFaJeu2uCXGoahVm','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('GMxCpPc5v46tgtuVYOgX0','F3zGeyUV6kZtglwIwyx2D','WxXF_iMmKJO_lrRfx13Gj','skip');
INSERT INTO "votes" VALUES('ymzia5d_gEJCvO5o2yPDR','bX4EIi6blbPnA0cWa7Xlg','WxXF_iMmKJO_lrRfx13Gj','maybe');
INSERT INTO "votes" VALUES('ddAiHspTRdCOxr1hbu7PR','gEEzQKfwB0F1VqX8XdsVc','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('Sd5JWjNSRUIS35A6m6C6s','qnHohhacgiwgk8Fi8ZUVE','WxXF_iMmKJO_lrRfx13Gj','interested');
INSERT INTO "votes" VALUES('UyhATAqakejOgZOkf-BQN','OoMfwjFaJeu2uCXGoahVm','0SRqfXklt5i26mv0cAGEN','skip');
INSERT INTO "votes" VALUES('Jscuxr-WsgQPq6mdiVhTt','F3zGeyUV6kZtglwIwyx2D','0SRqfXklt5i26mv0cAGEN','interested');
INSERT INTO "votes" VALUES('wsw_MU-c6VeuNd0EIE_EP','VClgJ7Z1EQ470p0exGiXI','0SRqfXklt5i26mv0cAGEN','skip');
INSERT INTO "votes" VALUES('iOoN6xmtERqNeTIRywadd','bX4EIi6blbPnA0cWa7Xlg','0SRqfXklt5i26mv0cAGEN','maybe');
INSERT INTO "votes" VALUES('NQivauLmMbQ9IDK00NV2a','xIRenXNxw_VgkpNxi0Pz1','0SRqfXklt5i26mv0cAGEN','maybe');
INSERT INTO "votes" VALUES('VHsvOtJMzGPjNd3o8wlgW','CG923Mfo1qJerOc8lfVvk','0SRqfXklt5i26mv0cAGEN','skip');
INSERT INTO "votes" VALUES('8SnP4Qp73ugRETrUDa0V2','qnHohhacgiwgk8Fi8ZUVE','0SRqfXklt5i26mv0cAGEN','maybe');
INSERT INTO "votes" VALUES('T8bD23TeGiweDWSCPBhCd','apy4H5nkDRao_kihnmMQ2','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('R8E5yBT0oh2_8kk-0M1FG','_sfDFAgSBjNWIheuO7ZUa','NC-tL-XUUw3FX9uldEzIL','interested');
INSERT INTO "votes" VALUES('w9oh3N-7CxIQnFRbuoJJQ','6SSVlh6hmMl1gDCA5ByEu','NC-tL-XUUw3FX9uldEzIL','interested');
INSERT INTO "votes" VALUES('oCQi5iWnkksPCs0Zo1Uep','kPA9ReCYTzqVA30iy_ukb','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('wIFThd90aibUCiVNabht4','PnKSnU0YmB2ki07qfIPD8','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('bPgb1L_z7YxVboyrpBLTe','OoMfwjFaJeu2uCXGoahVm','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('yoEQOt-_ppP2SXKD2X5vy','VClgJ7Z1EQ470p0exGiXI','NC-tL-XUUw3FX9uldEzIL','interested');
INSERT INTO "votes" VALUES('rjC483OjE-wEavm2WxwjX','FfQbC272xq3c_OMG11pJt','NC-tL-XUUw3FX9uldEzIL','maybe');
INSERT INTO "votes" VALUES('SPO1XJqCAKwEWH6SpomsI','4W2Y467pxZDCbDYB5akWV','Ckbuc6jH9wq5YwCRbj_gd','maybe');
INSERT INTO "votes" VALUES('Hb1Ik_458yh9eU41shDYl','j1caYlMIZ_35jKZxfy9Z_','Ckbuc6jH9wq5YwCRbj_gd','maybe');
INSERT INTO "votes" VALUES('CZy0R39cslQeSJMRTY0dp','PnKSnU0YmB2ki07qfIPD8','Ckbuc6jH9wq5YwCRbj_gd','interested');
INSERT INTO "votes" VALUES('PACLW89b0KjvCDnXISg1l','F3zGeyUV6kZtglwIwyx2D','Ckbuc6jH9wq5YwCRbj_gd','maybe');
INSERT INTO "votes" VALUES('TkH9Dl6iyIorxO-iwI7ql','VClgJ7Z1EQ470p0exGiXI','Ckbuc6jH9wq5YwCRbj_gd','maybe');
INSERT INTO "votes" VALUES('H1zhyZL78km8vEOOowQ-T','CG923Mfo1qJerOc8lfVvk','Ckbuc6jH9wq5YwCRbj_gd','interested');
INSERT INTO "votes" VALUES('ef8GevNG6Ya9mcw1euwqw','qnHohhacgiwgk8Fi8ZUVE','Ckbuc6jH9wq5YwCRbj_gd','interested');
INSERT INTO "votes" VALUES('XxEXZUESEkPvZdOnxWz3q','_sfDFAgSBjNWIheuO7ZUa','pBNXg_yJ-sQ89E9eCqKrN','skip');
INSERT INTO "votes" VALUES('fO-jo03l2ymkloAijo8pa','8XrT2WvYSlN2PTBb8sYCi','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('y_zbuZUmKC_-6cXHPBRpl','S5GTVBmSZd551jTwDwPmW','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('BpmXuMwLb521Qe6cRKKmx','F3zGeyUV6kZtglwIwyx2D','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('w6gzAB61iY90y51_LBGTw','bX4EIi6blbPnA0cWa7Xlg','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('24vkx3dxptEpIgTfW7HPB','gEEzQKfwB0F1VqX8XdsVc','pBNXg_yJ-sQ89E9eCqKrN','skip');
INSERT INTO "votes" VALUES('3NW81cTKqVw4Ve-vzvOt-','CG923Mfo1qJerOc8lfVvk','pBNXg_yJ-sQ89E9eCqKrN','skip');
INSERT INTO "votes" VALUES('xA0LWuT6PGQFNR74YEdzz','FfQbC272xq3c_OMG11pJt','pBNXg_yJ-sQ89E9eCqKrN','interested');
INSERT INTO "votes" VALUES('jWJ6H1dMq2FjRjFyNoQOG','qnHohhacgiwgk8Fi8ZUVE','pBNXg_yJ-sQ89E9eCqKrN','maybe');
INSERT INTO "votes" VALUES('iqmM7b31V5b8FogigaFf6','4W2Y467pxZDCbDYB5akWV','J9p4xEZXtxzquUK9fsube','skip');
INSERT INTO "votes" VALUES('OHCYuMUAh4l7HHZwv4YyN','_sfDFAgSBjNWIheuO7ZUa','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('F0HUOdWAKHeRIawl6wrlt','kPA9ReCYTzqVA30iy_ukb','J9p4xEZXtxzquUK9fsube','skip');
INSERT INTO "votes" VALUES('xt2ZE2bnrSDNDwf-nCXOY','S5GTVBmSZd551jTwDwPmW','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('lagWzR7qoMdYKXaRUvGey','F3zGeyUV6kZtglwIwyx2D','J9p4xEZXtxzquUK9fsube','maybe');
INSERT INTO "votes" VALUES('ab1yz6O2pNY8DtXpwQEIm','zqBRJPWIPPHHxviN0l12p','J9p4xEZXtxzquUK9fsube','maybe');
INSERT INTO "votes" VALUES('n_mXScoAFoLDECmkbaBZu','xIRenXNxw_VgkpNxi0Pz1','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('ms7PRHsbavzvA6hhdbhBy','FfQbC272xq3c_OMG11pJt','J9p4xEZXtxzquUK9fsube','interested');
INSERT INTO "votes" VALUES('AnvJVRwsAh6YSNNZU79tZ','4W2Y467pxZDCbDYB5akWV','PFXj1v5wYnR0J3WGRzfNw','skip');
INSERT INTO "votes" VALUES('vnG_2rgfWOrzTSyL0SrXt','apy4H5nkDRao_kihnmMQ2','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('YW6IIoNNvkbm-LTrS0TGZ','OoMfwjFaJeu2uCXGoahVm','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('sJ28lonhLQ6yuRqebCYdJ','VClgJ7Z1EQ470p0exGiXI','PFXj1v5wYnR0J3WGRzfNw','skip');
INSERT INTO "votes" VALUES('7_7yMhS3TEsoz1lheMjoz','bX4EIi6blbPnA0cWa7Xlg','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('febhezsjYlU5LSx8XHW50','xIRenXNxw_VgkpNxi0Pz1','PFXj1v5wYnR0J3WGRzfNw','skip');
INSERT INTO "votes" VALUES('juX8v6cfwrjUR_5MjXZJL','FfQbC272xq3c_OMG11pJt','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('zmMRiiVB4fdEXXd1PCMWZ','qnHohhacgiwgk8Fi8ZUVE','PFXj1v5wYnR0J3WGRzfNw','interested');
INSERT INTO "votes" VALUES('5btlXaQYAdly2GaDglej4','j1caYlMIZ_35jKZxfy9Z_','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('TXV5Iqopra6nAexBjmbDR','apy4H5nkDRao_kihnmMQ2','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('xrKWqHs8baOuEbBrdX9to','_sfDFAgSBjNWIheuO7ZUa','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('U_L5UjFXfri4N8X4SWRx3','8XrT2WvYSlN2PTBb8sYCi','W4iFiQGvwqDY93_6-w66L','skip');
INSERT INTO "votes" VALUES('O4fBWhYzwqfPQeOoACH_3','S5GTVBmSZd551jTwDwPmW','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('CIgULf9ZNyZ4TBl9CYCzL','OoMfwjFaJeu2uCXGoahVm','W4iFiQGvwqDY93_6-w66L','maybe');
INSERT INTO "votes" VALUES('1UJmYQPQ541kf8M3HJ9UX','F3zGeyUV6kZtglwIwyx2D','W4iFiQGvwqDY93_6-w66L','interested');
INSERT INTO "votes" VALUES('lSocIgf9C44CsrrjmqZUk','qnHohhacgiwgk8Fi8ZUVE','W4iFiQGvwqDY93_6-w66L','skip');
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
INSERT INTO "events" VALUES('3JBdGjXrB1T9H4gI-JYno','Conference Alpha','Conference-Alpha','Event currently in proposal phase','https://test-event-1.example.com','2026-10-11T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-08-23T09:25:29.989Z','2026-09-06T09:25:29.989Z','2026-09-06T09:25:29.989Z','2026-09-20T09:25:29.989Z','2026-09-20T09:25:29.989Z','2026-10-13T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0);
INSERT INTO "events" VALUES('4XWaXczC8a1QUvqs1AKd7','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','https://test-event-2.example.com','2026-09-27T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-08-09T09:25:29.989Z','2026-08-23T09:25:29.989Z','2026-08-23T09:25:29.989Z','2026-09-06T09:25:29.989Z','2026-09-06T09:25:29.989Z','2026-09-29T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0);
INSERT INTO "events" VALUES('CHvVvgFcGB3sglCOcForn','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','https://test-event-3.example.com','2026-09-13T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-07-26T09:25:29.989Z','2026-08-09T09:25:29.989Z','2026-08-09T09:25:29.989Z','2026-08-23T09:25:29.989Z','2026-08-23T09:25:29.989Z','2026-09-15T16:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0);
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
INSERT INTO "sessions" VALUES('nnul7TLDWIVjRZ7Fq8d1M','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-11T07:00:00.000Z','2026-10-11T08:30:00.000Z',100,1,0,0,NULL,'3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "sessions" VALUES('UtpuIxKkgIcqPNNe13uMU','Lunch Break','','2026-10-11T10:30:00.000Z','2026-10-11T12:00:00.000Z',0,1,1,0,NULL,'3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "sessions" VALUES('RE-xaBc2FXcYRx_YbYTrq','Lunch Break','','2026-10-12T10:30:00.000Z','2026-10-12T12:00:00.000Z',0,1,1,0,NULL,'3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "sessions" VALUES('zPL8Bea2YK1-wrSqgOEjp','Lunch Break','','2026-10-13T10:30:00.000Z','2026-10-13T12:00:00.000Z',0,1,1,0,NULL,'3JBdGjXrB1T9H4gI-JYno');
INSERT INTO "sessions" VALUES('4s3FVmNNs_Q6Ya4h_7oIy','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-09-27T07:00:00.000Z','2026-09-27T08:30:00.000Z',100,1,0,0,NULL,'4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "sessions" VALUES('VD5N6yF4VjSZN7RdY-Tg5','Lunch Break','','2026-09-27T10:30:00.000Z','2026-09-27T12:00:00.000Z',0,1,1,0,NULL,'4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "sessions" VALUES('J-OJpQwkW7l_0GtSrjK6U','Lunch Break','','2026-09-28T10:30:00.000Z','2026-09-28T12:00:00.000Z',0,1,1,0,NULL,'4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "sessions" VALUES('qAiNyb60QqqfQNaiDtwe2','Lunch Break','','2026-09-29T10:30:00.000Z','2026-09-29T12:00:00.000Z',0,1,1,0,NULL,'4XWaXczC8a1QUvqs1AKd7');
INSERT INTO "sessions" VALUES('NutVkebXzRLt5hsx9X46b','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-13T07:00:00.000Z','2026-09-13T08:30:00.000Z',100,1,0,0,NULL,'CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('PS9FLOWMLcuxTTDxOE7Lw','Lunch Break','','2026-09-13T10:30:00.000Z','2026-09-13T12:00:00.000Z',0,1,1,0,NULL,'CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('-CsK3j7Ahb4LbnPshFOfC','Lunch Break','','2026-09-14T10:30:00.000Z','2026-09-14T12:00:00.000Z',0,1,1,0,NULL,'CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('AGazrn_Lz_BnT3QVYLMUl','Lunch Break','','2026-09-15T10:30:00.000Z','2026-09-15T12:00:00.000Z',0,1,1,0,NULL,'CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('Ct3lN9o2qFEuV-3UlcHqW','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-13T09:00:00.000Z','2026-09-13T10:00:00.000Z',100,0,0,0,'j1caYlMIZ_35jKZxfy9Z_','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('in1eYBhjmt1VvNjg9LXS6','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-13T09:00:00.000Z','2026-09-13T10:30:00.000Z',30,0,0,1,'apy4H5nkDRao_kihnmMQ2','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('GlnS6ieKGMKzQ5OVIEEg2','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-13T12:00:00.000Z','2026-09-13T13:00:00.000Z',100,0,0,0,'_sfDFAgSBjNWIheuO7ZUa','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('IVpdJlFl76HZM-RgM5gyK','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-13T12:00:00.000Z','2026-09-13T13:30:00.000Z',25,0,0,0,'zqBRJPWIPPHHxviN0l12p','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('POA9K_G3bPA0Yep9GL4WX','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-13T13:30:00.000Z','2026-09-13T14:30:00.000Z',30,0,0,0,'S5GTVBmSZd551jTwDwPmW','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('bH5fF1MXNMLk_FfKTNdzK','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-14T07:00:00.000Z','2026-09-14T08:00:00.000Z',100,0,0,0,'4W2Y467pxZDCbDYB5akWV','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('rD0ZoLJZMAwf6tb1YwZH6','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-14T08:00:00.000Z','2026-09-14T09:30:00.000Z',25,0,0,0,'OoMfwjFaJeu2uCXGoahVm','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('uaqISzRkWL0F9AoDLH3VS','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-14T08:30:00.000Z','2026-09-14T10:00:00.000Z',30,0,0,0,'VClgJ7Z1EQ470p0exGiXI','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('QjneSDqv143qZmclBOZp3','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',100,0,0,0,'xIRenXNxw_VgkpNxi0Pz1','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('8I-5-yNyIbRS5jU2y1LFw','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',25,0,0,0,'kPA9ReCYTzqVA30iy_ukb','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('OXyNEs_J831PJ3CbysOFx','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-14T14:00:00.000Z','2026-09-14T15:00:00.000Z',100,0,0,0,'PnKSnU0YmB2ki07qfIPD8','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('__t5S8yaaoivxf-p9eRL-','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-14T14:00:00.000Z','2026-09-14T14:30:00.000Z',15,0,0,0,NULL,'CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('MXJB8cB3QNZXzm0ohZ8kS','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-15T07:00:00.000Z','2026-09-15T08:00:00.000Z',100,0,0,0,'8XrT2WvYSlN2PTBb8sYCi','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('h1iEOElcXfu6ohFLxx2Eb','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-15T08:00:00.000Z','2026-09-15T09:00:00.000Z',30,0,0,0,'F3zGeyUV6kZtglwIwyx2D','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('hwm7mZHl-FImuaEKXEc55','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-15T08:30:00.000Z','2026-09-15T09:30:00.000Z',25,0,0,0,'bX4EIi6blbPnA0cWa7Xlg','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('pXDgZEi8Zkx-hEtNHkEyp','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-15T12:00:00.000Z','2026-09-15T13:00:00.000Z',100,0,0,0,'6SSVlh6hmMl1gDCA5ByEu','CHvVvgFcGB3sglCOcForn');
INSERT INTO "sessions" VALUES('Ih8Y9wPG8g6_zTL9twNq9','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-15T14:00:00.000Z','2026-09-15T15:00:00.000Z',100,1,0,0,NULL,'CHvVvgFcGB3sglCOcForn');
CREATE TABLE `site_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text DEFAULT 'Example Conference Weekend' NOT NULL,
	`description` text DEFAULT 'Welcome! Browse the schedules for each event below.' NOT NULL,
	`map_image_url` text DEFAULT '' NOT NULL
);
CREATE TABLE `auth_codes` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`salt` text NOT NULL,
	`code_hash` text NOT NULL,
	`created_at` text NOT NULL,
	`expires_at` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL, `purpose` text DEFAULT 'login' NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `comments` (
	`id` text PRIMARY KEY NOT NULL,
	`author_id` text,
	`parent_id` text,
	`body` text NOT NULL,
	`deleted` integer DEFAULT false NOT NULL,
	`created_time` text NOT NULL,
	`edited_time` text,
	FOREIGN KEY (`author_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`parent_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "comments" VALUES('rYxEBu4N0u8BTbs865Mh3',NULL,NULL,'',1,'2026-08-29T23:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('5UslfxytOvAJTfA0h35DU','QjSYwq0q5Wl5F6SuIzbb5','rYxEBu4N0u8BTbs865Mh3','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T00:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('3wiAyV4k5I6ZydA7hv0lo','v1LWH3w7-LKJl-6gC-n6r','5UslfxytOvAJTfA0h35DU','Perfect, count me in.',0,'2026-08-30T01:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('m6aQZNRyzs366PyRdoC93','7wppeVFZl5b7RQuuEYSbt',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('VcnrXIn-VnMqeLOyzQz_U','7wppeVFZl5b7RQuuEYSbt',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-29T23:39:30.430Z',NULL);
INSERT INTO "comments" VALUES('ofbiLxE87sFc3_rhQoTiJ','_PH-RjjLi9r4grie1eW3g',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:39:30.430Z',NULL);
INSERT INTO "comments" VALUES('OBMFD6mOKZxmvbNcFClQz','3Pu8go-_UUJtIVkmUGi-3',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-29T23:53:30.430Z',NULL);
INSERT INTO "comments" VALUES('bmkTCxCk3qJMfoPyr8c5n','6eHa7YiDL-FaJJSm0Ez7n','OBMFD6mOKZxmvbNcFClQz','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T00:53:30.430Z',NULL);
INSERT INTO "comments" VALUES('41aAkTNkO4Ln3tprOXoMX','3Pu8go-_UUJtIVkmUGi-3',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T00:07:30.430Z',NULL);
INSERT INTO "comments" VALUES('xXVIKv_IpIBmRa3Q0BldL','QjSYwq0q5Wl5F6SuIzbb5',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-29T23:25:30.430Z','2026-08-29T23:29:30.430Z');
INSERT INTO "comments" VALUES('gQNdcfz_hUFhWpN1fcoED','D_KKgOp9oye8dMYNu8rUE','xXVIKv_IpIBmRa3Q0BldL','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T00:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('wwD5OC-yN3EnUj1Sn5bSk','v1LWH3w7-LKJl-6gC-n6r','gQNdcfz_hUFhWpN1fcoED','Perfect, count me in.',0,'2026-08-30T01:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('xIPJEuPKPtNzfYFAmxIs4','7wppeVFZl5b7RQuuEYSbt',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('i7Lt6lc4f8mbke5N34Hr_','v1LWH3w7-LKJl-6gC-n6r',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-29T23:39:30.430Z',NULL);
INSERT INTO "comments" VALUES('sQDpkwYH_4zGoFr2sUQa6','HVXX4b0kZPE2S87I_d8-8',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T00:14:30.430Z',NULL);
INSERT INTO "comments" VALUES('Hnw_KX5eA2lpYhx0qv80A','bcmhGiTYaUrkuiHoDhOlY','sQDpkwYH_4zGoFr2sUQa6','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T01:14:30.430Z',NULL);
INSERT INTO "comments" VALUES('2rEVq6MZNad7ijU6W9Epm','9g0CZRnXO7QGjOEubveKk','Hnw_KX5eA2lpYhx0qv80A','That makes sense, thanks for explaining!',0,'2026-08-30T02:14:30.430Z',NULL);
INSERT INTO "comments" VALUES('ftGmrPR9vxy7eZNPPQoN8','D_KKgOp9oye8dMYNu8rUE',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-29T23:32:30.430Z',NULL);
INSERT INTO "comments" VALUES('q7NnsZk0u8L08YoQZD3Bu','7wppeVFZl5b7RQuuEYSbt','ftGmrPR9vxy7eZNPPQoN8','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T00:32:30.430Z',NULL);
INSERT INTO "comments" VALUES('X5qktkcsx5BFpiR483Peg','_PH-RjjLi9r4grie1eW3g',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T00:00:30.430Z','2026-08-30T00:04:30.430Z');
INSERT INTO "comments" VALUES('_pwpcRLpf2o5V4fkuyuW8','0YSe4489kcFwbDkAXLkP0','X5qktkcsx5BFpiR483Peg','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T01:00:30.430Z',NULL);
INSERT INTO "comments" VALUES('lMv2wzvbt6zwzQHnXr9km','3Pu8go-_UUJtIVkmUGi-3','_pwpcRLpf2o5V4fkuyuW8','That makes sense, thanks for explaining!',0,'2026-08-30T02:00:30.430Z',NULL);
INSERT INTO "comments" VALUES('WZBTJY-5Aw_lwN999Ph82','3Pu8go-_UUJtIVkmUGi-3',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T00:07:30.430Z',NULL);
INSERT INTO "comments" VALUES('1Rw8uNdn5wsSBoAzts7GD','QFCjX9dTA-lh3ykbA1bj9','WZBTJY-5Aw_lwN999Ph82','I''d rather keep them separate, they go in quite different directions.',0,'2026-08-30T01:07:30.430Z',NULL);
INSERT INTO "comments" VALUES('YwUIIISmg7_skexzp7QWr','HVXX4b0kZPE2S87I_d8-8','1Rw8uNdn5wsSBoAzts7GD','Perfect, count me in.',0,'2026-08-30T02:07:30.430Z',NULL);
INSERT INTO "comments" VALUES('-yAtW483c319Sn9R6HQC1','bcmhGiTYaUrkuiHoDhOlY',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T03:07:30.430Z',NULL);
INSERT INTO "comments" VALUES('PpUQ20zKJcj1KVQPtQrED','bcmhGiTYaUrkuiHoDhOlY',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T00:21:30.430Z',NULL);
INSERT INTO "comments" VALUES('wVlgaAmu7OwvDj6BKA2j1','nq1-w7m5KRdP6EM7aGUap',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T00:35:30.430Z','2026-08-30T00:39:30.430Z');
INSERT INTO "comments" VALUES('2bXZ3zu5d5pE_ZADENbuM','nq1-w7m5KRdP6EM7aGUap',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T00:42:30.430Z',NULL);
INSERT INTO "comments" VALUES('6w1PYOIs2tYhIyoSqd0Sg','8MHg-dZjICzw4uMa1DmJ8',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T00:49:30.430Z',NULL);
INSERT INTO "comments" VALUES('zM76DT-BPc0wDBNG3SAkC','Ckbuc6jH9wq5YwCRbj_gd','6w1PYOIs2tYhIyoSqd0Sg','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T01:49:30.430Z',NULL);
INSERT INTO "comments" VALUES('-z9SFuBi4MZEVjuSFDH1J','83A_jeq0VHVMn_8_sXYT5','zM76DT-BPc0wDBNG3SAkC','Perfect, count me in.',0,'2026-08-30T02:49:30.430Z',NULL);
INSERT INTO "comments" VALUES('08C2WE4i-187ZKJWZofDa','fZqYxnoseVCyKIsZHt8CO',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T01:10:30.430Z','2026-08-30T01:14:30.430Z');
INSERT INTO "comments" VALUES('mxLZ2qHXdpph-aBHr9-LG','NC-tL-XUUw3FX9uldEzIL','08C2WE4i-187ZKJWZofDa','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T02:10:30.430Z',NULL);
INSERT INTO "comments" VALUES('_f6Gqf2ort_cp3tflpKiO','cZMLUBfa0F6S6I5EfHRYz',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T04:10:30.430Z',NULL);
INSERT INTO "comments" VALUES('-i1GDETHteHHoAgqGlAyN','cZMLUBfa0F6S6I5EfHRYz',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T01:24:30.430Z',NULL);
INSERT INTO "comments" VALUES('Ml_cHdDRYNWcZIpPfwtdt','9FroXFwPtFCmLcWR5Or3U',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T01:31:30.430Z',NULL);
INSERT INTO "comments" VALUES('Ppv0jbjDot6LIkOEGl3jL','7wppeVFZl5b7RQuuEYSbt',NULL,'Who else is on the panel?',0,'2026-08-30T04:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('d7n6QQcNXmgDVKEw3gfJY','6eHa7YiDL-FaJJSm0Ez7n','Ppv0jbjDot6LIkOEGl3jL','I''d like to join.',0,'2026-08-30T05:25:30.430Z',NULL);
INSERT INTO "comments" VALUES('9SYXYlL0LoXyaXefisgAp','_PH-RjjLi9r4grie1eW3g','Ppv0jbjDot6LIkOEGl3jL','So would I.',0,'2026-08-30T06:25:30.430Z',NULL);
CREATE TABLE `proposal_comments` (
	`comment_id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_comments" VALUES('rYxEBu4N0u8BTbs865Mh3','uKkN7nF36cChUf4h3SAfV');
INSERT INTO "proposal_comments" VALUES('5UslfxytOvAJTfA0h35DU','uKkN7nF36cChUf4h3SAfV');
INSERT INTO "proposal_comments" VALUES('3wiAyV4k5I6ZydA7hv0lo','uKkN7nF36cChUf4h3SAfV');
INSERT INTO "proposal_comments" VALUES('m6aQZNRyzs366PyRdoC93','uKkN7nF36cChUf4h3SAfV');
INSERT INTO "proposal_comments" VALUES('VcnrXIn-VnMqeLOyzQz_U','Es5LmtcfmlDqv318zWYQb');
INSERT INTO "proposal_comments" VALUES('ofbiLxE87sFc3_rhQoTiJ','Es5LmtcfmlDqv318zWYQb');
INSERT INTO "proposal_comments" VALUES('OBMFD6mOKZxmvbNcFClQz','QgEImm_yXX32n4tiJ_DOK');
INSERT INTO "proposal_comments" VALUES('bmkTCxCk3qJMfoPyr8c5n','QgEImm_yXX32n4tiJ_DOK');
INSERT INTO "proposal_comments" VALUES('41aAkTNkO4Ln3tprOXoMX','EqVbTyYNSFCr32DLq7cY-');
INSERT INTO "proposal_comments" VALUES('xXVIKv_IpIBmRa3Q0BldL','NxVBA84y5Vu0ekOdY0RB5');
INSERT INTO "proposal_comments" VALUES('gQNdcfz_hUFhWpN1fcoED','NxVBA84y5Vu0ekOdY0RB5');
INSERT INTO "proposal_comments" VALUES('wwD5OC-yN3EnUj1Sn5bSk','NxVBA84y5Vu0ekOdY0RB5');
INSERT INTO "proposal_comments" VALUES('xIPJEuPKPtNzfYFAmxIs4','NxVBA84y5Vu0ekOdY0RB5');
INSERT INTO "proposal_comments" VALUES('i7Lt6lc4f8mbke5N34Hr_','CgpQDcDFLOupqYvpPLXbt');
INSERT INTO "proposal_comments" VALUES('sQDpkwYH_4zGoFr2sUQa6','BdG9XohDwXo_pCFYiGcjC');
INSERT INTO "proposal_comments" VALUES('Hnw_KX5eA2lpYhx0qv80A','BdG9XohDwXo_pCFYiGcjC');
INSERT INTO "proposal_comments" VALUES('2rEVq6MZNad7ijU6W9Epm','BdG9XohDwXo_pCFYiGcjC');
INSERT INTO "proposal_comments" VALUES('ftGmrPR9vxy7eZNPPQoN8','j1caYlMIZ_35jKZxfy9Z_');
INSERT INTO "proposal_comments" VALUES('q7NnsZk0u8L08YoQZD3Bu','j1caYlMIZ_35jKZxfy9Z_');
INSERT INTO "proposal_comments" VALUES('X5qktkcsx5BFpiR483Peg','8XrT2WvYSlN2PTBb8sYCi');
INSERT INTO "proposal_comments" VALUES('_pwpcRLpf2o5V4fkuyuW8','8XrT2WvYSlN2PTBb8sYCi');
INSERT INTO "proposal_comments" VALUES('lMv2wzvbt6zwzQHnXr9km','8XrT2WvYSlN2PTBb8sYCi');
INSERT INTO "proposal_comments" VALUES('WZBTJY-5Aw_lwN999Ph82','kPA9ReCYTzqVA30iy_ukb');
INSERT INTO "proposal_comments" VALUES('1Rw8uNdn5wsSBoAzts7GD','kPA9ReCYTzqVA30iy_ukb');
INSERT INTO "proposal_comments" VALUES('YwUIIISmg7_skexzp7QWr','kPA9ReCYTzqVA30iy_ukb');
INSERT INTO "proposal_comments" VALUES('-yAtW483c319Sn9R6HQC1','kPA9ReCYTzqVA30iy_ukb');
INSERT INTO "proposal_comments" VALUES('PpUQ20zKJcj1KVQPtQrED','S5GTVBmSZd551jTwDwPmW');
INSERT INTO "proposal_comments" VALUES('wVlgaAmu7OwvDj6BKA2j1','F3zGeyUV6kZtglwIwyx2D');
INSERT INTO "proposal_comments" VALUES('2bXZ3zu5d5pE_ZADENbuM','VClgJ7Z1EQ470p0exGiXI');
INSERT INTO "proposal_comments" VALUES('6w1PYOIs2tYhIyoSqd0Sg','zqBRJPWIPPHHxviN0l12p');
INSERT INTO "proposal_comments" VALUES('zM76DT-BPc0wDBNG3SAkC','zqBRJPWIPPHHxviN0l12p');
INSERT INTO "proposal_comments" VALUES('-z9SFuBi4MZEVjuSFDH1J','zqBRJPWIPPHHxviN0l12p');
INSERT INTO "proposal_comments" VALUES('08C2WE4i-187ZKJWZofDa','gEEzQKfwB0F1VqX8XdsVc');
INSERT INTO "proposal_comments" VALUES('mxLZ2qHXdpph-aBHr9-LG','gEEzQKfwB0F1VqX8XdsVc');
INSERT INTO "proposal_comments" VALUES('_f6Gqf2ort_cp3tflpKiO','gEEzQKfwB0F1VqX8XdsVc');
INSERT INTO "proposal_comments" VALUES('-i1GDETHteHHoAgqGlAyN','FfQbC272xq3c_OMG11pJt');
INSERT INTO "proposal_comments" VALUES('Ml_cHdDRYNWcZIpPfwtdt','qnHohhacgiwgk8Fi8ZUVE');
INSERT INTO "proposal_comments" VALUES('Ppv0jbjDot6LIkOEGl3jL','btzW4kYdULn5zYL4kVHrB');
INSERT INTO "proposal_comments" VALUES('d7n6QQcNXmgDVKEw3gfJY','btzW4kYdULn5zYL4kVHrB');
INSERT INTO "proposal_comments" VALUES('9SYXYlL0LoXyaXefisgAp','btzW4kYdULn5zYL4kVHrB');
CREATE TABLE `comment_likes` (
	`comment_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`created_time` text NOT NULL,
	PRIMARY KEY(`comment_id`, `guest_id`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "comment_likes" VALUES('5UslfxytOvAJTfA0h35DU','v1LWH3w7-LKJl-6gC-n6r','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('3wiAyV4k5I6ZydA7hv0lo','7wppeVFZl5b7RQuuEYSbt','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('3wiAyV4k5I6ZydA7hv0lo','6eHa7YiDL-FaJJSm0Ez7n','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('3wiAyV4k5I6ZydA7hv0lo','_PH-RjjLi9r4grie1eW3g','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('m6aQZNRyzs366PyRdoC93','6eHa7YiDL-FaJJSm0Ez7n','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('m6aQZNRyzs366PyRdoC93','_PH-RjjLi9r4grie1eW3g','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('VcnrXIn-VnMqeLOyzQz_U','_PH-RjjLi9r4grie1eW3g','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('VcnrXIn-VnMqeLOyzQz_U','3Pu8go-_UUJtIVkmUGi-3','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('ofbiLxE87sFc3_rhQoTiJ','3Pu8go-_UUJtIVkmUGi-3','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('ofbiLxE87sFc3_rhQoTiJ','HVXX4b0kZPE2S87I_d8-8','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('ofbiLxE87sFc3_rhQoTiJ','bcmhGiTYaUrkuiHoDhOlY','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('OBMFD6mOKZxmvbNcFClQz','HVXX4b0kZPE2S87I_d8-8','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('bmkTCxCk3qJMfoPyr8c5n','bcmhGiTYaUrkuiHoDhOlY','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('41aAkTNkO4Ln3tprOXoMX','v5tZAbb7YSFl5PJzo21s-','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('41aAkTNkO4Ln3tprOXoMX','9g0CZRnXO7QGjOEubveKk','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('xXVIKv_IpIBmRa3Q0BldL','9g0CZRnXO7QGjOEubveKk','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('wwD5OC-yN3EnUj1Sn5bSk','8MHg-dZjICzw4uMa1DmJ8','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('wwD5OC-yN3EnUj1Sn5bSk','83A_jeq0VHVMn_8_sXYT5','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('wwD5OC-yN3EnUj1Sn5bSk','WmJuQ9CYHC091pooqSZFZ','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('xIPJEuPKPtNzfYFAmxIs4','83A_jeq0VHVMn_8_sXYT5','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('xIPJEuPKPtNzfYFAmxIs4','WmJuQ9CYHC091pooqSZFZ','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('i7Lt6lc4f8mbke5N34Hr_','WmJuQ9CYHC091pooqSZFZ','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('i7Lt6lc4f8mbke5N34Hr_','fZqYxnoseVCyKIsZHt8CO','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('i7Lt6lc4f8mbke5N34Hr_','jB_BrN3R2pe9d9dJmVD-Z','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('sQDpkwYH_4zGoFr2sUQa6','fZqYxnoseVCyKIsZHt8CO','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('sQDpkwYH_4zGoFr2sUQa6','jB_BrN3R2pe9d9dJmVD-Z','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('2rEVq6MZNad7ijU6W9Epm','cZMLUBfa0F6S6I5EfHRYz','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('ftGmrPR9vxy7eZNPPQoN8','9FroXFwPtFCmLcWR5Or3U','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('ftGmrPR9vxy7eZNPPQoN8','0YSe4489kcFwbDkAXLkP0','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('ftGmrPR9vxy7eZNPPQoN8','e82w5UT6LusUDYXvbVNHN','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('q7NnsZk0u8L08YoQZD3Bu','0YSe4489kcFwbDkAXLkP0','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('X5qktkcsx5BFpiR483Peg','e82w5UT6LusUDYXvbVNHN','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('X5qktkcsx5BFpiR483Peg','Q6eo854u23kBy9QQk8N_m','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('X5qktkcsx5BFpiR483Peg','QFCjX9dTA-lh3ykbA1bj9','2026-08-30T08:23:30.430Z');
INSERT INTO "comment_likes" VALUES('_pwpcRLpf2o5V4fkuyuW8','Q6eo854u23kBy9QQk8N_m','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('_pwpcRLpf2o5V4fkuyuW8','QFCjX9dTA-lh3ykbA1bj9','2026-08-30T08:24:30.430Z');
INSERT INTO "comment_likes" VALUES('lMv2wzvbt6zwzQHnXr9km','QFCjX9dTA-lh3ykbA1bj9','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('WZBTJY-5Aw_lwN999Ph82','G8OmLmmELGnP-WhARRWhV','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('1Rw8uNdn5wsSBoAzts7GD','Dn1JfrOPKM3MN_1FblphI','2026-08-30T08:25:30.430Z');
INSERT INTO "comment_likes" VALUES('YwUIIISmg7_skexzp7QWr','RU9nYsEcJzqc_ednIERw_','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('YwUIIISmg7_skexzp7QWr','AihenfK1lc_DtRCbGnZMz','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('YwUIIISmg7_skexzp7QWr','zsNXiSggm-32OG1Nltfh9','2026-08-30T08:23:30.431Z');
INSERT INTO "comment_likes" VALUES('-yAtW483c319Sn9R6HQC1','AihenfK1lc_DtRCbGnZMz','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('-yAtW483c319Sn9R6HQC1','zsNXiSggm-32OG1Nltfh9','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('PpUQ20zKJcj1KVQPtQrED','zsNXiSggm-32OG1Nltfh9','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('PpUQ20zKJcj1KVQPtQrED','tNgPrenwfsyWgXdmhTkJT','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('PpUQ20zKJcj1KVQPtQrED','szr8__xh9YMN2LpGWETIj','2026-08-30T08:23:30.431Z');
INSERT INTO "comment_likes" VALUES('wVlgaAmu7OwvDj6BKA2j1','tNgPrenwfsyWgXdmhTkJT','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('08C2WE4i-187ZKJWZofDa','0SRqfXklt5i26mv0cAGEN','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('mxLZ2qHXdpph-aBHr9-LG','0SRqfXklt5i26mv0cAGEN','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('mxLZ2qHXdpph-aBHr9-LG','Ckbuc6jH9wq5YwCRbj_gd','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('_f6Gqf2ort_cp3tflpKiO','Ckbuc6jH9wq5YwCRbj_gd','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('-i1GDETHteHHoAgqGlAyN','pBNXg_yJ-sQ89E9eCqKrN','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('Ppv0jbjDot6LIkOEGl3jL','PFXj1v5wYnR0J3WGRzfNw','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('Ppv0jbjDot6LIkOEGl3jL','W4iFiQGvwqDY93_6-w66L','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('Ppv0jbjDot6LIkOEGl3jL','QjSYwq0q5Wl5F6SuIzbb5','2026-08-30T08:23:30.431Z');
INSERT INTO "comment_likes" VALUES('d7n6QQcNXmgDVKEw3gfJY','W4iFiQGvwqDY93_6-w66L','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('9SYXYlL0LoXyaXefisgAp','QjSYwq0q5Wl5F6SuIzbb5','2026-08-30T08:25:30.431Z');
INSERT INTO "comment_likes" VALUES('9SYXYlL0LoXyaXefisgAp','D_KKgOp9oye8dMYNu8rUE','2026-08-30T08:24:30.431Z');
INSERT INTO "comment_likes" VALUES('9SYXYlL0LoXyaXefisgAp','v1LWH3w7-LKJl-6gC-n6r','2026-08-30T08:23:30.431Z');
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
CREATE INDEX `proposal_comments_proposal_idx` ON `proposal_comments` (`proposal_id`);
CREATE INDEX `comment_likes_guest_idx` ON `comment_likes` (`guest_id`);
COMMIT;
