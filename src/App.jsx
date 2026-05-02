import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import confetti from 'canvas-confetti';
import './index.css';

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'IN', name: 'India' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
];

const COUNTRY_SPECIFIC_CONTENT = {
  US: [
    { id: 1, title: "US Voter Registration", details: "In the US, you must be a citizen and 18 by Election Day. Most states require registration weeks in advance, though some offer same-day registration.", fact: "Did you know? You can register to vote at the DMV in most states thanks to the 'Motor Voter' act." },
    { id: 3, title: "Primary Elections", details: "Before the general election, states hold Primaries or Caucuses to choose party nominees for the President and other offices.", fact: "The 'Iowa Caucus' is traditionally the first major contest in the US presidential primary season." },
    { id: 6, title: "Electoral College", details: "The US President is not elected directly. Instead, voters choose 'electors' who then cast votes for the President.", fact: "A candidate can win the popular vote but lose the election due to the Electoral College system." }
  ],
  IN: [
    { id: 1, title: "EPIC Registration", details: "In India, the Election Commission issues an Elector's Photo Identity Card (EPIC). Registration can be done online via the NVSP portal.", fact: "India has the largest electorate in the world, with over 900 million eligible voters." },
    { id: 5, title: "VVPAT Counting", details: "India uses EVMs with Voter Verifiable Paper Audit Trail (VVPAT). This allows voters to verify that their vote was cast correctly.", fact: "The ink used to mark voters' fingers is 'Indelible Ink' which lasts for weeks." },
    { id: 7, title: "Model Code of Conduct", details: "The MCC comes into force immediately after the election schedule is announced, regulating the behavior of parties and candidates.", fact: "No new projects or subsidies can be announced by the government once MCC is in place." }
  ],
  UK: [
    { id: 1, title: "UK Electoral Register", details: "You must be on the electoral register to vote. In the UK, you can register to vote if you are 16 or over (but can't vote until 18).", fact: "The UK uses individual electoral registration rather than household registration." },
    { id: 4, title: "Polling Cards", details: "Before an election, you'll receive a poll card telling you when to vote and at which polling station.", fact: "You don't actually need your poll card to vote, as long as you're on the register." },
    { id: 6, title: "First Past the Post", details: "The UK uses the 'First Past the Post' system for general elections, where the candidate with the most votes in a constituency wins.", fact: "The leader of the party with the most seats in the House of Commons is usually invited by the Monarch to form a government." }
  ]
};

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'hi', name: 'Hindi' },
  { code: 'fr', name: 'Français' },
  { code: 'de', name: 'Deutsch' },
];

