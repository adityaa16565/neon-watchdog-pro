import { Shield, Brain, Activity, Users, FileWarning, BarChart3, Lock, ChevronRight, Eye, Zap, Target, Layers } from "lucide-react";
import { motion } from "framer-motion";

const LandingPage = ({ onGetStarted, onAdminLogin }: { onGetStarted: () => void; onAdminLogin: () => void }) => {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" as const },
    }),
  };

  const features = [
    { icon: Brain, title: "ML-Powered Analytics", desc: "Leverage machine learning models including Isolation Forest, K-Means clustering, and Random Forest for anomaly detection." },
    { icon: Activity, title: "Real-Time Monitoring", desc: "Monitor employee activities and behavioral patterns in real-time with comprehensive time-series analysis." },
    { icon: FileWarning, title: "Threat Detection", desc: "Automatically identify and classify insider threats using SVM-based sequential pattern mining." },
    { icon: Users, title: "User Management", desc: "Manage user roles, permissions, and access controls with a centralized admin dashboard." },
    { icon: BarChart3, title: "Behavioral Analytics", desc: "Track and analyze behavioral deviations with advanced statistical models and visual dashboards." },
    { icon: Lock, title: "Security Policies", desc: "Define and enforce organizational security policies with automated compliance monitoring." },
  ];

  const capabilities = [
    { title: "Analytics", desc: "Conduct real-time evaluation of potential insider risks across your organization without manual configuration." },
    { title: "Machine Learning", desc: "Deploy pre-trained ML playbooks that continuously learn and adapt to your organization's behavioral baselines." },
    { title: "Adaptive Protection", desc: "Dynamically adjust security controls based on evolving risk levels and behavioral patterns." },
    { title: "Case Management", desc: "Streamline investigation workflows with integrated case management and collaboration tools." },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Hero Section */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold tracking-[0.1em] uppercase mono-text">Neon Watchdog Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <a href="#overview" className="hover:text-foreground transition-colors">Overview</a>
            <a href="#capabilities" className="hover:text-foreground transition-colors">Capabilities</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it Works</a>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onAdminLogin}
              className="h-10 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Admin Login
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="max-w-7xl mx-auto relative grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={0}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold leading-tight tracking-tighter">
              Neon Watchdog<br />
              <span className="neon-text-cyan">Insider Risk</span><br />
              Management
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-lg leading-relaxed">
              Quickly identify and take action on insider risks with an integrated, ML-powered end-to-end approach.
            </p>
            <div className="mt-8 flex gap-4">
              <button
                onClick={onGetStarted}
                className="h-12 px-8 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                Get Started
                <ChevronRight className="w-4 h-4" />
              </button>
              <a
                href="#features"
                className="h-12 px-8 rounded-lg border border-border font-semibold hover:bg-muted/50 transition-colors flex items-center gap-2"
              >
                Learn More
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="rounded-2xl bg-card/80 backdrop-blur-sm border border-border p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-accent/60" />
                <div className="w-3 h-3 rounded-full bg-primary/60" />
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Target className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold">Threat Score Analysis</div>
                    <div className="text-[10px] text-muted-foreground">ML Model Confidence: 97.3%</div>
                  </div>
                  <span className="text-xs text-primary font-mono">ACTIVE</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Eye className="w-5 h-5 text-accent" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold">Behavioral Monitoring</div>
                    <div className="text-[10px] text-muted-foreground">248 Users Tracked</div>
                  </div>
                  <span className="text-xs text-accent font-mono">SCANNING</span>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Zap className="w-5 h-5 text-destructive" />
                  <div className="flex-1">
                    <div className="text-xs font-semibold">Anomaly Detection</div>
                    <div className="text-[10px] text-muted-foreground">3 Alerts Flagged</div>
                  </div>
                  <span className="text-xs text-destructive font-mono">ALERT</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Overview</p>
            <h2 className="text-3xl md:text-4xl font-bold">Take action on insider risks</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Quickly identify, investigate, and remediate insider risks using machine learning and behavioral analytics.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: "Built-in Privacy", desc: "Manage data risks with pseudonymization and strong access controls to protect sensitive information." },
              { icon: Layers, title: "Rich Insights", desc: "Leverage deep analytics and ML models to understand risk patterns and behavioral deviations." },
              { icon: Users, title: "Collaborate on Investigations", desc: "Work together across teams with integrated case management and investigation workflows." },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i + 1}
                className="p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section id="capabilities" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-12"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Capabilities</p>
              Key Features of Neon Watchdog Pro<br />Insider Risk Management
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="p-5 rounded-xl border border-border bg-card/60 hover:border-primary/40 transition-colors cursor-default"
              >
                <h3 className="font-semibold mb-2">{cap.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{cap.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">Features</p>
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive Protection Suite</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-xl border border-border bg-card/50 hover:bg-card/80 hover:border-primary/30 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={0}
            className="text-center mb-16"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-4">How It Works</p>
            <h2 className="text-3xl md:text-4xl font-bold">Enable Adaptive Protection</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Optimize insider risk protection automatically with our integrated ML defense pipeline.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {[
              { step: "1", label: "Monitor", sublabel: "Track user activity" },
              { step: "2", label: "Detect", sublabel: "ML anomaly analysis" },
              { step: "3", label: "Investigate", sublabel: "Review flagged cases" },
              { step: "4", label: "Respond", sublabel: "Enforce policies" },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="flex items-center gap-4"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 border-2 border-primary/30 flex items-center justify-center mb-2">
                    <span className="text-lg font-bold text-primary">{s.step}</span>
                  </div>
                  <span className="font-semibold text-sm">{s.label}</span>
                  <span className="text-xs text-muted-foreground">{s.sublabel}</span>
                </div>
                {i < 3 && (
                  <ChevronRight className="w-5 h-5 text-muted-foreground hidden md:block" />
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUp}
            custom={5}
            className="mt-16 text-center"
          >
            <button
              onClick={onGetStarted}
              className="h-14 px-10 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-bold tracking-wider mono-text uppercase">Neon Watchdog Pro</span>
          </div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mono-text">© 2026 NEON WATCHDOG. ML-Powered Security Pipeline.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
