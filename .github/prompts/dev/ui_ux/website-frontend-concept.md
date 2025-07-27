metadata:
  company_name: Parampar
  contact_department:
    sales: sales@parampar.com
    marketing: marketing@parampar.com
    support: support@parampar.com
    operations: ops@parampar.com
  address: "123 Heritage Lane, Old Town, Jaipur, Rajasthan, India"
  email: info@parampar.com
  phone: "+91-141-1234567"
  website_url: "https://www.paramparchaishop.com"
  industry: Food & Beverage, Specialty Tea Retail
  established_year: 1998
  number_of_employees: 85
  corporate_structure:
    - Board of Directors
    - Managing Director
    - Regional Managers
    - Department Heads
  parent_company: Parampar Beverages Group
  subsidiaries:
    - Parampar Tea Exports
    - Parampar Café Franchises
  headquarters_location: Jaipur, India
  social_media:
    twitter: "@ParamparChai"
    facebook: "facebook.com/ParamparChai"
    linkedin: "linkedin.com/company/parampar"
    instagram: "@paramparchai"
    youtube: "youtube.com/ParamparChai"

brand:
  brand_name: Parampar Chai
  logo_files:
    - filepath: "/assets/logos/parampar-primary.svg"
      description: "Primary full-color logo"
    - filepath: "/assets/logos/parampar-monochrome.svg"
      description: "Monochrome variant for dark backgrounds"
    - filepath: "/assets/logos/parampar-icon.png"
      description: "Square icon for social profiles"
  color_palette:
    primary: "#7B3F00"
    secondary: "#F5E1A4"
    accent: "#C1440E"
    neutrals:
      - "#FFFFFF"
      - "#F2F2F2"
      - "#333333"
      - "#666666"
  typography:
    heading_font: "Playfair Display"
    body_font: "Lato"
  imagery_style: "Warm, close-up shots of tea leaves, brewing processes, textured backgrounds"
  brand_voice: "Authentic, warm, knowledgeable, inviting"
  brand_values:
    - Tradition
    - Sustainability
    - Community
    - Quality

project:
  project_name: Parampar Chai Digital Experience
  project_type: Website Redesign & E‑commerce Launch
  project_description: "Full redesign of corporate site, brand storytelling hub, integrated e‑commerce platform, loyalty program and omnichannel integrations."
  objectives:
    - Elevate brand storytelling with interactive content and brand heritage timeline
    - Launch e‑commerce with smooth checkout, subscriptions, gift services
    - Integrate CRM and marketing automation for segmented campaigns
    - Achieve WCAG AA accessibility and 90+ Lighthouse scores
  success_criteria:
    - 25% increase in online sales within 6 months
    - 40% growth in newsletter subscriptions post-launch
    - Average page load under 2s on mobile and desktop
    - 100% mobile usability score on Lighthouse
  key_stakeholders:
    client_representative: "Anjali Singh, Head of Marketing"
    project_manager: "Rahul Verma"
    technical_lead: "Priya Patel"
    creative_lead: "Sameer Rao"
  timeline:
    kickoff_date: "2025-09-01"
    milestone1:
      name: Discovery & Architecture
      date: "2025-09-15"
    milestone2:
      name: Design & Prototyping
      date: "2025-10-20"
    milestone3:
      name: Development & Integrations
      date: "2025-12-10"
    launch_date: "2026-01-15"
    post_launch_review: "2026-03-01"

scope:
  features:
    - name: E‑commerce storefront
      description: "Product catalog, variant selection, subscriptions, gift wrapping"
      priority: high
    - name: Loyalty & Referral
      description: "Point-based rewards, referral tracking, tiered discounts"
      priority: medium
    - name: Content Hub
      description: "Blog, recipes, brewing guides, video tutorials"
      priority: medium
    - name: Live Chat & Chatbots
      description: "24/7 support bot, escalation to live agents"
      priority: low
    - name: Event Calendar
      description: "In‑store tastings, workshops, webinars"
      priority: low
  pages:
    - Home
    - Shop
    - Product Detail
    - Blog
    - About Us
    - Events
    - Contact
    - My Account
    - Cart & Checkout
    - Privacy Policy
    - Terms & Conditions
  content_types:
    - text
    - images
    - video
    - forms
    - downloads
    - interactive quizzes
  multilingual_support:
    languages:
      - code: en
        name: English
      - code: hi
        name: Hindi
      - code: es
        name: Spanish

