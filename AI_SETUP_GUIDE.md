# 🚀 AI Integration Setup Guide

Your StudyMate AI platform now supports intelligent document analysis and learning with **Google Gemini** or **Ollama (Local AI)**!

## Quick Start (Choose One)

### Option 1: Google Gemini (Recommended - Free & Easy) ☁️

**1. Get Your API Key:**
- Go to: https://makersuite.google.com/app/apikey
- Click "Create API Key" (free, no credit card needed)
- Copy the key

**2. Configure Your App:**
- Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

- Edit `.env.local` and add:
```
VITE_AI_PROVIDER=gemini
VITE_GEMINI_API_KEY=paste_your_key_here
```

**3. Restart your dev server:**
```bash
npm run dev
```

Done! ✅ Your AI features are now active.

---

### Option 2: Ollama (Local AI - No Internet) 🖥️

**1. Download & Install Ollama:**
- Go to: https://ollama.ai
- Download for your OS (Windows, Mac, Linux)
- Install and run Ollama

**2. Download a Model:**
Open terminal and run one of:
```bash
ollama run mistral          # Fast & good quality (recommended)
ollama run llama2          # Meta's model
ollama run neural-chat     # Fast response
```

The first run will download the model (~3-5 GB). This runs locally on your computer.

**3. Configure Your App:**
- Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

- Edit `.env.local` and add:
```
VITE_AI_PROVIDER=ollama
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral
```

**4. Restart your dev server:**
```bash
npm run dev
```

Done! ✅ Your AI features now run locally offline.

---

## Features Now Available

Once configured, these AI features work automatically:

### 🤖 **Chat Tutor**
- Ask questions about your uploaded materials
- Get context-aware explanations
- AI tutor provides step-by-step learning

### 📄 **Summarize**
- AI creates concise summaries of your documents
- Key points extracted automatically
- Great for quick review

### 🎓 **Quizzes**
- AI generates quiz questions from your materials
- Tests your understanding
- Multiple choice format

### 🔧 **Assignment Solver**
- Submit problems/assignments
- Get step-by-step solutions
- Learn the process

### 📊 **Progress Tracker**
- AI analyzes your learning journey
- Identifies weak areas
- Suggests improvements

---

## Configuration Comparison

| Feature | Gemini | Ollama |
|---------|--------|--------|
| Setup Time | 2 minutes | 10 minutes (first model download) |
| Internet Required | Yes | No |
| Privacy | Sent to Google | ✅ Local only |
| Speed | Very fast | Medium (depends on hardware) |
| Cost | Free | Free |
| Customization | Limited | High (choose any model) |
| Offline Usage | ❌ No | ✅ Yes |

---

## Testing Your Setup

1. **Upload some notes:**
   - Go to Dashboard → Upload Notes
   - Add a PDF, Word doc, or paste text

2. **Chat with Tutor:**
   - Go to Chat Tutor
   - Ask a question about your materials
   - Should get AI response (not a placeholder message)

3. **If you get an error:**
   - Check browser console (F12) for error messages
   - Make sure environment variables are set correctly
   - For Ollama: Make sure it's running (`ollama serve`)
   - For Gemini: Make sure API key is valid

---

## Switching Between Providers

You can have both configured! Just change `VITE_AI_PROVIDER`:

```bash
# Use Gemini
VITE_AI_PROVIDER=gemini

# Switch to Ollama
VITE_AI_PROVIDER=ollama
```

Restart the dev server after changing.

---

## Environment Variables Reference

```env
# Choose provider: 'gemini' or 'ollama'
VITE_AI_PROVIDER=gemini

# Google Gemini Settings
VITE_GEMINI_API_KEY=your_api_key_here

# Ollama Settings
VITE_OLLAMA_BASE_URL=http://localhost:11434
VITE_OLLAMA_MODEL=mistral
```

---

## Troubleshooting

### "AI provider is not configured"
- Check `.env.local` file exists
- Make sure `VITE_AI_PROVIDER` is set
- Restart dev server after changes

### Gemini says "Invalid API Key"
- Go to https://makersuite.google.com/app/apikey
- Create a new key
- Paste it exactly in `.env.local`
- No spaces before/after!

### Ollama won't connect
- Make sure Ollama is running: `ollama serve`
- Check URL is `http://localhost:11434`
- Try accessing in browser: http://localhost:11434/api/tags
- On Windows: Ollama runs in background after installation

### Slow responses
- Close other apps to free RAM
- Ollama works better with 8GB+ RAM
- Smaller models (mistral) are faster than larger ones

---

## Models for Ollama

You can replace `mistral` with any of these:

```bash
ollama run mistral          # 7B - Fast & smart (DEFAULT)
ollama run llama2          # 7B - Meta's classic model
ollama run neural-chat     # 7B - Optimized for chat
ollama run orca-mini       # 3B - Lightweight
ollama run dolphin-mixtral # 8x7B - Powerful (needs 16GB+ RAM)
```

Browse more at: https://ollama.ai/library

---

## Questions?

1. Check the error messages in browser console (F12)
2. Verify your API key / Ollama is running
3. Try the alternative provider to test
4. Check that files are actually uploaded before asking questions

Happy learning! 🎓
