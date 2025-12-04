-- Hassan Kazmi's Terminal Portfolio - Seed Data
-- This migration populates the database with Hassan's portfolio data

-- ============================================================================
-- SETTINGS DATA
-- ============================================================================

-- Terminal theme configuration
INSERT INTO settings (key, value, description) VALUES
(
  'terminal_theme',
  '{
    "default": {
      "name": "default",
      "colors": {
        "background": "#1a1b26",
        "text": "#a9b1d6",
        "accent": "#7aa2f7",
        "error": "#f7768e",
        "success": "#9ece6a"
      }
    },
    "cyberpunk": {
      "name": "cyberpunk",
      "colors": {
        "background": "#0a0e27",
        "text": "#00ff9f",
        "accent": "#ff006e",
        "error": "#ff006e",
        "success": "#00ff9f"
      }
    },
    "matrix": {
      "name": "matrix",
      "colors": {
        "background": "#000000",
        "text": "#00ff00",
        "accent": "#00ff00",
        "error": "#ff0000",
        "success": "#00ff00"
      }
    },
    "dracula": {
      "name": "dracula",
      "colors": {
        "background": "#282a36",
        "text": "#f8f8f2",
        "accent": "#bd93f9",
        "error": "#ff5555",
        "success": "#50fa7b"
      }
    }
  }'::jsonb,
  'Available terminal themes with color configurations'
),
(
  'contact_info',
  '{
    "email": "smhk760@gmail.com",
    "phone": "+92-336-0322869",
    "location": "Karachi, Pakistan",
    "socials": {
      "github": "https://github.com/sm-Hassan-Kazmi",
      "linkedin": "https://linkedin.com/in/hassan-kazmi-smhk760"
    }
  }'::jsonb,
  'Contact information and social media links'
),
(
  'seo_metadata',
  '{
    "title": "Hassan Kazmi - AI/ML Software Engineer Portfolio",
    "description": "AI/ML-focused Software Engineer specializing in building scalable, agentic AI systems and advanced chatbots using LangChain, LangGraph, and LLMs",
    "keywords": ["AI", "ML", "LangChain", "LangGraph", "LLMs", "Python", "Software Engineer", "Agentic AI", "Chatbots"]
  }'::jsonb,
  'SEO metadata for the portfolio'
),
(
  'feature_flags',
  '{
    "gui_mode_enabled": false,
    "admin_portal_enabled": false,
    "blog_enabled": false,
    "ai_chat_enabled": false
  }'::jsonb,
  'Feature flags for enabling/disabling features'
);

-- ============================================================================
-- SKILLS DATA
-- ============================================================================

-- Programming Languages
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'Python', 'Primary language for AI/ML development and automation', '{"category": "backend", "proficiency": 95}'::jsonb, 1, true, true),
('skill', 'JavaScript', 'Full-stack web development', '{"category": "frontend", "proficiency": 85}'::jsonb, 2, true, true),
('skill', 'C++', 'Systems programming and algorithms', '{"category": "backend", "proficiency": 80}'::jsonb, 3, false, true),
('skill', 'C', 'Low-level programming', '{"category": "backend", "proficiency": 75}'::jsonb, 4, false, true),
('skill', 'SQL', 'Database querying and management', '{"category": "backend", "proficiency": 85}'::jsonb, 5, true, true);

-- AI/ML Frameworks & Libraries
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'LangChain', 'Framework for developing LLM-powered applications', '{"category": "backend", "proficiency": 95}'::jsonb, 6, true, true),
('skill', 'LangGraph', 'Library for building stateful multi-agent applications', '{"category": "backend", "proficiency": 92}'::jsonb, 7, true, true),
('skill', 'CrewAI', 'Framework for orchestrating role-playing AI agents', '{"category": "backend", "proficiency": 88}'::jsonb, 8, true, true),
('skill', 'Microsoft AutoGen', 'Framework for building multi-agent conversational systems', '{"category": "backend", "proficiency": 85}'::jsonb, 9, true, true),
('skill', 'LLaMA', 'Large Language Model deployment and fine-tuning', '{"category": "backend", "proficiency": 90}'::jsonb, 10, true, true),
('skill', 'Graphviz', 'Graph visualization and diagram generation', '{"category": "tools", "proficiency": 80}'::jsonb, 11, false, true);

-- Frontend Technologies
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'React', 'Modern JavaScript library for building user interfaces', '{"category": "frontend", "proficiency": 88}'::jsonb, 12, true, true);

