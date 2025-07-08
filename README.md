
# 🎨 AI Image Generator Dashboard

A sleek and interactive AI-powered image generator built with React and the Hugging Face Stable Diffusion API. Users can enter text prompts to generate unique images, view history, and preview them in a responsive, modern UI.

---

## 🚀 Features

- 🧠 Generate AI images from text prompts
- 🖼️ Responsive image grid display
- 🔁 Prompt history saved in `localStorage`
- 🔍 Full-screen image preview modal with download and copy features
- 🌗 Light/Dark mode toggle
- 🔐 Mock authentication (Login / Signup)
- ⚠️ Global loading and error handling
- 💾 Zustand or Context for global state management
- 📱 Fully responsive and mobile-friendly layout
- ☁️ Deployed via Vercel / Netlify

---

## 🛠 Tech Stack

- **Frontend**: React + TypeScript + TailwindCSS
- **Routing**: React Router v6
- **State Management**: Zustand or Context API
- **AI API**: Hugging Face Inference API (Stable Diffusion)
- **Mock Mode**: Lorem Picsum or Unsplash (fallback for API limits)
- **Deployment**: Vercel / Netlify

---

## 📦 Folder Structure

```
src/
├── components/        # Reusable UI components (Modal, Navbar, etc.)
├── pages/             # Route-level pages (Dashboard, Login, etc.)
├── store/             # Zustand or context state files
├── utils/             # Helper files (auth, api, etc.)
├── App.tsx            # Route structure
└── main.tsx           # Entry point
```

---

## 🔧 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/yourusername/ai-image-generator.git
cd ai-image-generator
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Add Hugging Face API Key

Create a `.env` file in the root:

```env
VITE_HF_TOKEN=your_huggingface_api_key
```

> 🔑 Get your free key at: [https://huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)

### 4. Run the App

```bash
npm run dev
```

---

## 🧪 Mock Authentication

- Signup creates a dummy user in localStorage
- Login checks credentials and stores an auth flag
- Authenticated users can access `/dashboard`

---

## 🌐 Deployment

### Deploy to Vercel

```bash
npm run build
vercel
```

### Or Netlify

```bash
npm run build
# then drag the dist/ folder into Netlify or use `netlify deploy`
```

---

## 📸 Screenshots

| Prompt Input | Generated Grid | Preview Modal |
|--------------|----------------|----------------|
| ![prompt](screenshots/prompt.png) | ![grid](screenshots/grid.png) | ![modal](screenshots/modal.png) |

---

## 🤝 Credits

- Hugging Face for free AI inference API
- TailwindCSS for rapid UI styling
- Lorem Picsum for mock image generation

---

## 📄 License

MIT License. Feel free to use and modify!
