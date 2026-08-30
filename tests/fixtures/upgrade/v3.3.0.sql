-- Seeded database of schellingboard v3.3.0, dumped by
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
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text, `email_on_rsvp_change` integer DEFAULT true NOT NULL, `email_on_host_change` integer DEFAULT true NOT NULL, `email_on_cohost_add` integer DEFAULT true NOT NULL, `based_in` text, `prompts` text, `languages` text, `contacts` text, `auth_protected` integer DEFAULT false NOT NULL, `password_hash` text, `email_on_proposal_comment` integer DEFAULT true NOT NULL, `email_on_comment_thread` integer DEFAULT false NOT NULL);
INSERT INTO "guests" VALUES('5HzaeQPX_Q5AS9Ry7-g0P','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/5HzaeQPX_Q5AS9Ry7-g0P.webp?v=1788081922513','She/Her',1,1,1,'Osaka, Japan','[{"prompt":"Ask me about","answer":"Accessible design patterns and Japanese web typography"},{"prompt":"Offering","answer":"Code review swaps and coffee-machine debugging sessions"}]','["Japanese","English"]','[{"type":"website","value":"https://alice-test.example.com"},{"type":"telegram","value":"@alice_frontend"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('5cKMVI_IB7JVQbrFSlRXS','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/5cKMVI_IB7JVQbrFSlRXS.webp?v=1788081922513','He/Him',1,1,1,'Lagos, Nigeria','[{"prompt":"Looking for","answer":"Speakers for an inclusive product design meetup back home"},{"prompt":"Offering","answer":"Feedback on your product roadmap over coffee"}]','["English","Yoruba"]','[{"type":"email","value":"bob.organizes@example.com"},{"type":"whatsapp","value":"+234 801 234 5678"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('wdKiGvZYAwLisZE1i26oD','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/wdKiGvZYAwLisZE1i26oD.webp?v=1788081922513','They/Them',1,1,1,'Guadalajara, Mexico','[{"prompt":"Ask me about","answer":"Stream processing pipelines, or my sourdough starter"},{"prompt":"My weirdest skill","answer":"Naming Kafka topics that still make sense a year later"}]','["Spanish","English"]','[{"type":"discord","value":"charlie.streams"},{"type":"website","value":"https://charlie.dev"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('HsO7ub1xzup1hjMSfDh6N','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him',1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('HGSmRiy3lXrgW5OIe3psV','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('3eDfavLHK-w8UFQStbNe9','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her',1,1,1,NULL,NULL,NULL,NULL,1,'scrypt$OL5STU2DaDfgYYG6I6O6lw==$ox31+Utam2H/0/l0euCBHAQyQ/ZAjuRUM47xDiBqDyA=',1,0);
INSERT INTO "guests" VALUES('56i1PPNObDW-PmygSTEc8','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/56i1PPNObDW-PmygSTEc8.webp?v=1788081922514',NULL,1,1,1,'Shanghai, China','[{"prompt":"Ask me about","answer":"Build caching strategies that hold up under real CI load"}]','["Mandarin Chinese","English"]','[{"type":"telegram","value":"@weichen_dev"}]',1,'scrypt$pRL+sJRvYALxtZXrIka8UQ==$VFpIPJHNp63CtTSM7OjMpnS6dQX9Ag7mhodCNs4h300=',1,0);
INSERT INTO "guests" VALUES('ZKfmZvoeuQu0Vl20KYByx','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/ZKfmZvoeuQu0Vl20KYByx.webp?v=1788081922514','She/Her',1,1,1,'Bengaluru, India','[{"prompt":"Ask me about","answer":"Fairness metrics for recommender systems"},{"prompt":"Looking for","answer":"A conference buddy — this is my first time here!"}]','["Hindi","Kannada","English"]','[{"type":"website","value":"https://priyasharma.example.com"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('bpf8-yo3LlYc1Vp9iNFl0','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/bpf8-yo3LlYc1Vp9iNFl0.webp?v=1788081922514','He/Him',1,1,1,'Gothenburg, Sweden','[{"prompt":"Offering","answer":"Strong opinions about Rust, mild opinions about saunas"}]','["Swedish","English"]','[{"type":"signal","value":"lars.eriksson.99"}]',1,'scrypt$D6mVPWkjEzk7dN89vu7drg==$gYtwmD8tp0Ok8uK+Ey38t2xSbHWnhXw3LAS5LbCJaV0=',1,0);
INSERT INTO "guests" VALUES('cjc_whiGjsvXFd3c69Kad','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/cjc_whiGjsvXFd3c69Kad.webp?v=1788081922515',NULL,1,1,1,'Muscat, Oman','[{"prompt":"Ask me about","answer":"Threat modeling for teams too small to have a security hire"}]','["Arabic","English"]','[{"type":"email","value":"fatima.breaks.things@example.com"}]',1,'scrypt$8emZEse2CLY1Jys5a0OO4A==$2ZJ+f5LqAbrAl36XOa7l47PRz1+jmuLXbtwaINUhc0g=',1,0);
INSERT INTO "guests" VALUES('flnjCaAzGgABGdbXUmS_A','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/flnjCaAzGgABGdbXUmS_A.webp?v=1788081922515','He/Him',1,1,1,'Accra, Ghana','[{"prompt":"Offering","answer":"War stories about building for 2G networks"}]','["Twi","English"]','[{"type":"whatsapp","value":"+233 24 555 0187"}]',1,'scrypt$vexM+QdeX4rCrQvZRHEmrQ==$ZvQ1s+W+16tewCV+kQ4c6AhRMWTbrp2E1yDSt6cMzQo=',1,0);
INSERT INTO "guests" VALUES('H4tNC6vRh_sZJql8AseGM','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/H4tNC6vRh_sZJql8AseGM.webp?v=1788081922516',NULL,1,1,1,'Yokohama, Japan','[{"prompt":"My weirdest skill","answer":"Debugging a blinking LED by ear"}]','["Japanese"]',NULL,1,'scrypt$Fkjwax3igLu1MBaMZbjd0g==$J4TPHSUbQAlyn/XtmRRKdhtQ14E34RVU6roft6O3lqw=',1,0);
INSERT INTO "guests" VALUES('CssVX1HK8f7TH1kMpgsKD','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/CssVX1HK8f7TH1kMpgsKD.webp?v=1788081922516','She/Her',1,1,1,'Berlin, Germany','[{"prompt":"Ask me about","answer":"Research ethics for multilingual user studies"}]','["French","Wolof","English","German"]','[{"type":"website","value":"https://aishadiallo.example.com"},{"type":"other","label":"Mastodon","value":"@aisha@ux.social"}]',1,'scrypt$FPaIURzK+j/8YgIvdLWPcg==$bRye0L4kwi+aieb33hKY5VpfELcN8M4TFahS2b/MUaM=',1,0);
INSERT INTO "guests" VALUES('DbLvx5jtFkYtoIyDVavJL','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/DbLvx5jtFkYtoIyDVavJL.webp?v=1788081922516',NULL,1,1,1,'Buenos Aires, Argentina','[{"prompt":"Offering","answer":"A rundown of the worst incident I ever caused, for entertainment purposes"}]','["Spanish","English"]','[{"type":"telegram","value":"@diego_sre"}]',1,'scrypt$Bp+72VCjcwwSwLyEw6OUVA==$k5/ASHHnQjQqpO4mJytSTlCDZgcxReW8zYI1DHVr4h4=',1,0);
INSERT INTO "guests" VALUES('OLUkXAx3x9c9ZgT28xgoP','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/OLUkXAx3x9c9ZgT28xgoP.webp?v=1788081922516','She/Her',1,1,1,'Taipei, Taiwan','[{"prompt":"Ask me about","answer":"Turning a wall of Slack threads into docs people read"}]','["Mandarin Chinese","English"]',NULL,1,'scrypt$ug0XL662pM2yyx23PyvoNQ==$MWYAl6k6yQgLHjfCVML2nPbTx+q063ceWlJe4vqyk18=',1,0);
INSERT INTO "guests" VALUES('xHzguFgK5CrqWXPDcvEgd','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/xHzguFgK5CrqWXPDcvEgd.webp?v=1788081922517',NULL,1,1,1,'Novosibirsk, Russia','[{"prompt":"Offering","answer":"A very detailed opinion about your slow query, whether you want it or not"}]','["Russian","English"]','[{"type":"email","value":"olga.petrova.db@example.com"}]',1,'scrypt$QtsbJGySFZJhrUA5LZQdxQ==$eC5e/49tp45LKxamV6JCOmT/ZBjv4uJ1/Qg5pXazNpc=',1,0);
INSERT INTO "guests" VALUES('V4S6hF2dncw5O3rC2tm3m','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/V4S6hF2dncw5O3rC2tm3m.webp?v=1788081922517','He/Him',1,1,1,'Lyon, France','[{"prompt":"Looking for","answer":"Cheese recommendations near the venue"}]','["French","English"]','[{"type":"whatsapp","value":"+33 6 12 34 56 78"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('pkfGVZdfjsw1bzmeR9xrG','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/pkfGVZdfjsw1bzmeR9xrG.webp?v=1788081922518',NULL,1,1,1,'Johannesburg, South Africa','[{"prompt":"Ask me about","answer":"Building civic tech that survives contact with real government data"}]','["Zulu","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('hcgyLMhEySkieazQGLx2Z','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/hcgyLMhEySkieazQGLx2Z.webp?v=1788081922518','She/Her',1,1,1,'Kraków, Poland','[{"prompt":"Offering","answer":"Trades: I''ll find your worst bug for a board game recommendation"}]','["Polish","English"]','[{"type":"discord","value":"anna.qa"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('r3Rmp1dBG-jP4OoJvkAjs','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/r3Rmp1dBG-jP4OoJvkAjs.webp?v=1788081922518',NULL,1,1,1,'Cairo, Egypt','[{"prompt":"A hill I will die on","answer":"Boring architecture beats clever architecture, every time"}]','["Arabic","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('674LkKoaNetzVfAAXzKAy','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/674LkKoaNetzVfAAXzKAy.webp?v=1788081922518','She/Her',1,1,1,'Milan, Italy','[{"prompt":"Ask me about","answer":"Getting design tokens to survive contact with production"}]','["English","French"]','[{"type":"website","value":"https://isabellarossi.example.com"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('FDey5RKF35qiOeLUbSdjS','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/FDey5RKF35qiOeLUbSdjS.webp?v=1788081922519','They/Them',1,1,1,'Seoul, South Korea','[{"prompt":"Currently obsessed with","answer":"CRDTs, and why conflict-free replication is harder than it sounds"}]','["Korean","English"]','[{"type":"discord","value":"minjunkim"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('SLeEQjx9QHnHky2x2L5Ke','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/SLeEQjx9QHnHky2x2L5Ke.webp?v=1788081922519',NULL,1,1,1,'Porto, Portugal','[{"prompt":"Offering","answer":"A talk about automating yourself out of a job, repeatedly"}]','["Portuguese","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('-65kFmoP6lfo-KlVeZeEO','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her',1,1,1,'Beirut, Lebanon','[{"prompt":"Looking for","answer":"Mentors and mentees for a women-in-tech circle back home"}]','["Arabic","French","English"]','[{"type":"other","label":"Instagram","value":"@nadia.builds"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('oDkSLPMVj0inCmYQgdiCm','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL,1,1,1,'Copenhagen, Denmark','[{"prompt":"Offering","answer":"A free accessibility pass on your slides — bring your laptop"}]','["Danish","English"]','[{"type":"email","value":"freya.a11y@example.com"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('31Q8fVuFLR2l7YJLOvCuh','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him',1,1,1,'Kochi, India','[{"prompt":"Currently obsessed with","answer":"Consensus protocols, and where filter coffee ranks among them"}]','["Malayalam","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('xuKuS8oJmLcOIYVEzn6xY','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL,1,1,1,'Istanbul, Turkey','[{"prompt":"Looking for","answer":"Session recommendations — I''m new here and excited about everything"}]','["Turkish","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('U0ekKLQccH73YGKwlY3Z9','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL,1,1,1,'Ibadan, Nigeria',NULL,'["Yoruba","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('-tcf2SnCejINfQv6PwadN','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them',1,1,1,'Ho Chi Minh City, Vietnam','[{"prompt":"Offering","answer":"Static site generator recommendations, unsolicited and opinionated"}]','["Vietnamese","English"]','[{"type":"telegram","value":"@linh_jamstack"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('Esx6Buu8Om0CsYBLdMcs8','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL,1,1,1,'Zagreb, Croatia','[{"prompt":"A hill I will die on","answer":"Estimates are a communication tool, not a promise"}]','["Croatian","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('V5m-Y-E_xLRukf07jfSYs','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL,1,1,1,NULL,'[{"prompt":"My weirdest skill","answer":"Reading language specs for fun, apparently"}]',NULL,NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('DmIi0t0oVlnKcRPwLyE86','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her',1,1,1,'Bologna, Italy','[{"prompt":"Ask me about","answer":"Making public health research reproducible without a data team"}]',NULL,'[{"type":"website","value":"https://chiarabianchi.example.com"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('k-Yv0skkPvBEXp12fkWrP','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL,1,1,1,'Durban, South Africa','[{"prompt":"Offering","answer":"Container query wizardry, upon request"}]','["Zulu","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('wARkFhrSpExOGjLORuuuc','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL,1,1,1,'São Paulo, Brazil','[{"prompt":"Offering","answer":"Mentoring conversations for junior devs finding their footing"}]','["Portuguese","English"]','[{"type":"website","value":"https://rafaelsouza.example.com"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('AOStw-UrlZUwRBR3NE9Xe','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.','/media/avatars/AOStw-UrlZUwRBR3NE9Xe.webp?v=1788081922519','She/Her',1,1,1,'Kyoto, Japan','[{"prompt":"I collect","answer":"Conference stickers, competitively"}]','["Japanese","English"]','[{"type":"website","value":"https://hanakobayashi.example.com"},{"type":"other","label":"Bluesky","value":"@hanak.dev"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('4RJcYaJoa4zaJcVVGF6GK','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL,1,1,1,'Prague, Czechia','[{"prompt":"Ask me about","answer":"Sustainable maintainership for projects that outlive their funding"}]','["Czech","English"]','[{"type":"website","value":"https://github.example.com/tereza"}]',0,NULL,1,0);
INSERT INTO "guests" VALUES('l8nd_mSHbfeLStgkxyCI0','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him',1,1,1,'Amsterdam, Netherlands','[{"prompt":"Currently obsessed with","answer":"Developer tooling, and slowly learning Dutch"}]','["Persian","Dutch","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('mzu3YLHMKgclzb1XFIT07','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL,1,1,1,'Thessaloniki, Greece','[{"prompt":"Offering","answer":"Loosely held opinions on everything except testing"}]','["Greek","English"]',NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('xx_5Kpc1K-V3HMp05lrOa','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0);
INSERT INTO "guests" VALUES('wMhAFVhmAIfmIfYP_W5bK','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They',1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0);
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
INSERT INTO "days" VALUES('vnBd07s2V0U4llnfHnNcI','2026-10-11T07:00:00.000Z','2026-10-11T16:00:00.000Z','2026-10-11T07:00:00.000Z','2026-10-11T15:30:00.000Z','oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "days" VALUES('5wqfvBpfIswcZ3rdfAtZi','2026-10-12T07:00:00.000Z','2026-10-12T16:00:00.000Z','2026-10-12T07:00:00.000Z','2026-10-12T15:30:00.000Z','oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "days" VALUES('a1TgmpJ1tseUQkWuqv2I1','2026-10-13T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-10-13T07:00:00.000Z','2026-10-13T15:30:00.000Z','oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "days" VALUES('6_dzna9vec0rQnbMcpPMS','2026-09-27T07:00:00.000Z','2026-09-27T16:00:00.000Z','2026-09-27T07:00:00.000Z','2026-09-27T15:30:00.000Z','pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "days" VALUES('TA9AVGHwTkZXBNcN29xjZ','2026-09-28T07:00:00.000Z','2026-09-28T16:00:00.000Z','2026-09-28T07:00:00.000Z','2026-09-28T15:30:00.000Z','pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "days" VALUES('-i5irpoBB1jkPZ2NxrkA5','2026-09-29T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-09-29T07:00:00.000Z','2026-09-29T15:30:00.000Z','pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "days" VALUES('FdN3L0vjxGD8uQrEEZJgv','2026-09-13T07:00:00.000Z','2026-09-13T16:00:00.000Z','2026-09-13T07:00:00.000Z','2026-09-13T15:30:00.000Z','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "days" VALUES('HhpnqGprgAHY4-8ZZ7T5w','2026-09-14T07:00:00.000Z','2026-09-14T16:00:00.000Z','2026-09-14T07:00:00.000Z','2026-09-14T15:30:00.000Z','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "days" VALUES('sQ_Qsnf0lMycYky_uBT0L','2026-09-15T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-09-15T07:00:00.000Z','2026-09-15T15:30:00.000Z','MV-dn31tR6gIMAVDMAi4r');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','56i1PPNObDW-PmygSTEc8');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','674LkKoaNetzVfAAXzKAy');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','-tcf2SnCejINfQv6PwadN');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','wARkFhrSpExOGjLORuuuc');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "event_guests" VALUES('oP-K6FWFdyJMZAAWMI_Gp','wMhAFVhmAIfmIfYP_W5bK');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','56i1PPNObDW-PmygSTEc8');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','674LkKoaNetzVfAAXzKAy');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','-tcf2SnCejINfQv6PwadN');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','wARkFhrSpExOGjLORuuuc');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "event_guests" VALUES('pgOlrtfknEmKZ-Lwveoxj','wMhAFVhmAIfmIfYP_W5bK');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','56i1PPNObDW-PmygSTEc8');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','674LkKoaNetzVfAAXzKAy');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','-tcf2SnCejINfQv6PwadN');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','wARkFhrSpExOGjLORuuuc');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "event_guests" VALUES('MV-dn31tR6gIMAVDMAi4r','wMhAFVhmAIfmIfYP_W5bK');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-main-hall');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-room-a');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-room-b');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-library');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-boardroom');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-auditorium');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-courtyard');
INSERT INTO "event_locations" VALUES('oP-K6FWFdyJMZAAWMI_Gp','loc-rooftop');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-main-hall');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-room-a');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-room-b');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-library');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-boardroom');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-auditorium');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-courtyard');
INSERT INTO "event_locations" VALUES('pgOlrtfknEmKZ-Lwveoxj','loc-rooftop');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-main-hall');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-room-a');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-room-b');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-library');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-boardroom');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-auditorium');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-courtyard');
INSERT INTO "event_locations" VALUES('MV-dn31tR6gIMAVDMAi4r','loc-rooftop');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('vUAV08OHmo6JrQIQESIao','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "proposal_hosts" VALUES('MC7C3XnMRm4nfTvY_nDFO','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('IaiTThu8gOHJrhv3lENfh','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "proposal_hosts" VALUES('yq5YcT16Erj50AsO9azWf','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "proposal_hosts" VALUES('yq5YcT16Erj50AsO9azWf','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "proposal_hosts" VALUES('mMNwr6VrstHgbaHgVkwF8','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "proposal_hosts" VALUES('mMNwr6VrstHgbaHgVkwF8','56i1PPNObDW-PmygSTEc8');
INSERT INTO "proposal_hosts" VALUES('IF25wOHfkaZxP3zfBGtCR','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "proposal_hosts" VALUES('MF-JjGzAsiq2PFHe0FGMj','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "proposal_hosts" VALUES('nBi7EuYDKPLrVoGdTF7qq','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "proposal_hosts" VALUES('Jku1y_3IKZHKOQoVQkGMW','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('Vpg6ZhaYPDKmhWxXPYLAc','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "proposal_hosts" VALUES('pcBQpLYqi6lwyq4k3cRlf','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('cKVRSiTySX3u7sW__zB8F','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "proposal_hosts" VALUES('cKVRSiTySX3u7sW__zB8F','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "proposal_hosts" VALUES('ahpI-IgUdYsiDbGpk3eBM','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "proposal_hosts" VALUES('9CKo3jDMBsEUnomDnIznK','56i1PPNObDW-PmygSTEc8');
INSERT INTO "proposal_hosts" VALUES('41wZdVcy5sb7bI7azXBfc','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "proposal_hosts" VALUES('SrSbVgHgvm1iIL__onaYs','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "proposal_hosts" VALUES('SrSbVgHgvm1iIL__onaYs','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "proposal_hosts" VALUES('e92aQ6pdpJY2IX4jh60jT','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "proposal_hosts" VALUES('1wi_cTdFtoEgXb9yN7IVj','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "proposal_hosts" VALUES('ZHZ159Vjoz5xmZl6ospDh','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('pTQP-qQKlCKg6zd1oBDCe','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "proposal_hosts" VALUES('qrcVhkFNNPiTOPXHeJEhS','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('2FoTJ7zXeOeCBpd4wAQ_M','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "proposal_hosts" VALUES('O9-RUVlL7PanRRu52km7V','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "proposal_hosts" VALUES('3iEcnbIuv8X3nuEw6m2WO','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "proposal_hosts" VALUES('oeyrbWuhRm67d1ROMHr-s','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "proposal_hosts" VALUES('pnfYCUiaFmlcXoSyh5Gz7','674LkKoaNetzVfAAXzKAy');
INSERT INTO "proposal_hosts" VALUES('H11sL2hdWU-rWrcOeqpXu','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "proposal_hosts" VALUES('ShYyAkqjhtH0YaWi4pUK-','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "proposal_hosts" VALUES('l4nP8oBfyc7riyJj7-3Bp','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "proposal_hosts" VALUES('nX7dFDh2YFh-aZFKWpL7n','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "proposal_hosts" VALUES('xSWsbk5rnqCy8uUGTFiJl','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "proposal_hosts" VALUES('v_gQTXZmIeX8dKnbYFKMG','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "proposal_hosts" VALUES('LxAb99FugSw6xy6AcH107','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "proposal_hosts" VALUES('QVSYDsPsHDhVMkRKnsdAu','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "proposal_hosts" VALUES('QVSYDsPsHDhVMkRKnsdAu','wARkFhrSpExOGjLORuuuc');
INSERT INTO "proposal_hosts" VALUES('XuJxE6oPDJrYMViQOCD7h','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "proposal_hosts" VALUES('cHFyyROyBpF-0ZF3wnduD','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "proposal_hosts" VALUES('R4LAGueDEWg_tN0aCGhd4','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "proposal_hosts" VALUES('aEv80tPELm6Lkrm40Eo4n','cjc_whiGjsvXFd3c69Kad');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('H_V-QRK4j9JgMBtE1XhJ_','kT55LufJUSYKUiwiwpyr7','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "rsvps" VALUES('k66ASudIqFRTeCN6j76FJ','rvc6aWcmg9jykIN0aF02E','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "rsvps" VALUES('GjAHnFU3hQIrVZbfulXd7','g5g4HbEc_6r6wXYkUscoN','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "rsvps" VALUES('xOdlYDGI7uHcS8sYUYfow','UjOjt4yjik8FephfA0RSF','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "rsvps" VALUES('Wrtz13IJBxJMIEi573p8h','8ICsa9g-jApo8644H_5CP','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "rsvps" VALUES('cA8sY89OC5M3hTtuC9eR5','8nptJI9fTOB7tBx-GQSMp','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "rsvps" VALUES('DWtZ1b3ovj6uCbEmBWgCN','rcNGdRaEf0BwLldIgod7r','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "rsvps" VALUES('OVcXkTZelxrbtaafWUAg1','Si5AxAc4qyUT-mc3COskg','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "rsvps" VALUES('DLy9wRNrkeN_MxMWMRsD8','8nptJI9fTOB7tBx-GQSMp','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('zJmLmEgYCsHDLU7rZ8nla','cMma0lJjm8D5LkSpIf46t','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('Rqe4mDayVr5BRxEVwGt-c','81dcXcAE4YLhLPQvsbmrB','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('rhiYuGIvHiL_7hVG1EahD','70IWUMhmpFsczk-EySQnQ','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('mOkjzmBcnqUvGh4-qT-vG','F75OqA4LvRAPY4E1LN59d','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('GA_f-pOva3dwcLdfOC2Wc','UjOjt4yjik8FephfA0RSF','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "rsvps" VALUES('YCA36oyLGxnltnUgzQkI8','kT55LufJUSYKUiwiwpyr7','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "rsvps" VALUES('2rfFYoasMUw3vJImPyEoO','EAMaGD_YxtPE2J0nnI1kZ','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "rsvps" VALUES('ZoEX31ynsZbBRb9wwtxQl','g5g4HbEc_6r6wXYkUscoN','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "rsvps" VALUES('oYgrs-jovXHkByW-575tv','l5SacUuQ-KYT6dTFgUkKV','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('mrRQpoe4oyZLSIvGJ-ZUM','8nptJI9fTOB7tBx-GQSMp','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('n9gKg_NOK3sHd8fTRk0Yf','kT55LufJUSYKUiwiwpyr7','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('YZkiknhdX8-r1iFZflkpi','EAMaGD_YxtPE2J0nnI1kZ','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('clP8_LEThPVtGKsbtQYrA','Si5AxAc4qyUT-mc3COskg','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('ilZA7HABot2cviiobcPOz','70IWUMhmpFsczk-EySQnQ','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('Fb5nF058e1sSh7Lm68XB6','8ICsa9g-jApo8644H_5CP','HGSmRiy3lXrgW5OIe3psV');
INSERT INTO "rsvps" VALUES('xpv0je8NfXkgxAoi2Pz-r','l5SacUuQ-KYT6dTFgUkKV','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('XO7mTUtMEp0ZxXjluf7Oa','cMma0lJjm8D5LkSpIf46t','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('J2jo3Pz0dFtQljAVkoja-','EAMaGD_YxtPE2J0nnI1kZ','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('IiQNNq8BBVM_IpgQ2R82-','Si5AxAc4qyUT-mc3COskg','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('B6geIv6LkziJslO4tamfX','70IWUMhmpFsczk-EySQnQ','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('SGf7AEPCgRQ5l7gDnMdRS','lcPGnTnvJX-QdErowV-gf','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('DCa3e3wEJKH7B22OtB9Mu','F75OqA4LvRAPY4E1LN59d','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "rsvps" VALUES('5a7zN-6oNcklIVO1m-7WK','l5SacUuQ-KYT6dTFgUkKV','56i1PPNObDW-PmygSTEc8');
INSERT INTO "rsvps" VALUES('v1ncnIowhJ5i5I7h6zz-G','8nptJI9fTOB7tBx-GQSMp','56i1PPNObDW-PmygSTEc8');
INSERT INTO "rsvps" VALUES('sHNmkYEWW8XJhiygvDD89','rcNGdRaEf0BwLldIgod7r','56i1PPNObDW-PmygSTEc8');
INSERT INTO "rsvps" VALUES('GvRicrehJe-ryaYDb49th','rvc6aWcmg9jykIN0aF02E','56i1PPNObDW-PmygSTEc8');
INSERT INTO "rsvps" VALUES('j1znfhshtGi8N2foJOhEz','F75OqA4LvRAPY4E1LN59d','56i1PPNObDW-PmygSTEc8');
INSERT INTO "rsvps" VALUES('IV61hWDUBA6TnrEx88NJt','l5SacUuQ-KYT6dTFgUkKV','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('meQPjU8e1Hs1t_vALy1wg','8nptJI9fTOB7tBx-GQSMp','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('jVNaWr1w3mp4CHCLq0LSn','cMma0lJjm8D5LkSpIf46t','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('fyiazoTj4W1uiBpu5p6KG','kT55LufJUSYKUiwiwpyr7','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('cAbTIQ4YL-95e4xMjYWly','EAMaGD_YxtPE2J0nnI1kZ','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('kK2P-Nz2sfivJT_WwlZMU','lcPGnTnvJX-QdErowV-gf','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('W164puASgxYJg2W0bVUzt','UjOjt4yjik8FephfA0RSF','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "rsvps" VALUES('U9xgQaKmtcHL7KFVn_qJO','8nptJI9fTOB7tBx-GQSMp','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('Tuf8wGuEKBc1m1atyfM7W','rcNGdRaEf0BwLldIgod7r','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('QzvyjB9K2mh9cKARJVN0F','kT55LufJUSYKUiwiwpyr7','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('5kOaZvMvUWRE4KmIoMjcE','rvc6aWcmg9jykIN0aF02E','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('fB0IAsqtgkq5z-7U9WVZ6','KsQUPgSzRI7EtdtQLZ0u3','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('emGVBPK3ECUfcM_hr0Xrw','70IWUMhmpFsczk-EySQnQ','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('d4xwHVVsQesD7-tSNf_Hq','8ICsa9g-jApo8644H_5CP','bpf8-yo3LlYc1Vp9iNFl0');
INSERT INTO "rsvps" VALUES('-9mdCz03NagCae0JvewQw','8nptJI9fTOB7tBx-GQSMp','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('NVigmEHvePMaYBq8a7SxX','rcNGdRaEf0BwLldIgod7r','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('q65W7Uk5SyCgng4is3ZZL','rvc6aWcmg9jykIN0aF02E','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('Vt0dz7P4xF2ZgR8dAVP-B','KsQUPgSzRI7EtdtQLZ0u3','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('BY6A0xG3y12tAAvms3ALi','70IWUMhmpFsczk-EySQnQ','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('KR7Baqo-bemJNzOcHlsnz','pAySm1hsRr7D1Q5nqUyfb','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "rsvps" VALUES('-wVNegnykbf4L9a7H0rxh','l5SacUuQ-KYT6dTFgUkKV','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('sAn4eFWtP9lVU_USaMhLh','B_rQrgjxk3BXvUTRZRKFb','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('_v58uw7pTv1sQhSTSG8E7','cMma0lJjm8D5LkSpIf46t','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('vnaapSmTpAM8S8c-BzVH_','kT55LufJUSYKUiwiwpyr7','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('aDmbwV3csEm1bJC9TPLij','rvc6aWcmg9jykIN0aF02E','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('Nqtg4642T-2GO4RyCXjtV','KsQUPgSzRI7EtdtQLZ0u3','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "rsvps" VALUES('aBXhtbWBB1HCa6qDqCpe8','l5SacUuQ-KYT6dTFgUkKV','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('LOxU0t_yew8m74avpQH_o','B_rQrgjxk3BXvUTRZRKFb','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('PwGze1dzjx0tOV-HqG7sH','cMma0lJjm8D5LkSpIf46t','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('JfSyewr-K9vy97k-JwTEY','81dcXcAE4YLhLPQvsbmrB','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('eL8mdYfvk4nDxS-5XxPIz','g5g4HbEc_6r6wXYkUscoN','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('FiazF3d4r8lxOhgMPP6Xb','lcPGnTnvJX-QdErowV-gf','H4tNC6vRh_sZJql8AseGM');
INSERT INTO "rsvps" VALUES('lH03ldHrxcphnqZGfCGbJ','l5SacUuQ-KYT6dTFgUkKV','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "rsvps" VALUES('teh7J7_WebJQ7QrcIpR4l','KsQUPgSzRI7EtdtQLZ0u3','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "rsvps" VALUES('TKv7LMo3vYFOBdPF1vuSa','70IWUMhmpFsczk-EySQnQ','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "rsvps" VALUES('pRS5EF9R9ONPRDpTETO27','8ICsa9g-jApo8644H_5CP','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "rsvps" VALUES('dK3FkFGochkBFAzCWJX7X','l5SacUuQ-KYT6dTFgUkKV','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('5icp6eSgPcUF1h3stX8pw','kT55LufJUSYKUiwiwpyr7','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('LDstavgBMOWop5uuBo78m','70IWUMhmpFsczk-EySQnQ','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('k0FuqZaOqCFYANB9AJI87','lcPGnTnvJX-QdErowV-gf','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('rbR_vdeMTlSnYy3fF0xsP','UjOjt4yjik8FephfA0RSF','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('Ud-s6fbZO8rk0Ej5LkpBQ','8ICsa9g-jApo8644H_5CP','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "rsvps" VALUES('PM5hmo8msHo5Pk0KfqNqP','l5SacUuQ-KYT6dTFgUkKV','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "rsvps" VALUES('RZmdp_M37U3g6ZaHodeuo','kT55LufJUSYKUiwiwpyr7','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "rsvps" VALUES('PFUk_skl8Wd-rEHem8X-Q','KsQUPgSzRI7EtdtQLZ0u3','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "rsvps" VALUES('iNtvhsFU9T3lKO_rsgka8','g5g4HbEc_6r6wXYkUscoN','OLUkXAx3x9c9ZgT28xgoP');
INSERT INTO "rsvps" VALUES('jMQdspXVBBEB9tixk0AhD','B_rQrgjxk3BXvUTRZRKFb','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('iElprPuHfD0i9ckTRoRnM','rvc6aWcmg9jykIN0aF02E','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('VooFjp7JRRkDMwe_PF-36','Si5AxAc4qyUT-mc3COskg','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('73i3xdmLH-cEc8-sEKlmf','lcPGnTnvJX-QdErowV-gf','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('hwcNXUGnKwDKZ26KWxTi3','pAySm1hsRr7D1Q5nqUyfb','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('pqP3OSVaaiySdZiulecer','8ICsa9g-jApo8644H_5CP','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "rsvps" VALUES('cSpEX-2YX7oYpXK0Olwau','8nptJI9fTOB7tBx-GQSMp','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "rsvps" VALUES('vx0yxnvai8Lmo9cXCJeh6','EAMaGD_YxtPE2J0nnI1kZ','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "rsvps" VALUES('YwbbnjbJocLPAnS79wyMm','KsQUPgSzRI7EtdtQLZ0u3','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "rsvps" VALUES('9YRychvIR52kTwozTQyVt','pAySm1hsRr7D1Q5nqUyfb','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "rsvps" VALUES('aPRWmNqEYIDd1G-EJXhlU','8ICsa9g-jApo8644H_5CP','V4S6hF2dncw5O3rC2tm3m');
INSERT INTO "rsvps" VALUES('XDg_kG9KdnqymYBjnAFlk','8nptJI9fTOB7tBx-GQSMp','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('XZpIbFHqr75Wf03172mrE','EAMaGD_YxtPE2J0nnI1kZ','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('qarO9x9vveQ9YC5HASVKe','KsQUPgSzRI7EtdtQLZ0u3','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('OZX6gdGHN1BpQNbxf7CSi','g5g4HbEc_6r6wXYkUscoN','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('nL3dChHmuz8IfxWGlFNu8','lcPGnTnvJX-QdErowV-gf','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('Ybfdl57pZsRH_qeqcQvuE','pAySm1hsRr7D1Q5nqUyfb','pkfGVZdfjsw1bzmeR9xrG');
INSERT INTO "rsvps" VALUES('1b4yOzdkI-dL3_73tBxnz','l5SacUuQ-KYT6dTFgUkKV','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('MyjLhryeeVGtcvD-d_LlU','kT55LufJUSYKUiwiwpyr7','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('y3pcraNmdjg3pLW6Pr5a0','rvc6aWcmg9jykIN0aF02E','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('vfKWYpjpEisNT8QN--KRO','Si5AxAc4qyUT-mc3COskg','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('qtH9g41FNuo5jqm3oLOiz','70IWUMhmpFsczk-EySQnQ','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('CNwJfylF1920_yMtsCC23','UjOjt4yjik8FephfA0RSF','hcgyLMhEySkieazQGLx2Z');
INSERT INTO "rsvps" VALUES('YFtVfAhCSDUdhJlPgSHye','cMma0lJjm8D5LkSpIf46t','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('KGaxY6nwhB28Bo2CIshCY','81dcXcAE4YLhLPQvsbmrB','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('TIpW8bhbYrabxorbNBDqU','Si5AxAc4qyUT-mc3COskg','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('7V4pFUnhtWLgv8U3sC6Vn','g5g4HbEc_6r6wXYkUscoN','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('a1UoAWcUxzmD1jC4o_lJF','pAySm1hsRr7D1Q5nqUyfb','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('19TsYHMBEXJKgPGL9CpJ7','8ICsa9g-jApo8644H_5CP','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "rsvps" VALUES('_A5jCF3SygMXmfAm3GC-c','l5SacUuQ-KYT6dTFgUkKV','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('_UvU0EBRe7Job3G0ghrtV','rvc6aWcmg9jykIN0aF02E','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('F135fwBJXmcmpIdoY8-rL','EAMaGD_YxtPE2J0nnI1kZ','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('IGrBzVmm27_Q04gufNq_l','Si5AxAc4qyUT-mc3COskg','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('QeLrrjXzfTaVSg7NrQLjl','pAySm1hsRr7D1Q5nqUyfb','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('YuRE9J1zDrSMoDFvHySB9','8ICsa9g-jApo8644H_5CP','674LkKoaNetzVfAAXzKAy');
INSERT INTO "rsvps" VALUES('y_Bpj5bWVR-LM-1XnGXXV','rcNGdRaEf0BwLldIgod7r','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('iuAiqqJI31xZPQXvz5XwX','rvc6aWcmg9jykIN0aF02E','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('b-LtSgUSOGYx7oMK4UvHQ','81dcXcAE4YLhLPQvsbmrB','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('jOHrrm62Xxjhq5fViwQvQ','lcPGnTnvJX-QdErowV-gf','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('tes3oI0e0GjLhqvEVvSWU','UjOjt4yjik8FephfA0RSF','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('NMVYaLVJ09fRxD77BzWY0','8ICsa9g-jApo8644H_5CP','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "rsvps" VALUES('4JvF8qqCa2DMfVTX6Xq_8','rcNGdRaEf0BwLldIgod7r','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "rsvps" VALUES('ds0GnExMs-nkRXf3CDGgN','kT55LufJUSYKUiwiwpyr7','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "rsvps" VALUES('WUTsF8EUKf3PI9ns5N9Yi','70IWUMhmpFsczk-EySQnQ','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "rsvps" VALUES('tQc78ppNytBBRzqbZ-Z5m','UjOjt4yjik8FephfA0RSF','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "rsvps" VALUES('Mkyf-vQYpNq61m55PnHYr','8ICsa9g-jApo8644H_5CP','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "rsvps" VALUES('n4g1W_RKDIY5FItG74aZA','l5SacUuQ-KYT6dTFgUkKV','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "rsvps" VALUES('TeaFYu3juG2p9L0gv-ipX','cMma0lJjm8D5LkSpIf46t','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "rsvps" VALUES('_Zp6DbZIqUK222jRgy1hc','Si5AxAc4qyUT-mc3COskg','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "rsvps" VALUES('-QbDVDfOuaNGQiMlw0iK6','pAySm1hsRr7D1Q5nqUyfb','-65kFmoP6lfo-KlVeZeEO');
INSERT INTO "rsvps" VALUES('tggB4ONtjmJ2-c0Rl2yJG','l5SacUuQ-KYT6dTFgUkKV','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "rsvps" VALUES('05PfuU-2SU_cie3leQHDV','B_rQrgjxk3BXvUTRZRKFb','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "rsvps" VALUES('f-qskshZMJxpXTMQI84pV','rvc6aWcmg9jykIN0aF02E','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "rsvps" VALUES('cFGvXFsULE6aQqGF2fPb1','EAMaGD_YxtPE2J0nnI1kZ','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "rsvps" VALUES('FMzLr_Qlai47SMswGGekp','pAySm1hsRr7D1Q5nqUyfb','oDkSLPMVj0inCmYQgdiCm');
INSERT INTO "rsvps" VALUES('jv2N9QRQO9WGx3Xb11lTT','B_rQrgjxk3BXvUTRZRKFb','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('aRKpRy5-MuAOmbDHYAs4E','rcNGdRaEf0BwLldIgod7r','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('SaF3Kbd5ZAg2Hbl6lVtkw','81dcXcAE4YLhLPQvsbmrB','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('m0v1rIulf1yvMuRwO_5_8','g5g4HbEc_6r6wXYkUscoN','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('J8xUoDZpN_DDdb4Q5tYID','lcPGnTnvJX-QdErowV-gf','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('NPe1N7CFr1GevT89B0uYL','pAySm1hsRr7D1Q5nqUyfb','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('qOYDx3HYcRzjFVweaT8eC','8ICsa9g-jApo8644H_5CP','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "rsvps" VALUES('JPI-BOefU2kTFURhjG9HN','l5SacUuQ-KYT6dTFgUkKV','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('-GMNgLgR5sHGcyIe0AySG','8nptJI9fTOB7tBx-GQSMp','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('JSPvu9K_pSImV8vuXoIdg','81dcXcAE4YLhLPQvsbmrB','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('NIHAie6R093cV51KrQeCm','KsQUPgSzRI7EtdtQLZ0u3','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('YAKWUIhBVWJRLQ6qRZ7xO','g5g4HbEc_6r6wXYkUscoN','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('Tjg8o00TNz_Du-Wvk36sc','F75OqA4LvRAPY4E1LN59d','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('WD4ogkfBWUW8a1Sx1BBE0','8ICsa9g-jApo8644H_5CP','xuKuS8oJmLcOIYVEzn6xY');
INSERT INTO "rsvps" VALUES('L9oXwgW8fdo-wjwrb6IyF','l5SacUuQ-KYT6dTFgUkKV','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "rsvps" VALUES('CX_54rIsAJYkO8f_FudYd','cMma0lJjm8D5LkSpIf46t','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "rsvps" VALUES('ftBblqzZaJe6i2BLoX6Yn','UjOjt4yjik8FephfA0RSF','U0ekKLQccH73YGKwlY3Z9');
INSERT INTO "rsvps" VALUES('KP0ICn9GqILa1tc0yiubI','lcPGnTnvJX-QdErowV-gf','-tcf2SnCejINfQv6PwadN');
INSERT INTO "rsvps" VALUES('nM_wV_Bsy_pm6N1U6FidB','pAySm1hsRr7D1Q5nqUyfb','-tcf2SnCejINfQv6PwadN');
INSERT INTO "rsvps" VALUES('NkkwM6E37NYQnTDr7L1W1','8ICsa9g-jApo8644H_5CP','-tcf2SnCejINfQv6PwadN');
INSERT INTO "rsvps" VALUES('9WK-O7ezKzYlRld9_C9lE','B_rQrgjxk3BXvUTRZRKFb','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "rsvps" VALUES('LtLz-FeDI1eXhVWJIFSIh','rvc6aWcmg9jykIN0aF02E','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "rsvps" VALUES('x0Vx_cAMKL8ab3Lcn923t','81dcXcAE4YLhLPQvsbmrB','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "rsvps" VALUES('cmGh3SN4fqdXppomlqcfV','KsQUPgSzRI7EtdtQLZ0u3','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "rsvps" VALUES('8XANpT_WV0Pt_Ss53rsNf','UjOjt4yjik8FephfA0RSF','Esx6Buu8Om0CsYBLdMcs8');
INSERT INTO "rsvps" VALUES('ysFnr0UMjoYBhX7tIG-5p','l5SacUuQ-KYT6dTFgUkKV','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('UutLVqYr_LWDQPtzViIeb','81dcXcAE4YLhLPQvsbmrB','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('R7qrjtPURBEkW-JWL1dYO','KsQUPgSzRI7EtdtQLZ0u3','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('nVz5yUuoqFknhcWgp63Tq','g5g4HbEc_6r6wXYkUscoN','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('I5vunZZt06tZQ52VkfD9G','lcPGnTnvJX-QdErowV-gf','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('kDgIVupbUCPGROQOTXpVS','8ICsa9g-jApo8644H_5CP','V5m-Y-E_xLRukf07jfSYs');
INSERT INTO "rsvps" VALUES('5dxd1j8AV_pD8FrgJq7ff','l5SacUuQ-KYT6dTFgUkKV','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('yizhe4nLNTVGAfcrwSU8i','cMma0lJjm8D5LkSpIf46t','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('wVRp6HfhusYCEfvX6HWEa','81dcXcAE4YLhLPQvsbmrB','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('amaI9cRnunuPTsZo2nL4E','70IWUMhmpFsczk-EySQnQ','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('vaMyEAZQiDLcZ63iujma-','pAySm1hsRr7D1Q5nqUyfb','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('fYq7Mg_SuRAb_Ja-C-YSv','8ICsa9g-jApo8644H_5CP','DmIi0t0oVlnKcRPwLyE86');
INSERT INTO "rsvps" VALUES('05k_mpVgsXNtiUi8wAndA','l5SacUuQ-KYT6dTFgUkKV','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "rsvps" VALUES('dFjO93WaD2Csab1RCqlI5','KsQUPgSzRI7EtdtQLZ0u3','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "rsvps" VALUES('3fNAn0OtCQliQVpp-88V8','lcPGnTnvJX-QdErowV-gf','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "rsvps" VALUES('6HK69PfO_zfUi6Wjs9yKi','UjOjt4yjik8FephfA0RSF','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "rsvps" VALUES('HiWC3v2oqmz4fSgas67-J','8ICsa9g-jApo8644H_5CP','k-Yv0skkPvBEXp12fkWrP');
INSERT INTO "rsvps" VALUES('I-Da6tfaU_oRdJF-9l4ik','l5SacUuQ-KYT6dTFgUkKV','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('NbSSmhtJNXV_Gyq3J31-X','B_rQrgjxk3BXvUTRZRKFb','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('VhO9c0il9gFz04OHct-Kh','81dcXcAE4YLhLPQvsbmrB','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('2PT9TEIQ5yuQF1Sy2H-vr','lcPGnTnvJX-QdErowV-gf','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('Dd1STjLC4fOZJutY2wS93','pAySm1hsRr7D1Q5nqUyfb','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('JbcVVuD9potheLV3hOqLE','UjOjt4yjik8FephfA0RSF','wARkFhrSpExOGjLORuuuc');
INSERT INTO "rsvps" VALUES('gbek7g26py_wLtpzAYK9r','l5SacUuQ-KYT6dTFgUkKV','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('qTm1wMIvq-mrwWH-U8CFH','B_rQrgjxk3BXvUTRZRKFb','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('Ud-U70eTHSwzhmLJYSNwN','rcNGdRaEf0BwLldIgod7r','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('3f_NLovCKKD6jM3DU6jEA','81dcXcAE4YLhLPQvsbmrB','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('YfVqIFg5QtPFaxaotGkXT','Si5AxAc4qyUT-mc3COskg','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('rP-4fuhDl_f8kXPVsz0hG','F75OqA4LvRAPY4E1LN59d','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('EJjorLJmnBT6_piwNvSSm','UjOjt4yjik8FephfA0RSF','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('D_xbQEFGVFWByNAQCyUR3','8ICsa9g-jApo8644H_5CP','AOStw-UrlZUwRBR3NE9Xe');
INSERT INTO "rsvps" VALUES('PCt729tq94Q-46zZ7QeS4','B_rQrgjxk3BXvUTRZRKFb','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "rsvps" VALUES('YVo7JKB5KCkXZIkkBiMJW','81dcXcAE4YLhLPQvsbmrB','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "rsvps" VALUES('S6MhfzCIdV5_W4z2l4o7o','KsQUPgSzRI7EtdtQLZ0u3','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "rsvps" VALUES('NX3IcaJB29_pb0KAI8lN8','lcPGnTnvJX-QdErowV-gf','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "rsvps" VALUES('NmBQ2cgW7MRtoZbfaw7_u','pAySm1hsRr7D1Q5nqUyfb','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "rsvps" VALUES('TqycciLmu1SSYUqj3VcdD','l5SacUuQ-KYT6dTFgUkKV','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "rsvps" VALUES('mnxPzj5zqsvp3-8R2QA8F','B_rQrgjxk3BXvUTRZRKFb','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "rsvps" VALUES('rXGay4ljHkb5dAXmAMuli','rvc6aWcmg9jykIN0aF02E','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "rsvps" VALUES('CVwRybXUvy7M923cHLRKc','70IWUMhmpFsczk-EySQnQ','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "rsvps" VALUES('jxeQgVGyZMBO4rQdmEEDt','pAySm1hsRr7D1Q5nqUyfb','l8nd_mSHbfeLStgkxyCI0');
INSERT INTO "rsvps" VALUES('Vo1oCoUy96Q1gulVof2EM','8nptJI9fTOB7tBx-GQSMp','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('m76ni2t8v0a-kUGsePErx','rcNGdRaEf0BwLldIgod7r','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('tQfgERZhYNNlH71NsYXNK','kT55LufJUSYKUiwiwpyr7','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('3cwcxY0n1lFEIfk3GxdWC','EAMaGD_YxtPE2J0nnI1kZ','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('RV_cQT1vY_jrZZy48WvXS','lcPGnTnvJX-QdErowV-gf','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('xUd7l92ium47RAu92eFFm','pAySm1hsRr7D1Q5nqUyfb','mzu3YLHMKgclzb1XFIT07');
INSERT INTO "rsvps" VALUES('iVfvwrCfh5XP1AqDlpsXK','l5SacUuQ-KYT6dTFgUkKV','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('O4PBjw4g1P7Nx3f7kZlII','B_rQrgjxk3BXvUTRZRKFb','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('LF7iV8d2M5GoraGP_GFyd','cMma0lJjm8D5LkSpIf46t','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('KdzNtLoSKoW2-0wJ4r7EG','70IWUMhmpFsczk-EySQnQ','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('Cs9ZI6DXLRY1zRZR8uVZl','lcPGnTnvJX-QdErowV-gf','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('tM8-QPKLVzkv-wCifoGrI','UjOjt4yjik8FephfA0RSF','xx_5Kpc1K-V3HMp05lrOa');
INSERT INTO "rsvps" VALUES('KgUvErTII28N0MnpSJpaK','l5SacUuQ-KYT6dTFgUkKV','wMhAFVhmAIfmIfYP_W5bK');
INSERT INTO "rsvps" VALUES('MTJMDWlBeKtapd759A1uy','cMma0lJjm8D5LkSpIf46t','wMhAFVhmAIfmIfYP_W5bK');
INSERT INTO "rsvps" VALUES('NwM5xtwiVqVH9w1APw_YC','Si5AxAc4qyUT-mc3COskg','wMhAFVhmAIfmIfYP_W5bK');
INSERT INTO "rsvps" VALUES('oseiPOo7fP3ef1Pqr6_bN','8ICsa9g-jApo8644H_5CP','wMhAFVhmAIfmIfYP_W5bK');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('xR409Fsvnm6YjCM864Ueh','5HzaeQPX_Q5AS9Ry7-g0P');
INSERT INTO "session_hosts" VALUES('Kpjo4FEG6jWtztCYbTI5u','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "session_hosts" VALUES('l5SacUuQ-KYT6dTFgUkKV','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "session_hosts" VALUES('8nptJI9fTOB7tBx-GQSMp','HsO7ub1xzup1hjMSfDh6N');
INSERT INTO "session_hosts" VALUES('B_rQrgjxk3BXvUTRZRKFb','3eDfavLHK-w8UFQStbNe9');
INSERT INTO "session_hosts" VALUES('cMma0lJjm8D5LkSpIf46t','674LkKoaNetzVfAAXzKAy');
INSERT INTO "session_hosts" VALUES('rcNGdRaEf0BwLldIgod7r','4RJcYaJoa4zaJcVVGF6GK');
INSERT INTO "session_hosts" VALUES('kT55LufJUSYKUiwiwpyr7','31Q8fVuFLR2l7YJLOvCuh');
INSERT INTO "session_hosts" VALUES('rvc6aWcmg9jykIN0aF02E','wdKiGvZYAwLisZE1i26oD');
INSERT INTO "session_hosts" VALUES('81dcXcAE4YLhLPQvsbmrB','CssVX1HK8f7TH1kMpgsKD');
INSERT INTO "session_hosts" VALUES('EAMaGD_YxtPE2J0nnI1kZ','xHzguFgK5CrqWXPDcvEgd');
INSERT INTO "session_hosts" VALUES('Si5AxAc4qyUT-mc3COskg','ZKfmZvoeuQu0Vl20KYByx');
INSERT INTO "session_hosts" VALUES('KsQUPgSzRI7EtdtQLZ0u3','SLeEQjx9QHnHky2x2L5Ke');
INSERT INTO "session_hosts" VALUES('70IWUMhmpFsczk-EySQnQ','5cKMVI_IB7JVQbrFSlRXS');
INSERT INTO "session_hosts" VALUES('70IWUMhmpFsczk-EySQnQ','wARkFhrSpExOGjLORuuuc');
INSERT INTO "session_hosts" VALUES('g5g4HbEc_6r6wXYkUscoN','FDey5RKF35qiOeLUbSdjS');
INSERT INTO "session_hosts" VALUES('lcPGnTnvJX-QdErowV-gf','r3Rmp1dBG-jP4OoJvkAjs');
INSERT INTO "session_hosts" VALUES('pAySm1hsRr7D1Q5nqUyfb','flnjCaAzGgABGdbXUmS_A');
INSERT INTO "session_hosts" VALUES('F75OqA4LvRAPY4E1LN59d','DbLvx5jtFkYtoIyDVavJL');
INSERT INTO "session_hosts" VALUES('UjOjt4yjik8FephfA0RSF','cjc_whiGjsvXFd3c69Kad');
INSERT INTO "session_hosts" VALUES('8ICsa9g-jApo8644H_5CP','wdKiGvZYAwLisZE1i26oD');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('xR409Fsvnm6YjCM864Ueh','loc-main-hall');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-main-hall');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-room-a');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-room-b');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-library');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-boardroom');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-auditorium');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-courtyard');
INSERT INTO "session_locations" VALUES('s2PpZQ9GoWzibe3i9pG1L','loc-rooftop');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-main-hall');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-room-a');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-room-b');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-library');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-boardroom');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-auditorium');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-courtyard');
INSERT INTO "session_locations" VALUES('BYwLeGxjIEYPaai4BbPCg','loc-rooftop');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-main-hall');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-room-a');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-room-b');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-library');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-boardroom');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-auditorium');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-courtyard');
INSERT INTO "session_locations" VALUES('PICVSC2o1dq_T7AmlwBsM','loc-rooftop');
INSERT INTO "session_locations" VALUES('Kpjo4FEG6jWtztCYbTI5u','loc-main-hall');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-main-hall');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-room-a');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-room-b');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-library');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-boardroom');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-auditorium');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-courtyard');
INSERT INTO "session_locations" VALUES('-wLDBNq8TjUUnUI57iob3','loc-rooftop');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-main-hall');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-room-a');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-room-b');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-library');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-boardroom');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-auditorium');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-courtyard');
INSERT INTO "session_locations" VALUES('YWde6SmKb-0EkXyU6l6p5','loc-rooftop');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-main-hall');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-room-a');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-room-b');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-library');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-boardroom');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-auditorium');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-courtyard');
INSERT INTO "session_locations" VALUES('cjleu1OMl3rrxiSEz_5BQ','loc-rooftop');
INSERT INTO "session_locations" VALUES('l5SacUuQ-KYT6dTFgUkKV','loc-main-hall');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-main-hall');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-room-a');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-room-b');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-library');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-boardroom');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-auditorium');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-courtyard');
INSERT INTO "session_locations" VALUES('QPyKLNw5kFbw_XWEcSCft','loc-rooftop');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-main-hall');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-room-a');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-room-b');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-library');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-boardroom');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-auditorium');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-courtyard');
INSERT INTO "session_locations" VALUES('0sEQKs53dwXoyN6_5Yd3f','loc-rooftop');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-main-hall');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-room-a');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-room-b');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-library');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-boardroom');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-auditorium');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-courtyard');
INSERT INTO "session_locations" VALUES('f6ocP0JHu0iEzMj-sLYWy','loc-rooftop');
INSERT INTO "session_locations" VALUES('8nptJI9fTOB7tBx-GQSMp','loc-main-hall');
INSERT INTO "session_locations" VALUES('B_rQrgjxk3BXvUTRZRKFb','loc-room-a');
INSERT INTO "session_locations" VALUES('cMma0lJjm8D5LkSpIf46t','loc-main-hall');
INSERT INTO "session_locations" VALUES('rcNGdRaEf0BwLldIgod7r','loc-room-b');
INSERT INTO "session_locations" VALUES('kT55LufJUSYKUiwiwpyr7','loc-room-a');
INSERT INTO "session_locations" VALUES('rvc6aWcmg9jykIN0aF02E','loc-main-hall');
INSERT INTO "session_locations" VALUES('81dcXcAE4YLhLPQvsbmrB','loc-room-b');
INSERT INTO "session_locations" VALUES('EAMaGD_YxtPE2J0nnI1kZ','loc-room-a');
INSERT INTO "session_locations" VALUES('Si5AxAc4qyUT-mc3COskg','loc-main-hall');
INSERT INTO "session_locations" VALUES('KsQUPgSzRI7EtdtQLZ0u3','loc-room-b');
INSERT INTO "session_locations" VALUES('70IWUMhmpFsczk-EySQnQ','loc-main-hall');
INSERT INTO "session_locations" VALUES('g5g4HbEc_6r6wXYkUscoN','loc-room-b');
INSERT INTO "session_locations" VALUES('lcPGnTnvJX-QdErowV-gf','loc-main-hall');
INSERT INTO "session_locations" VALUES('pAySm1hsRr7D1Q5nqUyfb','loc-room-a');
INSERT INTO "session_locations" VALUES('F75OqA4LvRAPY4E1LN59d','loc-room-b');
INSERT INTO "session_locations" VALUES('UjOjt4yjik8FephfA0RSF','loc-main-hall');
INSERT INTO "session_locations" VALUES('8ICsa9g-jApo8644H_5CP','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('vUAV08OHmo6JrQIQESIao','oP-K6FWFdyJMZAAWMI_Gp','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('mcE9CrR7sT5Qyz0xLPL1g','oP-K6FWFdyJMZAAWMI_Gp','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('MC7C3XnMRm4nfTvY_nDFO','oP-K6FWFdyJMZAAWMI_Gp','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('IaiTThu8gOHJrhv3lENfh','oP-K6FWFdyJMZAAWMI_Gp','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('yq5YcT16Erj50AsO9azWf','oP-K6FWFdyJMZAAWMI_Gp','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('mMNwr6VrstHgbaHgVkwF8','oP-K6FWFdyJMZAAWMI_Gp','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('OanIE3shMNrTW4LTa-Hk6','oP-K6FWFdyJMZAAWMI_Gp','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('IF25wOHfkaZxP3zfBGtCR','oP-K6FWFdyJMZAAWMI_Gp','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('MF-JjGzAsiq2PFHe0FGMj','oP-K6FWFdyJMZAAWMI_Gp','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('nBi7EuYDKPLrVoGdTF7qq','oP-K6FWFdyJMZAAWMI_Gp','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('Jku1y_3IKZHKOQoVQkGMW','oP-K6FWFdyJMZAAWMI_Gp','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:22.827Z');
INSERT INTO "session_proposals" VALUES('Vpg6ZhaYPDKmhWxXPYLAc','pgOlrtfknEmKZ-Lwveoxj','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('pcBQpLYqi6lwyq4k3cRlf','pgOlrtfknEmKZ-Lwveoxj','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('sCO9dXVF6Wt77a4AXY1Mu','pgOlrtfknEmKZ-Lwveoxj','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('cKVRSiTySX3u7sW__zB8F','pgOlrtfknEmKZ-Lwveoxj','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('ahpI-IgUdYsiDbGpk3eBM','pgOlrtfknEmKZ-Lwveoxj','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('9CKo3jDMBsEUnomDnIznK','pgOlrtfknEmKZ-Lwveoxj','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('41wZdVcy5sb7bI7azXBfc','pgOlrtfknEmKZ-Lwveoxj','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('SrSbVgHgvm1iIL__onaYs','pgOlrtfknEmKZ-Lwveoxj','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('e92aQ6pdpJY2IX4jh60jT','pgOlrtfknEmKZ-Lwveoxj','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('MUvGFWtO3icYW5IdgOPJn','pgOlrtfknEmKZ-Lwveoxj','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('1wi_cTdFtoEgXb9yN7IVj','pgOlrtfknEmKZ-Lwveoxj','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('ZHZ159Vjoz5xmZl6ospDh','pgOlrtfknEmKZ-Lwveoxj','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('pTQP-qQKlCKg6zd1oBDCe','pgOlrtfknEmKZ-Lwveoxj','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('l4nP8oBfyc7riyJj7-3Bp','MV-dn31tR6gIMAVDMAi4r','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('3iEcnbIuv8X3nuEw6m2WO','MV-dn31tR6gIMAVDMAi4r','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('oeyrbWuhRm67d1ROMHr-s','MV-dn31tR6gIMAVDMAi4r','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('pnfYCUiaFmlcXoSyh5Gz7','MV-dn31tR6gIMAVDMAi4r','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('aEv80tPELm6Lkrm40Eo4n','MV-dn31tR6gIMAVDMAi4r','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('XuJxE6oPDJrYMViQOCD7h','MV-dn31tR6gIMAVDMAi4r','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('LxAb99FugSw6xy6AcH107','MV-dn31tR6gIMAVDMAi4r','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('QVSYDsPsHDhVMkRKnsdAu','MV-dn31tR6gIMAVDMAi4r','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('ShYyAkqjhtH0YaWi4pUK-','MV-dn31tR6gIMAVDMAi4r','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('nX7dFDh2YFh-aZFKWpL7n','MV-dn31tR6gIMAVDMAi4r','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('cHFyyROyBpF-0ZF3wnduD','MV-dn31tR6gIMAVDMAi4r','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('xSWsbk5rnqCy8uUGTFiJl','MV-dn31tR6gIMAVDMAi4r','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('H11sL2hdWU-rWrcOeqpXu','MV-dn31tR6gIMAVDMAi4r','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('R4LAGueDEWg_tN0aCGhd4','MV-dn31tR6gIMAVDMAi4r','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('v_gQTXZmIeX8dKnbYFKMG','MV-dn31tR6gIMAVDMAi4r','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('qrcVhkFNNPiTOPXHeJEhS','MV-dn31tR6gIMAVDMAi4r','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('2FoTJ7zXeOeCBpd4wAQ_M','MV-dn31tR6gIMAVDMAi4r','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-08-30T09:25:22.828Z');
INSERT INTO "session_proposals" VALUES('O9-RUVlL7PanRRu52km7V','MV-dn31tR6gIMAVDMAi4r','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-08-30T09:25:22.828Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('icK8U25XtVkRYJ59pvG34','Vpg6ZhaYPDKmhWxXPYLAc','5HzaeQPX_Q5AS9Ry7-g0P','maybe');
INSERT INTO "votes" VALUES('E17FrDx4HeZtcCMh-gU_z','cKVRSiTySX3u7sW__zB8F','5HzaeQPX_Q5AS9Ry7-g0P','interested');
INSERT INTO "votes" VALUES('kbz5KgyOcwjBUIM85ip7V','9CKo3jDMBsEUnomDnIznK','5HzaeQPX_Q5AS9Ry7-g0P','maybe');
INSERT INTO "votes" VALUES('2jbLi8awn0Vw1C6eAapST','41wZdVcy5sb7bI7azXBfc','5HzaeQPX_Q5AS9Ry7-g0P','maybe');
INSERT INTO "votes" VALUES('l-SZ75Z92e430UGZw0t0s','e92aQ6pdpJY2IX4jh60jT','5HzaeQPX_Q5AS9Ry7-g0P','interested');
INSERT INTO "votes" VALUES('e_DycJo1_qzte5WpKqI2r','MUvGFWtO3icYW5IdgOPJn','5HzaeQPX_Q5AS9Ry7-g0P','skip');
INSERT INTO "votes" VALUES('_heGQyNXV6oagVdEELzqv','pcBQpLYqi6lwyq4k3cRlf','5cKMVI_IB7JVQbrFSlRXS','maybe');
INSERT INTO "votes" VALUES('h1UrZt1logg6tOcHwOiFV','cKVRSiTySX3u7sW__zB8F','5cKMVI_IB7JVQbrFSlRXS','interested');
INSERT INTO "votes" VALUES('HB7pgyekUM4j9hP4CNJGx','ahpI-IgUdYsiDbGpk3eBM','5cKMVI_IB7JVQbrFSlRXS','skip');
INSERT INTO "votes" VALUES('DYV6iX0aozhJ1jDB91Zd8','e92aQ6pdpJY2IX4jh60jT','5cKMVI_IB7JVQbrFSlRXS','maybe');
INSERT INTO "votes" VALUES('TMxbYq06p7bC3e8XAAXUX','ahpI-IgUdYsiDbGpk3eBM','wdKiGvZYAwLisZE1i26oD','maybe');
INSERT INTO "votes" VALUES('Q7IMFbf3pBXV0X4b-MWDO','9CKo3jDMBsEUnomDnIznK','wdKiGvZYAwLisZE1i26oD','maybe');
INSERT INTO "votes" VALUES('8LA8aGQH_uxH5dC3EHp6U','sCO9dXVF6Wt77a4AXY1Mu','HsO7ub1xzup1hjMSfDh6N','maybe');
INSERT INTO "votes" VALUES('Bwm4a2TVr6Jjku7iqTB-j','cKVRSiTySX3u7sW__zB8F','HsO7ub1xzup1hjMSfDh6N','interested');
INSERT INTO "votes" VALUES('HQ58ojiV8b386p4kvePrJ','41wZdVcy5sb7bI7azXBfc','HsO7ub1xzup1hjMSfDh6N','maybe');
INSERT INTO "votes" VALUES('AnqwritARd8_ksQoTiesC','SrSbVgHgvm1iIL__onaYs','HsO7ub1xzup1hjMSfDh6N','interested');
INSERT INTO "votes" VALUES('wlpRn9_SBy9RN1tdHxGuh','e92aQ6pdpJY2IX4jh60jT','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('29ASh6aHaV9ysDv7hKaBZ','pcBQpLYqi6lwyq4k3cRlf','HGSmRiy3lXrgW5OIe3psV','skip');
INSERT INTO "votes" VALUES('cCEBLWHEFjhhwoEYPv4bm','9CKo3jDMBsEUnomDnIznK','HGSmRiy3lXrgW5OIe3psV','interested');
INSERT INTO "votes" VALUES('T4_yIzJgg7MVcEUsg8sY0','Vpg6ZhaYPDKmhWxXPYLAc','3eDfavLHK-w8UFQStbNe9','maybe');
INSERT INTO "votes" VALUES('29Ca9cfAQGmx_K0rKoJv_','41wZdVcy5sb7bI7azXBfc','3eDfavLHK-w8UFQStbNe9','maybe');
INSERT INTO "votes" VALUES('5CXhw6BZEX448sE6BbqZp','e92aQ6pdpJY2IX4jh60jT','3eDfavLHK-w8UFQStbNe9','skip');
INSERT INTO "votes" VALUES('2MCh_XvxJZERm1LoOrD3G','Vpg6ZhaYPDKmhWxXPYLAc','56i1PPNObDW-PmygSTEc8','skip');
INSERT INTO "votes" VALUES('HbHmwgdzFgFX6iebse65x','pcBQpLYqi6lwyq4k3cRlf','56i1PPNObDW-PmygSTEc8','skip');
INSERT INTO "votes" VALUES('ykP3Lc3hXNtogzbAX5nkS','sCO9dXVF6Wt77a4AXY1Mu','56i1PPNObDW-PmygSTEc8','skip');
INSERT INTO "votes" VALUES('0-k0dsIst6dTYmqpb-YuA','cKVRSiTySX3u7sW__zB8F','56i1PPNObDW-PmygSTEc8','maybe');
INSERT INTO "votes" VALUES('vCQjLk_5eBabjKZ0wsx53','41wZdVcy5sb7bI7azXBfc','56i1PPNObDW-PmygSTEc8','maybe');
INSERT INTO "votes" VALUES('e79KSrvPQGrgOIOjJmOwA','SrSbVgHgvm1iIL__onaYs','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('vjSKqxEvkUsv_1Z80Yznw','e92aQ6pdpJY2IX4jh60jT','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('qtmXNwV5MZgKbGKc3j_rS','MUvGFWtO3icYW5IdgOPJn','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('eU1vRqTDb-LrxLXhDfZk4','Vpg6ZhaYPDKmhWxXPYLAc','ZKfmZvoeuQu0Vl20KYByx','interested');
INSERT INTO "votes" VALUES('WDx8QKqyy3b2srzycKilr','pcBQpLYqi6lwyq4k3cRlf','ZKfmZvoeuQu0Vl20KYByx','interested');
INSERT INTO "votes" VALUES('okF1fd0hALTWbASejiIal','SrSbVgHgvm1iIL__onaYs','ZKfmZvoeuQu0Vl20KYByx','maybe');
INSERT INTO "votes" VALUES('QD8rKPLMvkJZrpGk2msZl','MUvGFWtO3icYW5IdgOPJn','ZKfmZvoeuQu0Vl20KYByx','skip');
INSERT INTO "votes" VALUES('Sf8NpzH1FdMmwww5_Fyg9','sCO9dXVF6Wt77a4AXY1Mu','bpf8-yo3LlYc1Vp9iNFl0','skip');
INSERT INTO "votes" VALUES('Vpc3rUiCI78XXy8tll8Y8','9CKo3jDMBsEUnomDnIznK','bpf8-yo3LlYc1Vp9iNFl0','maybe');
INSERT INTO "votes" VALUES('JAR4exDouLQWUhoduiXli','MUvGFWtO3icYW5IdgOPJn','bpf8-yo3LlYc1Vp9iNFl0','maybe');
INSERT INTO "votes" VALUES('8_6jZaWTDsjHCW4dIGH4V','pcBQpLYqi6lwyq4k3cRlf','cjc_whiGjsvXFd3c69Kad','maybe');
INSERT INTO "votes" VALUES('IGdHgDM20HTJ9BgL6ogFh','sCO9dXVF6Wt77a4AXY1Mu','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('_mBVMcnXhbRYStxCiuiZ0','cKVRSiTySX3u7sW__zB8F','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('Hdpd4hsvkhzeo-gRGq3iR','ahpI-IgUdYsiDbGpk3eBM','cjc_whiGjsvXFd3c69Kad','skip');
INSERT INTO "votes" VALUES('pM9bkTiqHcD54C3bkH4Pr','MUvGFWtO3icYW5IdgOPJn','cjc_whiGjsvXFd3c69Kad','skip');
INSERT INTO "votes" VALUES('TC5yfc7HRX9_mPWj6roJz','SrSbVgHgvm1iIL__onaYs','flnjCaAzGgABGdbXUmS_A','maybe');
INSERT INTO "votes" VALUES('6uqjTlrP1hTOlGfIN-4zY','e92aQ6pdpJY2IX4jh60jT','flnjCaAzGgABGdbXUmS_A','maybe');
INSERT INTO "votes" VALUES('fXYA8MKr3K47JmrG5kMnY','MUvGFWtO3icYW5IdgOPJn','flnjCaAzGgABGdbXUmS_A','interested');
INSERT INTO "votes" VALUES('C4c_dtAuxAFf7KFhlS7V3','Vpg6ZhaYPDKmhWxXPYLAc','H4tNC6vRh_sZJql8AseGM','skip');
INSERT INTO "votes" VALUES('nTwTEtP7Um0xxU7IOKwwK','pcBQpLYqi6lwyq4k3cRlf','H4tNC6vRh_sZJql8AseGM','skip');
INSERT INTO "votes" VALUES('gMAuozHCEM6ycIG0MVF0h','cKVRSiTySX3u7sW__zB8F','H4tNC6vRh_sZJql8AseGM','skip');
INSERT INTO "votes" VALUES('Zfm_nf8eecAkDw7iqMtZy','ahpI-IgUdYsiDbGpk3eBM','H4tNC6vRh_sZJql8AseGM','interested');
INSERT INTO "votes" VALUES('dM7r_qjku4X_wPSgQL4Si','9CKo3jDMBsEUnomDnIznK','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('TO740Vud8ORDDGf9GBFtS','41wZdVcy5sb7bI7azXBfc','H4tNC6vRh_sZJql8AseGM','interested');
INSERT INTO "votes" VALUES('-n0nD3FPNTV4h-pncjfDu','sCO9dXVF6Wt77a4AXY1Mu','CssVX1HK8f7TH1kMpgsKD','maybe');
INSERT INTO "votes" VALUES('cyk15fxorJcmmys2fdsyD','cKVRSiTySX3u7sW__zB8F','CssVX1HK8f7TH1kMpgsKD','skip');
INSERT INTO "votes" VALUES('3LXHLdr2TnnQ5CqGZQhl-','ahpI-IgUdYsiDbGpk3eBM','CssVX1HK8f7TH1kMpgsKD','interested');
INSERT INTO "votes" VALUES('-2bmcd0ir64vmyXnznqoF','9CKo3jDMBsEUnomDnIznK','CssVX1HK8f7TH1kMpgsKD','interested');
INSERT INTO "votes" VALUES('wmEGZgfGJ8C6QSUi_NWeb','e92aQ6pdpJY2IX4jh60jT','DbLvx5jtFkYtoIyDVavJL','interested');
INSERT INTO "votes" VALUES('CTP2FIK69SwMUySxQfNyp','pcBQpLYqi6lwyq4k3cRlf','OLUkXAx3x9c9ZgT28xgoP','maybe');
INSERT INTO "votes" VALUES('fJ9Ro56takVkFJVNlfvEE','cKVRSiTySX3u7sW__zB8F','OLUkXAx3x9c9ZgT28xgoP','interested');
INSERT INTO "votes" VALUES('bF7sXG11e0Y_oEUpbv7gx','9CKo3jDMBsEUnomDnIznK','OLUkXAx3x9c9ZgT28xgoP','maybe');
INSERT INTO "votes" VALUES('UmC6fahMWwEaxHEfxL_qi','41wZdVcy5sb7bI7azXBfc','OLUkXAx3x9c9ZgT28xgoP','interested');
INSERT INTO "votes" VALUES('8wglBtGY5xv6CYypUxkcG','e92aQ6pdpJY2IX4jh60jT','OLUkXAx3x9c9ZgT28xgoP','maybe');
INSERT INTO "votes" VALUES('s8i11G0hCnUmQGlEuWaGd','MUvGFWtO3icYW5IdgOPJn','OLUkXAx3x9c9ZgT28xgoP','interested');
INSERT INTO "votes" VALUES('NZoETvv1c5HqyUyz1R-2e','sCO9dXVF6Wt77a4AXY1Mu','xHzguFgK5CrqWXPDcvEgd','skip');
INSERT INTO "votes" VALUES('9I6TSVAqWpGq3t8a2LzRi','cKVRSiTySX3u7sW__zB8F','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('ALrrOnQuimc0_LMGoWCNt','9CKo3jDMBsEUnomDnIznK','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('Yvgwc1PED-rUXGMnhhpcA','41wZdVcy5sb7bI7azXBfc','xHzguFgK5CrqWXPDcvEgd','maybe');
INSERT INTO "votes" VALUES('7BRwZN-Y6DqpoXKqIA0yW','SrSbVgHgvm1iIL__onaYs','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('E9Vr2WPwBzdiyy303FJpB','e92aQ6pdpJY2IX4jh60jT','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('wjlNw9BdIwIMVLJkW2CEf','pcBQpLYqi6lwyq4k3cRlf','V4S6hF2dncw5O3rC2tm3m','skip');
INSERT INTO "votes" VALUES('1HDXHKi6eWLTr235uuhQQ','sCO9dXVF6Wt77a4AXY1Mu','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('smW2jJmjE3CdCSqcUu28l','cKVRSiTySX3u7sW__zB8F','V4S6hF2dncw5O3rC2tm3m','skip');
INSERT INTO "votes" VALUES('d7RpuwQBUiHkYBzT3d14N','41wZdVcy5sb7bI7azXBfc','V4S6hF2dncw5O3rC2tm3m','maybe');
INSERT INTO "votes" VALUES('OXMR4VBC8rRD_cVU1jjNX','e92aQ6pdpJY2IX4jh60jT','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('XQrzZTNixOEDDxdxca5BA','MUvGFWtO3icYW5IdgOPJn','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('phmjdYRXHtJvMZ1hqMMyF','Vpg6ZhaYPDKmhWxXPYLAc','pkfGVZdfjsw1bzmeR9xrG','interested');
INSERT INTO "votes" VALUES('WZxD1Lb08ONERfivoPyza','pcBQpLYqi6lwyq4k3cRlf','pkfGVZdfjsw1bzmeR9xrG','interested');
INSERT INTO "votes" VALUES('lHKX6ieF4PswwwnvTskhM','SrSbVgHgvm1iIL__onaYs','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('QZ3hxciATeXGIDLE9OCi1','e92aQ6pdpJY2IX4jh60jT','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('yT6CI86GjtJtPrua1u-_9','Vpg6ZhaYPDKmhWxXPYLAc','hcgyLMhEySkieazQGLx2Z','interested');
INSERT INTO "votes" VALUES('Io3smecGdASiL7IVtziCl','pcBQpLYqi6lwyq4k3cRlf','hcgyLMhEySkieazQGLx2Z','interested');
INSERT INTO "votes" VALUES('Ynh32rjdNF1yJnRawLRha','sCO9dXVF6Wt77a4AXY1Mu','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('XT5OQgFby9yPgPgxe-BO7','9CKo3jDMBsEUnomDnIznK','hcgyLMhEySkieazQGLx2Z','maybe');
INSERT INTO "votes" VALUES('7-jJgc8bPfcTFvjuIdY51','e92aQ6pdpJY2IX4jh60jT','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('MDrxbmC46DKOdabUF_Liu','MUvGFWtO3icYW5IdgOPJn','hcgyLMhEySkieazQGLx2Z','interested');
INSERT INTO "votes" VALUES('sLmFX93UQyq3KJBHm2RHs','Vpg6ZhaYPDKmhWxXPYLAc','r3Rmp1dBG-jP4OoJvkAjs','maybe');
INSERT INTO "votes" VALUES('GqoBHTtlN4OkG2V3Lc7vf','9CKo3jDMBsEUnomDnIznK','r3Rmp1dBG-jP4OoJvkAjs','maybe');
INSERT INTO "votes" VALUES('ooziWEl7j33u4_Ls5yCEV','41wZdVcy5sb7bI7azXBfc','r3Rmp1dBG-jP4OoJvkAjs','interested');
INSERT INTO "votes" VALUES('BVmkY9qDGLfIjMPWwM9Rf','SrSbVgHgvm1iIL__onaYs','r3Rmp1dBG-jP4OoJvkAjs','interested');
INSERT INTO "votes" VALUES('6vDMXmrwTWRmsABPkCA1F','MUvGFWtO3icYW5IdgOPJn','r3Rmp1dBG-jP4OoJvkAjs','interested');
INSERT INTO "votes" VALUES('IpzKqGx6ZIBcuec0yl-4T','cKVRSiTySX3u7sW__zB8F','674LkKoaNetzVfAAXzKAy','skip');
INSERT INTO "votes" VALUES('QZWwissDmUMqoceeSZhp1','ahpI-IgUdYsiDbGpk3eBM','674LkKoaNetzVfAAXzKAy','interested');
INSERT INTO "votes" VALUES('je0ZUsL7bjqMFfOctnHbs','41wZdVcy5sb7bI7azXBfc','674LkKoaNetzVfAAXzKAy','maybe');
INSERT INTO "votes" VALUES('7qllGVSJIO05hHDAKN4QE','SrSbVgHgvm1iIL__onaYs','674LkKoaNetzVfAAXzKAy','maybe');
INSERT INTO "votes" VALUES('FG1rytGjyCkqrWNntz7Yh','Vpg6ZhaYPDKmhWxXPYLAc','FDey5RKF35qiOeLUbSdjS','maybe');
INSERT INTO "votes" VALUES('l3qXN6ZMOkjaSfGmAZgGk','41wZdVcy5sb7bI7azXBfc','FDey5RKF35qiOeLUbSdjS','interested');
INSERT INTO "votes" VALUES('FaadTBnWcTaPrORS7N6_G','e92aQ6pdpJY2IX4jh60jT','FDey5RKF35qiOeLUbSdjS','interested');
INSERT INTO "votes" VALUES('L8HU4O0L9jpNNT6OZFApj','MUvGFWtO3icYW5IdgOPJn','FDey5RKF35qiOeLUbSdjS','skip');
INSERT INTO "votes" VALUES('dbTn2GJJzIETwzfN2WF6W','Vpg6ZhaYPDKmhWxXPYLAc','SLeEQjx9QHnHky2x2L5Ke','interested');
INSERT INTO "votes" VALUES('BthLPojNdhMSNCkw3R1ln','sCO9dXVF6Wt77a4AXY1Mu','SLeEQjx9QHnHky2x2L5Ke','maybe');
INSERT INTO "votes" VALUES('yaou2sXakmlWLtFLMg3vx','9CKo3jDMBsEUnomDnIznK','SLeEQjx9QHnHky2x2L5Ke','interested');
INSERT INTO "votes" VALUES('XfKHPQYOSgobBQ3JzrRyc','MUvGFWtO3icYW5IdgOPJn','SLeEQjx9QHnHky2x2L5Ke','skip');
INSERT INTO "votes" VALUES('h1kk4YlEZTp7IKfdasxqd','9CKo3jDMBsEUnomDnIznK','-65kFmoP6lfo-KlVeZeEO','skip');
INSERT INTO "votes" VALUES('U5QcTY7Bw9JFcumT2okhv','e92aQ6pdpJY2IX4jh60jT','-65kFmoP6lfo-KlVeZeEO','interested');
INSERT INTO "votes" VALUES('qDLY5hJJIEzcMnw5S85_d','MUvGFWtO3icYW5IdgOPJn','-65kFmoP6lfo-KlVeZeEO','maybe');
INSERT INTO "votes" VALUES('IRoHWTAh8yrl7zwxmbKE2','Vpg6ZhaYPDKmhWxXPYLAc','oDkSLPMVj0inCmYQgdiCm','maybe');
INSERT INTO "votes" VALUES('1KmG2h3BN_uYIe4LwLtWU','pcBQpLYqi6lwyq4k3cRlf','oDkSLPMVj0inCmYQgdiCm','interested');
INSERT INTO "votes" VALUES('LYtP2XvHHx4Jys86_V9SM','9CKo3jDMBsEUnomDnIznK','oDkSLPMVj0inCmYQgdiCm','interested');
INSERT INTO "votes" VALUES('n11rMvXywkS0bdrBHe1BL','41wZdVcy5sb7bI7azXBfc','oDkSLPMVj0inCmYQgdiCm','interested');
INSERT INTO "votes" VALUES('I1C0uA8uOvKLg-Rbap-Or','SrSbVgHgvm1iIL__onaYs','oDkSLPMVj0inCmYQgdiCm','interested');
INSERT INTO "votes" VALUES('O_gZbx5kVsuzYLymZ0K6i','e92aQ6pdpJY2IX4jh60jT','oDkSLPMVj0inCmYQgdiCm','maybe');
INSERT INTO "votes" VALUES('rcm-j0lQmZPJOp1f_8ZcO','Vpg6ZhaYPDKmhWxXPYLAc','31Q8fVuFLR2l7YJLOvCuh','maybe');
INSERT INTO "votes" VALUES('sTTxcVTNvlzuE-NxjC_pZ','sCO9dXVF6Wt77a4AXY1Mu','31Q8fVuFLR2l7YJLOvCuh','skip');
INSERT INTO "votes" VALUES('7PoX2hcWHR-CfYJuoyXDb','MUvGFWtO3icYW5IdgOPJn','31Q8fVuFLR2l7YJLOvCuh','maybe');
INSERT INTO "votes" VALUES('VxKiDJIsCcLFXhdcrBoMa','pcBQpLYqi6lwyq4k3cRlf','xuKuS8oJmLcOIYVEzn6xY','maybe');
INSERT INTO "votes" VALUES('jHC1zGdBFHZ-qW4JDQAMp','9CKo3jDMBsEUnomDnIznK','xuKuS8oJmLcOIYVEzn6xY','interested');
INSERT INTO "votes" VALUES('Al97bNA8Hmyqe-AAABnUy','SrSbVgHgvm1iIL__onaYs','xuKuS8oJmLcOIYVEzn6xY','skip');
INSERT INTO "votes" VALUES('4Xz9VP_wgFfVbp_mIkO6Z','Vpg6ZhaYPDKmhWxXPYLAc','U0ekKLQccH73YGKwlY3Z9','interested');
INSERT INTO "votes" VALUES('lS3jxI9uAFz-NaUpY3Wya','cKVRSiTySX3u7sW__zB8F','U0ekKLQccH73YGKwlY3Z9','skip');
INSERT INTO "votes" VALUES('0ZnDki7fVUtnlHjek6U4U','41wZdVcy5sb7bI7azXBfc','U0ekKLQccH73YGKwlY3Z9','interested');
INSERT INTO "votes" VALUES('WbGD__8EbQSJCBUjxIDoV','Vpg6ZhaYPDKmhWxXPYLAc','-tcf2SnCejINfQv6PwadN','maybe');
INSERT INTO "votes" VALUES('U6o10SfOWLFIADO2tQw3o','sCO9dXVF6Wt77a4AXY1Mu','-tcf2SnCejINfQv6PwadN','interested');
INSERT INTO "votes" VALUES('u-kQ4kyPMwSqERsG0YPi5','SrSbVgHgvm1iIL__onaYs','-tcf2SnCejINfQv6PwadN','maybe');
INSERT INTO "votes" VALUES('ctuUlZee9A3FpWfzTltlz','e92aQ6pdpJY2IX4jh60jT','-tcf2SnCejINfQv6PwadN','maybe');
INSERT INTO "votes" VALUES('vZfcpk-tWpui18tZsrCh_','MUvGFWtO3icYW5IdgOPJn','-tcf2SnCejINfQv6PwadN','maybe');
INSERT INTO "votes" VALUES('LaIeFcipB0xxzdg4xeM2M','Vpg6ZhaYPDKmhWxXPYLAc','Esx6Buu8Om0CsYBLdMcs8','maybe');
INSERT INTO "votes" VALUES('JfHud5q2h4MESeCjgQSwW','sCO9dXVF6Wt77a4AXY1Mu','Esx6Buu8Om0CsYBLdMcs8','interested');
INSERT INTO "votes" VALUES('0-0sMMkTpTcqkxA8x9ORz','41wZdVcy5sb7bI7azXBfc','Esx6Buu8Om0CsYBLdMcs8','interested');
INSERT INTO "votes" VALUES('tEIVTY2XlC0oxRrSvneVO','Vpg6ZhaYPDKmhWxXPYLAc','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('o0NdwsvYv0MuzGkjolWsC','sCO9dXVF6Wt77a4AXY1Mu','V5m-Y-E_xLRukf07jfSYs','maybe');
INSERT INTO "votes" VALUES('qGMgAhNatDPV3H79TyJIM','cKVRSiTySX3u7sW__zB8F','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('87bBO2XQF-bxXlLkpY9YM','9CKo3jDMBsEUnomDnIznK','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('D6kPmdxZ4usguf92Ni9kx','Vpg6ZhaYPDKmhWxXPYLAc','DmIi0t0oVlnKcRPwLyE86','interested');
INSERT INTO "votes" VALUES('NNeCWH0L2mO1BYHmV3Bpt','41wZdVcy5sb7bI7azXBfc','DmIi0t0oVlnKcRPwLyE86','maybe');
INSERT INTO "votes" VALUES('u5iTpMxaZPN8pHQssBPK0','MUvGFWtO3icYW5IdgOPJn','DmIi0t0oVlnKcRPwLyE86','maybe');
INSERT INTO "votes" VALUES('VE-W1cFGiqPzXvpE8DoK2','Vpg6ZhaYPDKmhWxXPYLAc','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('63wcoatAMDh4zemZraNsD','pcBQpLYqi6lwyq4k3cRlf','k-Yv0skkPvBEXp12fkWrP','skip');
INSERT INTO "votes" VALUES('VYi-dCrzjK9LtDmcRBvvA','ahpI-IgUdYsiDbGpk3eBM','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('mTgchDl0m-YkqUpFsePI-','9CKo3jDMBsEUnomDnIznK','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('oa-wm1dAEFYduCvc8mhwV','SrSbVgHgvm1iIL__onaYs','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('EXfulAlMCP7HEG259mbKY','e92aQ6pdpJY2IX4jh60jT','k-Yv0skkPvBEXp12fkWrP','maybe');
INSERT INTO "votes" VALUES('OqXOKa8W_6r6hqajOpUly','ahpI-IgUdYsiDbGpk3eBM','wARkFhrSpExOGjLORuuuc','interested');
INSERT INTO "votes" VALUES('NDGqwo5-kjHw6pi3npqwf','Vpg6ZhaYPDKmhWxXPYLAc','AOStw-UrlZUwRBR3NE9Xe','skip');
INSERT INTO "votes" VALUES('M_dLN3t9tMfU8Z540HBUM','pcBQpLYqi6lwyq4k3cRlf','AOStw-UrlZUwRBR3NE9Xe','interested');
INSERT INTO "votes" VALUES('QFpQmO3TSFvGaRzdLxvZj','SrSbVgHgvm1iIL__onaYs','AOStw-UrlZUwRBR3NE9Xe','skip');
INSERT INTO "votes" VALUES('a1T_7mYYS-urSD8aoJVK7','e92aQ6pdpJY2IX4jh60jT','AOStw-UrlZUwRBR3NE9Xe','maybe');
INSERT INTO "votes" VALUES('f-G3qEuz_jWLsZCBez8zp','9CKo3jDMBsEUnomDnIznK','4RJcYaJoa4zaJcVVGF6GK','interested');
INSERT INTO "votes" VALUES('N2Q6YYHv1ypo3XnOEYo8L','SrSbVgHgvm1iIL__onaYs','4RJcYaJoa4zaJcVVGF6GK','interested');
INSERT INTO "votes" VALUES('p1j35BHRa1Jp59AEUOKXy','Vpg6ZhaYPDKmhWxXPYLAc','l8nd_mSHbfeLStgkxyCI0','maybe');
INSERT INTO "votes" VALUES('MmkeVwG3vajBIICLpOWYu','cKVRSiTySX3u7sW__zB8F','l8nd_mSHbfeLStgkxyCI0','interested');
INSERT INTO "votes" VALUES('0EY71qjPmrRcDK7jKuch7','ahpI-IgUdYsiDbGpk3eBM','l8nd_mSHbfeLStgkxyCI0','interested');
INSERT INTO "votes" VALUES('mqNTp9_w-AMqUnT8NaULq','9CKo3jDMBsEUnomDnIznK','l8nd_mSHbfeLStgkxyCI0','interested');
INSERT INTO "votes" VALUES('WhZdxmnAZnG8o1Fc4nqBN','SrSbVgHgvm1iIL__onaYs','l8nd_mSHbfeLStgkxyCI0','interested');
INSERT INTO "votes" VALUES('2JD_Z3NxZbJiOSiltM7D4','e92aQ6pdpJY2IX4jh60jT','l8nd_mSHbfeLStgkxyCI0','maybe');
INSERT INTO "votes" VALUES('zzt71htuLwqt_NWKBW346','cKVRSiTySX3u7sW__zB8F','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('Wr2WOlDeUXi-wGgd34jNK','41wZdVcy5sb7bI7azXBfc','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('LoLaWTpo5VVaegoy3WHY0','sCO9dXVF6Wt77a4AXY1Mu','xx_5Kpc1K-V3HMp05lrOa','maybe');
INSERT INTO "votes" VALUES('G_H2KM1mJw-I_UtwOFQv8','cKVRSiTySX3u7sW__zB8F','xx_5Kpc1K-V3HMp05lrOa','interested');
INSERT INTO "votes" VALUES('9Cat6NY5_du17x50qTT2r','ahpI-IgUdYsiDbGpk3eBM','xx_5Kpc1K-V3HMp05lrOa','maybe');
INSERT INTO "votes" VALUES('jo5F43G7vS00nLSmu6FW3','MUvGFWtO3icYW5IdgOPJn','xx_5Kpc1K-V3HMp05lrOa','skip');
INSERT INTO "votes" VALUES('51mxh4iBTxl3ZW60_U3n3','Vpg6ZhaYPDKmhWxXPYLAc','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('RflOAUs_2c7CpP9q4MQo0','pcBQpLYqi6lwyq4k3cRlf','wMhAFVhmAIfmIfYP_W5bK','maybe');
INSERT INTO "votes" VALUES('GpkTVo6fD1IhJ-qQiNOA5','sCO9dXVF6Wt77a4AXY1Mu','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('gWRI9QJgclmX3ZWL0OXKx','ahpI-IgUdYsiDbGpk3eBM','wMhAFVhmAIfmIfYP_W5bK','maybe');
INSERT INTO "votes" VALUES('wXfGnw20T2gkPas1X2d0H','9CKo3jDMBsEUnomDnIznK','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('jwtzDq9TrNvp4bgNeRYEW','SrSbVgHgvm1iIL__onaYs','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('6_m2etSo8s_PkBUP3wvyX','MUvGFWtO3icYW5IdgOPJn','wMhAFVhmAIfmIfYP_W5bK','maybe');
INSERT INTO "votes" VALUES('jui-9kkBxXGoZYDIVQySl','3iEcnbIuv8X3nuEw6m2WO','5HzaeQPX_Q5AS9Ry7-g0P','maybe');
INSERT INTO "votes" VALUES('ZFg-9w28lLJudgNAzzbxp','oeyrbWuhRm67d1ROMHr-s','5HzaeQPX_Q5AS9Ry7-g0P','skip');
INSERT INTO "votes" VALUES('5sinzRFFSzHcz2VISci0V','XuJxE6oPDJrYMViQOCD7h','5HzaeQPX_Q5AS9Ry7-g0P','skip');
INSERT INTO "votes" VALUES('BU6RPm-pBTrS6GS8YQB4Q','ShYyAkqjhtH0YaWi4pUK-','5HzaeQPX_Q5AS9Ry7-g0P','maybe');
INSERT INTO "votes" VALUES('QBigof9qbHoIPoi8HDlIY','cHFyyROyBpF-0ZF3wnduD','5HzaeQPX_Q5AS9Ry7-g0P','skip');
INSERT INTO "votes" VALUES('Ksb79X8fMO4N3s6za7pl7','R4LAGueDEWg_tN0aCGhd4','5HzaeQPX_Q5AS9Ry7-g0P','interested');
INSERT INTO "votes" VALUES('iPGrfHhE9gVZbctKvX5Uk','l4nP8oBfyc7riyJj7-3Bp','5cKMVI_IB7JVQbrFSlRXS','interested');
INSERT INTO "votes" VALUES('FU9ktCkf0aI_3wkmdInTG','pnfYCUiaFmlcXoSyh5Gz7','5cKMVI_IB7JVQbrFSlRXS','skip');
INSERT INTO "votes" VALUES('8dKjXe17WSdwRk2zSjG2q','XuJxE6oPDJrYMViQOCD7h','5cKMVI_IB7JVQbrFSlRXS','skip');
INSERT INTO "votes" VALUES('jG3JjkoHQbMQH6yK2i1V7','nX7dFDh2YFh-aZFKWpL7n','5cKMVI_IB7JVQbrFSlRXS','skip');
INSERT INTO "votes" VALUES('8Cs2MsZU2ll5NVg3sZ42B','cHFyyROyBpF-0ZF3wnduD','5cKMVI_IB7JVQbrFSlRXS','skip');
INSERT INTO "votes" VALUES('RZJ4mpEMlJsBBN0vh6aPw','H11sL2hdWU-rWrcOeqpXu','5cKMVI_IB7JVQbrFSlRXS','interested');
INSERT INTO "votes" VALUES('E-SJFlqcdpcXb2mpYAV3l','pnfYCUiaFmlcXoSyh5Gz7','wdKiGvZYAwLisZE1i26oD','skip');
INSERT INTO "votes" VALUES('x1uG8VPKFfsDQLpBb_FMN','LxAb99FugSw6xy6AcH107','wdKiGvZYAwLisZE1i26oD','maybe');
INSERT INTO "votes" VALUES('AiC2X5fpGm_c08yPoCg33','xSWsbk5rnqCy8uUGTFiJl','wdKiGvZYAwLisZE1i26oD','maybe');
INSERT INTO "votes" VALUES('i1OTYg_JUu5aGrfUB3EKD','R4LAGueDEWg_tN0aCGhd4','wdKiGvZYAwLisZE1i26oD','interested');
INSERT INTO "votes" VALUES('N8fn95BZOshZj58GWknrI','l4nP8oBfyc7riyJj7-3Bp','HsO7ub1xzup1hjMSfDh6N','interested');
INSERT INTO "votes" VALUES('gaMLRiJibxug3RjMzHMDH','pnfYCUiaFmlcXoSyh5Gz7','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('3gWYdVPnIo9kCa4M_fnoS','XuJxE6oPDJrYMViQOCD7h','HsO7ub1xzup1hjMSfDh6N','maybe');
INSERT INTO "votes" VALUES('2-zUkxafaosrEpju7Q7pG','LxAb99FugSw6xy6AcH107','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('jaPM2d5-86nbQlIkE1WxY','nX7dFDh2YFh-aZFKWpL7n','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('33jliGe8oYS8LyDm_UYUm','H11sL2hdWU-rWrcOeqpXu','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('rxNef5WgKQKZfTGwh67B3','R4LAGueDEWg_tN0aCGhd4','HsO7ub1xzup1hjMSfDh6N','skip');
INSERT INTO "votes" VALUES('f_Moj5R-Nw52LkiiCh5Ij','v_gQTXZmIeX8dKnbYFKMG','HsO7ub1xzup1hjMSfDh6N','interested');
INSERT INTO "votes" VALUES('L5qEzM97K2wyelBvIPuyp','3iEcnbIuv8X3nuEw6m2WO','HGSmRiy3lXrgW5OIe3psV','interested');
INSERT INTO "votes" VALUES('yl9NGBo-X78THkPyGjoVM','oeyrbWuhRm67d1ROMHr-s','HGSmRiy3lXrgW5OIe3psV','interested');
INSERT INTO "votes" VALUES('iixc2KlZ_KXB89kEODsv8','aEv80tPELm6Lkrm40Eo4n','HGSmRiy3lXrgW5OIe3psV','maybe');
INSERT INTO "votes" VALUES('AomGEfhyEzL13554nlNBP','QVSYDsPsHDhVMkRKnsdAu','HGSmRiy3lXrgW5OIe3psV','maybe');
INSERT INTO "votes" VALUES('yoLnWeQgfaOZzAxW0Zs3X','ShYyAkqjhtH0YaWi4pUK-','HGSmRiy3lXrgW5OIe3psV','interested');
INSERT INTO "votes" VALUES('9TDMpkf8eEBA4TDIGStVv','H11sL2hdWU-rWrcOeqpXu','HGSmRiy3lXrgW5OIe3psV','maybe');
INSERT INTO "votes" VALUES('GyM3HgoU-_cwTKM1M_tW9','l4nP8oBfyc7riyJj7-3Bp','3eDfavLHK-w8UFQStbNe9','interested');
INSERT INTO "votes" VALUES('y1FHJs2sW5969MutyxL_q','aEv80tPELm6Lkrm40Eo4n','3eDfavLHK-w8UFQStbNe9','maybe');
INSERT INTO "votes" VALUES('zgnZylkbTlonflt03RBGU','LxAb99FugSw6xy6AcH107','3eDfavLHK-w8UFQStbNe9','maybe');
INSERT INTO "votes" VALUES('S_NdBPlkcp6MVsz55LzH-','H11sL2hdWU-rWrcOeqpXu','3eDfavLHK-w8UFQStbNe9','interested');
INSERT INTO "votes" VALUES('53ViM-ME7_e-ycSeq4xyF','pnfYCUiaFmlcXoSyh5Gz7','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('Xsz3nclr_fJFuIyksC-UM','aEv80tPELm6Lkrm40Eo4n','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('sBStmk-Eajd9niYTnSddW','cHFyyROyBpF-0ZF3wnduD','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('8Md1P7slgih896LZiLzdu','H11sL2hdWU-rWrcOeqpXu','56i1PPNObDW-PmygSTEc8','maybe');
INSERT INTO "votes" VALUES('4aNlYa-9n3xRjblHIQhyH','R4LAGueDEWg_tN0aCGhd4','56i1PPNObDW-PmygSTEc8','skip');
INSERT INTO "votes" VALUES('BlRIrogxM0G46a8mJDbQe','v_gQTXZmIeX8dKnbYFKMG','56i1PPNObDW-PmygSTEc8','interested');
INSERT INTO "votes" VALUES('aq7ivVycuiQWuTEKQbFkK','l4nP8oBfyc7riyJj7-3Bp','ZKfmZvoeuQu0Vl20KYByx','skip');
INSERT INTO "votes" VALUES('Wm2z9nRfGuO1U9w0yDed8','LxAb99FugSw6xy6AcH107','ZKfmZvoeuQu0Vl20KYByx','maybe');
INSERT INTO "votes" VALUES('XegcTrIIyf3DOHwBUXRVg','QVSYDsPsHDhVMkRKnsdAu','ZKfmZvoeuQu0Vl20KYByx','maybe');
INSERT INTO "votes" VALUES('5Uz6ezhvurMtfzso6ARf6','xSWsbk5rnqCy8uUGTFiJl','ZKfmZvoeuQu0Vl20KYByx','skip');
INSERT INTO "votes" VALUES('bd6xDKkkDNblW1DpYSLkj','H11sL2hdWU-rWrcOeqpXu','ZKfmZvoeuQu0Vl20KYByx','interested');
INSERT INTO "votes" VALUES('Op6EpYoyyXX2rIjb9Bmvp','l4nP8oBfyc7riyJj7-3Bp','bpf8-yo3LlYc1Vp9iNFl0','interested');
INSERT INTO "votes" VALUES('ya1mxqfvGnQLBEso5I30w','3iEcnbIuv8X3nuEw6m2WO','bpf8-yo3LlYc1Vp9iNFl0','maybe');
INSERT INTO "votes" VALUES('qoOWGaIOqTiPdkYfFtyfR','XuJxE6oPDJrYMViQOCD7h','bpf8-yo3LlYc1Vp9iNFl0','maybe');
INSERT INTO "votes" VALUES('E6ucbEXpXhFIVVGmijHwa','QVSYDsPsHDhVMkRKnsdAu','bpf8-yo3LlYc1Vp9iNFl0','interested');
INSERT INTO "votes" VALUES('XfvvBluw7YHRsDKgGIJG3','R4LAGueDEWg_tN0aCGhd4','bpf8-yo3LlYc1Vp9iNFl0','maybe');
INSERT INTO "votes" VALUES('X4waNVSl-4dP0vWiUcHuX','3iEcnbIuv8X3nuEw6m2WO','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('KoRWoDULPne4fPqkc9EN-','oeyrbWuhRm67d1ROMHr-s','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('HzQxSQrZzS04Lcjv-eKz2','pnfYCUiaFmlcXoSyh5Gz7','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('JAc2Kvqbu1RnOuqnw8-Az','XuJxE6oPDJrYMViQOCD7h','cjc_whiGjsvXFd3c69Kad','maybe');
INSERT INTO "votes" VALUES('LP-lYn9Kh2xaFe_Savmmd','QVSYDsPsHDhVMkRKnsdAu','cjc_whiGjsvXFd3c69Kad','skip');
INSERT INTO "votes" VALUES('M81X0iWfS82ZJFJugft18','cHFyyROyBpF-0ZF3wnduD','cjc_whiGjsvXFd3c69Kad','interested');
INSERT INTO "votes" VALUES('PFRdctfFsB7GVDQL7HJJ_','H11sL2hdWU-rWrcOeqpXu','cjc_whiGjsvXFd3c69Kad','maybe');
INSERT INTO "votes" VALUES('jxC4kxj14HgPWcLrdzZe6','v_gQTXZmIeX8dKnbYFKMG','cjc_whiGjsvXFd3c69Kad','maybe');
INSERT INTO "votes" VALUES('h85xf8IBYQa1hwPKDNlA4','3iEcnbIuv8X3nuEw6m2WO','flnjCaAzGgABGdbXUmS_A','maybe');
INSERT INTO "votes" VALUES('0q9XBYY5IX_rkOt5unnqk','nX7dFDh2YFh-aZFKWpL7n','flnjCaAzGgABGdbXUmS_A','skip');
INSERT INTO "votes" VALUES('fU5g00m3NxQpvdNTROYkf','xSWsbk5rnqCy8uUGTFiJl','flnjCaAzGgABGdbXUmS_A','maybe');
INSERT INTO "votes" VALUES('ytaHvpkrf2FdZnh4H1iYF','H11sL2hdWU-rWrcOeqpXu','flnjCaAzGgABGdbXUmS_A','interested');
INSERT INTO "votes" VALUES('PJ94Znf0rgCSNtcQEUbra','R4LAGueDEWg_tN0aCGhd4','flnjCaAzGgABGdbXUmS_A','interested');
INSERT INTO "votes" VALUES('My8rgnTvUYTUM-mQpwVbH','v_gQTXZmIeX8dKnbYFKMG','flnjCaAzGgABGdbXUmS_A','interested');
INSERT INTO "votes" VALUES('qUdzazGEsBN4u37HWLbq7','l4nP8oBfyc7riyJj7-3Bp','H4tNC6vRh_sZJql8AseGM','interested');
INSERT INTO "votes" VALUES('iKKW6JF7CzdbFDVu0w-Vd','pnfYCUiaFmlcXoSyh5Gz7','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('FxbeBVwpMfntHrwtcQKPW','XuJxE6oPDJrYMViQOCD7h','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('CUJ2jbOGIvMsSF7Y-JXEY','QVSYDsPsHDhVMkRKnsdAu','H4tNC6vRh_sZJql8AseGM','interested');
INSERT INTO "votes" VALUES('c_ceyou-qCXigA2sp10-n','ShYyAkqjhtH0YaWi4pUK-','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('C59KaWbOh2xCxUxsBv7Yo','nX7dFDh2YFh-aZFKWpL7n','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('BCj-83DMirS2aSDW8iVF-','cHFyyROyBpF-0ZF3wnduD','H4tNC6vRh_sZJql8AseGM','interested');
INSERT INTO "votes" VALUES('6NuMVxh5JivmVkP_tFQ7C','H11sL2hdWU-rWrcOeqpXu','H4tNC6vRh_sZJql8AseGM','maybe');
INSERT INTO "votes" VALUES('596QvRJthx5tNDUIHlCfc','3iEcnbIuv8X3nuEw6m2WO','CssVX1HK8f7TH1kMpgsKD','maybe');
INSERT INTO "votes" VALUES('JRdTsramcykPSXhaM6g7d','ShYyAkqjhtH0YaWi4pUK-','CssVX1HK8f7TH1kMpgsKD','maybe');
INSERT INTO "votes" VALUES('68m1lcUjzMJ3Mxls2yJjy','3iEcnbIuv8X3nuEw6m2WO','DbLvx5jtFkYtoIyDVavJL','maybe');
INSERT INTO "votes" VALUES('rUAtdtS-_XwrupC1aOAQJ','pnfYCUiaFmlcXoSyh5Gz7','DbLvx5jtFkYtoIyDVavJL','maybe');
INSERT INTO "votes" VALUES('JYWnjhDu7YEfQqBCGrgVI','XuJxE6oPDJrYMViQOCD7h','DbLvx5jtFkYtoIyDVavJL','skip');
INSERT INTO "votes" VALUES('XPmYSGfIVrT6KGDHsRoeG','QVSYDsPsHDhVMkRKnsdAu','DbLvx5jtFkYtoIyDVavJL','interested');
INSERT INTO "votes" VALUES('wgSLMfx1BBs5WR5HDV7j_','ShYyAkqjhtH0YaWi4pUK-','DbLvx5jtFkYtoIyDVavJL','interested');
INSERT INTO "votes" VALUES('sngUUkwWUm1kSgyKjlblw','nX7dFDh2YFh-aZFKWpL7n','DbLvx5jtFkYtoIyDVavJL','skip');
INSERT INTO "votes" VALUES('Q3naqCzcgBkBfiTGSJ0iB','cHFyyROyBpF-0ZF3wnduD','DbLvx5jtFkYtoIyDVavJL','skip');
INSERT INTO "votes" VALUES('b0zwX_n4D4P47hxYxqqkm','H11sL2hdWU-rWrcOeqpXu','DbLvx5jtFkYtoIyDVavJL','interested');
INSERT INTO "votes" VALUES('qWaxLcbHhDH8ZMTuFUoLP','v_gQTXZmIeX8dKnbYFKMG','DbLvx5jtFkYtoIyDVavJL','interested');
INSERT INTO "votes" VALUES('JjmyI8AlpBP0NN8h5o0mz','pnfYCUiaFmlcXoSyh5Gz7','OLUkXAx3x9c9ZgT28xgoP','interested');
INSERT INTO "votes" VALUES('Wg25feQq34BmO8YK_XEWF','v_gQTXZmIeX8dKnbYFKMG','OLUkXAx3x9c9ZgT28xgoP','maybe');
INSERT INTO "votes" VALUES('sqaNrSZ6Ql4Ov5eKmMSUv','aEv80tPELm6Lkrm40Eo4n','xHzguFgK5CrqWXPDcvEgd','skip');
INSERT INTO "votes" VALUES('3CFtWwzPd4New2otWV_HO','nX7dFDh2YFh-aZFKWpL7n','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('1UrT69_GfUKEG-jGp9yE3','cHFyyROyBpF-0ZF3wnduD','xHzguFgK5CrqWXPDcvEgd','interested');
INSERT INTO "votes" VALUES('xlBZEgafpzsT_9_G2hFbW','R4LAGueDEWg_tN0aCGhd4','xHzguFgK5CrqWXPDcvEgd','maybe');
INSERT INTO "votes" VALUES('V747hZdRkS91O5p2g6PR1','oeyrbWuhRm67d1ROMHr-s','V4S6hF2dncw5O3rC2tm3m','maybe');
INSERT INTO "votes" VALUES('Mhg4LtMjctNjJ7lEdSJSp','aEv80tPELm6Lkrm40Eo4n','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('G5qmESsHUONJOTHnp_4IM','XuJxE6oPDJrYMViQOCD7h','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('ewhr1T_Q97zrl5TT99Xym','QVSYDsPsHDhVMkRKnsdAu','V4S6hF2dncw5O3rC2tm3m','skip');
INSERT INTO "votes" VALUES('Ak4uF70HkHTAsi2lDSjH6','ShYyAkqjhtH0YaWi4pUK-','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('u-V3KxkZkXniAa3g2EIb6','nX7dFDh2YFh-aZFKWpL7n','V4S6hF2dncw5O3rC2tm3m','interested');
INSERT INTO "votes" VALUES('SM-qQ0FBFYPdVcgxNf2_M','cHFyyROyBpF-0ZF3wnduD','V4S6hF2dncw5O3rC2tm3m','skip');
INSERT INTO "votes" VALUES('FjW_rbEekUv4oXNNpJxpE','v_gQTXZmIeX8dKnbYFKMG','V4S6hF2dncw5O3rC2tm3m','skip');
INSERT INTO "votes" VALUES('xWI8wIE7UzWdbMLXdg33i','l4nP8oBfyc7riyJj7-3Bp','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('YKFLsbIptGmgOaZaX_9Xm','XuJxE6oPDJrYMViQOCD7h','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('nxs3bftHylsEislgcOj9A','QVSYDsPsHDhVMkRKnsdAu','pkfGVZdfjsw1bzmeR9xrG','interested');
INSERT INTO "votes" VALUES('kieZrgTOdMUQ8zXpeVdKt','ShYyAkqjhtH0YaWi4pUK-','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('TQj3QRaB6CKRbgu871xPz','nX7dFDh2YFh-aZFKWpL7n','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('Fk0fgZmiHhIMOuP4i9Kxs','cHFyyROyBpF-0ZF3wnduD','pkfGVZdfjsw1bzmeR9xrG','skip');
INSERT INTO "votes" VALUES('n4eo3T9IoSQcai_NUj4YM','xSWsbk5rnqCy8uUGTFiJl','pkfGVZdfjsw1bzmeR9xrG','maybe');
INSERT INTO "votes" VALUES('7UaUE9JXCiydAMq1ZMy8q','3iEcnbIuv8X3nuEw6m2WO','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('lrDI2HSxb9qaOj4HWM3Rz','pnfYCUiaFmlcXoSyh5Gz7','hcgyLMhEySkieazQGLx2Z','maybe');
INSERT INTO "votes" VALUES('2ihLYTfEnIg1heXyLgt8x','LxAb99FugSw6xy6AcH107','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('vKkU60PprZwtp_51zDDt8','QVSYDsPsHDhVMkRKnsdAu','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('CzBechWHDpW_b9WDUssbX','cHFyyROyBpF-0ZF3wnduD','hcgyLMhEySkieazQGLx2Z','interested');
INSERT INTO "votes" VALUES('JS4HUtX3bFQX3VScfggdI','xSWsbk5rnqCy8uUGTFiJl','hcgyLMhEySkieazQGLx2Z','interested');
INSERT INTO "votes" VALUES('pTFTUcieu--Fd4qzdgRDi','v_gQTXZmIeX8dKnbYFKMG','hcgyLMhEySkieazQGLx2Z','skip');
INSERT INTO "votes" VALUES('pEpQgnKs8vCUn6H0qxB80','aEv80tPELm6Lkrm40Eo4n','r3Rmp1dBG-jP4OoJvkAjs','maybe');
INSERT INTO "votes" VALUES('UXeWzbd7DABgx0awzG-u1','LxAb99FugSw6xy6AcH107','r3Rmp1dBG-jP4OoJvkAjs','maybe');
INSERT INTO "votes" VALUES('dI9kg0Dgl7MmA97GVlinW','QVSYDsPsHDhVMkRKnsdAu','r3Rmp1dBG-jP4OoJvkAjs','skip');
INSERT INTO "votes" VALUES('ek6TzCRjMvAh-S_gabNJ2','cHFyyROyBpF-0ZF3wnduD','r3Rmp1dBG-jP4OoJvkAjs','interested');
INSERT INTO "votes" VALUES('aIGfEP7qAlM99C1lpRGnW','xSWsbk5rnqCy8uUGTFiJl','r3Rmp1dBG-jP4OoJvkAjs','interested');
INSERT INTO "votes" VALUES('mMSJx6xsYzLmsoMpKoQWh','oeyrbWuhRm67d1ROMHr-s','674LkKoaNetzVfAAXzKAy','maybe');
INSERT INTO "votes" VALUES('c3na9nfD2IP4ryURrJZul','R4LAGueDEWg_tN0aCGhd4','674LkKoaNetzVfAAXzKAy','interested');
INSERT INTO "votes" VALUES('-PeQMIraw-KcQ0nkHVzIp','v_gQTXZmIeX8dKnbYFKMG','674LkKoaNetzVfAAXzKAy','interested');
INSERT INTO "votes" VALUES('9jOphSP1e_RzOJkkW8SqS','pnfYCUiaFmlcXoSyh5Gz7','FDey5RKF35qiOeLUbSdjS','maybe');
INSERT INTO "votes" VALUES('q49N8hYcufU3UH2P7y9Nj','QVSYDsPsHDhVMkRKnsdAu','FDey5RKF35qiOeLUbSdjS','interested');
INSERT INTO "votes" VALUES('uxM1HzSe5Py8jUdrwEAC3','pnfYCUiaFmlcXoSyh5Gz7','SLeEQjx9QHnHky2x2L5Ke','maybe');
INSERT INTO "votes" VALUES('MtEohswDm4qOBz1zt_OMV','aEv80tPELm6Lkrm40Eo4n','SLeEQjx9QHnHky2x2L5Ke','interested');
INSERT INTO "votes" VALUES('-JAlxBaF4xglgVACPXydj','ShYyAkqjhtH0YaWi4pUK-','SLeEQjx9QHnHky2x2L5Ke','interested');
INSERT INTO "votes" VALUES('a9f1mNOXEu4yLPIu0zXRJ','nX7dFDh2YFh-aZFKWpL7n','SLeEQjx9QHnHky2x2L5Ke','skip');
INSERT INTO "votes" VALUES('hBXY66xV57X8WQ8vXyjcQ','cHFyyROyBpF-0ZF3wnduD','SLeEQjx9QHnHky2x2L5Ke','skip');
INSERT INTO "votes" VALUES('vAspkOkuDHwqL_Oxk-52k','3iEcnbIuv8X3nuEw6m2WO','-65kFmoP6lfo-KlVeZeEO','interested');
INSERT INTO "votes" VALUES('Csn8aHiHR4Frh8XhxyYGm','aEv80tPELm6Lkrm40Eo4n','-65kFmoP6lfo-KlVeZeEO','maybe');
INSERT INTO "votes" VALUES('CPx2B4l2073bhGTJu12jN','XuJxE6oPDJrYMViQOCD7h','-65kFmoP6lfo-KlVeZeEO','interested');
INSERT INTO "votes" VALUES('MqA5AYzjUc-fOrYL85m5-','R4LAGueDEWg_tN0aCGhd4','-65kFmoP6lfo-KlVeZeEO','interested');
INSERT INTO "votes" VALUES('_LfeZZocZ6aVFYTEsfV19','l4nP8oBfyc7riyJj7-3Bp','oDkSLPMVj0inCmYQgdiCm','skip');
INSERT INTO "votes" VALUES('z0s7SVR8arKCnOaJXi9ZX','aEv80tPELm6Lkrm40Eo4n','oDkSLPMVj0inCmYQgdiCm','skip');
INSERT INTO "votes" VALUES('DUvwfhmx24OblmS1Zzjy0','XuJxE6oPDJrYMViQOCD7h','oDkSLPMVj0inCmYQgdiCm','maybe');
INSERT INTO "votes" VALUES('RIJbdI-8izq1G5YWUcrOh','nX7dFDh2YFh-aZFKWpL7n','oDkSLPMVj0inCmYQgdiCm','skip');
INSERT INTO "votes" VALUES('kVNSXSdkYWlLEG6xJD2HA','xSWsbk5rnqCy8uUGTFiJl','oDkSLPMVj0inCmYQgdiCm','interested');
INSERT INTO "votes" VALUES('TVv-_b15MVLBt-CW_2SyN','l4nP8oBfyc7riyJj7-3Bp','31Q8fVuFLR2l7YJLOvCuh','skip');
INSERT INTO "votes" VALUES('19vsnw16S8lDOYPkP6Uxq','oeyrbWuhRm67d1ROMHr-s','31Q8fVuFLR2l7YJLOvCuh','skip');
INSERT INTO "votes" VALUES('PNvem9z6Y2etpVamdZknZ','LxAb99FugSw6xy6AcH107','31Q8fVuFLR2l7YJLOvCuh','maybe');
INSERT INTO "votes" VALUES('0vDSbqZiazD7madVwqvGV','nX7dFDh2YFh-aZFKWpL7n','31Q8fVuFLR2l7YJLOvCuh','maybe');
INSERT INTO "votes" VALUES('3sV3uXvM06UdEBTO3zjNs','cHFyyROyBpF-0ZF3wnduD','31Q8fVuFLR2l7YJLOvCuh','interested');
INSERT INTO "votes" VALUES('QlBb2KmxjXbRPLuy_kv_C','3iEcnbIuv8X3nuEw6m2WO','xuKuS8oJmLcOIYVEzn6xY','maybe');
INSERT INTO "votes" VALUES('6PyCyUafnsKMMNwhbJkqk','oeyrbWuhRm67d1ROMHr-s','xuKuS8oJmLcOIYVEzn6xY','interested');
INSERT INTO "votes" VALUES('ao3OnoSI6qV-LvVZbiBKr','pnfYCUiaFmlcXoSyh5Gz7','xuKuS8oJmLcOIYVEzn6xY','skip');
INSERT INTO "votes" VALUES('cbAmUvvQ3WymYLV8iXdc7','ShYyAkqjhtH0YaWi4pUK-','xuKuS8oJmLcOIYVEzn6xY','maybe');
INSERT INTO "votes" VALUES('ko_oYLiDPmAUXH6ADgn-f','nX7dFDh2YFh-aZFKWpL7n','xuKuS8oJmLcOIYVEzn6xY','maybe');
INSERT INTO "votes" VALUES('eWhd0Lp2X9C4Rob3-rUrj','cHFyyROyBpF-0ZF3wnduD','xuKuS8oJmLcOIYVEzn6xY','maybe');
INSERT INTO "votes" VALUES('-tFsD-9nYLKx-cdD6-mbK','xSWsbk5rnqCy8uUGTFiJl','xuKuS8oJmLcOIYVEzn6xY','skip');
INSERT INTO "votes" VALUES('0FMMVcs1jVNoKGCuxEKiU','H11sL2hdWU-rWrcOeqpXu','xuKuS8oJmLcOIYVEzn6xY','interested');
INSERT INTO "votes" VALUES('jb3AD2l17K53_4opVVg9H','pnfYCUiaFmlcXoSyh5Gz7','U0ekKLQccH73YGKwlY3Z9','maybe');
INSERT INTO "votes" VALUES('qnmN9-hqg-_1tmoDSn_aa','QVSYDsPsHDhVMkRKnsdAu','U0ekKLQccH73YGKwlY3Z9','interested');
INSERT INTO "votes" VALUES('U7fzF4Tmk_VRArS-3zBeb','ShYyAkqjhtH0YaWi4pUK-','U0ekKLQccH73YGKwlY3Z9','maybe');
INSERT INTO "votes" VALUES('pwHHuX1T7GhtEb0Pp2bss','nX7dFDh2YFh-aZFKWpL7n','U0ekKLQccH73YGKwlY3Z9','maybe');
INSERT INTO "votes" VALUES('CIrXkMrVuNncf4OpMAoyk','H11sL2hdWU-rWrcOeqpXu','U0ekKLQccH73YGKwlY3Z9','maybe');
INSERT INTO "votes" VALUES('BX4pnNBgHd0cfeFOxsG3M','l4nP8oBfyc7riyJj7-3Bp','-tcf2SnCejINfQv6PwadN','interested');
INSERT INTO "votes" VALUES('TXrP4u3LiRX23M3Iq10g2','pnfYCUiaFmlcXoSyh5Gz7','-tcf2SnCejINfQv6PwadN','interested');
INSERT INTO "votes" VALUES('0XHYTEFPAz5bRZwPPGfcJ','XuJxE6oPDJrYMViQOCD7h','-tcf2SnCejINfQv6PwadN','skip');
INSERT INTO "votes" VALUES('5_5-0hPz8FBE2Pbmgrrro','LxAb99FugSw6xy6AcH107','-tcf2SnCejINfQv6PwadN','skip');
INSERT INTO "votes" VALUES('OYonk6S72LfHm_adHJJx0','QVSYDsPsHDhVMkRKnsdAu','-tcf2SnCejINfQv6PwadN','maybe');
INSERT INTO "votes" VALUES('mUxvhscZO9DeX-3HFh4AF','nX7dFDh2YFh-aZFKWpL7n','-tcf2SnCejINfQv6PwadN','skip');
INSERT INTO "votes" VALUES('7t86nQ0wLV9m4OeHYfwbq','3iEcnbIuv8X3nuEw6m2WO','Esx6Buu8Om0CsYBLdMcs8','interested');
INSERT INTO "votes" VALUES('RfGIY0mKLubcELMSiMxwa','aEv80tPELm6Lkrm40Eo4n','Esx6Buu8Om0CsYBLdMcs8','maybe');
INSERT INTO "votes" VALUES('cfLap-a9ckfIk3-me7CJB','ShYyAkqjhtH0YaWi4pUK-','Esx6Buu8Om0CsYBLdMcs8','skip');
INSERT INTO "votes" VALUES('MGnH4UO6OcknqoYJ7ijIo','cHFyyROyBpF-0ZF3wnduD','Esx6Buu8Om0CsYBLdMcs8','skip');
INSERT INTO "votes" VALUES('w4oNLW5Ad2kuSDCKuWFnB','xSWsbk5rnqCy8uUGTFiJl','Esx6Buu8Om0CsYBLdMcs8','maybe');
INSERT INTO "votes" VALUES('XzTKz8Ic5idQvAQfpEcCR','H11sL2hdWU-rWrcOeqpXu','Esx6Buu8Om0CsYBLdMcs8','maybe');
INSERT INTO "votes" VALUES('Iy7Br6GOsBNRunLXX8FBp','oeyrbWuhRm67d1ROMHr-s','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('N19P9fbMVGsXDYkD5_Jgz','XuJxE6oPDJrYMViQOCD7h','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('G-EEIh0wCc5WQTusLh106','nX7dFDh2YFh-aZFKWpL7n','V5m-Y-E_xLRukf07jfSYs','maybe');
INSERT INTO "votes" VALUES('cOUx94G_23JT7e28AeZug','xSWsbk5rnqCy8uUGTFiJl','V5m-Y-E_xLRukf07jfSYs','interested');
INSERT INTO "votes" VALUES('RvnIJXEpkWuBf4ThooAvv','H11sL2hdWU-rWrcOeqpXu','V5m-Y-E_xLRukf07jfSYs','maybe');
INSERT INTO "votes" VALUES('2bKYnZJq4VG-6EmQJrEgD','l4nP8oBfyc7riyJj7-3Bp','DmIi0t0oVlnKcRPwLyE86','interested');
INSERT INTO "votes" VALUES('Glfq1MceZiVpsMV_HbYSI','oeyrbWuhRm67d1ROMHr-s','DmIi0t0oVlnKcRPwLyE86','maybe');
INSERT INTO "votes" VALUES('hQKTN5jhhIIFCCR2RXwKw','QVSYDsPsHDhVMkRKnsdAu','DmIi0t0oVlnKcRPwLyE86','interested');
INSERT INTO "votes" VALUES('Xgxfj4MPt-PA0JfUmhwzd','R4LAGueDEWg_tN0aCGhd4','DmIi0t0oVlnKcRPwLyE86','maybe');
INSERT INTO "votes" VALUES('BxW4RxcSpToskeHkIHcEU','v_gQTXZmIeX8dKnbYFKMG','DmIi0t0oVlnKcRPwLyE86','interested');
INSERT INTO "votes" VALUES('Z17wQ13LH3HJig79ybJyG','l4nP8oBfyc7riyJj7-3Bp','k-Yv0skkPvBEXp12fkWrP','skip');
INSERT INTO "votes" VALUES('6RV_xantrJ3YatGZvFFOW','3iEcnbIuv8X3nuEw6m2WO','k-Yv0skkPvBEXp12fkWrP','maybe');
INSERT INTO "votes" VALUES('P_ToEPy43_qIHw8QXnQRM','pnfYCUiaFmlcXoSyh5Gz7','k-Yv0skkPvBEXp12fkWrP','skip');
INSERT INTO "votes" VALUES('3LlAmM3kvnM_YSPs4_IQ2','aEv80tPELm6Lkrm40Eo4n','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('-hVqfok6qKhxk3jr6x4G5','XuJxE6oPDJrYMViQOCD7h','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('SDAW0xTeiI39BG1tN4x8t','LxAb99FugSw6xy6AcH107','k-Yv0skkPvBEXp12fkWrP','interested');
INSERT INTO "votes" VALUES('ND_e8LfZtNEJ94CN5Uj5d','cHFyyROyBpF-0ZF3wnduD','k-Yv0skkPvBEXp12fkWrP','skip');
INSERT INTO "votes" VALUES('aD01p9xUfX07vYkOWQ_Oe','R4LAGueDEWg_tN0aCGhd4','k-Yv0skkPvBEXp12fkWrP','maybe');
INSERT INTO "votes" VALUES('sA48egDTKHSTk6hqWayl_','v_gQTXZmIeX8dKnbYFKMG','k-Yv0skkPvBEXp12fkWrP','skip');
INSERT INTO "votes" VALUES('17wK8VOWRliQbXrGKEiKk','pnfYCUiaFmlcXoSyh5Gz7','wARkFhrSpExOGjLORuuuc','skip');
INSERT INTO "votes" VALUES('g6K6EHbP1QrEdf1PDRdSE','aEv80tPELm6Lkrm40Eo4n','wARkFhrSpExOGjLORuuuc','maybe');
INSERT INTO "votes" VALUES('Lf51K6pAAdSezPHmP1jQy','XuJxE6oPDJrYMViQOCD7h','wARkFhrSpExOGjLORuuuc','maybe');
INSERT INTO "votes" VALUES('KuPRObfoDCg6BKFaIorDL','cHFyyROyBpF-0ZF3wnduD','wARkFhrSpExOGjLORuuuc','interested');
INSERT INTO "votes" VALUES('qxN6Qo7GbZBPPtlsQeBwd','oeyrbWuhRm67d1ROMHr-s','AOStw-UrlZUwRBR3NE9Xe','skip');
INSERT INTO "votes" VALUES('gndXadCti_A9BCB4p2yDu','pnfYCUiaFmlcXoSyh5Gz7','AOStw-UrlZUwRBR3NE9Xe','skip');
INSERT INTO "votes" VALUES('0fFkgSSg9gWUCmD6HEMzH','XuJxE6oPDJrYMViQOCD7h','AOStw-UrlZUwRBR3NE9Xe','interested');
INSERT INTO "votes" VALUES('XBuok2PaLHuMpql7daJZk','LxAb99FugSw6xy6AcH107','AOStw-UrlZUwRBR3NE9Xe','maybe');
INSERT INTO "votes" VALUES('P7qmUy8m0ktVJlB6v2P9Q','QVSYDsPsHDhVMkRKnsdAu','4RJcYaJoa4zaJcVVGF6GK','maybe');
INSERT INTO "votes" VALUES('k97QWo4xNdM-HS4g5_rp0','nX7dFDh2YFh-aZFKWpL7n','4RJcYaJoa4zaJcVVGF6GK','maybe');
INSERT INTO "votes" VALUES('eA36J441BX9G26SBo40-S','xSWsbk5rnqCy8uUGTFiJl','4RJcYaJoa4zaJcVVGF6GK','interested');
INSERT INTO "votes" VALUES('qAyN5L-GtxivSLy45wPcV','R4LAGueDEWg_tN0aCGhd4','4RJcYaJoa4zaJcVVGF6GK','maybe');
INSERT INTO "votes" VALUES('KQyFpRH4-eZGgB3poBCUI','v_gQTXZmIeX8dKnbYFKMG','4RJcYaJoa4zaJcVVGF6GK','maybe');
INSERT INTO "votes" VALUES('Bhkp3KC4pdeD_U7EKWtKC','3iEcnbIuv8X3nuEw6m2WO','l8nd_mSHbfeLStgkxyCI0','skip');
INSERT INTO "votes" VALUES('-lhDNIwu8h25dUkuQ2krP','ShYyAkqjhtH0YaWi4pUK-','l8nd_mSHbfeLStgkxyCI0','maybe');
INSERT INTO "votes" VALUES('JVIkvnDk6GMqmHdFRb7SY','nX7dFDh2YFh-aZFKWpL7n','l8nd_mSHbfeLStgkxyCI0','maybe');
INSERT INTO "votes" VALUES('T2N-OmiXfeMuUflWo_MWu','cHFyyROyBpF-0ZF3wnduD','l8nd_mSHbfeLStgkxyCI0','skip');
INSERT INTO "votes" VALUES('vj16jAQsBM2PEaHKjXDvv','xSWsbk5rnqCy8uUGTFiJl','l8nd_mSHbfeLStgkxyCI0','maybe');
INSERT INTO "votes" VALUES('iSi_NqFqubfhvncuw9r5o','l4nP8oBfyc7riyJj7-3Bp','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('3p3287cw5oUiFy6oUnITr','aEv80tPELm6Lkrm40Eo4n','mzu3YLHMKgclzb1XFIT07','maybe');
INSERT INTO "votes" VALUES('-qPjKaPJTX3pSi57eqgkz','XuJxE6oPDJrYMViQOCD7h','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('x6ulmRI--dwpx0vXu_QER','LxAb99FugSw6xy6AcH107','mzu3YLHMKgclzb1XFIT07','maybe');
INSERT INTO "votes" VALUES('zvqhe59J0eBqE8S6hjRNb','QVSYDsPsHDhVMkRKnsdAu','mzu3YLHMKgclzb1XFIT07','maybe');
INSERT INTO "votes" VALUES('LPJ1mZQcTY-dCnrAiTPtB','cHFyyROyBpF-0ZF3wnduD','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('jaTs1haSSQxlOTN9emLfX','H11sL2hdWU-rWrcOeqpXu','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('RZSd6FPctaWWjQQ4vVZhw','R4LAGueDEWg_tN0aCGhd4','mzu3YLHMKgclzb1XFIT07','interested');
INSERT INTO "votes" VALUES('gss9zwtZCqf9sDCqBK0qP','3iEcnbIuv8X3nuEw6m2WO','xx_5Kpc1K-V3HMp05lrOa','skip');
INSERT INTO "votes" VALUES('Repk0wICYvVub-QN0bDnm','oeyrbWuhRm67d1ROMHr-s','xx_5Kpc1K-V3HMp05lrOa','interested');
INSERT INTO "votes" VALUES('WRMwngGZycttmOUPcRIJ-','aEv80tPELm6Lkrm40Eo4n','xx_5Kpc1K-V3HMp05lrOa','skip');
INSERT INTO "votes" VALUES('rZ9c5FnFSB0qqJNJO0dsP','xSWsbk5rnqCy8uUGTFiJl','xx_5Kpc1K-V3HMp05lrOa','interested');
INSERT INTO "votes" VALUES('Cma3xM8huyg9QVJNLAzLC','v_gQTXZmIeX8dKnbYFKMG','xx_5Kpc1K-V3HMp05lrOa','maybe');
INSERT INTO "votes" VALUES('wDYKbbGl4hm-WcpDdOn3e','aEv80tPELm6Lkrm40Eo4n','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('Y3q3x7QG8eKbWDJphlAoV','LxAb99FugSw6xy6AcH107','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('cYkqMBflcSHRuqfix1EQV','nX7dFDh2YFh-aZFKWpL7n','wMhAFVhmAIfmIfYP_W5bK','interested');
INSERT INTO "votes" VALUES('CQWGFEVZPYwadIGjvMqHD','xSWsbk5rnqCy8uUGTFiJl','wMhAFVhmAIfmIfYP_W5bK','skip');
INSERT INTO "votes" VALUES('C75q7shjmJrfNlH-RhakY','H11sL2hdWU-rWrcOeqpXu','wMhAFVhmAIfmIfYP_W5bK','maybe');
INSERT INTO "votes" VALUES('a4-g7x69CNH2edLhXVTao','R4LAGueDEWg_tN0aCGhd4','wMhAFVhmAIfmIfYP_W5bK','maybe');
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
INSERT INTO "events" VALUES('oP-K6FWFdyJMZAAWMI_Gp','Conference Alpha','Conference-Alpha','Event currently in proposal phase','https://test-event-1.example.com','2026-10-11T07:00:00.000Z','2026-10-13T16:00:00.000Z','2026-08-23T09:25:22.481Z','2026-09-06T09:25:22.481Z','2026-09-06T09:25:22.481Z','2026-09-20T09:25:22.481Z','2026-09-20T09:25:22.481Z','2026-10-13T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0);
INSERT INTO "events" VALUES('pgOlrtfknEmKZ-Lwveoxj','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','https://test-event-2.example.com','2026-09-27T07:00:00.000Z','2026-09-29T16:00:00.000Z','2026-08-09T09:25:22.481Z','2026-08-23T09:25:22.481Z','2026-08-23T09:25:22.481Z','2026-09-06T09:25:22.481Z','2026-09-06T09:25:22.481Z','2026-09-29T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0);
INSERT INTO "events" VALUES('MV-dn31tR6gIMAVDMAi4r','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','https://test-event-3.example.com','2026-09-13T07:00:00.000Z','2026-09-15T16:00:00.000Z','2026-07-26T09:25:22.481Z','2026-08-09T09:25:22.481Z','2026-08-09T09:25:22.481Z','2026-08-23T09:25:22.481Z','2026-08-23T09:25:22.481Z','2026-09-15T16:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0);
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
INSERT INTO "sessions" VALUES('xR409Fsvnm6YjCM864Ueh','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-11T07:00:00.000Z','2026-10-11T08:30:00.000Z',100,1,0,0,NULL,'oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "sessions" VALUES('s2PpZQ9GoWzibe3i9pG1L','Lunch Break','','2026-10-11T10:30:00.000Z','2026-10-11T12:00:00.000Z',0,1,1,0,NULL,'oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "sessions" VALUES('BYwLeGxjIEYPaai4BbPCg','Lunch Break','','2026-10-12T10:30:00.000Z','2026-10-12T12:00:00.000Z',0,1,1,0,NULL,'oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "sessions" VALUES('PICVSC2o1dq_T7AmlwBsM','Lunch Break','','2026-10-13T10:30:00.000Z','2026-10-13T12:00:00.000Z',0,1,1,0,NULL,'oP-K6FWFdyJMZAAWMI_Gp');
INSERT INTO "sessions" VALUES('Kpjo4FEG6jWtztCYbTI5u','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-09-27T07:00:00.000Z','2026-09-27T08:30:00.000Z',100,1,0,0,NULL,'pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "sessions" VALUES('-wLDBNq8TjUUnUI57iob3','Lunch Break','','2026-09-27T10:30:00.000Z','2026-09-27T12:00:00.000Z',0,1,1,0,NULL,'pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "sessions" VALUES('YWde6SmKb-0EkXyU6l6p5','Lunch Break','','2026-09-28T10:30:00.000Z','2026-09-28T12:00:00.000Z',0,1,1,0,NULL,'pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "sessions" VALUES('cjleu1OMl3rrxiSEz_5BQ','Lunch Break','','2026-09-29T10:30:00.000Z','2026-09-29T12:00:00.000Z',0,1,1,0,NULL,'pgOlrtfknEmKZ-Lwveoxj');
INSERT INTO "sessions" VALUES('l5SacUuQ-KYT6dTFgUkKV','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-13T07:00:00.000Z','2026-09-13T08:30:00.000Z',100,1,0,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('QPyKLNw5kFbw_XWEcSCft','Lunch Break','','2026-09-13T10:30:00.000Z','2026-09-13T12:00:00.000Z',0,1,1,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('0sEQKs53dwXoyN6_5Yd3f','Lunch Break','','2026-09-14T10:30:00.000Z','2026-09-14T12:00:00.000Z',0,1,1,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('f6ocP0JHu0iEzMj-sLYWy','Lunch Break','','2026-09-15T10:30:00.000Z','2026-09-15T12:00:00.000Z',0,1,1,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('8nptJI9fTOB7tBx-GQSMp','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-13T09:00:00.000Z','2026-09-13T10:00:00.000Z',100,0,0,0,'3iEcnbIuv8X3nuEw6m2WO','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('B_rQrgjxk3BXvUTRZRKFb','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-13T09:00:00.000Z','2026-09-13T10:30:00.000Z',30,0,0,1,'oeyrbWuhRm67d1ROMHr-s','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('cMma0lJjm8D5LkSpIf46t','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-13T12:00:00.000Z','2026-09-13T13:00:00.000Z',100,0,0,0,'pnfYCUiaFmlcXoSyh5Gz7','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('rcNGdRaEf0BwLldIgod7r','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-13T12:00:00.000Z','2026-09-13T13:30:00.000Z',25,0,0,0,'H11sL2hdWU-rWrcOeqpXu','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('kT55LufJUSYKUiwiwpyr7','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-13T13:30:00.000Z','2026-09-13T14:30:00.000Z',30,0,0,0,'ShYyAkqjhtH0YaWi4pUK-','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('rvc6aWcmg9jykIN0aF02E','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-14T07:00:00.000Z','2026-09-14T08:00:00.000Z',100,0,0,0,'l4nP8oBfyc7riyJj7-3Bp','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('81dcXcAE4YLhLPQvsbmrB','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-14T08:00:00.000Z','2026-09-14T09:30:00.000Z',25,0,0,0,'nX7dFDh2YFh-aZFKWpL7n','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('EAMaGD_YxtPE2J0nnI1kZ','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-14T08:30:00.000Z','2026-09-14T10:00:00.000Z',30,0,0,0,'xSWsbk5rnqCy8uUGTFiJl','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('Si5AxAc4qyUT-mc3COskg','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',100,0,0,0,'v_gQTXZmIeX8dKnbYFKMG','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('KsQUPgSzRI7EtdtQLZ0u3','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-14T12:00:00.000Z','2026-09-14T13:00:00.000Z',25,0,0,0,'LxAb99FugSw6xy6AcH107','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('70IWUMhmpFsczk-EySQnQ','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-14T14:00:00.000Z','2026-09-14T15:00:00.000Z',100,0,0,0,'QVSYDsPsHDhVMkRKnsdAu','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('g5g4HbEc_6r6wXYkUscoN','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-14T14:00:00.000Z','2026-09-14T14:30:00.000Z',15,0,0,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('lcPGnTnvJX-QdErowV-gf','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-15T07:00:00.000Z','2026-09-15T08:00:00.000Z',100,0,0,0,'XuJxE6oPDJrYMViQOCD7h','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('pAySm1hsRr7D1Q5nqUyfb','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-15T08:00:00.000Z','2026-09-15T09:00:00.000Z',30,0,0,0,'cHFyyROyBpF-0ZF3wnduD','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('F75OqA4LvRAPY4E1LN59d','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-15T08:30:00.000Z','2026-09-15T09:30:00.000Z',25,0,0,0,'R4LAGueDEWg_tN0aCGhd4','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('UjOjt4yjik8FephfA0RSF','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-15T12:00:00.000Z','2026-09-15T13:00:00.000Z',100,0,0,0,'aEv80tPELm6Lkrm40Eo4n','MV-dn31tR6gIMAVDMAi4r');
INSERT INTO "sessions" VALUES('8ICsa9g-jApo8644H_5CP','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-15T14:00:00.000Z','2026-09-15T15:00:00.000Z',100,1,0,0,NULL,'MV-dn31tR6gIMAVDMAi4r');
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
INSERT INTO "comments" VALUES('BLCzMalp8s5v7adUNLE_U',NULL,NULL,'',1,'2026-08-29T23:25:22.920Z',NULL);
INSERT INTO "comments" VALUES('sZOMWSbr8bcWpXo1Q9jXs','5HzaeQPX_Q5AS9Ry7-g0P','BLCzMalp8s5v7adUNLE_U','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T00:25:22.920Z',NULL);
INSERT INTO "comments" VALUES('hbYJoe0532pNEbd1o99m6','wdKiGvZYAwLisZE1i26oD','sZOMWSbr8bcWpXo1Q9jXs','Perfect, count me in.',0,'2026-08-30T01:25:22.920Z',NULL);
INSERT INTO "comments" VALUES('ii3lOlJg1v4cEWQ4sSx0K','HsO7ub1xzup1hjMSfDh6N',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:25:22.920Z',NULL);
INSERT INTO "comments" VALUES('OA50VA4RDcOhiB_eCQ2lW','HGSmRiy3lXrgW5OIe3psV',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-29T23:46:22.920Z',NULL);
INSERT INTO "comments" VALUES('pStBB2Hp1KYV1FZdDuEAS','HsO7ub1xzup1hjMSfDh6N','OA50VA4RDcOhiB_eCQ2lW','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T00:46:22.920Z',NULL);
INSERT INTO "comments" VALUES('4OtJtegHktqkwe0x-KEEX','56i1PPNObDW-PmygSTEc8',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-29T23:53:22.920Z',NULL);
INSERT INTO "comments" VALUES('axoDm5i6QwYUAOb_eNiAT','56i1PPNObDW-PmygSTEc8',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-30T00:07:22.920Z',NULL);
INSERT INTO "comments" VALUES('GHAEgtYOK6uvsAoLgG0pX','bpf8-yo3LlYc1Vp9iNFl0',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T00:14:22.921Z',NULL);
INSERT INTO "comments" VALUES('K94PfErWf2N9ubk_s-CKu','ZKfmZvoeuQu0Vl20KYByx','GHAEgtYOK6uvsAoLgG0pX','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T01:14:22.921Z',NULL);
INSERT INTO "comments" VALUES('NO4GDbQ-LvZYIHgnixZ8x','cjc_whiGjsvXFd3c69Kad','K94PfErWf2N9ubk_s-CKu','That makes sense, thanks for explaining!',0,'2026-08-30T02:14:22.921Z',NULL);
INSERT INTO "comments" VALUES('grKxntDOlWcapxJdEIZaI','flnjCaAzGgABGdbXUmS_A',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T03:14:22.921Z',NULL);
INSERT INTO "comments" VALUES('F04keldwYu5UqSoJaDBG9','5cKMVI_IB7JVQbrFSlRXS',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-08-29T23:32:22.921Z',NULL);
INSERT INTO "comments" VALUES('tJPbQLvjIohvT4l6SwGO3','wdKiGvZYAwLisZE1i26oD','F04keldwYu5UqSoJaDBG9','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T00:32:22.921Z',NULL);
INSERT INTO "comments" VALUES('NH-40F--lUUGshUTIFmXz','HsO7ub1xzup1hjMSfDh6N','tJPbQLvjIohvT4l6SwGO3','That makes sense, thanks for explaining!',0,'2026-08-30T01:32:22.921Z',NULL);
INSERT INTO "comments" VALUES('JbbJrtCvecM9wYiV4V499','wdKiGvZYAwLisZE1i26oD',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-29T23:39:22.921Z',NULL);
INSERT INTO "comments" VALUES('aK3-F4Yqqe59mR8rapSFv','HGSmRiy3lXrgW5OIe3psV',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:39:22.921Z',NULL);
INSERT INTO "comments" VALUES('r6RKSrvny-QrN_kgWYwea','3eDfavLHK-w8UFQStbNe9',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T00:00:22.921Z','2026-08-30T00:04:22.921Z');
INSERT INTO "comments" VALUES('NQJNHgLKlEmLNEDMMkBuW','bpf8-yo3LlYc1Vp9iNFl0',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T00:21:22.921Z',NULL);
INSERT INTO "comments" VALUES('deLS1d6ZV2JC5sJGZfujl','cjc_whiGjsvXFd3c69Kad','NQJNHgLKlEmLNEDMMkBuW','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T01:21:22.921Z',NULL);
INSERT INTO "comments" VALUES('g_hfr-lT5UEwbkX-IcsQW','flnjCaAzGgABGdbXUmS_A','deLS1d6ZV2JC5sJGZfujl','Perfect, count me in.',0,'2026-08-30T02:21:22.921Z',NULL);
INSERT INTO "comments" VALUES('YXuAZNtHHPv8QMB1DbHLh','cjc_whiGjsvXFd3c69Kad',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-30T00:28:22.921Z',NULL);
INSERT INTO "comments" VALUES('SAsO6WPIeAEpfw4rZBjpN','H4tNC6vRh_sZJql8AseGM',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T03:28:22.921Z',NULL);
INSERT INTO "comments" VALUES('SfUifuaJ_zcuNOnMS8kdf','wdKiGvZYAwLisZE1i26oD',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-29T23:39:22.921Z',NULL);
INSERT INTO "comments" VALUES('N5LSLWc_zqI9iO2Sik-74','3eDfavLHK-w8UFQStbNe9','SfUifuaJ_zcuNOnMS8kdf','I''d rather keep them separate, they go in quite different directions.',0,'2026-08-30T00:39:22.921Z',NULL);
INSERT INTO "comments" VALUES('JUgJ7TqtitRPJze8qMAPk','HsO7ub1xzup1hjMSfDh6N',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-29T23:46:22.921Z',NULL);
INSERT INTO "comments" VALUES('LWO0WzfEVag7rloAvTleo','674LkKoaNetzVfAAXzKAy','JUgJ7TqtitRPJze8qMAPk','Later works for me. I''ll flag it when scheduling opens.',0,'2026-08-30T00:46:22.921Z',NULL);
INSERT INTO "comments" VALUES('oo2114J6Truv-R4J_N5Fg','3eDfavLHK-w8UFQStbNe9',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T02:46:22.921Z',NULL);
INSERT INTO "comments" VALUES('iykB6h9vL3XnTzw0xqP8S','HGSmRiy3lXrgW5OIe3psV',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-29T23:53:22.922Z',NULL);
INSERT INTO "comments" VALUES('kgvfaTYn4TeOxp-Rj-j1-','cjc_whiGjsvXFd3c69Kad','iykB6h9vL3XnTzw0xqP8S','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T00:53:22.922Z',NULL);
INSERT INTO "comments" VALUES('wLcM-JuMRFDJzUzOYL5aN','3eDfavLHK-w8UFQStbNe9','kgvfaTYn4TeOxp-Rj-j1-','Perfect, count me in.',0,'2026-08-30T01:53:22.922Z',NULL);
INSERT INTO "comments" VALUES('mzb-fy-EKUuWfKJIbUElU','3eDfavLHK-w8UFQStbNe9',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-08-30T00:00:22.922Z','2026-08-30T00:04:22.922Z');
INSERT INTO "comments" VALUES('N_WkoKZP2RtoFxi8zpYJa','r3Rmp1dBG-jP4OoJvkAjs','mzb-fy-EKUuWfKJIbUElU','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T01:00:22.922Z',NULL);
INSERT INTO "comments" VALUES('4G3KMdFELZWz4IvjCq8DL','56i1PPNObDW-PmygSTEc8','N_WkoKZP2RtoFxi8zpYJa','That makes sense, thanks for explaining!',0,'2026-08-30T02:00:22.922Z',NULL);
INSERT INTO "comments" VALUES('XIK3JQduOIdOLUelK8tZF','bpf8-yo3LlYc1Vp9iNFl0',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-08-30T00:14:22.922Z',NULL);
INSERT INTO "comments" VALUES('kMI9AA7o3HIzPcaMemoMq','bpf8-yo3LlYc1Vp9iNFl0',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-08-30T00:21:22.922Z',NULL);
INSERT INTO "comments" VALUES('5vFwP_cfKP9Q9Twm5aLY-','31Q8fVuFLR2l7YJLOvCuh','kMI9AA7o3HIzPcaMemoMq','Good question — no background needed, I''ll start from scratch.',0,'2026-08-30T01:21:22.922Z',NULL);
INSERT INTO "comments" VALUES('kXGTTJwTuuHsNQyOoJR_4','cjc_whiGjsvXFd3c69Kad','5vFwP_cfKP9Q9Twm5aLY-','Perfect, count me in.',0,'2026-08-30T02:21:22.922Z',NULL);
INSERT INTO "comments" VALUES('RvkOBwEXJi8oVEsqeWh7I','cjc_whiGjsvXFd3c69Kad',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-30T00:28:22.922Z',NULL);
INSERT INTO "comments" VALUES('T3P0Yx1s0KWlJYIrDxGnM','CssVX1HK8f7TH1kMpgsKD','RvkOBwEXJi8oVEsqeWh7I','Yes please, drop me a message and we''ll plan it together.',0,'2026-08-30T01:28:22.922Z',NULL);
INSERT INTO "comments" VALUES('uI782IvU1rRa6YX47CQlX','flnjCaAzGgABGdbXUmS_A','T3P0Yx1s0KWlJYIrDxGnM','That makes sense, thanks for explaining!',0,'2026-08-30T02:28:22.922Z',NULL);
INSERT INTO "comments" VALUES('jN0fDp3f84OoQyf81kenP','xHzguFgK5CrqWXPDcvEgd',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-08-30T01:03:22.922Z',NULL);
INSERT INTO "comments" VALUES('Tr4q9PAwZ4F-mmxQZr_Fp','ZKfmZvoeuQu0Vl20KYByx','jN0fDp3f84OoQyf81kenP','I''d rather keep them separate, they go in quite different directions.',0,'2026-08-30T02:03:22.922Z',NULL);
INSERT INTO "comments" VALUES('Hyr75iaN489c6pfKtkh9u','pkfGVZdfjsw1bzmeR9xrG',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-08-30T04:03:22.922Z',NULL);
INSERT INTO "comments" VALUES('lukT3AAUQcW2efx42tUhA','HsO7ub1xzup1hjMSfDh6N',NULL,'Who else is on the panel?',0,'2026-08-30T04:25:22.922Z',NULL);
INSERT INTO "comments" VALUES('M2s6GaBzPofhmwrXs0nH7','HGSmRiy3lXrgW5OIe3psV','lukT3AAUQcW2efx42tUhA','I''d like to join.',0,'2026-08-30T05:25:22.922Z',NULL);
INSERT INTO "comments" VALUES('KJ51bvblIAAG2NrgEANkX','3eDfavLHK-w8UFQStbNe9','lukT3AAUQcW2efx42tUhA','So would I.',0,'2026-08-30T06:25:22.922Z',NULL);
CREATE TABLE `proposal_comments` (
	`comment_id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_comments" VALUES('BLCzMalp8s5v7adUNLE_U','vUAV08OHmo6JrQIQESIao');
INSERT INTO "proposal_comments" VALUES('sZOMWSbr8bcWpXo1Q9jXs','vUAV08OHmo6JrQIQESIao');
INSERT INTO "proposal_comments" VALUES('hbYJoe0532pNEbd1o99m6','vUAV08OHmo6JrQIQESIao');
INSERT INTO "proposal_comments" VALUES('ii3lOlJg1v4cEWQ4sSx0K','vUAV08OHmo6JrQIQESIao');
INSERT INTO "proposal_comments" VALUES('OA50VA4RDcOhiB_eCQ2lW','IaiTThu8gOHJrhv3lENfh');
INSERT INTO "proposal_comments" VALUES('pStBB2Hp1KYV1FZdDuEAS','IaiTThu8gOHJrhv3lENfh');
INSERT INTO "proposal_comments" VALUES('4OtJtegHktqkwe0x-KEEX','yq5YcT16Erj50AsO9azWf');
INSERT INTO "proposal_comments" VALUES('axoDm5i6QwYUAOb_eNiAT','OanIE3shMNrTW4LTa-Hk6');
INSERT INTO "proposal_comments" VALUES('GHAEgtYOK6uvsAoLgG0pX','IF25wOHfkaZxP3zfBGtCR');
INSERT INTO "proposal_comments" VALUES('K94PfErWf2N9ubk_s-CKu','IF25wOHfkaZxP3zfBGtCR');
INSERT INTO "proposal_comments" VALUES('NO4GDbQ-LvZYIHgnixZ8x','IF25wOHfkaZxP3zfBGtCR');
INSERT INTO "proposal_comments" VALUES('grKxntDOlWcapxJdEIZaI','IF25wOHfkaZxP3zfBGtCR');
INSERT INTO "proposal_comments" VALUES('F04keldwYu5UqSoJaDBG9','pcBQpLYqi6lwyq4k3cRlf');
INSERT INTO "proposal_comments" VALUES('tJPbQLvjIohvT4l6SwGO3','pcBQpLYqi6lwyq4k3cRlf');
INSERT INTO "proposal_comments" VALUES('NH-40F--lUUGshUTIFmXz','pcBQpLYqi6lwyq4k3cRlf');
INSERT INTO "proposal_comments" VALUES('JbbJrtCvecM9wYiV4V499','sCO9dXVF6Wt77a4AXY1Mu');
INSERT INTO "proposal_comments" VALUES('aK3-F4Yqqe59mR8rapSFv','sCO9dXVF6Wt77a4AXY1Mu');
INSERT INTO "proposal_comments" VALUES('r6RKSrvny-QrN_kgWYwea','9CKo3jDMBsEUnomDnIznK');
INSERT INTO "proposal_comments" VALUES('NQJNHgLKlEmLNEDMMkBuW','e92aQ6pdpJY2IX4jh60jT');
INSERT INTO "proposal_comments" VALUES('deLS1d6ZV2JC5sJGZfujl','e92aQ6pdpJY2IX4jh60jT');
INSERT INTO "proposal_comments" VALUES('g_hfr-lT5UEwbkX-IcsQW','e92aQ6pdpJY2IX4jh60jT');
INSERT INTO "proposal_comments" VALUES('YXuAZNtHHPv8QMB1DbHLh','MUvGFWtO3icYW5IdgOPJn');
INSERT INTO "proposal_comments" VALUES('SAsO6WPIeAEpfw4rZBjpN','MUvGFWtO3icYW5IdgOPJn');
INSERT INTO "proposal_comments" VALUES('SfUifuaJ_zcuNOnMS8kdf','oeyrbWuhRm67d1ROMHr-s');
INSERT INTO "proposal_comments" VALUES('N5LSLWc_zqI9iO2Sik-74','oeyrbWuhRm67d1ROMHr-s');
INSERT INTO "proposal_comments" VALUES('JUgJ7TqtitRPJze8qMAPk','pnfYCUiaFmlcXoSyh5Gz7');
INSERT INTO "proposal_comments" VALUES('LWO0WzfEVag7rloAvTleo','pnfYCUiaFmlcXoSyh5Gz7');
INSERT INTO "proposal_comments" VALUES('oo2114J6Truv-R4J_N5Fg','pnfYCUiaFmlcXoSyh5Gz7');
INSERT INTO "proposal_comments" VALUES('iykB6h9vL3XnTzw0xqP8S','aEv80tPELm6Lkrm40Eo4n');
INSERT INTO "proposal_comments" VALUES('kgvfaTYn4TeOxp-Rj-j1-','aEv80tPELm6Lkrm40Eo4n');
INSERT INTO "proposal_comments" VALUES('wLcM-JuMRFDJzUzOYL5aN','aEv80tPELm6Lkrm40Eo4n');
INSERT INTO "proposal_comments" VALUES('mzb-fy-EKUuWfKJIbUElU','XuJxE6oPDJrYMViQOCD7h');
INSERT INTO "proposal_comments" VALUES('N_WkoKZP2RtoFxi8zpYJa','XuJxE6oPDJrYMViQOCD7h');
INSERT INTO "proposal_comments" VALUES('4G3KMdFELZWz4IvjCq8DL','XuJxE6oPDJrYMViQOCD7h');
INSERT INTO "proposal_comments" VALUES('XIK3JQduOIdOLUelK8tZF','QVSYDsPsHDhVMkRKnsdAu');
INSERT INTO "proposal_comments" VALUES('kMI9AA7o3HIzPcaMemoMq','ShYyAkqjhtH0YaWi4pUK-');
INSERT INTO "proposal_comments" VALUES('5vFwP_cfKP9Q9Twm5aLY-','ShYyAkqjhtH0YaWi4pUK-');
INSERT INTO "proposal_comments" VALUES('kXGTTJwTuuHsNQyOoJR_4','ShYyAkqjhtH0YaWi4pUK-');
INSERT INTO "proposal_comments" VALUES('RvkOBwEXJi8oVEsqeWh7I','nX7dFDh2YFh-aZFKWpL7n');
INSERT INTO "proposal_comments" VALUES('T3P0Yx1s0KWlJYIrDxGnM','nX7dFDh2YFh-aZFKWpL7n');
INSERT INTO "proposal_comments" VALUES('uI782IvU1rRa6YX47CQlX','nX7dFDh2YFh-aZFKWpL7n');
INSERT INTO "proposal_comments" VALUES('jN0fDp3f84OoQyf81kenP','v_gQTXZmIeX8dKnbYFKMG');
INSERT INTO "proposal_comments" VALUES('Tr4q9PAwZ4F-mmxQZr_Fp','v_gQTXZmIeX8dKnbYFKMG');
INSERT INTO "proposal_comments" VALUES('Hyr75iaN489c6pfKtkh9u','v_gQTXZmIeX8dKnbYFKMG');
INSERT INTO "proposal_comments" VALUES('lukT3AAUQcW2efx42tUhA','O9-RUVlL7PanRRu52km7V');
INSERT INTO "proposal_comments" VALUES('M2s6GaBzPofhmwrXs0nH7','O9-RUVlL7PanRRu52km7V');
INSERT INTO "proposal_comments" VALUES('KJ51bvblIAAG2NrgEANkX','O9-RUVlL7PanRRu52km7V');
CREATE TABLE `comment_likes` (
	`comment_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`created_time` text NOT NULL,
	PRIMARY KEY(`comment_id`, `guest_id`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "comment_likes" VALUES('sZOMWSbr8bcWpXo1Q9jXs','wdKiGvZYAwLisZE1i26oD','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('sZOMWSbr8bcWpXo1Q9jXs','HsO7ub1xzup1hjMSfDh6N','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('hbYJoe0532pNEbd1o99m6','HsO7ub1xzup1hjMSfDh6N','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('hbYJoe0532pNEbd1o99m6','HGSmRiy3lXrgW5OIe3psV','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('OA50VA4RDcOhiB_eCQ2lW','3eDfavLHK-w8UFQStbNe9','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('pStBB2Hp1KYV1FZdDuEAS','56i1PPNObDW-PmygSTEc8','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('pStBB2Hp1KYV1FZdDuEAS','ZKfmZvoeuQu0Vl20KYByx','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('axoDm5i6QwYUAOb_eNiAT','bpf8-yo3LlYc1Vp9iNFl0','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('GHAEgtYOK6uvsAoLgG0pX','cjc_whiGjsvXFd3c69Kad','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('GHAEgtYOK6uvsAoLgG0pX','flnjCaAzGgABGdbXUmS_A','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('K94PfErWf2N9ubk_s-CKu','flnjCaAzGgABGdbXUmS_A','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('NO4GDbQ-LvZYIHgnixZ8x','H4tNC6vRh_sZJql8AseGM','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('NO4GDbQ-LvZYIHgnixZ8x','CssVX1HK8f7TH1kMpgsKD','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('NO4GDbQ-LvZYIHgnixZ8x','DbLvx5jtFkYtoIyDVavJL','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('grKxntDOlWcapxJdEIZaI','CssVX1HK8f7TH1kMpgsKD','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('F04keldwYu5UqSoJaDBG9','DbLvx5jtFkYtoIyDVavJL','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('F04keldwYu5UqSoJaDBG9','OLUkXAx3x9c9ZgT28xgoP','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('tJPbQLvjIohvT4l6SwGO3','OLUkXAx3x9c9ZgT28xgoP','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('tJPbQLvjIohvT4l6SwGO3','xHzguFgK5CrqWXPDcvEgd','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('JbbJrtCvecM9wYiV4V499','V4S6hF2dncw5O3rC2tm3m','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('JbbJrtCvecM9wYiV4V499','pkfGVZdfjsw1bzmeR9xrG','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('r6RKSrvny-QrN_kgWYwea','hcgyLMhEySkieazQGLx2Z','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('r6RKSrvny-QrN_kgWYwea','r3Rmp1dBG-jP4OoJvkAjs','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('NQJNHgLKlEmLNEDMMkBuW','r3Rmp1dBG-jP4OoJvkAjs','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('NQJNHgLKlEmLNEDMMkBuW','674LkKoaNetzVfAAXzKAy','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('NQJNHgLKlEmLNEDMMkBuW','FDey5RKF35qiOeLUbSdjS','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('deLS1d6ZV2JC5sJGZfujl','674LkKoaNetzVfAAXzKAy','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('deLS1d6ZV2JC5sJGZfujl','FDey5RKF35qiOeLUbSdjS','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('g_hfr-lT5UEwbkX-IcsQW','FDey5RKF35qiOeLUbSdjS','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('g_hfr-lT5UEwbkX-IcsQW','SLeEQjx9QHnHky2x2L5Ke','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('g_hfr-lT5UEwbkX-IcsQW','-65kFmoP6lfo-KlVeZeEO','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('YXuAZNtHHPv8QMB1DbHLh','SLeEQjx9QHnHky2x2L5Ke','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('SAsO6WPIeAEpfw4rZBjpN','-65kFmoP6lfo-KlVeZeEO','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('SAsO6WPIeAEpfw4rZBjpN','oDkSLPMVj0inCmYQgdiCm','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('JUgJ7TqtitRPJze8qMAPk','xuKuS8oJmLcOIYVEzn6xY','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('JUgJ7TqtitRPJze8qMAPk','U0ekKLQccH73YGKwlY3Z9','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('LWO0WzfEVag7rloAvTleo','U0ekKLQccH73YGKwlY3Z9','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('LWO0WzfEVag7rloAvTleo','-tcf2SnCejINfQv6PwadN','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('oo2114J6Truv-R4J_N5Fg','-tcf2SnCejINfQv6PwadN','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('iykB6h9vL3XnTzw0xqP8S','Esx6Buu8Om0CsYBLdMcs8','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('iykB6h9vL3XnTzw0xqP8S','V5m-Y-E_xLRukf07jfSYs','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('kgvfaTYn4TeOxp-Rj-j1-','V5m-Y-E_xLRukf07jfSYs','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('wLcM-JuMRFDJzUzOYL5aN','DmIi0t0oVlnKcRPwLyE86','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('wLcM-JuMRFDJzUzOYL5aN','k-Yv0skkPvBEXp12fkWrP','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('mzb-fy-EKUuWfKJIbUElU','k-Yv0skkPvBEXp12fkWrP','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('mzb-fy-EKUuWfKJIbUElU','wARkFhrSpExOGjLORuuuc','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('N_WkoKZP2RtoFxi8zpYJa','wARkFhrSpExOGjLORuuuc','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('N_WkoKZP2RtoFxi8zpYJa','AOStw-UrlZUwRBR3NE9Xe','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('N_WkoKZP2RtoFxi8zpYJa','4RJcYaJoa4zaJcVVGF6GK','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('4G3KMdFELZWz4IvjCq8DL','AOStw-UrlZUwRBR3NE9Xe','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('4G3KMdFELZWz4IvjCq8DL','4RJcYaJoa4zaJcVVGF6GK','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('4G3KMdFELZWz4IvjCq8DL','l8nd_mSHbfeLStgkxyCI0','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('5vFwP_cfKP9Q9Twm5aLY-','mzu3YLHMKgclzb1XFIT07','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('5vFwP_cfKP9Q9Twm5aLY-','xx_5Kpc1K-V3HMp05lrOa','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('RvkOBwEXJi8oVEsqeWh7I','wMhAFVhmAIfmIfYP_W5bK','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('T3P0Yx1s0KWlJYIrDxGnM','5HzaeQPX_Q5AS9Ry7-g0P','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('T3P0Yx1s0KWlJYIrDxGnM','5cKMVI_IB7JVQbrFSlRXS','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('T3P0Yx1s0KWlJYIrDxGnM','wdKiGvZYAwLisZE1i26oD','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('uI782IvU1rRa6YX47CQlX','5cKMVI_IB7JVQbrFSlRXS','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('uI782IvU1rRa6YX47CQlX','wdKiGvZYAwLisZE1i26oD','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('uI782IvU1rRa6YX47CQlX','HsO7ub1xzup1hjMSfDh6N','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('jN0fDp3f84OoQyf81kenP','wdKiGvZYAwLisZE1i26oD','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('Hyr75iaN489c6pfKtkh9u','HGSmRiy3lXrgW5OIe3psV','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('Hyr75iaN489c6pfKtkh9u','3eDfavLHK-w8UFQStbNe9','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('Hyr75iaN489c6pfKtkh9u','56i1PPNObDW-PmygSTEc8','2026-08-30T08:23:22.922Z');
INSERT INTO "comment_likes" VALUES('lukT3AAUQcW2efx42tUhA','56i1PPNObDW-PmygSTEc8','2026-08-30T08:25:22.922Z');
INSERT INTO "comment_likes" VALUES('lukT3AAUQcW2efx42tUhA','ZKfmZvoeuQu0Vl20KYByx','2026-08-30T08:24:22.922Z');
INSERT INTO "comment_likes" VALUES('KJ51bvblIAAG2NrgEANkX','bpf8-yo3LlYc1Vp9iNFl0','2026-08-30T08:25:22.923Z');
INSERT INTO "comment_likes" VALUES('KJ51bvblIAAG2NrgEANkX','cjc_whiGjsvXFd3c69Kad','2026-08-30T08:24:22.923Z');
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
CREATE INDEX `proposal_comments_proposal_idx` ON `proposal_comments` (`proposal_id`);
CREATE INDEX `comment_likes_guest_idx` ON `comment_likes` (`guest_id`);
COMMIT;
