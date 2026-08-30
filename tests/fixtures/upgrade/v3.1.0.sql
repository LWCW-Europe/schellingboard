-- Seeded database of schellingboard v3.1.0, dumped by
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
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text, `email_on_rsvp_change` integer DEFAULT true NOT NULL, `email_on_host_change` integer DEFAULT true NOT NULL, `email_on_cohost_add` integer DEFAULT true NOT NULL, `based_in` text, `prompts` text, `languages` text, `contacts` text, `auth_protected` integer DEFAULT false NOT NULL, `password_hash` text);
INSERT INTO "guests" VALUES('vyl8-6kP88Fm79OHDXfoH','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/vyl8-6kP88Fm79OHDXfoH.webp?v=1788081914413','She/Her',1,1,1,'Osaka, Japan','[{"prompt":"Ask me about","answer":"Accessible design patterns and Japanese web typography"},{"prompt":"Offering","answer":"Code review swaps and coffee-machine debugging sessions"}]','["Japanese","English"]','[{"type":"website","value":"https://alice-test.example.com"},{"type":"telegram","value":"@alice_frontend"}]',0,NULL);
INSERT INTO "guests" VALUES('yH3NLn7LbuHsgylBytLFs','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/yH3NLn7LbuHsgylBytLFs.webp?v=1788081914413','He/Him',1,1,1,'Lagos, Nigeria','[{"prompt":"Looking for","answer":"Speakers for an inclusive product design meetup back home"},{"prompt":"Offering","answer":"Feedback on your product roadmap over coffee"}]','["English","Yoruba"]','[{"type":"email","value":"bob.organizes@example.com"},{"type":"whatsapp","value":"+234 801 234 5678"}]',0,NULL);
INSERT INTO "guests" VALUES('cY457rt7EFQPN75TtMUds','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/cY457rt7EFQPN75TtMUds.webp?v=1788081914413','They/Them',1,1,1,'Guadalajara, Mexico','[{"prompt":"Ask me about","answer":"Stream processing pipelines, or my sourdough starter"},{"prompt":"My weirdest skill","answer":"Naming Kafka topics that still make sense a year later"}]','["Spanish","English"]','[{"type":"discord","value":"charlie.streams"},{"type":"website","value":"https://charlie.dev"}]',0,NULL);
INSERT INTO "guests" VALUES('paBPBs9xeDED163O2Ur5M','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him',1,1,1,NULL,NULL,NULL,NULL,0,NULL);
INSERT INTO "guests" VALUES('EKzEL3s2jM4ZJuZba3lFX','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL);
INSERT INTO "guests" VALUES('Jy0HFfHOqajvN5CS8-nAd','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her',1,1,1,NULL,NULL,NULL,NULL,1,'scrypt$eppFqrt25szL67wisbvOYQ==$jmxQtlhKy46ChUX5WvRMHhJ7bpXu6ZiTHar6T9gOou4=');
INSERT INTO "guests" VALUES('07ZthaZgNKrpSr-U3bb6v','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/07ZthaZgNKrpSr-U3bb6v.webp?v=1788081914414',NULL,1,1,1,'Shanghai, China','[{"prompt":"Ask me about","answer":"Build caching strategies that hold up under real CI load"}]','["Mandarin Chinese","English"]','[{"type":"telegram","value":"@weichen_dev"}]',1,'scrypt$XO9YLXbe4whrPjdVcI9txA==$cx4szL3hrfKNHHtoIa5ZbROPkfrq7A7Pnhz1ibqeA28=');
INSERT INTO "guests" VALUES('-YknYrHJm0BB9JIxt2RnM','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/-YknYrHJm0BB9JIxt2RnM.webp?v=1788081914414','She/Her',1,1,1,'Bengaluru, India','[{"prompt":"Ask me about","answer":"Fairness metrics for recommender systems"},{"prompt":"Looking for","answer":"A conference buddy — this is my first time here!"}]','["Hindi","Kannada","English"]','[{"type":"website","value":"https://priyasharma.example.com"}]',0,NULL);
INSERT INTO "guests" VALUES('V67iVP8iscxbgUGPglPIM','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/V67iVP8iscxbgUGPglPIM.webp?v=1788081914415','He/Him',1,1,1,'Gothenburg, Sweden','[{"prompt":"Offering","answer":"Strong opinions about Rust, mild opinions about saunas"}]','["Swedish","English"]','[{"type":"signal","value":"lars.eriksson.99"}]',1,'scrypt$cMyguj99wiPkkEd+vxGFmg==$xAeTx2sjDe4SKdWaH0gw6+/M7OWH93o4axHBegSOvEM=');
INSERT INTO "guests" VALUES('PQN_61rVAB8jkfV3kmFeE','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/PQN_61rVAB8jkfV3kmFeE.webp?v=1788081914415',NULL,1,1,1,'Muscat, Oman','[{"prompt":"Ask me about","answer":"Threat modeling for teams too small to have a security hire"}]','["Arabic","English"]','[{"type":"email","value":"fatima.breaks.things@example.com"}]',1,'scrypt$O50D30QuSim5seom91l25A==$jIbCoYy2/+tC3WvPS9MQQ62moYUtW6P8cfTJz5fEamg=');
INSERT INTO "guests" VALUES('TnJCutPTYzgDtft7HoqZ3','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/TnJCutPTYzgDtft7HoqZ3.webp?v=1788081914415','He/Him',1,1,1,'Accra, Ghana','[{"prompt":"Offering","answer":"War stories about building for 2G networks"}]','["Twi","English"]','[{"type":"whatsapp","value":"+233 24 555 0187"}]',1,'scrypt$+ihYpTpcicmkchw3VtCtgg==$10Y95VIDFjMjY+gYK7g0Ozi6hgng5RoUx5oGtC+MVWo=');
INSERT INTO "guests" VALUES('cpAxJAf9miETC9QHvSyVU','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/cpAxJAf9miETC9QHvSyVU.webp?v=1788081914415',NULL,1,1,1,'Yokohama, Japan','[{"prompt":"My weirdest skill","answer":"Debugging a blinking LED by ear"}]','["Japanese"]',NULL,1,'scrypt$MPxi3WolEuskgB87cdCn8A==$430OtqNXx9vuB9r8wb/1ues+wO5QDeXQ63UFeixKLic=');
INSERT INTO "guests" VALUES('yRYmQ6FVGOhsuk0BN_ejo','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/yRYmQ6FVGOhsuk0BN_ejo.webp?v=1788081914416','She/Her',1,1,1,'Berlin, Germany','[{"prompt":"Ask me about","answer":"Research ethics for multilingual user studies"}]','["French","Wolof","English","German"]','[{"type":"website","value":"https://aishadiallo.example.com"},{"type":"other","label":"Mastodon","value":"@aisha@ux.social"}]',1,'scrypt$opITm02Y/L8X/7l/JFQshg==$6UkHt4OIrixugeDsdSyb+bH8CryXF+kRzvvyqmw31tw=');
INSERT INTO "guests" VALUES('sefguhyQA9wtuCqtYCKVt','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/sefguhyQA9wtuCqtYCKVt.webp?v=1788081914416',NULL,1,1,1,'Buenos Aires, Argentina','[{"prompt":"Offering","answer":"A rundown of the worst incident I ever caused, for entertainment purposes"}]','["Spanish","English"]','[{"type":"telegram","value":"@diego_sre"}]',1,'scrypt$SeyyItHwx4rM8ZGZ0AaAfA==$4289fHF/uB20eMGV0LrFRz24vqLKsZ+4IZjiy60viaI=');
INSERT INTO "guests" VALUES('bB4JpExeUhf7MkBQ9ZJJO','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/bB4JpExeUhf7MkBQ9ZJJO.webp?v=1788081914416','She/Her',1,1,1,'Taipei, Taiwan','[{"prompt":"Ask me about","answer":"Turning a wall of Slack threads into docs people read"}]','["Mandarin Chinese","English"]',NULL,1,'scrypt$aJdSY5tpHc+eIQBjWm7QWA==$so46uCCS4qSklLWV60IUyqpo7Ll7vtzXL1QRAKkaVRg=');
INSERT INTO "guests" VALUES('HgEisugbs4kIid4ZNZ3xw','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/HgEisugbs4kIid4ZNZ3xw.webp?v=1788081914416',NULL,1,1,1,'Novosibirsk, Russia','[{"prompt":"Offering","answer":"A very detailed opinion about your slow query, whether you want it or not"}]','["Russian","English"]','[{"type":"email","value":"olga.petrova.db@example.com"}]',1,'scrypt$6uwDJ08FY5O0RMGoHiOc2Q==$cnkv4MsjdkN7aiAlwOXM3F/YWjTVgEM9PFyU+hnqTrA=');
INSERT INTO "guests" VALUES('H8ZHqYr8QSNtXIVqD4GZp','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/H8ZHqYr8QSNtXIVqD4GZp.webp?v=1788081914417','He/Him',1,1,1,'Lyon, France','[{"prompt":"Looking for","answer":"Cheese recommendations near the venue"}]','["French","English"]','[{"type":"whatsapp","value":"+33 6 12 34 56 78"}]',0,NULL);
INSERT INTO "guests" VALUES('E0Q8_H4owV_mvUcROELxH','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/E0Q8_H4owV_mvUcROELxH.webp?v=1788081914418',NULL,1,1,1,'Johannesburg, South Africa','[{"prompt":"Ask me about","answer":"Building civic tech that survives contact with real government data"}]','["Zulu","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('6tFA6cVlsCr9Urs19_5kh','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/6tFA6cVlsCr9Urs19_5kh.webp?v=1788081914418','She/Her',1,1,1,'Kraków, Poland','[{"prompt":"Offering","answer":"Trades: I''ll find your worst bug for a board game recommendation"}]','["Polish","English"]','[{"type":"discord","value":"anna.qa"}]',0,NULL);
INSERT INTO "guests" VALUES('zkZKEFlYMaFZ6t2VKAqsA','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/zkZKEFlYMaFZ6t2VKAqsA.webp?v=1788081914418',NULL,1,1,1,'Cairo, Egypt','[{"prompt":"A hill I will die on","answer":"Boring architecture beats clever architecture, every time"}]','["Arabic","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('TgGUPhlx-LTEFdfOMUsT7','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/TgGUPhlx-LTEFdfOMUsT7.webp?v=1788081914418','She/Her',1,1,1,'Milan, Italy','[{"prompt":"Ask me about","answer":"Getting design tokens to survive contact with production"}]','["English","French"]','[{"type":"website","value":"https://isabellarossi.example.com"}]',0,NULL);
INSERT INTO "guests" VALUES('pbkPpsZ5bf1kVt_beN8Zq','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/pbkPpsZ5bf1kVt_beN8Zq.webp?v=1788081914419','They/Them',1,1,1,'Seoul, South Korea','[{"prompt":"Currently obsessed with","answer":"CRDTs, and why conflict-free replication is harder than it sounds"}]','["Korean","English"]','[{"type":"discord","value":"minjunkim"}]',0,NULL);
INSERT INTO "guests" VALUES('5K0CGQpJmkJ2482RV0CJV','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/5K0CGQpJmkJ2482RV0CJV.webp?v=1788081914419',NULL,1,1,1,'Porto, Portugal','[{"prompt":"Offering","answer":"A talk about automating yourself out of a job, repeatedly"}]','["Portuguese","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('d3uKuKufQ04c_a1jT5ZYR','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her',1,1,1,'Beirut, Lebanon','[{"prompt":"Looking for","answer":"Mentors and mentees for a women-in-tech circle back home"}]','["Arabic","French","English"]','[{"type":"other","label":"Instagram","value":"@nadia.builds"}]',0,NULL);
INSERT INTO "guests" VALUES('AlfY65FCbjMRPBLr0AabP','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL,1,1,1,'Copenhagen, Denmark','[{"prompt":"Offering","answer":"A free accessibility pass on your slides — bring your laptop"}]','["Danish","English"]','[{"type":"email","value":"freya.a11y@example.com"}]',0,NULL);
INSERT INTO "guests" VALUES('Q9ezGlQBWd-OfJG4xsVNj','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him',1,1,1,'Kochi, India','[{"prompt":"Currently obsessed with","answer":"Consensus protocols, and where filter coffee ranks among them"}]','["Malayalam","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('ODlcbr8Vl4BiGZdJ0y-m7','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL,1,1,1,'Istanbul, Turkey','[{"prompt":"Looking for","answer":"Session recommendations — I''m new here and excited about everything"}]','["Turkish","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('CxcFtRc_PMLhOQPdGN5xI','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL,1,1,1,'Ibadan, Nigeria',NULL,'["Yoruba","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('GHFf7iHenTQ93qbISr0Ha','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them',1,1,1,'Ho Chi Minh City, Vietnam','[{"prompt":"Offering","answer":"Static site generator recommendations, unsolicited and opinionated"}]','["Vietnamese","English"]','[{"type":"telegram","value":"@linh_jamstack"}]',0,NULL);
INSERT INTO "guests" VALUES('ekUnPZaxJ3Y-7AK1ZMBTe','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL,1,1,1,'Zagreb, Croatia','[{"prompt":"A hill I will die on","answer":"Estimates are a communication tool, not a promise"}]','["Croatian","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('AM7pNqlqSaQYx46nWy0Mt','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL,1,1,1,NULL,'[{"prompt":"My weirdest skill","answer":"Reading language specs for fun, apparently"}]',NULL,NULL,0,NULL);
INSERT INTO "guests" VALUES('QqKFYYQH13WgaUGnwx6RM','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her',1,1,1,'Bologna, Italy','[{"prompt":"Ask me about","answer":"Making public health research reproducible without a data team"}]',NULL,'[{"type":"website","value":"https://chiarabianchi.example.com"}]',0,NULL);
INSERT INTO "guests" VALUES('mcSRg7CNr0awvcBLHidGl','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL,1,1,1,'Durban, South Africa','[{"prompt":"Offering","answer":"Container query wizardry, upon request"}]','["Zulu","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('I7Bk9yb3CsbBHx5P14Fwh','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL,1,1,1,'São Paulo, Brazil','[{"prompt":"Offering","answer":"Mentoring conversations for junior devs finding their footing"}]','["Portuguese","English"]','[{"type":"website","value":"https://rafaelsouza.example.com"}]',0,NULL);
INSERT INTO "guests" VALUES('Rd3-vWy2R5hzaIlmvYwuG','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.',NULL,'She/Her',1,1,1,'Kyoto, Japan','[{"prompt":"I collect","answer":"Conference stickers, competitively"}]','["Japanese","English"]','[{"type":"website","value":"https://hanakobayashi.example.com"},{"type":"other","label":"Bluesky","value":"@hanak.dev"}]',0,NULL);
INSERT INTO "guests" VALUES('aCtbVVlLZE5gkXxLwjc-x','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL,1,1,1,'Prague, Czechia','[{"prompt":"Ask me about","answer":"Sustainable maintainership for projects that outlive their funding"}]','["Czech","English"]','[{"type":"website","value":"https://github.example.com/tereza"}]',0,NULL);
INSERT INTO "guests" VALUES('CBgApJv8_Ctu4PA9NnLxG','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him',1,1,1,'Amsterdam, Netherlands','[{"prompt":"Currently obsessed with","answer":"Developer tooling, and slowly learning Dutch"}]','["Persian","Dutch","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('7YzzIo3aVdbX0hluuq5k5','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL,1,1,1,'Thessaloniki, Greece','[{"prompt":"Offering","answer":"Loosely held opinions on everything except testing"}]','["Greek","English"]',NULL,0,NULL);
INSERT INTO "guests" VALUES('TKr75Ctm2EiALroFku-3i','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL);
INSERT INTO "guests" VALUES('wYKwW6WMzYBPRlbP5aFEt','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They',1,1,1,NULL,NULL,NULL,NULL,0,NULL);
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
INSERT INTO "days" VALUES('EGnWHfa8lYV8Q6pPbZTMN','2026-10-11T07:00:00.000Z','2026-10-11T16:00:00.000Z','2026-10-11T07:00:00.000Z','2026-10-11T15:30:00.000Z','GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "days" VALUES('k4bjW0PuonhdQoG-rfadi','2026-10-12T07:00:00.000Z','2026-10-12T16:00:00.000Z','2026-10-12T07:00:00.000Z','2026-10-12T15:30:00.000Z','GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "days" VALUES('_CmoUC4-yjF94nLgzEKWB','2026-10-13T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-10-13T07:00:00.000Z','2026-10-13T15:30:00.000Z','GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "days" VALUES('Q0VBuZcwNkSGhdd6k7Z7T','2026-09-27T07:00:00.000Z','2026-09-27T16:00:00.000Z','2026-09-27T07:00:00.000Z','2026-09-27T15:30:00.000Z','s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "days" VALUES('DNgJe-oknxZeyZ62o2r5d','2026-09-28T07:00:00.000Z','2026-09-28T16:00:00.000Z','2026-09-28T07:00:00.000Z','2026-09-28T15:30:00.000Z','s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "days" VALUES('4aRP5HKCcxA9mQEwT985S','2026-09-29T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-09-29T07:00:00.000Z','2026-09-29T15:30:00.000Z','s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "days" VALUES('tlKBbQBp2W164gfu2uuuH','2026-09-13T07:00:00.000Z','2026-09-13T16:00:00.000Z','2026-09-13T07:00:00.000Z','2026-09-13T15:30:00.000Z','uS-a-MU3RTfols50fhk8E');
INSERT INTO "days" VALUES('56Gyptu4PYZ8ui9ala49E','2026-09-14T07:00:00.000Z','2026-09-14T16:00:00.000Z','2026-09-14T07:00:00.000Z','2026-09-14T15:30:00.000Z','uS-a-MU3RTfols50fhk8E');
INSERT INTO "days" VALUES('0rlfD25OQUie5a88x0yQW','2026-09-15T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-09-15T07:00:00.000Z','2026-09-15T15:30:00.000Z','uS-a-MU3RTfols50fhk8E');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','cY457rt7EFQPN75TtMUds');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','paBPBs9xeDED163O2Ur5M');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','V67iVP8iscxbgUGPglPIM');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','TKr75Ctm2EiALroFku-3i');
INSERT INTO "event_guests" VALUES('GiRr8R6aKvq3Y9DQSakf-','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','cY457rt7EFQPN75TtMUds');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','paBPBs9xeDED163O2Ur5M');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','V67iVP8iscxbgUGPglPIM');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','TKr75Ctm2EiALroFku-3i');
INSERT INTO "event_guests" VALUES('s_jeM1nDmGhaeMgt1M5Fe','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','cY457rt7EFQPN75TtMUds');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','paBPBs9xeDED163O2Ur5M');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','V67iVP8iscxbgUGPglPIM');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','TKr75Ctm2EiALroFku-3i');
INSERT INTO "event_guests" VALUES('uS-a-MU3RTfols50fhk8E','wYKwW6WMzYBPRlbP5aFEt');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-main-hall');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-room-a');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-room-b');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-library');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-boardroom');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-auditorium');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-courtyard');
INSERT INTO "event_locations" VALUES('GiRr8R6aKvq3Y9DQSakf-','loc-rooftop');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-main-hall');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-room-a');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-room-b');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-library');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-boardroom');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-auditorium');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-courtyard');
INSERT INTO "event_locations" VALUES('s_jeM1nDmGhaeMgt1M5Fe','loc-rooftop');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-main-hall');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-room-a');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-room-b');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-library');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-boardroom');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-auditorium');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-courtyard');
INSERT INTO "event_locations" VALUES('uS-a-MU3RTfols50fhk8E','loc-rooftop');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('Al5DETiRit53Exwk0ve0j','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "proposal_hosts" VALUES('_cdkQyexwLP3K0BonUfgO','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('5zNEn6U_UJU6l6qVMekby','paBPBs9xeDED163O2Ur5M');
INSERT INTO "proposal_hosts" VALUES('sdO0qE472nhMhAhBuRBpK','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "proposal_hosts" VALUES('sdO0qE472nhMhAhBuRBpK','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "proposal_hosts" VALUES('_SSeN-gLvDTKmDhr38AH8','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "proposal_hosts" VALUES('_SSeN-gLvDTKmDhr38AH8','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "proposal_hosts" VALUES('p_7z72FSeeJciToTZglIy','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "proposal_hosts" VALUES('aFWHvHvWRfMcYveqHSROb','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "proposal_hosts" VALUES('NIs4bGZhZCe0OMq1idU7n','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "proposal_hosts" VALUES('5GgclcbwowUEfv_MF35dA','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('cMecuzjoUVMmg2608605d','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "proposal_hosts" VALUES('nzsCESQ8MDJ9AKgU4knBe','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('LTSVhf6HMj0_3A6b6uMNa','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "proposal_hosts" VALUES('LTSVhf6HMj0_3A6b6uMNa','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "proposal_hosts" VALUES('9YPLCTfbsBa7BSbkp2ICg','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "proposal_hosts" VALUES('QES8J-h-UqqcJ912LwhLa','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "proposal_hosts" VALUES('0lgCm_9f7KEvdYPfSO1Ym','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "proposal_hosts" VALUES('ELdWxSl4lBGwWT8PWrums','V67iVP8iscxbgUGPglPIM');
INSERT INTO "proposal_hosts" VALUES('ELdWxSl4lBGwWT8PWrums','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "proposal_hosts" VALUES('_wIjSkzhPfEttNVZMhpes','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "proposal_hosts" VALUES('VAEnCkUNE674Z8JDQRDPF','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "proposal_hosts" VALUES('xjvzoyxnTeCYaZIIoiaMS','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('BR73uKvj6c2EMUlrXBhVG','paBPBs9xeDED163O2Ur5M');
INSERT INTO "proposal_hosts" VALUES('kDjr9tBlQy1OZXb252Ctm','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('MkAmL5qqcIAgFVQBGR4R2','paBPBs9xeDED163O2Ur5M');
INSERT INTO "proposal_hosts" VALUES('68LTz4kGtuIulqB0MxkHV','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "proposal_hosts" VALUES('pScbY1rRMiZpTlsUVTFjS','paBPBs9xeDED163O2Ur5M');
INSERT INTO "proposal_hosts" VALUES('Utehr95J4Qk-S2McFjCqF','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "proposal_hosts" VALUES('jCiH82MZ76eSptuEHJgS8','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "proposal_hosts" VALUES('xQq72LaaHgQeHkKrRZ3mo','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "proposal_hosts" VALUES('VviafD0o5ZON3SsHobhrX','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "proposal_hosts" VALUES('WKUtXvGZotK-zqOt66YTy','cY457rt7EFQPN75TtMUds');
INSERT INTO "proposal_hosts" VALUES('GDc6jZFqjui3PCk1pZ8T2','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "proposal_hosts" VALUES('BS1y-TkpVjnhKcXF5kmEz','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "proposal_hosts" VALUES('Vzk2ziZAjOGyruWBzKUDA','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "proposal_hosts" VALUES('PR0dXn3fqw7LOFB0KMbL0','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "proposal_hosts" VALUES('NOUZvGKjyl2nwplXkjGs-','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "proposal_hosts" VALUES('NOUZvGKjyl2nwplXkjGs-','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "proposal_hosts" VALUES('7bDhDdgLIzJEf_FBE27tw','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "proposal_hosts" VALUES('ROqAJAsH3EH4CbTLbovsU','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "proposal_hosts" VALUES('0dMxulzqpSASS9vIOF231','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "proposal_hosts" VALUES('2w3JMNDuirUnG8T9aidxd','PQN_61rVAB8jkfV3kmFeE');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('ALDzgGdONoUROJ9JWFzNi','MdVLWWmz5T3w4KncWd147','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "rsvps" VALUES('RmP2_hvIWNjq-JxvgbjoO','dDvjtp8Qk2qTtFUImDWqI','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "rsvps" VALUES('QFTf2E86AQKpfOE6wO0gp','lGXW6K7i-sW858JWoUMHH','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "rsvps" VALUES('LDEu_dTWFZngq7D1TmOi7','OrsZT5hxUv0vZ7iUeBmOm','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "rsvps" VALUES('0n_cwo8FbrgXKwpMMGQWp','JGvJ5MIBVoZqRRvW6ioiT','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "rsvps" VALUES('9zJSGHsZ8899WzRbPKJHs','MdVLWWmz5T3w4KncWd147','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('wf5Fp687wd6iY357iBfax','dDvjtp8Qk2qTtFUImDWqI','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('2drIemPveVbSi3BTw2Lo2','lGXW6K7i-sW858JWoUMHH','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('VvW0mYRpVixyqOxDdJ2YS','r3OJYVyAAEoGLoUNEgEU8','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('24xhtyM-yiwBZC1j5DTVE','8ZRvZdCsGN_SNkatwcrRo','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('YRHWVz5SWY_B70BnWChm2','3xfeGoEJJKqkqK1h9JTpv','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('4_k_b9k9N2u43q9wKnNwz','KP2wc-LGmdsLzWIeqYXk7','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('_Bi-yU6aWhNH6QXwZ37lb','Ph9Mbf2XTgVgHFxqECk9x','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "rsvps" VALUES('b42I6oZk_sQug3R2wbsJS','rCvHPK6j4M79CCatcMIPK','cY457rt7EFQPN75TtMUds');
INSERT INTO "rsvps" VALUES('WQBvzjlfEk5Jmvx3a28NR','r3OJYVyAAEoGLoUNEgEU8','cY457rt7EFQPN75TtMUds');
INSERT INTO "rsvps" VALUES('0gqDX6F1eZ0Q8PK1N9R2u','8ZRvZdCsGN_SNkatwcrRo','cY457rt7EFQPN75TtMUds');
INSERT INTO "rsvps" VALUES('t_xouBxWWxhrm8W3nQwUd','lj0pehZ3hYXORfabxeZKC','cY457rt7EFQPN75TtMUds');
INSERT INTO "rsvps" VALUES('xws46UOPgkCRFZfzDBfoS','8ZRvZdCsGN_SNkatwcrRo','paBPBs9xeDED163O2Ur5M');
INSERT INTO "rsvps" VALUES('MuOnfrBrAUK9eGJFgHWrT','7RdXA5nDniAVOFGwB7e7c','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('GimcjAcrnVdJPgjQDn7gP','t6qccXmWujJ8TrN9wwC3L','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('7HY6opG8x-xo0TrAUKM_W','kapuuo93C5RLzWTS17UlV','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('T9B3FJ1GGyWeME6bE2YCF','JGvJ5MIBVoZqRRvW6ioiT','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('VfJuGiiSpf_XzesdNwBSZ','KP2wc-LGmdsLzWIeqYXk7','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('4yMeQhDQNBJVl-c4TogWu','Ph9Mbf2XTgVgHFxqECk9x','EKzEL3s2jM4ZJuZba3lFX');
INSERT INTO "rsvps" VALUES('9kNLMjirl99bzwnuefxoj','7RdXA5nDniAVOFGwB7e7c','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('XAjGuKKub7BR6VCKLo1nE','rCvHPK6j4M79CCatcMIPK','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('NOjOveClrydsVX8WLRukK','OrsZT5hxUv0vZ7iUeBmOm','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('qUPrYJ8_okjPDB72q9Qd-','8ZRvZdCsGN_SNkatwcrRo','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('41KfpDWI3Dd9j4h_2IyhH','lj0pehZ3hYXORfabxeZKC','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('OkSIahgyWG_KiPnJIS2k-','JGvJ5MIBVoZqRRvW6ioiT','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "rsvps" VALUES('QedURqbcYRm0d5NZXgKPm','t6qccXmWujJ8TrN9wwC3L','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "rsvps" VALUES('ME2cKAH2gGgFPIvzrBRfp','lGXW6K7i-sW858JWoUMHH','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "rsvps" VALUES('46w8vV_5VxB28JeI7Vtet','2vf7vhw9s0jBTS0thqn-y','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "rsvps" VALUES('0p1UrnfGiYUvpSSEeDpdL','3xfeGoEJJKqkqK1h9JTpv','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "rsvps" VALUES('ytQ2-0WKSaEUFH02NOquW','KP2wc-LGmdsLzWIeqYXk7','07ZthaZgNKrpSr-U3bb6v');
INSERT INTO "rsvps" VALUES('9-XdEBKIYa2OyZjy6qDTL','t6qccXmWujJ8TrN9wwC3L','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('bQm0Au_85g5XsHGQiQA1k','rCvHPK6j4M79CCatcMIPK','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('1Qd4ky4QYHhcZRUxUhut6','LFzSnDAJu6pZuK6zA2JEj','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('ia26TIUbQGFyx6Cw2_8yp','lj0pehZ3hYXORfabxeZKC','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('2QtwZ8I8r0D3SjIYEl8cy','3xfeGoEJJKqkqK1h9JTpv','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('ugrGhFoCEAGfK7nVr8Qxj','KP2wc-LGmdsLzWIeqYXk7','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "rsvps" VALUES('2f6uUXtwjSHNYNsoKTPpU','MdVLWWmz5T3w4KncWd147','V67iVP8iscxbgUGPglPIM');
INSERT INTO "rsvps" VALUES('znjXqcUVklyRYEiFKaXXs','lGXW6K7i-sW858JWoUMHH','V67iVP8iscxbgUGPglPIM');
INSERT INTO "rsvps" VALUES('tuO3DW2-c558VI4Hwd8hb','kapuuo93C5RLzWTS17UlV','V67iVP8iscxbgUGPglPIM');
INSERT INTO "rsvps" VALUES('3EX3srx282seAv0Nx4Bqs','lj0pehZ3hYXORfabxeZKC','V67iVP8iscxbgUGPglPIM');
INSERT INTO "rsvps" VALUES('mTRE5VHZjEpePQHYP1DNC','7RdXA5nDniAVOFGwB7e7c','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('_cIjxP9Kc2_fxX042wfzG','t6qccXmWujJ8TrN9wwC3L','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('5Jk8yZPChwXk5mtv2GD91','OrsZT5hxUv0vZ7iUeBmOm','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('jacvcZ1Gv47N8opJjB6HL','2vf7vhw9s0jBTS0thqn-y','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('Zi3bfWWEshmVpa5-3yToq','8ZRvZdCsGN_SNkatwcrRo','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('GervGbKsV4xxpO-Nlu39o','kapuuo93C5RLzWTS17UlV','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "rsvps" VALUES('j0XteO8eicGfDeLpFz0Ru','7RdXA5nDniAVOFGwB7e7c','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "rsvps" VALUES('YRNZn8iMhYJb6kN-yz84o','OrsZT5hxUv0vZ7iUeBmOm','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "rsvps" VALUES('-zGZnMx9FeGFki3r7v4L2','2vf7vhw9s0jBTS0thqn-y','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "rsvps" VALUES('UBeRQIXKDc2ICpAAahgkI','HnooKCtAt4K0uYrYGe3-8','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "rsvps" VALUES('OjtGUfnFYx_dZmRVyBuJG','lj0pehZ3hYXORfabxeZKC','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "rsvps" VALUES('5Ws-3lWFpgAVEi8eqH1g7','7RdXA5nDniAVOFGwB7e7c','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "rsvps" VALUES('r1KHJgrbNrlQJZpdym-4t','t6qccXmWujJ8TrN9wwC3L','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "rsvps" VALUES('1QT9BYPouGQ3_qkL09mbb','lGXW6K7i-sW858JWoUMHH','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "rsvps" VALUES('zldH_IhY9QREdXbT_Xjto','r3OJYVyAAEoGLoUNEgEU8','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "rsvps" VALUES('28B6E9vkVu1sKdri23agw','kapuuo93C5RLzWTS17UlV','cpAxJAf9miETC9QHvSyVU');
INSERT INTO "rsvps" VALUES('uxpSAlm_xLA9wk16Pgtio','7RdXA5nDniAVOFGwB7e7c','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('jUdVeiJTjXo-l7pzJ4dyR','t6qccXmWujJ8TrN9wwC3L','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('6DKDjFUYlQLFRXOEUlIhK','lGXW6K7i-sW858JWoUMHH','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('VSAZLZDjmKHw8jF6jCv26','HnooKCtAt4K0uYrYGe3-8','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('ZGt2Uq6obclUvIomNuOB_','LFzSnDAJu6pZuK6zA2JEj','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('g9uBTfAc7Xsfrg9i3VcKA','lj0pehZ3hYXORfabxeZKC','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "rsvps" VALUES('53JJY-A7V541u1b_CnEFa','7RdXA5nDniAVOFGwB7e7c','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('P-J2gEEEPoMHApT85wnOy','t6qccXmWujJ8TrN9wwC3L','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('gj4BBxLVE1W_CG_MSY1mK','dDvjtp8Qk2qTtFUImDWqI','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('HyJ1eQB4YkR6y8yfxW_P2','r3OJYVyAAEoGLoUNEgEU8','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('DY-yb-Gc6_JMSwKv8xOYD','8ZRvZdCsGN_SNkatwcrRo','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('s8z8rAtKPXE7EqL4xBSVi','LFzSnDAJu6pZuK6zA2JEj','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('6pebF1w_TqIXunFcsNFoO','lj0pehZ3hYXORfabxeZKC','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('rHXLPF1c0Grp_46-jnPAZ','Ph9Mbf2XTgVgHFxqECk9x','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "rsvps" VALUES('ty1II558xioq4VlPtUZwz','dDvjtp8Qk2qTtFUImDWqI','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "rsvps" VALUES('d5eOW1yCx31c7wDtkhusI','OrsZT5hxUv0vZ7iUeBmOm','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "rsvps" VALUES('WEi_30JTgEUkwQ6RAEtcU','r3OJYVyAAEoGLoUNEgEU8','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "rsvps" VALUES('6w3Dz2wxOkqDFJ8BeeoIu','Ph9Mbf2XTgVgHFxqECk9x','bB4JpExeUhf7MkBQ9ZJJO');
INSERT INTO "rsvps" VALUES('OClbEC7IzTC79qng2PI43','MdVLWWmz5T3w4KncWd147','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('ncK1gEwt2wis_s0G91d-r','dDvjtp8Qk2qTtFUImDWqI','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('cZAJAbKnEj8S8Uh0X9poD','lGXW6K7i-sW858JWoUMHH','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('9C4dl_Sw5qkoIjJdyJTwO','OrsZT5hxUv0vZ7iUeBmOm','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('9e8tZ6QLvG-AEULmVI5wh','LFzSnDAJu6pZuK6zA2JEj','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('rCzHaTFv1QjgJlN_5FXzR','3xfeGoEJJKqkqK1h9JTpv','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "rsvps" VALUES('Pvw2icZYnW0iTvjpIxkK5','7RdXA5nDniAVOFGwB7e7c','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('iWYkhUtO4su-L_Mtdk2Vv','dDvjtp8Qk2qTtFUImDWqI','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('OthdY_ahvNM-1tlDL8pVb','OrsZT5hxUv0vZ7iUeBmOm','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('7AYJWkDnIXubL1qmRw4Yj','2vf7vhw9s0jBTS0thqn-y','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('6WylaqeZb644yBleoxVkA','8ZRvZdCsGN_SNkatwcrRo','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('onrHFz3PtDaVdYAA9EUdf','JGvJ5MIBVoZqRRvW6ioiT','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('onUM0Mtk0NXYRWmFiP9q2','KP2wc-LGmdsLzWIeqYXk7','H8ZHqYr8QSNtXIVqD4GZp');
INSERT INTO "rsvps" VALUES('tvbYWcor4pWnZ2njNbsbd','7RdXA5nDniAVOFGwB7e7c','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('cUlat5Vxn30yDOwKNcXZ8','dDvjtp8Qk2qTtFUImDWqI','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('NQnmZonUSYM_I5F63efo8','OrsZT5hxUv0vZ7iUeBmOm','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('ozhc80cTQQhdGBLRxmgMw','r3OJYVyAAEoGLoUNEgEU8','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('d7vxRpFvejIYfjH-YkM7C','HnooKCtAt4K0uYrYGe3-8','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('PzGltCxEifHnVPome0F-5','JGvJ5MIBVoZqRRvW6ioiT','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('a5CDMkIl_ZOpjDe73Urga','KP2wc-LGmdsLzWIeqYXk7','E0Q8_H4owV_mvUcROELxH');
INSERT INTO "rsvps" VALUES('G_OCNyEfPS7sRNC_swbV9','7RdXA5nDniAVOFGwB7e7c','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('r40NJ-PgDsNf4fzXS_xlZ','rCvHPK6j4M79CCatcMIPK','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('gLI-gaq1KiWXZ5mUjxcH5','lGXW6K7i-sW858JWoUMHH','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('JhIL3B1sttalHiPIR_OV4','OrsZT5hxUv0vZ7iUeBmOm','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('xVvoiXF5YepPC7w1W7RXU','2vf7vhw9s0jBTS0thqn-y','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('bWQqWAIwhhZxw5leChpLq','kapuuo93C5RLzWTS17UlV','6tFA6cVlsCr9Urs19_5kh');
INSERT INTO "rsvps" VALUES('wEBH7SXEcGDyAM0nY5grF','7RdXA5nDniAVOFGwB7e7c','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('ieHB7mV62ZAP0f3x65Fp7','MdVLWWmz5T3w4KncWd147','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('BCkNh6GNjTXd2xQZ_Ktf6','dDvjtp8Qk2qTtFUImDWqI','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('nKnVHpR4u_6L2w_btvZXw','2vf7vhw9s0jBTS0thqn-y','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('Fr99QiHHx9zPCn3grXNyI','kapuuo93C5RLzWTS17UlV','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('_KVhzW6qZkE_m6r9t32KF','JGvJ5MIBVoZqRRvW6ioiT','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "rsvps" VALUES('e2BcWdhDBlT-sAFZfpZ7P','kapuuo93C5RLzWTS17UlV','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "rsvps" VALUES('K6xtAmRBLjRbTRVkGMYeS','lj0pehZ3hYXORfabxeZKC','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "rsvps" VALUES('fFFUFMBmW-OrvbL_zLNyi','7RdXA5nDniAVOFGwB7e7c','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "rsvps" VALUES('u-44-9Pd742RXABikAxV5','OrsZT5hxUv0vZ7iUeBmOm','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "rsvps" VALUES('eHfgvul7LhEnU4vCDnl52','JGvJ5MIBVoZqRRvW6ioiT','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "rsvps" VALUES('kps-G88UGzFggyWza_LJW','KP2wc-LGmdsLzWIeqYXk7','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "rsvps" VALUES('mNRi-6p8m2Ci6hLvo5OC4','Ph9Mbf2XTgVgHFxqECk9x','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "rsvps" VALUES('MILoXuWqVVmugZ6dDFH6H','7RdXA5nDniAVOFGwB7e7c','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "rsvps" VALUES('TL2_7RAM9ttyDlMhqca5y','t6qccXmWujJ8TrN9wwC3L','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "rsvps" VALUES('XSbDc0UG0Ka3sJtt-NWEM','2vf7vhw9s0jBTS0thqn-y','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "rsvps" VALUES('M1M36RybiYwEzySVjz7B9','3xfeGoEJJKqkqK1h9JTpv','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "rsvps" VALUES('eEeyAbEkBA_iG_yHDVpaQ','Ph9Mbf2XTgVgHFxqECk9x','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "rsvps" VALUES('4CocXKHiPeNQRXK3KyTQV','2vf7vhw9s0jBTS0thqn-y','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "rsvps" VALUES('zDIJ5UopeL_dQGHjH1szT','kapuuo93C5RLzWTS17UlV','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "rsvps" VALUES('tiE1eSraPkMeCtPcXOG3Y','lj0pehZ3hYXORfabxeZKC','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "rsvps" VALUES('DSjoGSbJ_rTf_-rkJpqEy','KP2wc-LGmdsLzWIeqYXk7','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "rsvps" VALUES('tvLWeHo8sa0DuFW__-TGF','Ph9Mbf2XTgVgHFxqECk9x','d3uKuKufQ04c_a1jT5ZYR');
INSERT INTO "rsvps" VALUES('F2-0cD5xPJ8BJp91GssY2','7RdXA5nDniAVOFGwB7e7c','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('AcnLwL1SccIWu9NDpZ5Wt','t6qccXmWujJ8TrN9wwC3L','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('T10awpcXsQN5PeNDnw88w','rCvHPK6j4M79CCatcMIPK','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('qk52f20D7D41KWa5-VEFY','HnooKCtAt4K0uYrYGe3-8','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('jlxD2CVFA9Z2SO37FbKlH','kapuuo93C5RLzWTS17UlV','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('TrEZEgH1AhNV0Jz7CNNKw','KP2wc-LGmdsLzWIeqYXk7','AlfY65FCbjMRPBLr0AabP');
INSERT INTO "rsvps" VALUES('EywyYuN5w4x1VgglWVKyJ','7RdXA5nDniAVOFGwB7e7c','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('B_nNQrzUUzn2ci_KoUU_F','MdVLWWmz5T3w4KncWd147','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('rWJtEr_r2wLLtIhJVbp6e','8ZRvZdCsGN_SNkatwcrRo','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('1EsRILhhgpPUENWAM6Wjn','kapuuo93C5RLzWTS17UlV','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('7AhmR9rUEOfxuOrLurld1','JGvJ5MIBVoZqRRvW6ioiT','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('PoM9Bgl7uAP-mL_1lFv_E','KP2wc-LGmdsLzWIeqYXk7','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('9Ou2cczSSf3TUj6q9ddy8','Ph9Mbf2XTgVgHFxqECk9x','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "rsvps" VALUES('hpEGgseTts432aA481Vpv','7RdXA5nDniAVOFGwB7e7c','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "rsvps" VALUES('UV55FuCK1GsVUMJVx_6D9','2vf7vhw9s0jBTS0thqn-y','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "rsvps" VALUES('N0zqXdYxRttpfGkGrXKON','8ZRvZdCsGN_SNkatwcrRo','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "rsvps" VALUES('exvtYS6UymTa3FHYdARZY','lj0pehZ3hYXORfabxeZKC','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "rsvps" VALUES('SAbZ_42jAmlk7tqXZZouM','JGvJ5MIBVoZqRRvW6ioiT','ODlcbr8Vl4BiGZdJ0y-m7');
INSERT INTO "rsvps" VALUES('ijkgpxmnljFppLmikTsdv','7RdXA5nDniAVOFGwB7e7c','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('1BMreBPJ_dpRldTOq9R3D','t6qccXmWujJ8TrN9wwC3L','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('3e-_Tim_YKesypfu0KS6x','2vf7vhw9s0jBTS0thqn-y','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('WKjwrHRcDAHHo2616NxnO','LFzSnDAJu6pZuK6zA2JEj','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('diJ_elrM8Wo0yLV8OdHR3','lj0pehZ3hYXORfabxeZKC','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('OMvYJgpDACRUTda6Nyck1','3xfeGoEJJKqkqK1h9JTpv','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('Be8IswH-4XLFgxhR1ZicW','KP2wc-LGmdsLzWIeqYXk7','CxcFtRc_PMLhOQPdGN5xI');
INSERT INTO "rsvps" VALUES('_Av4QydJ0UvdsSKEZMTQ8','7RdXA5nDniAVOFGwB7e7c','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('HMQEhz6iE-88Rj1obURLp','t6qccXmWujJ8TrN9wwC3L','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('TI06j44kJ2z5brhWXMfhv','OrsZT5hxUv0vZ7iUeBmOm','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('0UhFAfEjL80JU-fqmdYfT','r3OJYVyAAEoGLoUNEgEU8','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('bcklpIJboIpwy3yRRjUUr','8ZRvZdCsGN_SNkatwcrRo','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('Gcyt6i7vPtgYrYpeK40l4','JGvJ5MIBVoZqRRvW6ioiT','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('fM3IZaI-DCJnhwWGTURL-','Ph9Mbf2XTgVgHFxqECk9x','GHFf7iHenTQ93qbISr0Ha');
INSERT INTO "rsvps" VALUES('Z8NxmLdYpHSPZBF4NQaow','rCvHPK6j4M79CCatcMIPK','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('y_O_7EfiYvrUL7lq_xcAP','OrsZT5hxUv0vZ7iUeBmOm','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('NwMN3Hi3Rw6msO3nAt6ak','2vf7vhw9s0jBTS0thqn-y','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('UA5X9b4aq_dOJ1JD5gmke','LFzSnDAJu6pZuK6zA2JEj','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('xfo1Mt_Ck1sCE9NUtoliL','3xfeGoEJJKqkqK1h9JTpv','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('3anI1JwG40XANkdgPDfCV','KP2wc-LGmdsLzWIeqYXk7','ekUnPZaxJ3Y-7AK1ZMBTe');
INSERT INTO "rsvps" VALUES('PDbnGNPXj1w0VPKUPWUEg','dDvjtp8Qk2qTtFUImDWqI','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('57mnkDf2ILfkeki1D8JW8','lGXW6K7i-sW858JWoUMHH','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('XcipF_6rKdmNzXTWqJogP','8ZRvZdCsGN_SNkatwcrRo','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('-A53QzxE9jM4jfODQV3Qt','JGvJ5MIBVoZqRRvW6ioiT','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('pK9C2spOQsnZCRTsmv5c0','KP2wc-LGmdsLzWIeqYXk7','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('jjNOqRgq2JgAravj4_Sh_','Ph9Mbf2XTgVgHFxqECk9x','AM7pNqlqSaQYx46nWy0Mt');
INSERT INTO "rsvps" VALUES('QqkuXxgBUCFfewG1HB2vb','MdVLWWmz5T3w4KncWd147','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "rsvps" VALUES('uUYm44XqikMIiM4Av650y','2vf7vhw9s0jBTS0thqn-y','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "rsvps" VALUES('95Qsw-80seM_jHMn0FV_N','kapuuo93C5RLzWTS17UlV','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "rsvps" VALUES('C88nQHB4ji3tmHz-ud3v5','Ph9Mbf2XTgVgHFxqECk9x','QqKFYYQH13WgaUGnwx6RM');
INSERT INTO "rsvps" VALUES('n_vTne4fydSpZqu5GyYvd','7RdXA5nDniAVOFGwB7e7c','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "rsvps" VALUES('cVC_GSi_JUFARpE7mTjdG','dDvjtp8Qk2qTtFUImDWqI','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "rsvps" VALUES('uL9eTj_wP5IJVSlFFomdu','OrsZT5hxUv0vZ7iUeBmOm','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "rsvps" VALUES('I2MHwIAmpAmbBw2fdH3dE','kapuuo93C5RLzWTS17UlV','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "rsvps" VALUES('BUI2rvEkWa32PbuvYf72Z','Ph9Mbf2XTgVgHFxqECk9x','mcSRg7CNr0awvcBLHidGl');
INSERT INTO "rsvps" VALUES('buBGnc7PCq2nJa406prLB','t6qccXmWujJ8TrN9wwC3L','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('xJbMkRXzfmPz32o76RxC4','rCvHPK6j4M79CCatcMIPK','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('Krqodht9j7rh3G5LE3NWs','r3OJYVyAAEoGLoUNEgEU8','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('t6smTF1y3UcuEIohcV_gH','8ZRvZdCsGN_SNkatwcrRo','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('Kfocdw8mqbUWh1vth1zow','lj0pehZ3hYXORfabxeZKC','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('3EKSBm6YdN9yuchP6SDGx','3xfeGoEJJKqkqK1h9JTpv','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('CbT1rK21Plh4z7uAb0Pw8','Ph9Mbf2XTgVgHFxqECk9x','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "rsvps" VALUES('qLjxr6vka5MXqfQK9dwpD','rCvHPK6j4M79CCatcMIPK','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "rsvps" VALUES('wq811gS9ONkqa4ynjgI9-','OrsZT5hxUv0vZ7iUeBmOm','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "rsvps" VALUES('nLrxVN1A-a4adDxRB-TPN','r3OJYVyAAEoGLoUNEgEU8','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "rsvps" VALUES('yMm59FWQhvpt2KH8OHCeP','LFzSnDAJu6pZuK6zA2JEj','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "rsvps" VALUES('RPYHPpJGdnNfrBNkWmyMP','JGvJ5MIBVoZqRRvW6ioiT','Rd3-vWy2R5hzaIlmvYwuG');
INSERT INTO "rsvps" VALUES('Me4DqflZqJcH0N9McTr7e','7RdXA5nDniAVOFGwB7e7c','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "rsvps" VALUES('DeheSMAVOGl7jrY7rQozm','t6qccXmWujJ8TrN9wwC3L','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "rsvps" VALUES('8AG7ehucuPcwQl_pTunRh','KP2wc-LGmdsLzWIeqYXk7','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "rsvps" VALUES('gzwCDqKv1mILNYAc0qx9F','lj0pehZ3hYXORfabxeZKC','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "rsvps" VALUES('M-p9wiyPfZcVWfkJ1MPzx','JGvJ5MIBVoZqRRvW6ioiT','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "rsvps" VALUES('itSq_Wu6H4WBaGDFS2Y7X','Ph9Mbf2XTgVgHFxqECk9x','CBgApJv8_Ctu4PA9NnLxG');
INSERT INTO "rsvps" VALUES('BTQqpLIZqfFyVfeMR1yxj','MdVLWWmz5T3w4KncWd147','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "rsvps" VALUES('eB6qlc2cZ5SEvMW8Atxen','OrsZT5hxUv0vZ7iUeBmOm','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "rsvps" VALUES('h3pfhybfbubs-knvh9WKU','2vf7vhw9s0jBTS0thqn-y','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "rsvps" VALUES('eGkoDfqy-9ObgKS2FN3Nd','HnooKCtAt4K0uYrYGe3-8','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "rsvps" VALUES('K6y4Lx9QE4eCdwh_9OPZC','KP2wc-LGmdsLzWIeqYXk7','7YzzIo3aVdbX0hluuq5k5');
INSERT INTO "rsvps" VALUES('FrRUZL0f_TxrSKg7mxW1_','7RdXA5nDniAVOFGwB7e7c','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('-EbK1jyGdCL84-kq3N842','2vf7vhw9s0jBTS0thqn-y','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('gNv9dSBmg-UVipGhYirlB','HnooKCtAt4K0uYrYGe3-8','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('fCRiUdMdJ0BT9y4ylCcYV','kapuuo93C5RLzWTS17UlV','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('hmqhCfkuFVWMh1S5u5v50','lj0pehZ3hYXORfabxeZKC','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('cZEXtf-1ic_jPPX4BDbyu','Ph9Mbf2XTgVgHFxqECk9x','TKr75Ctm2EiALroFku-3i');
INSERT INTO "rsvps" VALUES('jPh6zG07MDIpxyPvwjLiZ','7RdXA5nDniAVOFGwB7e7c','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "rsvps" VALUES('00kFRbWzqzoChD6Rtq-Hh','dDvjtp8Qk2qTtFUImDWqI','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "rsvps" VALUES('WSMdjrwxb-wKk_-K2ZER-','2vf7vhw9s0jBTS0thqn-y','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "rsvps" VALUES('z-HAEG1Ug6nt6-3pPYeat','LFzSnDAJu6pZuK6zA2JEj','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "rsvps" VALUES('WIdLwxoTG2750k5I-dPT-','JGvJ5MIBVoZqRRvW6ioiT','wYKwW6WMzYBPRlbP5aFEt');
INSERT INTO "rsvps" VALUES('c_yh500FeO7BblCaroWJl','Ph9Mbf2XTgVgHFxqECk9x','wYKwW6WMzYBPRlbP5aFEt');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('3FI7Wq-86LD8G0yZhi2Y7','vyl8-6kP88Fm79OHDXfoH');
INSERT INTO "session_hosts" VALUES('2YC4lmGJL83YrSzcyg74Q','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "session_hosts" VALUES('7RdXA5nDniAVOFGwB7e7c','cY457rt7EFQPN75TtMUds');
INSERT INTO "session_hosts" VALUES('t6qccXmWujJ8TrN9wwC3L','paBPBs9xeDED163O2Ur5M');
INSERT INTO "session_hosts" VALUES('MdVLWWmz5T3w4KncWd147','Jy0HFfHOqajvN5CS8-nAd');
INSERT INTO "session_hosts" VALUES('dDvjtp8Qk2qTtFUImDWqI','TgGUPhlx-LTEFdfOMUsT7');
INSERT INTO "session_hosts" VALUES('rCvHPK6j4M79CCatcMIPK','aCtbVVlLZE5gkXxLwjc-x');
INSERT INTO "session_hosts" VALUES('lGXW6K7i-sW858JWoUMHH','Q9ezGlQBWd-OfJG4xsVNj');
INSERT INTO "session_hosts" VALUES('OrsZT5hxUv0vZ7iUeBmOm','cY457rt7EFQPN75TtMUds');
INSERT INTO "session_hosts" VALUES('2vf7vhw9s0jBTS0thqn-y','yRYmQ6FVGOhsuk0BN_ejo');
INSERT INTO "session_hosts" VALUES('r3OJYVyAAEoGLoUNEgEU8','HgEisugbs4kIid4ZNZ3xw');
INSERT INTO "session_hosts" VALUES('8ZRvZdCsGN_SNkatwcrRo','-YknYrHJm0BB9JIxt2RnM');
INSERT INTO "session_hosts" VALUES('HnooKCtAt4K0uYrYGe3-8','5K0CGQpJmkJ2482RV0CJV');
INSERT INTO "session_hosts" VALUES('LFzSnDAJu6pZuK6zA2JEj','yH3NLn7LbuHsgylBytLFs');
INSERT INTO "session_hosts" VALUES('LFzSnDAJu6pZuK6zA2JEj','I7Bk9yb3CsbBHx5P14Fwh');
INSERT INTO "session_hosts" VALUES('kapuuo93C5RLzWTS17UlV','pbkPpsZ5bf1kVt_beN8Zq');
INSERT INTO "session_hosts" VALUES('lj0pehZ3hYXORfabxeZKC','zkZKEFlYMaFZ6t2VKAqsA');
INSERT INTO "session_hosts" VALUES('JGvJ5MIBVoZqRRvW6ioiT','TnJCutPTYzgDtft7HoqZ3');
INSERT INTO "session_hosts" VALUES('3xfeGoEJJKqkqK1h9JTpv','sefguhyQA9wtuCqtYCKVt');
INSERT INTO "session_hosts" VALUES('KP2wc-LGmdsLzWIeqYXk7','PQN_61rVAB8jkfV3kmFeE');
INSERT INTO "session_hosts" VALUES('Ph9Mbf2XTgVgHFxqECk9x','cY457rt7EFQPN75TtMUds');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('3FI7Wq-86LD8G0yZhi2Y7','loc-main-hall');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-main-hall');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-room-a');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-room-b');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-library');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-boardroom');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-auditorium');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-courtyard');
INSERT INTO "session_locations" VALUES('UH9Gc8wTCAWw9yBNhPnOl','loc-rooftop');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-main-hall');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-room-a');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-room-b');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-library');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-boardroom');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-auditorium');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-courtyard');
INSERT INTO "session_locations" VALUES('S2gnIijQmk9XV_ovLLsJX','loc-rooftop');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-main-hall');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-room-a');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-room-b');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-library');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-boardroom');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-auditorium');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-courtyard');
INSERT INTO "session_locations" VALUES('EqP4fIwLQDqtf02w3QSGH','loc-rooftop');
INSERT INTO "session_locations" VALUES('2YC4lmGJL83YrSzcyg74Q','loc-main-hall');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-main-hall');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-room-a');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-room-b');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-library');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-boardroom');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-auditorium');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-courtyard');
INSERT INTO "session_locations" VALUES('ulTTWLKM4wOcSe_iKIEND','loc-rooftop');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-main-hall');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-room-a');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-room-b');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-library');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-boardroom');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-auditorium');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-courtyard');
INSERT INTO "session_locations" VALUES('hKvEydo_ECB6jHHbwBOxv','loc-rooftop');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-main-hall');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-room-a');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-room-b');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-library');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-boardroom');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-auditorium');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-courtyard');
INSERT INTO "session_locations" VALUES('efalkqA2cGmetLJjdEP4N','loc-rooftop');
INSERT INTO "session_locations" VALUES('7RdXA5nDniAVOFGwB7e7c','loc-main-hall');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-main-hall');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-room-a');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-room-b');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-library');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-boardroom');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-auditorium');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-courtyard');
INSERT INTO "session_locations" VALUES('k3jNx8macuqImegN-A31-','loc-rooftop');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-main-hall');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-room-a');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-room-b');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-library');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-boardroom');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-auditorium');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-courtyard');
INSERT INTO "session_locations" VALUES('w2kg_wuQMVM-cMXnYk7Tz','loc-rooftop');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-main-hall');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-room-a');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-room-b');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-library');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-boardroom');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-auditorium');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-courtyard');
INSERT INTO "session_locations" VALUES('favvBazMnC0TiUV4M_qee','loc-rooftop');
INSERT INTO "session_locations" VALUES('t6qccXmWujJ8TrN9wwC3L','loc-main-hall');
INSERT INTO "session_locations" VALUES('MdVLWWmz5T3w4KncWd147','loc-room-a');
INSERT INTO "session_locations" VALUES('dDvjtp8Qk2qTtFUImDWqI','loc-main-hall');
INSERT INTO "session_locations" VALUES('rCvHPK6j4M79CCatcMIPK','loc-room-b');
INSERT INTO "session_locations" VALUES('lGXW6K7i-sW858JWoUMHH','loc-room-a');
INSERT INTO "session_locations" VALUES('OrsZT5hxUv0vZ7iUeBmOm','loc-main-hall');
INSERT INTO "session_locations" VALUES('2vf7vhw9s0jBTS0thqn-y','loc-room-b');
INSERT INTO "session_locations" VALUES('r3OJYVyAAEoGLoUNEgEU8','loc-room-a');
INSERT INTO "session_locations" VALUES('8ZRvZdCsGN_SNkatwcrRo','loc-main-hall');
INSERT INTO "session_locations" VALUES('HnooKCtAt4K0uYrYGe3-8','loc-room-b');
INSERT INTO "session_locations" VALUES('LFzSnDAJu6pZuK6zA2JEj','loc-main-hall');
INSERT INTO "session_locations" VALUES('kapuuo93C5RLzWTS17UlV','loc-room-b');
INSERT INTO "session_locations" VALUES('lj0pehZ3hYXORfabxeZKC','loc-main-hall');
INSERT INTO "session_locations" VALUES('JGvJ5MIBVoZqRRvW6ioiT','loc-room-a');
INSERT INTO "session_locations" VALUES('3xfeGoEJJKqkqK1h9JTpv','loc-room-b');
INSERT INTO "session_locations" VALUES('KP2wc-LGmdsLzWIeqYXk7','loc-main-hall');
INSERT INTO "session_locations" VALUES('Ph9Mbf2XTgVgHFxqECk9x','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('Al5DETiRit53Exwk0ve0j','GiRr8R6aKvq3Y9DQSakf-','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-08-30T09:25:14.763Z');
INSERT INTO "session_proposals" VALUES('9cmWFq4RxVbzdGIR2hNcH','GiRr8R6aKvq3Y9DQSakf-','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('_cdkQyexwLP3K0BonUfgO','GiRr8R6aKvq3Y9DQSakf-','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('5zNEn6U_UJU6l6qVMekby','GiRr8R6aKvq3Y9DQSakf-','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('sdO0qE472nhMhAhBuRBpK','GiRr8R6aKvq3Y9DQSakf-','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('_SSeN-gLvDTKmDhr38AH8','GiRr8R6aKvq3Y9DQSakf-','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('XoFlMR0y8U_yiLCukp_N5','GiRr8R6aKvq3Y9DQSakf-','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('p_7z72FSeeJciToTZglIy','GiRr8R6aKvq3Y9DQSakf-','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('aFWHvHvWRfMcYveqHSROb','GiRr8R6aKvq3Y9DQSakf-','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('NIs4bGZhZCe0OMq1idU7n','GiRr8R6aKvq3Y9DQSakf-','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('5GgclcbwowUEfv_MF35dA','GiRr8R6aKvq3Y9DQSakf-','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('cMecuzjoUVMmg2608605d','s_jeM1nDmGhaeMgt1M5Fe','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('nzsCESQ8MDJ9AKgU4knBe','s_jeM1nDmGhaeMgt1M5Fe','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('BXKvCa9gxpLbYdGvhb7v5','s_jeM1nDmGhaeMgt1M5Fe','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('LTSVhf6HMj0_3A6b6uMNa','s_jeM1nDmGhaeMgt1M5Fe','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('9YPLCTfbsBa7BSbkp2ICg','s_jeM1nDmGhaeMgt1M5Fe','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('QES8J-h-UqqcJ912LwhLa','s_jeM1nDmGhaeMgt1M5Fe','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('0lgCm_9f7KEvdYPfSO1Ym','s_jeM1nDmGhaeMgt1M5Fe','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('ELdWxSl4lBGwWT8PWrums','s_jeM1nDmGhaeMgt1M5Fe','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('_wIjSkzhPfEttNVZMhpes','s_jeM1nDmGhaeMgt1M5Fe','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('O2yDcEGHukq3luzh1YCVA','s_jeM1nDmGhaeMgt1M5Fe','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('VAEnCkUNE674Z8JDQRDPF','s_jeM1nDmGhaeMgt1M5Fe','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('xjvzoyxnTeCYaZIIoiaMS','s_jeM1nDmGhaeMgt1M5Fe','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('BR73uKvj6c2EMUlrXBhVG','s_jeM1nDmGhaeMgt1M5Fe','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('WKUtXvGZotK-zqOt66YTy','uS-a-MU3RTfols50fhk8E','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('pScbY1rRMiZpTlsUVTFjS','uS-a-MU3RTfols50fhk8E','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('Utehr95J4Qk-S2McFjCqF','uS-a-MU3RTfols50fhk8E','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('jCiH82MZ76eSptuEHJgS8','uS-a-MU3RTfols50fhk8E','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('2w3JMNDuirUnG8T9aidxd','uS-a-MU3RTfols50fhk8E','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('7bDhDdgLIzJEf_FBE27tw','uS-a-MU3RTfols50fhk8E','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('PR0dXn3fqw7LOFB0KMbL0','uS-a-MU3RTfols50fhk8E','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('NOUZvGKjyl2nwplXkjGs-','uS-a-MU3RTfols50fhk8E','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('VviafD0o5ZON3SsHobhrX','uS-a-MU3RTfols50fhk8E','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('GDc6jZFqjui3PCk1pZ8T2','uS-a-MU3RTfols50fhk8E','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('ROqAJAsH3EH4CbTLbovsU','uS-a-MU3RTfols50fhk8E','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('BS1y-TkpVjnhKcXF5kmEz','uS-a-MU3RTfols50fhk8E','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('xQq72LaaHgQeHkKrRZ3mo','uS-a-MU3RTfols50fhk8E','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('0dMxulzqpSASS9vIOF231','uS-a-MU3RTfols50fhk8E','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('Vzk2ziZAjOGyruWBzKUDA','uS-a-MU3RTfols50fhk8E','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('kDjr9tBlQy1OZXb252Ctm','uS-a-MU3RTfols50fhk8E','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('MkAmL5qqcIAgFVQBGR4R2','uS-a-MU3RTfols50fhk8E','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:14.764Z');
INSERT INTO "session_proposals" VALUES('68LTz4kGtuIulqB0MxkHV','uS-a-MU3RTfols50fhk8E','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:14.764Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('0RG8bteZXxl-6pEFqGjoj','cMecuzjoUVMmg2608605d','vyl8-6kP88Fm79OHDXfoH','maybe');
INSERT INTO "votes" VALUES('KBBoQ3wg5zD_3faLsHQRi','LTSVhf6HMj0_3A6b6uMNa','vyl8-6kP88Fm79OHDXfoH','interested');
INSERT INTO "votes" VALUES('Z9MY-F_ub75gVup3uZL0R','QES8J-h-UqqcJ912LwhLa','vyl8-6kP88Fm79OHDXfoH','maybe');
INSERT INTO "votes" VALUES('I960YrTaz289S5IV3EE5u','0lgCm_9f7KEvdYPfSO1Ym','vyl8-6kP88Fm79OHDXfoH','maybe');
INSERT INTO "votes" VALUES('-flEbjqH9wsGI9uqkL1Wn','_wIjSkzhPfEttNVZMhpes','vyl8-6kP88Fm79OHDXfoH','interested');
INSERT INTO "votes" VALUES('FArm91uhTJMAovDkUx231','O2yDcEGHukq3luzh1YCVA','vyl8-6kP88Fm79OHDXfoH','skip');
INSERT INTO "votes" VALUES('-M-aE2qY-Yd7oeQS2IKuE','nzsCESQ8MDJ9AKgU4knBe','yH3NLn7LbuHsgylBytLFs','maybe');
INSERT INTO "votes" VALUES('KftdtMIbn0iss_ofNBmSH','LTSVhf6HMj0_3A6b6uMNa','yH3NLn7LbuHsgylBytLFs','interested');
INSERT INTO "votes" VALUES('SpzrJsLgBn2Rf_H9UJmFm','9YPLCTfbsBa7BSbkp2ICg','yH3NLn7LbuHsgylBytLFs','skip');
INSERT INTO "votes" VALUES('JAiiyqBrU4SNE5KakUwM9','_wIjSkzhPfEttNVZMhpes','yH3NLn7LbuHsgylBytLFs','maybe');
INSERT INTO "votes" VALUES('BPwmaXBzJcHDHBgmNNC4R','9YPLCTfbsBa7BSbkp2ICg','cY457rt7EFQPN75TtMUds','maybe');
INSERT INTO "votes" VALUES('FhYpadQmOwajRWLVBtVDv','QES8J-h-UqqcJ912LwhLa','cY457rt7EFQPN75TtMUds','maybe');
INSERT INTO "votes" VALUES('TD4MyX1mDXHwPM0KU1RUh','BXKvCa9gxpLbYdGvhb7v5','paBPBs9xeDED163O2Ur5M','maybe');
INSERT INTO "votes" VALUES('kR30p3Lg5A64NQ4J9Dcnx','LTSVhf6HMj0_3A6b6uMNa','paBPBs9xeDED163O2Ur5M','interested');
INSERT INTO "votes" VALUES('Eb_vkCSy4vGPJEqugQkhT','0lgCm_9f7KEvdYPfSO1Ym','paBPBs9xeDED163O2Ur5M','maybe');
INSERT INTO "votes" VALUES('do-zx5-5ZXdWP10tNJmZe','ELdWxSl4lBGwWT8PWrums','paBPBs9xeDED163O2Ur5M','interested');
INSERT INTO "votes" VALUES('zphn8NO-LTaknIGTTj_yJ','_wIjSkzhPfEttNVZMhpes','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('Dp88v7rCjW74wvbrjAZXq','nzsCESQ8MDJ9AKgU4knBe','EKzEL3s2jM4ZJuZba3lFX','skip');
INSERT INTO "votes" VALUES('OHE_zZuuHT8ZF4PRERoSh','QES8J-h-UqqcJ912LwhLa','EKzEL3s2jM4ZJuZba3lFX','interested');
INSERT INTO "votes" VALUES('hGFGE8hCtO66n-BHf9_fY','cMecuzjoUVMmg2608605d','Jy0HFfHOqajvN5CS8-nAd','maybe');
INSERT INTO "votes" VALUES('R5CogCX7KPA4PydHxnYlD','0lgCm_9f7KEvdYPfSO1Ym','Jy0HFfHOqajvN5CS8-nAd','maybe');
INSERT INTO "votes" VALUES('N8JInaDY_KxkzYdctON1t','_wIjSkzhPfEttNVZMhpes','Jy0HFfHOqajvN5CS8-nAd','skip');
INSERT INTO "votes" VALUES('lICfZXbw0lTJTus_pgM99','cMecuzjoUVMmg2608605d','07ZthaZgNKrpSr-U3bb6v','skip');
INSERT INTO "votes" VALUES('TkdHd23cVWv_L_S8p0bRh','nzsCESQ8MDJ9AKgU4knBe','07ZthaZgNKrpSr-U3bb6v','skip');
INSERT INTO "votes" VALUES('Y98wCekYdgQ8cnJDgmKmV','BXKvCa9gxpLbYdGvhb7v5','07ZthaZgNKrpSr-U3bb6v','skip');
INSERT INTO "votes" VALUES('6VyU9U3R3jezEAPSVtSHF','LTSVhf6HMj0_3A6b6uMNa','07ZthaZgNKrpSr-U3bb6v','maybe');
INSERT INTO "votes" VALUES('e6khZvLEn1fJTvSANYa1Q','0lgCm_9f7KEvdYPfSO1Ym','07ZthaZgNKrpSr-U3bb6v','maybe');
INSERT INTO "votes" VALUES('3anUI_Isin0dDuf99eqSH','ELdWxSl4lBGwWT8PWrums','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('HXzF00N0FlXn2fgONOtfe','_wIjSkzhPfEttNVZMhpes','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('tMi9mk9CoDacZtjCi2_Aa','O2yDcEGHukq3luzh1YCVA','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('t-nW6_0yaOcPFNxj6UvOB','cMecuzjoUVMmg2608605d','-YknYrHJm0BB9JIxt2RnM','interested');
INSERT INTO "votes" VALUES('bMQdDAaCVg4epvmIMusE9','nzsCESQ8MDJ9AKgU4knBe','-YknYrHJm0BB9JIxt2RnM','interested');
INSERT INTO "votes" VALUES('ez1dKClpSG43Pv560fKx7','ELdWxSl4lBGwWT8PWrums','-YknYrHJm0BB9JIxt2RnM','maybe');
INSERT INTO "votes" VALUES('by4wk3KoapuQ4ngaHZwZ_','O2yDcEGHukq3luzh1YCVA','-YknYrHJm0BB9JIxt2RnM','skip');
INSERT INTO "votes" VALUES('XhWk-tguUMDW9HkTP7FTi','BXKvCa9gxpLbYdGvhb7v5','V67iVP8iscxbgUGPglPIM','skip');
INSERT INTO "votes" VALUES('GeXtCrWr7mDLyjcVQ25Ji','QES8J-h-UqqcJ912LwhLa','V67iVP8iscxbgUGPglPIM','maybe');
INSERT INTO "votes" VALUES('RvvS9YXoNciglNv-w0dzU','O2yDcEGHukq3luzh1YCVA','V67iVP8iscxbgUGPglPIM','maybe');
INSERT INTO "votes" VALUES('XS9SAXR8iHOmnRGZ105KX','nzsCESQ8MDJ9AKgU4knBe','PQN_61rVAB8jkfV3kmFeE','maybe');
INSERT INTO "votes" VALUES('JQl0sIQXLomshpYknEe3h','BXKvCa9gxpLbYdGvhb7v5','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('udLlMKbDGm0uEUWseV5Vw','LTSVhf6HMj0_3A6b6uMNa','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('Yr9aYNztq2PxMAOHfolAY','9YPLCTfbsBa7BSbkp2ICg','PQN_61rVAB8jkfV3kmFeE','skip');
INSERT INTO "votes" VALUES('RR2QmQHCRXygmeJcHOsPA','O2yDcEGHukq3luzh1YCVA','PQN_61rVAB8jkfV3kmFeE','skip');
INSERT INTO "votes" VALUES('FkoArVZy0sz00qwOx29Kb','ELdWxSl4lBGwWT8PWrums','TnJCutPTYzgDtft7HoqZ3','maybe');
INSERT INTO "votes" VALUES('Ifff1TRG5N1sNQbCxgXPG','_wIjSkzhPfEttNVZMhpes','TnJCutPTYzgDtft7HoqZ3','maybe');
INSERT INTO "votes" VALUES('gg0hk5Cfjx5jN2CHb3-ne','O2yDcEGHukq3luzh1YCVA','TnJCutPTYzgDtft7HoqZ3','interested');
INSERT INTO "votes" VALUES('dmr5qcjkonBUlnQ_fekJO','cMecuzjoUVMmg2608605d','cpAxJAf9miETC9QHvSyVU','skip');
INSERT INTO "votes" VALUES('ax-b3Fu6h46AuDI0SBLvw','nzsCESQ8MDJ9AKgU4knBe','cpAxJAf9miETC9QHvSyVU','skip');
INSERT INTO "votes" VALUES('_w6vZ1xVTATTZAl7Eu5Xk','LTSVhf6HMj0_3A6b6uMNa','cpAxJAf9miETC9QHvSyVU','skip');
INSERT INTO "votes" VALUES('YpEpPJWrVD7IsNsZYMtxH','9YPLCTfbsBa7BSbkp2ICg','cpAxJAf9miETC9QHvSyVU','interested');
INSERT INTO "votes" VALUES('qNbvP2psDTzveJpSxBVjl','QES8J-h-UqqcJ912LwhLa','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('cfwWffohxJdx7u97zpGUm','0lgCm_9f7KEvdYPfSO1Ym','cpAxJAf9miETC9QHvSyVU','interested');
INSERT INTO "votes" VALUES('DNyjFHeUcf0Q4ktGwH2gc','BXKvCa9gxpLbYdGvhb7v5','yRYmQ6FVGOhsuk0BN_ejo','maybe');
INSERT INTO "votes" VALUES('zQRx04A4ALaz_71W36cDt','LTSVhf6HMj0_3A6b6uMNa','yRYmQ6FVGOhsuk0BN_ejo','skip');
INSERT INTO "votes" VALUES('GnBvvXPPS3dBlt-1lpe4m','9YPLCTfbsBa7BSbkp2ICg','yRYmQ6FVGOhsuk0BN_ejo','interested');
INSERT INTO "votes" VALUES('Falgk5s7b73PCJdc6tU6Q','QES8J-h-UqqcJ912LwhLa','yRYmQ6FVGOhsuk0BN_ejo','interested');
INSERT INTO "votes" VALUES('gtT2tlxTQYAm1OCHCwg3D','_wIjSkzhPfEttNVZMhpes','sefguhyQA9wtuCqtYCKVt','interested');
INSERT INTO "votes" VALUES('lfH6FoOP__Ei8k2dN-2M_','nzsCESQ8MDJ9AKgU4knBe','bB4JpExeUhf7MkBQ9ZJJO','maybe');
INSERT INTO "votes" VALUES('pLBUQs5q6pRMvIJFJclsd','LTSVhf6HMj0_3A6b6uMNa','bB4JpExeUhf7MkBQ9ZJJO','interested');
INSERT INTO "votes" VALUES('_6S4A2c5ZFZFN0vRiyODs','QES8J-h-UqqcJ912LwhLa','bB4JpExeUhf7MkBQ9ZJJO','maybe');
INSERT INTO "votes" VALUES('tR5iF8xeRa3h_c-BCfsW6','0lgCm_9f7KEvdYPfSO1Ym','bB4JpExeUhf7MkBQ9ZJJO','interested');
INSERT INTO "votes" VALUES('JwF4V15KjA0Kf9nKZaQzh','_wIjSkzhPfEttNVZMhpes','bB4JpExeUhf7MkBQ9ZJJO','maybe');
INSERT INTO "votes" VALUES('rRjupIDJSYOtCfY5CMPoV','O2yDcEGHukq3luzh1YCVA','bB4JpExeUhf7MkBQ9ZJJO','interested');
INSERT INTO "votes" VALUES('RhYs_E2nxw2newe20hLQ9','BXKvCa9gxpLbYdGvhb7v5','HgEisugbs4kIid4ZNZ3xw','skip');
INSERT INTO "votes" VALUES('CuepDDRkUxMQ9_s6zAs-3','LTSVhf6HMj0_3A6b6uMNa','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('Wd4FBsgRJL3BioDXOyGs4','QES8J-h-UqqcJ912LwhLa','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('Hf26XQzJ-5qTRoXIjJ_iK','0lgCm_9f7KEvdYPfSO1Ym','HgEisugbs4kIid4ZNZ3xw','maybe');
INSERT INTO "votes" VALUES('1su7uJTUN5iHfDOFT0Sra','ELdWxSl4lBGwWT8PWrums','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('HNvKwCrnfJwITGf55ZEpA','_wIjSkzhPfEttNVZMhpes','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('bYzaHP0nZpuUvqcSk5t2r','nzsCESQ8MDJ9AKgU4knBe','H8ZHqYr8QSNtXIVqD4GZp','skip');
INSERT INTO "votes" VALUES('XqIYUnmsqLIBX0qJbZ_0W','BXKvCa9gxpLbYdGvhb7v5','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('MsyY3RMamg3lZoGOSAODU','LTSVhf6HMj0_3A6b6uMNa','H8ZHqYr8QSNtXIVqD4GZp','skip');
INSERT INTO "votes" VALUES('XG9NnC4ttqbkLV9hH4nNN','0lgCm_9f7KEvdYPfSO1Ym','H8ZHqYr8QSNtXIVqD4GZp','maybe');
INSERT INTO "votes" VALUES('gAQTPsyKV-_dVqNM2XeUW','_wIjSkzhPfEttNVZMhpes','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('UqdVWVAWRMuYSdp5AYq53','O2yDcEGHukq3luzh1YCVA','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('8gt2fSWCFeyKTtANQ1MLq','cMecuzjoUVMmg2608605d','E0Q8_H4owV_mvUcROELxH','interested');
INSERT INTO "votes" VALUES('8RHO2rltO-9jQGFL3HRjP','nzsCESQ8MDJ9AKgU4knBe','E0Q8_H4owV_mvUcROELxH','interested');
INSERT INTO "votes" VALUES('gIc64yWldOqbCxZYGSMXR','ELdWxSl4lBGwWT8PWrums','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('rng1XgXpsCPE6JHsbFWUL','_wIjSkzhPfEttNVZMhpes','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('c_s2ho6PZrzvAJgdNDsBa','cMecuzjoUVMmg2608605d','6tFA6cVlsCr9Urs19_5kh','interested');
INSERT INTO "votes" VALUES('T05Vnu2mASrsYl-iNS6Zd','nzsCESQ8MDJ9AKgU4knBe','6tFA6cVlsCr9Urs19_5kh','interested');
INSERT INTO "votes" VALUES('Xg5kdaX_iNqTqY9nqZuKZ','BXKvCa9gxpLbYdGvhb7v5','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('ClXfN1zlWOWy8gDs-qxNw','QES8J-h-UqqcJ912LwhLa','6tFA6cVlsCr9Urs19_5kh','maybe');
INSERT INTO "votes" VALUES('05WNZS34DTNEDZgHUVA-H','_wIjSkzhPfEttNVZMhpes','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('-FunnOoRvv35_o76FkB-G','O2yDcEGHukq3luzh1YCVA','6tFA6cVlsCr9Urs19_5kh','interested');
INSERT INTO "votes" VALUES('Ej_urXFwzSveOXDYC6yWK','cMecuzjoUVMmg2608605d','zkZKEFlYMaFZ6t2VKAqsA','maybe');
INSERT INTO "votes" VALUES('xxUDNSyq6DysWM8dxue2U','QES8J-h-UqqcJ912LwhLa','zkZKEFlYMaFZ6t2VKAqsA','maybe');
INSERT INTO "votes" VALUES('kCg9NAur_jSA7OL_ZUGen','0lgCm_9f7KEvdYPfSO1Ym','zkZKEFlYMaFZ6t2VKAqsA','interested');
INSERT INTO "votes" VALUES('a8Q6bAIYFPmt5Qk8CdSDe','ELdWxSl4lBGwWT8PWrums','zkZKEFlYMaFZ6t2VKAqsA','interested');
INSERT INTO "votes" VALUES('SDHBgGp1Z_23lq3GvnOwb','O2yDcEGHukq3luzh1YCVA','zkZKEFlYMaFZ6t2VKAqsA','interested');
INSERT INTO "votes" VALUES('tyfjcgrWWBux6Ex8zHjXK','LTSVhf6HMj0_3A6b6uMNa','TgGUPhlx-LTEFdfOMUsT7','skip');
INSERT INTO "votes" VALUES('AZbAK7O18UOjguQY5-hjX','9YPLCTfbsBa7BSbkp2ICg','TgGUPhlx-LTEFdfOMUsT7','interested');
INSERT INTO "votes" VALUES('ldIaMdsvCu6VwPknrAzi2','0lgCm_9f7KEvdYPfSO1Ym','TgGUPhlx-LTEFdfOMUsT7','maybe');
INSERT INTO "votes" VALUES('h8SMt0yNI5P9bWfNHfYra','ELdWxSl4lBGwWT8PWrums','TgGUPhlx-LTEFdfOMUsT7','maybe');
INSERT INTO "votes" VALUES('lR6hUlLa0hkAxHISJnOuC','cMecuzjoUVMmg2608605d','pbkPpsZ5bf1kVt_beN8Zq','maybe');
INSERT INTO "votes" VALUES('rH7pOkYSCjZ3f5M5Ux1Zs','0lgCm_9f7KEvdYPfSO1Ym','pbkPpsZ5bf1kVt_beN8Zq','interested');
INSERT INTO "votes" VALUES('VneEgWTAzEgV5H_SdQ23z','_wIjSkzhPfEttNVZMhpes','pbkPpsZ5bf1kVt_beN8Zq','interested');
INSERT INTO "votes" VALUES('QYasP5soTnJwLesHUKOMy','O2yDcEGHukq3luzh1YCVA','pbkPpsZ5bf1kVt_beN8Zq','skip');
INSERT INTO "votes" VALUES('xXdlizpY7V2ln-Cb70MiH','cMecuzjoUVMmg2608605d','5K0CGQpJmkJ2482RV0CJV','interested');
INSERT INTO "votes" VALUES('zKojVuktptkibMF-1uAM5','BXKvCa9gxpLbYdGvhb7v5','5K0CGQpJmkJ2482RV0CJV','maybe');
INSERT INTO "votes" VALUES('fAQk2FoL2bcvdc2xIdbpl','QES8J-h-UqqcJ912LwhLa','5K0CGQpJmkJ2482RV0CJV','interested');
INSERT INTO "votes" VALUES('DP4JFKwDkRoOJwcwj7QEA','O2yDcEGHukq3luzh1YCVA','5K0CGQpJmkJ2482RV0CJV','skip');
INSERT INTO "votes" VALUES('tGnrZuNaLPwgwWyKob5eG','QES8J-h-UqqcJ912LwhLa','d3uKuKufQ04c_a1jT5ZYR','skip');
INSERT INTO "votes" VALUES('nKHGoelcmLkT7cCQehiaG','_wIjSkzhPfEttNVZMhpes','d3uKuKufQ04c_a1jT5ZYR','interested');
INSERT INTO "votes" VALUES('Q0kkAFmzBfPQR2aLKrJ9s','O2yDcEGHukq3luzh1YCVA','d3uKuKufQ04c_a1jT5ZYR','maybe');
INSERT INTO "votes" VALUES('-7rjRtmgBuQSJyXbg0A16','cMecuzjoUVMmg2608605d','AlfY65FCbjMRPBLr0AabP','maybe');
INSERT INTO "votes" VALUES('9LRCyZuI4HxzRgDu4faK8','nzsCESQ8MDJ9AKgU4knBe','AlfY65FCbjMRPBLr0AabP','interested');
INSERT INTO "votes" VALUES('Iu25DjwHTHh6gHxtXuFC0','QES8J-h-UqqcJ912LwhLa','AlfY65FCbjMRPBLr0AabP','interested');
INSERT INTO "votes" VALUES('a3Yf1OeE4nxQnbj9PlQM_','0lgCm_9f7KEvdYPfSO1Ym','AlfY65FCbjMRPBLr0AabP','interested');
INSERT INTO "votes" VALUES('4T-xbcdLxf26FIxFjJm9o','ELdWxSl4lBGwWT8PWrums','AlfY65FCbjMRPBLr0AabP','interested');
INSERT INTO "votes" VALUES('WWUsms1aqGYvdkp6fADRe','_wIjSkzhPfEttNVZMhpes','AlfY65FCbjMRPBLr0AabP','maybe');
INSERT INTO "votes" VALUES('INEBaC-OdnPXkhxKDsR9L','cMecuzjoUVMmg2608605d','Q9ezGlQBWd-OfJG4xsVNj','maybe');
INSERT INTO "votes" VALUES('uYr_i-lQgzJBQl1EkUWok','BXKvCa9gxpLbYdGvhb7v5','Q9ezGlQBWd-OfJG4xsVNj','skip');
INSERT INTO "votes" VALUES('oMI4OudB9MKoVJLEMsRTu','O2yDcEGHukq3luzh1YCVA','Q9ezGlQBWd-OfJG4xsVNj','maybe');
INSERT INTO "votes" VALUES('NdA7KZKrO3YYSl4K0uNJo','nzsCESQ8MDJ9AKgU4knBe','ODlcbr8Vl4BiGZdJ0y-m7','maybe');
INSERT INTO "votes" VALUES('hG8Y4ZvOiiuuB8a1EQfRa','QES8J-h-UqqcJ912LwhLa','ODlcbr8Vl4BiGZdJ0y-m7','interested');
INSERT INTO "votes" VALUES('pxeAojIc1FzQgLD18QYNa','ELdWxSl4lBGwWT8PWrums','ODlcbr8Vl4BiGZdJ0y-m7','skip');
INSERT INTO "votes" VALUES('HrHgBxSiiLYkUffwKNzGw','cMecuzjoUVMmg2608605d','CxcFtRc_PMLhOQPdGN5xI','interested');
INSERT INTO "votes" VALUES('sQDQWv4m8bIvi4tKrZ4Ka','LTSVhf6HMj0_3A6b6uMNa','CxcFtRc_PMLhOQPdGN5xI','skip');
INSERT INTO "votes" VALUES('mbaTJ6Ro_4p2eTxGpftMv','0lgCm_9f7KEvdYPfSO1Ym','CxcFtRc_PMLhOQPdGN5xI','interested');
INSERT INTO "votes" VALUES('feAfGPJe0BfAdxJiidXtN','cMecuzjoUVMmg2608605d','GHFf7iHenTQ93qbISr0Ha','maybe');
INSERT INTO "votes" VALUES('jeXFmojydBKKW4L7Ntr-z','BXKvCa9gxpLbYdGvhb7v5','GHFf7iHenTQ93qbISr0Ha','interested');
INSERT INTO "votes" VALUES('KSqpEEaEuiCH8NYHrnyUk','ELdWxSl4lBGwWT8PWrums','GHFf7iHenTQ93qbISr0Ha','maybe');
INSERT INTO "votes" VALUES('m9rAg2XGhTEID_NsgaM1L','_wIjSkzhPfEttNVZMhpes','GHFf7iHenTQ93qbISr0Ha','maybe');
INSERT INTO "votes" VALUES('P1eZ7wdEJKQ5ibgnagfsF','O2yDcEGHukq3luzh1YCVA','GHFf7iHenTQ93qbISr0Ha','maybe');
INSERT INTO "votes" VALUES('V_gg0P_dZXeI0ZMZFhvJZ','cMecuzjoUVMmg2608605d','ekUnPZaxJ3Y-7AK1ZMBTe','maybe');
INSERT INTO "votes" VALUES('rcflwOGH9Ju7RVN6NrEHf','BXKvCa9gxpLbYdGvhb7v5','ekUnPZaxJ3Y-7AK1ZMBTe','interested');
INSERT INTO "votes" VALUES('rO1LYTvhs241AWJQtFaXa','0lgCm_9f7KEvdYPfSO1Ym','ekUnPZaxJ3Y-7AK1ZMBTe','interested');
INSERT INTO "votes" VALUES('q_SMTSB-C2ZUhD4K47tEo','cMecuzjoUVMmg2608605d','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('ph3mMtRENz-zc5SCBBG1P','BXKvCa9gxpLbYdGvhb7v5','AM7pNqlqSaQYx46nWy0Mt','maybe');
INSERT INTO "votes" VALUES('ptlwIuefVud0XZaELJqZc','LTSVhf6HMj0_3A6b6uMNa','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('NcRKrt_gw6945xRyVL8rw','QES8J-h-UqqcJ912LwhLa','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('PH4nWgcrS-TPs4RooneC5','cMecuzjoUVMmg2608605d','QqKFYYQH13WgaUGnwx6RM','interested');
INSERT INTO "votes" VALUES('gsr0y3iyKP9xAAt72mWMo','0lgCm_9f7KEvdYPfSO1Ym','QqKFYYQH13WgaUGnwx6RM','maybe');
INSERT INTO "votes" VALUES('C2BiMqpqyBOKdyoMdOsrn','O2yDcEGHukq3luzh1YCVA','QqKFYYQH13WgaUGnwx6RM','maybe');
INSERT INTO "votes" VALUES('jO_YGmR1UwUdnHFy9TKA9','cMecuzjoUVMmg2608605d','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('tIGdG-k9vHYhL6z3Fyk8F','nzsCESQ8MDJ9AKgU4knBe','mcSRg7CNr0awvcBLHidGl','skip');
INSERT INTO "votes" VALUES('5LEipTCIADj_um-Qe2ogN','9YPLCTfbsBa7BSbkp2ICg','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('n_XamOGtxP0e50-hz0GtE','QES8J-h-UqqcJ912LwhLa','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('wPne9ZL3oDNdnJjK7-_On','ELdWxSl4lBGwWT8PWrums','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('6a7LhjhG6_v6M8IOaNkpj','_wIjSkzhPfEttNVZMhpes','mcSRg7CNr0awvcBLHidGl','maybe');
INSERT INTO "votes" VALUES('Mv-U_EuKIZ1vdABepBEN-','9YPLCTfbsBa7BSbkp2ICg','I7Bk9yb3CsbBHx5P14Fwh','interested');
INSERT INTO "votes" VALUES('7N_m1yoFf4L5HdCaItEuU','cMecuzjoUVMmg2608605d','Rd3-vWy2R5hzaIlmvYwuG','skip');
INSERT INTO "votes" VALUES('ZvF7iLiFutgycgMXR0_MJ','nzsCESQ8MDJ9AKgU4knBe','Rd3-vWy2R5hzaIlmvYwuG','interested');
INSERT INTO "votes" VALUES('qibxJFBy8FU24HEDhKygF','ELdWxSl4lBGwWT8PWrums','Rd3-vWy2R5hzaIlmvYwuG','skip');
INSERT INTO "votes" VALUES('4eon-kvsPMuQE6JvPEAE2','_wIjSkzhPfEttNVZMhpes','Rd3-vWy2R5hzaIlmvYwuG','maybe');
INSERT INTO "votes" VALUES('dpiseCznT1Zx9gPqmdvcT','QES8J-h-UqqcJ912LwhLa','aCtbVVlLZE5gkXxLwjc-x','interested');
INSERT INTO "votes" VALUES('HehSEZgVfUGr9mGEOacAK','ELdWxSl4lBGwWT8PWrums','aCtbVVlLZE5gkXxLwjc-x','interested');
INSERT INTO "votes" VALUES('f-A2gC108KCF8NYrNZOGC','cMecuzjoUVMmg2608605d','CBgApJv8_Ctu4PA9NnLxG','maybe');
INSERT INTO "votes" VALUES('b21SO_8u0E8Y6_dPZW7rQ','LTSVhf6HMj0_3A6b6uMNa','CBgApJv8_Ctu4PA9NnLxG','interested');
INSERT INTO "votes" VALUES('2qHHoiylDFFGiRToP0id_','9YPLCTfbsBa7BSbkp2ICg','CBgApJv8_Ctu4PA9NnLxG','interested');
INSERT INTO "votes" VALUES('7ojJHhUUIF3vXQ4pgjqss','QES8J-h-UqqcJ912LwhLa','CBgApJv8_Ctu4PA9NnLxG','interested');
INSERT INTO "votes" VALUES('SZCIdwy51zjm-wkfkUVcj','ELdWxSl4lBGwWT8PWrums','CBgApJv8_Ctu4PA9NnLxG','interested');
INSERT INTO "votes" VALUES('KQw6B_r4BfIaGC71lktXB','_wIjSkzhPfEttNVZMhpes','CBgApJv8_Ctu4PA9NnLxG','maybe');
INSERT INTO "votes" VALUES('fbcmxEM-S8o-60OJrS1_H','LTSVhf6HMj0_3A6b6uMNa','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('xcLY2R8cMpeUWdGOocw_F','0lgCm_9f7KEvdYPfSO1Ym','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('RBOy03RFo4ap1YK1f4Xau','BXKvCa9gxpLbYdGvhb7v5','TKr75Ctm2EiALroFku-3i','maybe');
INSERT INTO "votes" VALUES('2aPlj1ZU8_9uzE41iO4OE','LTSVhf6HMj0_3A6b6uMNa','TKr75Ctm2EiALroFku-3i','interested');
INSERT INTO "votes" VALUES('bxlS846Ko2Gk_PN7kYfpb','9YPLCTfbsBa7BSbkp2ICg','TKr75Ctm2EiALroFku-3i','maybe');
INSERT INTO "votes" VALUES('y3t79oGDcXg9D6spCJoZc','O2yDcEGHukq3luzh1YCVA','TKr75Ctm2EiALroFku-3i','skip');
INSERT INTO "votes" VALUES('C-ulAI_WfQWoTY3HAliQE','cMecuzjoUVMmg2608605d','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('WUMrRzG8WlBa8n9-smvSD','nzsCESQ8MDJ9AKgU4knBe','wYKwW6WMzYBPRlbP5aFEt','maybe');
INSERT INTO "votes" VALUES('21B-Mr2K8mR3Ob_y5Fbvk','BXKvCa9gxpLbYdGvhb7v5','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('g7fUAWu-hYLS_2m-eaFWS','9YPLCTfbsBa7BSbkp2ICg','wYKwW6WMzYBPRlbP5aFEt','maybe');
INSERT INTO "votes" VALUES('F6Km1p0bXquDezYYbnGrM','QES8J-h-UqqcJ912LwhLa','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('z8PsBBA79riH4eIvnCr5L','ELdWxSl4lBGwWT8PWrums','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('DlGNFU0GawLYr6ItZLuhP','O2yDcEGHukq3luzh1YCVA','wYKwW6WMzYBPRlbP5aFEt','maybe');
INSERT INTO "votes" VALUES('t_L2XSzk13DOS8Nbq_xal','pScbY1rRMiZpTlsUVTFjS','vyl8-6kP88Fm79OHDXfoH','maybe');
INSERT INTO "votes" VALUES('QsmJ2kFetfuD_SuRyVJfG','Utehr95J4Qk-S2McFjCqF','vyl8-6kP88Fm79OHDXfoH','skip');
INSERT INTO "votes" VALUES('b8T4tMl3Nj9vkj3ENWr7P','7bDhDdgLIzJEf_FBE27tw','vyl8-6kP88Fm79OHDXfoH','skip');
INSERT INTO "votes" VALUES('6X7xA-HyPxYGFEWlkbI68','VviafD0o5ZON3SsHobhrX','vyl8-6kP88Fm79OHDXfoH','maybe');
INSERT INTO "votes" VALUES('I1b5gGu45xTGce80_QrnM','ROqAJAsH3EH4CbTLbovsU','vyl8-6kP88Fm79OHDXfoH','skip');
INSERT INTO "votes" VALUES('6FXKbh1_-9ilpqtE9zxs0','0dMxulzqpSASS9vIOF231','vyl8-6kP88Fm79OHDXfoH','interested');
INSERT INTO "votes" VALUES('IQJcDwv4Wx3BPABZwypn6','WKUtXvGZotK-zqOt66YTy','yH3NLn7LbuHsgylBytLFs','interested');
INSERT INTO "votes" VALUES('ZDlmdzyghSjPfnP2zEPKI','jCiH82MZ76eSptuEHJgS8','yH3NLn7LbuHsgylBytLFs','skip');
INSERT INTO "votes" VALUES('nEvQmYN_pj5nCHyJGPmiD','7bDhDdgLIzJEf_FBE27tw','yH3NLn7LbuHsgylBytLFs','skip');
INSERT INTO "votes" VALUES('MKxlmtoFlC6bH3_hXCH-9','GDc6jZFqjui3PCk1pZ8T2','yH3NLn7LbuHsgylBytLFs','skip');
INSERT INTO "votes" VALUES('IKifwoyim_FX8zYQBNC5A','ROqAJAsH3EH4CbTLbovsU','yH3NLn7LbuHsgylBytLFs','skip');
INSERT INTO "votes" VALUES('n0y8sMKrKNQWjpFmU9rBd','xQq72LaaHgQeHkKrRZ3mo','yH3NLn7LbuHsgylBytLFs','interested');
INSERT INTO "votes" VALUES('_Hf_csDufemhP-iMfURHW','jCiH82MZ76eSptuEHJgS8','cY457rt7EFQPN75TtMUds','skip');
INSERT INTO "votes" VALUES('ZxKMpVYppObt6rkZdcTPs','PR0dXn3fqw7LOFB0KMbL0','cY457rt7EFQPN75TtMUds','maybe');
INSERT INTO "votes" VALUES('YMKguHycg6LLe68SsEb0u','BS1y-TkpVjnhKcXF5kmEz','cY457rt7EFQPN75TtMUds','maybe');
INSERT INTO "votes" VALUES('ozjpOqMIlsaste1K9iaVv','0dMxulzqpSASS9vIOF231','cY457rt7EFQPN75TtMUds','interested');
INSERT INTO "votes" VALUES('4LY0OHSaIXvl1qN-YcYte','WKUtXvGZotK-zqOt66YTy','paBPBs9xeDED163O2Ur5M','interested');
INSERT INTO "votes" VALUES('ICk6ypQSXXd03rFcwydOF','jCiH82MZ76eSptuEHJgS8','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('8p2qDwtp7lk_qm8mA5S5i','7bDhDdgLIzJEf_FBE27tw','paBPBs9xeDED163O2Ur5M','maybe');
INSERT INTO "votes" VALUES('cR5sMo07ZdTO_emuBYp1n','PR0dXn3fqw7LOFB0KMbL0','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('24uuMu_AC7RhswN8DQkoG','GDc6jZFqjui3PCk1pZ8T2','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('8a3WDG9KtFaDqckq7g_tS','xQq72LaaHgQeHkKrRZ3mo','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('jBwP1g8LVHgI8BTp000gS','0dMxulzqpSASS9vIOF231','paBPBs9xeDED163O2Ur5M','skip');
INSERT INTO "votes" VALUES('uRNezzViEVEsOKwcy4Zzq','Vzk2ziZAjOGyruWBzKUDA','paBPBs9xeDED163O2Ur5M','interested');
INSERT INTO "votes" VALUES('fkRNqA1FkXo6-wfd-vr_S','pScbY1rRMiZpTlsUVTFjS','EKzEL3s2jM4ZJuZba3lFX','interested');
INSERT INTO "votes" VALUES('qYRGn_HskuY6UxOkqWoqD','Utehr95J4Qk-S2McFjCqF','EKzEL3s2jM4ZJuZba3lFX','interested');
INSERT INTO "votes" VALUES('aiL0ZaW24s-iopekNprep','2w3JMNDuirUnG8T9aidxd','EKzEL3s2jM4ZJuZba3lFX','maybe');
INSERT INTO "votes" VALUES('KWrvGAwZmHMAQW7_XitTF','NOUZvGKjyl2nwplXkjGs-','EKzEL3s2jM4ZJuZba3lFX','maybe');
INSERT INTO "votes" VALUES('mepoA8iE2ukOs4UgoMqD6','VviafD0o5ZON3SsHobhrX','EKzEL3s2jM4ZJuZba3lFX','interested');
INSERT INTO "votes" VALUES('vmDkBN018ldXWrUFFxXFT','xQq72LaaHgQeHkKrRZ3mo','EKzEL3s2jM4ZJuZba3lFX','maybe');
INSERT INTO "votes" VALUES('cSOuNQ0nW4GA5GgZpatzk','WKUtXvGZotK-zqOt66YTy','Jy0HFfHOqajvN5CS8-nAd','interested');
INSERT INTO "votes" VALUES('xzmq0GQ4HZNBrUrKuSowX','2w3JMNDuirUnG8T9aidxd','Jy0HFfHOqajvN5CS8-nAd','maybe');
INSERT INTO "votes" VALUES('K5FROPSm6jhg-J_MradY3','PR0dXn3fqw7LOFB0KMbL0','Jy0HFfHOqajvN5CS8-nAd','maybe');
INSERT INTO "votes" VALUES('RcvqErlnsFNSHLYmIU_JI','xQq72LaaHgQeHkKrRZ3mo','Jy0HFfHOqajvN5CS8-nAd','interested');
INSERT INTO "votes" VALUES('CXsaD_pD6qaOLeK3IlH9O','jCiH82MZ76eSptuEHJgS8','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('Uahu-RDS2ylQ97A6v5lNX','2w3JMNDuirUnG8T9aidxd','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('I1hJ1GdFqgJV1cDOSl5kW','ROqAJAsH3EH4CbTLbovsU','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('_68Bhd2t_eGLT-rVqLjsC','xQq72LaaHgQeHkKrRZ3mo','07ZthaZgNKrpSr-U3bb6v','maybe');
INSERT INTO "votes" VALUES('KDA_PFwlH1Jr7K5cz4aht','0dMxulzqpSASS9vIOF231','07ZthaZgNKrpSr-U3bb6v','skip');
INSERT INTO "votes" VALUES('s64fYGlugTZgPIImDCs7v','Vzk2ziZAjOGyruWBzKUDA','07ZthaZgNKrpSr-U3bb6v','interested');
INSERT INTO "votes" VALUES('9VnTf66Ex_soiUINcMgzo','WKUtXvGZotK-zqOt66YTy','-YknYrHJm0BB9JIxt2RnM','skip');
INSERT INTO "votes" VALUES('q8U-yvMw0pWlzP_tM-mCQ','PR0dXn3fqw7LOFB0KMbL0','-YknYrHJm0BB9JIxt2RnM','maybe');
INSERT INTO "votes" VALUES('HwezRbPsRRz2ByNbw-GV7','NOUZvGKjyl2nwplXkjGs-','-YknYrHJm0BB9JIxt2RnM','maybe');
INSERT INTO "votes" VALUES('qcDcnqTb8qRsfRKQF3D73','BS1y-TkpVjnhKcXF5kmEz','-YknYrHJm0BB9JIxt2RnM','skip');
INSERT INTO "votes" VALUES('kwHpn2LYpqS1T8eXOPvBy','xQq72LaaHgQeHkKrRZ3mo','-YknYrHJm0BB9JIxt2RnM','interested');
INSERT INTO "votes" VALUES('fJ9tdZeipLucn094ExXWk','WKUtXvGZotK-zqOt66YTy','V67iVP8iscxbgUGPglPIM','interested');
INSERT INTO "votes" VALUES('gJ_MUxe6h18EcKgMD3H0H','pScbY1rRMiZpTlsUVTFjS','V67iVP8iscxbgUGPglPIM','maybe');
INSERT INTO "votes" VALUES('N5TqKhXL6WWDW7WHHsqBd','7bDhDdgLIzJEf_FBE27tw','V67iVP8iscxbgUGPglPIM','maybe');
INSERT INTO "votes" VALUES('SQ4t8H-KoFX7dxMcP2kFQ','NOUZvGKjyl2nwplXkjGs-','V67iVP8iscxbgUGPglPIM','interested');
INSERT INTO "votes" VALUES('XEtFZgMdW4ExsDkmUUnWl','0dMxulzqpSASS9vIOF231','V67iVP8iscxbgUGPglPIM','maybe');
INSERT INTO "votes" VALUES('5Iw39Mf4QZp0ijhixVtPe','pScbY1rRMiZpTlsUVTFjS','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('X9TS6AirzP-UymFxtVzEr','Utehr95J4Qk-S2McFjCqF','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('vF8Q3BvU5zwcVJLIO2HIp','jCiH82MZ76eSptuEHJgS8','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('l8hTZWJVfuY6d8Eci1hM7','7bDhDdgLIzJEf_FBE27tw','PQN_61rVAB8jkfV3kmFeE','maybe');
INSERT INTO "votes" VALUES('ieUqH8n-GeYC8yk8RbNF0','NOUZvGKjyl2nwplXkjGs-','PQN_61rVAB8jkfV3kmFeE','skip');
INSERT INTO "votes" VALUES('tGnBzwAedYX7_5TGdH36k','ROqAJAsH3EH4CbTLbovsU','PQN_61rVAB8jkfV3kmFeE','interested');
INSERT INTO "votes" VALUES('Rsbpu0mMWlQx0HN_5UFMS','xQq72LaaHgQeHkKrRZ3mo','PQN_61rVAB8jkfV3kmFeE','maybe');
INSERT INTO "votes" VALUES('UbPQ19V4dOHRZoCKQIa3t','Vzk2ziZAjOGyruWBzKUDA','PQN_61rVAB8jkfV3kmFeE','maybe');
INSERT INTO "votes" VALUES('Q67nQZkZlz7eZRpDCTSG4','pScbY1rRMiZpTlsUVTFjS','TnJCutPTYzgDtft7HoqZ3','maybe');
INSERT INTO "votes" VALUES('FgYtnBlRe78or2Y8UCgf_','GDc6jZFqjui3PCk1pZ8T2','TnJCutPTYzgDtft7HoqZ3','skip');
INSERT INTO "votes" VALUES('EKOzzKvDexLGuLrrjc4M3','BS1y-TkpVjnhKcXF5kmEz','TnJCutPTYzgDtft7HoqZ3','maybe');
INSERT INTO "votes" VALUES('CO3e1rJfv6FvbVzfVDEpB','xQq72LaaHgQeHkKrRZ3mo','TnJCutPTYzgDtft7HoqZ3','interested');
INSERT INTO "votes" VALUES('_ZT7Y4vYd2AoDtu8j5xhw','0dMxulzqpSASS9vIOF231','TnJCutPTYzgDtft7HoqZ3','interested');
INSERT INTO "votes" VALUES('VJ3vl8011z6QheVILt8Vm','Vzk2ziZAjOGyruWBzKUDA','TnJCutPTYzgDtft7HoqZ3','interested');
INSERT INTO "votes" VALUES('0ElHCj7BQtxtc9GYepHBh','WKUtXvGZotK-zqOt66YTy','cpAxJAf9miETC9QHvSyVU','interested');
INSERT INTO "votes" VALUES('6r6AtgZtptKBLJxxR8T5o','jCiH82MZ76eSptuEHJgS8','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('JgmGh9PdsxZmjr6xjmIZ-','7bDhDdgLIzJEf_FBE27tw','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('4wVBmYyELeI4FOIq2M3i3','NOUZvGKjyl2nwplXkjGs-','cpAxJAf9miETC9QHvSyVU','interested');
INSERT INTO "votes" VALUES('VaFvv6ZJJ3O509GyjGXCx','VviafD0o5ZON3SsHobhrX','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('bcRAjCKPApzmE3sTMT2Cm','GDc6jZFqjui3PCk1pZ8T2','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('g67q_Y6KvA3JtoqwvHUE9','ROqAJAsH3EH4CbTLbovsU','cpAxJAf9miETC9QHvSyVU','interested');
INSERT INTO "votes" VALUES('PGKXVKYu5pMddvUW16PPO','xQq72LaaHgQeHkKrRZ3mo','cpAxJAf9miETC9QHvSyVU','maybe');
INSERT INTO "votes" VALUES('FfSVyMk8tPKRPiOsFdcfB','pScbY1rRMiZpTlsUVTFjS','yRYmQ6FVGOhsuk0BN_ejo','maybe');
INSERT INTO "votes" VALUES('2yQxxVpOlWOqd7liumuwL','VviafD0o5ZON3SsHobhrX','yRYmQ6FVGOhsuk0BN_ejo','maybe');
INSERT INTO "votes" VALUES('zFQM4hEtA2vmYR_jT8gHr','pScbY1rRMiZpTlsUVTFjS','sefguhyQA9wtuCqtYCKVt','maybe');
INSERT INTO "votes" VALUES('FtQDXMk5Jf7PX3GDoN8Z7','jCiH82MZ76eSptuEHJgS8','sefguhyQA9wtuCqtYCKVt','maybe');
INSERT INTO "votes" VALUES('xjNTQMl581hqXub_quQwn','7bDhDdgLIzJEf_FBE27tw','sefguhyQA9wtuCqtYCKVt','skip');
INSERT INTO "votes" VALUES('Br8gLxA1KsNgQVpbEEMNr','NOUZvGKjyl2nwplXkjGs-','sefguhyQA9wtuCqtYCKVt','interested');
INSERT INTO "votes" VALUES('1j3Y2KJaE-FDG3CBPZadi','VviafD0o5ZON3SsHobhrX','sefguhyQA9wtuCqtYCKVt','interested');
INSERT INTO "votes" VALUES('BN2-70w_XeA34G7MdS1tB','GDc6jZFqjui3PCk1pZ8T2','sefguhyQA9wtuCqtYCKVt','skip');
INSERT INTO "votes" VALUES('wquRvJ7HtMOmGBWKnZzEF','ROqAJAsH3EH4CbTLbovsU','sefguhyQA9wtuCqtYCKVt','skip');
INSERT INTO "votes" VALUES('rwO8AsIyGjm9I7d2pHKIm','xQq72LaaHgQeHkKrRZ3mo','sefguhyQA9wtuCqtYCKVt','interested');
INSERT INTO "votes" VALUES('ZKp-Yb-e87aUOwSIUUUnm','Vzk2ziZAjOGyruWBzKUDA','sefguhyQA9wtuCqtYCKVt','interested');
INSERT INTO "votes" VALUES('jIJOmf1U6_a1ap5p4wGtP','jCiH82MZ76eSptuEHJgS8','bB4JpExeUhf7MkBQ9ZJJO','interested');
INSERT INTO "votes" VALUES('IItMOeDQpj7pfamiwJULi','Vzk2ziZAjOGyruWBzKUDA','bB4JpExeUhf7MkBQ9ZJJO','maybe');
INSERT INTO "votes" VALUES('-7GO3QQqY3Luka7iJ0UuQ','2w3JMNDuirUnG8T9aidxd','HgEisugbs4kIid4ZNZ3xw','skip');
INSERT INTO "votes" VALUES('1LDVkkAVLZLa1YSUQYNHy','GDc6jZFqjui3PCk1pZ8T2','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('80i9e1YJHyRKv8KAwUdTJ','ROqAJAsH3EH4CbTLbovsU','HgEisugbs4kIid4ZNZ3xw','interested');
INSERT INTO "votes" VALUES('UmC6-c-ipNyFUk81N-Iyu','0dMxulzqpSASS9vIOF231','HgEisugbs4kIid4ZNZ3xw','maybe');
INSERT INTO "votes" VALUES('8e5hhS7hh4DOK0C7p5D12','Utehr95J4Qk-S2McFjCqF','H8ZHqYr8QSNtXIVqD4GZp','maybe');
INSERT INTO "votes" VALUES('vxtpK0slAuM245dV6jNch','2w3JMNDuirUnG8T9aidxd','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('XmJJK5bwdHHlybaC_FuHd','7bDhDdgLIzJEf_FBE27tw','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('Gn5Lr07tz5ygKc6Vkj1V1','NOUZvGKjyl2nwplXkjGs-','H8ZHqYr8QSNtXIVqD4GZp','skip');
INSERT INTO "votes" VALUES('v8R8UNe4krBJK6vsuKFDu','VviafD0o5ZON3SsHobhrX','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('_XmBjulW-eWhQGXuwRZOa','GDc6jZFqjui3PCk1pZ8T2','H8ZHqYr8QSNtXIVqD4GZp','interested');
INSERT INTO "votes" VALUES('QWqrVZx0lOISiREbMdvMu','ROqAJAsH3EH4CbTLbovsU','H8ZHqYr8QSNtXIVqD4GZp','skip');
INSERT INTO "votes" VALUES('mvJ1qUxIqMMFWSC9hapiu','Vzk2ziZAjOGyruWBzKUDA','H8ZHqYr8QSNtXIVqD4GZp','skip');
INSERT INTO "votes" VALUES('Y_Gtj1-HeXrUNYc_f0l6u','WKUtXvGZotK-zqOt66YTy','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('J85py6D8swA86B9ahM2d3','7bDhDdgLIzJEf_FBE27tw','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('w0G7_fb2itW9NoHjysqdI','NOUZvGKjyl2nwplXkjGs-','E0Q8_H4owV_mvUcROELxH','interested');
INSERT INTO "votes" VALUES('UnaOCo7P9OmPN2vY1eSsI','VviafD0o5ZON3SsHobhrX','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('_qf_JpX8SaBbIyUvvULej','GDc6jZFqjui3PCk1pZ8T2','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('TqodXuaA3-u_6C1m_P21p','ROqAJAsH3EH4CbTLbovsU','E0Q8_H4owV_mvUcROELxH','skip');
INSERT INTO "votes" VALUES('XkoN0oXRONzmBJz30FMa8','BS1y-TkpVjnhKcXF5kmEz','E0Q8_H4owV_mvUcROELxH','maybe');
INSERT INTO "votes" VALUES('PWfF6PGY81rLEBAbHNpAN','pScbY1rRMiZpTlsUVTFjS','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('ExLrt8YxNF_0o9Y_SoFmp','jCiH82MZ76eSptuEHJgS8','6tFA6cVlsCr9Urs19_5kh','maybe');
INSERT INTO "votes" VALUES('hdCgZHECK1lY66FlzOYcs','PR0dXn3fqw7LOFB0KMbL0','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('ClYW6HPD-TCZmKaPe_uqK','NOUZvGKjyl2nwplXkjGs-','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('XOeP2dFkK_6itNuYiaNr9','ROqAJAsH3EH4CbTLbovsU','6tFA6cVlsCr9Urs19_5kh','interested');
INSERT INTO "votes" VALUES('XOURD9oR628dONtJDa7I0','BS1y-TkpVjnhKcXF5kmEz','6tFA6cVlsCr9Urs19_5kh','interested');
INSERT INTO "votes" VALUES('lySVveEJXqct55rNma_oJ','Vzk2ziZAjOGyruWBzKUDA','6tFA6cVlsCr9Urs19_5kh','skip');
INSERT INTO "votes" VALUES('QS-8ir8pee9O14pxTRpqf','2w3JMNDuirUnG8T9aidxd','zkZKEFlYMaFZ6t2VKAqsA','maybe');
INSERT INTO "votes" VALUES('KESIIANeDAVx7FCPhU8YL','PR0dXn3fqw7LOFB0KMbL0','zkZKEFlYMaFZ6t2VKAqsA','maybe');
INSERT INTO "votes" VALUES('UHSaI8N2a6DUbK2I3sL52','NOUZvGKjyl2nwplXkjGs-','zkZKEFlYMaFZ6t2VKAqsA','skip');
INSERT INTO "votes" VALUES('30wg21CiTxgIb5tqBxoS-','ROqAJAsH3EH4CbTLbovsU','zkZKEFlYMaFZ6t2VKAqsA','interested');
INSERT INTO "votes" VALUES('VLxw7mupLJN_Eun0sDvxc','BS1y-TkpVjnhKcXF5kmEz','zkZKEFlYMaFZ6t2VKAqsA','interested');
INSERT INTO "votes" VALUES('aWPbxWhnl3fzTUGi1U7X5','Utehr95J4Qk-S2McFjCqF','TgGUPhlx-LTEFdfOMUsT7','maybe');
INSERT INTO "votes" VALUES('nFVCG5uvWvw4ZB3BK8n-z','0dMxulzqpSASS9vIOF231','TgGUPhlx-LTEFdfOMUsT7','interested');
INSERT INTO "votes" VALUES('p9o2alw1NcJPGyvHFuufF','Vzk2ziZAjOGyruWBzKUDA','TgGUPhlx-LTEFdfOMUsT7','interested');
INSERT INTO "votes" VALUES('XzTjTuVEmbxUoDy8ARBqh','jCiH82MZ76eSptuEHJgS8','pbkPpsZ5bf1kVt_beN8Zq','maybe');
INSERT INTO "votes" VALUES('RJcsYx3onm9Tr72VCF5HD','NOUZvGKjyl2nwplXkjGs-','pbkPpsZ5bf1kVt_beN8Zq','interested');
INSERT INTO "votes" VALUES('nKgzaFXLZ1w6iAGw2Hjlx','jCiH82MZ76eSptuEHJgS8','5K0CGQpJmkJ2482RV0CJV','maybe');
INSERT INTO "votes" VALUES('X2IOyzYuM8B2JGpzbHVT6','2w3JMNDuirUnG8T9aidxd','5K0CGQpJmkJ2482RV0CJV','interested');
INSERT INTO "votes" VALUES('6Zm4J4eUl3Glqa6IkEWPY','VviafD0o5ZON3SsHobhrX','5K0CGQpJmkJ2482RV0CJV','interested');
INSERT INTO "votes" VALUES('kWMr6yNc9cvLOSc5LoCfV','GDc6jZFqjui3PCk1pZ8T2','5K0CGQpJmkJ2482RV0CJV','skip');
INSERT INTO "votes" VALUES('tNV5oFZZf1DNQhb6xyowp','ROqAJAsH3EH4CbTLbovsU','5K0CGQpJmkJ2482RV0CJV','skip');
INSERT INTO "votes" VALUES('1fEFi1SmUPdy4d3Az6kFo','pScbY1rRMiZpTlsUVTFjS','d3uKuKufQ04c_a1jT5ZYR','interested');
INSERT INTO "votes" VALUES('JmK_QdkUGbs3aEMBBm0j6','2w3JMNDuirUnG8T9aidxd','d3uKuKufQ04c_a1jT5ZYR','maybe');
INSERT INTO "votes" VALUES('2h_wFWdu8LYM8lExnyQ8-','7bDhDdgLIzJEf_FBE27tw','d3uKuKufQ04c_a1jT5ZYR','interested');
INSERT INTO "votes" VALUES('E8QqNh6oEhf8VZzdgOs8C','0dMxulzqpSASS9vIOF231','d3uKuKufQ04c_a1jT5ZYR','interested');
INSERT INTO "votes" VALUES('bZftohpUCh989UNVENl77','WKUtXvGZotK-zqOt66YTy','AlfY65FCbjMRPBLr0AabP','skip');
INSERT INTO "votes" VALUES('UpB7ONMNZgTEH2E2OQEbQ','2w3JMNDuirUnG8T9aidxd','AlfY65FCbjMRPBLr0AabP','skip');
INSERT INTO "votes" VALUES('hAC1bnIh6Wi4TL-aq9hEt','7bDhDdgLIzJEf_FBE27tw','AlfY65FCbjMRPBLr0AabP','maybe');
INSERT INTO "votes" VALUES('9eSd0muH52S3SUuV8rwPR','GDc6jZFqjui3PCk1pZ8T2','AlfY65FCbjMRPBLr0AabP','skip');
INSERT INTO "votes" VALUES('9vvnNnZYlVIpXJy5vhV_W','BS1y-TkpVjnhKcXF5kmEz','AlfY65FCbjMRPBLr0AabP','interested');
INSERT INTO "votes" VALUES('fKklLM-y8qZkXIzCzuzcR','WKUtXvGZotK-zqOt66YTy','Q9ezGlQBWd-OfJG4xsVNj','skip');
INSERT INTO "votes" VALUES('-RVp2C6dx4SaFoQ8g6bDb','Utehr95J4Qk-S2McFjCqF','Q9ezGlQBWd-OfJG4xsVNj','skip');
INSERT INTO "votes" VALUES('e-FCvs3ZlFdEFx6Miwc5U','PR0dXn3fqw7LOFB0KMbL0','Q9ezGlQBWd-OfJG4xsVNj','maybe');
INSERT INTO "votes" VALUES('iYh89f2Wl7TCZkgEyT91f','GDc6jZFqjui3PCk1pZ8T2','Q9ezGlQBWd-OfJG4xsVNj','maybe');
INSERT INTO "votes" VALUES('k8htzMpB6RIadHDoOi-Tb','ROqAJAsH3EH4CbTLbovsU','Q9ezGlQBWd-OfJG4xsVNj','interested');
INSERT INTO "votes" VALUES('PtoFIbZiAPuMuhJD2bGUx','pScbY1rRMiZpTlsUVTFjS','ODlcbr8Vl4BiGZdJ0y-m7','maybe');
INSERT INTO "votes" VALUES('5S5x40U-PuHhQpxKb920T','Utehr95J4Qk-S2McFjCqF','ODlcbr8Vl4BiGZdJ0y-m7','interested');
INSERT INTO "votes" VALUES('uLy2EzwSS6EKWmIIwVh9j','jCiH82MZ76eSptuEHJgS8','ODlcbr8Vl4BiGZdJ0y-m7','skip');
INSERT INTO "votes" VALUES('rSJB_zo4VAfD9vC4OVaI5','VviafD0o5ZON3SsHobhrX','ODlcbr8Vl4BiGZdJ0y-m7','maybe');
INSERT INTO "votes" VALUES('XgNpHGQTkeAvANv6JNunJ','GDc6jZFqjui3PCk1pZ8T2','ODlcbr8Vl4BiGZdJ0y-m7','maybe');
INSERT INTO "votes" VALUES('jdSYwHPNQYSvXjAhhv3I9','ROqAJAsH3EH4CbTLbovsU','ODlcbr8Vl4BiGZdJ0y-m7','maybe');
INSERT INTO "votes" VALUES('e51Xxrt-7dS5_M9-k9QlV','BS1y-TkpVjnhKcXF5kmEz','ODlcbr8Vl4BiGZdJ0y-m7','skip');
INSERT INTO "votes" VALUES('EUxlW0x5N-8LD7TWQ35tp','xQq72LaaHgQeHkKrRZ3mo','ODlcbr8Vl4BiGZdJ0y-m7','interested');
INSERT INTO "votes" VALUES('UFYP75kQG_Xl3Tpk5caC7','jCiH82MZ76eSptuEHJgS8','CxcFtRc_PMLhOQPdGN5xI','maybe');
INSERT INTO "votes" VALUES('rSGgiySKRvSxSkZDwCzBG','NOUZvGKjyl2nwplXkjGs-','CxcFtRc_PMLhOQPdGN5xI','interested');
INSERT INTO "votes" VALUES('9jR-HVTFITikYzz3hXylW','VviafD0o5ZON3SsHobhrX','CxcFtRc_PMLhOQPdGN5xI','maybe');
INSERT INTO "votes" VALUES('1Ke7_EyEAVWa1G_1aiqhI','GDc6jZFqjui3PCk1pZ8T2','CxcFtRc_PMLhOQPdGN5xI','maybe');
INSERT INTO "votes" VALUES('HuN1SMtaPO85ixqcotUvn','xQq72LaaHgQeHkKrRZ3mo','CxcFtRc_PMLhOQPdGN5xI','maybe');
INSERT INTO "votes" VALUES('dl2fpbuwafosIvWvaGC4O','WKUtXvGZotK-zqOt66YTy','GHFf7iHenTQ93qbISr0Ha','interested');
INSERT INTO "votes" VALUES('2QLTm-zDppOZJ0_Nd5gsq','jCiH82MZ76eSptuEHJgS8','GHFf7iHenTQ93qbISr0Ha','interested');
INSERT INTO "votes" VALUES('2307kPyI_8jxM7gtQbHq2','7bDhDdgLIzJEf_FBE27tw','GHFf7iHenTQ93qbISr0Ha','skip');
INSERT INTO "votes" VALUES('DURAM_KP5EihwdgaQPLtO','PR0dXn3fqw7LOFB0KMbL0','GHFf7iHenTQ93qbISr0Ha','skip');
INSERT INTO "votes" VALUES('tTtcr4JmLPXqeAjrUVQbk','NOUZvGKjyl2nwplXkjGs-','GHFf7iHenTQ93qbISr0Ha','maybe');
INSERT INTO "votes" VALUES('u8P43jCYs3zT4rKGPSYF6','GDc6jZFqjui3PCk1pZ8T2','GHFf7iHenTQ93qbISr0Ha','skip');
INSERT INTO "votes" VALUES('DRVWN5TsqnoAtqx3Emwpv','pScbY1rRMiZpTlsUVTFjS','ekUnPZaxJ3Y-7AK1ZMBTe','interested');
INSERT INTO "votes" VALUES('wwIFUx0sKGFHvTDCG8zYC','2w3JMNDuirUnG8T9aidxd','ekUnPZaxJ3Y-7AK1ZMBTe','maybe');
INSERT INTO "votes" VALUES('KS1J8mZq9n584l_R7JX-k','VviafD0o5ZON3SsHobhrX','ekUnPZaxJ3Y-7AK1ZMBTe','skip');
INSERT INTO "votes" VALUES('3vUxDQ20TNeTCFGLHO9JL','ROqAJAsH3EH4CbTLbovsU','ekUnPZaxJ3Y-7AK1ZMBTe','skip');
INSERT INTO "votes" VALUES('tq4Vm6AUO_OrqlifKE01t','BS1y-TkpVjnhKcXF5kmEz','ekUnPZaxJ3Y-7AK1ZMBTe','maybe');
INSERT INTO "votes" VALUES('IGAEAPYPk_PEBqDR7ScgM','xQq72LaaHgQeHkKrRZ3mo','ekUnPZaxJ3Y-7AK1ZMBTe','maybe');
INSERT INTO "votes" VALUES('r5wBlWPJrb1emVzhk1oiV','Utehr95J4Qk-S2McFjCqF','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('q6447cGg48qRINf9alI7D','7bDhDdgLIzJEf_FBE27tw','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('HNvRRgjQsrpCkDPTTFq_8','GDc6jZFqjui3PCk1pZ8T2','AM7pNqlqSaQYx46nWy0Mt','maybe');
INSERT INTO "votes" VALUES('_fo-8Ae9ECVdRBKyCnxO9','BS1y-TkpVjnhKcXF5kmEz','AM7pNqlqSaQYx46nWy0Mt','interested');
INSERT INTO "votes" VALUES('LFcK0no8gJyBIbZ2tr38a','xQq72LaaHgQeHkKrRZ3mo','AM7pNqlqSaQYx46nWy0Mt','maybe');
INSERT INTO "votes" VALUES('SEL3R_lVIGFGPbIwz4ij-','WKUtXvGZotK-zqOt66YTy','QqKFYYQH13WgaUGnwx6RM','interested');
INSERT INTO "votes" VALUES('sL9AjNq3n0_NXf-Ddqhc9','Utehr95J4Qk-S2McFjCqF','QqKFYYQH13WgaUGnwx6RM','maybe');
INSERT INTO "votes" VALUES('vaM6a6nM39YWP8N0tw9AW','NOUZvGKjyl2nwplXkjGs-','QqKFYYQH13WgaUGnwx6RM','interested');
INSERT INTO "votes" VALUES('VTlEJKWRpsgueNxZAIuYK','0dMxulzqpSASS9vIOF231','QqKFYYQH13WgaUGnwx6RM','maybe');
INSERT INTO "votes" VALUES('WfsggQhnMeToI4JaVikdl','Vzk2ziZAjOGyruWBzKUDA','QqKFYYQH13WgaUGnwx6RM','interested');
INSERT INTO "votes" VALUES('EUY3aPZZ5XyUvo8qU2LWv','WKUtXvGZotK-zqOt66YTy','mcSRg7CNr0awvcBLHidGl','skip');
INSERT INTO "votes" VALUES('FnSe07F3In9wDWnJnO0L_','pScbY1rRMiZpTlsUVTFjS','mcSRg7CNr0awvcBLHidGl','maybe');
INSERT INTO "votes" VALUES('Kh4izApJlPxFP-9PuIreF','jCiH82MZ76eSptuEHJgS8','mcSRg7CNr0awvcBLHidGl','skip');
INSERT INTO "votes" VALUES('-BAnbF5CpBhgVyoJvN-CF','2w3JMNDuirUnG8T9aidxd','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('tcAXmmIxwB1V55TSyCFDZ','7bDhDdgLIzJEf_FBE27tw','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('KOCgEtgbdfc-QYXeG6QME','PR0dXn3fqw7LOFB0KMbL0','mcSRg7CNr0awvcBLHidGl','interested');
INSERT INTO "votes" VALUES('npLlHPtwb7EFb032PB0Lh','ROqAJAsH3EH4CbTLbovsU','mcSRg7CNr0awvcBLHidGl','skip');
INSERT INTO "votes" VALUES('wplJue10zKjTulNuIHMwY','0dMxulzqpSASS9vIOF231','mcSRg7CNr0awvcBLHidGl','maybe');
INSERT INTO "votes" VALUES('0fLvu6C6XJ8AFaYz4TBIu','Vzk2ziZAjOGyruWBzKUDA','mcSRg7CNr0awvcBLHidGl','skip');
INSERT INTO "votes" VALUES('ig-s5Qf1CsaNQmB1JBGo2','jCiH82MZ76eSptuEHJgS8','I7Bk9yb3CsbBHx5P14Fwh','skip');
INSERT INTO "votes" VALUES('LA4y3BuavCwRBEdMD1o_0','2w3JMNDuirUnG8T9aidxd','I7Bk9yb3CsbBHx5P14Fwh','maybe');
INSERT INTO "votes" VALUES('OHl_mjssFoDHmPgSYXy4j','7bDhDdgLIzJEf_FBE27tw','I7Bk9yb3CsbBHx5P14Fwh','maybe');
INSERT INTO "votes" VALUES('MLryl8LId0FPyU8dZCO_N','ROqAJAsH3EH4CbTLbovsU','I7Bk9yb3CsbBHx5P14Fwh','interested');
INSERT INTO "votes" VALUES('ZK5waMbskDaQe1uHVQKIk','Utehr95J4Qk-S2McFjCqF','Rd3-vWy2R5hzaIlmvYwuG','skip');
INSERT INTO "votes" VALUES('eEAJxxJtKIHWU3BkPB05C','jCiH82MZ76eSptuEHJgS8','Rd3-vWy2R5hzaIlmvYwuG','skip');
INSERT INTO "votes" VALUES('xNqvcFCigUVTmrlk6kZBA','7bDhDdgLIzJEf_FBE27tw','Rd3-vWy2R5hzaIlmvYwuG','interested');
INSERT INTO "votes" VALUES('6-CjCbwtQwXsYKBk45sf8','PR0dXn3fqw7LOFB0KMbL0','Rd3-vWy2R5hzaIlmvYwuG','maybe');
INSERT INTO "votes" VALUES('OWv5JCaQJ2snqyuN-Vc22','NOUZvGKjyl2nwplXkjGs-','aCtbVVlLZE5gkXxLwjc-x','maybe');
INSERT INTO "votes" VALUES('AlpaxqqQf3ODlRB0914JB','GDc6jZFqjui3PCk1pZ8T2','aCtbVVlLZE5gkXxLwjc-x','maybe');
INSERT INTO "votes" VALUES('pndHRG63Yiv1eWsNcra_R','BS1y-TkpVjnhKcXF5kmEz','aCtbVVlLZE5gkXxLwjc-x','interested');
INSERT INTO "votes" VALUES('T9kYPGLTf65q68ksXlibh','0dMxulzqpSASS9vIOF231','aCtbVVlLZE5gkXxLwjc-x','maybe');
INSERT INTO "votes" VALUES('giZFsE8IZxkR29zWhSTqm','Vzk2ziZAjOGyruWBzKUDA','aCtbVVlLZE5gkXxLwjc-x','maybe');
INSERT INTO "votes" VALUES('sDCdQclIJs01XM4JbfU-n','pScbY1rRMiZpTlsUVTFjS','CBgApJv8_Ctu4PA9NnLxG','skip');
INSERT INTO "votes" VALUES('HFUCTyugDV9jBH0Dp3JOl','VviafD0o5ZON3SsHobhrX','CBgApJv8_Ctu4PA9NnLxG','maybe');
INSERT INTO "votes" VALUES('UXdjeb0Cl4nVLiYWMRCT8','GDc6jZFqjui3PCk1pZ8T2','CBgApJv8_Ctu4PA9NnLxG','maybe');
INSERT INTO "votes" VALUES('wjt4aIRPBMC5a8JeZPD--','ROqAJAsH3EH4CbTLbovsU','CBgApJv8_Ctu4PA9NnLxG','skip');
INSERT INTO "votes" VALUES('PJfUHnlG7eCtGpXv-U7wM','BS1y-TkpVjnhKcXF5kmEz','CBgApJv8_Ctu4PA9NnLxG','maybe');
INSERT INTO "votes" VALUES('sxEBZItd2bElhMtiReuYa','WKUtXvGZotK-zqOt66YTy','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('W9D6-BPVgtQR7Ex7npRuc','2w3JMNDuirUnG8T9aidxd','7YzzIo3aVdbX0hluuq5k5','maybe');
INSERT INTO "votes" VALUES('1eM5Q4VZSxZzPfSOaS3se','7bDhDdgLIzJEf_FBE27tw','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('26rSGw-DkNlgqEGM4EtD_','PR0dXn3fqw7LOFB0KMbL0','7YzzIo3aVdbX0hluuq5k5','maybe');
INSERT INTO "votes" VALUES('N09HUNJH8708oo2Q-RoX8','NOUZvGKjyl2nwplXkjGs-','7YzzIo3aVdbX0hluuq5k5','maybe');
INSERT INTO "votes" VALUES('SwWNZ7pYHiMpgy1eBcIzJ','ROqAJAsH3EH4CbTLbovsU','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('6WNeok8VnP450KeNalvF5','xQq72LaaHgQeHkKrRZ3mo','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('88jAMRuXHHbSqhT5PB_tk','0dMxulzqpSASS9vIOF231','7YzzIo3aVdbX0hluuq5k5','interested');
INSERT INTO "votes" VALUES('mrC4mqFnD_Z60IH7ZTxPD','pScbY1rRMiZpTlsUVTFjS','TKr75Ctm2EiALroFku-3i','skip');
INSERT INTO "votes" VALUES('sRLNLYLc7nX-njxbaIeom','Utehr95J4Qk-S2McFjCqF','TKr75Ctm2EiALroFku-3i','interested');
INSERT INTO "votes" VALUES('TYsRrcBABnhzMS5kSixfC','2w3JMNDuirUnG8T9aidxd','TKr75Ctm2EiALroFku-3i','skip');
INSERT INTO "votes" VALUES('dHM-3T4SloaHe3dW4v99y','BS1y-TkpVjnhKcXF5kmEz','TKr75Ctm2EiALroFku-3i','interested');
INSERT INTO "votes" VALUES('sPyGoowOloUwfh8wM1urb','Vzk2ziZAjOGyruWBzKUDA','TKr75Ctm2EiALroFku-3i','maybe');
INSERT INTO "votes" VALUES('jeSr9CZgJ6E-NRNPHwq1G','2w3JMNDuirUnG8T9aidxd','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('LxraZjTI_Mtv7EJ1U50u-','PR0dXn3fqw7LOFB0KMbL0','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('167e12_3wGywPARqv-hTW','GDc6jZFqjui3PCk1pZ8T2','wYKwW6WMzYBPRlbP5aFEt','interested');
INSERT INTO "votes" VALUES('17X8sAhuM5StUeefgULcu','BS1y-TkpVjnhKcXF5kmEz','wYKwW6WMzYBPRlbP5aFEt','skip');
INSERT INTO "votes" VALUES('RDQsiM1ZvsQ3A6dCVl3BP','xQq72LaaHgQeHkKrRZ3mo','wYKwW6WMzYBPRlbP5aFEt','maybe');
INSERT INTO "votes" VALUES('99fZMS0rWzS5DWdScXZPT','0dMxulzqpSASS9vIOF231','wYKwW6WMzYBPRlbP5aFEt','maybe');
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
INSERT INTO "events" VALUES('GiRr8R6aKvq3Y9DQSakf-','Conference Alpha','Conference-Alpha','Event currently in proposal phase','https://test-event-1.example.com','2026-10-11T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-08-23T09:25:14.378Z','2026-09-06T09:25:14.378Z','2026-09-06T09:25:14.378Z','2026-09-20T09:25:14.378Z','2026-09-20T09:25:14.378Z','2026-10-13T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0);
INSERT INTO "events" VALUES('s_jeM1nDmGhaeMgt1M5Fe','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','https://test-event-2.example.com','2026-09-27T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-08-09T09:25:14.378Z','2026-08-23T09:25:14.378Z','2026-08-23T09:25:14.378Z','2026-09-06T09:25:14.378Z','2026-09-06T09:25:14.378Z','2026-09-29T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0);
INSERT INTO "events" VALUES('uS-a-MU3RTfols50fhk8E','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','https://test-event-3.example.com','2026-09-13T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-07-26T09:25:14.378Z','2026-08-09T09:25:14.378Z','2026-08-09T09:25:14.378Z','2026-08-23T09:25:14.378Z','2026-08-23T09:25:14.378Z','2026-09-15T16:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0);
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
INSERT INTO "sessions" VALUES('3FI7Wq-86LD8G0yZhi2Y7','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-11T07:00:00.000Z','2026-10-11T08:30:00.000Z',100,1,0,0,NULL,'GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "sessions" VALUES('UH9Gc8wTCAWw9yBNhPnOl','Lunch Break','','2026-10-11T10:30:00.000Z','2026-10-11T12:00:00.000Z',0,1,1,0,NULL,'GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "sessions" VALUES('S2gnIijQmk9XV_ovLLsJX','Lunch Break','','2026-10-12T10:30:00.000Z','2026-10-12T12:00:00.000Z',0,1,1,0,NULL,'GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "sessions" VALUES('EqP4fIwLQDqtf02w3QSGH','Lunch Break','','2026-10-13T10:30:00.000Z','2026-10-13T12:00:00.000Z',0,1,1,0,NULL,'GiRr8R6aKvq3Y9DQSakf-');
INSERT INTO "sessions" VALUES('2YC4lmGJL83YrSzcyg74Q','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-09-27T07:00:00.000Z','2026-09-27T08:30:00.000Z',100,1,0,0,NULL,'s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "sessions" VALUES('ulTTWLKM4wOcSe_iKIEND','Lunch Break','','2026-09-27T10:30:00.000Z','2026-09-27T12:00:00.000Z',0,1,1,0,NULL,'s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "sessions" VALUES('hKvEydo_ECB6jHHbwBOxv','Lunch Break','','2026-09-28T10:30:00.000Z','2026-09-28T12:00:00.000Z',0,1,1,0,NULL,'s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "sessions" VALUES('efalkqA2cGmetLJjdEP4N','Lunch Break','','2026-09-29T10:30:00.000Z','2026-09-29T12:00:00.000Z',0,1,1,0,NULL,'s_jeM1nDmGhaeMgt1M5Fe');
INSERT INTO "sessions" VALUES('7RdXA5nDniAVOFGwB7e7c','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-13T07:00:00.000Z','2026-09-13T08:30:00.000Z',100,1,0,0,NULL,'uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('k3jNx8macuqImegN-A31-','Lunch Break','','2026-09-13T10:30:00.000Z','2026-09-13T12:00:00.000Z',0,1,1,0,NULL,'uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('w2kg_wuQMVM-cMXnYk7Tz','Lunch Break','','2026-09-14T10:30:00.000Z','2026-09-14T12:00:00.000Z',0,1,1,0,NULL,'uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('favvBazMnC0TiUV4M_qee','Lunch Break','','2026-09-15T10:30:00.000Z','2026-09-15T12:00:00.000Z',0,1,1,0,NULL,'uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('t6qccXmWujJ8TrN9wwC3L','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-13T09:00:00.000Z','2026-09-13T10:00:00.000Z',100,0,0,0,'pScbY1rRMiZpTlsUVTFjS','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('MdVLWWmz5T3w4KncWd147','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-13T09:00:00.000Z','2026-09-13T10:30:00.000Z',30,0,0,1,'Utehr95J4Qk-S2McFjCqF','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('dDvjtp8Qk2qTtFUImDWqI','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-13T12:00:00.000Z','2026-09-13T13:00:00.000Z',100,0,0,0,'jCiH82MZ76eSptuEHJgS8','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('rCvHPK6j4M79CCatcMIPK','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-13T12:00:00.000Z','2026-09-13T13:30:00.000Z',25,0,0,0,'xQq72LaaHgQeHkKrRZ3mo','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('lGXW6K7i-sW858JWoUMHH','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-13T13:30:00.000Z','2026-09-13T14:30:00.000Z',30,0,0,0,'VviafD0o5ZON3SsHobhrX','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('OrsZT5hxUv0vZ7iUeBmOm','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-14T07:00:00.000Z','2026-09-14T08:00:00.000Z',100,0,0,0,'WKUtXvGZotK-zqOt66YTy','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('2vf7vhw9s0jBTS0thqn-y','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-14T08:00:00.000Z','2026-09-14T09:30:00.000Z',25,0,0,0,'GDc6jZFqjui3PCk1pZ8T2','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('r3OJYVyAAEoGLoUNEgEU8','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-14T08:30:00.000Z','2026-09-14T10:00:00.000Z',30,0,0,0,'BS1y-TkpVjnhKcXF5kmEz','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('8ZRvZdCsGN_SNkatwcrRo','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',100,0,0,0,'Vzk2ziZAjOGyruWBzKUDA','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('HnooKCtAt4K0uYrYGe3-8','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',25,0,0,0,'PR0dXn3fqw7LOFB0KMbL0','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('LFzSnDAJu6pZuK6zA2JEj','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-14T14:00:00.000Z','2026-09-14T15:00:00.000Z',100,0,0,0,'NOUZvGKjyl2nwplXkjGs-','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('kapuuo93C5RLzWTS17UlV','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-14T14:00:00.000Z','2026-09-14T14:30:00.000Z',15,0,0,0,NULL,'uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('lj0pehZ3hYXORfabxeZKC','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-15T07:00:00.000Z','2026-09-15T08:00:00.000Z',100,0,0,0,'7bDhDdgLIzJEf_FBE27tw','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('JGvJ5MIBVoZqRRvW6ioiT','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-15T08:00:00.000Z','2026-09-15T09:00:00.000Z',30,0,0,0,'ROqAJAsH3EH4CbTLbovsU','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('3xfeGoEJJKqkqK1h9JTpv','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-15T08:30:00.000Z','2026-09-15T09:30:00.000Z',25,0,0,0,'0dMxulzqpSASS9vIOF231','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('KP2wc-LGmdsLzWIeqYXk7','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-15T12:00:00.000Z','2026-09-15T13:00:00.000Z',100,0,0,0,'2w3JMNDuirUnG8T9aidxd','uS-a-MU3RTfols50fhk8E');
INSERT INTO "sessions" VALUES('Ph9Mbf2XTgVgHFxqECk9x','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-15T14:00:00.000Z','2026-09-15T15:00:00.000Z',100,1,0,0,NULL,'uS-a-MU3RTfols50fhk8E');
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
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
COMMIT;
