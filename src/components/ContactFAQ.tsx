import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Phone, MapPin, ChevronDown, ChevronUp, MessageCircle, X, Send, Sparkles, User } from 'lucide-react';
import { faqList } from '../data';

export default function ContactFAQ() {
  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Contact form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Order Issues');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  // Simulated live chat state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'bot'; text: string; time: string }>>([
    {
      sender: 'bot',
      text: 'Peace! I’m the Atelier Automated Concierge. Ask me anything about heavy cotton sizes, Portuguese factory ethics, or return steps.',
      time: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmittedMessage(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setMessage('');
      setSubmittedMessage(false);
    }, 5000);
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg = { sender: 'user' as const, text, time: timestamp };
    setChatMessages((prev) => [...prev, userMsg]);
    setChatInput('');
    setIsTyping(true);

    // AI bot parsing keywords
    setTimeout(() => {
      let botResponse = 'I appreciate the query! Our core customer experience specialists will reach back in 1-2 hours. You can also review our FAQ above for rapid details!';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('size') || cleanText.includes('fit') || cleanText.includes('heavyweight')) {
        botResponse = 'Our hoodies stand at 500GSM and shirts at 280GSM, structured for a boxy streetwear drape. We highly recommend buying your normal size for a gorgeous slouch, or sizing down once if you prefer standard retail contours.';
      } else if (cleanText.includes('shipping') || cleanText.includes('deliver') || cleanText.includes('free')) {
        botResponse = 'Complimentary worldwide carbon-neutral shipping triggers automatically on all orders over $150. Expedited national couriers usually average 2-4 business days to your front gate.';
      } else if (cleanText.includes('factory') || cleanText.includes('portugal') || cleanText.includes('sustainable')) {
        botResponse = 'Our factories lie nestled in Lisbon and Porto, certified fully by GOTS protocols. Workers earn standard living wages under clean, health-backed guidelines with waterless closed-loop dyeing platforms.';
      } else if (cleanText.includes('return') || cleanText.includes('refund') || cleanText.includes('exchange')) {
        botResponse = 'No stress, we support paperless return and exchange frameworks for up to 30 days. You can submit your return voucher immediately via the Account order log portal.';
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: 'bot' as const, text: botResponse, time: timestamp }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div id="contact-faq-section" className="mx-auto max-w-7xl px-4 py-12 grid grid-cols-1 gap-12 lg:grid-cols-2">
      {/* FAQ & Quick Chat Segment */}
      <div id="faq-section">
        <span className="text-xs font-mono tracking-widest text-stone-500 uppercase block mb-1">COMMON PROTOCOLS</span>
        <h2 className="text-3xl font-sans font-semibold text-stone-900 tracking-tight mb-8">Frequently Answered Queries</h2>

        <div id="faq-accordion" className="space-y-4">
          {faqList.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                id={`faq-item-${idx}`}
                className="border border-stone-200 bg-white rounded-xl overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  type="button"
                  id={`faq-btn-${idx}`}
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 text-left font-sans font-medium text-stone-900 hover:bg-stone-50 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-stone-500 shrink-0" /> : <ChevronDown className="h-4 w-4 text-stone-500 shrink-0" />}
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="p-5 pt-0 border-t border-stone-100 text-xs text-stone-600 leading-relaxed bg-stone-50/50">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {/* Live Chat Simulated Embed */}
        <div id="live-chat-card" className="mt-8 border border-stone-200 bg-stone-50 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
            <h4 className="text-sm font-sans font-semibold text-stone-900">Virtual Concierge Support is Active</h4>
          </div>
          <p className="text-xs text-stone-500 leading-relaxed mb-4">
            Need sizing feedback or custom order updates? Fire up our live automated concierge bubble. Get precise answers instantly.
          </p>
          <button
            type="button"
            id="open-live-chat-btn"
            onClick={() => setChatOpen(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-sans font-medium px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <MessageCircle className="h-3.5 w-3.5" />
            Launch Live Interactive Chat
          </button>
        </div>
      </div>

      {/* Contact Form Element */}
      <div id="contact-form-section" className="border border-stone-200 bg-white rounded-xl p-8 shadow-sm">
        <span className="text-xs font-mono tracking-widest text-stone-500 uppercase block mb-1">CONTACT PORTAL</span>
        <h2 className="text-3xl font-sans font-semibold text-stone-900 tracking-tight mb-3">Dispatch an Atelier Message</h2>
        <p className="text-xs text-stone-500 leading-relaxed mb-6">
          Our global digital support monitors messages around the calendar. Expect a clean reply in 12 hours or less.
        </p>

        <form onSubmit={handleContactSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-stone-500 uppercase mb-1">Your Full Name</label>
            <input
              type="text"
              id="contact-name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Liam Vance"
              className="w-full text-stone-900 placeholder:text-stone-400 border border-stone-200 bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none rounded-lg p-3 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-500 uppercase mb-1">E-Mail Address</label>
            <input
              type="email"
              id="contact-email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full text-stone-900 placeholder:text-stone-400 border border-stone-200 bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none rounded-lg p-3 text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-500 uppercase mb-1">Inquiry Category</label>
            <select
              id="contact-topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full text-stone-900 border border-stone-200 bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none rounded-lg p-3 text-sm transition-all"
            >
              <option value="Order Issues">Order Shipping & Tracking</option>
              <option value="Sizing Support">Detailed Fabric & Fit Queries</option>
              <option value="Collaborations">Brand Ambassadorship</option>
              <option value="Wholesale">Commercial Wholesale Inquiries</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-stone-500 uppercase mb-1">Detailed Message</label>
            <textarea
              id="contact-message"
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Share details of your request..."
              className="w-full text-stone-900 placeholder:text-stone-400 border border-stone-200 bg-stone-50 focus:bg-white focus:border-stone-900 focus:outline-none rounded-lg p-3 text-sm transition-all resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            id="contact-submit"
            className="w-full bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-medium text-sm py-3 px-4 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            Dispatch Direct Message
          </button>
        </form>

        <AnimatePresence>
          {submittedMessage && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-4 p-4 border border-green-150 bg-green-50 text-green-800 rounded-lg text-xs leading-relaxed"
            >
              <strong>Message queued successfully!</strong> Your inquiry has been processed and logged inside our CRM database. A specialized streetwear fit expert will follow up via email at <span className="underline">{email}</span>. Thank you!
            </motion.div>
          )}
        </AnimatePresence>

        {/* Address and telephone specs */}
        <div id="contact-info-grid" className="mt-8 pt-8 border-t border-stone-100 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-500">
          <div className="flex items-start gap-2.5">
            <Mail className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <span className="block font-mono text-stone-400 uppercase">TELEPHONE & MAIL</span>
              <span className="block text-stone-700 font-medium">+1 (800) 934-STREET</span>
              <span className="block text-stone-700">support@streetwear-atelier.com</span>
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <MapPin className="h-4 w-4 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <span className="block font-mono text-stone-400 uppercase">HEAD QUARTERS</span>
              <span className="block text-stone-700 font-medium">84 Creative Hub Wharf</span>
              <span className="block text-stone-700">Lisbon, 1200-109 Portugal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Bot Floating/Modal Widget (Activated via bottom right or card triggers) */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            id="concierge-chat-modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-6 right-6 z-50 w-80 sm:w-96 border border-stone-200 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[500px]"
          >
            {/* Header */}
            <div className="bg-stone-900 p-4 text-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
                <div>
                  <h4 className="text-sm font-sans font-bold leading-none">Automated Concierge</h4>
                  <span className="text-[10px] text-stone-400 font-mono">STREETWEAR ATELIER EXPERT</span>
                </div>
              </div>
              <button
                type="button"
                id="close-chat-widget-btn"
                onClick={() => setChatOpen(false)}
                className="text-stone-400 hover:text-stone-50 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Message Pane */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-stone-50 max-h-[380px]">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  id={`chat-msg-${idx}`}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl p-3 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-stone-900 text-stone-50'
                        : 'bg-white border border-stone-200 text-stone-700'
                    }`}
                  >
                    <p>{msg.text}</p>
                    <span className="block text-[9px] mt-1 text-right text-stone-400 font-mono">
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-xl p-3 text-xs text-stone-400 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce"></span>
                    <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce delay-150"></span>
                    <span className="h-1.5 w-1.5 bg-stone-400 rounded-full animate-bounce delay-300"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies Options (Makes chatbot highly interactive immediately) */}
            <div className="bg-white px-3 py-2 border-t border-stone-100 flex flex-wrap gap-1.5 shrink-0">
              <button
                type="button"
                id="quick-reply-size"
                onClick={() => handleSendMessage('Which size fits heavy hoodies?')}
                className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 px-2 py-1 rounded-sm"
              >
                Sizing Help
              </button>
              <button
                type="button"
                id="quick-reply-delivery"
                onClick={() => handleSendMessage('What is free shipping timeline?')}
                className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 px-2 py-1 rounded-sm"
              >
                Delivery Rules
              </button>
              <button
                type="button"
                id="quick-reply-ethics"
                onClick={() => handleSendMessage('Where are Lisbon factories?')}
                className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 px-2 py-1 rounded-sm"
              >
                Atelier Ethics
              </button>
              <button
                type="button"
                id="quick-reply-return"
                onClick={() => handleSendMessage('How do I return my parcel?')}
                className="text-[10px] font-mono bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-600 px-2 py-1 rounded-sm"
              >
                Return Voucher
              </button>
            </div>

            {/* Input form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(chatInput);
              }}
              className="bg-white border-t border-stone-200 p-3 flex gap-2 shrink-0"
            >
              <input
                type="text"
                id="chat-user-input"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask our AI Concierge..."
                className="flex-1 bg-stone-100 placeholder:text-stone-400 text-stone-800 text-xs border border-stone-200 rounded-lg px-3 py-2 focus:bg-white focus:border-stone-900 focus:outline-none transition-all"
              />
              <button
                type="submit"
                id="chat-send-btn"
                className="bg-stone-900 hover:bg-stone-800 text-stone-50 rounded-lg p-2 flex items-center justify-center transition-colors shadow-sm"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
