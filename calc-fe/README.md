# DrawCal 

DrawCal is an innovative platform that combines mathematical calculations with creative expression. It provides an interactive environment for equation solving and collaborative workspace.

## Features

- Real-time equation solving
- Beautiful visualizations
- User authentication and authorization
- Google OAuth integration
- Responsive design
- Modern UI with Mantine and Tailwind CSS

## Tech Stack

### Frontend (calc-fe)
- **Core Framework & Language**
  - React 18
  - TypeScript
  - Vite (Build Tool)

- **UI Components & Styling**
  - Mantine UI (Component Library)
  - Tailwind CSS (Utility-first CSS)
  - Class Variance Authority (Component Variants)
  - Tailwind Merge (Utility Class Merging)
  - Tailwind Animate (Animation Utilities)

- **Data Visualization & Math**
  - MathJax & MathJax-React (Mathematical Rendering)
  - GSAP (Animation Library)

- **State Management & Routing**
  - React Router DOM (Routing)
  - React Hooks (State Management)

- **API & Data Handling**
  - Axios (HTTP Client)
  - UUID (Unique ID Generation)

- **Development Tools**
  - ESLint (Code Linting)
  - TypeScript ESLint (TypeScript Linting)
  - PostCSS (CSS Processing)
  - Autoprefixer (CSS Compatibility)

### Canvas & Image Processing
- **Canvas Libraries**
  - HTML5 Canvas API - Core canvas rendering and manipulation
  - React Canvas Hooks - State management for canvas operations
  - React Sketch Canvas - Advanced drawing capabilities

- **Image Processing**
  - Canvas toDataURL - Convert canvas content to image data
  - FileReader API - Handle image file uploads
  - Image API - Load and manipulate images
  - Image Scaling - Automatic image resizing and positioning

- **Canvas Features**
  - Drawing Tools (Pen, Eraser, Text)
  - Image Upload & Manipulation
  - History Management (Undo/Redo)
  - Canvas State Saving
  - Export to PNG
  - Touch Support

### Backend (calc-be)
- **Core Framework & Language**
  - FastAPI (Web Framework)
  - Python 3.8+
  - Uvicorn (ASGI Server)

- **Database & Caching**
  - MongoDB (NoSQL Database)
  - PyMongo (MongoDB Driver)

- **AI & Machine Learning**
  - LangChain (LLM Framework)
  -Gemeni API (GPT Integration)
  - Scikit-learn (Machine Learning)
  - Pandas (Data Analysis)
  - NumPy (Numerical Computing)

- **API & Authentication**
  - FastAPI Security
  - JWT Authentication
  - OAuth2 Integration

- **Data Processing**
  - Pandas (Data Manipulation)
  - NumPy (Numerical Operations)
  - Scipy (Scientific Computing)

- **Development Tools**
  - Pytest (Testing)
  - Black (Code Formatting)
  - Flake8 (Code Linting)

### Infrastructure & DevOps
- **Version Control**
  - Git
  - GitHub

- **Development Environment**
  - Node.js (v18+)
  - Python (v3.8+)
  - Virtual Environments (venv)

- **API Documentation**
  - FastAPI Auto-Docs
  - Swagger UI
  - ReDoc

## Prerequisites

- Node.js (v18 or higher)
- Python (v3.8 or higher)
- MongoDB
- Gemeni API key

## Installation

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd calc-fe
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
VITE_API_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

### Backend Setup

1. Navigate to the backend directory:
```bash
cd calc-be
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
```bash
# On Windows
venv\Scripts\activate
# On Unix or MacOS
source venv/bin/activate
```

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Create a `.env` file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_uri
Gemeni_API_KEY=your_Gemeni_api_key

```

6. Start the development server:
```bash
uvicorn main:app --reload
```

## Project Structure

```
├── calc-fe/                 # Frontend application
│   ├── src/                # Source code
│   │   ├── components/     # React components
│   │   ├── screens/        # Screen components
│   │   ├── lib/           # Utility functions
│   │   └── App.tsx        # Main application component
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
│
└── calc-be/                # Backend application
    ├── apps/              # Application modules
    ├── auth/              # Authentication module
    ├── main.py           # Main application file
    └── requirements.txt  # Backend dependencies
```

## Development

### Frontend Development

- Run the development server:
```bash
npm run dev
```

- Build for production:
```bash
npm run build
```

- Lint the code:
```bash
npm run lint
```

### Backend Development

- Run the development server:
```bash
uvicorn main:app --reload
```

- Run tests:
```bash
pytest
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<!-- ## License

This project is licensed e- see the [LICENSE](LICENSE) file for details. -->

## Acknowledgments

- [Mantine](https://mantine.dev/) for the UI components
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [FastAPI](https://fastapi.tiangolo.com/) for the backend framework
- [MathJax](https://www.mathjax.org/) for mathematical rendering
- [Chart.js](https://www.chartjs.org/) for data visualization

## Support

For support, please open an issue in the GitHub repository or contact the development team.

## Authors

- Your Name - Initial work - [YourGitHub](https://github.com/pratikpatil00005) 




uvicorn main:app --reload --host 127.0.0.1 --port 8900
npm run dev