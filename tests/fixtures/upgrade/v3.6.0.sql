-- Seeded database of schellingboard v3.6.0, dumped by
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
INSERT INTO "__drizzle_migrations" VALUES(NULL,'b6397797a064d7b0ed6c8f59b0260f37f86c8664ba6aedcadefc960b9091b4d1',1788252255683);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'78be6a433f663906a763667c1896e159cbb6f4139b5d4051d0b1c01040044881',1788252381645);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'ef4112b4e9e72685b88ecff319aa0173f9c71eceb74fdfa795575577347c9a19',1788511164512);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'170003a8bcaeedacf5c275b6359c0e03f9c95a67fc8789f90cd3f4ee52f0e1ac',1788594330660);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'6b7d1c881d1f37d657e25db1c70372cc90079560b3caf68932591a51c6544a3f',1788697709228);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'7139ed3f5528a6a1e4854bae5dea43fbbcbae2d04442898340ae50bfbbeb3951',1788703476668);
INSERT INTO "__drizzle_migrations" VALUES(NULL,'cfc5f0194397efebdfe98f97026907d0676a7ec0cbaa80476ed3aa93a21ba9b0',1788768341579);
CREATE TABLE `guests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
, `about_me` text, `avatar_url` text, `pronouns` text, `email_on_rsvp_change` integer DEFAULT true NOT NULL, `email_on_host_change` integer DEFAULT true NOT NULL, `email_on_cohost_add` integer DEFAULT true NOT NULL, `based_in` text, `prompts` text, `languages` text, `contacts` text, `auth_protected` integer DEFAULT false NOT NULL, `password_hash` text, `email_on_proposal_comment` integer DEFAULT true NOT NULL, `email_on_comment_thread` integer DEFAULT false NOT NULL, `profile_updated_at` text, `email_on_session_comment` integer DEFAULT true NOT NULL, `email_on_profile_comment` integer DEFAULT true NOT NULL, `email_on_meeting_request` integer DEFAULT true NOT NULL, `email_on_meeting_response` integer DEFAULT true NOT NULL, `email_on_session_heads_up` integer DEFAULT true NOT NULL, `email_on_attendee_count_reminder` integer DEFAULT true NOT NULL);
INSERT INTO "guests" VALUES('EituNjAB_WjHf315o6FgB','Alice Test','alice@test.com','Frontend developer from Osaka. I love talking about **accessibility** and design systems — find me at the coffee machine.','/media/avatars/EituNjAB_WjHf315o6FgB.webp?v=1788891419188','She/Her',1,1,1,'Osaka, Japan','[{"prompt":"Ask me about","answer":"Accessible design patterns and Japanese web typography"},{"prompt":"Offering","answer":"Code review swaps and coffee-machine debugging sessions"}]','["Japanese","English"]','[{"type":"website","value":"https://alice-test.example.com"},{"type":"telegram","value":"@alice_frontend"}]',0,NULL,1,0,'2026-09-08T15:16:59.188Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('Iwq7GEtgCWvad81RH-wzO','Bob Test','bob@test.com','Product manager and community organizer from Lagos. I run a local meetup on inclusive product design and I''m always looking for speakers.','/media/avatars/Iwq7GEtgCWvad81RH-wzO.webp?v=1788891419188','He/Him',1,1,1,'Lagos, Nigeria','[{"prompt":"Looking for","answer":"Speakers for an inclusive product design meetup back home"},{"prompt":"Offering","answer":"Feedback on your product roadmap over coffee"}]','["English","Yoruba"]','[{"type":"email","value":"bob.organizes@example.com"},{"type":"whatsapp","value":"+234 801 234 5678"}]',0,NULL,1,0,'2026-09-07T20:16:59.188Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('zyrIHrTaOd_Ujd3d5-r7v','Charlie Test','charlie@test.com','Data engineer from Guadalajara. Ask me about stream processing, or better yet, about my sourdough starter.','/media/avatars/zyrIHrTaOd_Ujd3d5-r7v.webp?v=1788891419189','They/Them',1,1,1,'Guadalajara, Mexico','[{"prompt":"Ask me about","answer":"Stream processing pipelines, or my sourdough starter"},{"prompt":"My weirdest skill","answer":"Naming Kafka topics that still make sense a year later"}]','["Spanish","English"]','[{"type":"discord","value":"charlie.streams"},{"type":"website","value":"https://charlie.dev"}]',0,NULL,1,0,'2026-09-07T01:16:59.189Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('5RoBJlTarTCYHwRtkcfoL','Yuki Tanaka','yuki.tanaka@example.com',NULL,NULL,'He/Him',1,1,1,NULL,'[{"prompt":"Ask me about","answer":"Retro handheld consoles"}]',NULL,NULL,0,NULL,1,0,'2026-09-06T06:16:59.189Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('e-yXTHs6PcH9T-UsjhUY5','Amara Okafor','amara.okafor@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL,1,1,1,1,1,1);
INSERT INTO "guests" VALUES('VJv7TkFuM65FVq6naWCzX','Sofía Martínez','sofia.martinez@example.com',NULL,NULL,'She/Her',1,1,1,NULL,NULL,NULL,NULL,1,'scrypt$P4tb0mCeIAzb3jVxvo+SvA==$ejWNL7F966ND6d7eIdyo5PZ8XOFl2ZAn+NhXCf8z7mA=',1,0,'2026-09-04T16:16:59.230Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('TMwyO35bGPgDkc-FGoPC-','Wei Chen','wei.chen@example.com','Platform engineer focused on developer experience.

Previously built CI tooling at a fintech startup in Shanghai. Ask me about `pipeline caching`.','/media/avatars/TMwyO35bGPgDkc-FGoPC-.webp?v=1788891419190',NULL,1,1,1,'Shanghai, China','[{"prompt":"Ask me about","answer":"Build caching strategies that hold up under real CI load"}]','["Mandarin Chinese","English"]','[{"type":"telegram","value":"@weichen_dev"}]',1,'scrypt$BEw98L1dVVHOTgyly99JlA==$vDyQovmVMNWUAToQGv6BflQFCZ+wMh9O+fl+pT3xABs=',1,0,'2026-09-03T21:16:59.221Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('8QKBuH6l4CQk76FLe_S7M','Priya Sharma','priya.sharma@example.com','ML researcher from Bengaluru working on **fairness in recommendation systems**.

*First time at this conference* — say hi if you see me wandering around looking lost!','/media/avatars/8QKBuH6l4CQk76FLe_S7M.webp?v=1788891419190','She/Her',1,1,1,'Bengaluru, India','[{"prompt":"Ask me about","answer":"Fairness metrics for recommender systems"},{"prompt":"Looking for","answer":"A conference buddy — this is my first time here!"}]','["Hindi","Kannada","English"]','[{"type":"website","value":"https://priyasharma.example.com"}]',0,NULL,1,0,'2026-09-03T02:16:59.190Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('MVMnWjk26J_TG4aPxi2zT','Lars Eriksson','lars.eriksson@example.com','Backend developer from Gothenburg. In rough order of enthusiasm:

- Rust
- saunas
- Kubernetes (reluctantly)','/media/avatars/MVMnWjk26J_TG4aPxi2zT.webp?v=1788891419190','He/Him',1,1,1,'Gothenburg, Sweden','[{"prompt":"Offering","answer":"Strong opinions about Rust, mild opinions about saunas"}]','["Swedish","English"]','[{"type":"signal","value":"lars.eriksson.99"}]',1,'scrypt$aDk8PJgHXUe/zYwsA0ogRw==$6hYFtqw8fzbcYhNwWMhl/Toil2lOfm4E8CtVpvxWIwY=',1,0,'2026-09-02T07:16:59.235Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('_eafQ_Lu-VTSTvrjNGxr0','Fatima Al-Farsi','fatima.alfarsi@example.com','Security engineer from Muscat. I break things *professionally* and fix them as a hobby. Happy to chat about threat modeling for small teams.','/media/avatars/_eafQ_Lu-VTSTvrjNGxr0.webp?v=1788891419191',NULL,1,1,1,'Muscat, Oman','[{"prompt":"Ask me about","answer":"Threat modeling for teams too small to have a security hire"}]','["Arabic","English"]','[{"type":"email","value":"fatima.breaks.things@example.com"}]',1,'scrypt$0P3edPvPAFvcmH5vr0Mu9A==$HOgmxsOZ3Eo6vma8las+9Q8PYkAdxUW1RkfWS65stbo=',1,0,'2026-09-01T12:16:59.223Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('y6R-UbAIvgShxPDtT5wF3','Kwame Mensah','kwame.mensah@example.com','Founder of a small agritech company in Accra. Interested in offline-first apps and building for low-bandwidth environments.','/media/avatars/y6R-UbAIvgShxPDtT5wF3.webp?v=1788891419193','He/Him',1,1,1,'Accra, Ghana','[{"prompt":"Offering","answer":"War stories about building for 2G networks"}]','["Twi","English"]','[{"type":"whatsapp","value":"+233 24 555 0187"}]',1,'scrypt$F2rZxPQnn2HH7CJW5O1nNA==$JFa78jaOtM3XTIMAGL9T453xDWokk6jb5uQ3zl8+R9k=',1,0,'2026-08-31T17:16:59.250Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('-iOLg-PYelc-CR4X_F5-K','Hiroshi Yamamoto','hiroshi.yamamoto@example.com','Embedded systems engineer. I make LEDs blink for a living and I''m not ashamed of it.','/media/avatars/-iOLg-PYelc-CR4X_F5-K.webp?v=1788891419193',NULL,1,1,1,'Yokohama, Japan','[{"prompt":"My weirdest skill","answer":"Debugging a blinking LED by ear"}]','["Japanese"]',NULL,1,'scrypt$E8L3HS+crUFwRhAUjGuH6Q==$R6Hx+uyLMRplRchS0rgbBhhRFsJff7AmKiFnDJyW5uE=',1,0,'2026-08-30T22:16:59.252Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('CgW1YSth1u4WK-2oDhY83','Aisha Diallo','aisha.diallo@example.com','UX researcher from Dakar, currently based in Berlin. I care deeply about research ethics and multilingual interfaces.','/media/avatars/CgW1YSth1u4WK-2oDhY83.webp?v=1788891419193','She/Her',1,1,1,'Berlin, Germany','[{"prompt":"Ask me about","answer":"Research ethics for multilingual user studies"}]','["French","Wolof","English","German"]','[{"type":"website","value":"https://aishadiallo.example.com"},{"type":"other","label":"Mastodon","value":"@aisha@ux.social"}]',1,'scrypt$pscarPLc8OXd3inTyvZ+iw==$OFFrXtQviK/CMkxB4LaFcn4WVlqvVbQEjRLLtiX2UmM=',1,0,'2026-08-30T03:16:59.259Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('S64cWBuxSlVix39BvZluz','Diego Fernández','diego.fernandez@example.com','Site reliability engineer from Buenos Aires. On-call survivor, incident retrospective enthusiast, tango dancer on weekends.','/media/avatars/S64cWBuxSlVix39BvZluz.webp?v=1788891419194',NULL,1,1,1,'Buenos Aires, Argentina','[{"prompt":"Offering","answer":"A rundown of the worst incident I ever caused, for entertainment purposes"}]','["Spanish","English"]','[{"type":"telegram","value":"@diego_sre"}]',1,'scrypt$6+Mfs3TvWaNJGZpS4RqCoQ==$FA504B8M0TrOmqs2awm8HXiwx18SFtSlsZ9q01A+t84=',1,0,'2026-08-29T08:16:59.264Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('sKMgWCotyzMq1f56--oMk','Mei-Ling Wu','meiling.wu@example.com','Technical writer from Taipei. I turn engineering mumbling into documentation people actually read.','/media/avatars/sKMgWCotyzMq1f56--oMk.webp?v=1788891419194','She/Her',1,1,1,'Taipei, Taiwan','[{"prompt":"Ask me about","answer":"Turning a wall of Slack threads into docs people read"}]','["Mandarin Chinese","English"]',NULL,1,'scrypt$UCQY0c3QthtjyHcnUSue3Q==$53RmKpKUVCMpWjFu/8JJDCokAi5YmOPtdR5RfOeQQVA=',1,0,'2026-08-28T13:16:59.284Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('WxjmYVAi3tK2RgRv2ufeV','Olga Petrova','olga.petrova@example.com','Database internals nerd. If your query is slow I want to hear about it in excruciating detail.','/media/avatars/WxjmYVAi3tK2RgRv2ufeV.webp?v=1788891419194',NULL,1,1,1,'Novosibirsk, Russia','[{"prompt":"Offering","answer":"A very detailed opinion about your slow query, whether you want it or not"}]','["Russian","English"]','[{"type":"email","value":"olga.petrova.db@example.com"}]',1,'scrypt$KVGkq+8Rl+imJMI4Y2EuFQ==$ekIz9g5CzX3rzhclprqtN5bTH6dUKHBWkyFNxywyvR8=',1,0,'2026-08-27T18:16:59.286Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('5qZM4tI841iJy3W89QvIJ','Jean-Pierre Dubois','jeanpierre.dubois@example.com','Engineering manager from Lyon. Interested in sustainable pace, team topologies, and where to find decent cheese near the venue.','/media/avatars/5qZM4tI841iJy3W89QvIJ.webp?v=1788891419194','He/Him',1,1,1,'Lyon, France','[{"prompt":"Looking for","answer":"Cheese recommendations near the venue"}]','["French","English"]','[{"type":"whatsapp","value":"+33 6 12 34 56 78"}]',0,NULL,1,0,'2026-08-26T23:16:59.194Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('0LMe8d1wk8MKVFi8xqbc-','Thabo Ndlovu','thabo.ndlovu@example.com','Full-stack developer from Johannesburg working in civic tech. Building tools that help people navigate public services.','/media/avatars/0LMe8d1wk8MKVFi8xqbc-.webp?v=1788891419195',NULL,1,1,1,'Johannesburg, South Africa','[{"prompt":"Ask me about","answer":"Building civic tech that survives contact with real government data"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-26T04:16:59.195Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('FRco957sXUlZiQxRhMTk1','Anna Kowalska','anna.kowalska@example.com','QA engineer from Kraków. I find the bugs you swore were impossible.

Also: board game collector, **200+ and counting**.','/media/avatars/FRco957sXUlZiQxRhMTk1.webp?v=1788891419195','She/Her',1,1,1,'Kraków, Poland','[{"prompt":"Offering","answer":"Trades: I''ll find your worst bug for a board game recommendation"}]','["Polish","English"]','[{"type":"discord","value":"anna.qa"}]',0,NULL,1,0,'2026-08-25T09:16:59.195Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('otumnw13-zuz710X66T6D','Mohammed El-Sayed','mohammed.elsayed@example.com','Cloud architect from Cairo. Recovering microservices maximalist — ask me about the monolith we happily went back to.','/media/avatars/otumnw13-zuz710X66T6D.webp?v=1788891419195',NULL,1,1,1,'Cairo, Egypt','[{"prompt":"A hill I will die on","answer":"Boring architecture beats clever architecture, every time"}]','["Arabic","English"]',NULL,0,NULL,1,0,'2026-08-24T14:16:59.195Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('cvViWkjK94CO4UXI59bMg','Isabella Rossi','isabella.rossi@example.com','Design lead from Milan. I bridge the gap between Figma and production, one design token at a time.','/media/avatars/cvViWkjK94CO4UXI59bMg.webp?v=1788891419195','She/Her',1,1,1,'Milan, Italy','[{"prompt":"Ask me about","answer":"Getting design tokens to survive contact with production"}]','["English","French"]','[{"type":"website","value":"https://isabellarossi.example.com"}]',0,NULL,1,0,'2026-08-23T19:16:59.195Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('EWf92Tq3hSWbCnwZF_gXk','Min-jun Kim','minjun.kim@example.com','Game developer from Seoul, moonlighting in web tech. Fascinated by real-time collaboration and CRDTs.','/media/avatars/EWf92Tq3hSWbCnwZF_gXk.webp?v=1788891419196','They/Them',1,1,1,'Seoul, South Korea','[{"prompt":"Currently obsessed with","answer":"CRDTs, and why conflict-free replication is harder than it sounds"}]','["Korean","English"]','[{"type":"discord","value":"minjunkim"}]',0,NULL,1,0,'2026-08-23T00:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('XY9PuqahecxoNFZq3eayA','Carlos Silva','carlos.silva@example.com','DevOps engineer from Porto. I automate myself out of a job roughly once a year and somehow still have one.','/media/avatars/XY9PuqahecxoNFZq3eayA.webp?v=1788891419196',NULL,1,1,1,'Porto, Portugal','[{"prompt":"Offering","answer":"A talk about automating yourself out of a job, repeatedly"}]','["Portuguese","English"]',NULL,0,NULL,1,0,'2026-08-22T05:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('W1CGkv8V4tYDIHKx9_O_W','Nadia Haddad','nadia.haddad@example.com','Mobile developer from Beirut. Flutter by day, native by necessity. Organizer of a local women-in-tech mentoring circle.',NULL,'She/Her',1,1,1,'Beirut, Lebanon','[{"prompt":"Looking for","answer":"Mentors and mentees for a women-in-tech circle back home"}]','["Arabic","French","English"]','[{"type":"other","label":"Instagram","value":"@nadia.builds"}]',0,NULL,1,0,'2026-08-21T10:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('fi_8fZO3-RwyxSOlAId4g','Freya Nielsen','freya.nielsen@example.com','Accessibility consultant from Copenhagen. Screen reader power user. I will happily audit your conference talk slides.',NULL,NULL,1,1,1,'Copenhagen, Denmark','[{"prompt":"Offering","answer":"A free accessibility pass on your slides — bring your laptop"}]','["Danish","English"]','[{"type":"email","value":"freya.a11y@example.com"}]',0,NULL,1,0,'2026-08-20T15:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('D1hCRrolteRhGfbdoLxXy','Arjun Nair','arjun.nair@example.com','Distributed systems engineer from Kochi. Currently obsessed with consensus protocols and filter coffee, in that order.',NULL,'He/Him',1,1,1,'Kochi, India','[{"prompt":"Currently obsessed with","answer":"Consensus protocols, and where filter coffee ranks among them"}]','["Malayalam","English"]',NULL,0,NULL,1,0,'2026-08-19T20:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('iy2yD5_tSIsixmTgpsNpy','Elif Yılmaz','elif.yilmaz@example.com','Computer science student from Istanbul, here on a scholarship ticket. Excited about everything, please recommend me sessions!',NULL,NULL,1,1,1,'Istanbul, Turkey','[{"prompt":"Looking for","answer":"Session recommendations — I''m new here and excited about everything"}]','["Turkish","English"]',NULL,0,NULL,1,0,'2026-08-19T01:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('uQpQIf84U5tZa1y8xb16Y','Samuel Adeyemi','samuel.adeyemi@example.com','Backend engineer from Ibadan working on payment infrastructure across West Africa.',NULL,NULL,1,1,1,'Ibadan, Nigeria',NULL,'["Yoruba","English"]',NULL,0,NULL,1,0,'2026-08-18T06:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('_U51msK4jornrFgQyg3MW','Linh Nguyen','linh.nguyen@example.com','Freelance web developer from Ho Chi Minh City. Jamstack fan, static site generator connoisseur, occasional conference speaker.',NULL,'They/Them',1,1,1,'Ho Chi Minh City, Vietnam','[{"prompt":"Offering","answer":"Static site generator recommendations, unsolicited and opinionated"}]','["Vietnamese","English"]','[{"type":"telegram","value":"@linh_jamstack"}]',0,NULL,1,0,'2026-08-17T11:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('dTFo3Jnrjd6t66UB7o0zU','Marta Horvat','marta.horvat@example.com','Agile coach from Zagreb. Yes, we can talk about whether estimates are worth it. No, we won''t agree.',NULL,NULL,1,1,1,'Zagreb, Croatia','[{"prompt":"A hill I will die on","answer":"Estimates are a communication tool, not a promise"}]','["Croatian","English"]',NULL,0,NULL,1,0,'2026-08-16T16:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('fklWHIi2n0xjZ4PBRc_V4','Dmitri Volkov','dmitri.volkov@example.com','Compiler engineer. I read language specs for fun and I''m told this is concerning.',NULL,NULL,1,1,1,NULL,'[{"prompt":"My weirdest skill","answer":"Reading language specs for fun, apparently"}]',NULL,NULL,0,NULL,1,0,'2026-08-15T21:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('A0I-G-uWpciyMueS9JxQ-','Chiara Bianchi','chiara.bianchi@example.com','Data scientist from Bologna working in public health. Interested in reproducible research and open data.',NULL,'She/Her',1,1,1,'Bologna, Italy','[{"prompt":"Ask me about","answer":"Making public health research reproducible without a data team"}]',NULL,'[{"type":"website","value":"https://chiarabianchi.example.com"}]',0,NULL,1,0,'2026-08-15T02:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('QUNxetzvBuqS5LC-YJbVO','Zanele Khumalo','zanele.khumalo@example.com','Frontend developer from Durban. CSS is my love language. Currently deep-diving into container queries.',NULL,NULL,1,1,1,'Durban, South Africa','[{"prompt":"Offering","answer":"Container query wizardry, upon request"}]','["Zulu","English"]',NULL,0,NULL,1,0,'2026-08-14T07:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('pr5D-yEw215TtcJLb-Bnh','Rafael Souza','rafael.souza@example.com','Engineering lead from São Paulo. I care about:

1. Mentoring junior devs
2. Building teams where questions are welcome
3. Coffee, not necessarily in that order',NULL,NULL,1,1,1,'São Paulo, Brazil','[{"prompt":"Offering","answer":"Mentoring conversations for junior devs finding their footing"}]','["Portuguese","English"]','[{"type":"website","value":"https://rafaelsouza.example.com"}]',0,NULL,1,0,'2026-08-13T12:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('cAq5a5RQYt7sKvN5wbvW8','Hana Kobayashi','hana.kobayashi@example.com','# Hi, I''m Hana!

Developer advocate based in Kyoto. I write tutorials, give talks, and collect conference stickers *competitively*.','/media/avatars/cAq5a5RQYt7sKvN5wbvW8.webp?v=1788891419196','She/Her',1,1,1,'Kyoto, Japan','[{"prompt":"I collect","answer":"Conference stickers, competitively"}]','["Japanese","English"]','[{"type":"website","value":"https://hanakobayashi.example.com"},{"type":"other","label":"Bluesky","value":"@hanak.dev"}]',0,NULL,1,0,'2026-08-12T17:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('tvwQ1sGC1hAqQwOKSJFIt','Tereza Nováková','tereza.novakova@example.com','Open source maintainer from Prague — see [my projects](https://github.example.com/tereza). Ask me about sustainable maintainership, or just send `git help`, either works.',NULL,NULL,1,1,1,'Prague, Czechia','[{"prompt":"Ask me about","answer":"Sustainable maintainership for projects that outlive their funding"}]','["Czech","English"]','[{"type":"website","value":"https://github.example.com/tereza"}]',0,NULL,1,0,'2026-08-11T22:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('IbjHTKBrAmzMoaPqkXz1h','Ahmad Karimi','ahmad.karimi@example.com','Software engineer from Tehran, now in Amsterdam. Working on developer tooling and learning Dutch, slowly.',NULL,'He/Him',1,1,1,'Amsterdam, Netherlands','[{"prompt":"Currently obsessed with","answer":"Developer tooling, and slowly learning Dutch"}]','["Persian","Dutch","English"]',NULL,0,NULL,1,0,'2026-08-11T03:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('_4CD5YXbM-Kruw1_f2paY','Maria Papadopoulou','maria.papadopoulou@example.com','Tech lead from Thessaloniki. Legacy code whisperer. Strong opinions on testing, loosely held on everything else.',NULL,NULL,1,1,1,'Thessaloniki, Greece','[{"prompt":"Offering","answer":"Loosely held opinions on everything except testing"}]','["Greek","English"]',NULL,0,NULL,1,0,'2026-08-10T08:16:59.196Z',1,1,1,1,1,1);
INSERT INTO "guests" VALUES('BJDIY2uATPEPXM3yDx-ZO','Mateo Quispe','mateo.quispe@example.com',NULL,NULL,NULL,1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,NULL,1,1,1,1,1,1);
INSERT INTO "guests" VALUES('Ukahzcxq4tVlAS70ytr_m','Leilani Kahale','leilani.kahale@example.com',NULL,NULL,'She/They',1,1,1,NULL,NULL,NULL,NULL,0,NULL,1,0,'2026-08-08T18:16:59.196Z',1,1,1,1,1,1);
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
INSERT INTO "days" VALUES('hVE1pIKSvYrFuvGnkzjGX','2026-10-20T07:00:00.000Z','2026-10-20T16:00:00.000Z','2026-10-20T07:00:00.000Z','2026-10-20T15:30:00.000Z','vDpIksoQEmvZ45H2j0PEq');
INSERT INTO "days" VALUES('8zz-wO6Wx7KFwSBvvZkPa','2026-10-21T07:00:00.000Z','2026-10-21T16:00:00.000Z','2026-10-21T07:00:00.000Z','2026-10-21T15:30:00.000Z','vDpIksoQEmvZ45H2j0PEq');
INSERT INTO "days" VALUES('Oxem-1WwwTBWNel8Q-cdw','2026-10-22T07:00:00.000Z','2026-10-22T16:00:00.000Z','2026-10-22T07:00:00.000Z','2026-10-22T15:30:00.000Z','vDpIksoQEmvZ45H2j0PEq');
INSERT INTO "days" VALUES('o9nEF9as2xQXbdG2iSp1X','2026-10-06T07:00:00.000Z','2026-10-06T16:00:00.000Z','2026-10-06T07:00:00.000Z','2026-10-06T15:30:00.000Z','Rt3UVc16Wmx7VD1-Ugzvy');
INSERT INTO "days" VALUES('dFXNOEs1cG8Z85I5MhUeU','2026-10-07T07:00:00.000Z','2026-10-07T16:00:00.000Z','2026-10-07T07:00:00.000Z','2026-10-07T15:30:00.000Z','Rt3UVc16Wmx7VD1-Ugzvy');
INSERT INTO "days" VALUES('UkiUJXV6MFKs92Z4WH6AT','2026-10-08T07:00:00.000Z','2026-10-08T16:00:00.000Z','2026-10-08T07:00:00.000Z','2026-10-08T15:30:00.000Z','Rt3UVc16Wmx7VD1-Ugzvy');
INSERT INTO "days" VALUES('tpd5CUC2RnTqAxsqI198Q','2026-09-22T07:00:00.000Z','2026-09-22T16:00:00.000Z','2026-09-22T07:00:00.000Z','2026-09-22T15:30:00.000Z','SP0cKZnzLKO0kR0q-jzYX');
INSERT INTO "days" VALUES('D1eptFHC_W4IvH_i-3XZQ','2026-09-23T07:00:00.000Z','2026-09-23T16:00:00.000Z','2026-09-23T07:00:00.000Z','2026-09-23T15:30:00.000Z','SP0cKZnzLKO0kR0q-jzYX');
INSERT INTO "days" VALUES('-KmVTSWL961VANtnX1PJu','2026-09-24T07:00:00.000Z','2026-09-25T01:00:00.000Z','2026-09-24T07:00:00.000Z','2026-09-25T00:30:00.000Z','SP0cKZnzLKO0kR0q-jzYX');
CREATE TABLE "event_guests" (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','S64cWBuxSlVix39BvZluz');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','sKMgWCotyzMq1f56--oMk');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','otumnw13-zuz710X66T6D');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','cvViWkjK94CO4UXI59bMg');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','XY9PuqahecxoNFZq3eayA');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','_U51msK4jornrFgQyg3MW');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','A0I-G-uWpciyMueS9JxQ-');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "event_guests" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','S64cWBuxSlVix39BvZluz');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','sKMgWCotyzMq1f56--oMk');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','otumnw13-zuz710X66T6D');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','cvViWkjK94CO4UXI59bMg');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','XY9PuqahecxoNFZq3eayA');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_U51msK4jornrFgQyg3MW');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','A0I-G-uWpciyMueS9JxQ-');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "event_guests" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','S64cWBuxSlVix39BvZluz');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','sKMgWCotyzMq1f56--oMk');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','otumnw13-zuz710X66T6D');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','cvViWkjK94CO4UXI59bMg');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','XY9PuqahecxoNFZq3eayA');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','_U51msK4jornrFgQyg3MW');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','A0I-G-uWpciyMueS9JxQ-');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "event_guests" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m');
CREATE TABLE "event_locations" (
	`event_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`event_id`, `location_id`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-main-hall');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-room-a');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-room-b');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-library');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-boardroom');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-auditorium');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-courtyard');
