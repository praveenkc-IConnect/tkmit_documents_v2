@import "tailwindcss";

/* Inter font import */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

@theme {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-display: 'Inter', system-ui, -apple-system, sans-serif;
}

/* Custom styles for professional smooth scrolling and transitions */
html {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  scroll-behavior: smooth;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Custom fading effects */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.4s ease-out forwards;
}
