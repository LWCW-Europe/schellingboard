-- Seeded database of schellingboard v3.5.0, dumped by
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
INSERT INTO "__drizzle_migrations" VALUES(NULL,'ec198eb263ac5e33d0ab7054a24d6ccc310b3d0d5bba60735d68d00b04d4569b',1787430579703);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'813695efdf60f109d4d3a560091317140020f9d5c9229bbefc9c9bab1df74852',1787509687748);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'62f49b6a25243ffc59663107d341c5c2c353aaabefac81911148d4c383d7468a',1788001821549);
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text, `email_on_rsvp_change` integer DEFAULT true NOT NULL, `email_on_host_change` integer DEFAULT true NOT NULL, `email_on_cohost_add` integer DEFAULT true NOT NULL, `based_in` text, `prompts` text, `languages` text, `contacts` text, `auth_protected` integer DEFAULT false NOT NULL, `password_hash` text, `email_on_proposal_comment` integer DEFAULT true NOT NULL, `email_on_comment_thread` integer DEFAULT false NOT NULL, `profile_updated_at` text, `email_on_session_comment` integer DEFAULT true NOT NULL, `email_on_profile_comment` integer DEFAULT true NOT NULL);
INSERT INTO "guests" VALUES('Tv2KOAulAooc4S7wgmCn7','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/Tv2KOAulAooc4S7wgmCn7.webp?v=1788095808922','She/Her',1,1,1,'Osaka, Japan','[{"prompt":"Ask me about","answer":"Accessible design patterns and Japanese web typography"},{"prompt":"Offering","answer":"Code review swaps and coffee-machine debugging sessions"}]','["Japanese","English"]','[{"type":"website","value":"https://alice-test.example.com"},{"type":"telegram","value":"@alice_frontend"}]',0,NULL,1,0,'2026-08-30T10:16:48.922Z',1,1);
INSERT INTO "guests" VALUES('-hzLWgBt9Ly2PhX24ibPs','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/-hzLWgBt9Ly2PhX24ibPs.webp?v=1788095808923','He/Him',1,1,1,'Lagos, Nigeria','[{"prompt":"Looking for","answer":"Speakers for an inclusive product design meetup back home"},{"prompt":"Offering","answer":"Feedback on your product roadmap over coffee"}]','["English","Yoruba"]','[{"type":"email","value":"bob.organizes@example.com"},{"type":"whatsapp","value":"+234 801 234 5678"}]',0,NULL,1,0,'2026-08-29T15:16:48.923Z',1,1);
INSERT INTO "guests" VALUES('Fnm-Abdz1ehN5EkTIKZIZ','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/Fnm-Abdz1ehN5EkTIKZIZ.webp?v=1788095808923','They/Them',1,1,1,'Guadalajara, Mexico','[{"prompt":"Ask me about","answer":"Stream processing pipelines, or my sourdough starter"},{"prompt":"My weirdest skill","answer":"Naming Kafka topics that still make sense a year later"}]','["Spanish","English"]','[{"type":"discord","value":"charlie.streams"},{"type":"website","value":"https://charlie.dev"}]',0,NULL,1,0,'2026-08-28T20:16:48.923Z',1,1);
INSERT INTO "guests" VALUES('1TSQ9dPD-6927V4F0v5UA','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him',1,1,1,NULL,'[{"prompt":"Ask me about","answer":"Retro handheld consoles"}]',NULL,NULL,0,NULL,1,0,'2026-08-28T01:16:48.923Z',1,1);
INSERT INTO "guests" VALUES('0kmFtICfDcAglqxTgHR65','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL,1,1);
INSERT INTO "guests" VALUES('09XNxNLF6W96uMTofi3E0','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her',1,1,1,NULL,NULL,NULL,NULL,1,'scrypt$SMcDy0WKi1tyxm9MmkWs0A==$IeAA7fuqdnHoZryWwUcViSA67ZPFLXb2znnwsWjI78I=',1,0,'2026-08-26T11:16:48.956Z',1,1);
INSERT INTO "guests" VALUES('TBRGH7ZXR4hw5a-ywGIPO','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/TBRGH7ZXR4hw5a-ywGIPO.webp?v=1788095808923',NULL,1,1,1,'Shanghai, China','[{"prompt":"Ask me about","answer":"Build caching strategies that hold up under real CI load"}]','["Mandarin Chinese","English"]','[{"type":"telegram","value":"@weichen_dev"}]',1,'scrypt$Sn+JVcsTW19tmhuHECOpKw==$OOCRzjH/SK/DOiJn4YhN1rVxtoxuvkahBvSZGiL+lXo=',1,0,'2026-08-25T16:16:48.970Z',1,1);
INSERT INTO "guests" VALUES('hbl72kbmidfWZQjJ27Jd8','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/hbl72kbmidfWZQjJ27Jd8.webp?v=1788095808923','She/Her',1,1,1,'Bengaluru, India','[{"prompt":"Ask me about","answer":"Fairness metrics for recommender systems"},{"prompt":"Looking for","answer":"A conference buddy — this is my first time here!"}]','["Hindi","Kannada","English"]','[{"type":"website","value":"https://priyasharma.example.com"}]',0,NULL,1,0,'2026-08-24T21:16:48.923Z',1,1);
INSERT INTO "guests" VALUES('xviuahijPP7FbbWYhKuBJ','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/xviuahijPP7FbbWYhKuBJ.webp?v=1788095808923','He/Him',1,1,1,'Gothenburg, Sweden','[{"prompt":"Offering","answer":"Strong opinions about Rust, mild opinions about saunas"}]','["Swedish","English"]','[{"type":"signal","value":"lars.eriksson.99"}]',1,'scrypt$7fxNpahE7+5t2TPTAKKZPw==$cf8xYXaN7LG3e4dhH+rl15DVsoO+dPm4vPrhUgNYOMM=',1,0,'2026-08-24T02:16:48.961Z',1,1);
INSERT INTO "guests" VALUES('w7JdJDr5DDwEqnll6-W_E','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/w7JdJDr5DDwEqnll6-W_E.webp?v=1788095808923',NULL,1,1,1,'Muscat, Oman','[{"prompt":"Ask me about","answer":"Threat modeling for teams too small to have a security hire"}]','["Arabic","English"]','[{"type":"email","value":"fatima.breaks.things@example.com"}]',1,'scrypt$PgunNwL/cVKBbqvSG2ZpHw==$MEY55ARBYrREWcA99083Zry387rpazp8B34rrGUoGU8=',1,0,'2026-08-23T07:16:48.954Z',1,1);
INSERT INTO "guests" VALUES('HaUr-XMbez7ccCJO6DFe8','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/HaUr-XMbez7ccCJO6DFe8.webp?v=1788095808923','He/Him',1,1,1,'Accra, Ghana','[{"prompt":"Offering","answer":"War stories about building for 2G networks"}]','["Twi","English"]','[{"type":"whatsapp","value":"+233 24 555 0187"}]',1,'scrypt$ELo8R+YiebRicQIIKuoYwQ==$wuS6uMFAN7Jz/c0tNcKayd9qcTz2hloIm3xdTfbZ5rU=',1,0,'2026-08-22T12:16:48.982Z',1,1);
INSERT INTO "guests" VALUES('NAr9AK8oCXDTlilPDLP_m','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/NAr9AK8oCXDTlilPDLP_m.webp?v=1788095808923',NULL,1,1,1,'Yokohama, Japan','[{"prompt":"My weirdest skill","answer":"Debugging a blinking LED by ear"}]','["Japanese"]',NULL,1,'scrypt$pQqYxyQZ9Z3zmHcHFaE7pw==$VxtpCxmJ81bRhW4YMrDv/y9Mk+kWHFNe2fFrEW3djHk=',1,0,'2026-08-21T17:16:48.987Z',1,1);
INSERT INTO "guests" VALUES('vmSOueGekeVkyJjQSrzT4','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/vmSOueGekeVkyJjQSrzT4.webp?v=1788095808924','She/Her',1,1,1,'Berlin, Germany','[{"prompt":"Ask me about","answer":"Research ethics for multilingual user studies"}]','["French","Wolof","English","German"]','[{"type":"website","value":"https://aishadiallo.example.com"},{"type":"other","label":"Mastodon","value":"@aisha@ux.social"}]',1,'scrypt$kBsCARvQJrGMVAYSyWCeTA==$oDZ3PkZqqcID+IENbtVg7RjdghDtyYwU0H9HgdrVbxE=',1,0,'2026-08-20T22:16:48.989Z',1,1);
INSERT INTO "guests" VALUES('QsZDe1kfpP9ZZp5tnJ84s','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/QsZDe1kfpP9ZZp5tnJ84s.webp?v=1788095808924',NULL,1,1,1,'Buenos Aires, Argentina','[{"prompt":"Offering","answer":"A rundown of the worst incident I ever caused, for entertainment purposes"}]','["Spanish","English"]','[{"type":"telegram","value":"@diego_sre"}]',1,'scrypt$9uCrdirBLJIcp7DI2jxzBQ==$TiYtd4TC0ex25UzfJL+WJTZwLtHa7nvHKPtEu+h0Kg0=',1,0,'2026-08-20T03:16:49.005Z',1,1);
INSERT INTO "guests" VALUES('B5125stOsb8vn8HGBEtw0','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/B5125stOsb8vn8HGBEtw0.webp?v=1788095808924','She/Her',1,1,1,'Taipei, Taiwan','[{"prompt":"Ask me about","answer":"Turning a wall of Slack threads into docs people read"}]','["Mandarin Chinese","English"]',NULL,1,'scrypt$QClHMCZZrSGLB6J/GkcFYQ==$2kmCzqzUA3TD6eVNJQQA3MRhCc9VrYg/gzZxeSPqwa0=',1,0,'2026-08-19T08:16:49.012Z',1,1);
INSERT INTO "guests" VALUES('qDfilKr-_aFNQiGR7nPFy','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/qDfilKr-_aFNQiGR7nPFy.webp?v=1788095808924',NULL,1,1,1,'Novosibirsk, Russia','[{"prompt":"Offering","answer":"A very detailed opinion about your slow query, whether you want it or not"}]','["Russian","English"]','[{"type":"email","value":"olga.petrova.db@example.com"}]',1,'scrypt$AceUsRnMkLNm2AZ4PFjpxg==$4r/XQc5mjK1S/5HaQ6Phwitv49K0P8lirr9nc5yxOSk=',1,0,'2026-08-18T13:16:49.015Z',1,1);
INSERT INTO "guests" VALUES('AWd3Xn3wBU7_TdfKAbXbC','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/AWd3Xn3wBU7_TdfKAbXbC.webp?v=1788095808924','He/Him',1,1,1,'Lyon, France','[{"prompt":"Looking for","answer":"Cheese recommendations near the venue"}]','["French","English"]','[{"type":"whatsapp","value":"+33 6 12 34 56 78"}]',0,NULL,1,0,'2026-08-17T18:16:48.924Z',1,1);
INSERT INTO "guests" VALUES('I96Xr6Zdn2Vv-li7DY2fV','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/I96Xr6Zdn2Vv-li7DY2fV.webp?v=1788095808924',NULL,1,1,1,'Johannesburg, South Africa','[{"prompt":"Ask me about","answer":"Building civic tech that survives contact with real government data"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-16T23:16:48.924Z',1,1);
INSERT INTO "guests" VALUES('uHy3QVPE1vUe5ivWh7C6_','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/uHy3QVPE1vUe5ivWh7C6_.webp?v=1788095808924','She/Her',1,1,1,'Kraków, Poland','[{"prompt":"Offering","answer":"Trades: I''ll find your worst bug for a board game recommendation"}]','["Polish","English"]','[{"type":"discord","value":"anna.qa"}]',0,NULL,1,0,'2026-08-16T04:16:48.924Z',1,1);
INSERT INTO "guests" VALUES('sKAansNfnpR008lhmHKQe','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/sKAansNfnpR008lhmHKQe.webp?v=1788095808924',NULL,1,1,1,'Cairo, Egypt','[{"prompt":"A hill I will die on","answer":"Boring architecture beats clever architecture, every time"}]','["Arabic","English"]',NULL,0,NULL,1,0,'2026-08-15T09:16:48.924Z',1,1);
INSERT INTO "guests" VALUES('cTi6oXuNbhyiYwiTPSpA6','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/cTi6oXuNbhyiYwiTPSpA6.webp?v=1788095808925','She/Her',1,1,1,'Milan, Italy','[{"prompt":"Ask me about","answer":"Getting design tokens to survive contact with production"}]','["English","French"]','[{"type":"website","value":"https://isabellarossi.example.com"}]',0,NULL,1,0,'2026-08-14T14:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('LydZG3AsWh7pTgAaPQHQS','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/LydZG3AsWh7pTgAaPQHQS.webp?v=1788095808925','They/Them',1,1,1,'Seoul, South Korea','[{"prompt":"Currently obsessed with","answer":"CRDTs, and why conflict-free replication is harder than it sounds"}]','["Korean","English"]','[{"type":"discord","value":"minjunkim"}]',0,NULL,1,0,'2026-08-13T19:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('etUL1rohSL1qIk_q3yI6i','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/etUL1rohSL1qIk_q3yI6i.webp?v=1788095808925',NULL,1,1,1,'Porto, Portugal','[{"prompt":"Offering","answer":"A talk about automating yourself out of a job, repeatedly"}]','["Portuguese","English"]',NULL,0,NULL,1,0,'2026-08-13T00:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('QBWUzhQrfO8xsv-RRGXrU','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her',1,1,1,'Beirut, Lebanon','[{"prompt":"Looking for","answer":"Mentors and mentees for a women-in-tech circle back home"}]','["Arabic","French","English"]','[{"type":"other","label":"Instagram","value":"@nadia.builds"}]',0,NULL,1,0,'2026-08-12T05:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('r-ws6d4dMfhGZxoCq-Ro3','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL,1,1,1,'Copenhagen, Denmark','[{"prompt":"Offering","answer":"A free accessibility pass on your slides — bring your laptop"}]','["Danish","English"]','[{"type":"email","value":"freya.a11y@example.com"}]',0,NULL,1,0,'2026-08-11T10:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('54AZ3c-17tbIATgggOOUN','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him',1,1,1,'Kochi, India','[{"prompt":"Currently obsessed with","answer":"Consensus protocols, and where filter coffee ranks among them"}]','["Malayalam","English"]',NULL,0,NULL,1,0,'2026-08-10T15:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('CsN56WI96MWzVdtK5ndCB','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL,1,1,1,'Istanbul, Turkey','[{"prompt":"Looking for","answer":"Session recommendations — I''m new here and excited about everything"}]','["Turkish","English"]',NULL,0,NULL,1,0,'2026-08-09T20:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('8gZclqE7cUhZ_rT-DVVZn','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL,1,1,1,'Ibadan, Nigeria',NULL,'["Yoruba","English"]',NULL,0,NULL,1,0,'2026-08-09T01:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('q4ko_ePN19-cW_e_L3bEX','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them',1,1,1,'Ho Chi Minh City, Vietnam','[{"prompt":"Offering","answer":"Static site generator recommendations, unsolicited and opinionated"}]','["Vietnamese","English"]','[{"type":"telegram","value":"@linh_jamstack"}]',0,NULL,1,0,'2026-08-08T06:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('XpP_IWzTZJc7bhuIXZWu-','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL,1,1,1,'Zagreb, Croatia','[{"prompt":"A hill I will die on","answer":"Estimates are a communication tool, not a promise"}]','["Croatian","English"]',NULL,0,NULL,1,0,'2026-08-07T11:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('7sjDl7aU6CXZYxNdkF7k1','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL,1,1,1,NULL,'[{"prompt":"My weirdest skill","answer":"Reading language specs for fun, apparently"}]',NULL,NULL,0,NULL,1,0,'2026-08-06T16:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('qO_V6CeV79jh7QhQJHf6O','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her',1,1,1,'Bologna, Italy','[{"prompt":"Ask me about","answer":"Making public health research reproducible without a data team"}]',NULL,'[{"type":"website","value":"https://chiarabianchi.example.com"}]',0,NULL,1,0,'2026-08-05T21:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('sOuRdIQVeRwPfFWFyXo48','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL,1,1,1,'Durban, South Africa','[{"prompt":"Offering","answer":"Container query wizardry, upon request"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-05T02:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('gz9KK1_5R_ETIpVa47El3','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL,1,1,1,'São Paulo, Brazil','[{"prompt":"Offering","answer":"Mentoring conversations for junior devs finding their footing"}]','["Portuguese","English"]','[{"type":"website","value":"https://rafaelsouza.example.com"}]',0,NULL,1,0,'2026-08-04T07:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('1ULJ5jPsAcysGk3nNR_Ki','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.','/media/avatars/1ULJ5jPsAcysGk3nNR_Ki.webp?v=1788095808925','She/Her',1,1,1,'Kyoto, Japan','[{"prompt":"I collect","answer":"Conference stickers, competitively"}]','["Japanese","English"]','[{"type":"website","value":"https://hanakobayashi.example.com"},{"type":"other","label":"Bluesky","value":"@hanak.dev"}]',0,NULL,1,0,'2026-08-03T12:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('0zT3gFfzRtEcwMgJl6VqQ','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL,1,1,1,'Prague, Czechia','[{"prompt":"Ask me about","answer":"Sustainable maintainership for projects that outlive their funding"}]','["Czech","English"]','[{"type":"website","value":"https://github.example.com/tereza"}]',0,NULL,1,0,'2026-08-02T17:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('i_qdUdPhSK8wvaON8JFLu','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him',1,1,1,'Amsterdam, Netherlands','[{"prompt":"Currently obsessed with","answer":"Developer tooling, and slowly learning Dutch"}]','["Persian","Dutch","English"]',NULL,0,NULL,1,0,'2026-08-01T22:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('3bK5FPaFVSBvfX64pDifB','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL,1,1,1,'Thessaloniki, Greece','[{"prompt":"Offering","answer":"Loosely held opinions on everything except testing"}]','["Greek","English"]',NULL,0,NULL,1,0,'2026-08-01T03:16:48.925Z',1,1);
INSERT INTO "guests" VALUES('3rPjbZGQYhwqJ45QrVe5y','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL,1,1);
INSERT INTO "guests" VALUES('EfoGRZZtR6wq-_VrHW2GE','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They',1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,'2026-07-30T13:16:48.925Z',1,1);
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
INSERT INTO "days" VALUES('6LH88stZWQ6jgqxsFR1qg','2026-10-11T07:00:00.000Z','2026-10-11T16:00:00.000Z','2026-10-11T07:00:00.000Z','2026-10-11T15:30:00.000Z','rurqF9N1od2Wd09yXZkQW');
INSERT INTO "days" VALUES('-Vsylu0oFwmOGD0hyR7f_','2026-10-12T07:00:00.000Z','2026-10-12T16:00:00.000Z','2026-10-12T07:00:00.000Z','2026-10-12T15:30:00.000Z','rurqF9N1od2Wd09yXZkQW');
INSERT INTO "days" VALUES('TK8PyFkIuRMir_3ixiEa4','2026-10-13T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-10-13T07:00:00.000Z','2026-10-13T15:30:00.000Z','rurqF9N1od2Wd09yXZkQW');
INSERT INTO "days" VALUES('KNUgZPU7xa73B1KJ0Fd-H','2026-09-27T07:00:00.000Z','2026-09-27T16:00:00.000Z','2026-09-27T07:00:00.000Z','2026-09-27T15:30:00.000Z','WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "days" VALUES('UoUfNNPwMNhpS2CLiLtrq','2026-09-28T07:00:00.000Z','2026-09-28T16:00:00.000Z','2026-09-28T07:00:00.000Z','2026-09-28T15:30:00.000Z','WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "days" VALUES('mcrhchujHUOzVs-ow36Uf','2026-09-29T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-09-29T07:00:00.000Z','2026-09-29T15:30:00.000Z','WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "days" VALUES('QQNvEMgJ3YRahMp8QEM29','2026-09-13T07:00:00.000Z','2026-09-13T16:00:00.000Z','2026-09-13T07:00:00.000Z','2026-09-13T15:30:00.000Z','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "days" VALUES('Fw2yKfNEtXvLIqXx6o4wb','2026-09-14T07:00:00.000Z','2026-09-14T16:00:00.000Z','2026-09-14T07:00:00.000Z','2026-09-14T15:30:00.000Z','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "days" VALUES('M8pxpbharlx3GjUI6AN3d','2026-09-15T07:00:00.000Z','2026-09-16T01:00:00.000Z','2026-09-15T07:00:00.000Z','2026-09-16T00:30:00.000Z','SPIvtmHDpU3ykAhQaMeUE');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','0kmFtICfDcAglqxTgHR65');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','09XNxNLF6W96uMTofi3E0');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','B5125stOsb8vn8HGBEtw0');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','sKAansNfnpR008lhmHKQe');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','54AZ3c-17tbIATgggOOUN');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','qO_V6CeV79jh7QhQJHf6O');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "event_guests" VALUES('rurqF9N1od2Wd09yXZkQW','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','0kmFtICfDcAglqxTgHR65');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','09XNxNLF6W96uMTofi3E0');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','B5125stOsb8vn8HGBEtw0');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','sKAansNfnpR008lhmHKQe');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','54AZ3c-17tbIATgggOOUN');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','qO_V6CeV79jh7QhQJHf6O');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "event_guests" VALUES('WyUIuRcdwdCVAfpOpffgo','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','0kmFtICfDcAglqxTgHR65');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','09XNxNLF6W96uMTofi3E0');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','B5125stOsb8vn8HGBEtw0');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','sKAansNfnpR008lhmHKQe');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','54AZ3c-17tbIATgggOOUN');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','qO_V6CeV79jh7QhQJHf6O');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "event_guests" VALUES('SPIvtmHDpU3ykAhQaMeUE','EfoGRZZtR6wq-_VrHW2GE');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-main-hall');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-room-a');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-room-b');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-library');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-boardroom');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-auditorium');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-courtyard');
INSERT INTO "event_locations" VALUES('rurqF9N1od2Wd09yXZkQW','loc-rooftop');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-main-hall');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-room-a');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-room-b');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-library');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-boardroom');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-auditorium');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-courtyard');
INSERT INTO "event_locations" VALUES('WyUIuRcdwdCVAfpOpffgo','loc-rooftop');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-main-hall');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-room-a');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-room-b');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-library');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-boardroom');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-auditorium');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-courtyard');
INSERT INTO "event_locations" VALUES('SPIvtmHDpU3ykAhQaMeUE','loc-rooftop');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('3I_bGuv_dGkXUstoS8rHv','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "proposal_hosts" VALUES('rd3zSc5iNgBfSgF40jBtj','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('2fcXv0xFOa9BuI_NdDlCV','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "proposal_hosts" VALUES('pBawn_8oZeWFMfPLs4AvR','0kmFtICfDcAglqxTgHR65');
INSERT INTO "proposal_hosts" VALUES('pBawn_8oZeWFMfPLs4AvR','09XNxNLF6W96uMTofi3E0');
INSERT INTO "proposal_hosts" VALUES('eglRtd1pQEn-tSSljAi0m','09XNxNLF6W96uMTofi3E0');
INSERT INTO "proposal_hosts" VALUES('eglRtd1pQEn-tSSljAi0m','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "proposal_hosts" VALUES('UFk-LHGIFj3GHqiSexhfx','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "proposal_hosts" VALUES('JVZqHhmeyaFjV70BHM104','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "proposal_hosts" VALUES('HNwEhSXZckwiuS7OW-Std','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "proposal_hosts" VALUES('aiYpmT1KdhQbMwXEph8Q7','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('quMzDV8BwAl7uNcaWlrbr','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "proposal_hosts" VALUES('bQ5DxjfWMwwpsO2ufDhpD','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('Q3beKjganPauknuCiuK9s','0kmFtICfDcAglqxTgHR65');
INSERT INTO "proposal_hosts" VALUES('Q3beKjganPauknuCiuK9s','09XNxNLF6W96uMTofi3E0');
INSERT INTO "proposal_hosts" VALUES('AagV5vh22Jk_gCHOIyffU','09XNxNLF6W96uMTofi3E0');
INSERT INTO "proposal_hosts" VALUES('sJv9YSB1py_pIdbX4tPAd','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "proposal_hosts" VALUES('mBbdBZ-DfYN4KQJjPzACA','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "proposal_hosts" VALUES('Il_HSgpol8ZKlKLclekZK','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "proposal_hosts" VALUES('Il_HSgpol8ZKlKLclekZK','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "proposal_hosts" VALUES('5Z004by81Tp5SegWP3YTb','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "proposal_hosts" VALUES('_a9SMxFxUuVGzdYM17QEH','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "proposal_hosts" VALUES('gc7Ejaaw0b5ZZhTVJk5Zf','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('NfIGH1_UYSmRoQqgMn97U','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "proposal_hosts" VALUES('jUhSb7URFvAiJ0NRidt50','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('9wsdCKBvbC-p-ru8aVNZD','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "proposal_hosts" VALUES('DRFgpDGa5DtxyYK1nDRJ_','0kmFtICfDcAglqxTgHR65');
INSERT INTO "proposal_hosts" VALUES('f20B9bKK3F3mTkd5N5r1C','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "proposal_hosts" VALUES('hDAQ8kSxFgap3ceyt-Igj','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "proposal_hosts" VALUES('ktz3QVsszOB-xxgHKYkeU','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "proposal_hosts" VALUES('trH9gKWGp-IwZFjo3_PLi','09XNxNLF6W96uMTofi3E0');
INSERT INTO "proposal_hosts" VALUES('yN1BzNfXfVRHJiEQLSe7O','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "proposal_hosts" VALUES('a_MvV7vhAs5yTTBaNcbfU','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "proposal_hosts" VALUES('gD2VsVURdrb-jzLIMS56s','54AZ3c-17tbIATgggOOUN');
INSERT INTO "proposal_hosts" VALUES('uZ5CnIgG9thpBvI3Ppk_j','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "proposal_hosts" VALUES('gAAT18AMLo72CgsS9k8cF','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "proposal_hosts" VALUES('ymgAKfimjdaNlyjFAy_SJ','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "proposal_hosts" VALUES('7IgRPZEmXBUltUkUpM6e8','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "proposal_hosts" VALUES('2E-EQ8vHLpVnvu3JQan_Q','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "proposal_hosts" VALUES('yj0-Vt5YnpHCV0PxfysGj','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "proposal_hosts" VALUES('yj0-Vt5YnpHCV0PxfysGj','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "proposal_hosts" VALUES('qCscSIMYLbg9Ab5uP9cP3','sKAansNfnpR008lhmHKQe');
INSERT INTO "proposal_hosts" VALUES('1PRyfHp0P6n4Va97b-06K','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "proposal_hosts" VALUES('QurDeTrWBESvmlvSuFHAy','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "proposal_hosts" VALUES('FU9j5lT4h2d1O1Xe4QZg7','w7JdJDr5DDwEqnll6-W_E');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('dRIxmOqjGHG_jMjQpfvmG','l6M1UsHOFbEF9Vti-fthG','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('cnEgOOQ5QrWwXnYoLowC7','LRnSaYz82pGkaH012ZehH','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('1yYFhzaVir8mjBFyWZfsp','zUPQ4SkS_fTJqFmxB7YnZ','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('22lEeYLv6WxbrDYMCg5Qa','KbnDIXI4N2NwwfgheyeK5','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('qEsP8FBH2Gd8WQaOwJSME','8zRpwyfxS7enUV1MqCyAM','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('dnApkwItVyRHY7HTmLCmH','pcpdZHmrXsR7aO7ms3KjK','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "rsvps" VALUES('gwbTwj7lbJOIig6dAg6WE','IRbc1ns2R5g7QoG0TaD23','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "rsvps" VALUES('qE4EiLCQ-Qqi9rxxZrCt6','NI3h188puPNNDQTjs4OtY','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "rsvps" VALUES('2h9BhSgrxweVC32g4DWcz','IxDXE9YOcdGKJh_l5PCK3','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "rsvps" VALUES('hSskbbkeiI2LJsjYjmVmg','isibXs4qXleW0LdmNG1HU','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "rsvps" VALUES('iEcQHRO0K4PL-GrdnIWe2','LRnSaYz82pGkaH012ZehH','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "rsvps" VALUES('NPtW8xtcKBlQnbKOqQLpg','zUPQ4SkS_fTJqFmxB7YnZ','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "rsvps" VALUES('idGar63YZTnBNPQesE4d0','EYFAm7I_ek2BGYp6tmNC4','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "rsvps" VALUES('oBZbGso2uQe4bChtqATmD','KbnDIXI4N2NwwfgheyeK5','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "rsvps" VALUES('Bx-UonJnD4Sl7Sso6l-js','EKu8Ds3ZLe4U7GWMSdlRC','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "rsvps" VALUES('sj1BRUgbfiRdnkZMU1Bun','IxDXE9YOcdGKJh_l5PCK3','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "rsvps" VALUES('QNMiMoZbyW8yUuLnwozCQ','isibXs4qXleW0LdmNG1HU','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "rsvps" VALUES('YBSMI9X8dxLXy9LlvVB39','KbnDIXI4N2NwwfgheyeK5','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "rsvps" VALUES('6Sz9qUK-BDTeYEtgOIPiQ','PW0s6NT-bd4ibiwkYY6ux','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "rsvps" VALUES('lNHhHIwnf4OOxU5zn_Q6-','EKu8Ds3ZLe4U7GWMSdlRC','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "rsvps" VALUES('HIuFTDQpGL78K1PwLB3ZM','l6M1UsHOFbEF9Vti-fthG','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('yWCkIB_o0BGFTiXQA6M5H','NI3h188puPNNDQTjs4OtY','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('bcsdBF1SKTU-d_0d024pa','d4fzTDyZS1e7EpMUkuULF','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('G5xmpcnUhOA-f9sD3Nozd','EYFAm7I_ek2BGYp6tmNC4','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('Cz12ntujGp2VAGVfiOgBX','FF4zMBn3uP5oGVEUz0A-a','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('5M90gPvomuQyTjsv60Ito','8zRpwyfxS7enUV1MqCyAM','0kmFtICfDcAglqxTgHR65');
INSERT INTO "rsvps" VALUES('ZS18O6687Q1IYsIU4apu9','NI3h188puPNNDQTjs4OtY','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('XQYzh_Q-Df5VeMlKHYzRH','hShLkFGe2JUkH_0QbA5gw','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('UXe2FAOUPO_hrwYsRrgfj','EYFAm7I_ek2BGYp6tmNC4','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('kOeKFtk8AuYPysqIIobDn','KbnDIXI4N2NwwfgheyeK5','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('2VfM2mFQbFv3yXhf9CIz5','PW0s6NT-bd4ibiwkYY6ux','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('O6V6o3w6sUcXLY0DgVbAP','3tsAtbnmMWSWXWGqrJraY','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('t5RnvAjAWiICEC5EYv2Jm','8zRpwyfxS7enUV1MqCyAM','09XNxNLF6W96uMTofi3E0');
INSERT INTO "rsvps" VALUES('wa-ho7Ia_1WmjUA322KFC','_9u5smhAk59NDynbcuz7s','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('PIHUreifNimZSKqcDz8-v','zUPQ4SkS_fTJqFmxB7YnZ','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('Jbk5P6xr3lIyIox3IzvG4','NI3h188puPNNDQTjs4OtY','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('ritQQ8dRi4gFCfCdXsYYx','EYFAm7I_ek2BGYp6tmNC4','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('awciQYeb2QIwlBdlEBX29','KbnDIXI4N2NwwfgheyeK5','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('MFftelWbEjv86jjJ9JidV','pcpdZHmrXsR7aO7ms3KjK','TBRGH7ZXR4hw5a-ywGIPO');
INSERT INTO "rsvps" VALUES('gpFJU2EkcOj1kZk8dtwG8','LRnSaYz82pGkaH012ZehH','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "rsvps" VALUES('hl2ZBiJ1sPNOjBv4apIeh','IRbc1ns2R5g7QoG0TaD23','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "rsvps" VALUES('LJv-nG5WUriDKagI4OW8E','IxDXE9YOcdGKJh_l5PCK3','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "rsvps" VALUES('bfmj_9geltv9hD3AclCDy','PW0s6NT-bd4ibiwkYY6ux','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "rsvps" VALUES('7nJUKAg91IFawjpjxtD9w','EKu8Ds3ZLe4U7GWMSdlRC','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "rsvps" VALUES('E7mlBKo20A3L_Q5IkBCAr','_9u5smhAk59NDynbcuz7s','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('M8HPIwVvKMS1W9HI-OhZ4','IRbc1ns2R5g7QoG0TaD23','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('OqJk49-LWyuUP7poeDJu6','hShLkFGe2JUkH_0QbA5gw','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('JL__Cxy-nza-WWsGw-OHu','KbnDIXI4N2NwwfgheyeK5','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('gW90wOoxj0X8CiKAzUchw','PW0s6NT-bd4ibiwkYY6ux','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('34L_J3C8-1cfM4ilDLMkG','EKu8Ds3ZLe4U7GWMSdlRC','xviuahijPP7FbbWYhKuBJ');
INSERT INTO "rsvps" VALUES('uurp9V8GqB-EXTqGLS-Dm','l6M1UsHOFbEF9Vti-fthG','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "rsvps" VALUES('mz1kZujch5ENDTDImYT8L','NI3h188puPNNDQTjs4OtY','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "rsvps" VALUES('gh2Zk5WzLqByBxZXlGwZr','EYFAm7I_ek2BGYp6tmNC4','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "rsvps" VALUES('Kk0OrdFCgyUA2ap5iBECe','3tsAtbnmMWSWXWGqrJraY','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "rsvps" VALUES('qrLsTXu52Mr74bhZv35cH','_9u5smhAk59NDynbcuz7s','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "rsvps" VALUES('Ep148VVnal-gYxNAZL8cI','zUPQ4SkS_fTJqFmxB7YnZ','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "rsvps" VALUES('BGAedxM5dnzOpZ2U0KmaB','isibXs4qXleW0LdmNG1HU','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "rsvps" VALUES('gFjHvVGE2c-iqZgAGDbUp','pcpdZHmrXsR7aO7ms3KjK','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "rsvps" VALUES('gu3U-EpYX76weW19kk4rJ','LRnSaYz82pGkaH012ZehH','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('X119VMiWxZk2SeIgjvCM6','zUPQ4SkS_fTJqFmxB7YnZ','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('dPku1AWOpSHN9WAVdc0Eo','hShLkFGe2JUkH_0QbA5gw','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('cdgP36oR4-qVT3JRZYkVo','EYFAm7I_ek2BGYp6tmNC4','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('c30uGS5rd5Mpn3DwJ_2z8','FF4zMBn3uP5oGVEUz0A-a','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('W9TisWuykK88OtZwVG3Je','EKu8Ds3ZLe4U7GWMSdlRC','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('PjkFyPt6mvumc2H82LOOL','pcpdZHmrXsR7aO7ms3KjK','NAr9AK8oCXDTlilPDLP_m');
INSERT INTO "rsvps" VALUES('kfPUfGRqV6gtZJ5YQcOO-','zUPQ4SkS_fTJqFmxB7YnZ','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "rsvps" VALUES('ncup3dcy4PLlFXwZl6Lq8','d4fzTDyZS1e7EpMUkuULF','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "rsvps" VALUES('c3hEiw11Wp4TkWzDGmSri','isibXs4qXleW0LdmNG1HU','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "rsvps" VALUES('WnC-RzoYqMUElfIz-HgAL','PW0s6NT-bd4ibiwkYY6ux','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "rsvps" VALUES('MDeolXbMLhiTJAk6gbCqQ','3tsAtbnmMWSWXWGqrJraY','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "rsvps" VALUES('jF8N7eeXe74kL66_xLs4O','l6M1UsHOFbEF9Vti-fthG','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "rsvps" VALUES('iYX0LBOLX_U14eS2e7IN0','LRnSaYz82pGkaH012ZehH','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "rsvps" VALUES('W-aMoXxcuiUlz47OKRx8e','8zRpwyfxS7enUV1MqCyAM','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "rsvps" VALUES('kiacMWWyDCCSO-mMECTxS','PW0s6NT-bd4ibiwkYY6ux','B5125stOsb8vn8HGBEtw0');
INSERT INTO "rsvps" VALUES('nJOray5fOtfe0eg1SMbMY','EKu8Ds3ZLe4U7GWMSdlRC','B5125stOsb8vn8HGBEtw0');
INSERT INTO "rsvps" VALUES('en4sYPLktjW6sL5N6-Iey','pcpdZHmrXsR7aO7ms3KjK','B5125stOsb8vn8HGBEtw0');
INSERT INTO "rsvps" VALUES('ET3PWmuWADjZgb7DGMjdc','_9u5smhAk59NDynbcuz7s','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "rsvps" VALUES('trGkuxaoJ5x1nLx3wmouO','d4fzTDyZS1e7EpMUkuULF','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "rsvps" VALUES('jD7AMpqyJ_BgecIYerfxE','EYFAm7I_ek2BGYp6tmNC4','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "rsvps" VALUES('L06ZPSeEFC5x_YQQT9hu5','KbnDIXI4N2NwwfgheyeK5','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "rsvps" VALUES('1pxF9hg2VY59L6Mmc61re','l6M1UsHOFbEF9Vti-fthG','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "rsvps" VALUES('b8IxK1POi7BrJ3Zj32MC6','EYFAm7I_ek2BGYp6tmNC4','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "rsvps" VALUES('Zb7r2FaaYLBe_wdBlKbdd','KbnDIXI4N2NwwfgheyeK5','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "rsvps" VALUES('fFy8iHAMfRUCok6FJqAmA','EKu8Ds3ZLe4U7GWMSdlRC','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "rsvps" VALUES('gZa_lxMNDz7BfQQVLHSyR','8zRpwyfxS7enUV1MqCyAM','AWd3Xn3wBU7_TdfKAbXbC');
INSERT INTO "rsvps" VALUES('QAbvOj7BK59vE-cu1Mkbt','_9u5smhAk59NDynbcuz7s','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('lpguHJOSWcgYH0IJYyUK5','IRbc1ns2R5g7QoG0TaD23','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('J7uVKzn_2rBqVZMMT0IAD','IxDXE9YOcdGKJh_l5PCK3','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('3c48EdMk4NHmJyxzvJuD8','FF4zMBn3uP5oGVEUz0A-a','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('mVwMmMoPls7u5YbwexSGs','3tsAtbnmMWSWXWGqrJraY','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('uHNEsn8LSvD8uEOaKIZM8','pcpdZHmrXsR7aO7ms3KjK','I96Xr6Zdn2Vv-li7DY2fV');
INSERT INTO "rsvps" VALUES('dkhphFUoDkJzLody3qUTi','l6M1UsHOFbEF9Vti-fthG','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "rsvps" VALUES('HiXI1B-8liVDAy9NWNdE8','LRnSaYz82pGkaH012ZehH','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "rsvps" VALUES('NQRnLAOuDThK_XYwf4jf4','PW0s6NT-bd4ibiwkYY6ux','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "rsvps" VALUES('GqzSSv4iu0Er9IxQb78zB','8zRpwyfxS7enUV1MqCyAM','uHy3QVPE1vUe5ivWh7C6_');
INSERT INTO "rsvps" VALUES('pEYpsD3C7cgh9YjSmUKuF','LRnSaYz82pGkaH012ZehH','sKAansNfnpR008lhmHKQe');
INSERT INTO "rsvps" VALUES('5hKJNax_5foOJ0qSLUftJ','IRbc1ns2R5g7QoG0TaD23','sKAansNfnpR008lhmHKQe');
INSERT INTO "rsvps" VALUES('Owe15diN4Uomw04ku7ZXe','IxDXE9YOcdGKJh_l5PCK3','sKAansNfnpR008lhmHKQe');
INSERT INTO "rsvps" VALUES('k-NHqlYU7vUJ3W-bkowx1','EKu8Ds3ZLe4U7GWMSdlRC','sKAansNfnpR008lhmHKQe');
INSERT INTO "rsvps" VALUES('Kyp1RhOJ3t88WTl6mo5hN','l6M1UsHOFbEF9Vti-fthG','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('lQgLVSC9yUSK0ePyLHa8h','LRnSaYz82pGkaH012ZehH','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('SP-d69fSt39c-lAUepRZF','NI3h188puPNNDQTjs4OtY','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('l_hG0IdTEccDjAIed-6qR','EYFAm7I_ek2BGYp6tmNC4','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('bj2a8dmBlcdiW8mRcfO6U','KbnDIXI4N2NwwfgheyeK5','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('Q_trq5lvj76YaZqzh2nnY','3tsAtbnmMWSWXWGqrJraY','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('B0-GuQ7WbzkinMa6cbJYH','8zRpwyfxS7enUV1MqCyAM','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "rsvps" VALUES('8jaGOZrns3Dl8LVIZZ5Rs','IRbc1ns2R5g7QoG0TaD23','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('yf3o9Gr30LGJvqE4gRimx','NI3h188puPNNDQTjs4OtY','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('fp0XE_-tIX9elbvwjCyty','d4fzTDyZS1e7EpMUkuULF','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('ZVji7NQtpZgQe4hvR9OiY','EYFAm7I_ek2BGYp6tmNC4','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('G4Z4AlbLwMwGhnuS6oBLJ','3tsAtbnmMWSWXWGqrJraY','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('7UrAYk9b5cmfz-Pt48Gi0','pcpdZHmrXsR7aO7ms3KjK','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "rsvps" VALUES('spLgLUd2PJ5ccADk6rKT3','l6M1UsHOFbEF9Vti-fthG','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "rsvps" VALUES('GYV_KFXz8e0-usms8roBY','_9u5smhAk59NDynbcuz7s','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "rsvps" VALUES('pUIlTIPoMKJ9oPjRitn4V','IRbc1ns2R5g7QoG0TaD23','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "rsvps" VALUES('C_3drrHBU7Sqkr640YNEw','FF4zMBn3uP5oGVEUz0A-a','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "rsvps" VALUES('ynrd36aboLW72f6HLb9VP','8zRpwyfxS7enUV1MqCyAM','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "rsvps" VALUES('dUmmvh3s3BcTr5_477Y47','IRbc1ns2R5g7QoG0TaD23','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('7DeaDrpD8UZOUfVuQBYDS','d4fzTDyZS1e7EpMUkuULF','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('y_XY8CfL0_4y2IxSdq7lk','isibXs4qXleW0LdmNG1HU','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('d4uIIfbtcJ5MitE2-U1nX','KbnDIXI4N2NwwfgheyeK5','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('UCdhVmUQqpwJbFs8KNJLS','PW0s6NT-bd4ibiwkYY6ux','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('mt5GFOzl9rYoW8VapG3R6','8zRpwyfxS7enUV1MqCyAM','QBWUzhQrfO8xsv-RRGXrU');
INSERT INTO "rsvps" VALUES('dDI-sjliiJgc4GZgegTIn','l6M1UsHOFbEF9Vti-fthG','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('7zAWQGUkD5CJij0Hzupv-','IRbc1ns2R5g7QoG0TaD23','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('dttRPb-mwftsembgNB2tt','NI3h188puPNNDQTjs4OtY','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('A_RDKOSVsaQLZ0jfqIvyV','hShLkFGe2JUkH_0QbA5gw','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('96Di7WxjImPLs4Va-_RmX','isibXs4qXleW0LdmNG1HU','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('7QxoVDeTiGh00igqv_liW','FF4zMBn3uP5oGVEUz0A-a','r-ws6d4dMfhGZxoCq-Ro3');
INSERT INTO "rsvps" VALUES('hwXJZ6xw-EoyMjs7bJLNO','l6M1UsHOFbEF9Vti-fthG','54AZ3c-17tbIATgggOOUN');
INSERT INTO "rsvps" VALUES('Fw7NSK91t42ngZpU37cMj','LRnSaYz82pGkaH012ZehH','54AZ3c-17tbIATgggOOUN');
INSERT INTO "rsvps" VALUES('dyOvQZcznoo-WT6s1bxAE','IRbc1ns2R5g7QoG0TaD23','54AZ3c-17tbIATgggOOUN');
INSERT INTO "rsvps" VALUES('8WoAq-EpYr457eO2HvsCU','hShLkFGe2JUkH_0QbA5gw','54AZ3c-17tbIATgggOOUN');
INSERT INTO "rsvps" VALUES('ZLaEdQp8sAtGc7dGEh8xm','PW0s6NT-bd4ibiwkYY6ux','54AZ3c-17tbIATgggOOUN');
INSERT INTO "rsvps" VALUES('G_ZKAdqH2JPz4AgTmrbh_','l6M1UsHOFbEF9Vti-fthG','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('yLX1BfUmymTGluSz_EgbN','IxDXE9YOcdGKJh_l5PCK3','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('UiBPaleK48z-UyP_d-QM_','EYFAm7I_ek2BGYp6tmNC4','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('k6Uv_58f6pvnHcl4v3Bb8','FF4zMBn3uP5oGVEUz0A-a','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('83_bUogHX1zl8geiv4ZgG','3tsAtbnmMWSWXWGqrJraY','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('qPCDG6_YE_rEaBM23yQC-','8zRpwyfxS7enUV1MqCyAM','CsN56WI96MWzVdtK5ndCB');
INSERT INTO "rsvps" VALUES('Mg8T77R2yN0k96jhjseBj','l6M1UsHOFbEF9Vti-fthG','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('Uuo6SH5xV1-Ee0B9oh7mm','NI3h188puPNNDQTjs4OtY','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('qNCJohEBd1CuXl-LhlB3V','d4fzTDyZS1e7EpMUkuULF','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('hmhKyVKJEQcgPFQjM8AkM','IxDXE9YOcdGKJh_l5PCK3','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('6VaQLE9-GQpoQCiBAAbRc','isibXs4qXleW0LdmNG1HU','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('_E3BWP7_5HojjkXk0WIhr','3tsAtbnmMWSWXWGqrJraY','8gZclqE7cUhZ_rT-DVVZn');
INSERT INTO "rsvps" VALUES('Qcfnhy-GfROaVQu9zFa0f','l6M1UsHOFbEF9Vti-fthG','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "rsvps" VALUES('UUV-UvZ0DadsH7MG2P550','_9u5smhAk59NDynbcuz7s','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "rsvps" VALUES('M7BqAtzpyKfF1YJXVPWXp','IRbc1ns2R5g7QoG0TaD23','q4ko_ePN19-cW_e_L3bEX');
INSERT INTO "rsvps" VALUES('xMlrwoG9G-L093hf4Oh_e','_9u5smhAk59NDynbcuz7s','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "rsvps" VALUES('_3t8rjOjJDJeRD5SHNCmG','d4fzTDyZS1e7EpMUkuULF','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "rsvps" VALUES('rweHsFOOtUtmzFWdEyja4','EYFAm7I_ek2BGYp6tmNC4','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "rsvps" VALUES('l6TOqb0F74JRVSQOd5yaM','KbnDIXI4N2NwwfgheyeK5','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "rsvps" VALUES('d67g_95ZDJFwDkA7pfiTx','PW0s6NT-bd4ibiwkYY6ux','XpP_IWzTZJc7bhuIXZWu-');
INSERT INTO "rsvps" VALUES('FFuIjLqXnxMsPJl1E4c22','l6M1UsHOFbEF9Vti-fthG','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('7_B-eTKSxPLpkV8EmZf1n','_9u5smhAk59NDynbcuz7s','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('wpJzhF1al0D_rFmFepoQP','IRbc1ns2R5g7QoG0TaD23','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('ZBvMjOz3n-jajDjyrXGTs','NI3h188puPNNDQTjs4OtY','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('eZkLCOz-EgajOA5w5kl6a','d4fzTDyZS1e7EpMUkuULF','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('JEpzqSPbtA_mo-FjSLB6o','isibXs4qXleW0LdmNG1HU','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('PjpuErjiu5BYrsDvFNX5p','KbnDIXI4N2NwwfgheyeK5','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('Jm8UQ4E176M4sPZaKaxoe','EKu8Ds3ZLe4U7GWMSdlRC','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('xd6hK_FYYRtyIxAu1o4UD','pcpdZHmrXsR7aO7ms3KjK','7sjDl7aU6CXZYxNdkF7k1');
INSERT INTO "rsvps" VALUES('pn9pNqEFKH3SMyJka5kmT','zUPQ4SkS_fTJqFmxB7YnZ','qO_V6CeV79jh7QhQJHf6O');
INSERT INTO "rsvps" VALUES('lzYjmId7ugHPNSXbZFs6z','8zRpwyfxS7enUV1MqCyAM','qO_V6CeV79jh7QhQJHf6O');
INSERT INTO "rsvps" VALUES('Ey3velCQlBkfbfN1QsKIc','l6M1UsHOFbEF9Vti-fthG','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "rsvps" VALUES('L2iRGaB7cmTX5h94Kuwjq','LRnSaYz82pGkaH012ZehH','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "rsvps" VALUES('k7VuNA6TUXUq_i5NpFjrm','zUPQ4SkS_fTJqFmxB7YnZ','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "rsvps" VALUES('rQ8iCGjTkISdCaKbZe0kE','KbnDIXI4N2NwwfgheyeK5','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "rsvps" VALUES('GxL0wWboc-jZIUGAtQ9OY','EKu8Ds3ZLe4U7GWMSdlRC','sOuRdIQVeRwPfFWFyXo48');
INSERT INTO "rsvps" VALUES('iRkmK9-YmYeE-UqSh6l_d','l6M1UsHOFbEF9Vti-fthG','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "rsvps" VALUES('1-iowJGq5-IzA8r7NiIJ1','zUPQ4SkS_fTJqFmxB7YnZ','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "rsvps" VALUES('DB4zAtEgOw2ZUMyCIhQ8W','IxDXE9YOcdGKJh_l5PCK3','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "rsvps" VALUES('-epkbisk8fEg5UDJ0DbNZ','8zRpwyfxS7enUV1MqCyAM','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "rsvps" VALUES('s5yLfGovJKYxENAPlL498','LRnSaYz82pGkaH012ZehH','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "rsvps" VALUES('GdalUnWC9FD794WDEXosJ','hShLkFGe2JUkH_0QbA5gw','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "rsvps" VALUES('7EfQ_WtPE0DE0aoT6-Y9j','8zRpwyfxS7enUV1MqCyAM','1ULJ5jPsAcysGk3nNR_Ki');
INSERT INTO "rsvps" VALUES('vWK_o-7buCbs0p1h2yTtQ','l6M1UsHOFbEF9Vti-fthG','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "rsvps" VALUES('f2iD8JE11VA1udhXsXO6B','NI3h188puPNNDQTjs4OtY','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "rsvps" VALUES('UCOp7SkzU0mYmikC0ht69','l6M1UsHOFbEF9Vti-fthG','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "rsvps" VALUES('EeaqJCWLJ6LgCzWnaIti9','IRbc1ns2R5g7QoG0TaD23','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "rsvps" VALUES('s_5xHGgodJgOZnR3uGM1z','IxDXE9YOcdGKJh_l5PCK3','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "rsvps" VALUES('HJZH_a0o7jxLpjhjFAs1A','isibXs4qXleW0LdmNG1HU','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "rsvps" VALUES('9Ydg1eP4a5afYpkdGj6G4','FF4zMBn3uP5oGVEUz0A-a','i_qdUdPhSK8wvaON8JFLu');
INSERT INTO "rsvps" VALUES('UhOtQRkNg4oI7aBrBeCnK','l6M1UsHOFbEF9Vti-fthG','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('d90zbnvbcdorL0AHyVOFm','LRnSaYz82pGkaH012ZehH','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('aMyBYpx8ykhNVychSoC3R','NI3h188puPNNDQTjs4OtY','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('C8ETvbJXGGIhI0Mv1nW4D','isibXs4qXleW0LdmNG1HU','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('-S8mQjThNLzMdZ9AOClMJ','FF4zMBn3uP5oGVEUz0A-a','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('JRQtiGpfz80tIf_QhICdz','PW0s6NT-bd4ibiwkYY6ux','3bK5FPaFVSBvfX64pDifB');
INSERT INTO "rsvps" VALUES('OB2yTiZl2aDiBiNyukiO8','zUPQ4SkS_fTJqFmxB7YnZ','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "rsvps" VALUES('akxNHe2EEnmf7X8xlhTcD','IxDXE9YOcdGKJh_l5PCK3','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "rsvps" VALUES('U9X5VJuDTLNReE4OKR68W','EYFAm7I_ek2BGYp6tmNC4','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "rsvps" VALUES('X6P-GIy9nMUGkvBahdQOL','3tsAtbnmMWSWXWGqrJraY','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "rsvps" VALUES('TaAjnEOAhLTibLiHnmrwZ','pcpdZHmrXsR7aO7ms3KjK','3rPjbZGQYhwqJ45QrVe5y');
INSERT INTO "rsvps" VALUES('-p9IIao8nHWjjvplGTbEZ','l6M1UsHOFbEF9Vti-fthG','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "rsvps" VALUES('YvJ3v1R2qpj6Josx8IauN','_9u5smhAk59NDynbcuz7s','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "rsvps" VALUES('btUP5MAmTTu6GAr4E2GqH','IRbc1ns2R5g7QoG0TaD23','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "rsvps" VALUES('n7hb26HM868egJhrJnBoz','d4fzTDyZS1e7EpMUkuULF','EfoGRZZtR6wq-_VrHW2GE');
INSERT INTO "rsvps" VALUES('e6Qdvqjsk9CTkrUf3HRAH','8zRpwyfxS7enUV1MqCyAM','EfoGRZZtR6wq-_VrHW2GE');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('eT20jrQ6XmDUfhp6uIcoO','Tv2KOAulAooc4S7wgmCn7');
INSERT INTO "session_hosts" VALUES('QNabeO7UnjRaat2oHbxjZ','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "session_hosts" VALUES('l6M1UsHOFbEF9Vti-fthG','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "session_hosts" VALUES('LRnSaYz82pGkaH012ZehH','1TSQ9dPD-6927V4F0v5UA');
INSERT INTO "session_hosts" VALUES('_9u5smhAk59NDynbcuz7s','09XNxNLF6W96uMTofi3E0');
INSERT INTO "session_hosts" VALUES('IRbc1ns2R5g7QoG0TaD23','cTi6oXuNbhyiYwiTPSpA6');
INSERT INTO "session_hosts" VALUES('zUPQ4SkS_fTJqFmxB7YnZ','0zT3gFfzRtEcwMgJl6VqQ');
INSERT INTO "session_hosts" VALUES('NI3h188puPNNDQTjs4OtY','54AZ3c-17tbIATgggOOUN');
INSERT INTO "session_hosts" VALUES('d4fzTDyZS1e7EpMUkuULF','Fnm-Abdz1ehN5EkTIKZIZ');
INSERT INTO "session_hosts" VALUES('IxDXE9YOcdGKJh_l5PCK3','vmSOueGekeVkyJjQSrzT4');
INSERT INTO "session_hosts" VALUES('hShLkFGe2JUkH_0QbA5gw','qDfilKr-_aFNQiGR7nPFy');
INSERT INTO "session_hosts" VALUES('EYFAm7I_ek2BGYp6tmNC4','hbl72kbmidfWZQjJ27Jd8');
INSERT INTO "session_hosts" VALUES('isibXs4qXleW0LdmNG1HU','etUL1rohSL1qIk_q3yI6i');
INSERT INTO "session_hosts" VALUES('FF4zMBn3uP5oGVEUz0A-a','-hzLWgBt9Ly2PhX24ibPs');
INSERT INTO "session_hosts" VALUES('FF4zMBn3uP5oGVEUz0A-a','gz9KK1_5R_ETIpVa47El3');
INSERT INTO "session_hosts" VALUES('KbnDIXI4N2NwwfgheyeK5','LydZG3AsWh7pTgAaPQHQS');
INSERT INTO "session_hosts" VALUES('PW0s6NT-bd4ibiwkYY6ux','sKAansNfnpR008lhmHKQe');
INSERT INTO "session_hosts" VALUES('EKu8Ds3ZLe4U7GWMSdlRC','HaUr-XMbez7ccCJO6DFe8');
INSERT INTO "session_hosts" VALUES('3tsAtbnmMWSWXWGqrJraY','QsZDe1kfpP9ZZp5tnJ84s');
INSERT INTO "session_hosts" VALUES('8zRpwyfxS7enUV1MqCyAM','w7JdJDr5DDwEqnll6-W_E');
INSERT INTO "session_hosts" VALUES('pcpdZHmrXsR7aO7ms3KjK','Fnm-Abdz1ehN5EkTIKZIZ');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('eT20jrQ6XmDUfhp6uIcoO','loc-main-hall');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-main-hall');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-room-a');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-room-b');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-library');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-boardroom');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-auditorium');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-courtyard');
INSERT INTO "session_locations" VALUES('_0TxGdh1mZ5KS57VYIRZw','loc-rooftop');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-main-hall');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-room-a');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-room-b');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-library');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-boardroom');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-auditorium');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-courtyard');
INSERT INTO "session_locations" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','loc-rooftop');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-main-hall');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-room-a');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-room-b');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-library');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-boardroom');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-auditorium');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-courtyard');
INSERT INTO "session_locations" VALUES('M53LnEyIFSGEqFOLapN7T','loc-rooftop');
INSERT INTO "session_locations" VALUES('QNabeO7UnjRaat2oHbxjZ','loc-main-hall');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-main-hall');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-room-a');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-room-b');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-library');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-boardroom');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-auditorium');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-courtyard');
INSERT INTO "session_locations" VALUES('hSBTPxC_oaWVzwx57bGFd','loc-rooftop');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-main-hall');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-room-a');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-room-b');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-library');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-boardroom');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-auditorium');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-courtyard');
INSERT INTO "session_locations" VALUES('JPKkRlAquB8SXvYZUTdqQ','loc-rooftop');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-main-hall');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-room-a');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-room-b');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-library');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-boardroom');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-auditorium');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-courtyard');
INSERT INTO "session_locations" VALUES('lMPMhDjeA2Fr5tQOrJVwS','loc-rooftop');
INSERT INTO "session_locations" VALUES('l6M1UsHOFbEF9Vti-fthG','loc-main-hall');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-main-hall');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-room-a');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-room-b');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-library');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-boardroom');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-auditorium');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-courtyard');
INSERT INTO "session_locations" VALUES('qoTpRvw-TrYprNvSIF29D','loc-rooftop');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-main-hall');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-room-a');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-room-b');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-library');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-boardroom');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-auditorium');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-courtyard');
INSERT INTO "session_locations" VALUES('EbyUkzzVQmte5zJR0N-L4','loc-rooftop');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-main-hall');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-room-a');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-room-b');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-library');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-boardroom');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-auditorium');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-courtyard');
INSERT INTO "session_locations" VALUES('ao2VKcLBR27mcnGjEtyxP','loc-rooftop');
INSERT INTO "session_locations" VALUES('LRnSaYz82pGkaH012ZehH','loc-main-hall');
INSERT INTO "session_locations" VALUES('_9u5smhAk59NDynbcuz7s','loc-room-a');
INSERT INTO "session_locations" VALUES('IRbc1ns2R5g7QoG0TaD23','loc-main-hall');
INSERT INTO "session_locations" VALUES('zUPQ4SkS_fTJqFmxB7YnZ','loc-room-b');
INSERT INTO "session_locations" VALUES('NI3h188puPNNDQTjs4OtY','loc-room-a');
INSERT INTO "session_locations" VALUES('d4fzTDyZS1e7EpMUkuULF','loc-main-hall');
INSERT INTO "session_locations" VALUES('IxDXE9YOcdGKJh_l5PCK3','loc-room-b');
INSERT INTO "session_locations" VALUES('hShLkFGe2JUkH_0QbA5gw','loc-room-a');
INSERT INTO "session_locations" VALUES('EYFAm7I_ek2BGYp6tmNC4','loc-main-hall');
INSERT INTO "session_locations" VALUES('isibXs4qXleW0LdmNG1HU','loc-room-b');
INSERT INTO "session_locations" VALUES('FF4zMBn3uP5oGVEUz0A-a','loc-main-hall');
INSERT INTO "session_locations" VALUES('KbnDIXI4N2NwwfgheyeK5','loc-room-b');
INSERT INTO "session_locations" VALUES('PW0s6NT-bd4ibiwkYY6ux','loc-main-hall');
INSERT INTO "session_locations" VALUES('EKu8Ds3ZLe4U7GWMSdlRC','loc-room-a');
INSERT INTO "session_locations" VALUES('3tsAtbnmMWSWXWGqrJraY','loc-room-b');
INSERT INTO "session_locations" VALUES('8zRpwyfxS7enUV1MqCyAM','loc-main-hall');
INSERT INTO "session_locations" VALUES('pcpdZHmrXsR7aO7ms3KjK','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('3I_bGuv_dGkXUstoS8rHv','rurqF9N1od2Wd09yXZkQW','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('vdSX0varF3v9DeIwPlrU8','rurqF9N1od2Wd09yXZkQW','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('rd3zSc5iNgBfSgF40jBtj','rurqF9N1od2Wd09yXZkQW','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('2fcXv0xFOa9BuI_NdDlCV','rurqF9N1od2Wd09yXZkQW','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('pBawn_8oZeWFMfPLs4AvR','rurqF9N1od2Wd09yXZkQW','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('eglRtd1pQEn-tSSljAi0m','rurqF9N1od2Wd09yXZkQW','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('OHvLqsh_8m8jQ_yrtXPFL','rurqF9N1od2Wd09yXZkQW','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('UFk-LHGIFj3GHqiSexhfx','rurqF9N1od2Wd09yXZkQW','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('JVZqHhmeyaFjV70BHM104','rurqF9N1od2Wd09yXZkQW','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T13:16:49.392Z');
INSERT INTO "session_proposals" VALUES('HNwEhSXZckwiuS7OW-Std','rurqF9N1od2Wd09yXZkQW','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('aiYpmT1KdhQbMwXEph8Q7','rurqF9N1od2Wd09yXZkQW','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('quMzDV8BwAl7uNcaWlrbr','WyUIuRcdwdCVAfpOpffgo','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('bQ5DxjfWMwwpsO2ufDhpD','WyUIuRcdwdCVAfpOpffgo','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('hI0QiYeyoiCOg0uAdAOyP','WyUIuRcdwdCVAfpOpffgo','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('Q3beKjganPauknuCiuK9s','WyUIuRcdwdCVAfpOpffgo','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('AagV5vh22Jk_gCHOIyffU','WyUIuRcdwdCVAfpOpffgo','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('sJv9YSB1py_pIdbX4tPAd','WyUIuRcdwdCVAfpOpffgo','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('mBbdBZ-DfYN4KQJjPzACA','WyUIuRcdwdCVAfpOpffgo','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('Il_HSgpol8ZKlKLclekZK','WyUIuRcdwdCVAfpOpffgo','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('5Z004by81Tp5SegWP3YTb','WyUIuRcdwdCVAfpOpffgo','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('cHxGnYOhP2ji9mLIYM3NH','WyUIuRcdwdCVAfpOpffgo','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('_a9SMxFxUuVGzdYM17QEH','WyUIuRcdwdCVAfpOpffgo','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('gc7Ejaaw0b5ZZhTVJk5Zf','WyUIuRcdwdCVAfpOpffgo','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('NfIGH1_UYSmRoQqgMn97U','WyUIuRcdwdCVAfpOpffgo','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('uZ5CnIgG9thpBvI3Ppk_j','SPIvtmHDpU3ykAhQaMeUE','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('ktz3QVsszOB-xxgHKYkeU','SPIvtmHDpU3ykAhQaMeUE','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('trH9gKWGp-IwZFjo3_PLi','SPIvtmHDpU3ykAhQaMeUE','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('yN1BzNfXfVRHJiEQLSe7O','SPIvtmHDpU3ykAhQaMeUE','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('FU9j5lT4h2d1O1Xe4QZg7','SPIvtmHDpU3ykAhQaMeUE','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('qCscSIMYLbg9Ab5uP9cP3','SPIvtmHDpU3ykAhQaMeUE','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('2E-EQ8vHLpVnvu3JQan_Q','SPIvtmHDpU3ykAhQaMeUE','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('yj0-Vt5YnpHCV0PxfysGj','SPIvtmHDpU3ykAhQaMeUE','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('gD2VsVURdrb-jzLIMS56s','SPIvtmHDpU3ykAhQaMeUE','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('gAAT18AMLo72CgsS9k8cF','SPIvtmHDpU3ykAhQaMeUE','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('1PRyfHp0P6n4Va97b-06K','SPIvtmHDpU3ykAhQaMeUE','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('ymgAKfimjdaNlyjFAy_SJ','SPIvtmHDpU3ykAhQaMeUE','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('a_MvV7vhAs5yTTBaNcbfU','SPIvtmHDpU3ykAhQaMeUE','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('QurDeTrWBESvmlvSuFHAy','SPIvtmHDpU3ykAhQaMeUE','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('7IgRPZEmXBUltUkUpM6e8','SPIvtmHDpU3ykAhQaMeUE','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('jUhSb7URFvAiJ0NRidt50','SPIvtmHDpU3ykAhQaMeUE','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('9wsdCKBvbC-p-ru8aVNZD','SPIvtmHDpU3ykAhQaMeUE','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('DRFgpDGa5DtxyYK1nDRJ_','SPIvtmHDpU3ykAhQaMeUE','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('f20B9bKK3F3mTkd5N5r1C','SPIvtmHDpU3ykAhQaMeUE','Writing Documentation People Actually Read','Most documentation is written once, in a hurry, by whoever shipped the feature. This session is about the opposite: treating docs as a product with readers, a first minute that has to land, and a maintenance cost you plan for.

We''ll look at real examples — a few good, several painfully bad — and pull out what separates them: task-shaped titles, examples before explanations, and the courage to delete a page.

Bring a page you''re unhappy with and we''ll rework it together.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('hDAQ8kSxFgap3ceyt-Igj','SPIvtmHDpU3ykAhQaMeUE','Your First Conference Talk: From Idea to Stage','You have something worth saying and no idea how to turn it into 30 minutes on a stage. Let''s fix that.

We''ll cover finding a topic that''s genuinely yours, writing an abstract that survives a review committee, building slides that support you instead of competing with you, and what to do when your demo dies in front of 200 people (it will, eventually).

Aimed at people who have *never* spoken before. No slides of my own — we work on yours.',90,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('i2q0pP8dzlyjc_qsuONqr','SPIvtmHDpU3ykAhQaMeUE','Ask Me Anything: Migrating a Legacy Monolith','**Looking for someone to host this!**

Several of us are staring down the same problem: a monolith that works, pays the bills, and is slowly becoming impossible to change. We''d love to hear from somebody who has actually come out the other side of a migration — what you''d do again, and what you''d never repeat.

If you''ve lived through one, please add yourself as host. An honest hour of war stories beats a polished talk.',60,'2026-08-30T13:16:49.393Z');
INSERT INTO "session_proposals" VALUES('4sqU737gmLVho6GPf1ynB','SPIvtmHDpU3ykAhQaMeUE','Board Games for People Who Are Tired of Talking','By day three, everyone''s social battery is empty. This is a quiet room with a table, a stack of games, and no agenda.

Nobody has volunteered to bring the games yet — if you''re travelling with something short and easy to teach, add yourself as host and we''ll make it happen.',120,'2026-08-30T13:16:49.393Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('WsYZ0X8juTrrRAslM5d4S','quMzDV8BwAl7uNcaWlrbr','Tv2KOAulAooc4S7wgmCn7','maybe');
INSERT INTO "votes" VALUES('1RZ9vsSmt3dlXgKYY9UEm','Q3beKjganPauknuCiuK9s','Tv2KOAulAooc4S7wgmCn7','interested');
INSERT INTO "votes" VALUES('ZsvBtQ-9uzWU09inm3egs','sJv9YSB1py_pIdbX4tPAd','Tv2KOAulAooc4S7wgmCn7','maybe');
INSERT INTO "votes" VALUES('m-J7jiHNl8_Fnte75Id7X','mBbdBZ-DfYN4KQJjPzACA','Tv2KOAulAooc4S7wgmCn7','maybe');
INSERT INTO "votes" VALUES('cYXrnBr9vX8EuOiO5b3S_','5Z004by81Tp5SegWP3YTb','Tv2KOAulAooc4S7wgmCn7','interested');
INSERT INTO "votes" VALUES('O-QshbEyXkmlVtH5zgnNg','cHxGnYOhP2ji9mLIYM3NH','Tv2KOAulAooc4S7wgmCn7','skip');
INSERT INTO "votes" VALUES('71uZGM9ytm3LzjlPxIjyk','bQ5DxjfWMwwpsO2ufDhpD','-hzLWgBt9Ly2PhX24ibPs','maybe');
INSERT INTO "votes" VALUES('swCvD6Hlkq_lKYCLNUmKW','Q3beKjganPauknuCiuK9s','-hzLWgBt9Ly2PhX24ibPs','interested');
INSERT INTO "votes" VALUES('t-kdW2L9YFRT4zmTlQa8v','AagV5vh22Jk_gCHOIyffU','-hzLWgBt9Ly2PhX24ibPs','skip');
INSERT INTO "votes" VALUES('a9vi46eRlqb9cr-8GyejM','5Z004by81Tp5SegWP3YTb','-hzLWgBt9Ly2PhX24ibPs','maybe');
INSERT INTO "votes" VALUES('Sb2vA-4BSDIV4X-9zTEs3','AagV5vh22Jk_gCHOIyffU','Fnm-Abdz1ehN5EkTIKZIZ','maybe');
INSERT INTO "votes" VALUES('Gz-krIA81fyBHoBnkx3Z7','sJv9YSB1py_pIdbX4tPAd','Fnm-Abdz1ehN5EkTIKZIZ','maybe');
INSERT INTO "votes" VALUES('-Jwckld9hnq49a-S34fLk','hI0QiYeyoiCOg0uAdAOyP','1TSQ9dPD-6927V4F0v5UA','maybe');
INSERT INTO "votes" VALUES('kO9EQKdXwEAfIcM4MOyyo','Q3beKjganPauknuCiuK9s','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('T6JdhNOmrG7TlkzoMK28s','mBbdBZ-DfYN4KQJjPzACA','1TSQ9dPD-6927V4F0v5UA','maybe');
INSERT INTO "votes" VALUES('Xna7scg1Zcltyf48cK-aa','Il_HSgpol8ZKlKLclekZK','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('EUAsw7vIJuXvrm_u6NqfP','5Z004by81Tp5SegWP3YTb','1TSQ9dPD-6927V4F0v5UA','skip');
INSERT INTO "votes" VALUES('ZzcheM-0saIRjhdMhGaQj','bQ5DxjfWMwwpsO2ufDhpD','0kmFtICfDcAglqxTgHR65','skip');
INSERT INTO "votes" VALUES('8zHv8UOKU2pX5iNnc6Akn','sJv9YSB1py_pIdbX4tPAd','0kmFtICfDcAglqxTgHR65','interested');
INSERT INTO "votes" VALUES('PV6x_HPOZ7XOzUsjka7KP','quMzDV8BwAl7uNcaWlrbr','09XNxNLF6W96uMTofi3E0','maybe');
INSERT INTO "votes" VALUES('e60dSB7KyxbPKOwQ8edBX','mBbdBZ-DfYN4KQJjPzACA','09XNxNLF6W96uMTofi3E0','maybe');
INSERT INTO "votes" VALUES('dTLBbIfpr3r-8lFP3NkCI','5Z004by81Tp5SegWP3YTb','09XNxNLF6W96uMTofi3E0','skip');
INSERT INTO "votes" VALUES('Dv0W2b4k9ltMqCEEGTXYQ','quMzDV8BwAl7uNcaWlrbr','TBRGH7ZXR4hw5a-ywGIPO','skip');
INSERT INTO "votes" VALUES('qEFM1KiU6C8rl0oxJzfJw','bQ5DxjfWMwwpsO2ufDhpD','TBRGH7ZXR4hw5a-ywGIPO','skip');
INSERT INTO "votes" VALUES('snBtrsM50oHxForlbh_vT','hI0QiYeyoiCOg0uAdAOyP','TBRGH7ZXR4hw5a-ywGIPO','skip');
INSERT INTO "votes" VALUES('812f8G7K9GnHfXGUlk4gW','Q3beKjganPauknuCiuK9s','TBRGH7ZXR4hw5a-ywGIPO','maybe');
INSERT INTO "votes" VALUES('uGj_ka3Hy9jDzX_7av2BL','mBbdBZ-DfYN4KQJjPzACA','TBRGH7ZXR4hw5a-ywGIPO','maybe');
INSERT INTO "votes" VALUES('w5k2WK3X0sDgMHK5be82n','Il_HSgpol8ZKlKLclekZK','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('XGcV7R5-CNC2qcL6oL_BM','5Z004by81Tp5SegWP3YTb','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('06kh6mcw9Xj9o-PWL2vXF','cHxGnYOhP2ji9mLIYM3NH','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('jkW_KTLtoWGsxTc4oN5w3','quMzDV8BwAl7uNcaWlrbr','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('rQz33yCtcNiz7JiG940mZ','bQ5DxjfWMwwpsO2ufDhpD','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('bPxb6wjAX2i4CVkw43vgW','Il_HSgpol8ZKlKLclekZK','hbl72kbmidfWZQjJ27Jd8','maybe');
INSERT INTO "votes" VALUES('53pkOA93nGv5o3C5SlrNV','cHxGnYOhP2ji9mLIYM3NH','hbl72kbmidfWZQjJ27Jd8','skip');
INSERT INTO "votes" VALUES('s4Sc4tlduHKlA21x_zfxS','hI0QiYeyoiCOg0uAdAOyP','xviuahijPP7FbbWYhKuBJ','skip');
INSERT INTO "votes" VALUES('pGeXBKltCeRdkJZC_PZex','sJv9YSB1py_pIdbX4tPAd','xviuahijPP7FbbWYhKuBJ','maybe');
INSERT INTO "votes" VALUES('Yegmsx57nuwPoID5KJYH9','cHxGnYOhP2ji9mLIYM3NH','xviuahijPP7FbbWYhKuBJ','maybe');
INSERT INTO "votes" VALUES('g-MEtgB-8nf_frrPcAE0R','bQ5DxjfWMwwpsO2ufDhpD','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('JDWZeiKrgbGfXG1GBjP56','hI0QiYeyoiCOg0uAdAOyP','w7JdJDr5DDwEqnll6-W_E','interested');
INSERT INTO "votes" VALUES('6254eeoscm1B8Fc1L6DBF','Q3beKjganPauknuCiuK9s','w7JdJDr5DDwEqnll6-W_E','interested');
INSERT INTO "votes" VALUES('DRTkFhTK_mg3vd5_R13S9','AagV5vh22Jk_gCHOIyffU','w7JdJDr5DDwEqnll6-W_E','skip');
INSERT INTO "votes" VALUES('J-wbucdi18EKGbFy0fv4o','cHxGnYOhP2ji9mLIYM3NH','w7JdJDr5DDwEqnll6-W_E','skip');
INSERT INTO "votes" VALUES('J2OT5bhB14Bs2ZP2BLYpW','Il_HSgpol8ZKlKLclekZK','HaUr-XMbez7ccCJO6DFe8','maybe');
INSERT INTO "votes" VALUES('baGUVM1sKZtvaFvCHmryX','5Z004by81Tp5SegWP3YTb','HaUr-XMbez7ccCJO6DFe8','maybe');
INSERT INTO "votes" VALUES('3xnDKKIWh-pG34yhqtPa5','cHxGnYOhP2ji9mLIYM3NH','HaUr-XMbez7ccCJO6DFe8','interested');
INSERT INTO "votes" VALUES('1MW_TEeFj-S0o7OPa8PYC','quMzDV8BwAl7uNcaWlrbr','NAr9AK8oCXDTlilPDLP_m','skip');
INSERT INTO "votes" VALUES('uThE5xyJZt5c0m6kjQWIx','bQ5DxjfWMwwpsO2ufDhpD','NAr9AK8oCXDTlilPDLP_m','skip');
INSERT INTO "votes" VALUES('2LOhfV0o8Mq6gSInuAR29','Q3beKjganPauknuCiuK9s','NAr9AK8oCXDTlilPDLP_m','skip');
INSERT INTO "votes" VALUES('e_5i6GM7dPmxxWeG2eoUn','AagV5vh22Jk_gCHOIyffU','NAr9AK8oCXDTlilPDLP_m','interested');
INSERT INTO "votes" VALUES('-mEEZnRPeJBZUNmRRRmk5','sJv9YSB1py_pIdbX4tPAd','NAr9AK8oCXDTlilPDLP_m','maybe');
INSERT INTO "votes" VALUES('PemhxFYM3Q94EIuqthHWS','mBbdBZ-DfYN4KQJjPzACA','NAr9AK8oCXDTlilPDLP_m','interested');
INSERT INTO "votes" VALUES('d43asJ72M42lCAiTAGgn4','hI0QiYeyoiCOg0uAdAOyP','vmSOueGekeVkyJjQSrzT4','maybe');
INSERT INTO "votes" VALUES('LErW1CKeOaY6tTNXad4J_','Q3beKjganPauknuCiuK9s','vmSOueGekeVkyJjQSrzT4','skip');
INSERT INTO "votes" VALUES('I_fKP-a3eVw8ntKHaxu5V','AagV5vh22Jk_gCHOIyffU','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('smKqpyhwyDHv-5UCuDdux','sJv9YSB1py_pIdbX4tPAd','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('fC2XR-FUYRSu7kSDRf-Uj','5Z004by81Tp5SegWP3YTb','QsZDe1kfpP9ZZp5tnJ84s','interested');
INSERT INTO "votes" VALUES('HxQNebU2eQNIa8uI1MgJo','bQ5DxjfWMwwpsO2ufDhpD','B5125stOsb8vn8HGBEtw0','maybe');
INSERT INTO "votes" VALUES('Um4t4jAkJgmAV-CoeWNAE','Q3beKjganPauknuCiuK9s','B5125stOsb8vn8HGBEtw0','interested');
INSERT INTO "votes" VALUES('RYRxmHC5-PasfQ6VtIy4b','sJv9YSB1py_pIdbX4tPAd','B5125stOsb8vn8HGBEtw0','maybe');
INSERT INTO "votes" VALUES('6AofiN7RDw7RpvuboTmer','mBbdBZ-DfYN4KQJjPzACA','B5125stOsb8vn8HGBEtw0','interested');
INSERT INTO "votes" VALUES('j1RUsNQlbuJl2aLgSzSsp','5Z004by81Tp5SegWP3YTb','B5125stOsb8vn8HGBEtw0','maybe');
INSERT INTO "votes" VALUES('7HBXcSA4oEg408PHrOyOy','cHxGnYOhP2ji9mLIYM3NH','B5125stOsb8vn8HGBEtw0','interested');
INSERT INTO "votes" VALUES('iDqOQfUsfI39Fz_pBGmvr','hI0QiYeyoiCOg0uAdAOyP','qDfilKr-_aFNQiGR7nPFy','skip');
INSERT INTO "votes" VALUES('fIJqmdetIKicIfsGvYqWW','Q3beKjganPauknuCiuK9s','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('ItgAiglrEkZKEeLzbZQxq','sJv9YSB1py_pIdbX4tPAd','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('iWXJ6Wanh8HBVohEoXHoH','mBbdBZ-DfYN4KQJjPzACA','qDfilKr-_aFNQiGR7nPFy','maybe');
INSERT INTO "votes" VALUES('6cyAY7qRmS_zzt8Lbr3OQ','Il_HSgpol8ZKlKLclekZK','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('gl1Ft-Hby1SY7fM7FqScz','5Z004by81Tp5SegWP3YTb','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('2e4-Cfxe-E4hKLaYcF-dm','bQ5DxjfWMwwpsO2ufDhpD','AWd3Xn3wBU7_TdfKAbXbC','skip');
INSERT INTO "votes" VALUES('xyxX8n5LoruDbSpgSCXjW','hI0QiYeyoiCOg0uAdAOyP','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('t2-iu0gc-RHoGZ5FveCkH','Q3beKjganPauknuCiuK9s','AWd3Xn3wBU7_TdfKAbXbC','skip');
INSERT INTO "votes" VALUES('yIFKc1MTU8YwJSoxZ5-Gq','mBbdBZ-DfYN4KQJjPzACA','AWd3Xn3wBU7_TdfKAbXbC','maybe');
INSERT INTO "votes" VALUES('_h4bzUzN1NViPtJzA_Hfu','5Z004by81Tp5SegWP3YTb','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('370FJ1eMj8K4uCzQY9Poa','cHxGnYOhP2ji9mLIYM3NH','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('EPujPtCylIrlcz4pZJ1AZ','quMzDV8BwAl7uNcaWlrbr','I96Xr6Zdn2Vv-li7DY2fV','interested');
INSERT INTO "votes" VALUES('bCMoqmko31BlqEnnq5R-N','bQ5DxjfWMwwpsO2ufDhpD','I96Xr6Zdn2Vv-li7DY2fV','interested');
INSERT INTO "votes" VALUES('GHFMTEevbiVwNw2MvxpRp','Il_HSgpol8ZKlKLclekZK','I96Xr6Zdn2Vv-li7DY2fV','maybe');
INSERT INTO "votes" VALUES('VQKw8D0rLbItqZEiBsOGq','5Z004by81Tp5SegWP3YTb','I96Xr6Zdn2Vv-li7DY2fV','maybe');
INSERT INTO "votes" VALUES('haBsAQJ7QVrW_BvbZCjfw','quMzDV8BwAl7uNcaWlrbr','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('tL0BX9nHuBaCKGhljUMiW','bQ5DxjfWMwwpsO2ufDhpD','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('7r1m6FdZZebUBeuzD_nY_','hI0QiYeyoiCOg0uAdAOyP','uHy3QVPE1vUe5ivWh7C6_','skip');
INSERT INTO "votes" VALUES('dWruKXz0aC3YJcX5uh3u2','sJv9YSB1py_pIdbX4tPAd','uHy3QVPE1vUe5ivWh7C6_','maybe');
INSERT INTO "votes" VALUES('a8XKsnOyvHfrMGsQZj2_A','5Z004by81Tp5SegWP3YTb','uHy3QVPE1vUe5ivWh7C6_','skip');
INSERT INTO "votes" VALUES('LKGEAMuCbs9LffSi9CPDA','cHxGnYOhP2ji9mLIYM3NH','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('2Q24-tdB8kS29_2FTb9XS','quMzDV8BwAl7uNcaWlrbr','sKAansNfnpR008lhmHKQe','maybe');
INSERT INTO "votes" VALUES('psvdFrbnA-WpuUJjr1eb3','sJv9YSB1py_pIdbX4tPAd','sKAansNfnpR008lhmHKQe','maybe');
INSERT INTO "votes" VALUES('LxzdOPxRXUt2wTL6gU7-_','mBbdBZ-DfYN4KQJjPzACA','sKAansNfnpR008lhmHKQe','interested');
INSERT INTO "votes" VALUES('bgrrBVRiMGTJMAhFyP26d','Il_HSgpol8ZKlKLclekZK','sKAansNfnpR008lhmHKQe','interested');
INSERT INTO "votes" VALUES('l3JhHF8CKZkzH_Y7GU2Wu','cHxGnYOhP2ji9mLIYM3NH','sKAansNfnpR008lhmHKQe','interested');
INSERT INTO "votes" VALUES('T5lI96ggufq_x5B94vZRk','Q3beKjganPauknuCiuK9s','cTi6oXuNbhyiYwiTPSpA6','skip');
INSERT INTO "votes" VALUES('fItvwc3THSLU3M-Fch0gZ','AagV5vh22Jk_gCHOIyffU','cTi6oXuNbhyiYwiTPSpA6','interested');
INSERT INTO "votes" VALUES('Juy0Wsm50JVUMV_ML7s3-','mBbdBZ-DfYN4KQJjPzACA','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('0wTOiaznSZV-njW5O9Qwi','Il_HSgpol8ZKlKLclekZK','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('O_t4HlrhjcLHUZ72ROuin','quMzDV8BwAl7uNcaWlrbr','LydZG3AsWh7pTgAaPQHQS','maybe');
INSERT INTO "votes" VALUES('K6v8cjQx40XRslE8h9R9Z','mBbdBZ-DfYN4KQJjPzACA','LydZG3AsWh7pTgAaPQHQS','interested');
INSERT INTO "votes" VALUES('Plcp5y-FwLQ1Epk0UAQC8','5Z004by81Tp5SegWP3YTb','LydZG3AsWh7pTgAaPQHQS','interested');
INSERT INTO "votes" VALUES('2pKfjLjeiGIxyL1AQNp-b','cHxGnYOhP2ji9mLIYM3NH','LydZG3AsWh7pTgAaPQHQS','skip');
INSERT INTO "votes" VALUES('ZqnJ5Pb-GEtlCVHiRQ-Kq','quMzDV8BwAl7uNcaWlrbr','etUL1rohSL1qIk_q3yI6i','interested');
INSERT INTO "votes" VALUES('vkZXrXSM9ZBAKHtSKm1zw','hI0QiYeyoiCOg0uAdAOyP','etUL1rohSL1qIk_q3yI6i','maybe');
INSERT INTO "votes" VALUES('XbE02g2VTrRzrdWEyvk59','sJv9YSB1py_pIdbX4tPAd','etUL1rohSL1qIk_q3yI6i','interested');
INSERT INTO "votes" VALUES('jfrtk3KwRUTFn5vHyxPQc','cHxGnYOhP2ji9mLIYM3NH','etUL1rohSL1qIk_q3yI6i','skip');
INSERT INTO "votes" VALUES('r2ZrFRbW1YGWzKCGPPomj','sJv9YSB1py_pIdbX4tPAd','QBWUzhQrfO8xsv-RRGXrU','skip');
INSERT INTO "votes" VALUES('F6T56XaWskKLDQuykNX5W','5Z004by81Tp5SegWP3YTb','QBWUzhQrfO8xsv-RRGXrU','interested');
INSERT INTO "votes" VALUES('fQ-CbSXpyRytnbDsLGTyv','cHxGnYOhP2ji9mLIYM3NH','QBWUzhQrfO8xsv-RRGXrU','maybe');
INSERT INTO "votes" VALUES('fytFhxEpT0nEB3K4PZ0-c','quMzDV8BwAl7uNcaWlrbr','r-ws6d4dMfhGZxoCq-Ro3','maybe');
INSERT INTO "votes" VALUES('_9bNnVVY_ClF4fbPY5tv1','bQ5DxjfWMwwpsO2ufDhpD','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('zHtT_7l-PJb3v23KSMTya','sJv9YSB1py_pIdbX4tPAd','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('lGUlXlduix1CNW6zUEh_5','mBbdBZ-DfYN4KQJjPzACA','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('ocfVjzAm62_Qg-4bm20tr','Il_HSgpol8ZKlKLclekZK','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('Fz8lmlTgOVEvaUrTdvtJ3','5Z004by81Tp5SegWP3YTb','r-ws6d4dMfhGZxoCq-Ro3','maybe');
INSERT INTO "votes" VALUES('5Gl2ZgU19kATvYealy5Mo','quMzDV8BwAl7uNcaWlrbr','54AZ3c-17tbIATgggOOUN','maybe');
INSERT INTO "votes" VALUES('Lr3aAO4PSWzwzMONeABR4','hI0QiYeyoiCOg0uAdAOyP','54AZ3c-17tbIATgggOOUN','skip');
INSERT INTO "votes" VALUES('y9LRu0wszgk1uhYelyBq9','cHxGnYOhP2ji9mLIYM3NH','54AZ3c-17tbIATgggOOUN','maybe');
INSERT INTO "votes" VALUES('Nii9SlPB7UpcNzLPXkNAT','bQ5DxjfWMwwpsO2ufDhpD','CsN56WI96MWzVdtK5ndCB','maybe');
INSERT INTO "votes" VALUES('hgGKD9ZzrbslYILUUQ3m3','sJv9YSB1py_pIdbX4tPAd','CsN56WI96MWzVdtK5ndCB','interested');
INSERT INTO "votes" VALUES('h_cS19KuZuIbVFDdFDom2','Il_HSgpol8ZKlKLclekZK','CsN56WI96MWzVdtK5ndCB','skip');
INSERT INTO "votes" VALUES('NU2xDVtTHxRUyksysQY-e','quMzDV8BwAl7uNcaWlrbr','8gZclqE7cUhZ_rT-DVVZn','interested');
INSERT INTO "votes" VALUES('Wdl1MThR-UxxI2RvQXS-4','Q3beKjganPauknuCiuK9s','8gZclqE7cUhZ_rT-DVVZn','skip');
INSERT INTO "votes" VALUES('rKUCfR2dAwpocAW5ovCv4','mBbdBZ-DfYN4KQJjPzACA','8gZclqE7cUhZ_rT-DVVZn','interested');
INSERT INTO "votes" VALUES('EsaTyS94upvlngrqzK5eq','quMzDV8BwAl7uNcaWlrbr','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('KWQDFDmcvIPCuY346eJxQ','hI0QiYeyoiCOg0uAdAOyP','q4ko_ePN19-cW_e_L3bEX','interested');
INSERT INTO "votes" VALUES('FCkUhaocx3kU7-43gTrF5','Il_HSgpol8ZKlKLclekZK','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('luTCqm3km7WNdjIheCR6G','5Z004by81Tp5SegWP3YTb','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('Hu8VuVmMsosnSawPbD-zm','cHxGnYOhP2ji9mLIYM3NH','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('8fpeZbutv5WGZM24kxVP3','quMzDV8BwAl7uNcaWlrbr','XpP_IWzTZJc7bhuIXZWu-','maybe');
INSERT INTO "votes" VALUES('UqfnPvTEdUCUiXB72BSHR','hI0QiYeyoiCOg0uAdAOyP','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('nP54IbWesECH7HxIK_puW','mBbdBZ-DfYN4KQJjPzACA','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('smf8xAt2K0vdMQChRzhd8','quMzDV8BwAl7uNcaWlrbr','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('SAtjNvFxJCmvtUW_0Iqhw','hI0QiYeyoiCOg0uAdAOyP','7sjDl7aU6CXZYxNdkF7k1','maybe');
INSERT INTO "votes" VALUES('9Q7I4roigd7M0dqwbGj0A','Q3beKjganPauknuCiuK9s','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('hrYvnoVytds5iB_GtWYGU','sJv9YSB1py_pIdbX4tPAd','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('xZk9Ihd3DvOGuaVIsBXYI','quMzDV8BwAl7uNcaWlrbr','qO_V6CeV79jh7QhQJHf6O','interested');
INSERT INTO "votes" VALUES('m2uavXLBcmBpLJvFBxjGu','mBbdBZ-DfYN4KQJjPzACA','qO_V6CeV79jh7QhQJHf6O','maybe');
INSERT INTO "votes" VALUES('khWhuv8eCslOBUvD-4Hkl','cHxGnYOhP2ji9mLIYM3NH','qO_V6CeV79jh7QhQJHf6O','maybe');
INSERT INTO "votes" VALUES('bGdmuiHzMhmy48UAsEg08','quMzDV8BwAl7uNcaWlrbr','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('YG5EfKOz6mGj0M1c3AdU4','bQ5DxjfWMwwpsO2ufDhpD','sOuRdIQVeRwPfFWFyXo48','skip');
INSERT INTO "votes" VALUES('gHdvVXO3SCQcpSsGFTjDI','AagV5vh22Jk_gCHOIyffU','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('-LgHYFWJqVv9EQTz6s7B6','sJv9YSB1py_pIdbX4tPAd','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('w5mbV9SzY7KBxHYAKlyIE','Il_HSgpol8ZKlKLclekZK','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('hZfhPoZPy96MpOT6HrRqA','5Z004by81Tp5SegWP3YTb','sOuRdIQVeRwPfFWFyXo48','maybe');
INSERT INTO "votes" VALUES('sUSs0yOZ-AihKQ-dkV_lG','AagV5vh22Jk_gCHOIyffU','gz9KK1_5R_ETIpVa47El3','interested');
INSERT INTO "votes" VALUES('HUqCC_5mcletGa7j4kXmY','quMzDV8BwAl7uNcaWlrbr','1ULJ5jPsAcysGk3nNR_Ki','skip');
INSERT INTO "votes" VALUES('RLNL1qZYwgAjJBZzgRLew','bQ5DxjfWMwwpsO2ufDhpD','1ULJ5jPsAcysGk3nNR_Ki','interested');
INSERT INTO "votes" VALUES('lj8NIyeAbi8pOBuRUHzeF','Il_HSgpol8ZKlKLclekZK','1ULJ5jPsAcysGk3nNR_Ki','skip');
INSERT INTO "votes" VALUES('7BAWgI6PLF2jlX1J_-Gfb','5Z004by81Tp5SegWP3YTb','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('e1EcObZQqK7maOD8I0x_9','sJv9YSB1py_pIdbX4tPAd','0zT3gFfzRtEcwMgJl6VqQ','interested');
INSERT INTO "votes" VALUES('oUHxXFJe3c2oQc_Aopqh7','Il_HSgpol8ZKlKLclekZK','0zT3gFfzRtEcwMgJl6VqQ','interested');
INSERT INTO "votes" VALUES('dJK43DSjJzMRfzjGfL3Z2','quMzDV8BwAl7uNcaWlrbr','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('F3Yxcg18gvpH1B6Y-GsFX','Q3beKjganPauknuCiuK9s','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('QS0RvjjQX53S66hvUysJT','AagV5vh22Jk_gCHOIyffU','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('LgRwo5wGTFiNqoZOXnOys','sJv9YSB1py_pIdbX4tPAd','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('MOYlp00DoDoIkji_FpohW','Il_HSgpol8ZKlKLclekZK','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('JqhTWjcBI7Sa8MoctTxxs','5Z004by81Tp5SegWP3YTb','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('RzZMwvl8VS2SowUIrpZYc','Q3beKjganPauknuCiuK9s','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('O0Tz2aGPoXT_djA_H63eG','mBbdBZ-DfYN4KQJjPzACA','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('wwyri81ZnYae2kWrYr1ZC','hI0QiYeyoiCOg0uAdAOyP','3rPjbZGQYhwqJ45QrVe5y','maybe');
INSERT INTO "votes" VALUES('Nd581KZn8cOgu2FvIpONv','Q3beKjganPauknuCiuK9s','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('Ih348nO4onOpJrpgF0Hyp','AagV5vh22Jk_gCHOIyffU','3rPjbZGQYhwqJ45QrVe5y','maybe');
INSERT INTO "votes" VALUES('V2bYXgTpW-swoUYCV8TuC','cHxGnYOhP2ji9mLIYM3NH','3rPjbZGQYhwqJ45QrVe5y','skip');
INSERT INTO "votes" VALUES('I5BGzA5FVULJmucCYRejp','quMzDV8BwAl7uNcaWlrbr','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('riWyJdysd5Bn6UbJ-2x-r','bQ5DxjfWMwwpsO2ufDhpD','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('lMFkHjnZVOud7zYwSigVK','hI0QiYeyoiCOg0uAdAOyP','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('XFUt3sEN_nN4SBDlopvBN','AagV5vh22Jk_gCHOIyffU','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('Iz9fcI6Oei0dEYoGFyWr-','sJv9YSB1py_pIdbX4tPAd','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('UrW17plRvcjjUwvc9812y','Il_HSgpol8ZKlKLclekZK','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('z_ekO94jSx-f6BTfNK8Xt','cHxGnYOhP2ji9mLIYM3NH','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('YuX6V7BT9bO-xEyUsZyS6','ktz3QVsszOB-xxgHKYkeU','Tv2KOAulAooc4S7wgmCn7','maybe');
INSERT INTO "votes" VALUES('LuwNBuR1Rgbm6ScGDls2E','trH9gKWGp-IwZFjo3_PLi','Tv2KOAulAooc4S7wgmCn7','skip');
INSERT INTO "votes" VALUES('mS2If2LlvJ7E3y0tjF_tW','qCscSIMYLbg9Ab5uP9cP3','Tv2KOAulAooc4S7wgmCn7','skip');
INSERT INTO "votes" VALUES('XSD7OicRsYY_mkyeUSApi','gD2VsVURdrb-jzLIMS56s','Tv2KOAulAooc4S7wgmCn7','maybe');
INSERT INTO "votes" VALUES('10VP7Nv-ofiC_FLir_iaa','1PRyfHp0P6n4Va97b-06K','Tv2KOAulAooc4S7wgmCn7','skip');
INSERT INTO "votes" VALUES('6h5N0vWDGsC5OeOGxtaH2','QurDeTrWBESvmlvSuFHAy','Tv2KOAulAooc4S7wgmCn7','interested');
INSERT INTO "votes" VALUES('RzdaFrjkHXaZmY98-GhSh','f20B9bKK3F3mTkd5N5r1C','Tv2KOAulAooc4S7wgmCn7','interested');
INSERT INTO "votes" VALUES('8pSbI37ZzRFjZkvzS3_Cx','4sqU737gmLVho6GPf1ynB','Tv2KOAulAooc4S7wgmCn7','skip');
INSERT INTO "votes" VALUES('oPuAOlBqAfGYlpDaL8H64','ktz3QVsszOB-xxgHKYkeU','-hzLWgBt9Ly2PhX24ibPs','skip');
INSERT INTO "votes" VALUES('RnS53R7pBbW8UUyBstqVs','FU9j5lT4h2d1O1Xe4QZg7','-hzLWgBt9Ly2PhX24ibPs','skip');
INSERT INTO "votes" VALUES('MfqZ2bzLJG-CDC9KIj1nl','qCscSIMYLbg9Ab5uP9cP3','-hzLWgBt9Ly2PhX24ibPs','skip');
INSERT INTO "votes" VALUES('8FUsUqtuEQcAwSteY2BFn','gD2VsVURdrb-jzLIMS56s','-hzLWgBt9Ly2PhX24ibPs','interested');
INSERT INTO "votes" VALUES('rJduOyADBP3c8EMBy9hQk','QurDeTrWBESvmlvSuFHAy','-hzLWgBt9Ly2PhX24ibPs','skip');
INSERT INTO "votes" VALUES('zwAvcS68gsYIvjJ1qH-3X','hDAQ8kSxFgap3ceyt-Igj','-hzLWgBt9Ly2PhX24ibPs','maybe');
INSERT INTO "votes" VALUES('hdU02Eo-y2WBiYc_-Wkg3','yN1BzNfXfVRHJiEQLSe7O','Fnm-Abdz1ehN5EkTIKZIZ','maybe');
INSERT INTO "votes" VALUES('ZgEr1OAeD-xGvk3CPtR9X','qCscSIMYLbg9Ab5uP9cP3','Fnm-Abdz1ehN5EkTIKZIZ','interested');
INSERT INTO "votes" VALUES('JdTRijFBhfQ4qjvgJel-d','yj0-Vt5YnpHCV0PxfysGj','Fnm-Abdz1ehN5EkTIKZIZ','interested');
INSERT INTO "votes" VALUES('4zhX4xzp2P2zdAysZcLws','gAAT18AMLo72CgsS9k8cF','Fnm-Abdz1ehN5EkTIKZIZ','skip');
INSERT INTO "votes" VALUES('ZhDTbNv7p4ViP68ztHNd6','ymgAKfimjdaNlyjFAy_SJ','Fnm-Abdz1ehN5EkTIKZIZ','maybe');
INSERT INTO "votes" VALUES('1rTS22e5G9c-aK4uyZaXG','a_MvV7vhAs5yTTBaNcbfU','Fnm-Abdz1ehN5EkTIKZIZ','skip');
INSERT INTO "votes" VALUES('IoMyedGGAuCabJLt5Tq7d','f20B9bKK3F3mTkd5N5r1C','Fnm-Abdz1ehN5EkTIKZIZ','skip');
INSERT INTO "votes" VALUES('jwzYw4P0rBFgVPzmEk_Sj','4sqU737gmLVho6GPf1ynB','Fnm-Abdz1ehN5EkTIKZIZ','skip');
INSERT INTO "votes" VALUES('sY-FDRFbkPokIVPRRWeo3','uZ5CnIgG9thpBvI3Ppk_j','1TSQ9dPD-6927V4F0v5UA','skip');
INSERT INTO "votes" VALUES('OfVwJ5_zWBduOEmRlSGOA','trH9gKWGp-IwZFjo3_PLi','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('UpXes9hulGbF3gTPa2Ugc','FU9j5lT4h2d1O1Xe4QZg7','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('Cnc3j8Pv4YWsVV_GY5gB6','qCscSIMYLbg9Ab5uP9cP3','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('Q3GC5Ev3dIcvJgYPHpZYH','yj0-Vt5YnpHCV0PxfysGj','1TSQ9dPD-6927V4F0v5UA','maybe');
INSERT INTO "votes" VALUES('KjoNqoyWAvfdLuNfRTUTJ','1PRyfHp0P6n4Va97b-06K','1TSQ9dPD-6927V4F0v5UA','maybe');
INSERT INTO "votes" VALUES('aks5M-X-LgtHa-6YRVpHP','ymgAKfimjdaNlyjFAy_SJ','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('JkRrn689K6FSIITjrcRf1','f20B9bKK3F3mTkd5N5r1C','1TSQ9dPD-6927V4F0v5UA','maybe');
INSERT INTO "votes" VALUES('bLGOVNyFH-sMFil74Li5G','4sqU737gmLVho6GPf1ynB','1TSQ9dPD-6927V4F0v5UA','interested');
INSERT INTO "votes" VALUES('DqX0QutKFgMORvgD7JPAM','trH9gKWGp-IwZFjo3_PLi','0kmFtICfDcAglqxTgHR65','maybe');
INSERT INTO "votes" VALUES('bhsPT7iSrdL8xlR1iRM2t','FU9j5lT4h2d1O1Xe4QZg7','0kmFtICfDcAglqxTgHR65','maybe');
INSERT INTO "votes" VALUES('chyFWM9VoV8q7e-OUYYPB','1PRyfHp0P6n4Va97b-06K','0kmFtICfDcAglqxTgHR65','interested');
INSERT INTO "votes" VALUES('BNY4TUnctOUTiShcpZ2r2','hDAQ8kSxFgap3ceyt-Igj','0kmFtICfDcAglqxTgHR65','interested');
INSERT INTO "votes" VALUES('Cv6-stuztWjCWRCjH2DX5','i2q0pP8dzlyjc_qsuONqr','0kmFtICfDcAglqxTgHR65','interested');
INSERT INTO "votes" VALUES('jDdvJc-rMIaUCd6XUDR7G','qCscSIMYLbg9Ab5uP9cP3','09XNxNLF6W96uMTofi3E0','interested');
INSERT INTO "votes" VALUES('CmkJRRkiTFUN_IfIsr3eW','yj0-Vt5YnpHCV0PxfysGj','09XNxNLF6W96uMTofi3E0','maybe');
INSERT INTO "votes" VALUES('TougohehiICl_GVpK3sP0','gD2VsVURdrb-jzLIMS56s','09XNxNLF6W96uMTofi3E0','skip');
INSERT INTO "votes" VALUES('YkBbK5pAKFRUtfup21DSc','gAAT18AMLo72CgsS9k8cF','09XNxNLF6W96uMTofi3E0','interested');
INSERT INTO "votes" VALUES('3Y0hrN7nOa271xg_SJKvX','1PRyfHp0P6n4Va97b-06K','09XNxNLF6W96uMTofi3E0','skip');
INSERT INTO "votes" VALUES('QFFDpiGbox-wrmCPkElog','hDAQ8kSxFgap3ceyt-Igj','09XNxNLF6W96uMTofi3E0','maybe');
INSERT INTO "votes" VALUES('43cUjwpaQCSAgxnAhPy1g','i2q0pP8dzlyjc_qsuONqr','09XNxNLF6W96uMTofi3E0','maybe');
INSERT INTO "votes" VALUES('wo2B6dUGyQ8J9Yss5Pncz','trH9gKWGp-IwZFjo3_PLi','TBRGH7ZXR4hw5a-ywGIPO','skip');
INSERT INTO "votes" VALUES('jJJXFjAKQkdUOLx0b4Rw0','yN1BzNfXfVRHJiEQLSe7O','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('_wttOWC4cJVOY695KLiy5','qCscSIMYLbg9Ab5uP9cP3','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('m4_NTEiwD_ZsDXe-Qi1CV','2E-EQ8vHLpVnvu3JQan_Q','TBRGH7ZXR4hw5a-ywGIPO','maybe');
INSERT INTO "votes" VALUES('OMr7SBlBnPbhKzmNk0Sz6','1PRyfHp0P6n4Va97b-06K','TBRGH7ZXR4hw5a-ywGIPO','maybe');
INSERT INTO "votes" VALUES('p2yxtN9YpvJf3kDcv6GDb','a_MvV7vhAs5yTTBaNcbfU','TBRGH7ZXR4hw5a-ywGIPO','interested');
INSERT INTO "votes" VALUES('2i19QmV4TIF2c2lsflpQK','4sqU737gmLVho6GPf1ynB','TBRGH7ZXR4hw5a-ywGIPO','maybe');
INSERT INTO "votes" VALUES('Is9PyuvAz3IVQW7w91Y-K','trH9gKWGp-IwZFjo3_PLi','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('CvsrRv3K7MXg4SgoAudKa','yN1BzNfXfVRHJiEQLSe7O','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('-ka1NhRLpg59Y9iSX8rit','FU9j5lT4h2d1O1Xe4QZg7','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('R0IksPjYK9IVqU-OZ10d0','qCscSIMYLbg9Ab5uP9cP3','hbl72kbmidfWZQjJ27Jd8','maybe');
INSERT INTO "votes" VALUES('DGXz3y-Xn6Hwg1AAeDAFI','yj0-Vt5YnpHCV0PxfysGj','hbl72kbmidfWZQjJ27Jd8','skip');
INSERT INTO "votes" VALUES('05FZIDriTRZDzCt72nKp9','1PRyfHp0P6n4Va97b-06K','hbl72kbmidfWZQjJ27Jd8','interested');
INSERT INTO "votes" VALUES('CKgRwCoXcahHuJgzWIHoD','a_MvV7vhAs5yTTBaNcbfU','hbl72kbmidfWZQjJ27Jd8','maybe');
INSERT INTO "votes" VALUES('iZ2GNS-Mq7BqRLlt4kP99','f20B9bKK3F3mTkd5N5r1C','hbl72kbmidfWZQjJ27Jd8','maybe');
INSERT INTO "votes" VALUES('o4XrKATdGgkMslAHemaS0','i2q0pP8dzlyjc_qsuONqr','hbl72kbmidfWZQjJ27Jd8','maybe');
INSERT INTO "votes" VALUES('RB61vn11_-SMzqiNBsPKN','2E-EQ8vHLpVnvu3JQan_Q','xviuahijPP7FbbWYhKuBJ','skip');
INSERT INTO "votes" VALUES('NC7p75Hz1vYU8JTPs0Qw0','yj0-Vt5YnpHCV0PxfysGj','xviuahijPP7FbbWYhKuBJ','maybe');
INSERT INTO "votes" VALUES('P3QJ5CkaSi3t8tUC_m4rt','gD2VsVURdrb-jzLIMS56s','xviuahijPP7FbbWYhKuBJ','interested');
INSERT INTO "votes" VALUES('w5b9izMSrZzhxZ6vUb9Sg','gAAT18AMLo72CgsS9k8cF','xviuahijPP7FbbWYhKuBJ','interested');
INSERT INTO "votes" VALUES('RM58WOCPm-9DsZ73Fjq-K','1PRyfHp0P6n4Va97b-06K','xviuahijPP7FbbWYhKuBJ','interested');
INSERT INTO "votes" VALUES('tR6gj9O6_yowK1YaXl-Zg','ymgAKfimjdaNlyjFAy_SJ','xviuahijPP7FbbWYhKuBJ','interested');
INSERT INTO "votes" VALUES('ueyPm5BnmmV6yM67_3oc6','7IgRPZEmXBUltUkUpM6e8','xviuahijPP7FbbWYhKuBJ','maybe');
INSERT INTO "votes" VALUES('ub-tsMpDPvs_cXhleDSwU','hDAQ8kSxFgap3ceyt-Igj','xviuahijPP7FbbWYhKuBJ','maybe');
INSERT INTO "votes" VALUES('hdrhm6XoHoShS4eaUicU3','4sqU737gmLVho6GPf1ynB','xviuahijPP7FbbWYhKuBJ','interested');
INSERT INTO "votes" VALUES('wtXGKyf37AEIgbPy_Z-Lq','uZ5CnIgG9thpBvI3Ppk_j','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('HbD5fiLV1CIdCdw2ohDZf','ktz3QVsszOB-xxgHKYkeU','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('9px-fpZtLcpQwjVa-2pmm','trH9gKWGp-IwZFjo3_PLi','w7JdJDr5DDwEqnll6-W_E','interested');
INSERT INTO "votes" VALUES('HJasptpQiUNI_rWHuqVLz','qCscSIMYLbg9Ab5uP9cP3','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('hm7TAQJL-z0qTP4DOLn3X','gAAT18AMLo72CgsS9k8cF','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('B1QijynFi06tDz58TBFCo','hDAQ8kSxFgap3ceyt-Igj','w7JdJDr5DDwEqnll6-W_E','maybe');
INSERT INTO "votes" VALUES('n87NLp2RGr-Y-FwtA9MuQ','FU9j5lT4h2d1O1Xe4QZg7','HaUr-XMbez7ccCJO6DFe8','maybe');
INSERT INTO "votes" VALUES('ehiTPplGQA-up1PudUe9n','2E-EQ8vHLpVnvu3JQan_Q','HaUr-XMbez7ccCJO6DFe8','maybe');
INSERT INTO "votes" VALUES('xkBjagJ-s-k8XsQZkksNZ','gD2VsVURdrb-jzLIMS56s','HaUr-XMbez7ccCJO6DFe8','skip');
INSERT INTO "votes" VALUES('svVh0QJ-AiG6nHRrqgZhu','ymgAKfimjdaNlyjFAy_SJ','HaUr-XMbez7ccCJO6DFe8','interested');
INSERT INTO "votes" VALUES('-6ssq1vQNQP3F1JIYBBUj','a_MvV7vhAs5yTTBaNcbfU','HaUr-XMbez7ccCJO6DFe8','interested');
INSERT INTO "votes" VALUES('JpWQHCxrys8Isx1rBSY2b','QurDeTrWBESvmlvSuFHAy','HaUr-XMbez7ccCJO6DFe8','skip');
INSERT INTO "votes" VALUES('JIFBsvEeJSNXRyZ9idfCR','7IgRPZEmXBUltUkUpM6e8','HaUr-XMbez7ccCJO6DFe8','skip');
INSERT INTO "votes" VALUES('V1cFBcU1QleEdK7si28d9','hDAQ8kSxFgap3ceyt-Igj','HaUr-XMbez7ccCJO6DFe8','interested');
INSERT INTO "votes" VALUES('AS_j_CB5QWM35DjwqAsFc','i2q0pP8dzlyjc_qsuONqr','HaUr-XMbez7ccCJO6DFe8','interested');
INSERT INTO "votes" VALUES('mXlEBZypAj0s4AxSpfNst','trH9gKWGp-IwZFjo3_PLi','NAr9AK8oCXDTlilPDLP_m','interested');
INSERT INTO "votes" VALUES('0VjTwdi3H-u4R2xGLOqIw','QurDeTrWBESvmlvSuFHAy','NAr9AK8oCXDTlilPDLP_m','maybe');
INSERT INTO "votes" VALUES('dyqOrQjNjgqFiJXW_g3cT','4sqU737gmLVho6GPf1ynB','NAr9AK8oCXDTlilPDLP_m','skip');
INSERT INTO "votes" VALUES('17RetoRv-n6b-PNz8Q7pS','FU9j5lT4h2d1O1Xe4QZg7','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('6yiIpRADY95Y0J0WDVYVk','qCscSIMYLbg9Ab5uP9cP3','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('FbGiOunFdHkzKaA9bjdIc','yj0-Vt5YnpHCV0PxfysGj','vmSOueGekeVkyJjQSrzT4','maybe');
INSERT INTO "votes" VALUES('N0HEkBTQM8tSNmwnCB9Cl','a_MvV7vhAs5yTTBaNcbfU','vmSOueGekeVkyJjQSrzT4','maybe');
INSERT INTO "votes" VALUES('hAyE6nEv8H6L0Jh7CQKCN','7IgRPZEmXBUltUkUpM6e8','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('Bu2QzUu6TbQEyoVWPGPrq','f20B9bKK3F3mTkd5N5r1C','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('h820_KLJBP3CJ8Uyxx1ht','i2q0pP8dzlyjc_qsuONqr','vmSOueGekeVkyJjQSrzT4','skip');
INSERT INTO "votes" VALUES('J3YNb4epRgIF4NPZYyK4A','4sqU737gmLVho6GPf1ynB','vmSOueGekeVkyJjQSrzT4','interested');
INSERT INTO "votes" VALUES('CUu9y5i1Rs0TwiHfo98d2','uZ5CnIgG9thpBvI3Ppk_j','QsZDe1kfpP9ZZp5tnJ84s','interested');
INSERT INTO "votes" VALUES('P5rJG2Swb-e0890f4quEi','ktz3QVsszOB-xxgHKYkeU','QsZDe1kfpP9ZZp5tnJ84s','skip');
INSERT INTO "votes" VALUES('jNkky8NQzSiSsk4vXUs97','qCscSIMYLbg9Ab5uP9cP3','QsZDe1kfpP9ZZp5tnJ84s','skip');
INSERT INTO "votes" VALUES('k-umyQyAKse0rMDcCWVBi','2E-EQ8vHLpVnvu3JQan_Q','QsZDe1kfpP9ZZp5tnJ84s','maybe');
INSERT INTO "votes" VALUES('hJWxwXmGG-7P4fJ4CQQzD','ymgAKfimjdaNlyjFAy_SJ','QsZDe1kfpP9ZZp5tnJ84s','maybe');
INSERT INTO "votes" VALUES('qf1AakO7p1cOHdhkmO1u4','7IgRPZEmXBUltUkUpM6e8','QsZDe1kfpP9ZZp5tnJ84s','interested');
INSERT INTO "votes" VALUES('EpKk-FCmFMHdFw50-s3To','f20B9bKK3F3mTkd5N5r1C','QsZDe1kfpP9ZZp5tnJ84s','maybe');
INSERT INTO "votes" VALUES('WDRQhnoUOcXM_I4FgWCl7','hDAQ8kSxFgap3ceyt-Igj','QsZDe1kfpP9ZZp5tnJ84s','maybe');
INSERT INTO "votes" VALUES('y__I6b1Mj-8X1ewYRpgi1','i2q0pP8dzlyjc_qsuONqr','QsZDe1kfpP9ZZp5tnJ84s','skip');
INSERT INTO "votes" VALUES('bO8oBRWBADOnmFno2Ov_q','4sqU737gmLVho6GPf1ynB','QsZDe1kfpP9ZZp5tnJ84s','maybe');
INSERT INTO "votes" VALUES('f4_rahlINRSkXibD0v-j3','FU9j5lT4h2d1O1Xe4QZg7','B5125stOsb8vn8HGBEtw0','skip');
INSERT INTO "votes" VALUES('6kcvu33tJ1eO3-I2E2UK6','2E-EQ8vHLpVnvu3JQan_Q','B5125stOsb8vn8HGBEtw0','maybe');
INSERT INTO "votes" VALUES('u7HwjCZ-T33y4phbIL-XE','gAAT18AMLo72CgsS9k8cF','B5125stOsb8vn8HGBEtw0','skip');
INSERT INTO "votes" VALUES('z5FnJ1rt365lKQx26cfkm','1PRyfHp0P6n4Va97b-06K','B5125stOsb8vn8HGBEtw0','skip');
INSERT INTO "votes" VALUES('68fN4jscPzOzUFEY0iPcd','QurDeTrWBESvmlvSuFHAy','B5125stOsb8vn8HGBEtw0','interested');
INSERT INTO "votes" VALUES('scL_Puc1Z2e1wiZVMZ28y','7IgRPZEmXBUltUkUpM6e8','B5125stOsb8vn8HGBEtw0','interested');
INSERT INTO "votes" VALUES('kHAazQLr1MOqSjNGR8_rJ','i2q0pP8dzlyjc_qsuONqr','B5125stOsb8vn8HGBEtw0','skip');
INSERT INTO "votes" VALUES('ikbUx074yUVQIE3eyyg5E','yN1BzNfXfVRHJiEQLSe7O','qDfilKr-_aFNQiGR7nPFy','maybe');
INSERT INTO "votes" VALUES('jwq365lRNuCJEAmUZ5Lbp','FU9j5lT4h2d1O1Xe4QZg7','qDfilKr-_aFNQiGR7nPFy','maybe');
INSERT INTO "votes" VALUES('7TS1vkDU1zbfUZcK08ldE','qCscSIMYLbg9Ab5uP9cP3','qDfilKr-_aFNQiGR7nPFy','skip');
INSERT INTO "votes" VALUES('AI26avzpeq6xJjEcx60zF','gD2VsVURdrb-jzLIMS56s','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('tQUbw0KQ-ipmEt4XFefAW','gAAT18AMLo72CgsS9k8cF','qDfilKr-_aFNQiGR7nPFy','interested');
INSERT INTO "votes" VALUES('7DIJ5CoWYk4v343saIMMt','hDAQ8kSxFgap3ceyt-Igj','qDfilKr-_aFNQiGR7nPFy','maybe');
INSERT INTO "votes" VALUES('gZl3GDzs8x6tzWB3YQII_','yj0-Vt5YnpHCV0PxfysGj','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('iRjoI5yrjpx_LiBlr7ca2','gD2VsVURdrb-jzLIMS56s','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('YlmfY2q5dja3Vsv2J7op_','a_MvV7vhAs5yTTBaNcbfU','AWd3Xn3wBU7_TdfKAbXbC','maybe');
INSERT INTO "votes" VALUES('TmPrdtuHVtY2bkneYK-C1','hDAQ8kSxFgap3ceyt-Igj','AWd3Xn3wBU7_TdfKAbXbC','interested');
INSERT INTO "votes" VALUES('mmZPwqF3qHUO6ujLEptA2','gD2VsVURdrb-jzLIMS56s','I96Xr6Zdn2Vv-li7DY2fV','maybe');
INSERT INTO "votes" VALUES('MORXrNXbkRzPfXq493lZ-','gAAT18AMLo72CgsS9k8cF','I96Xr6Zdn2Vv-li7DY2fV','interested');
INSERT INTO "votes" VALUES('qvxGrxVAO-Nvks85tZdAr','a_MvV7vhAs5yTTBaNcbfU','I96Xr6Zdn2Vv-li7DY2fV','interested');
INSERT INTO "votes" VALUES('EtjwWDttEOlTzkcrW2-J7','QurDeTrWBESvmlvSuFHAy','I96Xr6Zdn2Vv-li7DY2fV','skip');
INSERT INTO "votes" VALUES('VS5OMnyoCjaJFWoxrpKR_','7IgRPZEmXBUltUkUpM6e8','I96Xr6Zdn2Vv-li7DY2fV','skip');
INSERT INTO "votes" VALUES('Uzfb5xYRAD2kLEtva-dxc','ktz3QVsszOB-xxgHKYkeU','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('-eoNRtKxXfo8gXz5TlUxk','FU9j5lT4h2d1O1Xe4QZg7','uHy3QVPE1vUe5ivWh7C6_','maybe');
INSERT INTO "votes" VALUES('up-12qkh4-28jKV-kf22G','qCscSIMYLbg9Ab5uP9cP3','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('MEb5pehTfO2CSlSKmsFMW','QurDeTrWBESvmlvSuFHAy','uHy3QVPE1vUe5ivWh7C6_','interested');
INSERT INTO "votes" VALUES('gMPvuUo0WUg8bPBB2EHaA','f20B9bKK3F3mTkd5N5r1C','uHy3QVPE1vUe5ivWh7C6_','skip');
INSERT INTO "votes" VALUES('BSPqv7Mj69T7bGKecLTe3','uZ5CnIgG9thpBvI3Ppk_j','sKAansNfnpR008lhmHKQe','skip');
INSERT INTO "votes" VALUES('jJBwTlUJXUs5Xgzo3ZRGE','ktz3QVsszOB-xxgHKYkeU','sKAansNfnpR008lhmHKQe','maybe');
INSERT INTO "votes" VALUES('QBdkGpuZEOsnnrA79_a_m','2E-EQ8vHLpVnvu3JQan_Q','sKAansNfnpR008lhmHKQe','skip');
INSERT INTO "votes" VALUES('k57wU4ybJnZO0ZvYoinBe','gD2VsVURdrb-jzLIMS56s','sKAansNfnpR008lhmHKQe','interested');
INSERT INTO "votes" VALUES('PWGL6k5lgvE230yUimJH4','a_MvV7vhAs5yTTBaNcbfU','sKAansNfnpR008lhmHKQe','skip');
INSERT INTO "votes" VALUES('LKFNAfepGo3YES72a0k_b','7IgRPZEmXBUltUkUpM6e8','sKAansNfnpR008lhmHKQe','skip');
INSERT INTO "votes" VALUES('UXE6oxmeACeBFoQhFYgaw','4sqU737gmLVho6GPf1ynB','sKAansNfnpR008lhmHKQe','maybe');
INSERT INTO "votes" VALUES('U_fya-nKF9afZlIsQ37Br','ktz3QVsszOB-xxgHKYkeU','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('sdHYdqcoFUvEY1q7-ku3X','trH9gKWGp-IwZFjo3_PLi','cTi6oXuNbhyiYwiTPSpA6','interested');
INSERT INTO "votes" VALUES('TCntTXkpE4FeE3qZH8LBV','gAAT18AMLo72CgsS9k8cF','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('wBgMyRhXIca4Do69Z4Qxw','1PRyfHp0P6n4Va97b-06K','cTi6oXuNbhyiYwiTPSpA6','interested');
INSERT INTO "votes" VALUES('NXuUZ_i6Sx5dKI3ac4x0O','ymgAKfimjdaNlyjFAy_SJ','cTi6oXuNbhyiYwiTPSpA6','skip');
INSERT INTO "votes" VALUES('bQrfnQAzQpDmunVitzhQG','hDAQ8kSxFgap3ceyt-Igj','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('gwK64qmEQTDcj68MPuAJ8','i2q0pP8dzlyjc_qsuONqr','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('OAE8__DzfqMHyV1slKUWm','4sqU737gmLVho6GPf1ynB','cTi6oXuNbhyiYwiTPSpA6','maybe');
INSERT INTO "votes" VALUES('PqczA_LRyGA1q5Tv4CcYr','uZ5CnIgG9thpBvI3Ppk_j','LydZG3AsWh7pTgAaPQHQS','skip');
INSERT INTO "votes" VALUES('1awqq2HxtyfLdXDoOI1jM','ktz3QVsszOB-xxgHKYkeU','LydZG3AsWh7pTgAaPQHQS','interested');
INSERT INTO "votes" VALUES('pWtsxhNrMBIssu3fhkx8G','yj0-Vt5YnpHCV0PxfysGj','LydZG3AsWh7pTgAaPQHQS','maybe');
INSERT INTO "votes" VALUES('sj2bLwj5--HyD6WMzUc00','ymgAKfimjdaNlyjFAy_SJ','LydZG3AsWh7pTgAaPQHQS','interested');
INSERT INTO "votes" VALUES('i847PJVktmvbxtlor_bJt','a_MvV7vhAs5yTTBaNcbfU','LydZG3AsWh7pTgAaPQHQS','maybe');
INSERT INTO "votes" VALUES('Qbker0qm3lGrW5Kdb0RfP','QurDeTrWBESvmlvSuFHAy','LydZG3AsWh7pTgAaPQHQS','maybe');
INSERT INTO "votes" VALUES('4VRkH-jD19PdA-0stZzNz','hDAQ8kSxFgap3ceyt-Igj','LydZG3AsWh7pTgAaPQHQS','maybe');
INSERT INTO "votes" VALUES('_EqYwnQuqqlvG3BYVqlKl','uZ5CnIgG9thpBvI3Ppk_j','etUL1rohSL1qIk_q3yI6i','interested');
INSERT INTO "votes" VALUES('vF5IHH_hpUrn5jcr2tyZW','yN1BzNfXfVRHJiEQLSe7O','etUL1rohSL1qIk_q3yI6i','interested');
INSERT INTO "votes" VALUES('ZkZ3km3hrySSaRzYQG2vq','qCscSIMYLbg9Ab5uP9cP3','etUL1rohSL1qIk_q3yI6i','skip');
INSERT INTO "votes" VALUES('Hg_TKYQ0VndWbHj21ph3m','yj0-Vt5YnpHCV0PxfysGj','etUL1rohSL1qIk_q3yI6i','skip');
INSERT INTO "votes" VALUES('aX0UJjD0UisaWbMgmhcF_','gD2VsVURdrb-jzLIMS56s','etUL1rohSL1qIk_q3yI6i','maybe');
INSERT INTO "votes" VALUES('Wgg_FyYUFLgN6PU4p-mVz','1PRyfHp0P6n4Va97b-06K','etUL1rohSL1qIk_q3yI6i','skip');
INSERT INTO "votes" VALUES('HubwvszAi-LIuLwgiskDT','i2q0pP8dzlyjc_qsuONqr','etUL1rohSL1qIk_q3yI6i','interested');
INSERT INTO "votes" VALUES('cROU0Ac96-YY0jwjrfBs6','ktz3QVsszOB-xxgHKYkeU','QBWUzhQrfO8xsv-RRGXrU','maybe');
INSERT INTO "votes" VALUES('wMUKPWKTDkNzosnlN3uU8','qCscSIMYLbg9Ab5uP9cP3','QBWUzhQrfO8xsv-RRGXrU','skip');
INSERT INTO "votes" VALUES('HnV0yd71lxQQx9wO9acxM','yj0-Vt5YnpHCV0PxfysGj','QBWUzhQrfO8xsv-RRGXrU','skip');
INSERT INTO "votes" VALUES('o_fwwAuZOVRkpudSLZfsd','gD2VsVURdrb-jzLIMS56s','QBWUzhQrfO8xsv-RRGXrU','maybe');
INSERT INTO "votes" VALUES('IX5qR7hiCArkHnKVYBmfk','gAAT18AMLo72CgsS9k8cF','QBWUzhQrfO8xsv-RRGXrU','maybe');
INSERT INTO "votes" VALUES('QxePdNY0deFcWe6-LzpRQ','7IgRPZEmXBUltUkUpM6e8','QBWUzhQrfO8xsv-RRGXrU','interested');
INSERT INTO "votes" VALUES('ToTciTF5007r9DC-I5ANk','i2q0pP8dzlyjc_qsuONqr','QBWUzhQrfO8xsv-RRGXrU','interested');
INSERT INTO "votes" VALUES('NHJeU7kinNsVFjpZH5NPK','trH9gKWGp-IwZFjo3_PLi','r-ws6d4dMfhGZxoCq-Ro3','maybe');
INSERT INTO "votes" VALUES('zhS1DtJ2ZIEOsHpkt5s39','FU9j5lT4h2d1O1Xe4QZg7','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('aENtWuAHmDj7QHHKteT6j','qCscSIMYLbg9Ab5uP9cP3','r-ws6d4dMfhGZxoCq-Ro3','maybe');
INSERT INTO "votes" VALUES('0MGCGU9mzTh7UZCFLKSa-','gD2VsVURdrb-jzLIMS56s','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('rtKGQe6IEdFxwKDwMQa9e','1PRyfHp0P6n4Va97b-06K','r-ws6d4dMfhGZxoCq-Ro3','maybe');
INSERT INTO "votes" VALUES('vyWnqeBGwzWZ-ZEOtgxyl','f20B9bKK3F3mTkd5N5r1C','r-ws6d4dMfhGZxoCq-Ro3','interested');
INSERT INTO "votes" VALUES('ejSNKSuXG7p0A_Atx6eqO','trH9gKWGp-IwZFjo3_PLi','54AZ3c-17tbIATgggOOUN','maybe');
INSERT INTO "votes" VALUES('Gvfrl8cJtQBmefTdozPPg','yN1BzNfXfVRHJiEQLSe7O','54AZ3c-17tbIATgggOOUN','interested');
INSERT INTO "votes" VALUES('ka_JFLiD-JY5k86uU_1VA','FU9j5lT4h2d1O1Xe4QZg7','54AZ3c-17tbIATgggOOUN','skip');
INSERT INTO "votes" VALUES('aagfla5sqEezRI_ppn7fl','qCscSIMYLbg9Ab5uP9cP3','54AZ3c-17tbIATgggOOUN','maybe');
INSERT INTO "votes" VALUES('2m81joP9jLmXXPM2gInKJ','yj0-Vt5YnpHCV0PxfysGj','54AZ3c-17tbIATgggOOUN','skip');
INSERT INTO "votes" VALUES('xCF6DXpZbhEm_GBAuXffl','gAAT18AMLo72CgsS9k8cF','54AZ3c-17tbIATgggOOUN','interested');
INSERT INTO "votes" VALUES('O0aV-s1Jnmho2AHLvVN4Z','1PRyfHp0P6n4Va97b-06K','54AZ3c-17tbIATgggOOUN','interested');
INSERT INTO "votes" VALUES('xtUnMBrGJEvEgdZbLbLYJ','ymgAKfimjdaNlyjFAy_SJ','54AZ3c-17tbIATgggOOUN','interested');
INSERT INTO "votes" VALUES('Y9aEohwtjbQt5wCOGnkY2','f20B9bKK3F3mTkd5N5r1C','54AZ3c-17tbIATgggOOUN','skip');
INSERT INTO "votes" VALUES('qO6f0FE_hhrrXkjHxf3I2','4sqU737gmLVho6GPf1ynB','54AZ3c-17tbIATgggOOUN','maybe');
INSERT INTO "votes" VALUES('i6tsmOxRXuFTBOtde6I9e','uZ5CnIgG9thpBvI3Ppk_j','CsN56WI96MWzVdtK5ndCB','skip');
INSERT INTO "votes" VALUES('hNYuiG05YvwOKOK6k-b7W','FU9j5lT4h2d1O1Xe4QZg7','CsN56WI96MWzVdtK5ndCB','skip');
INSERT INTO "votes" VALUES('MmOoaA1rf4-n8FAx2x6cz','qCscSIMYLbg9Ab5uP9cP3','CsN56WI96MWzVdtK5ndCB','maybe');
INSERT INTO "votes" VALUES('gdoyhMANGuV37OuIs8S5m','2E-EQ8vHLpVnvu3JQan_Q','CsN56WI96MWzVdtK5ndCB','maybe');
INSERT INTO "votes" VALUES('h7IwC3-HyvwsXjBNSryin','1PRyfHp0P6n4Va97b-06K','CsN56WI96MWzVdtK5ndCB','interested');
INSERT INTO "votes" VALUES('uhy9djpxpZXGSSdSTfLHQ','i2q0pP8dzlyjc_qsuONqr','CsN56WI96MWzVdtK5ndCB','skip');
INSERT INTO "votes" VALUES('m9kNioVURYcEbRZmk6Fmv','4sqU737gmLVho6GPf1ynB','CsN56WI96MWzVdtK5ndCB','skip');
INSERT INTO "votes" VALUES('QBkSqKhEr-1yZNx95Db1j','ktz3QVsszOB-xxgHKYkeU','8gZclqE7cUhZ_rT-DVVZn','interested');
INSERT INTO "votes" VALUES('CRlOJwz3OD1lY9ID_aR5Z','trH9gKWGp-IwZFjo3_PLi','8gZclqE7cUhZ_rT-DVVZn','maybe');
INSERT INTO "votes" VALUES('FGfC8WvSRKN4V1N8d7ecG','4sqU737gmLVho6GPf1ynB','8gZclqE7cUhZ_rT-DVVZn','maybe');
INSERT INTO "votes" VALUES('TLojVdcBq5KqAHel-ulFu','ktz3QVsszOB-xxgHKYkeU','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('RjFxR2w505u-x0SCqirDZ','yN1BzNfXfVRHJiEQLSe7O','q4ko_ePN19-cW_e_L3bEX','interested');
INSERT INTO "votes" VALUES('5WccG-XJ8k-h-0PXiXkIS','FU9j5lT4h2d1O1Xe4QZg7','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('MIbWvtvdHH6HZS1mk4bVW','qCscSIMYLbg9Ab5uP9cP3','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('d23dGiyL4XCaiMyXL2Rcz','yj0-Vt5YnpHCV0PxfysGj','q4ko_ePN19-cW_e_L3bEX','skip');
INSERT INTO "votes" VALUES('hsbULpVrTRU_LNmXaGIFQ','7IgRPZEmXBUltUkUpM6e8','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('3qk5tjJRIVy6tza2V54V8','f20B9bKK3F3mTkd5N5r1C','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('HOKUD-Ez4LUDhdzWeeGHc','hDAQ8kSxFgap3ceyt-Igj','q4ko_ePN19-cW_e_L3bEX','skip');
INSERT INTO "votes" VALUES('HveGe4b3KC-uMbAFZ96cd','i2q0pP8dzlyjc_qsuONqr','q4ko_ePN19-cW_e_L3bEX','maybe');
INSERT INTO "votes" VALUES('pcj8rAmK4uczQdFRvfciV','trH9gKWGp-IwZFjo3_PLi','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('Vkh96xyZ8EomwPXZuWONd','2E-EQ8vHLpVnvu3JQan_Q','XpP_IWzTZJc7bhuIXZWu-','maybe');
INSERT INTO "votes" VALUES('PRbXwtAkEWSJNGC2HMDV3','yj0-Vt5YnpHCV0PxfysGj','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('GMye81mYqK2CmlfvExe5B','gD2VsVURdrb-jzLIMS56s','XpP_IWzTZJc7bhuIXZWu-','maybe');
INSERT INTO "votes" VALUES('OPTlzjeZjXKt00j2j20ks','gAAT18AMLo72CgsS9k8cF','XpP_IWzTZJc7bhuIXZWu-','maybe');
INSERT INTO "votes" VALUES('YpzMYkqTvBskLqnAQ-apR','a_MvV7vhAs5yTTBaNcbfU','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('SkNZ2LjGioDxat7ORXbiO','7IgRPZEmXBUltUkUpM6e8','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('xlooOroBT0qbIt72Byo54','f20B9bKK3F3mTkd5N5r1C','XpP_IWzTZJc7bhuIXZWu-','interested');
INSERT INTO "votes" VALUES('pauo9_2lMe9mlsLgLMh-p','4sqU737gmLVho6GPf1ynB','XpP_IWzTZJc7bhuIXZWu-','skip');
INSERT INTO "votes" VALUES('BXx0STEXuIiiy-0g5fi6E','uZ5CnIgG9thpBvI3Ppk_j','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('__KFNvIrhQKtp3NGJgCYh','trH9gKWGp-IwZFjo3_PLi','7sjDl7aU6CXZYxNdkF7k1','skip');
INSERT INTO "votes" VALUES('gxxx_mx5UW9k1dY75AYlI','gAAT18AMLo72CgsS9k8cF','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('mDNblDy3HrOvbJyG5fkqf','a_MvV7vhAs5yTTBaNcbfU','7sjDl7aU6CXZYxNdkF7k1','maybe');
INSERT INTO "votes" VALUES('9N9ZS_dkc7sxIVyUdYAmv','i2q0pP8dzlyjc_qsuONqr','7sjDl7aU6CXZYxNdkF7k1','interested');
INSERT INTO "votes" VALUES('sLmLLwWmNTC_L2lieiLr1','uZ5CnIgG9thpBvI3Ppk_j','qO_V6CeV79jh7QhQJHf6O','interested');
INSERT INTO "votes" VALUES('pRDj-MHQTCe3prXl5NNcL','yN1BzNfXfVRHJiEQLSe7O','qO_V6CeV79jh7QhQJHf6O','interested');
INSERT INTO "votes" VALUES('osH6VZTpS9tqC7YEd0qQg','qCscSIMYLbg9Ab5uP9cP3','qO_V6CeV79jh7QhQJHf6O','skip');
INSERT INTO "votes" VALUES('TC7MviDD5X6_M4642QGFG','2E-EQ8vHLpVnvu3JQan_Q','qO_V6CeV79jh7QhQJHf6O','maybe');
INSERT INTO "votes" VALUES('EC2GhSc1085UYCc7Mw4FA','yj0-Vt5YnpHCV0PxfysGj','qO_V6CeV79jh7QhQJHf6O','maybe');
INSERT INTO "votes" VALUES('D_D52ORzvzMZSwuONXNOY','ymgAKfimjdaNlyjFAy_SJ','qO_V6CeV79jh7QhQJHf6O','interested');
INSERT INTO "votes" VALUES('rAYADTkF7nM2OSVodrkm1','a_MvV7vhAs5yTTBaNcbfU','qO_V6CeV79jh7QhQJHf6O','interested');
INSERT INTO "votes" VALUES('ZxC4G4JrtUORgpebZFiVK','ktz3QVsszOB-xxgHKYkeU','sOuRdIQVeRwPfFWFyXo48','maybe');
INSERT INTO "votes" VALUES('7G9KldahnYVqYhPpbM3Ki','FU9j5lT4h2d1O1Xe4QZg7','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('Bgjg8qOcm-ecBJ54Qri93','qCscSIMYLbg9Ab5uP9cP3','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('847GEumwz4mai2zbdUdjC','yj0-Vt5YnpHCV0PxfysGj','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('EBpqF92EHxkvTGWaHC6hX','gD2VsVURdrb-jzLIMS56s','sOuRdIQVeRwPfFWFyXo48','maybe');
INSERT INTO "votes" VALUES('HPfoyr3drMoIjmV8hP_8T','gAAT18AMLo72CgsS9k8cF','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('d5yndITgoMmNzEdPZatt-','1PRyfHp0P6n4Va97b-06K','sOuRdIQVeRwPfFWFyXo48','skip');
INSERT INTO "votes" VALUES('liEf-NeLIpySqmkgnwJQ2','QurDeTrWBESvmlvSuFHAy','sOuRdIQVeRwPfFWFyXo48','maybe');
INSERT INTO "votes" VALUES('bzL2pTDo8EpmGV9jsckdk','f20B9bKK3F3mTkd5N5r1C','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('Nje8bH8WxA0nybTKK9n4Q','4sqU737gmLVho6GPf1ynB','sOuRdIQVeRwPfFWFyXo48','interested');
INSERT INTO "votes" VALUES('XjIbKYom0_DmZ9-3hQaQe','gAAT18AMLo72CgsS9k8cF','gz9KK1_5R_ETIpVa47El3','skip');
INSERT INTO "votes" VALUES('xM0MpmnyJhe7WgNE4h5IU','1PRyfHp0P6n4Va97b-06K','gz9KK1_5R_ETIpVa47El3','interested');
INSERT INTO "votes" VALUES('HCs0IGu7Jjeg_Cv1fSdjX','ymgAKfimjdaNlyjFAy_SJ','gz9KK1_5R_ETIpVa47El3','skip');
INSERT INTO "votes" VALUES('IkgNFCoUaEyvuPJfHlxPZ','QurDeTrWBESvmlvSuFHAy','gz9KK1_5R_ETIpVa47El3','maybe');
INSERT INTO "votes" VALUES('JS_Mo6wXBd5fOddc5jANH','7IgRPZEmXBUltUkUpM6e8','gz9KK1_5R_ETIpVa47El3','maybe');
INSERT INTO "votes" VALUES('1IHhTy7p4ZBAlixnd6d_G','hDAQ8kSxFgap3ceyt-Igj','gz9KK1_5R_ETIpVa47El3','skip');
INSERT INTO "votes" VALUES('mCnsSp9xfazeslrYxD6Xf','4sqU737gmLVho6GPf1ynB','gz9KK1_5R_ETIpVa47El3','maybe');
INSERT INTO "votes" VALUES('MV899TLeJWE1WDC2VEUuD','trH9gKWGp-IwZFjo3_PLi','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('YU4o4L582ZYuHZYlfikEb','yN1BzNfXfVRHJiEQLSe7O','1ULJ5jPsAcysGk3nNR_Ki','interested');
INSERT INTO "votes" VALUES('8NSvPtS0VVh3ImNaTG67t','FU9j5lT4h2d1O1Xe4QZg7','1ULJ5jPsAcysGk3nNR_Ki','interested');
INSERT INTO "votes" VALUES('e7BhwJQuu7XZjBnJnKorN','2E-EQ8vHLpVnvu3JQan_Q','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('i0k6naRywylkmweg8npOg','yj0-Vt5YnpHCV0PxfysGj','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('zezYeCsqxuO0J9pU28EDe','gAAT18AMLo72CgsS9k8cF','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('m4eMfwKG7lUkNbvBD_uWD','ymgAKfimjdaNlyjFAy_SJ','1ULJ5jPsAcysGk3nNR_Ki','interested');
INSERT INTO "votes" VALUES('7iFe4wTQe7nV4Fj2X4IsK','i2q0pP8dzlyjc_qsuONqr','1ULJ5jPsAcysGk3nNR_Ki','maybe');
INSERT INTO "votes" VALUES('Gs0mdC682An-t9rAhCbVO','uZ5CnIgG9thpBvI3Ppk_j','0zT3gFfzRtEcwMgJl6VqQ','maybe');
INSERT INTO "votes" VALUES('Q74dMTp1gS3x5BbJTTEVB','ktz3QVsszOB-xxgHKYkeU','0zT3gFfzRtEcwMgJl6VqQ','maybe');
INSERT INTO "votes" VALUES('ouz-_REZqD6WLCnTRyPUl','yj0-Vt5YnpHCV0PxfysGj','0zT3gFfzRtEcwMgJl6VqQ','interested');
INSERT INTO "votes" VALUES('hwM0eM7FVlDuefm2kW7ow','1PRyfHp0P6n4Va97b-06K','0zT3gFfzRtEcwMgJl6VqQ','maybe');
INSERT INTO "votes" VALUES('xLnQf0R4MUY85X1r4Wmil','ymgAKfimjdaNlyjFAy_SJ','0zT3gFfzRtEcwMgJl6VqQ','maybe');
INSERT INTO "votes" VALUES('FXVz1oWX4r0oehkXKrCwa','hDAQ8kSxFgap3ceyt-Igj','0zT3gFfzRtEcwMgJl6VqQ','interested');
INSERT INTO "votes" VALUES('n_57WB9GaL2FhO0OLQenv','4sqU737gmLVho6GPf1ynB','0zT3gFfzRtEcwMgJl6VqQ','interested');
INSERT INTO "votes" VALUES('xFRnfgG5Z7pyErkPmu4nR','yN1BzNfXfVRHJiEQLSe7O','i_qdUdPhSK8wvaON8JFLu','skip');
INSERT INTO "votes" VALUES('GDePtiRDXnreQ4wh9iLT5','qCscSIMYLbg9Ab5uP9cP3','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('wL5fGp2vZS3SLAd9HwB-G','gD2VsVURdrb-jzLIMS56s','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('A4MLnqhSrMdFMQ53irRDB','1PRyfHp0P6n4Va97b-06K','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('M96OnFxywp-dQpNF1BmGr','QurDeTrWBESvmlvSuFHAy','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('lsYiNy8s53U7oO3eEK5OL','f20B9bKK3F3mTkd5N5r1C','i_qdUdPhSK8wvaON8JFLu','skip');
INSERT INTO "votes" VALUES('pZEZfuaXulAad99wS-ghW','hDAQ8kSxFgap3ceyt-Igj','i_qdUdPhSK8wvaON8JFLu','skip');
INSERT INTO "votes" VALUES('8lAqXDDWTjSOOi9OEzNnE','i2q0pP8dzlyjc_qsuONqr','i_qdUdPhSK8wvaON8JFLu','interested');
INSERT INTO "votes" VALUES('JYBlKwFg9Io0NZ7uSyBc9','4sqU737gmLVho6GPf1ynB','i_qdUdPhSK8wvaON8JFLu','maybe');
INSERT INTO "votes" VALUES('pReIBoXSu4BZ2ueFgeyfx','uZ5CnIgG9thpBvI3Ppk_j','3bK5FPaFVSBvfX64pDifB','skip');
INSERT INTO "votes" VALUES('kHoXRpHcfRfViz9j4Pvur','yN1BzNfXfVRHJiEQLSe7O','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('h9kNpccLPS--lGXznN00U','2E-EQ8vHLpVnvu3JQan_Q','3bK5FPaFVSBvfX64pDifB','skip');
INSERT INTO "votes" VALUES('fLfeJfnTeRKz5HRgx8_8v','gD2VsVURdrb-jzLIMS56s','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('J_PDBo9lQEnguHYUT08aY','1PRyfHp0P6n4Va97b-06K','3bK5FPaFVSBvfX64pDifB','maybe');
INSERT INTO "votes" VALUES('ZEoTy2VsC0XPDoT7TnFhb','a_MvV7vhAs5yTTBaNcbfU','3bK5FPaFVSBvfX64pDifB','maybe');
INSERT INTO "votes" VALUES('0FyddGISZw3sYIOyKQWsP','7IgRPZEmXBUltUkUpM6e8','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('AvxweBOCJPNo9A-ty8C9c','i2q0pP8dzlyjc_qsuONqr','3bK5FPaFVSBvfX64pDifB','interested');
INSERT INTO "votes" VALUES('LS3bXLaUDT_cX8N3w3JGq','uZ5CnIgG9thpBvI3Ppk_j','3rPjbZGQYhwqJ45QrVe5y','skip');
INSERT INTO "votes" VALUES('6dEPMmy5v-JGYm258sNXx','trH9gKWGp-IwZFjo3_PLi','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('wbsfWERjWH4HRRO3gWeOD','gAAT18AMLo72CgsS9k8cF','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('YnwIIr9cHofIoFYQrRhde','ymgAKfimjdaNlyjFAy_SJ','3rPjbZGQYhwqJ45QrVe5y','skip');
INSERT INTO "votes" VALUES('aKkAVf773dzHpbVM7H0FX','QurDeTrWBESvmlvSuFHAy','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('Wb9rZhcfE99iGP39ts0U5','7IgRPZEmXBUltUkUpM6e8','3rPjbZGQYhwqJ45QrVe5y','skip');
INSERT INTO "votes" VALUES('5C5ppD_3Unb2pmEk_VBH3','i2q0pP8dzlyjc_qsuONqr','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('DGAKzx5I7rV6MbWLU7smQ','4sqU737gmLVho6GPf1ynB','3rPjbZGQYhwqJ45QrVe5y','interested');
INSERT INTO "votes" VALUES('wx3SDeGvHJZtq_25rg4qk','ktz3QVsszOB-xxgHKYkeU','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('0WEumXLj5gr6FeXYrYMtB','trH9gKWGp-IwZFjo3_PLi','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('mC0WPJrO0dJIfpnwLRRli','yN1BzNfXfVRHJiEQLSe7O','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('vU1VM3jEXvqbItCSrgq7B','qCscSIMYLbg9Ab5uP9cP3','EfoGRZZtR6wq-_VrHW2GE','skip');
INSERT INTO "votes" VALUES('LfNk6CS1WmeoKlNj18Qfu','gD2VsVURdrb-jzLIMS56s','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('i9LFl5AJzW5TKtDYSC652','gAAT18AMLo72CgsS9k8cF','EfoGRZZtR6wq-_VrHW2GE','maybe');
INSERT INTO "votes" VALUES('3sqS53AjnIZLnez3r9oVs','1PRyfHp0P6n4Va97b-06K','EfoGRZZtR6wq-_VrHW2GE','interested');
INSERT INTO "votes" VALUES('RcIRGAca7YBXn4UFhbDAD','4sqU737gmLVho6GPf1ynB','EfoGRZZtR6wq-_VrHW2GE','skip');
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
INSERT INTO "events" VALUES('rurqF9N1od2Wd09yXZkQW','Conference Alpha','Conference-Alpha','Event currently in proposal phase','https://test-event-1.example.com','2026-10-11T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-08-23T13:16:48.898Z','2026-09-06T13:16:48.898Z','2026-09-06T13:16:48.898Z','2026-09-20T13:16:48.898Z','2026-09-20T13:16:48.898Z','2026-10-13T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0);
INSERT INTO "events" VALUES('WyUIuRcdwdCVAfpOpffgo','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','https://test-event-2.example.com','2026-09-27T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-08-09T13:16:48.898Z','2026-08-23T13:16:48.898Z','2026-08-23T13:16:48.898Z','2026-09-06T13:16:48.898Z','2026-09-06T13:16:48.898Z','2026-09-29T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0);
INSERT INTO "events" VALUES('SPIvtmHDpU3ykAhQaMeUE','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','https://test-event-3.example.com','2026-09-13T07:00:00.000Z','2026-09-16T01:00:00.000Z','2026-07-26T13:16:48.898Z','2026-08-09T13:16:48.898Z','2026-08-09T13:16:48.898Z','2026-08-23T13:16:48.898Z','2026-08-23T13:16:48.898Z','2026-09-16T01:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0);
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
INSERT INTO "sessions" VALUES('eT20jrQ6XmDUfhp6uIcoO','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-11T07:00:00.000Z','2026-10-11T08:30:00.000Z',100,1,0,0,NULL,'rurqF9N1od2Wd09yXZkQW');
INSERT INTO "sessions" VALUES('_0TxGdh1mZ5KS57VYIRZw','Lunch Break','','2026-10-11T10:30:00.000Z','2026-10-11T12:00:00.000Z',0,1,1,0,NULL,'rurqF9N1od2Wd09yXZkQW');
INSERT INTO "sessions" VALUES('jFzRt3bdJ_Tt8WNvEXwRf','Lunch Break','','2026-10-12T10:30:00.000Z','2026-10-12T12:00:00.000Z',0,1,1,0,NULL,'rurqF9N1od2Wd09yXZkQW');
INSERT INTO "sessions" VALUES('M53LnEyIFSGEqFOLapN7T','Lunch Break','','2026-10-13T10:30:00.000Z','2026-10-13T12:00:00.000Z',0,1,1,0,NULL,'rurqF9N1od2Wd09yXZkQW');
INSERT INTO "sessions" VALUES('QNabeO7UnjRaat2oHbxjZ','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-09-27T07:00:00.000Z','2026-09-27T08:30:00.000Z',100,1,0,0,NULL,'WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "sessions" VALUES('hSBTPxC_oaWVzwx57bGFd','Lunch Break','','2026-09-27T10:30:00.000Z','2026-09-27T12:00:00.000Z',0,1,1,0,NULL,'WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "sessions" VALUES('JPKkRlAquB8SXvYZUTdqQ','Lunch Break','','2026-09-28T10:30:00.000Z','2026-09-28T12:00:00.000Z',0,1,1,0,NULL,'WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "sessions" VALUES('lMPMhDjeA2Fr5tQOrJVwS','Lunch Break','','2026-09-29T10:30:00.000Z','2026-09-29T12:00:00.000Z',0,1,1,0,NULL,'WyUIuRcdwdCVAfpOpffgo');
INSERT INTO "sessions" VALUES('l6M1UsHOFbEF9Vti-fthG','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-13T07:00:00.000Z','2026-09-13T08:30:00.000Z',100,1,0,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('qoTpRvw-TrYprNvSIF29D','Lunch Break','','2026-09-13T10:30:00.000Z','2026-09-13T12:00:00.000Z',0,1,1,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('EbyUkzzVQmte5zJR0N-L4','Lunch Break','','2026-09-14T10:30:00.000Z','2026-09-14T12:00:00.000Z',0,1,1,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('ao2VKcLBR27mcnGjEtyxP','Lunch Break','','2026-09-15T10:30:00.000Z','2026-09-15T12:00:00.000Z',0,1,1,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('LRnSaYz82pGkaH012ZehH','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-13T09:00:00.000Z','2026-09-13T10:00:00.000Z',100,0,0,0,'ktz3QVsszOB-xxgHKYkeU','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('_9u5smhAk59NDynbcuz7s','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-13T09:00:00.000Z','2026-09-13T10:30:00.000Z',30,0,0,1,'trH9gKWGp-IwZFjo3_PLi','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('IRbc1ns2R5g7QoG0TaD23','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-13T12:00:00.000Z','2026-09-13T13:00:00.000Z',100,0,0,0,'yN1BzNfXfVRHJiEQLSe7O','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('zUPQ4SkS_fTJqFmxB7YnZ','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-13T12:00:00.000Z','2026-09-13T13:30:00.000Z',25,0,0,0,'a_MvV7vhAs5yTTBaNcbfU','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('NI3h188puPNNDQTjs4OtY','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-13T13:30:00.000Z','2026-09-13T14:30:00.000Z',30,0,0,0,'gD2VsVURdrb-jzLIMS56s','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('d4fzTDyZS1e7EpMUkuULF','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-14T07:00:00.000Z','2026-09-14T08:00:00.000Z',100,0,0,0,'uZ5CnIgG9thpBvI3Ppk_j','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('IxDXE9YOcdGKJh_l5PCK3','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-14T08:00:00.000Z','2026-09-14T09:30:00.000Z',25,0,0,0,'gAAT18AMLo72CgsS9k8cF','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('hShLkFGe2JUkH_0QbA5gw','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-14T08:30:00.000Z','2026-09-14T10:00:00.000Z',30,0,0,0,'ymgAKfimjdaNlyjFAy_SJ','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('EYFAm7I_ek2BGYp6tmNC4','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',100,0,0,0,'7IgRPZEmXBUltUkUpM6e8','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('isibXs4qXleW0LdmNG1HU','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',25,0,0,0,'2E-EQ8vHLpVnvu3JQan_Q','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('FF4zMBn3uP5oGVEUz0A-a','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-14T14:00:00.000Z','2026-09-14T15:00:00.000Z',100,0,0,0,'yj0-Vt5YnpHCV0PxfysGj','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('KbnDIXI4N2NwwfgheyeK5','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-14T14:00:00.000Z','2026-09-14T14:30:00.000Z',15,0,0,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('PW0s6NT-bd4ibiwkYY6ux','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-15T07:00:00.000Z','2026-09-15T08:00:00.000Z',100,0,0,0,'qCscSIMYLbg9Ab5uP9cP3','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('EKu8Ds3ZLe4U7GWMSdlRC','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-15T08:00:00.000Z','2026-09-15T09:00:00.000Z',30,0,0,0,'1PRyfHp0P6n4Va97b-06K','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('3tsAtbnmMWSWXWGqrJraY','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-15T08:30:00.000Z','2026-09-15T09:30:00.000Z',25,0,0,0,'QurDeTrWBESvmlvSuFHAy','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('8zRpwyfxS7enUV1MqCyAM','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-15T12:00:00.000Z','2026-09-15T13:00:00.000Z',100,0,0,0,'FU9j5lT4h2d1O1Xe4QZg7','SPIvtmHDpU3ykAhQaMeUE');
INSERT INTO "sessions" VALUES('pcpdZHmrXsR7aO7ms3KjK','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-15T14:00:00.000Z','2026-09-15T15:00:00.000Z',100,1,0,0,NULL,'SPIvtmHDpU3ykAhQaMeUE');
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
INSERT INTO "comments" VALUES('Eqh09yMstjzwizFPiy7Bg',NULL,NULL,'',1,'2026-08-30T03:16:49.600Z',NULL);
INSERT INTO "comments" VALUES('xUy7By7ayArPnY_hSfJlU','Tv2KOAulAooc4S7wgmCn7','Eqh09yMstjzwizFPiy7Bg','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T04:16:49.600Z',NULL);
INSERT INTO "comments" VALUES('qOd8ijDUBYQJbG0f1vxg6','Fnm-Abdz1ehN5EkTIKZIZ','xUy7By7ayArPnY_hSfJlU','Perfect, count me in.',0,'2026-08-30T05:16:49.600Z',NULL);
INSERT INTO "comments" VALUES('QiQnL721DokCLuQJCmYrN','1TSQ9dPD-6927V4F0v5UA',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T06:16:49.600Z',NULL);
INSERT INTO "comments" VALUES('2hihMBfm6DApvpNqPs-jb','1TSQ9dPD-6927V4F0v5UA',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T03:30:49.600Z',NULL);
INSERT INTO "comments" VALUES('hYef4e2XpacpH1yThQdiT','09XNxNLF6W96uMTofi3E0',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T06:30:49.600Z',NULL);
INSERT INTO "comments" VALUES('hbetfnvnZ7JeMbpE8N7Mg','TBRGH7ZXR4hw5a-ywGIPO',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-30T03:44:49.600Z',NULL);
INSERT INTO "comments" VALUES('aE_-uJQQVFQ_LkgbtHcSL','0kmFtICfDcAglqxTgHR65','hbetfnvnZ7JeMbpE8N7Mg','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T04:44:49.600Z',NULL);
INSERT INTO "comments" VALUES('bgbbFfWfgttDc8NmEcpM7','TBRGH7ZXR4hw5a-ywGIPO',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T03:58:49.600Z',NULL);
INSERT INTO "comments" VALUES('MavP29YIcH209Hcg1tIyY','Tv2KOAulAooc4S7wgmCn7',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T03:16:49.600Z','2026-08-30T03:20:49.600Z');
INSERT INTO "comments" VALUES('QDhXoppPXkW2bmHf-3tda','-hzLWgBt9Ly2PhX24ibPs','MavP29YIcH209Hcg1tIyY','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T04:16:49.601Z',NULL);
INSERT INTO "comments" VALUES('TW7cI-F6YIgZuUxx1NA2b','Fnm-Abdz1ehN5EkTIKZIZ','QDhXoppPXkW2bmHf-3tda','Perfect, count me in.',0,'2026-08-30T05:16:49.601Z',NULL);
INSERT INTO "comments" VALUES('o33wV0lCf-lymiJwHwQ2A','1TSQ9dPD-6927V4F0v5UA',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T06:16:49.601Z',NULL);
INSERT INTO "comments" VALUES('6sPFAJknSAl-uTbJzjl82','Fnm-Abdz1ehN5EkTIKZIZ',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T03:30:49.601Z',NULL);
INSERT INTO "comments" VALUES('4tslBzAe8HVsLi6WtkIfF','hbl72kbmidfWZQjJ27Jd8',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T04:05:49.601Z',NULL);
INSERT INTO "comments" VALUES('lwavZDlRSIkKBhBShSOE5','xviuahijPP7FbbWYhKuBJ','4tslBzAe8HVsLi6WtkIfF','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T05:05:49.601Z',NULL);
INSERT INTO "comments" VALUES('SjaNKNhmyP74ut5LCKY4v','HaUr-XMbez7ccCJO6DFe8','lwavZDlRSIkKBhBShSOE5','That makes sense, thanks for explaining!',0,'2026-08-30T06:05:49.601Z',NULL);
INSERT INTO "comments" VALUES('x8zg1CfKxF4-fl79AcF7_','-hzLWgBt9Ly2PhX24ibPs',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T03:23:49.601Z',NULL);
INSERT INTO "comments" VALUES('JSO-TQAOoTtsaZVqi0Zjt','1TSQ9dPD-6927V4F0v5UA','x8zg1CfKxF4-fl79AcF7_','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T04:23:49.601Z',NULL);
INSERT INTO "comments" VALUES('zjrybJ9uPGtES7cXdmpLF','09XNxNLF6W96uMTofi3E0',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T03:51:49.601Z','2026-08-30T03:55:49.601Z');
INSERT INTO "comments" VALUES('8tokjr8fBmWrGJg0PxNDx','sKAansNfnpR008lhmHKQe','zjrybJ9uPGtES7cXdmpLF','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T04:51:49.601Z',NULL);
INSERT INTO "comments" VALUES('aq7fTQKqRkfKz74qRdpIP','TBRGH7ZXR4hw5a-ywGIPO','8tokjr8fBmWrGJg0PxNDx','That makes sense, thanks for explaining!',0,'2026-08-30T05:51:49.601Z',NULL);
INSERT INTO "comments" VALUES('WSCnuqXYfcNK0czG_ZC2_','TBRGH7ZXR4hw5a-ywGIPO',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T03:58:49.601Z',NULL);
INSERT INTO "comments" VALUES('8OIOL9FCkEvA_JGAMBUuC','etUL1rohSL1qIk_q3yI6i','WSCnuqXYfcNK0czG_ZC2_','I''d rather keep them separate, they go in quite different directions.',0,'2026-08-30T04:58:49.601Z',NULL);
INSERT INTO "comments" VALUES('8jjfFRTmTKMa7HcJYxMaI','hbl72kbmidfWZQjJ27Jd8','8OIOL9FCkEvA_JGAMBUuC','Perfect, count me in.',0,'2026-08-30T05:58:49.601Z',NULL);
INSERT INTO "comments" VALUES('QSWPu5OziYx9M1ttgnx3r','xviuahijPP7FbbWYhKuBJ',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T06:58:49.601Z',NULL);
INSERT INTO "comments" VALUES('OUHIZxhg8wIKWvVxZME39','xviuahijPP7FbbWYhKuBJ',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T04:12:49.601Z',NULL);
INSERT INTO "comments" VALUES('f12u4B7We9-fw-ifn8CGk','NAr9AK8oCXDTlilPDLP_m',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T04:26:49.601Z','2026-08-30T04:30:49.601Z');
INSERT INTO "comments" VALUES('8YvTPkA6Zg9R7Kwym-qyz','NAr9AK8oCXDTlilPDLP_m',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T04:33:49.601Z',NULL);
INSERT INTO "comments" VALUES('WYWvdTjQL7svvW4_P6tno','vmSOueGekeVkyJjQSrzT4',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T04:40:49.601Z',NULL);
INSERT INTO "comments" VALUES('tfNnPytK9dEWURqHpHktV','0zT3gFfzRtEcwMgJl6VqQ','WYWvdTjQL7svvW4_P6tno','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T05:40:49.601Z',NULL);
INSERT INTO "comments" VALUES('Hy9Txgzx7Lt1lbN6ahc_d','QsZDe1kfpP9ZZp5tnJ84s','tfNnPytK9dEWURqHpHktV','Perfect, count me in.',0,'2026-08-30T06:40:49.601Z',NULL);
INSERT INTO "comments" VALUES('pKpE-ecwHPENt5LK2ysJo','qDfilKr-_aFNQiGR7nPFy',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T05:01:49.601Z','2026-08-30T05:05:49.601Z');
INSERT INTO "comments" VALUES('0XWhG1TepsJdeA0sM45Zk','1ULJ5jPsAcysGk3nNR_Ki','pKpE-ecwHPENt5LK2ysJo','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T06:01:49.601Z',NULL);
INSERT INTO "comments" VALUES('hsmyQUxZmIBxh0C_3dFco','I96Xr6Zdn2Vv-li7DY2fV',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T08:01:49.601Z',NULL);
INSERT INTO "comments" VALUES('EoF8BH6BlywgqLIQrU7gx','I96Xr6Zdn2Vv-li7DY2fV',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T05:15:49.601Z',NULL);
INSERT INTO "comments" VALUES('Xir0soW12uN1X23Lsly14','uHy3QVPE1vUe5ivWh7C6_',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T05:22:49.601Z',NULL);
INSERT INTO "comments" VALUES('aahzRnQiFim_RHOzOH6Nu','1TSQ9dPD-6927V4F0v5UA',NULL,'Who else is on the panel?',0,'2026-08-30T08:16:49.601Z',NULL);
INSERT INTO "comments" VALUES('8kXCfBm1GOdFd8RNuHiws','0kmFtICfDcAglqxTgHR65','aahzRnQiFim_RHOzOH6Nu','I''d like to join.',0,'2026-08-30T09:16:49.601Z',NULL);
INSERT INTO "comments" VALUES('xBDiAfaBJT9dtdk0BDTky','09XNxNLF6W96uMTofi3E0','aahzRnQiFim_RHOzOH6Nu','So would I.',0,'2026-08-30T10:16:49.601Z',NULL);
CREATE TABLE `proposal_comments` (
	`comment_id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_comments" VALUES('Eqh09yMstjzwizFPiy7Bg','3I_bGuv_dGkXUstoS8rHv');
INSERT INTO "proposal_comments" VALUES('xUy7By7ayArPnY_hSfJlU','3I_bGuv_dGkXUstoS8rHv');
INSERT INTO "proposal_comments" VALUES('qOd8ijDUBYQJbG0f1vxg6','3I_bGuv_dGkXUstoS8rHv');
INSERT INTO "proposal_comments" VALUES('QiQnL721DokCLuQJCmYrN','3I_bGuv_dGkXUstoS8rHv');
INSERT INTO "proposal_comments" VALUES('2hihMBfm6DApvpNqPs-jb','rd3zSc5iNgBfSgF40jBtj');
INSERT INTO "proposal_comments" VALUES('hYef4e2XpacpH1yThQdiT','rd3zSc5iNgBfSgF40jBtj');
INSERT INTO "proposal_comments" VALUES('hbetfnvnZ7JeMbpE8N7Mg','pBawn_8oZeWFMfPLs4AvR');
INSERT INTO "proposal_comments" VALUES('aE_-uJQQVFQ_LkgbtHcSL','pBawn_8oZeWFMfPLs4AvR');
INSERT INTO "proposal_comments" VALUES('bgbbFfWfgttDc8NmEcpM7','OHvLqsh_8m8jQ_yrtXPFL');
INSERT INTO "proposal_comments" VALUES('MavP29YIcH209Hcg1tIyY','quMzDV8BwAl7uNcaWlrbr');
INSERT INTO "proposal_comments" VALUES('QDhXoppPXkW2bmHf-3tda','quMzDV8BwAl7uNcaWlrbr');
INSERT INTO "proposal_comments" VALUES('TW7cI-F6YIgZuUxx1NA2b','quMzDV8BwAl7uNcaWlrbr');
INSERT INTO "proposal_comments" VALUES('o33wV0lCf-lymiJwHwQ2A','quMzDV8BwAl7uNcaWlrbr');
INSERT INTO "proposal_comments" VALUES('6sPFAJknSAl-uTbJzjl82','hI0QiYeyoiCOg0uAdAOyP');
INSERT INTO "proposal_comments" VALUES('4tslBzAe8HVsLi6WtkIfF','Il_HSgpol8ZKlKLclekZK');
INSERT INTO "proposal_comments" VALUES('lwavZDlRSIkKBhBShSOE5','Il_HSgpol8ZKlKLclekZK');
INSERT INTO "proposal_comments" VALUES('SjaNKNhmyP74ut5LCKY4v','Il_HSgpol8ZKlKLclekZK');
INSERT INTO "proposal_comments" VALUES('x8zg1CfKxF4-fl79AcF7_','ktz3QVsszOB-xxgHKYkeU');
INSERT INTO "proposal_comments" VALUES('JSO-TQAOoTtsaZVqi0Zjt','ktz3QVsszOB-xxgHKYkeU');
INSERT INTO "proposal_comments" VALUES('zjrybJ9uPGtES7cXdmpLF','qCscSIMYLbg9Ab5uP9cP3');
INSERT INTO "proposal_comments" VALUES('8tokjr8fBmWrGJg0PxNDx','qCscSIMYLbg9Ab5uP9cP3');
INSERT INTO "proposal_comments" VALUES('aq7fTQKqRkfKz74qRdpIP','qCscSIMYLbg9Ab5uP9cP3');
INSERT INTO "proposal_comments" VALUES('WSCnuqXYfcNK0czG_ZC2_','2E-EQ8vHLpVnvu3JQan_Q');
INSERT INTO "proposal_comments" VALUES('8OIOL9FCkEvA_JGAMBUuC','2E-EQ8vHLpVnvu3JQan_Q');
INSERT INTO "proposal_comments" VALUES('8jjfFRTmTKMa7HcJYxMaI','2E-EQ8vHLpVnvu3JQan_Q');
INSERT INTO "proposal_comments" VALUES('QSWPu5OziYx9M1ttgnx3r','2E-EQ8vHLpVnvu3JQan_Q');
INSERT INTO "proposal_comments" VALUES('OUHIZxhg8wIKWvVxZME39','gD2VsVURdrb-jzLIMS56s');
INSERT INTO "proposal_comments" VALUES('f12u4B7We9-fw-ifn8CGk','1PRyfHp0P6n4Va97b-06K');
INSERT INTO "proposal_comments" VALUES('8YvTPkA6Zg9R7Kwym-qyz','ymgAKfimjdaNlyjFAy_SJ');
INSERT INTO "proposal_comments" VALUES('WYWvdTjQL7svvW4_P6tno','a_MvV7vhAs5yTTBaNcbfU');
INSERT INTO "proposal_comments" VALUES('tfNnPytK9dEWURqHpHktV','a_MvV7vhAs5yTTBaNcbfU');
INSERT INTO "proposal_comments" VALUES('Hy9Txgzx7Lt1lbN6ahc_d','a_MvV7vhAs5yTTBaNcbfU');
INSERT INTO "proposal_comments" VALUES('pKpE-ecwHPENt5LK2ysJo','f20B9bKK3F3mTkd5N5r1C');
INSERT INTO "proposal_comments" VALUES('0XWhG1TepsJdeA0sM45Zk','f20B9bKK3F3mTkd5N5r1C');
INSERT INTO "proposal_comments" VALUES('hsmyQUxZmIBxh0C_3dFco','f20B9bKK3F3mTkd5N5r1C');
INSERT INTO "proposal_comments" VALUES('EoF8BH6BlywgqLIQrU7gx','i2q0pP8dzlyjc_qsuONqr');
INSERT INTO "proposal_comments" VALUES('Xir0soW12uN1X23Lsly14','4sqU737gmLVho6GPf1ynB');
INSERT INTO "proposal_comments" VALUES('aahzRnQiFim_RHOzOH6Nu','DRFgpDGa5DtxyYK1nDRJ_');
INSERT INTO "proposal_comments" VALUES('8kXCfBm1GOdFd8RNuHiws','DRFgpDGa5DtxyYK1nDRJ_');
INSERT INTO "proposal_comments" VALUES('xBDiAfaBJT9dtdk0BDTky','DRFgpDGa5DtxyYK1nDRJ_');
CREATE TABLE `comment_likes` (
	`comment_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`created_time` text NOT NULL,
	PRIMARY KEY(`comment_id`, `guest_id`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "comment_likes" VALUES('xUy7By7ayArPnY_hSfJlU','Fnm-Abdz1ehN5EkTIKZIZ','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('qOd8ijDUBYQJbG0f1vxg6','1TSQ9dPD-6927V4F0v5UA','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('qOd8ijDUBYQJbG0f1vxg6','0kmFtICfDcAglqxTgHR65','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('qOd8ijDUBYQJbG0f1vxg6','09XNxNLF6W96uMTofi3E0','2026-08-30T12:14:49.601Z');
INSERT INTO "comment_likes" VALUES('QiQnL721DokCLuQJCmYrN','0kmFtICfDcAglqxTgHR65','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('QiQnL721DokCLuQJCmYrN','09XNxNLF6W96uMTofi3E0','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('2hihMBfm6DApvpNqPs-jb','09XNxNLF6W96uMTofi3E0','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('2hihMBfm6DApvpNqPs-jb','TBRGH7ZXR4hw5a-ywGIPO','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('hYef4e2XpacpH1yThQdiT','TBRGH7ZXR4hw5a-ywGIPO','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('hYef4e2XpacpH1yThQdiT','hbl72kbmidfWZQjJ27Jd8','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('hYef4e2XpacpH1yThQdiT','xviuahijPP7FbbWYhKuBJ','2026-08-30T12:14:49.601Z');
INSERT INTO "comment_likes" VALUES('hbetfnvnZ7JeMbpE8N7Mg','hbl72kbmidfWZQjJ27Jd8','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('aE_-uJQQVFQ_LkgbtHcSL','xviuahijPP7FbbWYhKuBJ','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('bgbbFfWfgttDc8NmEcpM7','w7JdJDr5DDwEqnll6-W_E','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('bgbbFfWfgttDc8NmEcpM7','HaUr-XMbez7ccCJO6DFe8','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('MavP29YIcH209Hcg1tIyY','HaUr-XMbez7ccCJO6DFe8','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('TW7cI-F6YIgZuUxx1NA2b','vmSOueGekeVkyJjQSrzT4','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('TW7cI-F6YIgZuUxx1NA2b','QsZDe1kfpP9ZZp5tnJ84s','2026-08-30T12:15:49.601Z');
INSERT INTO "comment_likes" VALUES('TW7cI-F6YIgZuUxx1NA2b','B5125stOsb8vn8HGBEtw0','2026-08-30T12:14:49.601Z');
INSERT INTO "comment_likes" VALUES('o33wV0lCf-lymiJwHwQ2A','QsZDe1kfpP9ZZp5tnJ84s','2026-08-30T12:16:49.601Z');
INSERT INTO "comment_likes" VALUES('o33wV0lCf-lymiJwHwQ2A','B5125stOsb8vn8HGBEtw0','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('6sPFAJknSAl-uTbJzjl82','B5125stOsb8vn8HGBEtw0','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('6sPFAJknSAl-uTbJzjl82','qDfilKr-_aFNQiGR7nPFy','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('6sPFAJknSAl-uTbJzjl82','AWd3Xn3wBU7_TdfKAbXbC','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('4tslBzAe8HVsLi6WtkIfF','qDfilKr-_aFNQiGR7nPFy','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('4tslBzAe8HVsLi6WtkIfF','AWd3Xn3wBU7_TdfKAbXbC','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('SjaNKNhmyP74ut5LCKY4v','I96Xr6Zdn2Vv-li7DY2fV','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('x8zg1CfKxF4-fl79AcF7_','uHy3QVPE1vUe5ivWh7C6_','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('x8zg1CfKxF4-fl79AcF7_','sKAansNfnpR008lhmHKQe','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('x8zg1CfKxF4-fl79AcF7_','cTi6oXuNbhyiYwiTPSpA6','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('JSO-TQAOoTtsaZVqi0Zjt','sKAansNfnpR008lhmHKQe','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('zjrybJ9uPGtES7cXdmpLF','cTi6oXuNbhyiYwiTPSpA6','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('zjrybJ9uPGtES7cXdmpLF','LydZG3AsWh7pTgAaPQHQS','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('zjrybJ9uPGtES7cXdmpLF','etUL1rohSL1qIk_q3yI6i','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('8tokjr8fBmWrGJg0PxNDx','LydZG3AsWh7pTgAaPQHQS','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('8tokjr8fBmWrGJg0PxNDx','etUL1rohSL1qIk_q3yI6i','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('aq7fTQKqRkfKz74qRdpIP','etUL1rohSL1qIk_q3yI6i','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('WSCnuqXYfcNK0czG_ZC2_','QBWUzhQrfO8xsv-RRGXrU','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('8OIOL9FCkEvA_JGAMBUuC','r-ws6d4dMfhGZxoCq-Ro3','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('8jjfFRTmTKMa7HcJYxMaI','54AZ3c-17tbIATgggOOUN','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('8jjfFRTmTKMa7HcJYxMaI','CsN56WI96MWzVdtK5ndCB','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('8jjfFRTmTKMa7HcJYxMaI','8gZclqE7cUhZ_rT-DVVZn','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('QSWPu5OziYx9M1ttgnx3r','CsN56WI96MWzVdtK5ndCB','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('QSWPu5OziYx9M1ttgnx3r','8gZclqE7cUhZ_rT-DVVZn','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('OUHIZxhg8wIKWvVxZME39','8gZclqE7cUhZ_rT-DVVZn','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('OUHIZxhg8wIKWvVxZME39','q4ko_ePN19-cW_e_L3bEX','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('OUHIZxhg8wIKWvVxZME39','XpP_IWzTZJc7bhuIXZWu-','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('f12u4B7We9-fw-ifn8CGk','q4ko_ePN19-cW_e_L3bEX','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('pKpE-ecwHPENt5LK2ysJo','gz9KK1_5R_ETIpVa47El3','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('0XWhG1TepsJdeA0sM45Zk','gz9KK1_5R_ETIpVa47El3','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('0XWhG1TepsJdeA0sM45Zk','0zT3gFfzRtEcwMgJl6VqQ','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('hsmyQUxZmIBxh0C_3dFco','0zT3gFfzRtEcwMgJl6VqQ','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('EoF8BH6BlywgqLIQrU7gx','i_qdUdPhSK8wvaON8JFLu','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('aahzRnQiFim_RHOzOH6Nu','3rPjbZGQYhwqJ45QrVe5y','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('aahzRnQiFim_RHOzOH6Nu','EfoGRZZtR6wq-_VrHW2GE','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('aahzRnQiFim_RHOzOH6Nu','Tv2KOAulAooc4S7wgmCn7','2026-08-30T12:14:49.602Z');
INSERT INTO "comment_likes" VALUES('8kXCfBm1GOdFd8RNuHiws','EfoGRZZtR6wq-_VrHW2GE','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('xBDiAfaBJT9dtdk0BDTky','Tv2KOAulAooc4S7wgmCn7','2026-08-30T12:16:49.602Z');
INSERT INTO "comment_likes" VALUES('xBDiAfaBJT9dtdk0BDTky','-hzLWgBt9Ly2PhX24ibPs','2026-08-30T12:15:49.602Z');
INSERT INTO "comment_likes" VALUES('xBDiAfaBJT9dtdk0BDTky','Fnm-Abdz1ehN5EkTIKZIZ','2026-08-30T12:14:49.602Z');
CREATE TABLE `session_comments`
(
  `comment_id` text PRIMARY KEY NOT NULL,
  `session_id` text             NOT NULL,
  FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`session_id`) REFERENCES `sessions` (`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `profile_comments`
(
  `comment_id` text PRIMARY KEY NOT NULL,
  `profile_id` text             NOT NULL,
  FOREIGN KEY (`comment_id`) REFERENCES `comments` (`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`profile_id`) REFERENCES `guests` (`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
CREATE INDEX `proposal_comments_proposal_idx` ON `proposal_comments` (`proposal_id`);
CREATE INDEX `comment_likes_guest_idx` ON `comment_likes` (`guest_id`);
CREATE INDEX `session_comments_session_idx` ON `session_comments` (`session_id`);
CREATE INDEX `profile_comments_profile_idx` ON `profile_comments` (`profile_id`);
COMMIT;
