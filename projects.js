/* Case-study data — consumed by script.js to render the project modal.
   Edit here to change a project's challenge / solution / result. */
window.PROJECTS = [
  {
    "id": "ai-dish",
    "img": "case_study_28.png",
    "cat": "AI",
    "badge": "AI · Backend",
    "title": "AI Restaurant & Dish Search",
    "metric": "Semantic vector search",
    "summary": "An AI-powered restaurant discovery platform that understands intent, not just keywords — built on PostgreSQL vector search.",
    "challenge": "Keyword search could not surface the right dishes when queries were vague or descriptive. The platform needed semantic, relevance-based results across restaurant and dish data.",
    "solution": [
      "Generated dish embeddings with the OpenAI API and stored them in PostgreSQL vector columns.",
      "Implemented similarity search for context-aware, semantic dish matching.",
      "Built the Laravel backend and REST APIs, with a custom prompt builder and AI-alignment logic.",
      "Added Laravel Sanctum auth, a Filament admin panel, and queue jobs + Supervisor for background AI processing."
    ],
    "impact": [
      "Relevant results even for vague or misspelled queries.",
      "A scalable AI search engine that lifted dish-discovery accuracy and engagement."
    ],
    "stack": [
      "Laravel",
      "OpenAI API",
      "PostgreSQL",
      "Vector search",
      "Filament"
    ]
  },
  {
    "id": "llm-eval",
    "img": "case_study_21.png",
    "cat": "AI",
    "badge": "AI · Frontend",
    "title": "AI LLM Evaluation Platform",
    "metric": "50–60 E2E tests",
    "summary": "Frontend for an AI platform where users evaluate prompts and compare model outputs — hardened with heavy end-to-end testing.",
    "challenge": "Build complex model-comparison UI around asynchronous AI responses and multiple evaluation states, secure the data exchange, and guarantee cross-browser reliability.",
    "solution": [
      "Built model-comparison and evaluation UI in Next.js with careful state handling for dynamic AI outputs.",
      "Implemented an account-management module with validation and state sync.",
      "Added request/response encryption-decryption for secure API exchange, plus social login flows.",
      "Wrote 50–60 Playwright E2E tests covering prompt execution, auth and edge cases across browser engines."
    ],
    "impact": [
      "Stronger frontend architecture and improved security via API encryption.",
      "Reliable, cross-browser behaviour proven by a broad automated test suite."
    ],
    "stack": [
      "Next.js",
      "React",
      "Playwright",
      "REST API"
    ]
  },
  {
    "id": "fitness",
    "img": "case_study_10.png",
    "cat": "Backend",
    "badge": "Fitness · Backend",
    "title": "Health & Fitness Platform",
    "metric": "Scaled to 40k+ users",
    "summary": "Backend architecture for a fitness platform that grew from 20k to 40k+ active users — and kept working as the load climbed.",
    "challenge": "The platform grew fast. Verification emails collapsed under traffic spikes, exercise videos streamed slowly, the database strained, and bulk notifications were firing duplicates.",
    "solution": [
      "Designed the REST API architecture and structured the MySQL database from the ground up.",
      "Built the Program Builder and Workout Builder modules plus an admin panel.",
      "Migrated email to a reliable third-party provider so verification survived spikes.",
      "Moved video delivery to AWS S3 + CDN and the database to AWS RDS for headroom.",
      "Refactored the notification logic to stop overlapping and duplicate sends."
    ],
    "impact": [
      "Scaled cleanly to 40k+ active users.",
      "Faster video streaming and stable email under heavy traffic, driving engagement and revenue."
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "AWS",
      "REST APIs"
    ]
  },
  {
    "id": "betting",
    "img": "case_study_29.png",
    "cat": "Backend",
    "badge": "Fintech · Realtime",
    "title": "Real-Time Sports Betting API",
    "metric": "Live odds every 30s",
    "summary": "Replaced a USA betting platform’s legacy data provider with a real-time integration refreshing live odds every 30 seconds.",
    "challenge": "Swap out old APIs on a live system, absorb unfamiliar sports-betting data structures, and process high-frequency updates without overloading the server.",
    "solution": [
      "Designed a new backend architecture for real-time betting data flow.",
      "Built an efficient integration layer for continuous fetching and restructured API data into the existing schema.",
      "Added caching to cut database load and optimised queries for high-frequency updates.",
      "Kept the system stable through the migration with no break in live service."
    ],
    "impact": [
      "Faster, reliable real-time odds with reduced server load.",
      "Clean migration off the legacy provider onto scalable live infrastructure."
    ],
    "stack": [
      "Core PHP",
      "REST API",
      "Caching",
      "MySQL"
    ]
  },
  {
    "id": "event-vendor",
    "img": "case_study_24.png",
    "cat": "Backend",
    "badge": "Startup MVP · NestJS",
    "title": "Event Vendor Marketplace",
    "metric": "MVP backend on AWS",
    "summary": "A scalable MVP backend for an event-vendor marketplace, owning everything from architecture to AWS deployment.",
    "challenge": "Deliver a secure, production-ready backend to power mobile apps for discovering and booking event vendors — from a blank slate.",
    "solution": [
      "Built a modular NestJS backend with MongoDB collections for users, vendors, bookings and categories.",
      "Developed REST APIs for auth, vendor onboarding and management, search/filtering and booking.",
      "Added DTO validation, guards and structured error handling for secure, reliable APIs.",
      "Wrote Swagger docs for smooth frontend/mobile integration and deployed to AWS."
    ],
    "impact": [
      "A secure, scalable MVP backend that gave the startup a growth-ready foundation."
    ],
    "stack": [
      "NestJS",
      "Node.js",
      "MongoDB",
      "TypeScript"
    ]
  },
  {
    "id": "medusa-search",
    "img": "case_study_27.png",
    "cat": "Backend",
    "badge": "E-commerce · Search",
    "title": "Medusa Advanced Search",
    "metric": "Typo-tolerant fuzzy search",
    "summary": "A fuzzy, typo-tolerant search system for a Medusa commerce platform, built with MiniSearch.",
    "challenge": "The default search couldn’t handle misspelled or partial queries, hurting product discovery.",
    "solution": [
      "Set up and configured a dedicated MiniSearch server and integrated it with the Medusa backend.",
      "Built an optimised indexing strategy for product titles, descriptions and metadata.",
      "Implemented fuzzy matching, typo tolerance and query interpretation.",
      "Tuned result ranking for better relevance."
    ],
    "impact": [
      "Accurate results even from approximate keywords.",
      "A faster, more discoverable shopping experience on scalable search infrastructure."
    ],
    "stack": [
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "MiniSearch"
    ]
  },
  {
    "id": "social",
    "img": "case_study_6.png",
    "cat": "Backend",
    "badge": "Social · Backend",
    "title": "Social Engagement Platform",
    "metric": "Realtime chat + subscriptions",
    "summary": "The complete backend for a martial-arts community — from auth and media to realtime chat and paid subscriptions.",
    "challenge": "Build, from scratch, a role-based social backend handling media posts, live chat, subscriptions and full admin moderation.",
    "solution": [
      "Built the REST APIs and architecture from scratch in Laravel.",
      "Role-based auth with Laravel Passport, plus an admin-managed pro-verification workflow.",
      "Media post module with like, comment, follow, block and report, and tag-based search.",
      "Room-based realtime chat over Socket.IO, PayPal subscriptions, FCM push and FFmpeg thumbnails."
    ],
    "impact": [
      "A complete, documented backend deployed on AWS with Swagger API docs."
    ],
    "stack": [
      "Laravel",
      "Socket.IO",
      "PayPal",
      "AWS",
      "MySQL"
    ]
  },
  {
    "id": "petcare",
    "img": "case_study_22.png",
    "cat": "Full-stack",
    "badge": "Full-stack · Rescue",
    "title": "Pet Care Platform",
    "metric": "Stabilised + DoS mitigated",
    "summary": "Stabilised a broken pet-care platform — vet consults, adoption, appointments, chat, video calls, payments — and defended it from an attack.",
    "challenge": "The system arrived unstable: incomplete features, broken flows, flaky video calls, appointment and chat bugs, and payment problems. After launch it was hit by a DoS-style registration flood.",
    "solution": [
      "Completed pending features and refactored broken functionality into a stable base.",
      "Fixed video-call session handling, appointment scheduling conflicts and chat real-time sync.",
      "Repaired the payment transaction flow for secure, reliable processing.",
      "Mitigated the attack with rate limiting, anti-bot validation, hardened auth and secured endpoints."
    ],
    "impact": [
      "Turned a broken build into a live, production-ready platform.",
      "Stopped the malicious registrations and restored stability."
    ],
    "stack": [
      "Laravel",
      "React",
      "JavaScript"
    ]
  },
  {
    "id": "payments",
    "img": "case_study_23.png",
    "cat": "Backend",
    "badge": "Payments · Architecture",
    "title": "Multi-Gateway Payment System",
    "metric": "No single point of failure",
    "summary": "Re-architected an e-commerce checkout from one hardcoded gateway into a flexible multi-gateway system with Razorpay.",
    "challenge": "The store depended on a single payment gateway — any downtime stopped checkout entirely and put revenue at risk.",
    "solution": [
      "Designed an abstracted payment-service layer supporting multiple gateways with consistent checkout logic.",
      "Integrated Razorpay securely: server-side verification, signature validation and duplicate-transaction protection.",
      "Built an admin module to enable/disable and switch gateways with no redeployment.",
      "Added unified, standardised transaction logging across all gateways."
    ],
    "impact": [
      "Eliminated the single point of failure and cut revenue risk during outages.",
      "A future-proofed checkout that non-technical staff can reconfigure in real time."
    ],
    "stack": [
      "Laravel",
      "React",
      "Razorpay",
      "Payment gateways"
    ]
  },
  {
    "id": "fooddelivery",
    "img": "case_study_16.png",
    "cat": "Full-stack",
    "badge": "Food delivery · Realtime",
    "title": "Real-Time Food Delivery Platform",
    "metric": "Made production-ready",
    "summary": "Stabilised and grew a real-time food-delivery platform spanning user, restaurant and driver apps on iOS, Android and web.",
    "challenge": "The system was unstable — buggy, half-finished and poorly structured — and not production-ready when handed over.",
    "solution": [
      "Completed unfinished features, refactored broken code and fixed critical mobile/web bugs.",
      "Maintained and optimised REST APIs across the user, restaurant and driver apps.",
      "Deployed the stable build to production and modified complex live features without disrupting users.",
      "Added a request-log tracker for efficient API monitoring and debugging."
    ],
    "impact": [
      "A reliable production platform with steady feature growth.",
      "Better API stability and stronger monitoring practices."
    ],
    "stack": [
      "Laravel",
      "REST API",
      "MySQL",
      "iOS/Android"
    ]
  },
  {
    "id": "trading",
    "img": "trading_simulator.jpg",
    "cat": "Full-stack",
    "badge": "Fintech · Realtime",
    "title": "Trading Simulator",
    "metric": "Live market, zero risk",
    "summary": "A real-time trading simulator that lets people practice against live market behaviour without risking a cent.",
    "challenge": "Give users a realistic way to learn trading — live prices, real charts, real order flow — with no financial risk.",
    "solution": [
      "Streamed live market prices to the browser over WebSockets.",
      "Paper-trading mode for simulated buy/sell orders.",
      "Interactive Chart.js visualisations of price trends.",
      "A dashboard tracking portfolio performance, trade history and profit/loss, on a Node.js + MongoDB backend."
    ],
    "impact": [
      "Traders refined strategies before risking real money.",
      "Smooth, fast performance even with real-time data streaming."
    ],
    "stack": [
      "Node.js",
      "MongoDB",
      "WebSockets",
      "Chart.js"
    ]
  },
  {
    "id": "workforce",
    "img": "case_study_19.png",
    "cat": "Mobile",
    "badge": "Mobile · Flutter",
    "title": "Workforce Hiring Platform",
    "metric": "Pivoted Ionic → Flutter",
    "summary": "A mobile marketplace connecting skilled workers with employers — built from scratch, then re-architected mid-project.",
    "challenge": "Deliver a production-ready hiring app; the initial Ionic build hit ecosystem and scalability limits that threatened the long term.",
    "solution": [
      "Built the first version in Ionic — auth, job listings, role-based access and realtime data on Firebase.",
      "Made the strategic call to rebuild in Flutter for performance and maintainability.",
      "Rapidly re-architected the app in Flutter with a modular, scalable structure.",
      "Delivered worker profiles, proposals, employer onboarding and Firebase-backed realtime data, ready for Android."
    ],
    "impact": [
      "A production-ready cross-platform app despite the mid-project technology pivot."
    ],
    "stack": [
      "Flutter",
      "Firebase",
      "Ionic",
      "Firestore"
    ]
  },
  {
    "id": "salon",
    "img": "case_study_2.jpg",
    "cat": "Backend",
    "badge": "SaaS · Multi-tenant",
    "title": "Salon Management Platform",
    "metric": "Zero-loss data migration",
    "summary": "A SaaS multi-tenant platform for US salons, including a hardware bridge for tanning beds.",
    "challenge": "Migrate large datasets off legacy software with zero loss, keep the database fast across many tenants, and tie physical tanning-bed hardware into the cloud.",
    "solution": [
      "Ran the full database migration: mapping, transformation, validation and testing.",
      "Optimised complex MySQL queries for performance across multiple tenants.",
      "Built a Windows desktop app in PHP for tanning-bed management.",
      "Integrated the desktop app with the SaaS platform for seamless data sync."
    ],
    "impact": [
      "Zero data loss, with accurate mapping throughout.",
      "Improved multi-tenant performance, and hardware kept continuously in sync with the cloud."
    ],
    "stack": [
      "Core PHP",
      "MySQL",
      "JavaScript"
    ]
  },
  {
    "id": "wahe",
    "img": "case_study_18_1.png",
    "cat": "E-commerce",
    "badge": "E-commerce · SaaS",
    "title": "Wahe Furniture — SaaS Commerce",
    "metric": "Enterprise-ready store",
    "summary": "A scalable SaaS e-commerce platform for furniture businesses, powered by Aimeos with a full admin CMS.",
    "challenge": "Deliver a stable, enterprise-ready store that furniture businesses could scale their whole operation on.",
    "solution": [
      "Built advanced product management (categories, variants, pricing) and a full order workflow.",
      "Added a discount/coupon engine and multiple payment-gateway integrations.",
      "Implemented flexible delivery/shipping options and a sales & customer analytics dashboard.",
      "Architected for scalability, maintainability and performance on Aimeos."
    ],
    "impact": [
      "A stable, enterprise-ready commerce platform with streamlined management."
    ],
    "stack": [
      "Laravel",
      "Aimeos",
      "MySQL",
      "JavaScript"
    ]
  },
  {
    "id": "shopping",
    "img": "Shopping_market.png",
    "cat": "E-commerce",
    "badge": "E-commerce",
    "title": "Shopping Market",
    "metric": "Full storefront + admin",
    "summary": "A complete, globally-ready e-commerce platform the client can run entirely on their own.",
    "challenge": "The client needed a full store selling across languages, currencies, payment methods and couriers — all editable without a developer.",
    "solution": [
      "Admin dashboard with a sales, orders and customer overview.",
      "Product, category and attribute management (size, colour, material) with images.",
      "Multiple payment gateways (Stripe, PayPal, Razorpay) and delivery-partner options.",
      "Multi-language and multi-currency support, discounts and coupons, cart and checkout with tax and shipping."
    ],
    "impact": [
      "A store the client can operate and expand globally without engineering help."
    ],
    "stack": [
      "Laravel",
      "Stripe",
      "PayPal",
      "MySQL"
    ]
  },
  {
    "id": "ecom",
    "img": "e-commerce_store.png",
    "cat": "E-commerce",
    "badge": "E-commerce",
    "title": "E-commerce Store",
    "metric": "+30% sales",
    "summary": "A high-performance store built for conversion — custom cart, reliable checkout, fast pages.",
    "challenge": "Build a fast, SEO-friendly store where the cart and payments never get in the way of a sale.",
    "solution": [
      "Custom shopping cart tailored to the catalogue.",
      "Stripe and PayPal payment-gateway integration.",
      "Full order-management system.",
      "SEO and load-time optimisation across the storefront."
    ],
    "impact": [
      "A 30% increase in sales after launch."
    ],
    "stack": [
      "Laravel",
      "Stripe",
      "PayPal",
      "SEO"
    ]
  },
  {
    "id": "classifieds",
    "img": "case_study_7.png",
    "cat": "Full-stack",
    "badge": "Marketplace · Rescue",
    "title": "Free Classifieds Platform",
    "metric": "Rescued to production-ready",
    "summary": "Took over an unstable classifieds platform from another team and turned it into a reliable marketplace.",
    "challenge": "Inherited a shaky build: broken auth and listing flow, slow relational queries, weak search, failing translations, and un-optimised mobile APIs.",
    "solution": [
      "Stabilised authentication and the product-listing workflow.",
      "Refactored slow Eloquent relational queries and optimised filtering and search.",
      "Built a dynamic hierarchical category selector in React, integrated with Laravel.",
      "Fixed multilingual translations and optimised REST APIs for mobile."
    ],
    "impact": [
      "A production-ready marketplace out of an unstable build.",
      "Faster search and better mobile API response times."
    ],
    "stack": [
      "Laravel",
      "React",
      "REST API",
      "MySQL"
    ]
  },
  {
    "id": "dating",
    "img": "case_study_8.png",
    "cat": "Backend",
    "badge": "Performance",
    "title": "Dating Platform Optimisation",
    "metric": "Much faster API",
    "summary": "Performance work on a dating app with swipe, match-making and subscriptions — the home feed was crawling.",
    "challenge": "API responses were slow, especially loading profiles on the home screen: inefficient ORM queries, nested loops, no indexing, and heavy preference filtering.",
    "solution": [
      "Audited API routes, controller logic and queries step by step.",
      "Refactored inefficient loops and improved Eloquent relational queries.",
      "Added database indexing on frequently queried columns, including string fields.",
      "Optimised preference-based filtering."
    ],
    "impact": [
      "Significantly faster API and home-screen loading.",
      "Reduced database load and better scalability."
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "REST API"
    ]
  },
  {
    "id": "sandwich",
    "img": "case_study_9.png",
    "cat": "Backend",
    "badge": "Optimisation · Realtime",
    "title": "Custom Sandwich Platform",
    "metric": "N+1 killed, live orders",
    "summary": "Optimised and stabilised a build-your-own sandwich ordering platform that buckled under new orders.",
    "challenge": "Slow queries and API times, N+1 problems from ORM calls inside loops, slowdown whenever new orders arrived, and heavy JSON-based admin reports.",
    "solution": [
      "Replaced relational calls inside loops with eager loading via with() and load().",
      "Added limits to heavy SELECTs and wrapped bulk operations in transactions.",
      "Implemented WebSocket live order updates that refresh only the relevant section.",
      "Refactored JSON-and-join reports into smaller, reusable queries."
    ],
    "impact": [
      "Reduced API response time and a faster admin panel.",
      "Eliminated slowdowns during peak order activity."
    ],
    "stack": [
      "Laravel",
      "WebSockets",
      "MySQL"
    ]
  },
  {
    "id": "jobportal",
    "img": "case_study_4.png",
    "cat": "Full-stack",
    "badge": "Full-stack",
    "title": "Job Portal Platform",
    "metric": "Built from scratch",
    "summary": "A Laravel job portal for teachers and office staff, built end-to-end and hardened through real use.",
    "challenge": "Build a complete job portal from scratch — profiles, listings, applications and admin analytics — reliable against real-world edge cases.",
    "solution": [
      "Designed the system on Laravel MVC principles with a custom auth UI.",
      "Analytics dashboard for monitoring users and job activity.",
      "Multi-step dynamic teacher-profile forms with full CRUD, plus resume upload/download.",
      "Job listings and controller-based business logic, with Laravel Mix for assets."
    ],
    "impact": [
      "Stabilised across multiple testing iterations into a reliable platform."
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "JavaScript",
      "jQuery"
    ]
  },
  {
    "id": "florist",
    "img": "case_study_3.png",
    "cat": "Frontend",
    "badge": "Frontend · Angular",
    "title": "Florist Management System",
    "metric": "CRM · accounting · reporting",
    "summary": "The Angular frontend of a feature-rich florist ERP, with a demanding real-time data table at its core.",
    "challenge": "Build a rich management UI — CRM, accounting, dashboard, reporting — including a dynamic table with real-time row appending that stays fast.",
    "solution": [
      "Complex UI components: custom tables, cards and CRUD forms in Angular Material.",
      "RxJS-based reactive state management for efficient data rendering.",
      "Integrated multiple APIs and used DataTables for advanced listing, sorting and filtering.",
      "Engineered a dynamic multi-column table with real-time row appending."
    ],
    "impact": [
      "Responsive, scalable interfaces with smooth interactions under load."
    ],
    "stack": [
      "Angular",
      "TypeScript",
      "Material UI",
      "RxJS"
    ]
  },
  {
    "id": "brokerage",
    "img": "case_study_5.png",
    "cat": "Frontend",
    "badge": "Real estate · Angular",
    "title": "Real Estate Brokerage Module",
    "metric": "Agent billing & payouts",
    "summary": "A brokerage module for a real estate app — agents, billing and commission payouts under role-based access.",
    "challenge": "My first freelance project: independently build a brokerage module handling agents, billing accounts and commission payouts, with role-based broker access.",
    "solution": [
      "Agent management with structured listing tables and billing accounts for payouts.",
      "Payment tracking: upcoming payments, agent dues, pending payments and history.",
      "PDF invoice download and role-based broker authentication.",
      "Built the full UI in Angular Material and integrated .NET REST APIs."
    ],
    "impact": [
      "Independently delivered the UI architecture, API integration and financial workflows."
    ],
    "stack": [
      "Angular",
      "Material UI",
      "REST API"
    ]
  },
  {
    "id": "sweep",
    "img": "case_study_12.png",
    "cat": "Frontend",
    "badge": "Frontend · Angular",
    "title": "Sweep Service Client Panel",
    "metric": "Multi-step booking flow",
    "summary": "The Angular 15 client panel for a home/office cleaning-service platform with a custom booking flow.",
    "challenge": "Build a clean, scalable client panel with a multi-step service booking-and-purchase flow driven by REST APIs.",
    "solution": [
      "Built the client panel in Angular 15 with a clear frontend architecture and folder structure.",
      "Structured data flow and REST API integration, with state managed via Angular Observables.",
      "Developed a responsive UI and a custom multi-step booking-and-purchase flow.",
      "Managed complex UI states for seamless, performant interaction."
    ],
    "impact": [
      "A scalable, maintainable frontend with a smooth, API-driven booking experience."
    ],
    "stack": [
      "Angular",
      "TypeScript",
      "Angular Material"
    ]
  },
  {
    "id": "insurance",
    "img": "case_study_14.png",
    "cat": "Frontend",
    "badge": "Insurtech · Angular",
    "title": "Life Insurance Aggregator",
    "metric": "Rates + commission calc",
    "summary": "The Angular frontend for a life-insurance aggregator computing final-expense rates and commission advances.",
    "challenge": "Build a clean, lightweight frontend that calculates whole-life rates from top providers and commission advances, with auth and subscriptions.",
    "solution": [
      "Built the complete Angular frontend and integrated a pre-built theme to spec.",
      "Structured the architecture and data flow, and integrated the REST APIs.",
      "Implemented profile authentication and subscription features.",
      "Managed state with Angular Observables for responsive UI behaviour."
    ],
    "impact": [
      "A stable, lightweight platform with smooth subscription and auth workflows."
    ],
    "stack": [
      "Angular",
      "TypeScript",
      "Bootstrap"
    ]
  },
  {
    "id": "buddy",
    "img": "case_study_13.png",
    "cat": "Full-stack",
    "badge": "Full-stack",
    "title": "Buddy — Elderly Assistance",
    "metric": "Static UI → live system",
    "summary": "A subscription-based elderly-assistance platform — I turned a finished UI skin into a working booking system.",
    "challenge": "The redesigned UI was ready but non-functional; it needed the full subscription and service-booking logic wired to the backend.",
    "solution": [
      "Implemented the Laravel backend controllers and business logic.",
      "Wrote JavaScript/jQuery to make the redesigned UI dynamic and integrated it with the backend.",
      "Built subscription purchase plus service booking: provider selection, time slots, package and duration.",
      "Delivered the complete end-to-end booking flow."
    ],
    "impact": [
      "Converted a static UI into a fully functional subscription-and-booking system."
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "jQuery",
      "JavaScript"
    ]
  },
  {
    "id": "wholesale",
    "img": "case_study_15.png",
    "cat": "Full-stack",
    "badge": "E-commerce · Redesign",
    "title": "Wholesale Order Platform",
    "metric": "Modernised web + panel",
    "summary": "Redesigned a wholesale/retail platform and rebuilt its distributor order-booking panel.",
    "challenge": "The client had an ageing Android app and site and needed a modernised web experience plus a dedicated wholesale ordering panel.",
    "solution": [
      "Redesigned and developed the website frontend in Laravel from client prototypes.",
      "Rebuilt the wholesale order-booking panel for distributors and agents.",
      "Fixed order-processing bugs on mobile and web and resolved email-delivery problems.",
      "Refreshed banners, product listings and content across web and app."
    ],
    "impact": [
      "A modernised web presence with a stable wholesale ordering process and better mobile compatibility."
    ],
    "stack": [
      "Laravel",
      "jQuery",
      "Bootstrap",
      "JavaScript"
    ]
  },
  {
    "id": "trimming",
    "img": "case_study_11.png",
    "cat": "Full-stack",
    "badge": "Fitness · Video",
    "title": "Video Trimming Feature",
    "metric": "Frame-precise clips",
    "summary": "A video-trimming tool for a fitness platform, letting users cut short clips with precise start/end frames.",
    "challenge": "Let users pick exact start and end frames to make short clips (e.g. 30s) while keeping quality high and processing fast across devices.",
    "solution": [
      "Built a lightweight trimming tool with start/end frame-selection logic.",
      "Enabled generating short clips such as 30-second cuts.",
      "Optimised the video processing for performance and usability with FFmpeg."
    ],
    "impact": [
      "Smooth, quality-preserving trimming that worked across devices with minimal processing time."
    ],
    "stack": [
      "Laravel",
      "FFmpeg",
      "jQuery",
      "JavaScript"
    ]
  },
  {
    "id": "scraper",
    "img": "case_study_17.png",
    "cat": "Backend",
    "badge": "Automation · Scraping",
    "title": "Amazon Scraper + FB Poster",
    "metric": "Fully automated hourly",
    "summary": "An automation that scrapes Amazon products and posts affiliate content to Facebook every hour.",
    "challenge": "Eliminate manual affiliate research and posting with a reliable pipeline that scrapes product data and publishes automatically.",
    "solution": [
      "Built a scraper for product title, price, images, ratings and affiliate links, handling dynamic content and sessions.",
      "Formatted scraped data into social-ready captions with affiliate links.",
      "Automated hourly Facebook posting via cron/task scheduler.",
      "Added logging, error handling and retry logic for stable unattended runs."
    ],
    "impact": [
      "A fully automated affiliate pipeline that cut manual effort to zero.",
      "Consistent hourly promotion, ready to expand to new categories."
    ],
    "stack": [
      "Laravel",
      "Automation",
      "Web scraping",
      "Cron"
    ]
  },
  {
    "id": "menu-builder",
    "img": "case_study_25.png",
    "cat": "Full-stack",
    "badge": "Tooling",
    "title": "Drag & Drop Menu Builder",
    "metric": "Nested, no-code menus",
    "summary": "A drag-and-drop nested menu builder that lets admins structure multi-level navigation visually.",
    "challenge": "Let non-technical admins build multi-level parent→child→sub-child menus visually, with the hierarchy stored and reordered reliably.",
    "solution": [
      "Built the Laravel backend for menu storage and hierarchy management.",
      "Implemented drag-and-drop reordering with jQuery and JavaScript.",
      "Modelled multi-level nested menus with parent-child relationships and correct ordering.",
      "Added AJAX saving so structure persists without a page refresh."
    ],
    "impact": [
      "A reusable, no-code menu system that improved admin productivity and removed manual DB edits."
    ],
    "stack": [
      "Laravel",
      "jQuery",
      "JavaScript",
      "AJAX"
    ]
  },
  {
    "id": "invoice",
    "img": "case_study_26.png",
    "cat": "Backend",
    "badge": "Billing",
    "title": "Manual Invoice & PDF Billing",
    "metric": "Killed external tools",
    "summary": "A complete in-platform invoicing module with dynamic line items and professional PDF billing.",
    "challenge": "The platform had no internal billing and relied on manual, external invoicing — hurting financial tracking and document management.",
    "solution": [
      "Built invoice CRUD with dynamic line items and automated subtotal/tax/total calculations.",
      "Added an invoice status workflow (Draft, Sent, Paid) and unique invoice-number generation.",
      "Generated clean, printable PDF invoices from structured templates.",
      "Designed an optimised relational schema with validated, accurate calculations."
    ],
    "impact": [
      "Removed the external-invoicing dependency and improved billing accuracy.",
      "Less manual admin effort with reliable record management."
    ],
    "stack": [
      "Laravel",
      "MySQL",
      "PDF",
      "jQuery"
    ]
  },
  {
    "id": "restaurant",
    "img": "case_study_1.png",
    "cat": "Full-stack",
    "badge": "CMS",
    "title": "Restaurant CMS",
    "metric": "Fully client-managed",
    "summary": "A dynamic restaurant site where every page, image, slider and menu item is editable from the admin panel.",
    "challenge": "My first project: build a restaurant site fully driven by a CMS, so the client could manage all content and the menu without a developer.",
    "solution": [
      "CMS-managed sections, pages, sliders and media — every block editable from the dashboard.",
      "A flexible menu-management system to add, update and organise items.",
      "Led and built the entire project end to end."
    ],
    "impact": [
      "The client manages all site content and menus independently."
    ],
    "stack": [
      "Laravel",
      "PHP",
      "CMS",
      "MySQL"
    ]
  },
  {
    "id": "blog",
    "img": "blog_website.png",
    "cat": "Full-stack",
    "badge": "CMS · Blog",
    "title": "Blog Website + Admin Panel",
    "metric": "Publish in seconds",
    "summary": "A news-and-articles blog with a custom admin panel for managing everything, built for safe self-publishing.",
    "challenge": "The client wanted to publish articles across categories and manage posts and interactions themselves, without compromising data safety.",
    "solution": [
      "A custom admin panel for posts, categories and user interactions.",
      "Interactive content designed to lift engagement.",
      "Built on Laravel’s security features to keep data safe."
    ],
    "impact": [
      "Higher engagement with interactive content and seamless publishing on a secure base."
    ],
    "stack": [
      "Laravel",
      "PHP",
      "MySQL"
    ]
  },
  {
    "id": "scraft",
    "img": "case_study_20.png",
    "cat": "E-commerce",
    "badge": "WordPress · WooCommerce",
    "title": "Scraft Uniworld — WooCommerce",
    "metric": "Marketplace-linked store",
    "summary": "Turned a WordPress product showcase into a marketplace-linked store via WooCommerce external products.",
    "challenge": "The client wanted products to link out to Amazon and other marketplaces through WooCommerce, without breaking the existing design or flow.",
    "solution": [
      "Customised and aligned the WordPress theme to brand requirements.",
      "Configured WooCommerce for external/affiliate product links.",
      "Updated product types for outbound marketplace linking and wired up Amazon and other platforms.",
      "Ensured seamless redirection while preserving the existing layout."
    ],
    "impact": [
      "A static showcase became a marketplace-linked platform with external purchasing, structure intact."
    ],
    "stack": [
      "WordPress",
      "WooCommerce",
      "PHP"
    ]
  },
  {
    "id": "tourism",
    "img": "case_study_30.png",
    "cat": "AI",
    "badge": "AI-built · Rapid",
    "title": "Tourism Website (Lovable AI)",
    "metric": "Live in a short window",
    "summary": "A clean, responsive tourism site generated with the Lovable AI platform, then refined and deployed live.",
    "challenge": "Produce a polished, responsive tourism landing page fast, then take it from AI draft to a production domain.",
    "solution": [
      "Generated the initial static site with Lovable AI, then reviewed and refined the layout and content.",
      "Applied custom UI improvements — typography, spacing, section alignment.",
      "Optimised responsiveness for desktop and mobile.",
      "Configured domain and hosting and deployed to production."
    ],
    "impact": [
      "A live, professional tourism site delivered in a short timeframe using AI-assisted generation."
    ],
    "stack": [
      "Lovable AI",
      "HTML",
      "CSS"
    ]
  }
];