design:
  style_references:
    - url: "https://www.bhakti-teas.com"
    - url: "https://www.barebonesliving.com"
  moodboard_files:
    - filepath: "/assets/moodboards/earthy-textures.pdf"
    - filepath: "/assets/moodboards/vintage-tea-ads.png"
  layout_preferences:
    header_style: "Sticky with mega-menu"
    navigation_style: "Horizontal top bar with dropdowns"
    footer_style: "Multi‑column with newsletter signup and social links"
  responsive_breakpoints:
    - 320
    - 768
    - 1024
    - 1440
  accessibility_requirements:
    wcag_level: "AA"
    custom_guidelines:
      - "Keyboard navigation for all menu items"
      - "Aria‑labelled controls on interactive components"
      - "Contrast ratio minimum 4.5:1 for text"

content:
  sitemap_outline:
    - page: Home
      subpages:
        - Featured Products
        - Latest Articles
    - page: Shop
      subpages:
        - Categories
        - Subscriptions
    - page: About Us
      subpages:
        - Our Story
        - Our Process
    - page: Blog
      subpages:
        - Categories
        - Tags
    - page: Events
      subpages:
        - Upcoming
        - Past
    - page: My Account
      subpages:
        - Orders
        - Profile
  content_responsibilities:
    copywriting: "In‑house Marketing Team"
    translations: "Global Translations Co."
    imagery: "Studio 47 Photography"
    approvals: "Client Representative"
  seo:
    primary_keywords:
      - chai tea
      - Indian masala chai
    secondary_keywords:
      - artisanal tea blends
    meta_descriptions:
      - page: Home
        description: "Discover Parampar Chai’s artisanal tea blends, heritage recipes, and exclusive subscriptions."
      - page: Shop
        description: "Shop premium Indian teas, custom gift sets, and monthly subscriptions."
    url_structure:
      - page: Product Detail
        path: "/shop/products/{product-slug}"
      - page: Blog Post
        path: "/blog/{year}/{month}/{post-slug}"
  social_sharing:
    default_titles:
      - page: Home
        title: "Parampar Chai – Heritage in Every Sip"
    default_descriptions:
      - page: Home
        description: "Experience the art of authentic Indian chai with Parampar."
    open_graph_images:
      - page: Home
        filepath: "/assets/og/home.jpg"

technical:
  platform_preferences:
    cms: "Headless WordPress"
    framework: "Next.js"
    static_site_generator: "Gatsby"
  hosting:
    provider: "AWS"
    server_type: "EC2 t3.medium"
    os: "Amazon Linux 2"
    control_panel: "Plesk"
    cdn: "CloudFront"
  domains:
    primary: "paramparchaishop.com"
    subdomains:
      - "shop.paramparchaishop.com"
      - "blog.paramparchaishop.com"
  ssl:
    certificate_type: "EV SSL"
    provider: "DigiCert"
    renewal: "Automatic via ACM"
  performance:
    page_speed_goals:
      desktop: 95
      mobile: 85
    caching_strategy: "Edge caching, Redis object cache"
    lazy_loading: "Native lazy-loading for images and iframes"
  security:
    firewall: "AWS WAF"
    ssl_enforcement: true
    data_encryption: "AES‑256 at rest, TLS1.3 in transit"
    backup_policy:
      frequency: daily
      retention: 30 days
    penetration_testing: "Quarterly by SecureWave Labs"
  integrations:
    crm:
      system: "Salesforce"
      endpoint: "https://api.salesforce.com/v50.0/"
      auth: "OAuth2 JWT"
    marketing_automation:
      system: "HubSpot"
      endpoint: "https://api.hubapi.com"
      auth: "API Key"
    analytics:
      tool: "Google Analytics 4"
      tracking_id: "G-XXXXXXX"
    payment_gateway:
      system: "Stripe"
      api_keys:
        public: "pk_live_xxx"
        secret: "sk_live_xxx"
    third_party_apis:
      - name: "Google Maps"
        endpoint: "https://maps.googleapis.com/maps/api"
        auth: "API Key"
      - name: "Trustpilot Reviews"
        endpoint: "https://api.trustpilot.com/v1"
        auth: "OAuth2"
      - name: "Zendesk Chat"
        endpoint: "https://www.zendesk.com/api/v2"
        auth: "OAuth2"