const TIMELINE_STAGES = [
  {
    id: 1,
    title: "Voter Registration",
    teaser: "The first step to participate.",
    image: "https://picsum.photos/seed/register/800/1200",
    details: "Voter registration is the process where eligible citizens enroll to vote. You must provide proof of age and citizenship. Once registered, you are added to the electoral roll.",
    fact: "Did you know? In many countries, you can register to vote when you get your driver's license.",
    points: ["Check eligibility requirements", "Fill out the application form", "Keep your voter ID safe"]
  },
  {
    id: 2,
    title: "Candidate Nomination",
    teaser: "People step forward to represent you.",
    image: "https://picsum.photos/seed/candidate/800/1200",
    details: "Political parties and independent individuals file their nomination papers. The election commission scrutinizes these to ensure they meet all legal requirements to run for office.",
    fact: "Did you know? Candidates often have to pay a deposit, which they lose if they don't get a minimum percentage of votes.",
    points: ["Filing nomination papers", "Scrutiny of candidates", "Withdrawal period"]
  },
  {
    id: 3,
    title: "Election Campaigning",
    teaser: "Candidates share their vision and promises.",
    image: "https://picsum.photos/seed/campaign/800/1200",
    details: "During this period, candidates organize rallies, debates, and distribute manifestos. It's a time for voters to understand what each candidate stands for before making a decision.",
    fact: "Did you know? Campaigning must officially stop a certain number of hours (often 48) before voting begins. This is called the 'election silence' period.",
    points: ["Read party manifestos", "Attend public debates", "Verify claims and promises"]
  },
  {
    id: 4,
    title: "Voting Day",
    teaser: "Your chance to make your voice heard.",
    image: "https://picsum.photos/seed/voting/800/1200",
    details: "Voters go to designated polling booths, verify their identity, and cast their vote secretly. Every vote has equal value, regardless of the voter's background.",
    fact: "Did you know? The secret ballot system is designed to prevent intimidation and bribery.",
    points: ["Bring valid ID", "Find your polling station", "Cast your vote secretly"]
  },
  {
    id: 5,
    title: "Vote Counting",
    teaser: "Every single vote is carefully tallied.",
    image: "https://picsum.photos/seed/counting/800/1200",
    details: "Under strict security and in the presence of candidate representatives, the votes (electronic or paper) are counted. The process is designed to be highly transparent.",
    fact: "Did you know? EVMs (Electronic Voting Machines) are standalone devices not connected to any network, making them resistant to remote hacking.",
    points: ["Strict security protocols", "Presence of observers", "Transparent tallying"]
  },
  {
    id: 6,
    title: "Results Declaration",
    teaser: "The winners are officially announced.",
    image: "https://picsum.photos/seed/results/800/1200",
    details: "The election commission officially declares the winners based on the count. The candidate with the highest number of votes in a constituency wins.",
    fact: "Did you know? If the margin is extremely close, candidates can legally request a recount.",
    points: ["Official announcement", "Issuing winning certificate", "Accepting the mandate"]
  },
  {
    id: 7,
    title: "Swearing In",
    teaser: "The new leaders take charge.",
    image: "https://picsum.photos/seed/swearingin/800/1200",
    details: "Elected representatives take an oath of office, swearing allegiance to the constitution. This marks the formal beginning of their term in public service.",
    fact: "Did you know? The inauguration date is often fixed by law to ensure a smooth transition of power.",
    points: ["Taking the oath", "Formation of government", "Beginning of official duties"]
  }
];