-- DevOps & Tools
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'Linux', 'Unix-like operating system administration', '{"category": "tools", "proficiency": 90}'::jsonb, 13, true, true),
('skill', 'Docker', 'Containerization and deployment', '{"category": "tools", "proficiency": 85}'::jsonb, 14, true, true),
('skill', 'GitHub Actions', 'CI/CD automation and workflows', '{"category": "tools", "proficiency": 82}'::jsonb, 15, true, true),
('skill', 'VS Code', 'Primary development environment', '{"category": "tools", "proficiency": 95}'::jsonb, 16, false, true),
('skill', 'Scrum', 'Agile project management methodology', '{"category": "tools", "proficiency": 85}'::jsonb, 17, false, true);

-- Cloud Platforms
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'Azure', 'Microsoft cloud computing platform', '{"category": "tools", "proficiency": 85}'::jsonb, 18, true, true),
('skill', 'AWS', 'Amazon Web Services cloud platform', '{"category": "tools", "proficiency": 80}'::jsonb, 19, true, true);

-- Databases
INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
('skill', 'MySQL', 'Relational database management system', '{"category": "backend", "proficiency": 85}'::jsonb, 20, false, true);

-- ============================================================================
-- EXPERIENCE DATA
-- ============================================================================

INSERT INTO sections (type, title, description, metadata, start_date, end_date, display_order, is_featured, is_visible) VALUES
(
  'experience',
  'Software Engineer — AI/ML',
  'Built an agentic AI Search platform handling 19M+ property listings in real-time, improving lead conversion and user satisfaction. Designed multi-step reasoning workflows and advanced SQL/API agents, reducing latency by 40%. Enhanced system reliability with observability tooling (Sentry) and reduced incident resolution time. Led LLM fine-tuning and prompt optimization efforts, decreasing hallucinations and improving factual accuracy by 25%. Conducted knowledge-sharing sessions on scalable AI/ML system design and LangChain/LangGraph best practices.',
  '{
    "company": "Qubitse Enterprise",
    "location": "Remote",
    "technologies": ["LangChain", "LangGraph", "Python", "LLMs", "SQL", "Sentry"]
  }'::jsonb,
  '2024-06-01',
  NULL,
  1,
  true,
  true
),
(
  'experience',
  'Software Engineer Intern — AI/ML',
  'Developed multi-agent models automating software development workflows, reducing manual effort by 30%. Integrated LLaMA3, CodeQwen, and LangChain to optimize code generation and internal tooling processes. Collaborated cross-functionally on AI-driven feature design and engineering efforts.',
  '{
    "company": "Dream-Sleep",
    "location": "Remote",
    "technologies": ["LLaMA3", "CodeQwen", "LangChain", "Python", "Multi-Agent Systems"]
  }'::jsonb,
  '2024-02-01',
  '2024-06-30',
  2,
  true,
  true
);

-- ============================================================================
-- PROJECTS DATA
-- ============================================================================

INSERT INTO sections (type, title, description, metadata, display_order, is_featured, is_visible) VALUES
(
  'project',
  'Bill Payment Analysis (FYP)',
  'Final Year Project: Forecasted late payments using predictive modeling on historical data. Employed k-means clustering and time series analysis to segment users and identify billing trends. Built comprehensive data pipeline for processing and analyzing payment patterns.',
  '{
    "techStack": ["Python", "Machine Learning", "K-means Clustering", "Time Series Analysis", "Data Analytics"],
    "tags": ["machine-learning", "data-science", "predictive-modeling", "fyp"]
  }'::jsonb,
  1,
  true,
  true
),
(
  'project',
  'AIDiagrams: AI-Driven Diagram Creation',
  'Automated UML and flowchart generation from natural language descriptions, reducing manual effort by 80%. Leveraged LLMs and Graphviz to transform text specifications into professional diagrams. Streamlined software design documentation process.',
  '{
    "techStack": ["Python", "Graphviz", "LLMs", "Natural Language Processing"],
    "tags": ["ai", "automation", "diagram-generation", "nlp"]
  }'::jsonb,
  2,
  true,
  true
),
(
  'project',
  'Restaurant Management Solution',
  'Built a full-stack system for operational streamlining with inventory management, order tracking, and analytics dashboard. Implemented CI/CD pipelines with Azure DevOps for automated testing and deployment. Designed scalable database schema for multi-location support.',
  '{
    "techStack": ["MySQL", "React", "Azure", "Azure DevOps", "CI/CD"],
    "tags": ["full-stack", "devops", "cloud", "database-design"]
  }'::jsonb,
  3,
  true,
  true
),
(
  'project',
  'Agentic AI Search Platform',
  'Production AI system handling 19M+ property listings with real-time search capabilities. Implemented multi-step reasoning workflows and advanced SQL/API agents. Achieved 40% latency reduction through optimization and caching strategies.',
  '{
    "techStack": ["LangChain", "LangGraph", "Python", "SQL", "API Integration"],
    "tags": ["ai", "search", "real-time", "production"]
  }'::jsonb,
  4,
  true,
  true
);

