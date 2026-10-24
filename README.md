# Asli Dukan - AI Product Authenticity Verification

Asli Dukan is an AI-powered web application that helps users identify whether a product is Original or Fake. Users can upload product images from both frontend and backend perspectives, and our AI analyzes them to provide an instant authenticity verdict with detailed reasoning.

![Asli Dukan Banner](https://img.shields.io/badge/AI-Powered-blue) ![Status](https://img.shields.io/badge/Status-Live-green)

### 🚀 Live Demo
[Your Vercel Link Here]

### ✨ Features

- **Dual Image Upload:** Upload front and back side images of any product for accurate verification.
- **AI-Powered Analysis:** Uses Google Gemini Vision AI to detect originality.
- **Instant Verdict:** Clearly tells if the product is `Original` or `Fake / Counterfeit`.
- **Detailed Reasoning:** Provides 3-5 bullet points explaining *why* it is original or fake (logo, packaging, stitching, font, QR, etc.).
- **Confidence Score:** Shows AI confidence percentage.
- **Modern UI:** Clean, responsive, and fast interface built with React.
- **Secure:** API keys are secured and never exposed on GitHub.

### 🛠️ How It Works

1.  User selects a product category (e.g., Shoes, Watches, Perfume, Clothing).
2.  User uploads 2 images: Front view and Back/Box view.
3.  Frontend sends images to Gemini AI via secure API.
4.  Gemini analyzes packaging, branding, textures, logos, and printing quality.
5.  App returns result: **ORIGINAL ✅ or FAKE ❌** with full explanation.

### 💻 Tech Stack

- **Frontend:** React.js, Vite, Tailwind CSS, Axios
- **AI Model:** Google Gemini 1.5 Flash (Vision API)
- **Deployment:** Vercel
- **Version Control:** Git & GitHub

### 📦 Installation & Setup

1.  Clone the repository:
    ```bash
    git clone https://github.com/khlaidCodeStudent/Asli-Dukan-Product-Verification.git
    cd Asli-Dukan-Product-Verification

2. Install dependencies:
3. bash    npm install
4. Create a .env file in the root directory:
5. bash    VITE_GEMINI_API_KEY=your_gemini_api_key_here
6. Get your free API key from: https://aistudio.google.com/app/apikeys
7. Run the project locally:
8. bash
9. npm run dev
10. 🔒 Environment Variables
To keep your secrets safe, this project uses .env. Never push it to GitHub.
Create .env.example for reference:
VITE_GEMINI_API_KEY=PASTE_YOUR_KEY_HERE
🤝 Contributing
Contributions are welcome! Feel free to open an issue or submit a pull request.
📄 License
This project is licensed under the MIT License.
👨‍💻 Author
Khalid | Code Student
GitHub: @khlaidCodeStudent
