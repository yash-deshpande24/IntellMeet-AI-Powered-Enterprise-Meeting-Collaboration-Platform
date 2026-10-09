import React, { useState } from 'react';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { useNotification } from '../../context/NotificationContext';
import { mockAiBotResponses } from '../../data/mockData';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Copy,
  Check,
  RotateCcw,
  HelpCircle,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';

export const AiAssistantPage = () => {
  const { success } = useNotification();
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hello Alex! I am IntellBot, your Enterprise Meeting Intelligence Assistant. I have indexed all 124 recorded meetings, live transcripts, and decisions across your workspace. How can I assist you today?",
      time: 'Just now',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleSend = (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Simulate smart synthesis
    setTimeout(() => {
      let botResponse = '';
      if (query.toLowerCase().includes('decision')) {
        botResponse = mockAiBotResponses.defaultAnswers[0];
      } else if (query.toLowerCase().includes('david') || query.toLowerCase().includes('webrtc')) {
        botResponse = mockAiBotResponses.defaultAnswers[1];
      } else if (query.toLowerCase().includes('action') || query.toLowerCase().includes('item')) {
        botResponse = mockAiBotResponses.defaultAnswers[2];
      } else if (query.toLowerCase().includes('email') || query.toLowerCase().includes('follow')) {
        botResponse = "Here is a drafted executive follow-up email:\n\nSubject: Summary & Key Next Steps: Sprint 24 Architecture Alignment\n\nHi Team,\n\nThank you for today's productive discussion. Here are our approved alignments:\n- Dark mode token architecture approved for immediate release.\n- Low-GPU mobile CSS fallbacks being finalized by David.\n- Next milestone review set for next Tuesday at 10 AM.\n\nBest,\nAlex Vance";
      } else {
        botResponse = mockAiBotResponses.defaultAnswers[3];
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponse,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setLoading(false);
    }, 850);
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    success('Response copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearChat = () => {
    setMessages([messages[0]]);
    success('Chat history cleared');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400">
              <Bot className="w-5 h-5" />
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              IntellBot Meeting Intelligence Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Query across your workspace recordings, extract blockers, draft communications, and summarize discussions
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={RotateCcw}
          onClick={handleClearChat}
        >
          Reset Conversation
        </Button>
      </div>

      {/* Suggested Prompt Chips */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5" /> Suggested Inquiries:
        </span>
        <div className="flex flex-wrap gap-2">
          {mockAiBotResponses.suggestedQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              className="text-xs px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-dark-surface hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200/80 dark:border-dark-border transition-all text-left"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Frame */}
      <Card className="min-h-[480px] max-h-[600px] flex flex-col justify-between overflow-hidden shadow-xl border-slate-200/80 dark:border-dark-border">
        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-9 h-9 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-purple-600 text-white shadow-glow-purple'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-50 dark:bg-dark-surface text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-200/60 dark:border-dark-border'
                }`}
              >
                <div className="flex items-center justify-between pb-1 text-[10px] opacity-75">
                  <span className="font-bold">
                    {msg.sender === 'user' ? 'You' : 'IntellBot AI'}
                  </span>
                  <span>{msg.time}</span>
                </div>
                <div className="whitespace-pre-line">{msg.text}</div>

                {msg.sender === 'bot' && (
                  <div className="pt-2 mt-2 border-t border-slate-200/50 dark:border-slate-700/50 flex justify-end">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-[11px] font-semibold text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" /> Copied
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" /> Copy Answer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-2xl bg-purple-600 text-white flex items-center justify-center animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-dark-surface text-xs text-slate-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500 animate-spin" />
                <span>Searching meetings and analyzing speech transcripts...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-4 border-t border-slate-100 dark:border-dark-border bg-slate-50/50 dark:bg-dark-card">
          <div className="relative">
            <input
              type="text"
              placeholder="Ask IntellBot anything about past meetings, decisions, or action items..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full pl-4 pr-12 py-3 rounded-xl bg-white dark:bg-dark-surface border border-slate-200 dark:border-dark-border text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white transition-all shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};