const STARTER_QUESTIONS = [
  "How do I register to vote?",
  "What happens on voting day?",
  "How are votes counted?",
  "What is the role of the Election Commission?",
  "What if there is a tie?"
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  
  // Onboarding & Settings
  const [hasOnboarded, setHasOnboarded] = useState(false); // Always show landing page first
  const [userSettings, setUserSettings] = useState(() => {
    const saved = localStorage.getItem('userSettings');
    return saved ? JSON.parse(saved) : { username: '', country: 'US', language: 'en' };
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const [completedStages, setCompletedStages] = useState(() => {
    const saved = localStorage.getItem('completedStages');
    return saved ? JSON.parse(saved) : [];
  });

  const [stages, setStages] = useState(TIMELINE_STAGES);

  useEffect(() => {
    // Update stages based on country
    const countryContent = COUNTRY_SPECIFIC_CONTENT[userSettings.country] || [];
    const updatedStages = TIMELINE_STAGES.map(stage => {
      const specific = countryContent.find(c => c.id === stage.id);
      return specific ? { ...stage, ...specific } : stage;
    });
    setStages(updatedStages);
  }, [userSettings.country]);
  
  useEffect(() => {
    localStorage.setItem('completedStages', JSON.stringify(completedStages));
  }, [completedStages]);
  // Onboarding state
  const [currentIndex, setCurrentIndex] = useState(0);

  // Chat state
  const [chatHistory, setChatHistory] = useState([
    { role: 'assistant', content: `Hello ${userSettings.username || 'there'}! I am ElectionIQ, your civic education assistant. Ask me anything about how elections work in ${COUNTRIES.find(c => c.code === userSettings.country)?.name || 'your country'}!` }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatError, setChatError] = useState('');
  const chatEndRef = useRef(null);

  // Quiz state
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [quizError, setQuizError] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory, isTyping]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleStage = (id) => {
    const newStages = completedStages.includes(id) 
      ? completedStages.filter(s => s !== id) 
      : [...completedStages, id];
      
    setCompletedStages(newStages);
    
    if (newStages.length === TIMELINE_STAGES.length) {
      fireConfetti();
    }
  };

  const isTimelineComplete = completedStages.length === TIMELINE_STAGES.length;

  const getProgressStep = () => {
    if (!isTimelineComplete) return 1;
    if (quizData && currentQuestionIdx >= quizData.length) return 3;
    return 2;
  };
  const activeStep = getProgressStep();

  // Helper for Confetti
  const fireConfetti = (isPerfect = false) => {
    const duration = isPerfect ? 4000 : 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const interval = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  };

  const randomInRange = (min, max) => Math.random() * (max - min) + min;

  // Coverflow Navigation
  const nextSlide = () => setCurrentIndex(prev => Math.min(prev + 1, TIMELINE_STAGES.length - 1));
  const prevSlide = () => setCurrentIndex(prev => Math.max(prev - 1, 0));

  // ----- Chat Logic -----
  const sendChatMessage = async (msg) => {
    if (!msg.trim()) return;
    
    const newHistory = [...chatHistory, { role: 'user', content: msg }];
    setChatHistory(newHistory);
    setChatInput('');
    setIsTyping(true);
    setChatError('');

    try {
      let apiMessages = newHistory.filter(m => m.role === 'user' || (m.role === 'assistant' && m !== newHistory[0]));
      
      if (apiMessages.length > 0 && apiMessages[0].role === 'assistant') {
         apiMessages.shift();
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      setChatHistory([...newHistory, { role: 'assistant', content: data.content[0].text }]);
    } catch (err) {
      console.warn('API Error, using mock response for local dev:', err);
      // Mock response for local development if API is missing
      const mockResponses = [
        "That's a great question about elections! In most democracies, the process is designed to be transparent and fair.",
        "Voter registration is usually the first step. You can often do it online or at a local government office.",
        "On voting day, make sure to bring a valid ID and check your polling station location in advance.",
        "The Election Commission ensures that every vote is counted accurately and securely."
      ];
      const randomMsg = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      
      setTimeout(() => {
        setChatHistory([...newHistory, { role: 'assistant', content: randomMsg + " (Local Demo Mode)" }]);
        setIsTyping(false);
      }, 1000);
      return; 
    } finally {
      setIsTyping(false);
    }
  };

  // ----- Quiz Logic -----
  const generateQuiz = async () => {
    setQuizLoading(true);
    setQuizError('');
    setQuizData(null);
    setQuizScore(0);
    setCurrentQuestionIdx(0);
    setQuizFeedback('');
    setSelectedOption(null);

    try {
      const res = await fetch('/api/quiz', { method: 'POST' });
      if (!res.ok) throw new Error('API Error');
      const data = await res.json();
      
      if (Array.isArray(data) && data.length === 5) {
        setQuizData(data);
      } else {
        throw new Error('Invalid quiz format');
      }
    } catch (err) {
      console.warn('API Error, using fallback quiz for local dev:', err);
      // Fallback quiz data for local development
      const fallbackQuiz = [
        {
          question: "What is the first step in participating in an election?",
          options: ["A. Voting", "B. Voter Registration", "C. Campaigning", "D. Counting"],
          correct: "B"
        },
        {
          question: "What is 'election silence'?",
          options: ["A. When voters don't speak", "B. When campaigning stops before voting", "C. When counting is quiet", "D. A type of voting booth"],
          correct: "B"
        },
        {
          question: "Are EVMs connected to the internet?",
          options: ["A. Yes, always", "B. No, they are standalone", "C. Only during counting", "D. Only for software updates"],
          correct: "B"
        },
        {
          question: "What happens if an election margin is extremely close?",
          options: ["A. A coin toss", "B. A recount can be requested", "C. The election is cancelled", "D. Both candidates win"],
          correct: "B"
        },
        {
          question: "What marks the formal beginning of a leader's term?",
          options: ["A. Results declaration", "B. Swearing in ceremony", "C. Voting day", "D. Nomination filing"],
          correct: "B"
        }
      ];
      setQuizData(fallbackQuiz);
    } finally {
      setQuizLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;

    const currentQ = quizData[currentQuestionIdx];
    const isCorrect = selectedOption.startsWith(currentQ.correct);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }

    if (currentQuestionIdx < quizData.length - 1) {
      setCurrentQuestionIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      setCurrentQuestionIdx(prev => prev + 1);
      
      const finalScore = quizScore + (isCorrect ? 1 : 0);
      
      if (finalScore === 5) {
        fireConfetti(true);
      } else if (finalScore >= 3) {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      }
      
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ score: finalScore })
        });
        if (res.ok) {
          const data = await res.json();
          setQuizFeedback(data.feedback);
        }
      } catch (e) {
        console.error("Failed to fetch feedback");
      }
    }
  };

  const handleOnboardSubmit = (e) => {
    e.preventDefault();
    if (userSettings.username.trim()) {
      setHasOnboarded(true);
      localStorage.setItem('hasOnboarded', 'true');
      localStorage.setItem('userSettings', JSON.stringify(userSettings));
      
      // Update first chat message with name
      setChatHistory([
        { role: 'assistant', content: `Hello ${userSettings.username}! I am ElectionIQ, your civic education assistant for ${COUNTRIES.find(c => c.code === userSettings.country)?.name}. How can I help you today?` }
      ]);
    }
  };
  return (
    <AnimatePresence mode="wait">
      {!hasOnboarded ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          style={{ width: '100%', height: '100%' }}
        >
          <LandingPage 
            userSettings={userSettings} 
            setUserSettings={setUserSettings} 
            onSubmit={handleOnboardSubmit}
            theme={theme}
            toggleTheme={toggleTheme}
          />
        </motion.div>
      ) : (
        <motion.div 
          key="app"
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, type: "spring", damping: 25 }}
          className="app-wrapper"
        >
      <header className="main-header">
        <motion.nav 
          className="navbar"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <motion.div 
            className="brand"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            ElectionIQ
          </motion.div>
          <motion.button 
            className="theme-toggle" 
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </motion.button>
        </motion.nav>

        <motion.div 
          className="progress-container"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          <div className="progress-steps">
            <motion.span whileHover={{ scale: 1.1 }} className={`step ${activeStep >= 1 ? 'active' : ''}`}>Learn</motion.span> → 
            <motion.span whileHover={{ scale: 1.1 }} className={`step ${activeStep >= 2 ? 'active' : ''}`}>Ask</motion.span> → 
            <motion.span whileHover={{ scale: 1.1 }} className={`step ${activeStep >= 3 ? 'active' : ''}`}>Test Yourself</motion.span>
          </div>
          <div className="progress-bar-bg">
            <motion.div 
              className="progress-bar-fill" 
              initial={{ width: 0 }}
              animate={{ width: `${(completedStages.length / 7) * 33 + (activeStep >= 2 ? 33 : 0) + (activeStep === 3 ? 34 : 0)}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            />
          </div>
        </motion.div>
      </header>

      <main>
        {/* Section 1: Coverflow Timeline */}
        <section className="section">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.4 }}
            style={{ textAlign: 'center', marginBottom: '1rem' }}
          >
            <h2>Election Timeline Guide</h2>
          </motion.div>
          
          <div className="timeline-app">
            <div className="app__bg">
              <AnimatePresence initial={false}>
                <motion.div 
                  key={`bg-${stages[currentIndex].id}`}
                  className="app__bg__image current--image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <img src={stages[currentIndex].image} alt="" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="cardList">
              <button 
                className="cardList__btn btn btn--left" 
                onClick={prevSlide} 
                disabled={currentIndex === 0}
              >
                <div className="icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                </div>
              </button>

              <div className="cards__wrapper">
                <AnimatePresence initial={false}>
                  {stages.map((stage, i) => {
                    const offset = i - currentIndex;
                    if (Math.abs(offset) > 2) return null;

                    return (
                      <InteractiveCard 
                        key={`card-${stage.id}`} 
                        stage={stage} 
                        offset={offset}
                        isCurrent={i === currentIndex} 
                        onClick={() => i !== currentIndex && setCurrentIndex(i)}
                        onNext={() => currentIndex < stages.length - 1 && setCurrentIndex(currentIndex + 1)}
                        onPrev={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                      />
                    );
                  })}
                </AnimatePresence>
              </div>

              <button 
                className="cardList__btn btn btn--right" 
                onClick={nextSlide} 
                disabled={currentIndex === stages.length - 1}
              >
                <div className="icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </div>
              </button>
            </div>

            <div className="infoList">
              <div className="info__wrapper">
                {stages.map((stage, i) => {
                  let className = "info";
                  if (i === currentIndex) className += " current--info";
                  else if (i === currentIndex - 1) className += " previous--info";
                  else if (i === currentIndex + 1) className += " next--info";
                  else if (i < currentIndex - 1) className += " hidden--info--left";
                  else if (i > currentIndex + 1) className += " hidden--info--right";

                  const isDone = completedStages.includes(stage.id);

                  return (
                    <div key={`info-${stage.id}`} className={className}>
                      <h1 className="text name">{stage.id}. {stage.title}</h1>
                      <h4 className="text location">{stage.teaser}</h4>
                      <div className="text description">
                        <p style={{ marginBottom: '1.2rem' }}>{stage.details}</p>
                        <div className="fact-box">
                          <span className="fact-icon">💡</span>
                          <span>{stage.fact}</span>
                        </div>
                        
                        <div className="stage-actions">
                          <motion.button 
                            className={`mark-done-btn ${isDone ? 'completed' : ''}`}
                            onClick={() => toggleStage(stage.id)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <span className="btn-check">
                              {isDone ? '✓' : ''}
                            </span>
                            {isDone ? 'Completed' : 'Mark as Done'}
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          <AnimatePresence>
            {isTimelineComplete && (
              <motion.div 
                initial={{ opacity: 0, y: 50, scale: 0.5 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="success-banner"
              >
                <motion.div
                  animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                  transition={{ duration: 1, delay: 0.5 }}
                  style={{ display: 'inline-block', fontSize: '1.5rem', marginRight: '10px' }}
                >
                  🎉
                </motion.div>
                <strong>Great job!</strong> You've completed the guide! Now test what you know or ask the assistant below.
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Section 2: Chat Assistant */}
        <section className="section">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            AI Chat Assistant
          </motion.h2>
          <motion.div 
            className="chat-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <div className="chat-history">
              <AnimatePresence initial={false}>
                {chatHistory.map((msg, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20, scale: 0.8, originX: msg.role === 'user' ? 1 : 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className={`chat-bubble ${msg.role === 'user' ? 'user' : 'ai'}`}
                  >
                    <div>{msg.content}</div>
                    <div className="timestamp">{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.8, originX: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
                    className="chat-bubble ai typing-indicator-bubble"
                  >
                    <div className="typing-indicator">
                      <span></span><span></span><span></span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              {chatError && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="error-text" style={{ textAlign: 'center' }}>
                  {chatError}
                </motion.div>
              )}
              <div ref={chatEndRef} />
            </div>
            
            <div className="chat-input-area">
              <div className="starter-chips">
                {STARTER_QUESTIONS.map((q, i) => (
                  <motion.button 
                    key={i} 
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="chip" 
                    onClick={() => sendChatMessage(q)}
                  >
                    {q}
                  </motion.button>
                ))}
              </div>
              <form 
                className="input-form"
                onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
              >
                <input 
                  type="text" 
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask a question about elections..."
                  disabled={isTyping}
                />
                <motion.button 
                  whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(26,115,232,0.4)" }}
                  whileTap={{ scale: 0.95 }}
                  type="submit" 
                  className="btn btn-primary" 
                  disabled={isTyping || !chatInput.trim()}
                >
                  Send
                </motion.button>
              </form>
            </div>
          </motion.div>
        </section>

        {/* Section 3: Quiz */}
        <section className="section quiz-section">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            Quiz
          </motion.h2>
          
          <AnimatePresence>
            {!isTimelineComplete && (
              <motion.div 
                className="locked-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
                transition={{ duration: 0.5 }}
              >
                <motion.div 
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, repeatType: "reverse" }}
                  style={{ fontSize: '4rem', marginBottom: '1rem', textShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                >
                  🔒
                </motion.div>
                <h3 style={{ textShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>Complete the timeline above to unlock your quiz.</h3>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div 
            className="quiz-container"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", bounce: 0.3 }}
          >
            <AnimatePresence mode="wait">
              {!quizData && !quizLoading && (
                <motion.div 
                  key="start"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{ textAlign: 'center' }}
                >
                  <p style={{ marginBottom: '1rem', fontSize: '1.2rem' }}>Ready to test your knowledge?</p>
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(26,115,232,0.4)" }}
                    whileTap={{ scale: 0.95 }}
                    className={`btn btn-primary ${isTimelineComplete ? 'pulse-anim' : ''}`} 
                    onClick={generateQuiz}
                    disabled={!isTimelineComplete}
                    style={{ padding: '1rem 2rem', fontSize: '1.2rem', borderRadius: '30px' }}
                  >
                    Generate My Quiz
                  </motion.button>
                  {quizError && <p className="error-text">{quizError}</p>}
                </motion.div>
              )}

              {quizLoading && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ textAlign: 'center', opacity: 0.7 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    style={{ fontSize: '3rem', marginBottom: '1rem' }}
                  >
                    ⏳
                  </motion.div>
                  <motion.h3
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    Generating your customized quiz...
                  </motion.h3>
                </motion.div>
              )}

              {quizData && currentQuestionIdx < quizData.length && (
                <motion.div
                  key={`q-${currentQuestionIdx}`}
                  initial={{ opacity: 0, x: 100, rotateY: 45 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  exit={{ opacity: 0, x: -100, rotateY: -45 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                >
                  <motion.h3 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                    Question {currentQuestionIdx + 1} of 5
                  </motion.h3>
                  
                  <motion.div 
                    initial={{ scaleX: 0 }} 
                    animate={{ scaleX: 1 }} 
                    style={{ height: '4px', background: 'var(--primary)', originX: 0, margin: '1rem 0' }}
                  />

                  <p style={{ margin: '1rem 0', fontSize: '1.3rem', fontWeight: 500 }}>{quizData[currentQuestionIdx].question}</p>
                  
                  <motion.div variants={containerVariants} initial="hidden" animate="show">
                    {quizData[currentQuestionIdx].options.map((opt, i) => (
                      <motion.button 
                        key={i} 
                        variants={itemVariants}
                        whileHover={{ scale: 1.02, x: 10, boxShadow: "0px 4px 10px rgba(0,0,0,0.1)" }}
                        whileTap={{ scale: 0.98 }}
                        className={`quiz-option ${selectedOption === opt ? 'selected' : ''}`}
                        onClick={() => setSelectedOption(opt)}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </motion.div>
                  
                  <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="btn btn-primary" 
                      onClick={handleNextQuestion} 
                      disabled={!selectedOption}
                    >
                      {currentQuestionIdx === 4 ? 'Finish Quiz' : 'Next Question'}
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {quizData && currentQuestionIdx >= quizData.length && (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  style={{ textAlign: 'center' }}
                >
                  <h2>Quiz Complete!</h2>
                  <motion.div 
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className={`score-display ${quizScore <= 2 ? 'score-red' : quizScore <= 4 ? 'score-yellow' : 'score-green'}`}
                    style={{ fontSize: '4rem', textShadow: "0 5px 15px rgba(0,0,0,0.2)" }}
                  >
                    {quizScore} / 5
                  </motion.div>
                  
                  <AnimatePresence>
                    {quizFeedback ? (
                      <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ margin: '1.5rem 0', fontStyle: 'italic', fontSize: '1.2rem', lineHeight: '1.6' }}
                      >
                        "{quizFeedback}"
                      </motion.p>
                    ) : (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{ margin: '1rem 0', opacity: 0.7 }}
                      >
                        <span className="typing-indicator" style={{ display: 'inline-flex' }}>
                          <span></span><span></span><span></span>
                        </span> Generating your feedback...
                      </motion.p>
                    )}
                  </AnimatePresence>

                  <motion.button 
                    whileHover={{ scale: 1.1, boxShadow: "0px 10px 20px rgba(26,115,232,0.3)" }}
                    whileTap={{ scale: 0.9 }}
                    className="btn btn-primary" 
                    style={{ marginTop: '2rem', padding: '1rem 2rem', borderRadius: '30px', fontSize: '1.1rem' }} 
                    onClick={generateQuiz}
                  >
                    Retake Quiz ↻
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>

      </main>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Landing Page Component
function LandingPage({ userSettings, setUserSettings, onSubmit, theme, toggleTheme }) {
  return (
    <div className="landing-page">
      <div className="landing-bg"></div>
      <header>
        <motion.nav 
        className="navbar landing-nav"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="brand">ElectionIQ</div>
        <button className="theme-toggle" onClick={toggleTheme}>
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>
      </motion.nav>
      </header>

      <main className="landing-content">
        <motion.div 
          className="onboarding-card"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", bounce: 0.3 }}
        >
          <div className="onboarding-header">
            <h1>Global Elections Guide</h1>
            <p>Empowering voters worldwide through AI-driven education.</p>
          </div>

          <form onSubmit={onSubmit} className="onboarding-form">
            <div className="form-group">
              <label>What's your name?</label>
              <input 
                type="text" 
                placeholder="Enter username"
                value={userSettings.username}
                onChange={e => setUserSettings({...userSettings, username: e.target.value})}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Country</label>
                <select 
                  value={userSettings.country}
                  onChange={e => setUserSettings({...userSettings, country: e.target.value})}
                >
                  {COUNTRIES.map(c => (
                    <option key={c.code} value={c.code}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Language</label>
                <select 
                  value={userSettings.language}
                  onChange={e => setUserSettings({...userSettings, language: e.target.value})}
                >
                  {LANGUAGES.map(l => (
                    <option key={l.code} value={l.code}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <motion.button 
              type="submit" 
              className="btn btn-primary onboard-submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Started
            </motion.button>
          </form>
        </motion.div>
      </main>

      <motion.footer 
        className="landing-footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <span>Supported in 100+ nations</span>
        <div className="dots">
          <span></span><span></span><span></span>
        </div>
      </motion.footer>
    </div>
  );
}

// Interactive Card Component for the Coverflow slider with high-end motion and drag
function InteractiveCard({ stage, offset, isCurrent, onClick, onNext, onPrev }) {
  const xValue = useMotionValue(0);
  const yValue = useMotionValue(0);

  // Tilt transforms
  const rotateX = useTransform(yValue, [-100, 100], [15, -15]);
  const rotateY = useTransform(xValue, [-100, 100], [-15, 15]);

  // Handle tilt
  function handleMouse(event) {
    if (!isCurrent) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    xValue.set(event.clientX - centerX);
    yValue.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    xValue.set(0);
    yValue.set(0);
  }

  // Position and Scale variants
  const variants = {
    current: {
      x: 0,
      scale: 1.2,
      zIndex: 10,
      opacity: 1,
      filter: "brightness(1) blur(0px)",
      rotateY: 0
    },
    prev: {
      x: "-110%",
      scale: 0.8,
      zIndex: 5,
      opacity: 0.5,
      filter: "brightness(0.6) blur(2px)",
      rotateY: 30
    },
    next: {
      x: "110%",
      scale: 0.8,
      zIndex: 5,
      opacity: 0.5,
      filter: "brightness(0.6) blur(2px)",
      rotateY: -30
    },
    prev2: {
      x: "-200%",
      scale: 0.6,
      zIndex: 2,
      opacity: 0.2,
      filter: "brightness(0.4) blur(4px)",
      rotateY: 45
    },
    next2: {
      x: "200%",
      scale: 0.6,
      zIndex: 2,
      opacity: 0.2,
      filter: "brightness(0.4) blur(4px)",
      rotateY: -45
    },
    hidden: {
      x: offset > 0 ? "300%" : "-300%",
      scale: 0.4,
      zIndex: 0,
      opacity: 0,
    }
  };

  const getVariant = () => {
    if (offset === 0) return "current";
    if (offset === -1) return "prev";
    if (offset === 1) return "next";
    if (offset === -2) return "prev2";
    if (offset === 2) return "next2";
    return "hidden";
  };

  const currentVariant = getVariant();

  return (
    <motion.div 
      className={`card ${isCurrent ? 'current--card' : ''}`}
      layout
      variants={variants}
      initial="hidden"
      animate={currentVariant}
      exit="hidden"
      drag={isCurrent ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => {
        if (Math.abs(info.offset.x) > 100) {
          if (info.offset.x > 0) onPrev();
          else onNext();
        }
      }}
      transition={{ 
        type: "spring", 
        stiffness: 400, 
        damping: 40,
        opacity: { duration: 0.2 }
      }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        rotateX: isCurrent ? rotateX : 0,
        rotateY: isCurrent ? (offset !== 0 ? variants[currentVariant].rotateY : rotateY) : (variants[currentVariant].rotateY || 0),
        transformStyle: "preserve-3d",
        cursor: isCurrent ? "grab" : "pointer",
        position: "absolute",
        touchAction: "none"
      }}
    >
      <motion.div 
        className="card__image"
        style={{ transform: "translateZ(50px)" }}
        whileHover={isCurrent ? { scale: 1.05 } : {}}
        whileTap={isCurrent ? { cursor: "grabbing" } : {}}
      >
        <img src={stage.image} alt={stage.title} />
      </motion.div>
    </motion.div>
  );
}

export default App;