-- ============================================================================
-- CERTIFICATIONS & ACHIEVEMENTS DATA
-- ============================================================================

INSERT INTO sections (type, title, description, metadata, start_date, display_order, is_featured, is_visible) VALUES
(
  'certification',
  'Bachelor of Science in Computer Science',
  'Graduated from FAST - NUCES, Karachi with focus on AI/ML. Relevant coursework: Artificial Intelligence, Applied Machine Learning, Deep Learning for Perception, Design & Analysis of Algorithms, DevOps.',
  '{
    "issuer": "FAST - NUCES",
    "location": "Karachi, Pakistan"
  }'::jsonb,
  '2024-05-01',
  1,
  true,
  true
),
(
  'certification',
  'Vice President - The Literary Club',
  'Led literary initiatives and organized cultural events at FAST-NUCES. Managed team coordination and event planning for university-wide programs.',
  '{
    "issuer": "FAST-NUCES",
    "type": "Leadership"
  }'::jsonb,
  '2023-01-01',
  2,
  true,
  true
),
(
  'certification',
  'Director External Affairs - ACM FAST-NUCES',
  'Managed external relations and partnerships for ACM student chapter. Coordinated with industry professionals and organized tech talks and workshops.',
  '{
    "issuer": "ACM FAST-NUCES",
    "type": "Leadership"
  }'::jsonb,
  '2022-09-01',
  3,
  true,
  true
),
(
  'certification',
  'Event Planner - PROCOM''23',
  'Organized and managed events for PROCOM''23, one of Pakistan''s largest tech conferences. Coordinated logistics, speakers, and participant engagement.',
  '{
    "issuer": "FAST-NUCES",
    "type": "Event Management"
  }'::jsonb,
  '2023-02-01',
  4,
  false,
  true
),
(
  'certification',
  'Judge - PROCOM''22',
  'Served as technical judge for programming competitions and hackathons at PROCOM''22. Evaluated projects and provided feedback to participants.',
  '{
    "issuer": "FAST-NUCES",
    "type": "Technical Judging"
  }'::jsonb,
  '2022-02-01',
  5,
  false,
  true
),
(
  'certification',
  'Volunteer Teacher - BOLD',
  'Taught Physics, Computer Science, and Mathematics to underprivileged students. Developed curriculum and mentored students in STEM subjects.',
  '{
    "issuer": "BOLD",
    "type": "Community Service"
  }'::jsonb,
  '2021-06-01',
  6,
  false,
  true
),
(
  'certification',
  'Volunteer - JDC Welfare',
  'Participated in community welfare initiatives and social service programs. Contributed to various charitable activities and community development projects.',
  '{
    "issuer": "JDC Welfare",
    "type": "Community Service"
  }'::jsonb,
  '2020-09-01',
  7,
  false,
  true
);

-- ============================================================================
-- ABOUT/BIO DATA (stored in settings)
-- ============================================================================

INSERT INTO settings (key, value, description) VALUES
(
  'about_info',
  '{
    "name": "Hassan Kazmi",
    "role": "AI/ML Software Engineer",
    "location": "Karachi, Pakistan",
    "education": "BS Computer Science, FAST-NUCES",
    "bio": "AI/ML-focused Software Engineer specializing in building scalable, agentic AI systems and advanced chatbots using LangChain, LangGraph, and LLMs. Passionate about leveraging cutting-edge AI technologies to solve real-world problems and create intelligent, autonomous systems. Based in Karachi, Pakistan, with experience in production AI systems handling millions of records in real-time.",
    "specializations": ["Agentic AI", "LLMs", "Multi-Agent Systems", "LangChain", "LangGraph"]
  }'::jsonb,
  'About/bio information for the portfolio owner'
);

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Verify data was inserted correctly
-- SELECT type, COUNT(*) as count FROM sections GROUP BY type;
-- SELECT key FROM settings;