forms_and_interactions:
  contact_form:
    fields:
      - name: name
        type: text
        required: true
      - name: email
        type: email
        required: true
      - name: message
        type: textarea
        required: true
    captcha: "reCAPTCHA v3"
    notification_email: "support@parampar.com"
  newsletter_signup:
    provider: "Mailchimp"
    fields:
      - name: email
      - name: first_name
  user_registration:
    fields:
      - name: email
      - name: password
      - name: confirm_password
    email_verification: true
  e_commerce:
    product_catalog:
      - id: 101
        name: "Classic Masala Chai"
        price: 12.99
        variants:
          - size: 100g
            sku: CM100
          - size: 250g
            sku: CM250
      - id: 102
        name: "Green Cardamom Chai"
        price: 14.99
        variants:
          - size: 100g
            sku: GC100
    cart_and_checkout: "One‑page checkout with guest purchase"
    order_notifications:
      - channel: email
      - channel: SMS

analytics_and_tracking:
  metrics_to_monitor:
    - conversion_rate
    - average_order_value
    - cart_abandonment_rate
    - page_load_time
  dashboards:
    tool: "Google Data Studio"
    custom_reports:
      - name: Weekly Sales Overview
      - name: Monthly Traffic Sources
  events_and_goals:
    - name: Add to Cart
      category: ecommerce
      action: click
      label: product-id
    - name: Subscription Signup
      category: engagement
      action: submit
      label: newsletter-form

legal_and_compliance:
  privacy_policy_url: "/privacy-policy"
  terms_and_conditions_url: "/terms-and-conditions"
  cookie_policy:
    banner_required: true
    categories:
      - name: functional
        description: "Essential site functionality"
      - name: analytics
        description: "Performance and usage tracking"
      - name: marketing
        description: "Personalized ads and offers"
  gdpr_requirements: true
  accessibility_statement_url: "/accessibility"

maintenance_and_support:
  post_launch_support:
    duration: "6 months"
    support_channels:
      - email
      - phone
      - live chat
  maintenance_tasks:
    - task: "Dependency updates"
      frequency: monthly
    - task: "Security patching"
      frequency: weekly
    - task: "Content audit"
      frequency: quarterly
  training:
    user_docs: "/docs/user-guide.pdf"
    admin_docs: "/docs/admin-guide.pdf"
    training_sessions: 3

budget_and_billing:
  estimated_budget:
    design: 18_000
    development: 45_000
    testing: 8_000
    deployment: 4_000
    marketing: 12_000
  payment_terms: "Net 30"
  invoicing_schedule:
    - milestone1: 25%
    - milestone2: 35%
    - launch: 40%
  contingencies: 10%

competitor_analysis:
  key_competitors:
    - name: Chai Point
      website: "https://www.chaipoint.com"
      strengths: "Extensive retail network, loyalty app"
      weaknesses: "Generic branding, limited content"
    - name: Vahdam Teas
      website: "https://www.vahdamteas.com"
      strengths: "Premium packaging, global delivery"
      weaknesses: "Higher price point"
  differentiators:
    - "Deep heritage storytelling"
    - "Subscription flexibility"
    - "Community events integration"

risks_and_assumptions:
  risks:
    - description: "Delay in API keys approval"
      mitigation: "Obtain test keys early, parallel workstreams"
    - description: "Scope creep on custom features"
      mitigation: "Strict change control, governance board"
  assumptions:
    - "Content assets delivered 4 weeks prior to design"
    - "Third‑party API stability SLA of 99.9%"

additional_notes:
  special_requirements: "Offline order entry module for B2B clients"
  legacy_systems: "ERP integration with SAP Business One via middleware"
  offline_materials: "Print‑ready brochures, packaging templates"