INSERT INTO "event_locations" VALUES('vDpIksoQEmvZ45H2j0PEq','loc-rooftop');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-main-hall');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-room-a');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-room-b');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-library');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-boardroom');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-auditorium');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-courtyard');
INSERT INTO "event_locations" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','loc-rooftop');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-main-hall');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-room-a');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-room-b');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-library');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-boardroom');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-auditorium');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-courtyard');
INSERT INTO "event_locations" VALUES('SP0cKZnzLKO0kR0q-jzYX','loc-rooftop');
CREATE TABLE "proposal_hosts" (
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`proposal_id`, `guest_id`),
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_hosts" VALUES('JxY8ECwYzldhpL3Sp-CTC','EituNjAB_WjHf315o6FgB');
INSERT INTO "proposal_hosts" VALUES('u2GxGKKLO7LI7lhtxoD3v','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('oZeNJqGqYSPpVz9lyaatQ','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "proposal_hosts" VALUES('ohJveJ5nNXm1HZQNRNYOc','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "proposal_hosts" VALUES('ohJveJ5nNXm1HZQNRNYOc','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "proposal_hosts" VALUES('QdRQ1cpp3fMGnovzRmNcw','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "proposal_hosts" VALUES('QdRQ1cpp3fMGnovzRmNcw','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "proposal_hosts" VALUES('BRHuD8rd0gmMm6HvD4v8t','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "proposal_hosts" VALUES('xbcktvUJDyZ64UTeicxR9','EituNjAB_WjHf315o6FgB');
INSERT INTO "proposal_hosts" VALUES('OOus7GxX0gxtjPlHhrIUG','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "proposal_hosts" VALUES('w9cT9xzzGuPA6KpsAWnmG','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('bAU_FKrFGtcSQJyJnD4ay','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "proposal_hosts" VALUES('uV2Of6uGO5sHvSlVZ49ie','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('iljH2Px3FAXN_oJLuOvUE','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "proposal_hosts" VALUES('iljH2Px3FAXN_oJLuOvUE','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "proposal_hosts" VALUES('j2akcbMh0JJ8wAxde1uw4','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "proposal_hosts" VALUES('BNFllQU_Xmue9vQlzfz7B','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "proposal_hosts" VALUES('RgipdU4xEAak-NTzJN6B3','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "proposal_hosts" VALUES('yNvKzUXq9oedAgkHhjjj9','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "proposal_hosts" VALUES('yNvKzUXq9oedAgkHhjjj9','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "proposal_hosts" VALUES('mekOzr3xMfzfuIHN6c4TC','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "proposal_hosts" VALUES('huKvMp05N5DD6nT4NjBkj','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "proposal_hosts" VALUES('2YhS8uDJhlgrXrARbDICW','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('720_x4irTIRtaH2b_cW5t','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "proposal_hosts" VALUES('kcU4otJXhCSIbUkNU1Ai1','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('cz5nOCwYvAwezNDZD2A3R','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "proposal_hosts" VALUES('T-xYPrvKKFryUUI4uOplr','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "proposal_hosts" VALUES('DFVSLmJHZiI2F4C6hgQvQ','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "proposal_hosts" VALUES('V-TKZyCNbPUm1zp2vrGyB','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "proposal_hosts" VALUES('5YYnHgPqxkpfxnaB6B0Dp','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "proposal_hosts" VALUES('jwi9s0Q3537QyDqMFCOqg','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "proposal_hosts" VALUES('8rcQtiTCRLPJ5phQLAikj','cvViWkjK94CO4UXI59bMg');
INSERT INTO "proposal_hosts" VALUES('TJB63B73ewez4_ilCVYHH','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "proposal_hosts" VALUES('wuZCyW47zQhn3I8dcMazB','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "proposal_hosts" VALUES('ezquWRqfCSq0Ehr47gXRf','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "proposal_hosts" VALUES('OP3Yn69HegT8fHMkcVBCk','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "proposal_hosts" VALUES('4v9cdFB0yfSWO_5eYBySq','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "proposal_hosts" VALUES('mrT7aqyQvcGfD2zlHA8wT','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "proposal_hosts" VALUES('ayKLrK_auZU_a8zC-CmQo','XY9PuqahecxoNFZq3eayA');
INSERT INTO "proposal_hosts" VALUES('PNzKCaNbOcez6Y5kmFmLA','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "proposal_hosts" VALUES('PNzKCaNbOcez6Y5kmFmLA','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "proposal_hosts" VALUES('Vk99eBmo99DZmka02C1TA','otumnw13-zuz710X66T6D');
INSERT INTO "proposal_hosts" VALUES('2X60eLDXi0C9nCkPlGxZp','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "proposal_hosts" VALUES('mDUkRFD2oPZaA1Vl3ZbHk','S64cWBuxSlVix39BvZluz');
INSERT INTO "proposal_hosts" VALUES('5ramGIUUZ66OYlc0E0VQx','_eafQ_Lu-VTSTvrjNGxr0');
CREATE TABLE "rsvps" (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "rsvps" VALUES('x08aHUHGljpu4hGLktEMU','6M3_cr1tJafC7uRmLgygB','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('YUx6tvlC9fTCbNIkyalMy','XMhmMhtXQfBh0Vb_tQc0p','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('Ey1DJfd6eIbLgVngCzvBv','RIymtbpXgboYkoKfJZRTn','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('bTcntRUXDtd5CKsDTjqSD','jjedCBwvEqvF_-vepNGKP','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('cLaOMAThbGyZRwdFoXnFk','wx0BJmOqnvetENmzB_gOb','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('UGoF_NzJDijRJJYdBHnKU','jDCd-xcVZZ5MuXez7UuOJ','EituNjAB_WjHf315o6FgB');
INSERT INTO "rsvps" VALUES('MCPN-3IQmgulcE_RH-2mZ','qDmCY2BaGQ7d649mAc6bq','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "rsvps" VALUES('ClN8avhUPDPZOvYLyZyPg','vB8yBCiFnhRUQ7147QEPC','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "rsvps" VALUES('t89D2SZm2JLfSEM7gT0Be','gOsG5aiZEF7H0B5DcbHYk','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "rsvps" VALUES('hRMWT9_2ht8GvRfBzyd5s','Gxx2wauoVzRCuneBwVriG','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "rsvps" VALUES('0Y506OgWhysFcZcCIdWwk','XMhmMhtXQfBh0Vb_tQc0p','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "rsvps" VALUES('Lywm0ban4_NznJDP64QBY','RIymtbpXgboYkoKfJZRTn','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "rsvps" VALUES('HxRwo-rYPlXam5JZsMlqk','2iJoekkgiXrHgm-vGfpZI','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "rsvps" VALUES('Bpu9zDS8OQgVSejPHqbyo','jjedCBwvEqvF_-vepNGKP','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "rsvps" VALUES('TvE25kfw9WzqKDAXvMD-l','HqF2KLl-_bzBazdIbA0Ua','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "rsvps" VALUES('Utu-PfeLchtL8_jyfA4xL','gOsG5aiZEF7H0B5DcbHYk','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "rsvps" VALUES('-Q2pkEJGJJ6MLHfO8t2uw','Gxx2wauoVzRCuneBwVriG','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "rsvps" VALUES('fQp4UVcxF0ualKRZ0IewK','jjedCBwvEqvF_-vepNGKP','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "rsvps" VALUES('Zus6ijSyQwbyJPPnHZCrJ','a3PKs-Cm4Zpyj-AO9-dbo','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "rsvps" VALUES('mzv9Wo1zbyqWLQLmOCkpu','HqF2KLl-_bzBazdIbA0Ua','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "rsvps" VALUES('uM1FMfyTSQVKy22DgwOfo','6M3_cr1tJafC7uRmLgygB','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('pVsKDzzD5koU5LUMsdX8D','vB8yBCiFnhRUQ7147QEPC','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('1YzYbgyqrKptVeUvbzBhJ','igagFQjs3rJf_v-puzdJk','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('WeupPeQJvLjOFREIO1X1G','2iJoekkgiXrHgm-vGfpZI','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('JqDIEJnGDuuJd60Lk5TaX','TycMjOkIgVANONwk_hBgz','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('DGI60s4f3tIh5B_NkhzUq','wx0BJmOqnvetENmzB_gOb','e-yXTHs6PcH9T-UsjhUY5');
INSERT INTO "rsvps" VALUES('VA6gr_yP0PEyvA5Gx-Xwg','vB8yBCiFnhRUQ7147QEPC','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('37Mw3-Z0OPD2PGU1FThla','qQnfyYF2IPT_EW5pKYHvU','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('Kj-k11hueiMqTyOXti_fV','2iJoekkgiXrHgm-vGfpZI','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('tRhwgo3gDssB1NedlD5RT','jjedCBwvEqvF_-vepNGKP','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('nB5TfhOPmN9E9Ag3sVLJ3','a3PKs-Cm4Zpyj-AO9-dbo','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('6E71F4lVO8hR4KpjaGHoJ','sSwHK9VashAV2CgBZClTC','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('aBLLf_m2ZUCP2PRU5hP2K','wx0BJmOqnvetENmzB_gOb','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "rsvps" VALUES('tHRaD0ro2MZ12_9pgX32Z','-rrMZwQ2UrDAjiJC4N2uY','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('cx6w2K_uxVypO6eCz4jHP','RIymtbpXgboYkoKfJZRTn','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('USRTDOgXF_lRCP49i4bvp','vB8yBCiFnhRUQ7147QEPC','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('RBW6QAOxJK8YNNQ01XEw9','2iJoekkgiXrHgm-vGfpZI','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('_ORNN_jlq6CRNh9ajMJHW','jjedCBwvEqvF_-vepNGKP','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('EieigoI0OTr8zJ_tnZCe9','jDCd-xcVZZ5MuXez7UuOJ','TMwyO35bGPgDkc-FGoPC-');
INSERT INTO "rsvps" VALUES('Kqbfrh66dTdiGh_ZF4zUE','XMhmMhtXQfBh0Vb_tQc0p','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "rsvps" VALUES('5LJvbRH-vH2NLMOlPCLb8','qDmCY2BaGQ7d649mAc6bq','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "rsvps" VALUES('04VyUp8IdU61ONf-tw-h1','gOsG5aiZEF7H0B5DcbHYk','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "rsvps" VALUES('2SRa0PT66kl5Vxjses7PO','a3PKs-Cm4Zpyj-AO9-dbo','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "rsvps" VALUES('LUTlVXCqwXcak9u988Ujt','HqF2KLl-_bzBazdIbA0Ua','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "rsvps" VALUES('TAAGLGiAzi6C2tvDUYrlu','-rrMZwQ2UrDAjiJC4N2uY','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('gVxj7rChCxoclTfjrcpfM','qDmCY2BaGQ7d649mAc6bq','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('F7LfA3HonXYDxg-CpsaC5','qQnfyYF2IPT_EW5pKYHvU','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('aB7xDRsUSYXaIkLeaPkOf','jjedCBwvEqvF_-vepNGKP','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('Q5RCJ8sRGbnyYoaDo1YRU','a3PKs-Cm4Zpyj-AO9-dbo','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('QGUT9EUSQfQqV1OdvSSwM','HqF2KLl-_bzBazdIbA0Ua','MVMnWjk26J_TG4aPxi2zT');
INSERT INTO "rsvps" VALUES('t2uVtHgzhS2A80qIkSFVx','6M3_cr1tJafC7uRmLgygB','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "rsvps" VALUES('4KxWMyLeYkPfQqpDqgtjD','vB8yBCiFnhRUQ7147QEPC','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "rsvps" VALUES('bxXN4BBihL6S0UEZWYEqT','2iJoekkgiXrHgm-vGfpZI','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "rsvps" VALUES('K6-xWvovORSZTSqgOULp-','sSwHK9VashAV2CgBZClTC','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "rsvps" VALUES('Vz5zvwC32m9SKe8UyyiPk','-rrMZwQ2UrDAjiJC4N2uY','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "rsvps" VALUES('u6aRBe7oZO1jAXA3Z8BbK','RIymtbpXgboYkoKfJZRTn','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "rsvps" VALUES('Islab2qhZmp7LR7fR_hNU','Gxx2wauoVzRCuneBwVriG','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "rsvps" VALUES('JKQ4iltZ_YGmzaaAvvQMx','jDCd-xcVZZ5MuXez7UuOJ','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "rsvps" VALUES('nGNcimq5M099IeAEAELoO','XMhmMhtXQfBh0Vb_tQc0p','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('UOi-3bOHrGHrdGa1XwnfZ','RIymtbpXgboYkoKfJZRTn','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('VR1iSYUGXxmg6vXIIjjw6','qQnfyYF2IPT_EW5pKYHvU','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('EC9Gsnmhcj40YFU8WBEbl','2iJoekkgiXrHgm-vGfpZI','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('1ycOpmNeD_YFbSD71qJwS','TycMjOkIgVANONwk_hBgz','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('0Kwhcax96jH3-SNBxGRPH','HqF2KLl-_bzBazdIbA0Ua','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('UK-H0CyCKvDaw558m92PX','jDCd-xcVZZ5MuXez7UuOJ','-iOLg-PYelc-CR4X_F5-K');
INSERT INTO "rsvps" VALUES('XdIYHhVHF09oqgBRF9ZGi','RIymtbpXgboYkoKfJZRTn','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "rsvps" VALUES('Rc0SHzkTzgwlf0GjNoW29','igagFQjs3rJf_v-puzdJk','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "rsvps" VALUES('k4NTB5yyvBjZye6onwXB4','Gxx2wauoVzRCuneBwVriG','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "rsvps" VALUES('BlbYvaIDCHyuMKeHNGycD','a3PKs-Cm4Zpyj-AO9-dbo','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "rsvps" VALUES('BngMLecX_ue5CKSCxZ-rj','sSwHK9VashAV2CgBZClTC','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "rsvps" VALUES('OYmBNcuxhhd8NtZwPLfdV','6M3_cr1tJafC7uRmLgygB','S64cWBuxSlVix39BvZluz');
INSERT INTO "rsvps" VALUES('d4vWuktN-4qSlrtn2zON1','XMhmMhtXQfBh0Vb_tQc0p','S64cWBuxSlVix39BvZluz');
INSERT INTO "rsvps" VALUES('kNrKcE72D4iCPNZ9SHpz5','wx0BJmOqnvetENmzB_gOb','S64cWBuxSlVix39BvZluz');
INSERT INTO "rsvps" VALUES('rsHg4kfiHAumCIOvsjLVw','a3PKs-Cm4Zpyj-AO9-dbo','sKMgWCotyzMq1f56--oMk');
INSERT INTO "rsvps" VALUES('8dMhyuyQR6bY8sxGoDEUk','HqF2KLl-_bzBazdIbA0Ua','sKMgWCotyzMq1f56--oMk');
INSERT INTO "rsvps" VALUES('yX8kXvZsYsVqjxgm3gLWx','jDCd-xcVZZ5MuXez7UuOJ','sKMgWCotyzMq1f56--oMk');
INSERT INTO "rsvps" VALUES('bKIGD0LFcdZZtuO1sbQyN','-rrMZwQ2UrDAjiJC4N2uY','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "rsvps" VALUES('8wBuv9wszJOtlmFAiHFXp','igagFQjs3rJf_v-puzdJk','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "rsvps" VALUES('vHDRTiEoo-UChrc6cCLst','2iJoekkgiXrHgm-vGfpZI','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "rsvps" VALUES('rcYz6ZDZ0TLemTuwHQHiI','jjedCBwvEqvF_-vepNGKP','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "rsvps" VALUES('yHX9C0iq0fS2iAMdSJ1n0','6M3_cr1tJafC7uRmLgygB','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "rsvps" VALUES('yLzbPkNjrM56g5uylX7kD','2iJoekkgiXrHgm-vGfpZI','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "rsvps" VALUES('D_3Yj0YjUcz6VBBNTFSfV','jjedCBwvEqvF_-vepNGKP','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "rsvps" VALUES('0NSqXRnmcHKuZQh0DqkrP','HqF2KLl-_bzBazdIbA0Ua','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "rsvps" VALUES('_mASDTiY1gckdnIZlMtTK','wx0BJmOqnvetENmzB_gOb','5qZM4tI841iJy3W89QvIJ');
INSERT INTO "rsvps" VALUES('tdiSLInQPpCAJ4aRqoIv5','-rrMZwQ2UrDAjiJC4N2uY','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('7wvFfjFi-p9QnFRjzHTmR','qDmCY2BaGQ7d649mAc6bq','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('IRsSX3aDj2aa3A2uvcFUa','gOsG5aiZEF7H0B5DcbHYk','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('4seEEnFIXAPqZ3l29442K','TycMjOkIgVANONwk_hBgz','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('L9-zUH7_XBja-Tkfvr4KD','sSwHK9VashAV2CgBZClTC','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('Xg5732l1eGUkuJAe4Sk4S','jDCd-xcVZZ5MuXez7UuOJ','0LMe8d1wk8MKVFi8xqbc-');
INSERT INTO "rsvps" VALUES('pmubvBDQl7ofBo4PT6se8','6M3_cr1tJafC7uRmLgygB','FRco957sXUlZiQxRhMTk1');
INSERT INTO "rsvps" VALUES('w6jiFr7W0TDWxARwnor_P','XMhmMhtXQfBh0Vb_tQc0p','FRco957sXUlZiQxRhMTk1');
INSERT INTO "rsvps" VALUES('GghUB1UF5A6qeL0sjKbTk','a3PKs-Cm4Zpyj-AO9-dbo','FRco957sXUlZiQxRhMTk1');
INSERT INTO "rsvps" VALUES('lOo5ejf9pjYglgmfwddnu','wx0BJmOqnvetENmzB_gOb','FRco957sXUlZiQxRhMTk1');
INSERT INTO "rsvps" VALUES('yW6UJsOiPBtcpbN1RKi2d','XMhmMhtXQfBh0Vb_tQc0p','otumnw13-zuz710X66T6D');
INSERT INTO "rsvps" VALUES('aA8klTC1_JKLsEkH50L-c','qDmCY2BaGQ7d649mAc6bq','otumnw13-zuz710X66T6D');
INSERT INTO "rsvps" VALUES('DDbVPEw6rRs7ZauHudzvW','gOsG5aiZEF7H0B5DcbHYk','otumnw13-zuz710X66T6D');
INSERT INTO "rsvps" VALUES('IvMNmltib4iT1JZ1Z9nKq','HqF2KLl-_bzBazdIbA0Ua','otumnw13-zuz710X66T6D');
INSERT INTO "rsvps" VALUES('_6KOZuwjsWPh9E3bdy5bu','6M3_cr1tJafC7uRmLgygB','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('G5VEfE4rcPW5qFEamUbc3','XMhmMhtXQfBh0Vb_tQc0p','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('BKdb-NJVZNp7QFtcDwl-U','vB8yBCiFnhRUQ7147QEPC','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('1BTtAFlMoUWC7TD_N2iie','2iJoekkgiXrHgm-vGfpZI','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('RMRABgM9BGVME8JH8hvWl','jjedCBwvEqvF_-vepNGKP','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('XtzRo6a86GE9Xs5e079nU','sSwHK9VashAV2CgBZClTC','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('m9FMryKbb4zigSlmPxVOZ','wx0BJmOqnvetENmzB_gOb','cvViWkjK94CO4UXI59bMg');
INSERT INTO "rsvps" VALUES('HjydfUrcPx2NyUqf2pASl','qDmCY2BaGQ7d649mAc6bq','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('9pO19BZN9N4xhBF_QJUHQ','vB8yBCiFnhRUQ7147QEPC','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('O5huJlbqyHP9n90K7h2x0','igagFQjs3rJf_v-puzdJk','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('B7Ln2mrcApz630KlA2hhQ','2iJoekkgiXrHgm-vGfpZI','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('eYzCJ1B1z2k91i2IbEvSJ','sSwHK9VashAV2CgBZClTC','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('QwpZWrO3qXz_YyuxUhvBA','jDCd-xcVZZ5MuXez7UuOJ','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "rsvps" VALUES('HmJp5b4k0ri5-X6jn-a7M','6M3_cr1tJafC7uRmLgygB','XY9PuqahecxoNFZq3eayA');
INSERT INTO "rsvps" VALUES('5Es6skQztb6cXQyIW1pGD','-rrMZwQ2UrDAjiJC4N2uY','XY9PuqahecxoNFZq3eayA');
INSERT INTO "rsvps" VALUES('O7Qu2BpCTH_PiKX9fY99Q','qDmCY2BaGQ7d649mAc6bq','XY9PuqahecxoNFZq3eayA');
INSERT INTO "rsvps" VALUES('8xBJM6fPbDuSM4M_5jFRT','TycMjOkIgVANONwk_hBgz','XY9PuqahecxoNFZq3eayA');
INSERT INTO "rsvps" VALUES('pMop7SO4EL1qrB_BE5Lkr','wx0BJmOqnvetENmzB_gOb','XY9PuqahecxoNFZq3eayA');
INSERT INTO "rsvps" VALUES('sELbvzxewC9P7-4NBmhcH','qDmCY2BaGQ7d649mAc6bq','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('y1ERA6Jh__d3C5goviEIJ','igagFQjs3rJf_v-puzdJk','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('0dm1GpIM6qQcptLHNeGKE','Gxx2wauoVzRCuneBwVriG','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('zq8LpwP-UgLx05w7FBoE1','jjedCBwvEqvF_-vepNGKP','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('B1ToTb2ALGCn-6PlB7_lb','a3PKs-Cm4Zpyj-AO9-dbo','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('rrKwwmwEtTt283wu5BJeR','wx0BJmOqnvetENmzB_gOb','W1CGkv8V4tYDIHKx9_O_W');
INSERT INTO "rsvps" VALUES('z8VECk00y9P3-ePpymaJl','6M3_cr1tJafC7uRmLgygB','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('t3dvw9U--oBTSUwjNe59s','qDmCY2BaGQ7d649mAc6bq','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('CTEuGY-TYepzJ1fEWHLZV','vB8yBCiFnhRUQ7147QEPC','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('EZ5MhBXEOItiRy6EoKuq1','qQnfyYF2IPT_EW5pKYHvU','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('dCIv7AAC1YetCVHifn29t','Gxx2wauoVzRCuneBwVriG','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('78g3e4mvBhtk9yLneWjnV','TycMjOkIgVANONwk_hBgz','fi_8fZO3-RwyxSOlAId4g');
INSERT INTO "rsvps" VALUES('q0_p3RI2jN7jH5PZBAdOU','6M3_cr1tJafC7uRmLgygB','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "rsvps" VALUES('dPQs2SfByA_JTwYStwKrk','XMhmMhtXQfBh0Vb_tQc0p','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "rsvps" VALUES('aCbp_s56RszjKvzlU-AEr','qDmCY2BaGQ7d649mAc6bq','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "rsvps" VALUES('TwQJftsYF5zzqSii-HyLE','qQnfyYF2IPT_EW5pKYHvU','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "rsvps" VALUES('6EUUha5u3uhrmSWAFc2ey','a3PKs-Cm4Zpyj-AO9-dbo','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "rsvps" VALUES('Yxwyls7aDXRYr-_uvzTBE','6M3_cr1tJafC7uRmLgygB','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('Ct4J9Tm4CZMhJe-1sqN9G','gOsG5aiZEF7H0B5DcbHYk','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('dANm9vGbnJI1hzhoY8DNb','2iJoekkgiXrHgm-vGfpZI','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('qtT4A7omqDQlmoNeQeUGv','TycMjOkIgVANONwk_hBgz','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('b4MdQ_Exa2PbK5RQflg6A','sSwHK9VashAV2CgBZClTC','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('U6Thw3lE0N1kkIpEb_1CE','wx0BJmOqnvetENmzB_gOb','iy2yD5_tSIsixmTgpsNpy');
INSERT INTO "rsvps" VALUES('hNiIZkP2aP7nErhWifZ2m','6M3_cr1tJafC7uRmLgygB','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('73OoMFlZnOZmVLDbLGU9f','vB8yBCiFnhRUQ7147QEPC','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('2vdH5Xtb1Vot64yC5OW1V','igagFQjs3rJf_v-puzdJk','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('pgC41uVN5V9FJnaKSPEAw','gOsG5aiZEF7H0B5DcbHYk','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('lli67qdhPLyOwIoq0r98_','Gxx2wauoVzRCuneBwVriG','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('pj3mOsde8dDT8juGHpNsw','sSwHK9VashAV2CgBZClTC','uQpQIf84U5tZa1y8xb16Y');
INSERT INTO "rsvps" VALUES('4foJ1w9JG5aOivrbLMd6I','6M3_cr1tJafC7uRmLgygB','_U51msK4jornrFgQyg3MW');
INSERT INTO "rsvps" VALUES('1o-aG-RN7XT764KX36TF1','-rrMZwQ2UrDAjiJC4N2uY','_U51msK4jornrFgQyg3MW');
INSERT INTO "rsvps" VALUES('KutwWHoHgueBRM3AtwLpj','qDmCY2BaGQ7d649mAc6bq','_U51msK4jornrFgQyg3MW');
INSERT INTO "rsvps" VALUES('tOBXmqkKPhx3y8uAOrMna','-rrMZwQ2UrDAjiJC4N2uY','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "rsvps" VALUES('mKfaaVj9HwWSQwUdFiwSa','igagFQjs3rJf_v-puzdJk','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "rsvps" VALUES('ZVAwdGkYxV1XvYy77ECUd','2iJoekkgiXrHgm-vGfpZI','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "rsvps" VALUES('OwvWLiru3ZgpFi1gqgLGW','jjedCBwvEqvF_-vepNGKP','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "rsvps" VALUES('nuA63d_wigSf8O3902fj5','a3PKs-Cm4Zpyj-AO9-dbo','dTFo3Jnrjd6t66UB7o0zU');
INSERT INTO "rsvps" VALUES('UVP5ALC0tE4uiuni0hiCV','6M3_cr1tJafC7uRmLgygB','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('I1OLVsY2NbN0JGxVMJUQX','-rrMZwQ2UrDAjiJC4N2uY','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('BgIIb8YLcO0HKkj7wc-sz','qDmCY2BaGQ7d649mAc6bq','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('lnMOdbuMt3MB7CCFAhMxb','vB8yBCiFnhRUQ7147QEPC','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('W8vnJZ8qQuBRZY-9lDYub','igagFQjs3rJf_v-puzdJk','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('-QBURl69ISHnxdQI7lg3v','Gxx2wauoVzRCuneBwVriG','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('TEJcVqhpq3LQKWkZlVr9t','jjedCBwvEqvF_-vepNGKP','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('qFzmtsJe4Zr295aO_GFIF','HqF2KLl-_bzBazdIbA0Ua','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('5guzI7Y03SVPHgQMWs9Zc','jDCd-xcVZZ5MuXez7UuOJ','fklWHIi2n0xjZ4PBRc_V4');
INSERT INTO "rsvps" VALUES('anCD7BXcm97eoVgwAaFD0','RIymtbpXgboYkoKfJZRTn','A0I-G-uWpciyMueS9JxQ-');
INSERT INTO "rsvps" VALUES('UxshHgxjPzeSWCYdUota2','wx0BJmOqnvetENmzB_gOb','A0I-G-uWpciyMueS9JxQ-');
INSERT INTO "rsvps" VALUES('Ink2w_yB4h7uGkDVs1CTR','6M3_cr1tJafC7uRmLgygB','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "rsvps" VALUES('jVljpeyrLKAFduWU9cBit','XMhmMhtXQfBh0Vb_tQc0p','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "rsvps" VALUES('wV2Y1QImfiqSjcYYTC8vu','RIymtbpXgboYkoKfJZRTn','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "rsvps" VALUES('pa3v5X4vWoIciLDyc3ueE','jjedCBwvEqvF_-vepNGKP','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "rsvps" VALUES('IIWp_xO7B1WQmMemQwwI-','HqF2KLl-_bzBazdIbA0Ua','QUNxetzvBuqS5LC-YJbVO');
INSERT INTO "rsvps" VALUES('4aIqd-Tc2nWqaJa7DuFUo','6M3_cr1tJafC7uRmLgygB','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "rsvps" VALUES('DsiLcj0xDGaC9i1z0X_K9','RIymtbpXgboYkoKfJZRTn','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "rsvps" VALUES('LtP10pT7HmSFhuhTESNFv','gOsG5aiZEF7H0B5DcbHYk','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "rsvps" VALUES('dxCk_evgN5hnU6fRmzQOo','wx0BJmOqnvetENmzB_gOb','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "rsvps" VALUES('0iLx7wW802zzXV_r367T1','XMhmMhtXQfBh0Vb_tQc0p','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "rsvps" VALUES('aRL6quguGO2jNpRnaQFqU','qQnfyYF2IPT_EW5pKYHvU','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "rsvps" VALUES('GzE0FQBte5SEBOln2gUte','wx0BJmOqnvetENmzB_gOb','cAq5a5RQYt7sKvN5wbvW8');
INSERT INTO "rsvps" VALUES('WrO8ueWTUV1U56W5e9JWX','6M3_cr1tJafC7uRmLgygB','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "rsvps" VALUES('rjsWYLscpI_6Jl6GEutAp','vB8yBCiFnhRUQ7147QEPC','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "rsvps" VALUES('qKaN29Olj-H9k-X_IViRS','6M3_cr1tJafC7uRmLgygB','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "rsvps" VALUES('BFR9qG-N7luxZwlkZBbW9','qDmCY2BaGQ7d649mAc6bq','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "rsvps" VALUES('0A-3-tFsxvTf3DyyY78qO','gOsG5aiZEF7H0B5DcbHYk','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "rsvps" VALUES('c_YXYZk2UmG-u-YJHuI6S','Gxx2wauoVzRCuneBwVriG','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "rsvps" VALUES('FxgB7h_E4VCHMG0TobEKw','TycMjOkIgVANONwk_hBgz','IbjHTKBrAmzMoaPqkXz1h');
INSERT INTO "rsvps" VALUES('iubivInn8UH9SR90E4mCq','6M3_cr1tJafC7uRmLgygB','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('ognQGcsJMb31DQMSy5xbJ','XMhmMhtXQfBh0Vb_tQc0p','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('9UtHuLWhs-K0N2nvRi3lu','vB8yBCiFnhRUQ7147QEPC','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('6rQUPUAoF41Y3QxSF0ml4','Gxx2wauoVzRCuneBwVriG','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('P4_0qsX-M8RNeHCIU0AaB','TycMjOkIgVANONwk_hBgz','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('fBmDphJhkzJF0-odjptvE','a3PKs-Cm4Zpyj-AO9-dbo','_4CD5YXbM-Kruw1_f2paY');
INSERT INTO "rsvps" VALUES('g5k5nyR4msatxqER38pWp','RIymtbpXgboYkoKfJZRTn','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "rsvps" VALUES('y6Ju7pzYtFzEFd2ue2ntL','gOsG5aiZEF7H0B5DcbHYk','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "rsvps" VALUES('5o0oZ87UR-kfpkfSFYsNO','2iJoekkgiXrHgm-vGfpZI','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "rsvps" VALUES('gRZs2Z7wDSh2roqM4kH-l','sSwHK9VashAV2CgBZClTC','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "rsvps" VALUES('cejGZUtcRZVj2d0xnUnmK','jDCd-xcVZZ5MuXez7UuOJ','BJDIY2uATPEPXM3yDx-ZO');
INSERT INTO "rsvps" VALUES('ZwohDC1svvKR0EB4PbAFp','6M3_cr1tJafC7uRmLgygB','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "rsvps" VALUES('uuLFY2n3eU0ks1ZtTgTsr','-rrMZwQ2UrDAjiJC4N2uY','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "rsvps" VALUES('tyohm1uUXBQcybp3aaDas','qDmCY2BaGQ7d649mAc6bq','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "rsvps" VALUES('elZWDrSU8sJkEIU6rn5LQ','igagFQjs3rJf_v-puzdJk','Ukahzcxq4tVlAS70ytr_m');
INSERT INTO "rsvps" VALUES('9RwQGZpG-9mq3SOmV3vpd','wx0BJmOqnvetENmzB_gOb','Ukahzcxq4tVlAS70ytr_m');
CREATE TABLE "session_hosts" (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `guest_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_hosts" VALUES('HOPcQHlNNinnbFCZFQpny','EituNjAB_WjHf315o6FgB');
INSERT INTO "session_hosts" VALUES('EVl8NAMN5862wGwLE6GIw','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "session_hosts" VALUES('6M3_cr1tJafC7uRmLgygB','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "session_hosts" VALUES('XMhmMhtXQfBh0Vb_tQc0p','5RoBJlTarTCYHwRtkcfoL');
INSERT INTO "session_hosts" VALUES('-rrMZwQ2UrDAjiJC4N2uY','VJv7TkFuM65FVq6naWCzX');
INSERT INTO "session_hosts" VALUES('qDmCY2BaGQ7d649mAc6bq','cvViWkjK94CO4UXI59bMg');
INSERT INTO "session_hosts" VALUES('RIymtbpXgboYkoKfJZRTn','tvwQ1sGC1hAqQwOKSJFIt');
INSERT INTO "session_hosts" VALUES('vB8yBCiFnhRUQ7147QEPC','D1hCRrolteRhGfbdoLxXy');
INSERT INTO "session_hosts" VALUES('igagFQjs3rJf_v-puzdJk','zyrIHrTaOd_Ujd3d5-r7v');
INSERT INTO "session_hosts" VALUES('gOsG5aiZEF7H0B5DcbHYk','CgW1YSth1u4WK-2oDhY83');
INSERT INTO "session_hosts" VALUES('qQnfyYF2IPT_EW5pKYHvU','WxjmYVAi3tK2RgRv2ufeV');
INSERT INTO "session_hosts" VALUES('2iJoekkgiXrHgm-vGfpZI','8QKBuH6l4CQk76FLe_S7M');
INSERT INTO "session_hosts" VALUES('Gxx2wauoVzRCuneBwVriG','XY9PuqahecxoNFZq3eayA');
INSERT INTO "session_hosts" VALUES('TycMjOkIgVANONwk_hBgz','Iwq7GEtgCWvad81RH-wzO');
INSERT INTO "session_hosts" VALUES('TycMjOkIgVANONwk_hBgz','pr5D-yEw215TtcJLb-Bnh');
INSERT INTO "session_hosts" VALUES('jjedCBwvEqvF_-vepNGKP','EWf92Tq3hSWbCnwZF_gXk');
INSERT INTO "session_hosts" VALUES('a3PKs-Cm4Zpyj-AO9-dbo','otumnw13-zuz710X66T6D');
INSERT INTO "session_hosts" VALUES('HqF2KLl-_bzBazdIbA0Ua','y6R-UbAIvgShxPDtT5wF3');
INSERT INTO "session_hosts" VALUES('sSwHK9VashAV2CgBZClTC','S64cWBuxSlVix39BvZluz');
INSERT INTO "session_hosts" VALUES('wx0BJmOqnvetENmzB_gOb','_eafQ_Lu-VTSTvrjNGxr0');
INSERT INTO "session_hosts" VALUES('jDCd-xcVZZ5MuXez7UuOJ','zyrIHrTaOd_Ujd3d5-r7v');
CREATE TABLE "session_locations" (
	`session_id` text NOT NULL,
	`location_id` text NOT NULL,
	PRIMARY KEY(`session_id`, `location_id`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_locations" VALUES('HOPcQHlNNinnbFCZFQpny','loc-main-hall');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-main-hall');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-room-a');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-room-b');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-library');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-boardroom');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-auditorium');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-courtyard');
INSERT INTO "session_locations" VALUES('67g-PQy1-in6xpYk9qzWz','loc-rooftop');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-main-hall');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-room-a');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-room-b');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-library');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-boardroom');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-auditorium');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-courtyard');
INSERT INTO "session_locations" VALUES('3KNzHC6E0D52gJNdOFZMY','loc-rooftop');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-main-hall');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-room-a');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-room-b');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-library');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-boardroom');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-auditorium');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-courtyard');
INSERT INTO "session_locations" VALUES('1VJQiYwjFNxE_CfhVr2_4','loc-rooftop');
INSERT INTO "session_locations" VALUES('EVl8NAMN5862wGwLE6GIw','loc-main-hall');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-main-hall');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-room-a');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-room-b');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-library');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-boardroom');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-auditorium');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-courtyard');
INSERT INTO "session_locations" VALUES('53Z4MjmMpisMRcZ8L4np-','loc-rooftop');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-main-hall');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-room-a');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-room-b');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-library');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-boardroom');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-auditorium');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-courtyard');
INSERT INTO "session_locations" VALUES('6TH2pwHJQ7QLaVrsVZWaP','loc-rooftop');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-main-hall');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-room-a');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-room-b');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-library');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-boardroom');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-auditorium');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-courtyard');
INSERT INTO "session_locations" VALUES('AVgaHrJW-gg-fNu677lt_','loc-rooftop');
INSERT INTO "session_locations" VALUES('6M3_cr1tJafC7uRmLgygB','loc-main-hall');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-main-hall');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-room-a');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-room-b');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-library');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-boardroom');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-auditorium');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-courtyard');
INSERT INTO "session_locations" VALUES('gvb5pv4Wx2rPXNAAyeWwY','loc-rooftop');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-main-hall');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-room-a');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-room-b');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-library');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-boardroom');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-auditorium');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-courtyard');
INSERT INTO "session_locations" VALUES('tfKpzKFiZh12O73YvDiOW','loc-rooftop');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-main-hall');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-room-a');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-room-b');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-library');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-boardroom');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-auditorium');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-courtyard');
INSERT INTO "session_locations" VALUES('LTUsgYTIw0BCNC1PWz7Pj','loc-rooftop');
INSERT INTO "session_locations" VALUES('XMhmMhtXQfBh0Vb_tQc0p','loc-main-hall');
INSERT INTO "session_locations" VALUES('-rrMZwQ2UrDAjiJC4N2uY','loc-room-a');
INSERT INTO "session_locations" VALUES('qDmCY2BaGQ7d649mAc6bq','loc-main-hall');
INSERT INTO "session_locations" VALUES('RIymtbpXgboYkoKfJZRTn','loc-room-b');
INSERT INTO "session_locations" VALUES('vB8yBCiFnhRUQ7147QEPC','loc-room-a');
INSERT INTO "session_locations" VALUES('igagFQjs3rJf_v-puzdJk','loc-main-hall');
INSERT INTO "session_locations" VALUES('gOsG5aiZEF7H0B5DcbHYk','loc-room-b');
INSERT INTO "session_locations" VALUES('qQnfyYF2IPT_EW5pKYHvU','loc-room-a');
INSERT INTO "session_locations" VALUES('2iJoekkgiXrHgm-vGfpZI','loc-main-hall');
INSERT INTO "session_locations" VALUES('Gxx2wauoVzRCuneBwVriG','loc-room-b');
INSERT INTO "session_locations" VALUES('TycMjOkIgVANONwk_hBgz','loc-main-hall');
INSERT INTO "session_locations" VALUES('jjedCBwvEqvF_-vepNGKP','loc-room-b');
INSERT INTO "session_locations" VALUES('a3PKs-Cm4Zpyj-AO9-dbo','loc-main-hall');
INSERT INTO "session_locations" VALUES('HqF2KLl-_bzBazdIbA0Ua','loc-room-a');
INSERT INTO "session_locations" VALUES('sSwHK9VashAV2CgBZClTC','loc-room-b');
INSERT INTO "session_locations" VALUES('wx0BJmOqnvetENmzB_gOb','loc-main-hall');
INSERT INTO "session_locations" VALUES('jDCd-xcVZZ5MuXez7UuOJ','loc-main-hall');
CREATE TABLE "session_proposals" (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`duration_minutes` integer,
	`created_time` text NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "session_proposals" VALUES('JxY8ECwYzldhpL3Sp-CTC','vDpIksoQEmvZ45H2j0PEq','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('Huxd4zFc_3GISwtBoykBg','vDpIksoQEmvZ45H2j0PEq','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',NULL,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('u2GxGKKLO7LI7lhtxoD3v','vDpIksoQEmvZ45H2j0PEq','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',150,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('oZeNJqGqYSPpVz9lyaatQ','vDpIksoQEmvZ45H2j0PEq','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('ohJveJ5nNXm1HZQNRNYOc','vDpIksoQEmvZ45H2j0PEq','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('QdRQ1cpp3fMGnovzRmNcw','vDpIksoQEmvZ45H2j0PEq','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('bRnxXUeBzIH23dsQpiKid','vDpIksoQEmvZ45H2j0PEq','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('BRHuD8rd0gmMm6HvD4v8t','vDpIksoQEmvZ45H2j0PEq','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',120,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('xbcktvUJDyZ64UTeicxR9','vDpIksoQEmvZ45H2j0PEq','Conference Alpha Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Alpha attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('OOus7GxX0gxtjPlHhrIUG','vDpIksoQEmvZ45H2j0PEq','Networking & Coffee Chat: Connect with Conference Alpha Peers','An informal networking session designed to help Conference Alpha attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('w9cT9xzzGuPA6KpsAWnmG','vDpIksoQEmvZ45H2j0PEq','Conference Alpha Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Alpha community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('bAU_FKrFGtcSQJyJnD4ay','Rt3UVc16Wmx7VD1-Ugzvy','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('uV2Of6uGO5sHvSlVZ49ie','Rt3UVc16Wmx7VD1-Ugzvy','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',150,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('lN_KpCxq1aDENXe9aPX5Y','Rt3UVc16Wmx7VD1-Ugzvy','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('iljH2Px3FAXN_oJLuOvUE','Rt3UVc16Wmx7VD1-Ugzvy','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('j2akcbMh0JJ8wAxde1uw4','Rt3UVc16Wmx7VD1-Ugzvy','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',150,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('BNFllQU_Xmue9vQlzfz7B','Rt3UVc16Wmx7VD1-Ugzvy','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('RgipdU4xEAak-NTzJN6B3','Rt3UVc16Wmx7VD1-Ugzvy','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('yNvKzUXq9oedAgkHhjjj9','Rt3UVc16Wmx7VD1-Ugzvy','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('mekOzr3xMfzfuIHN6c4TC','Rt3UVc16Wmx7VD1-Ugzvy','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('k3-ywKhT73XYuuStLHHwC','Rt3UVc16Wmx7VD1-Ugzvy','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('huKvMp05N5DD6nT4NjBkj','Rt3UVc16Wmx7VD1-Ugzvy','Conference Beta Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Beta attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('2YhS8uDJhlgrXrARbDICW','Rt3UVc16Wmx7VD1-Ugzvy','Networking & Coffee Chat: Connect with Conference Beta Peers','An informal networking session designed to help Conference Beta attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('720_x4irTIRtaH2b_cW5t','Rt3UVc16Wmx7VD1-Ugzvy','Conference Beta Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Beta community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('ezquWRqfCSq0Ehr47gXRf','SP0cKZnzLKO0kR0q-jzYX','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('5YYnHgPqxkpfxnaB6B0Dp','SP0cKZnzLKO0kR0q-jzYX','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('jwi9s0Q3537QyDqMFCOqg','SP0cKZnzLKO0kR0q-jzYX','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('8rcQtiTCRLPJ5phQLAikj','SP0cKZnzLKO0kR0q-jzYX','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('5ramGIUUZ66OYlc0E0VQx','SP0cKZnzLKO0kR0q-jzYX','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('Vk99eBmo99DZmka02C1TA','SP0cKZnzLKO0kR0q-jzYX','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('ayKLrK_auZU_a8zC-CmQo','SP0cKZnzLKO0kR0q-jzYX','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('PNzKCaNbOcez6Y5kmFmLA','SP0cKZnzLKO0kR0q-jzYX','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('wuZCyW47zQhn3I8dcMazB','SP0cKZnzLKO0kR0q-jzYX','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('OP3Yn69HegT8fHMkcVBCk','SP0cKZnzLKO0kR0q-jzYX','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('2X60eLDXi0C9nCkPlGxZp','SP0cKZnzLKO0kR0q-jzYX','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('4v9cdFB0yfSWO_5eYBySq','SP0cKZnzLKO0kR0q-jzYX','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('TJB63B73ewez4_ilCVYHH','SP0cKZnzLKO0kR0q-jzYX','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('mDUkRFD2oPZaA1Vl3ZbHk','SP0cKZnzLKO0kR0q-jzYX','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('mrT7aqyQvcGfD2zlHA8wT','SP0cKZnzLKO0kR0q-jzYX','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('kcU4otJXhCSIbUkNU1Ai1','SP0cKZnzLKO0kR0q-jzYX','Conference Gamma Lightning Talks: Community Showcase','A fast-paced session featuring **5-minute lightning talks** from Conference Gamma attendees. This is your chance to share a quick tip, tool, or technique with the community.

We''ll have 8-10 speakers covering diverse topics chosen by community vote. Past lightning talks have covered everything from productivity hacks to cutting-edge research findings. Whether you''re a first-time speaker or seasoned presenter, lightning talks provide a low-pressure environment to share your expertise.

> Submit your lightning talk proposal during the event — we''ll be accepting submissions right up until the session begins!',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('cz5nOCwYvAwezNDZD2A3R','SP0cKZnzLKO0kR0q-jzYX','Networking & Coffee Chat: Connect with Conference Gamma Peers','An informal networking session designed to help Conference Gamma attendees connect over coffee and conversation. This isn''t a structured presentation - instead, we''ll facilitate small group discussions around shared interests and challenges.

Whether you''re looking for career advice, collaboration opportunities, or just want to meet like-minded professionals, this session provides a welcoming environment for meaningful connections.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('T-xYPrvKKFryUUI4uOplr','SP0cKZnzLKO0kR0q-jzYX','Conference Gamma Panel: Industry Leaders Share Their Insights','Join us for an engaging panel discussion featuring industry leaders and Conference Gamma community members. Our panelists will share their perspectives on current trends, future predictions, and career advice.

This interactive session includes audience Q&A, so come prepared with your questions! Topics will be driven by audience interest but typically cover emerging technologies, leadership challenges, and navigating career transitions in tech.',30,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('DFVSLmJHZiI2F4C6hgQvQ','SP0cKZnzLKO0kR0q-jzYX','Writing Documentation People Actually Read','Most documentation is written once, in a hurry, by whoever shipped the feature. This session is about the opposite: treating docs as a product with readers, a first minute that has to land, and a maintenance cost you plan for.

We''ll look at real examples — a few good, several painfully bad — and pull out what separates them: task-shaped titles, examples before explanations, and the courage to delete a page.

Bring a page you''re unhappy with and we''ll rework it together.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('V-TKZyCNbPUm1zp2vrGyB','SP0cKZnzLKO0kR0q-jzYX','Your First Conference Talk: From Idea to Stage','You have something worth saying and no idea how to turn it into 30 minutes on a stage. Let''s fix that.

We''ll cover finding a topic that''s genuinely yours, writing an abstract that survives a review committee, building slides that support you instead of competing with you, and what to do when your demo dies in front of 200 people (it will, eventually).

Aimed at people who have *never* spoken before. No slides of my own — we work on yours.',90,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('kAkAuUyIGbF_ki9YDB3Cg','SP0cKZnzLKO0kR0q-jzYX','Ask Me Anything: Migrating a Legacy Monolith','**Looking for someone to host this!**

Several of us are staring down the same problem: a monolith that works, pays the bills, and is slowly becoming impossible to change. We''d love to hear from somebody who has actually come out the other side of a migration — what you''d do again, and what you''d never repeat.

If you''ve lived through one, please add yourself as host. An honest hour of war stories beats a polished talk.',60,'2026-09-08T18:16:59.672Z');
INSERT INTO "session_proposals" VALUES('tcy--7UuRPQoM_Fb54v6P','SP0cKZnzLKO0kR0q-jzYX','Board Games for People Who Are Tired of Talking','By day three, everyone''s social battery is empty. This is a quiet room with a table, a stack of games, and no agenda.

Nobody has volunteered to bring the games yet — if you''re travelling with something short and easy to teach, add yourself as host and we''ll make it happen.',120,'2026-09-08T18:16:59.672Z');
CREATE TABLE "votes" (
	`id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`choice` text NOT NULL,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "votes" VALUES('gXdIKOFsmoKjsqgTkQywt','bAU_FKrFGtcSQJyJnD4ay','EituNjAB_WjHf315o6FgB','maybe');
INSERT INTO "votes" VALUES('RG0nIFJDWr2imYWagAQu2','iljH2Px3FAXN_oJLuOvUE','EituNjAB_WjHf315o6FgB','interested');
INSERT INTO "votes" VALUES('XcFWqBsoMW4DqxCEI8Ssd','BNFllQU_Xmue9vQlzfz7B','EituNjAB_WjHf315o6FgB','maybe');
INSERT INTO "votes" VALUES('gWHnECir0T4Wvvg7cEeI1','RgipdU4xEAak-NTzJN6B3','EituNjAB_WjHf315o6FgB','maybe');
INSERT INTO "votes" VALUES('f2lmvqfa7EtrRbvRR3oWa','mekOzr3xMfzfuIHN6c4TC','EituNjAB_WjHf315o6FgB','interested');
INSERT INTO "votes" VALUES('vsa8PVPxuan4KLKLyAC5U','k3-ywKhT73XYuuStLHHwC','EituNjAB_WjHf315o6FgB','skip');
INSERT INTO "votes" VALUES('OVn1WPvCffaUilTd1dHy1','uV2Of6uGO5sHvSlVZ49ie','Iwq7GEtgCWvad81RH-wzO','maybe');
INSERT INTO "votes" VALUES('LMq9DnyVcBTK8qimA_K3v','iljH2Px3FAXN_oJLuOvUE','Iwq7GEtgCWvad81RH-wzO','interested');
INSERT INTO "votes" VALUES('pPUo3ix-umbsb6Fp4U4we','j2akcbMh0JJ8wAxde1uw4','Iwq7GEtgCWvad81RH-wzO','skip');
INSERT INTO "votes" VALUES('Oswsx6urFFSZauPDMSqL-','mekOzr3xMfzfuIHN6c4TC','Iwq7GEtgCWvad81RH-wzO','maybe');
INSERT INTO "votes" VALUES('Gbvb43u0QX6qOvKEOVzS6','j2akcbMh0JJ8wAxde1uw4','zyrIHrTaOd_Ujd3d5-r7v','maybe');
INSERT INTO "votes" VALUES('4veFrNGbGJKOg4bJ_0Kwa','BNFllQU_Xmue9vQlzfz7B','zyrIHrTaOd_Ujd3d5-r7v','maybe');
INSERT INTO "votes" VALUES('oaalGtqsTiINp5rh6ekum','lN_KpCxq1aDENXe9aPX5Y','5RoBJlTarTCYHwRtkcfoL','maybe');
INSERT INTO "votes" VALUES('MclO8oAL2Iuf7WUPp0pLF','iljH2Px3FAXN_oJLuOvUE','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('CoV9Oz4H1-iqo3iO0tms4','RgipdU4xEAak-NTzJN6B3','5RoBJlTarTCYHwRtkcfoL','maybe');
INSERT INTO "votes" VALUES('QVJqHdeNdg3enf34ZkIT3','yNvKzUXq9oedAgkHhjjj9','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('yvNYqFV8kE0O-VL9DIvnU','mekOzr3xMfzfuIHN6c4TC','5RoBJlTarTCYHwRtkcfoL','skip');
INSERT INTO "votes" VALUES('ini-ioJMcQ6kysCxlFUHb','uV2Of6uGO5sHvSlVZ49ie','e-yXTHs6PcH9T-UsjhUY5','skip');
INSERT INTO "votes" VALUES('4FcoZDz3QLMjKxfuiaBB_','BNFllQU_Xmue9vQlzfz7B','e-yXTHs6PcH9T-UsjhUY5','interested');
INSERT INTO "votes" VALUES('__upi02cvWPbbnAPtDcmE','bAU_FKrFGtcSQJyJnD4ay','VJv7TkFuM65FVq6naWCzX','maybe');
INSERT INTO "votes" VALUES('_QG69jOaVDGqv80PBp015','RgipdU4xEAak-NTzJN6B3','VJv7TkFuM65FVq6naWCzX','maybe');
INSERT INTO "votes" VALUES('WwRQw0GqwWqZg4mgba8M9','mekOzr3xMfzfuIHN6c4TC','VJv7TkFuM65FVq6naWCzX','skip');
INSERT INTO "votes" VALUES('Co1o33D-b_0TK5HO5asVd','bAU_FKrFGtcSQJyJnD4ay','TMwyO35bGPgDkc-FGoPC-','skip');
INSERT INTO "votes" VALUES('Rt03V1YL_RjukhbYI3xfr','uV2Of6uGO5sHvSlVZ49ie','TMwyO35bGPgDkc-FGoPC-','skip');
INSERT INTO "votes" VALUES('-JMkAVjJH5NUTKRtSBrR9','lN_KpCxq1aDENXe9aPX5Y','TMwyO35bGPgDkc-FGoPC-','skip');
INSERT INTO "votes" VALUES('6quKxxp51VV9D4xyGOLxR','iljH2Px3FAXN_oJLuOvUE','TMwyO35bGPgDkc-FGoPC-','maybe');
INSERT INTO "votes" VALUES('4gQ6nUl90bnH7jZEigKSR','RgipdU4xEAak-NTzJN6B3','TMwyO35bGPgDkc-FGoPC-','maybe');
INSERT INTO "votes" VALUES('XQ8RWIs5b2KBAzrBECMMx','yNvKzUXq9oedAgkHhjjj9','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('qcZtqmO8LDN4QFxOkiYq1','mekOzr3xMfzfuIHN6c4TC','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('5R59VNq0h92yVGpx31snx','k3-ywKhT73XYuuStLHHwC','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('-j1gzdhiDX-ND9HOJpSSJ','bAU_FKrFGtcSQJyJnD4ay','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('cNvtbYbZB0BYfYywIO1ac','uV2Of6uGO5sHvSlVZ49ie','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('igGSADkBjDkfOazYa3D5B','yNvKzUXq9oedAgkHhjjj9','8QKBuH6l4CQk76FLe_S7M','maybe');
INSERT INTO "votes" VALUES('LM21Cmgh43It4xd9HxHWN','k3-ywKhT73XYuuStLHHwC','8QKBuH6l4CQk76FLe_S7M','skip');
INSERT INTO "votes" VALUES('3tmS9J-Ja0ggxCuHlfYYT','lN_KpCxq1aDENXe9aPX5Y','MVMnWjk26J_TG4aPxi2zT','skip');
INSERT INTO "votes" VALUES('5QGF-jFdn4A3TBPcgiYLc','BNFllQU_Xmue9vQlzfz7B','MVMnWjk26J_TG4aPxi2zT','maybe');
INSERT INTO "votes" VALUES('QkQ60oEMDvNe2l60ypRIM','k3-ywKhT73XYuuStLHHwC','MVMnWjk26J_TG4aPxi2zT','maybe');
INSERT INTO "votes" VALUES('UCHf0SmBxM7DyJkNWgsEE','uV2Of6uGO5sHvSlVZ49ie','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('Nw8QTKkJ9Cd2DMEypnbLO','lN_KpCxq1aDENXe9aPX5Y','_eafQ_Lu-VTSTvrjNGxr0','interested');
INSERT INTO "votes" VALUES('FiJsQ29s1Ft5p9dK1mexS','iljH2Px3FAXN_oJLuOvUE','_eafQ_Lu-VTSTvrjNGxr0','interested');
INSERT INTO "votes" VALUES('OytKHXmWbJPEjl83RbjxA','j2akcbMh0JJ8wAxde1uw4','_eafQ_Lu-VTSTvrjNGxr0','skip');
INSERT INTO "votes" VALUES('8DczXdtSDgcJCH6Cy4Gyu','k3-ywKhT73XYuuStLHHwC','_eafQ_Lu-VTSTvrjNGxr0','skip');
INSERT INTO "votes" VALUES('Eo49pE6BlsGfBIpOdT0gE','yNvKzUXq9oedAgkHhjjj9','y6R-UbAIvgShxPDtT5wF3','maybe');
INSERT INTO "votes" VALUES('UUjuMapPSFEUSgdCr5QcA','mekOzr3xMfzfuIHN6c4TC','y6R-UbAIvgShxPDtT5wF3','maybe');
INSERT INTO "votes" VALUES('p1uFOFm_Q4bfnMb64Przt','k3-ywKhT73XYuuStLHHwC','y6R-UbAIvgShxPDtT5wF3','interested');
INSERT INTO "votes" VALUES('uqADTcg9Me3Lyj1kd0Wnc','bAU_FKrFGtcSQJyJnD4ay','-iOLg-PYelc-CR4X_F5-K','skip');
INSERT INTO "votes" VALUES('hG0fTZ11ccAVs6j3FWehF','uV2Of6uGO5sHvSlVZ49ie','-iOLg-PYelc-CR4X_F5-K','skip');
INSERT INTO "votes" VALUES('sYe6GL3IwQN-sWyKBzoqY','iljH2Px3FAXN_oJLuOvUE','-iOLg-PYelc-CR4X_F5-K','skip');
INSERT INTO "votes" VALUES('6aATLl5bAnNRo4HxodHLz','j2akcbMh0JJ8wAxde1uw4','-iOLg-PYelc-CR4X_F5-K','interested');
INSERT INTO "votes" VALUES('BEnuLDSZ4n8z_ap7ccQwE','BNFllQU_Xmue9vQlzfz7B','-iOLg-PYelc-CR4X_F5-K','maybe');
INSERT INTO "votes" VALUES('9NZNSnYFeVw7roRI2RqO7','RgipdU4xEAak-NTzJN6B3','-iOLg-PYelc-CR4X_F5-K','interested');
INSERT INTO "votes" VALUES('P_lZ2R86tBhi38OWUwyBQ','lN_KpCxq1aDENXe9aPX5Y','CgW1YSth1u4WK-2oDhY83','maybe');
INSERT INTO "votes" VALUES('iLKOgfKQ4QCh60xWRgV3o','iljH2Px3FAXN_oJLuOvUE','CgW1YSth1u4WK-2oDhY83','skip');
INSERT INTO "votes" VALUES('43ig1XQQyaOSvHgF4cUn-','j2akcbMh0JJ8wAxde1uw4','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('PG5n_juRmFvvHqt8d0Cyd','BNFllQU_Xmue9vQlzfz7B','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('pxdGSL5F6E7Ix5LI8t5cd','mekOzr3xMfzfuIHN6c4TC','S64cWBuxSlVix39BvZluz','interested');
INSERT INTO "votes" VALUES('B963bMaf5u3ZdlNK8QRB9','uV2Of6uGO5sHvSlVZ49ie','sKMgWCotyzMq1f56--oMk','maybe');
INSERT INTO "votes" VALUES('qwv1aFOby1XFMl6KTh8ny','iljH2Px3FAXN_oJLuOvUE','sKMgWCotyzMq1f56--oMk','interested');
INSERT INTO "votes" VALUES('KHuR0br2e1Zg2hrI14Vvc','BNFllQU_Xmue9vQlzfz7B','sKMgWCotyzMq1f56--oMk','maybe');
INSERT INTO "votes" VALUES('o4W91yLztahf3gkNSfq8J','RgipdU4xEAak-NTzJN6B3','sKMgWCotyzMq1f56--oMk','interested');
INSERT INTO "votes" VALUES('quriGIJ9y9PPvmO0BOeUF','mekOzr3xMfzfuIHN6c4TC','sKMgWCotyzMq1f56--oMk','maybe');
INSERT INTO "votes" VALUES('crj-o9KQJsQwlls4YjqHm','k3-ywKhT73XYuuStLHHwC','sKMgWCotyzMq1f56--oMk','interested');
INSERT INTO "votes" VALUES('npKaVZmT7i2ZUvtTmtS0P','lN_KpCxq1aDENXe9aPX5Y','WxjmYVAi3tK2RgRv2ufeV','skip');
INSERT INTO "votes" VALUES('U4CJQ_pEzD1sGHwHb8HUc','iljH2Px3FAXN_oJLuOvUE','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('R2bM8tFOdHbThxMzYAkvr','BNFllQU_Xmue9vQlzfz7B','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('ymi8xVgk-FMMajEv4tpPb','RgipdU4xEAak-NTzJN6B3','WxjmYVAi3tK2RgRv2ufeV','maybe');
INSERT INTO "votes" VALUES('3fJ51gaQDWPUcypVj3Y93','yNvKzUXq9oedAgkHhjjj9','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('A7kfrh8n4y-F_mTC0nETG','mekOzr3xMfzfuIHN6c4TC','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('PGXdB6FpmclzUfYX2hdrx','uV2Of6uGO5sHvSlVZ49ie','5qZM4tI841iJy3W89QvIJ','skip');
INSERT INTO "votes" VALUES('TQajVYuUqNnspTpKC2yIq','lN_KpCxq1aDENXe9aPX5Y','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('W0XkszdZ3RcsP8wRBNGCA','iljH2Px3FAXN_oJLuOvUE','5qZM4tI841iJy3W89QvIJ','skip');
INSERT INTO "votes" VALUES('XQHWEB0G21x2jO-1V2-NF','RgipdU4xEAak-NTzJN6B3','5qZM4tI841iJy3W89QvIJ','maybe');
INSERT INTO "votes" VALUES('DFfrrw2lgfdS1OpaIe_UZ','mekOzr3xMfzfuIHN6c4TC','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('ImJ9WJ2OzQ_w_dfeJfVvo','k3-ywKhT73XYuuStLHHwC','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('wa2b5S9xMSyej04cWiqce','bAU_FKrFGtcSQJyJnD4ay','0LMe8d1wk8MKVFi8xqbc-','interested');
INSERT INTO "votes" VALUES('8_XkQxvL5tokkfSeUjWWT','uV2Of6uGO5sHvSlVZ49ie','0LMe8d1wk8MKVFi8xqbc-','interested');
INSERT INTO "votes" VALUES('jx7B2iu4glQCz3far3nqw','yNvKzUXq9oedAgkHhjjj9','0LMe8d1wk8MKVFi8xqbc-','maybe');
INSERT INTO "votes" VALUES('gqGS0YGutaAlzPJyQXZ54','mekOzr3xMfzfuIHN6c4TC','0LMe8d1wk8MKVFi8xqbc-','maybe');
INSERT INTO "votes" VALUES('-pEazQybzRXEY2KZoBKDu','bAU_FKrFGtcSQJyJnD4ay','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('NHRZJxXvb8ePsGkiLoCUO','uV2Of6uGO5sHvSlVZ49ie','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('dgMb7ahQt_kIG9XOTDXsN','lN_KpCxq1aDENXe9aPX5Y','FRco957sXUlZiQxRhMTk1','skip');
INSERT INTO "votes" VALUES('6cD08xFU0FfrQFVf9_ilw','BNFllQU_Xmue9vQlzfz7B','FRco957sXUlZiQxRhMTk1','maybe');
INSERT INTO "votes" VALUES('W_H5i_ogooWGJE7tPRU2G','mekOzr3xMfzfuIHN6c4TC','FRco957sXUlZiQxRhMTk1','skip');
INSERT INTO "votes" VALUES('OYZ-rNWCbDqmuuUKiK1sr','k3-ywKhT73XYuuStLHHwC','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('-dlN8SIoQSrRP1MWt0LDQ','bAU_FKrFGtcSQJyJnD4ay','otumnw13-zuz710X66T6D','maybe');
INSERT INTO "votes" VALUES('yg_3rbdJgd-3iF3ZGQJ6H','BNFllQU_Xmue9vQlzfz7B','otumnw13-zuz710X66T6D','maybe');
INSERT INTO "votes" VALUES('y0gv5KZzWF5TcnfagXUL6','RgipdU4xEAak-NTzJN6B3','otumnw13-zuz710X66T6D','interested');
INSERT INTO "votes" VALUES('lFVYICz4SIaGlPNP8zKUn','yNvKzUXq9oedAgkHhjjj9','otumnw13-zuz710X66T6D','interested');
INSERT INTO "votes" VALUES('xwL295G6-crjn46bn6-WD','k3-ywKhT73XYuuStLHHwC','otumnw13-zuz710X66T6D','interested');
INSERT INTO "votes" VALUES('dEdZjSOnqTlSeHHESo8-J','iljH2Px3FAXN_oJLuOvUE','cvViWkjK94CO4UXI59bMg','skip');
INSERT INTO "votes" VALUES('h4CiKAca4gXJgDxkAe8tV','j2akcbMh0JJ8wAxde1uw4','cvViWkjK94CO4UXI59bMg','interested');
INSERT INTO "votes" VALUES('9bzlwSzVqwaSjd5c8rSjJ','RgipdU4xEAak-NTzJN6B3','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('u-_cH9dWJ6gS3kLLi0jHI','yNvKzUXq9oedAgkHhjjj9','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('wsMci_Ph3LUS0tZJ6_j41','bAU_FKrFGtcSQJyJnD4ay','EWf92Tq3hSWbCnwZF_gXk','maybe');
INSERT INTO "votes" VALUES('7sgTDl-JWgt6sSbcfB6YL','RgipdU4xEAak-NTzJN6B3','EWf92Tq3hSWbCnwZF_gXk','interested');
INSERT INTO "votes" VALUES('KsbFLctprtdbOT_K0_kE_','mekOzr3xMfzfuIHN6c4TC','EWf92Tq3hSWbCnwZF_gXk','interested');
INSERT INTO "votes" VALUES('AbNQs_1BooSCiA1gIc_b0','k3-ywKhT73XYuuStLHHwC','EWf92Tq3hSWbCnwZF_gXk','skip');
INSERT INTO "votes" VALUES('2r32MatsaSRk9LHbogPPB','bAU_FKrFGtcSQJyJnD4ay','XY9PuqahecxoNFZq3eayA','interested');
INSERT INTO "votes" VALUES('1rpb9NnP2jP3QzAhpFOu9','lN_KpCxq1aDENXe9aPX5Y','XY9PuqahecxoNFZq3eayA','maybe');
INSERT INTO "votes" VALUES('08edevuywSOJMd6iEblr6','BNFllQU_Xmue9vQlzfz7B','XY9PuqahecxoNFZq3eayA','interested');
INSERT INTO "votes" VALUES('nsip-FvhLXPmQ5ome7NIh','k3-ywKhT73XYuuStLHHwC','XY9PuqahecxoNFZq3eayA','skip');
INSERT INTO "votes" VALUES('KMsf_VkrodUVdthLxfg3d','BNFllQU_Xmue9vQlzfz7B','W1CGkv8V4tYDIHKx9_O_W','skip');
INSERT INTO "votes" VALUES('XVnQ9q7SM_p6xTKFuoOqa','mekOzr3xMfzfuIHN6c4TC','W1CGkv8V4tYDIHKx9_O_W','interested');
INSERT INTO "votes" VALUES('pfjRr2J_e8wiy7n5jSSeN','k3-ywKhT73XYuuStLHHwC','W1CGkv8V4tYDIHKx9_O_W','maybe');
INSERT INTO "votes" VALUES('MrioIBw_AWtlIPTHsUqN3','bAU_FKrFGtcSQJyJnD4ay','fi_8fZO3-RwyxSOlAId4g','maybe');
INSERT INTO "votes" VALUES('pkoawOGAyN3RPikkgP14x','uV2Of6uGO5sHvSlVZ49ie','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('3cSOH-ueBzQQYugUZONpZ','BNFllQU_Xmue9vQlzfz7B','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('SBrh-ibzcEQRmrM_3traO','RgipdU4xEAak-NTzJN6B3','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('N8ehLJntBHf89Dbvfx4Kk','yNvKzUXq9oedAgkHhjjj9','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('GtoO343wSN4yFZsgzI-oS','mekOzr3xMfzfuIHN6c4TC','fi_8fZO3-RwyxSOlAId4g','maybe');
INSERT INTO "votes" VALUES('o8j0dZ3IVQKtJL1rTngHp','bAU_FKrFGtcSQJyJnD4ay','D1hCRrolteRhGfbdoLxXy','maybe');
INSERT INTO "votes" VALUES('wD34owQN8ymr2c_xIXuNk','lN_KpCxq1aDENXe9aPX5Y','D1hCRrolteRhGfbdoLxXy','skip');
INSERT INTO "votes" VALUES('0sFP41RoREyqBAUZ3Kr4N','k3-ywKhT73XYuuStLHHwC','D1hCRrolteRhGfbdoLxXy','maybe');
INSERT INTO "votes" VALUES('7SxsS7Pr8n7br4x2bG04_','uV2Of6uGO5sHvSlVZ49ie','iy2yD5_tSIsixmTgpsNpy','maybe');
INSERT INTO "votes" VALUES('wJmlosaKAqgwLNIPWip2z','BNFllQU_Xmue9vQlzfz7B','iy2yD5_tSIsixmTgpsNpy','interested');
INSERT INTO "votes" VALUES('6HfYyi8sc5u71fuY_GT7L','yNvKzUXq9oedAgkHhjjj9','iy2yD5_tSIsixmTgpsNpy','skip');
INSERT INTO "votes" VALUES('qtUULKHvX0YaAatWzdBbk','bAU_FKrFGtcSQJyJnD4ay','uQpQIf84U5tZa1y8xb16Y','interested');
INSERT INTO "votes" VALUES('2eY2PnfGYWY5rGivWR9fk','iljH2Px3FAXN_oJLuOvUE','uQpQIf84U5tZa1y8xb16Y','skip');
INSERT INTO "votes" VALUES('x40tRmEFK2p01i6eb7Q0L','RgipdU4xEAak-NTzJN6B3','uQpQIf84U5tZa1y8xb16Y','interested');
INSERT INTO "votes" VALUES('Y-zA8VOuDo4zcFcQIN_uL','bAU_FKrFGtcSQJyJnD4ay','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('IPlvcq-lZ5_pSg5Q22368','lN_KpCxq1aDENXe9aPX5Y','_U51msK4jornrFgQyg3MW','interested');
INSERT INTO "votes" VALUES('H7UkhMiKlCVcPA_itmGtN','yNvKzUXq9oedAgkHhjjj9','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('WkBgyD_HqQn7s3H-pmmro','mekOzr3xMfzfuIHN6c4TC','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('9PHG5k35EG09dzjIsJZZU','k3-ywKhT73XYuuStLHHwC','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('ZBIUDB3nBodyN9XHe96cz','bAU_FKrFGtcSQJyJnD4ay','dTFo3Jnrjd6t66UB7o0zU','maybe');
INSERT INTO "votes" VALUES('g-jEf-ATWCaiRhh4esFKG','lN_KpCxq1aDENXe9aPX5Y','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('k1UU8_JmtnVSs_M0oQXe6','RgipdU4xEAak-NTzJN6B3','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('UoOTVl3DhU-dyGI2vfTwg','bAU_FKrFGtcSQJyJnD4ay','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('xzAadeeiqHhw7nGrTxzGq','lN_KpCxq1aDENXe9aPX5Y','fklWHIi2n0xjZ4PBRc_V4','maybe');
INSERT INTO "votes" VALUES('7QJZuqeL5sfnwWqCklXr3','iljH2Px3FAXN_oJLuOvUE','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('gnK80Zb-re3nDt-K8xw2p','BNFllQU_Xmue9vQlzfz7B','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('GrEIqS_NppQzqL2P_j95B','bAU_FKrFGtcSQJyJnD4ay','A0I-G-uWpciyMueS9JxQ-','interested');
INSERT INTO "votes" VALUES('C4KS7exskh6vhiI3Pf7dc','RgipdU4xEAak-NTzJN6B3','A0I-G-uWpciyMueS9JxQ-','maybe');
INSERT INTO "votes" VALUES('NS8vHR1vZHyo_fPI8JOFx','k3-ywKhT73XYuuStLHHwC','A0I-G-uWpciyMueS9JxQ-','maybe');
INSERT INTO "votes" VALUES('E1paNAA1R3AZFVHOyU44d','bAU_FKrFGtcSQJyJnD4ay','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('CBr_dNJZp1GjJCkb9jKPh','uV2Of6uGO5sHvSlVZ49ie','QUNxetzvBuqS5LC-YJbVO','skip');
INSERT INTO "votes" VALUES('kcF9wyPip7DRXdZ4mmX5R','j2akcbMh0JJ8wAxde1uw4','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('RTz4Xf1feL6jkckm_Plr_','BNFllQU_Xmue9vQlzfz7B','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('e0iY-daPBUHrZnA6yCR8y','yNvKzUXq9oedAgkHhjjj9','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('Yu-MxnpaAl96984hZzjuR','mekOzr3xMfzfuIHN6c4TC','QUNxetzvBuqS5LC-YJbVO','maybe');
INSERT INTO "votes" VALUES('jI9NS2zprTaw34Zm4Y3fu','j2akcbMh0JJ8wAxde1uw4','pr5D-yEw215TtcJLb-Bnh','interested');
INSERT INTO "votes" VALUES('J9ruvH72fii3muxskRSzD','bAU_FKrFGtcSQJyJnD4ay','cAq5a5RQYt7sKvN5wbvW8','skip');
INSERT INTO "votes" VALUES('njPM2JRIokTOlQqfgmUu0','uV2Of6uGO5sHvSlVZ49ie','cAq5a5RQYt7sKvN5wbvW8','interested');
INSERT INTO "votes" VALUES('VReYi3XRI5-d9Dvy1g3q4','yNvKzUXq9oedAgkHhjjj9','cAq5a5RQYt7sKvN5wbvW8','skip');
INSERT INTO "votes" VALUES('NdGCpGENVvrb3jciPqU59','mekOzr3xMfzfuIHN6c4TC','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('89Fb3bLYQAwNtkPgNQbZL','BNFllQU_Xmue9vQlzfz7B','tvwQ1sGC1hAqQwOKSJFIt','interested');
INSERT INTO "votes" VALUES('HvXCyH6hyO4phmSdwa79f','yNvKzUXq9oedAgkHhjjj9','tvwQ1sGC1hAqQwOKSJFIt','interested');
INSERT INTO "votes" VALUES('5uOELKQuyLENZZtNMyEm8','bAU_FKrFGtcSQJyJnD4ay','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('EuryWI-5_y3VTcY9lB40A','iljH2Px3FAXN_oJLuOvUE','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('KRBNa4oI1InBHL_24d7Nl','j2akcbMh0JJ8wAxde1uw4','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('X6m8jum02UbGOzvLD65D9','BNFllQU_Xmue9vQlzfz7B','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('pakPXLJ16vHPjMBT6k5UY','yNvKzUXq9oedAgkHhjjj9','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('XvrLWeesjKvLJKmsGaWHs','mekOzr3xMfzfuIHN6c4TC','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('iiahUi8UYIUUhAWxhzRNh','iljH2Px3FAXN_oJLuOvUE','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('czsFHrSweZonWWSONnhFh','RgipdU4xEAak-NTzJN6B3','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('UiziU4j2zcuyRX_9mW_0M','lN_KpCxq1aDENXe9aPX5Y','BJDIY2uATPEPXM3yDx-ZO','maybe');
INSERT INTO "votes" VALUES('D6UKjrbruZT6h7KBR1d_K','iljH2Px3FAXN_oJLuOvUE','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('rMGRbQKquwgJ1T7XHMXE6','j2akcbMh0JJ8wAxde1uw4','BJDIY2uATPEPXM3yDx-ZO','maybe');
INSERT INTO "votes" VALUES('4OVp8wJ8ksXg-m2HDfsRf','k3-ywKhT73XYuuStLHHwC','BJDIY2uATPEPXM3yDx-ZO','skip');
INSERT INTO "votes" VALUES('Rv_4w2zsKMfhkPAEeEsGp','bAU_FKrFGtcSQJyJnD4ay','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('Rx0tBZ_Rq0Pn1bOsEc_FC','uV2Of6uGO5sHvSlVZ49ie','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('I0FLcAEzaFbROZ3iV9Pxo','lN_KpCxq1aDENXe9aPX5Y','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('gsycaIx62Vs4MPewb5W4R','j2akcbMh0JJ8wAxde1uw4','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('Zgi9g_cOk5Gx8fOTMr8b5','BNFllQU_Xmue9vQlzfz7B','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('EEJ3fbyvEeOc5PstAtLsu','yNvKzUXq9oedAgkHhjjj9','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('Nw5eVMul46gXWBwhmFCcG','k3-ywKhT73XYuuStLHHwC','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('01JUZMuByUX5IHNHd7v0i','5YYnHgPqxkpfxnaB6B0Dp','EituNjAB_WjHf315o6FgB','maybe');
INSERT INTO "votes" VALUES('RU_na994UKoT8YqlqdiaZ','jwi9s0Q3537QyDqMFCOqg','EituNjAB_WjHf315o6FgB','skip');
INSERT INTO "votes" VALUES('NwEQ_g_UWrBqpnEicBgSg','Vk99eBmo99DZmka02C1TA','EituNjAB_WjHf315o6FgB','skip');
INSERT INTO "votes" VALUES('g5quz_RxQQytxnLkc7-Ae','wuZCyW47zQhn3I8dcMazB','EituNjAB_WjHf315o6FgB','maybe');
INSERT INTO "votes" VALUES('1QXlFfLv-t6VHmyQ1VoWE','2X60eLDXi0C9nCkPlGxZp','EituNjAB_WjHf315o6FgB','skip');
INSERT INTO "votes" VALUES('d0C8KhCptPd0Em4Iy5Tyq','mDUkRFD2oPZaA1Vl3ZbHk','EituNjAB_WjHf315o6FgB','interested');
INSERT INTO "votes" VALUES('gh47-ghMYSZswmfY5I_O9','DFVSLmJHZiI2F4C6hgQvQ','EituNjAB_WjHf315o6FgB','interested');
INSERT INTO "votes" VALUES('AeiSsOuUQQ11kSpZmkVe5','tcy--7UuRPQoM_Fb54v6P','EituNjAB_WjHf315o6FgB','skip');
INSERT INTO "votes" VALUES('ataP7VptAmML9GXCWqkl1','5YYnHgPqxkpfxnaB6B0Dp','Iwq7GEtgCWvad81RH-wzO','skip');
INSERT INTO "votes" VALUES('y6dLBGauYDeTBScVrfX0p','5ramGIUUZ66OYlc0E0VQx','Iwq7GEtgCWvad81RH-wzO','skip');
INSERT INTO "votes" VALUES('NitBwS-TWb6YUi3vAdSS6','Vk99eBmo99DZmka02C1TA','Iwq7GEtgCWvad81RH-wzO','skip');
INSERT INTO "votes" VALUES('OMXbp-ikx9hwAAeyiWRTW','wuZCyW47zQhn3I8dcMazB','Iwq7GEtgCWvad81RH-wzO','interested');
INSERT INTO "votes" VALUES('TWFhST7popWZ1P5Szkj6w','mDUkRFD2oPZaA1Vl3ZbHk','Iwq7GEtgCWvad81RH-wzO','skip');
INSERT INTO "votes" VALUES('dSb4tGKGjn7R-TkL6z-uD','V-TKZyCNbPUm1zp2vrGyB','Iwq7GEtgCWvad81RH-wzO','maybe');
INSERT INTO "votes" VALUES('gTv8-9-jsbd5tXnfnPsXk','8rcQtiTCRLPJ5phQLAikj','zyrIHrTaOd_Ujd3d5-r7v','maybe');
INSERT INTO "votes" VALUES('VSoeZIKabQfu77aKCNdZL','Vk99eBmo99DZmka02C1TA','zyrIHrTaOd_Ujd3d5-r7v','interested');
INSERT INTO "votes" VALUES('CpWEqv9yEVMupkh4_Kc13','PNzKCaNbOcez6Y5kmFmLA','zyrIHrTaOd_Ujd3d5-r7v','interested');
INSERT INTO "votes" VALUES('zaDD3u63pribnXGilRgsL','OP3Yn69HegT8fHMkcVBCk','zyrIHrTaOd_Ujd3d5-r7v','skip');
INSERT INTO "votes" VALUES('0xTz9uIz4j5ZBiwwd-kER','4v9cdFB0yfSWO_5eYBySq','zyrIHrTaOd_Ujd3d5-r7v','maybe');
INSERT INTO "votes" VALUES('K7irTQosuZW5GRJ8ZZ2SF','TJB63B73ewez4_ilCVYHH','zyrIHrTaOd_Ujd3d5-r7v','skip');
INSERT INTO "votes" VALUES('194nqX92jEqhK4UWqy89U','DFVSLmJHZiI2F4C6hgQvQ','zyrIHrTaOd_Ujd3d5-r7v','skip');
INSERT INTO "votes" VALUES('gKScIuHIXz04q3PGnYS4T','tcy--7UuRPQoM_Fb54v6P','zyrIHrTaOd_Ujd3d5-r7v','skip');
INSERT INTO "votes" VALUES('iF3OONgupL6JK-j2kN6_J','ezquWRqfCSq0Ehr47gXRf','5RoBJlTarTCYHwRtkcfoL','skip');
INSERT INTO "votes" VALUES('lwYJDO6YcyIr31lETkojk','jwi9s0Q3537QyDqMFCOqg','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('6IXhPmeqp9iTzpNrMVc16','5ramGIUUZ66OYlc0E0VQx','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('czfj87bYTsKbQR_8CPsxr','Vk99eBmo99DZmka02C1TA','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('sLSTbptuX5EUPK8oVEtLj','PNzKCaNbOcez6Y5kmFmLA','5RoBJlTarTCYHwRtkcfoL','maybe');
INSERT INTO "votes" VALUES('SOiKAdOe6wyGHZCf6O0KC','2X60eLDXi0C9nCkPlGxZp','5RoBJlTarTCYHwRtkcfoL','maybe');
INSERT INTO "votes" VALUES('FYqafyiNyh8Z7w3VWBDJ0','4v9cdFB0yfSWO_5eYBySq','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('yYfHGCdFEEP0rvfAQA4oK','DFVSLmJHZiI2F4C6hgQvQ','5RoBJlTarTCYHwRtkcfoL','maybe');
INSERT INTO "votes" VALUES('kOeR-Az4h3MgFLONo6Yy0','tcy--7UuRPQoM_Fb54v6P','5RoBJlTarTCYHwRtkcfoL','interested');
INSERT INTO "votes" VALUES('mT4Tcjixj0q3B3xg9Jumz','jwi9s0Q3537QyDqMFCOqg','e-yXTHs6PcH9T-UsjhUY5','maybe');
INSERT INTO "votes" VALUES('xj6gYmEfqQAR5MhIoGvH5','5ramGIUUZ66OYlc0E0VQx','e-yXTHs6PcH9T-UsjhUY5','maybe');
INSERT INTO "votes" VALUES('ZMpDNZLW2wAArkoHgE8eF','2X60eLDXi0C9nCkPlGxZp','e-yXTHs6PcH9T-UsjhUY5','interested');
INSERT INTO "votes" VALUES('F4v12ZWEtY0axWJHWq--C','V-TKZyCNbPUm1zp2vrGyB','e-yXTHs6PcH9T-UsjhUY5','interested');
INSERT INTO "votes" VALUES('F-uvPkTISO6K8JYSpK3oj','kAkAuUyIGbF_ki9YDB3Cg','e-yXTHs6PcH9T-UsjhUY5','interested');
INSERT INTO "votes" VALUES('FoRw1lum5AQhJeyaCG-7V','Vk99eBmo99DZmka02C1TA','VJv7TkFuM65FVq6naWCzX','interested');
INSERT INTO "votes" VALUES('YgGmh_5k4Iwp4XiuR1CDg','PNzKCaNbOcez6Y5kmFmLA','VJv7TkFuM65FVq6naWCzX','maybe');
INSERT INTO "votes" VALUES('msfOC_7gB0aeZn0hj6dgH','wuZCyW47zQhn3I8dcMazB','VJv7TkFuM65FVq6naWCzX','skip');
INSERT INTO "votes" VALUES('TKgWH01khIHpr2ASpyepv','OP3Yn69HegT8fHMkcVBCk','VJv7TkFuM65FVq6naWCzX','interested');
INSERT INTO "votes" VALUES('RhOsXVPF5NR5nQbxn7Mf-','2X60eLDXi0C9nCkPlGxZp','VJv7TkFuM65FVq6naWCzX','skip');
INSERT INTO "votes" VALUES('8ErlryuSpyAPWn_1tcSqu','V-TKZyCNbPUm1zp2vrGyB','VJv7TkFuM65FVq6naWCzX','maybe');
INSERT INTO "votes" VALUES('aw7TOqls-J5cW_ofaHMQq','kAkAuUyIGbF_ki9YDB3Cg','VJv7TkFuM65FVq6naWCzX','maybe');
INSERT INTO "votes" VALUES('dnmboyOMbdE87AhNusq4U','jwi9s0Q3537QyDqMFCOqg','TMwyO35bGPgDkc-FGoPC-','skip');
INSERT INTO "votes" VALUES('tSqWnAwavMOQz2ssWVR6H','8rcQtiTCRLPJ5phQLAikj','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('Ajhkv40iBeG-lxkRpdwdS','Vk99eBmo99DZmka02C1TA','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('FnG1Sj-H6_CmWXlBrD3G2','ayKLrK_auZU_a8zC-CmQo','TMwyO35bGPgDkc-FGoPC-','maybe');
INSERT INTO "votes" VALUES('W1uCrYXYAtRVfBIxtfwUr','2X60eLDXi0C9nCkPlGxZp','TMwyO35bGPgDkc-FGoPC-','maybe');
INSERT INTO "votes" VALUES('N0wXlLoDB3iNqO51fqcqx','TJB63B73ewez4_ilCVYHH','TMwyO35bGPgDkc-FGoPC-','interested');
INSERT INTO "votes" VALUES('oXbkdFxjy_1ayAeg2sujc','tcy--7UuRPQoM_Fb54v6P','TMwyO35bGPgDkc-FGoPC-','maybe');
INSERT INTO "votes" VALUES('2LVXoKXqK5sd2osK2DRyj','jwi9s0Q3537QyDqMFCOqg','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('JoopXGlljO7sdPeH2KXrH','8rcQtiTCRLPJ5phQLAikj','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('Zgi8UHQYBgwtOzZers2Py','5ramGIUUZ66OYlc0E0VQx','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('Pf-WQ_2CVgrbYedKxbTDU','Vk99eBmo99DZmka02C1TA','8QKBuH6l4CQk76FLe_S7M','maybe');
INSERT INTO "votes" VALUES('tQuTSttV439iW0MjDkOt_','PNzKCaNbOcez6Y5kmFmLA','8QKBuH6l4CQk76FLe_S7M','skip');
INSERT INTO "votes" VALUES('Wd5LhwPE-IBMq7KTCHqBD','2X60eLDXi0C9nCkPlGxZp','8QKBuH6l4CQk76FLe_S7M','interested');
INSERT INTO "votes" VALUES('necfhXJXP9Mmu8EWRecAV','TJB63B73ewez4_ilCVYHH','8QKBuH6l4CQk76FLe_S7M','maybe');
INSERT INTO "votes" VALUES('m3JYOXEH8lGffuOo3yyGy','DFVSLmJHZiI2F4C6hgQvQ','8QKBuH6l4CQk76FLe_S7M','maybe');
INSERT INTO "votes" VALUES('5l_p_JmU7793QS6l5X8fz','kAkAuUyIGbF_ki9YDB3Cg','8QKBuH6l4CQk76FLe_S7M','maybe');
INSERT INTO "votes" VALUES('W0POY75UUqxxky22aXnbM','ayKLrK_auZU_a8zC-CmQo','MVMnWjk26J_TG4aPxi2zT','skip');
INSERT INTO "votes" VALUES('78P03AWxzdiS6LXmkF7Fi','PNzKCaNbOcez6Y5kmFmLA','MVMnWjk26J_TG4aPxi2zT','maybe');
INSERT INTO "votes" VALUES('mzD_uz9RDKHi9FFoyg6XF','wuZCyW47zQhn3I8dcMazB','MVMnWjk26J_TG4aPxi2zT','interested');
INSERT INTO "votes" VALUES('K-7E4e5gWzgtRul6FlkIw','OP3Yn69HegT8fHMkcVBCk','MVMnWjk26J_TG4aPxi2zT','interested');
INSERT INTO "votes" VALUES('koCtYEgDIms62bbTQdCwK','2X60eLDXi0C9nCkPlGxZp','MVMnWjk26J_TG4aPxi2zT','interested');
INSERT INTO "votes" VALUES('QhfJvZSceXvcOM7Dg8EJQ','4v9cdFB0yfSWO_5eYBySq','MVMnWjk26J_TG4aPxi2zT','interested');
INSERT INTO "votes" VALUES('_0_3ISPd6PsREF7leLlgA','mrT7aqyQvcGfD2zlHA8wT','MVMnWjk26J_TG4aPxi2zT','maybe');
INSERT INTO "votes" VALUES('bI3ZDSU7TNIqNseiR_lZk','V-TKZyCNbPUm1zp2vrGyB','MVMnWjk26J_TG4aPxi2zT','maybe');
INSERT INTO "votes" VALUES('waG0q8cWLKxhlfBbvcJep','tcy--7UuRPQoM_Fb54v6P','MVMnWjk26J_TG4aPxi2zT','interested');
INSERT INTO "votes" VALUES('-hCh20pJxc8oRfRvBPG5Z','ezquWRqfCSq0Ehr47gXRf','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('Pytsx7YfIUxI7Y8Lmy171','5YYnHgPqxkpfxnaB6B0Dp','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('Y6OcdGXea3ecUlOHkKHMO','jwi9s0Q3537QyDqMFCOqg','_eafQ_Lu-VTSTvrjNGxr0','interested');
INSERT INTO "votes" VALUES('NfrQRZ8LTY49-foWyF8_w','Vk99eBmo99DZmka02C1TA','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('ZbkmvY8xxTt_2_ogrckPf','OP3Yn69HegT8fHMkcVBCk','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('7UM31QU-mySCref6O52Mr','V-TKZyCNbPUm1zp2vrGyB','_eafQ_Lu-VTSTvrjNGxr0','maybe');
INSERT INTO "votes" VALUES('xq6EaX4axpOQasC5T_8GP','5ramGIUUZ66OYlc0E0VQx','y6R-UbAIvgShxPDtT5wF3','maybe');
INSERT INTO "votes" VALUES('WmODq5FeHtvLivzUCQI7m','ayKLrK_auZU_a8zC-CmQo','y6R-UbAIvgShxPDtT5wF3','maybe');
INSERT INTO "votes" VALUES('l9hJrJ0osVoebf9N6pKUu','wuZCyW47zQhn3I8dcMazB','y6R-UbAIvgShxPDtT5wF3','skip');
INSERT INTO "votes" VALUES('yRXzMd6GixcSbUNpQJdEd','4v9cdFB0yfSWO_5eYBySq','y6R-UbAIvgShxPDtT5wF3','interested');
INSERT INTO "votes" VALUES('ppWvmpAseqvfAz-DfdBKd','TJB63B73ewez4_ilCVYHH','y6R-UbAIvgShxPDtT5wF3','interested');
INSERT INTO "votes" VALUES('t2LCZf-Kzm_dBgSJyQlF4','mDUkRFD2oPZaA1Vl3ZbHk','y6R-UbAIvgShxPDtT5wF3','skip');
INSERT INTO "votes" VALUES('aKA_Z2Jz1xaH_xaqcKRei','mrT7aqyQvcGfD2zlHA8wT','y6R-UbAIvgShxPDtT5wF3','skip');
INSERT INTO "votes" VALUES('DlkksWh1DpU0yZUU3G-YN','V-TKZyCNbPUm1zp2vrGyB','y6R-UbAIvgShxPDtT5wF3','interested');
INSERT INTO "votes" VALUES('6BF4lkRofTa5_rAwRY48y','kAkAuUyIGbF_ki9YDB3Cg','y6R-UbAIvgShxPDtT5wF3','interested');
INSERT INTO "votes" VALUES('UoMCoI875sA9OfCiyLEF-','jwi9s0Q3537QyDqMFCOqg','-iOLg-PYelc-CR4X_F5-K','interested');
INSERT INTO "votes" VALUES('ikDY8AoWQtwGPXLByneCp','mDUkRFD2oPZaA1Vl3ZbHk','-iOLg-PYelc-CR4X_F5-K','maybe');
INSERT INTO "votes" VALUES('UhMzzCVhZlUZ6f9-N3Jw-','tcy--7UuRPQoM_Fb54v6P','-iOLg-PYelc-CR4X_F5-K','skip');
INSERT INTO "votes" VALUES('sgMdE2gNRHuw41oOBXDYa','5ramGIUUZ66OYlc0E0VQx','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('BzllFYX_gva0tCCFuP1xw','Vk99eBmo99DZmka02C1TA','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('pJl6Jtrti-bx0i73u6D-V','PNzKCaNbOcez6Y5kmFmLA','CgW1YSth1u4WK-2oDhY83','maybe');
INSERT INTO "votes" VALUES('9gDURgaNOkP2yzEpQkzz9','TJB63B73ewez4_ilCVYHH','CgW1YSth1u4WK-2oDhY83','maybe');
INSERT INTO "votes" VALUES('NBUew0_nWOgyImSNFl7JB','mrT7aqyQvcGfD2zlHA8wT','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('06zjFQTt64ZGKZOIx8B5n','DFVSLmJHZiI2F4C6hgQvQ','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('bkqtNTkAoV9ygKMZcPGJV','kAkAuUyIGbF_ki9YDB3Cg','CgW1YSth1u4WK-2oDhY83','skip');
INSERT INTO "votes" VALUES('cdcaK2vVVtcA90iiqz5KK','tcy--7UuRPQoM_Fb54v6P','CgW1YSth1u4WK-2oDhY83','interested');
INSERT INTO "votes" VALUES('AfuffnMPddHHds2T0WWW4','ezquWRqfCSq0Ehr47gXRf','S64cWBuxSlVix39BvZluz','interested');
INSERT INTO "votes" VALUES('K4NNo8PeeomO0eUchsaEb','5YYnHgPqxkpfxnaB6B0Dp','S64cWBuxSlVix39BvZluz','skip');
INSERT INTO "votes" VALUES('QdSCMIi02_t-22nnk3UT3','Vk99eBmo99DZmka02C1TA','S64cWBuxSlVix39BvZluz','skip');
INSERT INTO "votes" VALUES('-1-10wHG-SMstZ4-rFy6X','ayKLrK_auZU_a8zC-CmQo','S64cWBuxSlVix39BvZluz','maybe');
INSERT INTO "votes" VALUES('vPeE8ZKSN8cQ8s52TSmTW','4v9cdFB0yfSWO_5eYBySq','S64cWBuxSlVix39BvZluz','maybe');
INSERT INTO "votes" VALUES('z3L1UO_yZrUGzDrdiSdJx','mrT7aqyQvcGfD2zlHA8wT','S64cWBuxSlVix39BvZluz','interested');
INSERT INTO "votes" VALUES('1OYMYPKGvSeMQa7dBpVMT','DFVSLmJHZiI2F4C6hgQvQ','S64cWBuxSlVix39BvZluz','maybe');
INSERT INTO "votes" VALUES('fHbqwnuz6AGHqnnXba9iK','V-TKZyCNbPUm1zp2vrGyB','S64cWBuxSlVix39BvZluz','maybe');
INSERT INTO "votes" VALUES('Wm8aolGAj2D2yHNK1r9gW','kAkAuUyIGbF_ki9YDB3Cg','S64cWBuxSlVix39BvZluz','skip');
INSERT INTO "votes" VALUES('unZ07bTJo1Tky-sDlWIss','tcy--7UuRPQoM_Fb54v6P','S64cWBuxSlVix39BvZluz','maybe');
INSERT INTO "votes" VALUES('Y1dxQlMOGMq3g1l6754l2','5ramGIUUZ66OYlc0E0VQx','sKMgWCotyzMq1f56--oMk','skip');
INSERT INTO "votes" VALUES('Y51hsmDM7F1yb5Z8r8vXJ','ayKLrK_auZU_a8zC-CmQo','sKMgWCotyzMq1f56--oMk','maybe');
INSERT INTO "votes" VALUES('-tzuajDTRl8MzDZ5Ryvjx','OP3Yn69HegT8fHMkcVBCk','sKMgWCotyzMq1f56--oMk','skip');
INSERT INTO "votes" VALUES('c44MvLLS_AHtcQtJJd-Y_','2X60eLDXi0C9nCkPlGxZp','sKMgWCotyzMq1f56--oMk','skip');
INSERT INTO "votes" VALUES('060TYuWyvmbyiPn729A4O','mDUkRFD2oPZaA1Vl3ZbHk','sKMgWCotyzMq1f56--oMk','interested');
INSERT INTO "votes" VALUES('iAI7PYyud59_C0RBUI3Y0','mrT7aqyQvcGfD2zlHA8wT','sKMgWCotyzMq1f56--oMk','interested');
INSERT INTO "votes" VALUES('UsnmkkrCjTotmYknK1vh5','kAkAuUyIGbF_ki9YDB3Cg','sKMgWCotyzMq1f56--oMk','skip');
INSERT INTO "votes" VALUES('4H0hIyI_7k0QMPVHYnCwK','8rcQtiTCRLPJ5phQLAikj','WxjmYVAi3tK2RgRv2ufeV','maybe');
INSERT INTO "votes" VALUES('KMWhgoFveNgIw01uxXeyR','5ramGIUUZ66OYlc0E0VQx','WxjmYVAi3tK2RgRv2ufeV','maybe');
INSERT INTO "votes" VALUES('RACz-53kQtpWW9FoS77Ao','Vk99eBmo99DZmka02C1TA','WxjmYVAi3tK2RgRv2ufeV','skip');
INSERT INTO "votes" VALUES('dHnQj_Ahy223KKa67nTVK','wuZCyW47zQhn3I8dcMazB','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('_al1GVntyPqn3MBIOfN4L','OP3Yn69HegT8fHMkcVBCk','WxjmYVAi3tK2RgRv2ufeV','interested');
INSERT INTO "votes" VALUES('IbmGHtkUKC7obJpNUBFB5','V-TKZyCNbPUm1zp2vrGyB','WxjmYVAi3tK2RgRv2ufeV','maybe');
INSERT INTO "votes" VALUES('kwHopMJ9HmR4WGlelFt8z','PNzKCaNbOcez6Y5kmFmLA','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('xOAa6JrycwTHkLygRx6dz','wuZCyW47zQhn3I8dcMazB','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('4iOdHuBy5ET8lsQotHIbJ','TJB63B73ewez4_ilCVYHH','5qZM4tI841iJy3W89QvIJ','maybe');
INSERT INTO "votes" VALUES('HT5wBFhnOHJMtiX-PBWUD','V-TKZyCNbPUm1zp2vrGyB','5qZM4tI841iJy3W89QvIJ','interested');
INSERT INTO "votes" VALUES('df6nFipqw-toyD3if4wGT','wuZCyW47zQhn3I8dcMazB','0LMe8d1wk8MKVFi8xqbc-','maybe');
INSERT INTO "votes" VALUES('pqztYgiHCuvGHZqYRnC5N','OP3Yn69HegT8fHMkcVBCk','0LMe8d1wk8MKVFi8xqbc-','interested');
INSERT INTO "votes" VALUES('RbJCtdXGX8NTkNdqo30Pa','TJB63B73ewez4_ilCVYHH','0LMe8d1wk8MKVFi8xqbc-','interested');
INSERT INTO "votes" VALUES('OMp5GgYAb84pddBzKrZ_-','mDUkRFD2oPZaA1Vl3ZbHk','0LMe8d1wk8MKVFi8xqbc-','skip');
INSERT INTO "votes" VALUES('d4q4o1khKgzg8tYyv1BIO','mrT7aqyQvcGfD2zlHA8wT','0LMe8d1wk8MKVFi8xqbc-','skip');
INSERT INTO "votes" VALUES('AJPxeQT9JT5XecqASt7ne','5YYnHgPqxkpfxnaB6B0Dp','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('bozZEnhEiai8s7TIXahan','5ramGIUUZ66OYlc0E0VQx','FRco957sXUlZiQxRhMTk1','maybe');
INSERT INTO "votes" VALUES('ryRDDofzHVIVzvrdYrkj7','Vk99eBmo99DZmka02C1TA','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('62X3JIUMsursKoq1oHuWK','mDUkRFD2oPZaA1Vl3ZbHk','FRco957sXUlZiQxRhMTk1','interested');
INSERT INTO "votes" VALUES('enqWBF0ju4d-aMdfatLrQ','DFVSLmJHZiI2F4C6hgQvQ','FRco957sXUlZiQxRhMTk1','skip');
INSERT INTO "votes" VALUES('6YNWoM1QfXn4t_PdF0sJD','ezquWRqfCSq0Ehr47gXRf','otumnw13-zuz710X66T6D','skip');
INSERT INTO "votes" VALUES('PCskZtz1W8ODT6VhBZeNL','5YYnHgPqxkpfxnaB6B0Dp','otumnw13-zuz710X66T6D','maybe');
INSERT INTO "votes" VALUES('4rTHB0u7978kYJw-NkjmG','ayKLrK_auZU_a8zC-CmQo','otumnw13-zuz710X66T6D','skip');
INSERT INTO "votes" VALUES('ZEbmfw7GdYsLo_AmffyVD','wuZCyW47zQhn3I8dcMazB','otumnw13-zuz710X66T6D','interested');
INSERT INTO "votes" VALUES('3wBST-RpnFnCXt2j_A0AI','TJB63B73ewez4_ilCVYHH','otumnw13-zuz710X66T6D','skip');
INSERT INTO "votes" VALUES('DkKGYXHIJuy0LjHu5Xqfd','mrT7aqyQvcGfD2zlHA8wT','otumnw13-zuz710X66T6D','skip');
INSERT INTO "votes" VALUES('Y3JVjzqD7GKxq1Kr3KeXJ','tcy--7UuRPQoM_Fb54v6P','otumnw13-zuz710X66T6D','maybe');
INSERT INTO "votes" VALUES('6j1bW5Tzc3y29WnJfp1PD','5YYnHgPqxkpfxnaB6B0Dp','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('oSgiD64nXVO16TiDJh_fc','jwi9s0Q3537QyDqMFCOqg','cvViWkjK94CO4UXI59bMg','interested');
INSERT INTO "votes" VALUES('9uBacwUG-lEWwZGLFja6j','OP3Yn69HegT8fHMkcVBCk','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('m7DIINqykGxoMdyKW_Qa9','2X60eLDXi0C9nCkPlGxZp','cvViWkjK94CO4UXI59bMg','interested');
INSERT INTO "votes" VALUES('voNa9zUFWQqciVavzGJ1n','4v9cdFB0yfSWO_5eYBySq','cvViWkjK94CO4UXI59bMg','skip');
INSERT INTO "votes" VALUES('UVXWIjpPq7ZfpHRhBd4FV','V-TKZyCNbPUm1zp2vrGyB','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('UgWvcj1JAt7xBs-023rIw','kAkAuUyIGbF_ki9YDB3Cg','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('c95tdeSKFj8XnMQY9GW_N','tcy--7UuRPQoM_Fb54v6P','cvViWkjK94CO4UXI59bMg','maybe');
INSERT INTO "votes" VALUES('YQcU1_OnMQXKeL4LHOGBp','ezquWRqfCSq0Ehr47gXRf','EWf92Tq3hSWbCnwZF_gXk','skip');
INSERT INTO "votes" VALUES('M5WF2ToV6v4-ZXF7JiFxG','5YYnHgPqxkpfxnaB6B0Dp','EWf92Tq3hSWbCnwZF_gXk','interested');
INSERT INTO "votes" VALUES('7wFUhZ0LJo8tMul7QQLZC','PNzKCaNbOcez6Y5kmFmLA','EWf92Tq3hSWbCnwZF_gXk','maybe');
INSERT INTO "votes" VALUES('SS0YR_FbFeE4FplJzEnxw','4v9cdFB0yfSWO_5eYBySq','EWf92Tq3hSWbCnwZF_gXk','interested');
INSERT INTO "votes" VALUES('b9kkQ8-LxyU9905aUpfqT','TJB63B73ewez4_ilCVYHH','EWf92Tq3hSWbCnwZF_gXk','maybe');
INSERT INTO "votes" VALUES('UCskpLDI6WqQBNUg8nJgF','mDUkRFD2oPZaA1Vl3ZbHk','EWf92Tq3hSWbCnwZF_gXk','maybe');
INSERT INTO "votes" VALUES('o--sUbQmY-mv9tx5-JeZH','V-TKZyCNbPUm1zp2vrGyB','EWf92Tq3hSWbCnwZF_gXk','maybe');
INSERT INTO "votes" VALUES('Skdhn7irge7WZrpCkhjnK','ezquWRqfCSq0Ehr47gXRf','XY9PuqahecxoNFZq3eayA','interested');
INSERT INTO "votes" VALUES('JRsmM7TvH-eDTD-sil1Zv','8rcQtiTCRLPJ5phQLAikj','XY9PuqahecxoNFZq3eayA','interested');
INSERT INTO "votes" VALUES('R0Fl6FIVQOlOlzEu2gnzW','Vk99eBmo99DZmka02C1TA','XY9PuqahecxoNFZq3eayA','skip');
INSERT INTO "votes" VALUES('R05vJElbJe-WPNZM6dnxK','PNzKCaNbOcez6Y5kmFmLA','XY9PuqahecxoNFZq3eayA','skip');
INSERT INTO "votes" VALUES('TOVVU6M3umB1lKbcFbcLf','wuZCyW47zQhn3I8dcMazB','XY9PuqahecxoNFZq3eayA','maybe');
INSERT INTO "votes" VALUES('GTZsguZ7fswoAeUDh5Flu','2X60eLDXi0C9nCkPlGxZp','XY9PuqahecxoNFZq3eayA','skip');
INSERT INTO "votes" VALUES('XIv-c3uGyeVQBd6SuW8NG','kAkAuUyIGbF_ki9YDB3Cg','XY9PuqahecxoNFZq3eayA','interested');
INSERT INTO "votes" VALUES('EPzyXtTJkITAXMTicK810','5YYnHgPqxkpfxnaB6B0Dp','W1CGkv8V4tYDIHKx9_O_W','maybe');
INSERT INTO "votes" VALUES('uqZ0L0iRvi99Tp63HDVjz','Vk99eBmo99DZmka02C1TA','W1CGkv8V4tYDIHKx9_O_W','skip');
INSERT INTO "votes" VALUES('7ajy6xPkoptyDecPs_Tvk','PNzKCaNbOcez6Y5kmFmLA','W1CGkv8V4tYDIHKx9_O_W','skip');
INSERT INTO "votes" VALUES('VoCHZF-W8RbcdOrJPsWjr','wuZCyW47zQhn3I8dcMazB','W1CGkv8V4tYDIHKx9_O_W','maybe');
INSERT INTO "votes" VALUES('YcQY9EzUIQQ-h6bJ2blXb','OP3Yn69HegT8fHMkcVBCk','W1CGkv8V4tYDIHKx9_O_W','maybe');
INSERT INTO "votes" VALUES('ToIQBdkPjrKE9ETCNBWu5','mrT7aqyQvcGfD2zlHA8wT','W1CGkv8V4tYDIHKx9_O_W','interested');
INSERT INTO "votes" VALUES('r606kchbh0ToBOQv1ZGBe','kAkAuUyIGbF_ki9YDB3Cg','W1CGkv8V4tYDIHKx9_O_W','interested');
INSERT INTO "votes" VALUES('HaWMy9fiwHc83aMHZWJU9','jwi9s0Q3537QyDqMFCOqg','fi_8fZO3-RwyxSOlAId4g','maybe');
INSERT INTO "votes" VALUES('dXk4ixiarOCITkYAx3nru','5ramGIUUZ66OYlc0E0VQx','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('KpscY-OZO7A1AkY5Atsxv','Vk99eBmo99DZmka02C1TA','fi_8fZO3-RwyxSOlAId4g','maybe');
INSERT INTO "votes" VALUES('Pc96DtGJ8pEoO1f1Kax8d','wuZCyW47zQhn3I8dcMazB','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('bO_V4YJD96oV38N3RswcQ','2X60eLDXi0C9nCkPlGxZp','fi_8fZO3-RwyxSOlAId4g','maybe');
INSERT INTO "votes" VALUES('2Dz2yAxP-0cBFoid_D_yK','DFVSLmJHZiI2F4C6hgQvQ','fi_8fZO3-RwyxSOlAId4g','interested');
INSERT INTO "votes" VALUES('xO6qu8y7fZfITnWmwbC1Z','jwi9s0Q3537QyDqMFCOqg','D1hCRrolteRhGfbdoLxXy','maybe');
INSERT INTO "votes" VALUES('XOuB0MB1Q-eaEUIXB0tta','8rcQtiTCRLPJ5phQLAikj','D1hCRrolteRhGfbdoLxXy','interested');
INSERT INTO "votes" VALUES('mRQCqLz71LPXnZEWxBhYc','5ramGIUUZ66OYlc0E0VQx','D1hCRrolteRhGfbdoLxXy','skip');
INSERT INTO "votes" VALUES('yADyCsxnRE6QstyCk4YPX','Vk99eBmo99DZmka02C1TA','D1hCRrolteRhGfbdoLxXy','maybe');
INSERT INTO "votes" VALUES('m0_jEkGcDRq_jdK1dAmLR','PNzKCaNbOcez6Y5kmFmLA','D1hCRrolteRhGfbdoLxXy','skip');
INSERT INTO "votes" VALUES('ZGi2LZRXNgW7oNEgNPgJb','OP3Yn69HegT8fHMkcVBCk','D1hCRrolteRhGfbdoLxXy','interested');
INSERT INTO "votes" VALUES('ZnAbcAR-_zpUwczlAkTOi','2X60eLDXi0C9nCkPlGxZp','D1hCRrolteRhGfbdoLxXy','interested');
INSERT INTO "votes" VALUES('v83WOsi2gFREWL2pW23Y-','4v9cdFB0yfSWO_5eYBySq','D1hCRrolteRhGfbdoLxXy','interested');
INSERT INTO "votes" VALUES('IsbEB7Ne09wgNDvtKCacT','DFVSLmJHZiI2F4C6hgQvQ','D1hCRrolteRhGfbdoLxXy','skip');
INSERT INTO "votes" VALUES('LvTmYXWtqmSMEVoKlIVrW','tcy--7UuRPQoM_Fb54v6P','D1hCRrolteRhGfbdoLxXy','maybe');
INSERT INTO "votes" VALUES('bnb1AMSqx7Xfe-5VuQ8ec','ezquWRqfCSq0Ehr47gXRf','iy2yD5_tSIsixmTgpsNpy','skip');
INSERT INTO "votes" VALUES('Nd8FN23nlym7sX4jY2cR4','5ramGIUUZ66OYlc0E0VQx','iy2yD5_tSIsixmTgpsNpy','skip');
INSERT INTO "votes" VALUES('yL7k_4pchisv00AYA8lqA','Vk99eBmo99DZmka02C1TA','iy2yD5_tSIsixmTgpsNpy','maybe');
INSERT INTO "votes" VALUES('xBxcgqnbvxmxGkXA3dht3','ayKLrK_auZU_a8zC-CmQo','iy2yD5_tSIsixmTgpsNpy','maybe');
INSERT INTO "votes" VALUES('shyhM6bJJJMfFtKPT_98G','2X60eLDXi0C9nCkPlGxZp','iy2yD5_tSIsixmTgpsNpy','interested');
INSERT INTO "votes" VALUES('dQr2k122gJcQ4cfgVs2fT','kAkAuUyIGbF_ki9YDB3Cg','iy2yD5_tSIsixmTgpsNpy','skip');
INSERT INTO "votes" VALUES('1BdWOjZyxhF3vhujAlt5p','tcy--7UuRPQoM_Fb54v6P','iy2yD5_tSIsixmTgpsNpy','skip');
INSERT INTO "votes" VALUES('tCwnrvaQYLZ47yu4TDud2','5YYnHgPqxkpfxnaB6B0Dp','uQpQIf84U5tZa1y8xb16Y','interested');
INSERT INTO "votes" VALUES('kqVo6qpg8UKb0Nye1qRo-','jwi9s0Q3537QyDqMFCOqg','uQpQIf84U5tZa1y8xb16Y','maybe');
INSERT INTO "votes" VALUES('83c4j-XtfTuAB1LPyws6c','tcy--7UuRPQoM_Fb54v6P','uQpQIf84U5tZa1y8xb16Y','maybe');
INSERT INTO "votes" VALUES('74jKucoTbzeIjLob3Y8XS','5YYnHgPqxkpfxnaB6B0Dp','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('5N6x1rZIS7q1-220QJsw8','8rcQtiTCRLPJ5phQLAikj','_U51msK4jornrFgQyg3MW','interested');
INSERT INTO "votes" VALUES('gx7joJbWmLnrA2UmacAtl','5ramGIUUZ66OYlc0E0VQx','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('HioEv1xosa5l3EOefB47O','Vk99eBmo99DZmka02C1TA','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('H7Dfu37tPPStl645aHu1C','PNzKCaNbOcez6Y5kmFmLA','_U51msK4jornrFgQyg3MW','skip');
INSERT INTO "votes" VALUES('V4L3b8arKxxzqU9u3zoLw','mrT7aqyQvcGfD2zlHA8wT','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('Up11P-pMIBycHflw5hvdO','DFVSLmJHZiI2F4C6hgQvQ','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('naMtxUK68MmKn81qZg9xc','V-TKZyCNbPUm1zp2vrGyB','_U51msK4jornrFgQyg3MW','skip');
INSERT INTO "votes" VALUES('MyGO3I_FLbUhyubPk4GP4','kAkAuUyIGbF_ki9YDB3Cg','_U51msK4jornrFgQyg3MW','maybe');
INSERT INTO "votes" VALUES('I1AZRHCxwiJyeccnm94fd','jwi9s0Q3537QyDqMFCOqg','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('s6Fg0JEVqChm1kVpZDSfR','ayKLrK_auZU_a8zC-CmQo','dTFo3Jnrjd6t66UB7o0zU','maybe');
INSERT INTO "votes" VALUES('hvwOadgq_EimORrzYxjWn','PNzKCaNbOcez6Y5kmFmLA','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('4Qg6a-cYqeyTwgsx2qUBd','wuZCyW47zQhn3I8dcMazB','dTFo3Jnrjd6t66UB7o0zU','maybe');
INSERT INTO "votes" VALUES('-iNrtpFPizg3jJDCRDpCJ','OP3Yn69HegT8fHMkcVBCk','dTFo3Jnrjd6t66UB7o0zU','maybe');
INSERT INTO "votes" VALUES('xouFNdEoLy4cc9RN-EP3o','TJB63B73ewez4_ilCVYHH','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('0183fTmyURCYice-xkjQX','mrT7aqyQvcGfD2zlHA8wT','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('jPoDfWf9Gc61UpJI7R_B1','DFVSLmJHZiI2F4C6hgQvQ','dTFo3Jnrjd6t66UB7o0zU','interested');
INSERT INTO "votes" VALUES('TihYi5k1ayrHCWSMLn_vo','tcy--7UuRPQoM_Fb54v6P','dTFo3Jnrjd6t66UB7o0zU','skip');
INSERT INTO "votes" VALUES('jZ8OeNljlBo7t0lRvxMHq','ezquWRqfCSq0Ehr47gXRf','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('KFeQH5x0368ppGv7QbYTZ','jwi9s0Q3537QyDqMFCOqg','fklWHIi2n0xjZ4PBRc_V4','skip');
INSERT INTO "votes" VALUES('zzwFK6mDV82rMkkF2nqcd','OP3Yn69HegT8fHMkcVBCk','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('owb8I-crG2qomFxpoPJvI','TJB63B73ewez4_ilCVYHH','fklWHIi2n0xjZ4PBRc_V4','maybe');
INSERT INTO "votes" VALUES('_8U1g5vQTjT6CpkU6PDxF','kAkAuUyIGbF_ki9YDB3Cg','fklWHIi2n0xjZ4PBRc_V4','interested');
INSERT INTO "votes" VALUES('zqGR3N2hNsElo1lxn-fKV','ezquWRqfCSq0Ehr47gXRf','A0I-G-uWpciyMueS9JxQ-','interested');
INSERT INTO "votes" VALUES('Z08cOovuSRTj7KxcJ8-SJ','8rcQtiTCRLPJ5phQLAikj','A0I-G-uWpciyMueS9JxQ-','interested');
INSERT INTO "votes" VALUES('FuQQQHunaVSRviNMXbKRV','Vk99eBmo99DZmka02C1TA','A0I-G-uWpciyMueS9JxQ-','skip');
INSERT INTO "votes" VALUES('f2KNPAV3oZTbSvJANJngS','ayKLrK_auZU_a8zC-CmQo','A0I-G-uWpciyMueS9JxQ-','maybe');
INSERT INTO "votes" VALUES('hm0yQjI-_LS1WMIVTQPyL','PNzKCaNbOcez6Y5kmFmLA','A0I-G-uWpciyMueS9JxQ-','maybe');
INSERT INTO "votes" VALUES('PMLFDj91mIyVaq51-fazb','4v9cdFB0yfSWO_5eYBySq','A0I-G-uWpciyMueS9JxQ-','interested');
INSERT INTO "votes" VALUES('fhXQbfLYqg0foCKMwT-Hp','TJB63B73ewez4_ilCVYHH','A0I-G-uWpciyMueS9JxQ-','interested');
INSERT INTO "votes" VALUES('HRjPbSUXTK0gSXruT4g31','5YYnHgPqxkpfxnaB6B0Dp','QUNxetzvBuqS5LC-YJbVO','maybe');
INSERT INTO "votes" VALUES('lZGG9wy0d5HtZzG2V9FMd','5ramGIUUZ66OYlc0E0VQx','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('U9HtTVMA74CV5sMrpVRR5','Vk99eBmo99DZmka02C1TA','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('YqlL7LAdIV5ufBJZoIlfA','PNzKCaNbOcez6Y5kmFmLA','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('TusxYEak-ATL27YLAvcVs','wuZCyW47zQhn3I8dcMazB','QUNxetzvBuqS5LC-YJbVO','maybe');
INSERT INTO "votes" VALUES('k68lb6piGRr1D0hDxHZFn','OP3Yn69HegT8fHMkcVBCk','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('OjInhzjopo1Ir8G0vmUyg','2X60eLDXi0C9nCkPlGxZp','QUNxetzvBuqS5LC-YJbVO','skip');
INSERT INTO "votes" VALUES('-9BaMbGEZHqqDseUOjs3k','mDUkRFD2oPZaA1Vl3ZbHk','QUNxetzvBuqS5LC-YJbVO','maybe');
INSERT INTO "votes" VALUES('uAu5GtjQy1Al_1oNuleDP','DFVSLmJHZiI2F4C6hgQvQ','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('cFLNzhfLnemnLaN6P0Nyx','tcy--7UuRPQoM_Fb54v6P','QUNxetzvBuqS5LC-YJbVO','interested');
INSERT INTO "votes" VALUES('mLGqkMk2Yxt_wOuPtttj0','OP3Yn69HegT8fHMkcVBCk','pr5D-yEw215TtcJLb-Bnh','skip');
INSERT INTO "votes" VALUES('4hUJNo8bDYpjP8YYbWnSB','2X60eLDXi0C9nCkPlGxZp','pr5D-yEw215TtcJLb-Bnh','interested');
INSERT INTO "votes" VALUES('iSz5r1fKrSFECfhhB5Lkb','4v9cdFB0yfSWO_5eYBySq','pr5D-yEw215TtcJLb-Bnh','skip');
INSERT INTO "votes" VALUES('g6i9w9Eu5GhtCR-BGl3sI','mDUkRFD2oPZaA1Vl3ZbHk','pr5D-yEw215TtcJLb-Bnh','maybe');
INSERT INTO "votes" VALUES('kFbty8Fcq6E7mU3YvBIC3','mrT7aqyQvcGfD2zlHA8wT','pr5D-yEw215TtcJLb-Bnh','maybe');
INSERT INTO "votes" VALUES('IdLgWtug3DIm541r45Eqb','V-TKZyCNbPUm1zp2vrGyB','pr5D-yEw215TtcJLb-Bnh','skip');
INSERT INTO "votes" VALUES('hRS1bKKPvyk86OSiXBxDW','tcy--7UuRPQoM_Fb54v6P','pr5D-yEw215TtcJLb-Bnh','maybe');
INSERT INTO "votes" VALUES('uX9_5965tderLR168eiXJ','jwi9s0Q3537QyDqMFCOqg','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('CjJWeiDvQEftA5hEBnKVM','8rcQtiTCRLPJ5phQLAikj','cAq5a5RQYt7sKvN5wbvW8','interested');
INSERT INTO "votes" VALUES('_POwbOlHeuYt5FfBOSrEA','5ramGIUUZ66OYlc0E0VQx','cAq5a5RQYt7sKvN5wbvW8','interested');
INSERT INTO "votes" VALUES('s4r7pQFsBPNzdnS2dLUSd','ayKLrK_auZU_a8zC-CmQo','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('MjzBwA7xFdO4mrNx6dCaN','PNzKCaNbOcez6Y5kmFmLA','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('bKdOFlO-KoFee88kkfoZh','OP3Yn69HegT8fHMkcVBCk','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('dAvrrRMZF51DykE4Wa-wV','4v9cdFB0yfSWO_5eYBySq','cAq5a5RQYt7sKvN5wbvW8','interested');
INSERT INTO "votes" VALUES('aKMQjH_Ac1mSEJOu38eql','kAkAuUyIGbF_ki9YDB3Cg','cAq5a5RQYt7sKvN5wbvW8','maybe');
INSERT INTO "votes" VALUES('-KQ6BPQbanv-O1ixaR26N','ezquWRqfCSq0Ehr47gXRf','tvwQ1sGC1hAqQwOKSJFIt','maybe');
INSERT INTO "votes" VALUES('0VdrCcr467L2K0t4zkZvT','5YYnHgPqxkpfxnaB6B0Dp','tvwQ1sGC1hAqQwOKSJFIt','maybe');
INSERT INTO "votes" VALUES('PRI6tbEa4sepWE38D-0qD','PNzKCaNbOcez6Y5kmFmLA','tvwQ1sGC1hAqQwOKSJFIt','interested');
INSERT INTO "votes" VALUES('KlfMZu89l9nQy5OLwcSx9','2X60eLDXi0C9nCkPlGxZp','tvwQ1sGC1hAqQwOKSJFIt','maybe');
INSERT INTO "votes" VALUES('BPM87LbwIDWhpWxSOOawt','4v9cdFB0yfSWO_5eYBySq','tvwQ1sGC1hAqQwOKSJFIt','maybe');
INSERT INTO "votes" VALUES('sJyHgQ2IWXMMbvnOAb-Uz','V-TKZyCNbPUm1zp2vrGyB','tvwQ1sGC1hAqQwOKSJFIt','interested');
INSERT INTO "votes" VALUES('LFc7t-aVQWzSRY4F7SKVD','tcy--7UuRPQoM_Fb54v6P','tvwQ1sGC1hAqQwOKSJFIt','interested');
INSERT INTO "votes" VALUES('ZPahaqA6lfFGaceNb5RKU','8rcQtiTCRLPJ5phQLAikj','IbjHTKBrAmzMoaPqkXz1h','skip');
INSERT INTO "votes" VALUES('Wd-3oucYpWzP6LgpHjUPb','Vk99eBmo99DZmka02C1TA','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('QXdrlcdF07ARW931tmj9T','wuZCyW47zQhn3I8dcMazB','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('8RBS-9sLpLnrD38XBnhTR','2X60eLDXi0C9nCkPlGxZp','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('Qp7Vrq1jjdWT22MZAKHNQ','mDUkRFD2oPZaA1Vl3ZbHk','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('HrTMW0L3Y2pwF2N0IJqJp','DFVSLmJHZiI2F4C6hgQvQ','IbjHTKBrAmzMoaPqkXz1h','skip');
INSERT INTO "votes" VALUES('uyGZ0xS1M28iweW5VdVYD','V-TKZyCNbPUm1zp2vrGyB','IbjHTKBrAmzMoaPqkXz1h','skip');
INSERT INTO "votes" VALUES('hdgk5ERnkbmQ9qhomelLi','kAkAuUyIGbF_ki9YDB3Cg','IbjHTKBrAmzMoaPqkXz1h','interested');
INSERT INTO "votes" VALUES('mY8ZAIVjxU9gAH_yqY1Gx','tcy--7UuRPQoM_Fb54v6P','IbjHTKBrAmzMoaPqkXz1h','maybe');
INSERT INTO "votes" VALUES('Ggouc4iBpRA8Swn1plt_E','ezquWRqfCSq0Ehr47gXRf','_4CD5YXbM-Kruw1_f2paY','skip');
INSERT INTO "votes" VALUES('4EW-T9amd10bvaF85ZmAZ','8rcQtiTCRLPJ5phQLAikj','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('oZmzUoOqDP6gQBIFOOMNi','ayKLrK_auZU_a8zC-CmQo','_4CD5YXbM-Kruw1_f2paY','skip');
INSERT INTO "votes" VALUES('VWThenWYCB84eBg0YbT4H','wuZCyW47zQhn3I8dcMazB','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('6JGZg6IMedup6CSae65ZF','2X60eLDXi0C9nCkPlGxZp','_4CD5YXbM-Kruw1_f2paY','maybe');
INSERT INTO "votes" VALUES('XOG5bTL-CpgUVig-Evo9j','TJB63B73ewez4_ilCVYHH','_4CD5YXbM-Kruw1_f2paY','maybe');
INSERT INTO "votes" VALUES('LLFnZU8xPVjC1ffIlDckD','mrT7aqyQvcGfD2zlHA8wT','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('h8bk17GpLJ6fsSLHO4fPL','kAkAuUyIGbF_ki9YDB3Cg','_4CD5YXbM-Kruw1_f2paY','interested');
INSERT INTO "votes" VALUES('yn1n59ziLbF6UvlIA7M4l','ezquWRqfCSq0Ehr47gXRf','BJDIY2uATPEPXM3yDx-ZO','skip');
INSERT INTO "votes" VALUES('jXk3JGIsj9VgmPfIyFWVy','jwi9s0Q3537QyDqMFCOqg','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('EVbDBvCDiOig54ta11hFm','OP3Yn69HegT8fHMkcVBCk','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('c9Fii7aWMdaYQd8WtDB6V','4v9cdFB0yfSWO_5eYBySq','BJDIY2uATPEPXM3yDx-ZO','skip');
INSERT INTO "votes" VALUES('yu3d9sNGwmxljJpsNDNQm','mDUkRFD2oPZaA1Vl3ZbHk','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('_iso8e_F_fKWIetFSRtIi','mrT7aqyQvcGfD2zlHA8wT','BJDIY2uATPEPXM3yDx-ZO','skip');
INSERT INTO "votes" VALUES('OCrncpCIy4e8Br3GI2YDS','kAkAuUyIGbF_ki9YDB3Cg','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('gQxbXuhCc5U7a-DrKoRBs','tcy--7UuRPQoM_Fb54v6P','BJDIY2uATPEPXM3yDx-ZO','interested');
INSERT INTO "votes" VALUES('vsIKRcLMwVz9pCJB38loE','5YYnHgPqxkpfxnaB6B0Dp','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('YjsiSTbTVQmrxG-9XptMX','jwi9s0Q3537QyDqMFCOqg','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('gQLkrn5J54g0Is2ZA1nEK','8rcQtiTCRLPJ5phQLAikj','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('tU7Rq6vy7VEIJ4c8IeG0a','Vk99eBmo99DZmka02C1TA','Ukahzcxq4tVlAS70ytr_m','skip');
INSERT INTO "votes" VALUES('Ke60dQd5YRVj82jsQR4bd','wuZCyW47zQhn3I8dcMazB','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('RgdAsVLQRv1seAJCwXVxl','OP3Yn69HegT8fHMkcVBCk','Ukahzcxq4tVlAS70ytr_m','maybe');
INSERT INTO "votes" VALUES('KK0mrgvso9bVzwXRmieXT','2X60eLDXi0C9nCkPlGxZp','Ukahzcxq4tVlAS70ytr_m','interested');
INSERT INTO "votes" VALUES('TSAhIcQ4mTRMu6-1UB9u2','tcy--7UuRPQoM_Fb54v6P','Ukahzcxq4tVlAS70ytr_m','skip');
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
, `slot_increment_minutes` integer DEFAULT 30 NOT NULL, `rsvp_capacity_hard_limit` integer DEFAULT false NOT NULL, `meetings_enabled` integer DEFAULT false NOT NULL, `max_open_meeting_requests` integer DEFAULT 5 NOT NULL);
INSERT INTO "events" VALUES('vDpIksoQEmvZ45H2j0PEq','Conference Alpha','Conference-Alpha','Event currently in proposal phase','https://test-event-1.example.com','2026-10-20T07:00:00.000Z','2026-10-22T16:00:00.000Z','2026-09-01T18:16:59.174Z','2026-09-15T18:16:59.174Z','2026-09-15T18:16:59.174Z','2026-09-29T18:16:59.174Z','2026-09-29T18:16:59.174Z','2026-10-22T16:00:00.000Z',120,10,'Europe/Berlin','AcademicCapIcon',30,0,1,5);
INSERT INTO "events" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Conference Beta','Conference-Beta','Event currently in **voting** phase — cast your votes and check the [event website](https://test-event-2.example.com) for updates.','https://test-event-2.example.com','2026-10-06T07:00:00.000Z','2026-10-08T16:00:00.000Z','2026-08-18T18:16:59.174Z','2026-09-01T18:16:59.174Z','2026-09-01T18:16:59.174Z','2026-09-15T18:16:59.174Z','2026-09-15T18:16:59.174Z','2026-10-08T16:00:00.000Z',120,10,'Europe/Berlin','BeakerIcon',30,0,1,5);
INSERT INTO "events" VALUES('SP0cKZnzLKO0kR0q-jzYX','Conference Gamma','Conference-Gamma','Event currently in **scheduling phase**.

### Quick links

- [Venue map](https://test-event-3.example.com/map)
- [Code of conduct](https://test-event-3.example.com/coc)','https://test-event-3.example.com','2026-09-22T07:00:00.000Z','2026-09-25T01:00:00.000Z','2026-08-04T18:16:59.174Z','2026-08-18T18:16:59.174Z','2026-08-18T18:16:59.174Z','2026-09-01T18:16:59.174Z','2026-09-01T18:16:59.174Z','2026-09-25T01:00:00.000Z',120,10,'Europe/Berlin','GlobeAltIcon',30,0,1,5);
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
	`event_id` text NOT NULL, `attendee_count` integer,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "sessions" VALUES('HOPcQHlNNinnbFCZFQpny','Opening Keynote - Conference Alpha','Welcome to Conference Alpha','2026-10-20T07:00:00.000Z','2026-10-20T08:30:00.000Z',100,1,0,0,NULL,'vDpIksoQEmvZ45H2j0PEq',NULL);
INSERT INTO "sessions" VALUES('67g-PQy1-in6xpYk9qzWz','Lunch Break','','2026-10-20T10:30:00.000Z','2026-10-20T12:00:00.000Z',0,1,1,0,NULL,'vDpIksoQEmvZ45H2j0PEq',NULL);
INSERT INTO "sessions" VALUES('3KNzHC6E0D52gJNdOFZMY','Lunch Break','','2026-10-21T10:30:00.000Z','2026-10-21T12:00:00.000Z',0,1,1,0,NULL,'vDpIksoQEmvZ45H2j0PEq',NULL);
INSERT INTO "sessions" VALUES('1VJQiYwjFNxE_CfhVr2_4','Lunch Break','','2026-10-22T10:30:00.000Z','2026-10-22T12:00:00.000Z',0,1,1,0,NULL,'vDpIksoQEmvZ45H2j0PEq',NULL);
INSERT INTO "sessions" VALUES('EVl8NAMN5862wGwLE6GIw','Opening Keynote - Conference Beta','Welcome to Conference Beta','2026-10-06T07:00:00.000Z','2026-10-06T08:30:00.000Z',100,1,0,0,NULL,'Rt3UVc16Wmx7VD1-Ugzvy',NULL);
INSERT INTO "sessions" VALUES('53Z4MjmMpisMRcZ8L4np-','Lunch Break','','2026-10-06T10:30:00.000Z','2026-10-06T12:00:00.000Z',0,1,1,0,NULL,'Rt3UVc16Wmx7VD1-Ugzvy',NULL);
INSERT INTO "sessions" VALUES('6TH2pwHJQ7QLaVrsVZWaP','Lunch Break','','2026-10-07T10:30:00.000Z','2026-10-07T12:00:00.000Z',0,1,1,0,NULL,'Rt3UVc16Wmx7VD1-Ugzvy',NULL);
INSERT INTO "sessions" VALUES('AVgaHrJW-gg-fNu677lt_','Lunch Break','','2026-10-08T10:30:00.000Z','2026-10-08T12:00:00.000Z',0,1,1,0,NULL,'Rt3UVc16Wmx7VD1-Ugzvy',NULL);
INSERT INTO "sessions" VALUES('6M3_cr1tJafC7uRmLgygB','Opening Keynote - Conference Gamma','Welcome to Conference Gamma','2026-09-22T07:00:00.000Z','2026-09-22T08:30:00.000Z',100,1,0,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('gvb5pv4Wx2rPXNAAyeWwY','Lunch Break','','2026-09-22T10:30:00.000Z','2026-09-22T12:00:00.000Z',0,1,1,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('tfKpzKFiZh12O73YvDiOW','Lunch Break','','2026-09-23T10:30:00.000Z','2026-09-23T12:00:00.000Z',0,1,1,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('LTUsgYTIw0BCNC1PWz7Pj','Lunch Break','','2026-09-24T10:30:00.000Z','2026-09-24T12:00:00.000Z',0,1,1,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('XMhmMhtXQfBh0Vb_tQc0p','The Future of AI: Transforming Industries Through Machine Learning','Artificial Intelligence is reshaping every industry from healthcare to finance. In this comprehensive session, we''ll explore the current state of AI technology, emerging trends, and practical applications that are driving innovation.

## What you''ll learn

We''ll discuss real-world case studies, ethical considerations, and the skills needed to thrive in an AI-driven world. Whether you''re a beginner or experienced professional, you''ll gain valuable insights into how AI can transform your work and industry.

## Topics

- Natural language processing
- Computer vision
- Predictive analytics
- The intersection of AI with blockchain and IoT','2026-09-22T09:00:00.000Z','2026-09-22T10:00:00.000Z',100,0,0,0,'5YYnHgPqxkpfxnaB6B0Dp','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('-rrMZwQ2UrDAjiJC4N2uY','Workshop: Hands-on Docker and Kubernetes','A practical workshop on containerization and orchestration. **Bring your laptop** and get ready to deploy!

Prerequisites:

- Docker installed and working (`docker run hello-world`)
- A free container registry account
- Basic command-line comfort','2026-09-22T09:00:00.000Z','2026-09-22T10:30:00.000Z',30,0,0,1,'jwi9s0Q3537QyDqMFCOqg','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('qDmCY2BaGQ7d649mAc6bq','Design Systems: Creating Consistency at Scale','Learn how to build and maintain design systems that scale across teams and products.','2026-09-22T12:00:00.000Z','2026-09-22T13:00:00.000Z',100,0,0,0,'8rcQtiTCRLPJ5phQLAikj','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('RIymtbpXgboYkoKfJZRTn','Open Source Sustainability: Funding and Community Building','The open source ecosystem faces sustainability challenges as projects grow in complexity and importance. This session examines successful funding models, from corporate sponsorship to foundation grants to innovative approaches like [GitHub Sponsors](https://github.com/sponsors).

We''ll discuss community building strategies, *maintainer burnout prevention*, and the economic realities of supporting critical infrastructure projects. Case studies will include successful projects that have achieved sustainable funding and community growth.','2026-09-22T12:00:00.000Z','2026-09-22T13:30:00.000Z',25,0,0,0,'TJB63B73ewez4_ilCVYHH','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('vB8yBCiFnhRUQ7147QEPC','API Design: RESTful vs GraphQL vs gRPC','A comparative analysis of different API paradigms with practical examples and use cases.','2026-09-22T13:30:00.000Z','2026-09-22T14:30:00.000Z',30,0,0,0,'wuZCyW47zQhn3I8dcMazB','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('igagFQjs3rJf_v-puzdJk','Building Scalable Web Applications with Modern React','Dive deep into the latest React patterns and best practices for building scalable applications. We''ll cover state management, performance optimization, and modern tooling.','2026-09-23T07:00:00.000Z','2026-09-23T08:00:00.000Z',100,0,0,0,'ezquWRqfCSq0Ehr47gXRf','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('gOsG5aiZEF7H0B5DcbHYk','The Psychology of User Experience: Understanding Human-Computer Interaction','User experience design is fundamentally about understanding human psychology and behavior. This session delves into cognitive psychology principles that drive effective UX design, including mental models, cognitive load theory, and decision-making processes.

We''ll explore how users actually interact with digital interfaces, common usability heuristics, and the science behind user research methods. Through interactive exercises and real-world examples, attendees will learn to apply psychological principles to create more intuitive and engaging user experiences.

Topics include attention and perception, memory limitations, emotional design, accessibility considerations, and cross-cultural UX patterns. Perfect for designers, developers, and product managers looking to create more human-centered digital products.','2026-09-23T08:00:00.000Z','2026-09-23T09:30:00.000Z',25,0,0,0,'OP3Yn69HegT8fHMkcVBCk','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('qQnfyYF2IPT_EW5pKYHvU','Performance Optimization: Making Your Apps Lightning Fast','Techniques for optimizing web and mobile applications for speed and efficiency.','2026-09-23T08:30:00.000Z','2026-09-23T10:00:00.000Z',30,0,0,0,'4v9cdFB0yfSWO_5eYBySq','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('2iJoekkgiXrHgm-vGfpZI','Machine Learning Ethics: Bias, Fairness, and Accountability','As machine learning systems become more prevalent in decision-making processes, ethical considerations become paramount. This session explores algorithmic bias, fairness metrics, and accountability frameworks.

We''ll examine real-world cases where ML systems have perpetuated or amplified societal biases, and discuss practical approaches for building more equitable AI systems. Topics include data bias, model interpretability, fairness-aware machine learning, and the legal and regulatory landscape surrounding AI ethics.','2026-09-23T12:00:00.000Z','2026-09-23T13:00:00.000Z',100,0,0,0,'mrT7aqyQvcGfD2zlHA8wT','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('Gxx2wauoVzRCuneBwVriG','Sustainable Software Development: Green Coding Practices','How to reduce the environmental impact of your code through efficient algorithms and sustainable practices.','2026-09-23T12:00:00.000Z','2026-09-23T13:00:00.000Z',25,0,0,0,'ayKLrK_auZU_a8zC-CmQo','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('TycMjOkIgVANONwk_hBgz','Building Inclusive Tech Teams: Beyond Diversity Hiring','Creating truly inclusive environments requires more than diverse hiring. This session explores psychological safety, inclusive leadership, and systemic changes needed for equity in tech.

We''ll examine unconscious bias in technical interviews, the importance of sponsorship vs mentorship, and how to build cultures where everyone can thrive. Participants will leave with concrete strategies for fostering inclusion at every level of their organization.','2026-09-23T14:00:00.000Z','2026-09-23T15:00:00.000Z',100,0,0,0,'PNzKCaNbOcez6Y5kmFmLA','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('jjedCBwvEqvF_-vepNGKP','Hallway Track: CRDT Show & Tell','Impromptu session: I''ll demo a small real-time collaborative editor built on [CRDTs](https://crdt.tech) and we can poke at the edge cases together. Bring your laptop if you want to pair on it.

Added straight to the schedule because the hallway conversation got out of hand — *that''s what open scheduling is for!*','2026-09-23T14:00:00.000Z','2026-09-23T14:30:00.000Z',15,0,0,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('a3PKs-Cm4Zpyj-AO9-dbo','Microservices Architecture: Lessons from the Trenches','Real-world experiences with microservices: what works, what doesn''t, and when to avoid them entirely.','2026-09-24T07:00:00.000Z','2026-09-24T08:00:00.000Z',100,0,0,0,'Vk99eBmo99DZmka02C1TA','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('HqF2KLl-_bzBazdIbA0Ua','Blockchain Beyond Cryptocurrency: Practical Applications','Exploring real-world blockchain applications in supply chain, healthcare, and digital identity.','2026-09-24T08:00:00.000Z','2026-09-24T09:00:00.000Z',30,0,0,0,'2X60eLDXi0C9nCkPlGxZp','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('sSwHK9VashAV2CgBZClTC','DevOps Culture: Breaking Down Silos','How to foster collaboration between development and operations teams for better software delivery.','2026-09-24T08:30:00.000Z','2026-09-24T09:30:00.000Z',25,0,0,0,'mDUkRFD2oPZaA1Vl3ZbHk','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('wx0BJmOqnvetENmzB_gOb','Cybersecurity in the Age of Remote Work: Protecting Your Digital Assets','The shift to remote work has fundamentally changed the cybersecurity landscape. Traditional perimeter-based security models are no longer sufficient when employees access company resources from home networks, coffee shops, and co-working spaces.

## Session outline

This session will provide a comprehensive overview of modern cybersecurity challenges and solutions. We''ll explore **zero-trust architecture**, endpoint protection strategies, and the human element of cybersecurity. Attendees will learn practical techniques for:

- Securing remote work environments
- Implementing multi-factor authentication
- Creating security awareness programs

We''ll also discuss emerging threats like sophisticated phishing attacks, ransomware targeting remote workers, and supply chain vulnerabilities. Real-world examples and case studies will illustrate both successful security implementations and costly breaches, providing actionable insights for organizations of all sizes.','2026-09-24T12:00:00.000Z','2026-09-24T13:00:00.000Z',100,0,0,0,'5ramGIUUZ66OYlc0E0VQx','SP0cKZnzLKO0kR0q-jzYX',NULL);
INSERT INTO "sessions" VALUES('jDCd-xcVZZ5MuXez7UuOJ','Closing Session & Farewell','Wrap-up of Conference Gamma:

- Community announcements
- A look back at the highlights of the last three days
- Thank-yous to volunteers and speakers
- A preview of next year''s edition

We close with a group photo in front of the **Main Hall**.','2026-09-24T14:00:00.000Z','2026-09-24T15:00:00.000Z',100,1,0,0,NULL,'SP0cKZnzLKO0kR0q-jzYX',NULL);
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
INSERT INTO "comments" VALUES('Y3JxaM4yka0wwzEXEPV3g',NULL,NULL,'',1,'2026-09-08T08:16:59.824Z',NULL);
INSERT INTO "comments" VALUES('6MdEb9BMmCKJxagScdEQc','EituNjAB_WjHf315o6FgB','Y3JxaM4yka0wwzEXEPV3g','Good question — no background needed, I''ll start from scratch.',0,'2026-09-08T09:16:59.824Z',NULL);
INSERT INTO "comments" VALUES('QQZK9DUSoNpuqVscQjuHx','zyrIHrTaOd_Ujd3d5-r7v','6MdEb9BMmCKJxagScdEQc','Perfect, count me in.',0,'2026-09-08T10:16:59.824Z',NULL);
INSERT INTO "comments" VALUES('12eXfL_gFIiZ1wQfrbDnz','5RoBJlTarTCYHwRtkcfoL',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-09-08T11:16:59.824Z',NULL);
INSERT INTO "comments" VALUES('w2t59RrsGN2GSnsViWnXa','5RoBJlTarTCYHwRtkcfoL',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-09-08T08:30:59.824Z',NULL);
INSERT INTO "comments" VALUES('ToiKkIpH81xNLZdAss3uY','VJv7TkFuM65FVq6naWCzX',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-09-08T11:30:59.824Z',NULL);
INSERT INTO "comments" VALUES('Ih6D5NdoeNbFLiuwBSyBh','TMwyO35bGPgDkc-FGoPC-',NULL,'Could this be scheduled later in the day? It clashes with the workshop block.',0,'2026-09-08T08:44:59.824Z',NULL);
INSERT INTO "comments" VALUES('mCZddqui-btu0IVmlHGa3','e-yXTHs6PcH9T-UsjhUY5','Ih6D5NdoeNbFLiuwBSyBh','Good question — no background needed, I''ll start from scratch.',0,'2026-09-08T09:44:59.824Z',NULL);
INSERT INTO "comments" VALUES('GmqvhRXjshJlumCWxz6TK','TMwyO35bGPgDkc-FGoPC-',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-09-08T08:58:59.825Z',NULL);
INSERT INTO "comments" VALUES('M3o3Ef-sJtiCnM1fPUKGT','EituNjAB_WjHf315o6FgB',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-09-08T08:16:59.825Z','2026-09-08T08:20:59.825Z');
INSERT INTO "comments" VALUES('yGvsA2l83Sp2mhOD9cvWq','Iwq7GEtgCWvad81RH-wzO','M3o3Ef-sJtiCnM1fPUKGT','Good question — no background needed, I''ll start from scratch.',0,'2026-09-08T09:16:59.825Z',NULL);
INSERT INTO "comments" VALUES('mD_RHCwgqiXRItlCoHJ5c','zyrIHrTaOd_Ujd3d5-r7v','yGvsA2l83Sp2mhOD9cvWq','Perfect, count me in.',0,'2026-09-08T10:16:59.825Z',NULL);
INSERT INTO "comments" VALUES('xaj0Nk5d_MqmdMkpchI3r','5RoBJlTarTCYHwRtkcfoL',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-09-08T11:16:59.825Z',NULL);
INSERT INTO "comments" VALUES('GOjQ8nApUd2zY4Jpx2TsM','zyrIHrTaOd_Ujd3d5-r7v',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-09-08T08:30:59.825Z',NULL);
INSERT INTO "comments" VALUES('TWGEqsp9u4IrQs1CKxG79','8QKBuH6l4CQk76FLe_S7M',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-09-08T09:05:59.825Z',NULL);
INSERT INTO "comments" VALUES('-BOLwpSOnlj4WDgbuSfuH','MVMnWjk26J_TG4aPxi2zT','TWGEqsp9u4IrQs1CKxG79','Later works for me. I''ll flag it when scheduling opens.',0,'2026-09-08T10:05:59.825Z',NULL);
INSERT INTO "comments" VALUES('0s_Un3tLWzjp1M6k4jISV','y6R-UbAIvgShxPDtT5wF3','-BOLwpSOnlj4WDgbuSfuH','That makes sense, thanks for explaining!',0,'2026-09-08T11:05:59.825Z',NULL);
INSERT INTO "comments" VALUES('Yg6JIq8pzU4w1SmNY-HBN','Iwq7GEtgCWvad81RH-wzO',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-09-08T08:23:59.825Z',NULL);
INSERT INTO "comments" VALUES('ZIow7jT7xmxPhpQny2FMx','5RoBJlTarTCYHwRtkcfoL','Yg6JIq8pzU4w1SmNY-HBN','Yes please, drop me a message and we''ll plan it together.',0,'2026-09-08T09:23:59.825Z',NULL);
INSERT INTO "comments" VALUES('Bj-dMSEAK50HuZktCh3CG','VJv7TkFuM65FVq6naWCzX',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-09-08T08:51:59.825Z','2026-09-08T08:55:59.825Z');
INSERT INTO "comments" VALUES('a3JFpxK32WWfTSk3v-AvE','otumnw13-zuz710X66T6D','Bj-dMSEAK50HuZktCh3CG','Yes please, drop me a message and we''ll plan it together.',0,'2026-09-08T09:51:59.825Z',NULL);
INSERT INTO "comments" VALUES('aU2tV2IYE3Usjm8YtXKft','TMwyO35bGPgDkc-FGoPC-','a3JFpxK32WWfTSk3v-AvE','That makes sense, thanks for explaining!',0,'2026-09-08T10:51:59.825Z',NULL);
INSERT INTO "comments" VALUES('_8CSJeZQJC6GH_h1Nlvkc','TMwyO35bGPgDkc-FGoPC-',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-09-08T08:58:59.825Z',NULL);
INSERT INTO "comments" VALUES('9TLyNX9Vj285XeAjECOPH','XY9PuqahecxoNFZq3eayA','_8CSJeZQJC6GH_h1Nlvkc','I''d rather keep them separate, they go in quite different directions.',0,'2026-09-08T09:58:59.825Z',NULL);
INSERT INTO "comments" VALUES('iH2-9uYQnZ-wFXKeBeXlr','8QKBuH6l4CQk76FLe_S7M','9TLyNX9Vj285XeAjECOPH','Perfect, count me in.',0,'2026-09-08T10:58:59.825Z',NULL);
INSERT INTO "comments" VALUES('-rUUZ1L18lIThFNF7fwvP','MVMnWjk26J_TG4aPxi2zT',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-09-08T11:58:59.825Z',NULL);
INSERT INTO "comments" VALUES('c6RrVaI42y7okPP-Rtgdy','MVMnWjk26J_TG4aPxi2zT',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-09-08T09:12:59.825Z',NULL);
INSERT INTO "comments" VALUES('LMIpDp1-tpaauyKhf4Kz3','-iOLg-PYelc-CR4X_F5-K',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-09-08T09:26:59.825Z','2026-09-08T09:30:59.825Z');
INSERT INTO "comments" VALUES('5XtgnxCXWu_k5SKT7k96j','-iOLg-PYelc-CR4X_F5-K',NULL,'Would you be open to **co-hosting**? I''ve run something similar before.',0,'2026-09-08T09:33:59.825Z',NULL);
INSERT INTO "comments" VALUES('i-9N4Ntot0t4pTxWRgei-','CgW1YSth1u4WK-2oDhY83',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-09-08T09:40:59.825Z',NULL);
INSERT INTO "comments" VALUES('I2rhMIrYRMKXF87mGnivu','tvwQ1sGC1hAqQwOKSJFIt','i-9N4Ntot0t4pTxWRgei-','Good question — no background needed, I''ll start from scratch.',0,'2026-09-08T10:40:59.825Z',NULL);
INSERT INTO "comments" VALUES('bDc4wyxV9DQS_aABv0aLx','S64cWBuxSlVix39BvZluz','I2rhMIrYRMKXF87mGnivu','Perfect, count me in.',0,'2026-09-08T11:40:59.825Z',NULL);
INSERT INTO "comments" VALUES('4BvWQ46sGH-_xyjqG5Xib','WxjmYVAi3tK2RgRv2ufeV',NULL,'Really keen on this one — I''ve wanted to talk about it for ages.',0,'2026-09-08T10:01:59.825Z','2026-09-08T10:05:59.825Z');
INSERT INTO "comments" VALUES('nopDRdX2XT7w2mFszXTYS','cAq5a5RQYt7sKvN5wbvW8','4BvWQ46sGH-_xyjqG5Xib','Later works for me. I''ll flag it when scheduling opens.',0,'2026-09-08T11:01:59.825Z',NULL);
INSERT INTO "comments" VALUES('-EtIcbl-yftncfBnxF0df','0LMe8d1wk8MKVFi8xqbc-',NULL,'Seconding the above — this is the session I''d most like to attend.',0,'2026-09-08T13:01:59.825Z',NULL);
INSERT INTO "comments" VALUES('crB7M_b2NVGAG7aiZKIq2','0LMe8d1wk8MKVFi8xqbc-',NULL,'How much background knowledge are you assuming? Asking for a friend who is me.',0,'2026-09-08T10:15:59.825Z',NULL);
INSERT INTO "comments" VALUES('qpKgi-MvlKPG-AcaTNAsJ','FRco957sXUlZiQxRhMTk1',NULL,'This overlaps a bit with the other proposal on the same topic — worth merging?',0,'2026-09-08T10:22:59.825Z',NULL);
INSERT INTO "comments" VALUES('vqh3CNuK0MoZjUTM0h_68','5RoBJlTarTCYHwRtkcfoL',NULL,'Who else is on the panel?',0,'2026-09-08T13:16:59.825Z',NULL);
INSERT INTO "comments" VALUES('z-vCzIEDM9LBp3aWUk0k4','e-yXTHs6PcH9T-UsjhUY5','vqh3CNuK0MoZjUTM0h_68','I''d like to join.',0,'2026-09-08T14:16:59.825Z',NULL);
INSERT INTO "comments" VALUES('0h13EI86-8N_h2rycbNPd','VJv7TkFuM65FVq6naWCzX','vqh3CNuK0MoZjUTM0h_68','So would I.',0,'2026-09-08T15:16:59.825Z',NULL);
CREATE TABLE `proposal_comments` (
	`comment_id` text PRIMARY KEY NOT NULL,
	`proposal_id` text NOT NULL,
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`proposal_id`) REFERENCES `session_proposals`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "proposal_comments" VALUES('Y3JxaM4yka0wwzEXEPV3g','JxY8ECwYzldhpL3Sp-CTC');
INSERT INTO "proposal_comments" VALUES('6MdEb9BMmCKJxagScdEQc','JxY8ECwYzldhpL3Sp-CTC');
INSERT INTO "proposal_comments" VALUES('QQZK9DUSoNpuqVscQjuHx','JxY8ECwYzldhpL3Sp-CTC');
INSERT INTO "proposal_comments" VALUES('12eXfL_gFIiZ1wQfrbDnz','JxY8ECwYzldhpL3Sp-CTC');
INSERT INTO "proposal_comments" VALUES('w2t59RrsGN2GSnsViWnXa','u2GxGKKLO7LI7lhtxoD3v');
INSERT INTO "proposal_comments" VALUES('ToiKkIpH81xNLZdAss3uY','u2GxGKKLO7LI7lhtxoD3v');
INSERT INTO "proposal_comments" VALUES('Ih6D5NdoeNbFLiuwBSyBh','ohJveJ5nNXm1HZQNRNYOc');
INSERT INTO "proposal_comments" VALUES('mCZddqui-btu0IVmlHGa3','ohJveJ5nNXm1HZQNRNYOc');
INSERT INTO "proposal_comments" VALUES('GmqvhRXjshJlumCWxz6TK','bRnxXUeBzIH23dsQpiKid');
INSERT INTO "proposal_comments" VALUES('M3o3Ef-sJtiCnM1fPUKGT','bAU_FKrFGtcSQJyJnD4ay');
INSERT INTO "proposal_comments" VALUES('yGvsA2l83Sp2mhOD9cvWq','bAU_FKrFGtcSQJyJnD4ay');
INSERT INTO "proposal_comments" VALUES('mD_RHCwgqiXRItlCoHJ5c','bAU_FKrFGtcSQJyJnD4ay');
INSERT INTO "proposal_comments" VALUES('xaj0Nk5d_MqmdMkpchI3r','bAU_FKrFGtcSQJyJnD4ay');
INSERT INTO "proposal_comments" VALUES('GOjQ8nApUd2zY4Jpx2TsM','lN_KpCxq1aDENXe9aPX5Y');
INSERT INTO "proposal_comments" VALUES('TWGEqsp9u4IrQs1CKxG79','yNvKzUXq9oedAgkHhjjj9');
INSERT INTO "proposal_comments" VALUES('-BOLwpSOnlj4WDgbuSfuH','yNvKzUXq9oedAgkHhjjj9');
INSERT INTO "proposal_comments" VALUES('0s_Un3tLWzjp1M6k4jISV','yNvKzUXq9oedAgkHhjjj9');
INSERT INTO "proposal_comments" VALUES('Yg6JIq8pzU4w1SmNY-HBN','5YYnHgPqxkpfxnaB6B0Dp');
INSERT INTO "proposal_comments" VALUES('ZIow7jT7xmxPhpQny2FMx','5YYnHgPqxkpfxnaB6B0Dp');
INSERT INTO "proposal_comments" VALUES('Bj-dMSEAK50HuZktCh3CG','Vk99eBmo99DZmka02C1TA');
INSERT INTO "proposal_comments" VALUES('a3JFpxK32WWfTSk3v-AvE','Vk99eBmo99DZmka02C1TA');
INSERT INTO "proposal_comments" VALUES('aU2tV2IYE3Usjm8YtXKft','Vk99eBmo99DZmka02C1TA');
INSERT INTO "proposal_comments" VALUES('_8CSJeZQJC6GH_h1Nlvkc','ayKLrK_auZU_a8zC-CmQo');
INSERT INTO "proposal_comments" VALUES('9TLyNX9Vj285XeAjECOPH','ayKLrK_auZU_a8zC-CmQo');
INSERT INTO "proposal_comments" VALUES('iH2-9uYQnZ-wFXKeBeXlr','ayKLrK_auZU_a8zC-CmQo');
INSERT INTO "proposal_comments" VALUES('-rUUZ1L18lIThFNF7fwvP','ayKLrK_auZU_a8zC-CmQo');
INSERT INTO "proposal_comments" VALUES('c6RrVaI42y7okPP-Rtgdy','wuZCyW47zQhn3I8dcMazB');
INSERT INTO "proposal_comments" VALUES('LMIpDp1-tpaauyKhf4Kz3','2X60eLDXi0C9nCkPlGxZp');
INSERT INTO "proposal_comments" VALUES('5XtgnxCXWu_k5SKT7k96j','4v9cdFB0yfSWO_5eYBySq');
INSERT INTO "proposal_comments" VALUES('i-9N4Ntot0t4pTxWRgei-','TJB63B73ewez4_ilCVYHH');
INSERT INTO "proposal_comments" VALUES('I2rhMIrYRMKXF87mGnivu','TJB63B73ewez4_ilCVYHH');
INSERT INTO "proposal_comments" VALUES('bDc4wyxV9DQS_aABv0aLx','TJB63B73ewez4_ilCVYHH');
INSERT INTO "proposal_comments" VALUES('4BvWQ46sGH-_xyjqG5Xib','DFVSLmJHZiI2F4C6hgQvQ');
INSERT INTO "proposal_comments" VALUES('nopDRdX2XT7w2mFszXTYS','DFVSLmJHZiI2F4C6hgQvQ');
INSERT INTO "proposal_comments" VALUES('-EtIcbl-yftncfBnxF0df','DFVSLmJHZiI2F4C6hgQvQ');
INSERT INTO "proposal_comments" VALUES('crB7M_b2NVGAG7aiZKIq2','kAkAuUyIGbF_ki9YDB3Cg');
INSERT INTO "proposal_comments" VALUES('qpKgi-MvlKPG-AcaTNAsJ','tcy--7UuRPQoM_Fb54v6P');
INSERT INTO "proposal_comments" VALUES('vqh3CNuK0MoZjUTM0h_68','T-xYPrvKKFryUUI4uOplr');
INSERT INTO "proposal_comments" VALUES('z-vCzIEDM9LBp3aWUk0k4','T-xYPrvKKFryUUI4uOplr');
INSERT INTO "proposal_comments" VALUES('0h13EI86-8N_h2rycbNPd','T-xYPrvKKFryUUI4uOplr');
CREATE TABLE `comment_likes` (
	`comment_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`created_time` text NOT NULL,
	PRIMARY KEY(`comment_id`, `guest_id`),
	FOREIGN KEY (`comment_id`) REFERENCES `comments`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "comment_likes" VALUES('6MdEb9BMmCKJxagScdEQc','zyrIHrTaOd_Ujd3d5-r7v','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('QQZK9DUSoNpuqVscQjuHx','5RoBJlTarTCYHwRtkcfoL','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('QQZK9DUSoNpuqVscQjuHx','e-yXTHs6PcH9T-UsjhUY5','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('QQZK9DUSoNpuqVscQjuHx','VJv7TkFuM65FVq6naWCzX','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('12eXfL_gFIiZ1wQfrbDnz','e-yXTHs6PcH9T-UsjhUY5','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('12eXfL_gFIiZ1wQfrbDnz','VJv7TkFuM65FVq6naWCzX','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('w2t59RrsGN2GSnsViWnXa','VJv7TkFuM65FVq6naWCzX','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('w2t59RrsGN2GSnsViWnXa','TMwyO35bGPgDkc-FGoPC-','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('ToiKkIpH81xNLZdAss3uY','TMwyO35bGPgDkc-FGoPC-','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('ToiKkIpH81xNLZdAss3uY','8QKBuH6l4CQk76FLe_S7M','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('ToiKkIpH81xNLZdAss3uY','MVMnWjk26J_TG4aPxi2zT','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('Ih6D5NdoeNbFLiuwBSyBh','8QKBuH6l4CQk76FLe_S7M','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('mCZddqui-btu0IVmlHGa3','MVMnWjk26J_TG4aPxi2zT','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('GmqvhRXjshJlumCWxz6TK','_eafQ_Lu-VTSTvrjNGxr0','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('GmqvhRXjshJlumCWxz6TK','y6R-UbAIvgShxPDtT5wF3','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('M3o3Ef-sJtiCnM1fPUKGT','y6R-UbAIvgShxPDtT5wF3','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('mD_RHCwgqiXRItlCoHJ5c','CgW1YSth1u4WK-2oDhY83','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('mD_RHCwgqiXRItlCoHJ5c','S64cWBuxSlVix39BvZluz','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('mD_RHCwgqiXRItlCoHJ5c','sKMgWCotyzMq1f56--oMk','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('xaj0Nk5d_MqmdMkpchI3r','S64cWBuxSlVix39BvZluz','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('xaj0Nk5d_MqmdMkpchI3r','sKMgWCotyzMq1f56--oMk','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('GOjQ8nApUd2zY4Jpx2TsM','sKMgWCotyzMq1f56--oMk','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('GOjQ8nApUd2zY4Jpx2TsM','WxjmYVAi3tK2RgRv2ufeV','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('GOjQ8nApUd2zY4Jpx2TsM','5qZM4tI841iJy3W89QvIJ','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('TWGEqsp9u4IrQs1CKxG79','WxjmYVAi3tK2RgRv2ufeV','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('TWGEqsp9u4IrQs1CKxG79','5qZM4tI841iJy3W89QvIJ','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('0s_Un3tLWzjp1M6k4jISV','0LMe8d1wk8MKVFi8xqbc-','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('Yg6JIq8pzU4w1SmNY-HBN','FRco957sXUlZiQxRhMTk1','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('Yg6JIq8pzU4w1SmNY-HBN','otumnw13-zuz710X66T6D','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('Yg6JIq8pzU4w1SmNY-HBN','cvViWkjK94CO4UXI59bMg','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('ZIow7jT7xmxPhpQny2FMx','otumnw13-zuz710X66T6D','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('Bj-dMSEAK50HuZktCh3CG','cvViWkjK94CO4UXI59bMg','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('Bj-dMSEAK50HuZktCh3CG','EWf92Tq3hSWbCnwZF_gXk','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('Bj-dMSEAK50HuZktCh3CG','XY9PuqahecxoNFZq3eayA','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('a3JFpxK32WWfTSk3v-AvE','EWf92Tq3hSWbCnwZF_gXk','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('a3JFpxK32WWfTSk3v-AvE','XY9PuqahecxoNFZq3eayA','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('aU2tV2IYE3Usjm8YtXKft','XY9PuqahecxoNFZq3eayA','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('_8CSJeZQJC6GH_h1Nlvkc','W1CGkv8V4tYDIHKx9_O_W','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('9TLyNX9Vj285XeAjECOPH','fi_8fZO3-RwyxSOlAId4g','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('iH2-9uYQnZ-wFXKeBeXlr','D1hCRrolteRhGfbdoLxXy','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('iH2-9uYQnZ-wFXKeBeXlr','iy2yD5_tSIsixmTgpsNpy','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('iH2-9uYQnZ-wFXKeBeXlr','uQpQIf84U5tZa1y8xb16Y','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('-rUUZ1L18lIThFNF7fwvP','iy2yD5_tSIsixmTgpsNpy','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('-rUUZ1L18lIThFNF7fwvP','uQpQIf84U5tZa1y8xb16Y','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('c6RrVaI42y7okPP-Rtgdy','uQpQIf84U5tZa1y8xb16Y','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('c6RrVaI42y7okPP-Rtgdy','_U51msK4jornrFgQyg3MW','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('c6RrVaI42y7okPP-Rtgdy','dTFo3Jnrjd6t66UB7o0zU','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('LMIpDp1-tpaauyKhf4Kz3','_U51msK4jornrFgQyg3MW','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('4BvWQ46sGH-_xyjqG5Xib','pr5D-yEw215TtcJLb-Bnh','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('nopDRdX2XT7w2mFszXTYS','pr5D-yEw215TtcJLb-Bnh','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('nopDRdX2XT7w2mFszXTYS','tvwQ1sGC1hAqQwOKSJFIt','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('-EtIcbl-yftncfBnxF0df','tvwQ1sGC1hAqQwOKSJFIt','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('crB7M_b2NVGAG7aiZKIq2','IbjHTKBrAmzMoaPqkXz1h','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('vqh3CNuK0MoZjUTM0h_68','BJDIY2uATPEPXM3yDx-ZO','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('vqh3CNuK0MoZjUTM0h_68','Ukahzcxq4tVlAS70ytr_m','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('vqh3CNuK0MoZjUTM0h_68','EituNjAB_WjHf315o6FgB','2026-09-08T17:14:59.825Z');
INSERT INTO "comment_likes" VALUES('z-vCzIEDM9LBp3aWUk0k4','Ukahzcxq4tVlAS70ytr_m','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('0h13EI86-8N_h2rycbNPd','EituNjAB_WjHf315o6FgB','2026-09-08T17:16:59.825Z');
INSERT INTO "comment_likes" VALUES('0h13EI86-8N_h2rycbNPd','Iwq7GEtgCWvad81RH-wzO','2026-09-08T17:15:59.825Z');
INSERT INTO "comment_likes" VALUES('0h13EI86-8N_h2rycbNPd','zyrIHrTaOd_Ujd3d5-r7v','2026-09-08T17:14:59.825Z');
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
CREATE TABLE `meeting_availability` (
	`event_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`slot_start` text NOT NULL,
	PRIMARY KEY(`event_id`, `guest_id`, `slot_start`),
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-20T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-21T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EituNjAB_WjHf315o6FgB','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','5RoBJlTarTCYHwRtkcfoL','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','TMwyO35bGPgDkc-FGoPC-','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','_eafQ_Lu-VTSTvrjNGxr0','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','CgW1YSth1u4WK-2oDhY83','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','WxjmYVAi3tK2RgRv2ufeV','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','FRco957sXUlZiQxRhMTk1','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','EWf92Tq3hSWbCnwZF_gXk','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fi_8fZO3-RwyxSOlAId4g','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','uQpQIf84U5tZa1y8xb16Y','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','fklWHIi2n0xjZ4PBRc_V4','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','pr5D-yEw215TtcJLb-Bnh','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','IbjHTKBrAmzMoaPqkXz1h','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('vDpIksoQEmvZ45H2j0PEq','Ukahzcxq4tVlAS70ytr_m','2026-10-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-06T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-07T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EituNjAB_WjHf315o6FgB','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','5RoBJlTarTCYHwRtkcfoL','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','TMwyO35bGPgDkc-FGoPC-','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','_eafQ_Lu-VTSTvrjNGxr0','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','CgW1YSth1u4WK-2oDhY83','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','WxjmYVAi3tK2RgRv2ufeV','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','FRco957sXUlZiQxRhMTk1','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','EWf92Tq3hSWbCnwZF_gXk','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fi_8fZO3-RwyxSOlAId4g','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','uQpQIf84U5tZa1y8xb16Y','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','fklWHIi2n0xjZ4PBRc_V4','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','pr5D-yEw215TtcJLb-Bnh','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','IbjHTKBrAmzMoaPqkXz1h','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('Rt3UVc16Wmx7VD1-Ugzvy','Ukahzcxq4tVlAS70ytr_m','2026-10-08T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-22T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-23T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T12:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T12:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T13:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T13:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T14:00:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EituNjAB_WjHf315o6FgB','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','5RoBJlTarTCYHwRtkcfoL','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','TMwyO35bGPgDkc-FGoPC-','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','_eafQ_Lu-VTSTvrjNGxr0','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','CgW1YSth1u4WK-2oDhY83','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','WxjmYVAi3tK2RgRv2ufeV','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','FRco957sXUlZiQxRhMTk1','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','EWf92Tq3hSWbCnwZF_gXk','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fi_8fZO3-RwyxSOlAId4g','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','pr5D-yEw215TtcJLb-Bnh','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','IbjHTKBrAmzMoaPqkXz1h','2026-09-24T14:30:00.000Z');
INSERT INTO "meeting_availability" VALUES('SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','2026-09-24T14:30:00.000Z');
CREATE TABLE `meeting_points` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`sort_index` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "meeting_points" VALUES('zdpmI92QtMYqkVYJbKTgn','vDpIksoQEmvZ45H2j0PEq','Coffee bar','By the main staircase, open all day.',0);
INSERT INTO "meeting_points" VALUES('XmweprOiezvR1SRABePy1','vDpIksoQEmvZ45H2j0PEq','Garden bench','Behind the kitchen, weather permitting.',1);
INSERT INTO "meeting_points" VALUES('g6bdB75vc9Oa3A3reV5US','Rt3UVc16Wmx7VD1-Ugzvy','Coffee bar','By the main staircase, open all day.',0);
INSERT INTO "meeting_points" VALUES('VRlOYseQiupFIigqlPAA8','Rt3UVc16Wmx7VD1-Ugzvy','Garden bench','Behind the kitchen, weather permitting.',1);
INSERT INTO "meeting_points" VALUES('NqealhBEvoijbMbb-ysjw','SP0cKZnzLKO0kR0q-jzYX','Coffee bar','By the main staircase, open all day.',0);
INSERT INTO "meeting_points" VALUES('I-pzJPIAmz-oTjEm__dmQ','SP0cKZnzLKO0kR0q-jzYX','Garden bench','Behind the kitchen, weather permitting.',1);
CREATE TABLE `meetings` (
	`id` text PRIMARY KEY NOT NULL,
	`event_id` text NOT NULL,
	`requester_id` text NOT NULL,
	`recipient_id` text NOT NULL,
	`slot_start` text NOT NULL,
	`slot_end` text NOT NULL,
	`meeting_point` text NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text NOT NULL,
	`responded_at` text, `cancel_note` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`event_id`) REFERENCES `events`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`requester_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`recipient_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
INSERT INTO "meetings" VALUES('IPfeUqvAOkPrGdWlzxdN1','SP0cKZnzLKO0kR0q-jzYX','Ukahzcxq4tVlAS70ytr_m','QUNxetzvBuqS5LC-YJbVO','2026-09-22T08:00:00.000Z','2026-09-22T08:30:00.000Z','Coffee bar','Container queries, and where they still bite.','accepted','2026-09-08T18:17:00.261Z','2026-09-08T18:17:00.261Z','');
INSERT INTO "meetings" VALUES('ggm_AQ321TII8MNoOv1n5','SP0cKZnzLKO0kR0q-jzYX','uQpQIf84U5tZa1y8xb16Y','QUNxetzvBuqS5LC-YJbVO','2026-09-22T08:00:00.000Z','2026-09-22T08:30:00.000Z','Garden bench','Could I steal you for the same half hour?','pending','2026-09-08T18:17:00.261Z',NULL,'');
INSERT INTO "meetings" VALUES('Uk1RGnRa8qUgn8bpbMnGt','SP0cKZnzLKO0kR0q-jzYX','dTFo3Jnrjd6t66UB7o0zU','QUNxetzvBuqS5LC-YJbVO','2026-09-22T09:00:00.000Z','2026-09-22T09:30:00.000Z','Coffee bar','Free at eleven?','pending','2026-09-08T18:17:00.261Z',NULL,'');
INSERT INTO "meetings" VALUES('7UNCLeqgm44MNoVK-I0T2','SP0cKZnzLKO0kR0q-jzYX','fklWHIi2n0xjZ4PBRc_V4','QUNxetzvBuqS5LC-YJbVO','2026-09-22T09:00:00.000Z','2026-09-22T09:30:00.000Z','Coffee bar','Free at eleven?','pending','2026-09-08T18:17:00.261Z',NULL,'');
INSERT INTO "meetings" VALUES('Q48-QR0Y2SDqeamo48h64','SP0cKZnzLKO0kR0q-jzYX','A0I-G-uWpciyMueS9JxQ-','QUNxetzvBuqS5LC-YJbVO','2026-09-22T09:00:00.000Z','2026-09-22T09:30:00.000Z','Coffee bar','Free at eleven?','pending','2026-09-08T18:17:00.261Z',NULL,'');
CREATE TABLE `notifications` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`type` text NOT NULL,
	`text` text NOT NULL,
	`url` text NOT NULL,
	`created_at` text NOT NULL,
	`read_at` text,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `push_keys` (
	`id` text PRIMARY KEY NOT NULL,
	`public_key` text NOT NULL,
	`private_key` text NOT NULL,
	`created_at` text NOT NULL
);
CREATE TABLE `push_subscriptions` (
	`id` text PRIMARY KEY NOT NULL,
	`guest_id` text NOT NULL,
	`endpoint` text NOT NULL,
	`p256dh` text NOT NULL,
	`auth` text NOT NULL,
	`created_at` text NOT NULL,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE TABLE `session_reminders` (
	`session_id` text NOT NULL,
	`guest_id` text NOT NULL,
	`kind` text NOT NULL,
	`due_time` text NOT NULL,
	`claimed_at` text,
	`sent_at` text,
	`first_failed_at` text,
	`notified_at` text,
	PRIMARY KEY(`session_id`, `guest_id`, `kind`),
	FOREIGN KEY (`session_id`) REFERENCES `sessions`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`guest_id`) REFERENCES `guests`(`id`) ON UPDATE no action ON DELETE cascade
);
CREATE UNIQUE INDEX `votes_proposal_guest_unique` ON `votes` (`proposal_id`,`guest_id`);
CREATE UNIQUE INDEX `events_slug_unique` ON `events` (`slug`);
CREATE UNIQUE INDEX `rsvps_session_guest_unique` ON `rsvps` (`session_id`,`guest_id`);
CREATE UNIQUE INDEX `guests_email_unique` ON `guests` (lower("email"));
CREATE INDEX `proposal_comments_proposal_idx` ON `proposal_comments` (`proposal_id`);
CREATE INDEX `comment_likes_guest_idx` ON `comment_likes` (`guest_id`);
CREATE INDEX `session_comments_session_idx` ON `session_comments` (`session_id`);
CREATE INDEX `profile_comments_profile_idx` ON `profile_comments` (`profile_id`);
CREATE INDEX `meeting_availability_slot_idx` ON `meeting_availability` (`event_id`,`slot_start`);
CREATE INDEX `meeting_points_event_idx` ON `meeting_points` (`event_id`);
CREATE INDEX `meetings_event_requester_idx` ON `meetings` (`event_id`,`requester_id`);
CREATE INDEX `meetings_event_recipient_idx` ON `meetings` (`event_id`,`recipient_id`);
CREATE INDEX `notifications_guest_created_idx` ON `notifications` (`guest_id`,`created_at`);
CREATE INDEX `notifications_guest_read_idx` ON `notifications` (`guest_id`,`read_at`);
CREATE UNIQUE INDEX `meetings_no_duplicate_request` ON `meetings` (`event_id`,`requester_id`,`recipient_id`,`slot_start`) WHERE "meetings"."status" in ('pending', 'accepted');
CREATE UNIQUE INDEX `push_subscriptions_endpoint_unique` ON `push_subscriptions` (`endpoint`);
CREATE INDEX `push_subscriptions_guest_idx` ON `push_subscriptions` (`guest_id`);
CREATE INDEX `session_reminders_session_idx` ON `session_reminders` (`session_id`);
COMMIT;
