// components/Footer.js
export default function Footer() {
    return (
      <footer className="bg-gray-800 text-white py-3">
        <div className="container mx-auto text-center">
          <p className="text-sm">
            © {new Date().getFullYear()} Medicaltech. Wszystkie prawa zastrzeżone.
          </p>
          <div className="mt-2 space-x-4">
            <a href="#" className="text-gray-400 hover:text-white">
              Polityka Prywatności
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Warunki świadczenia usług
            </a>
            <a href="#" className="text-gray-400 hover:text-white">
              Skontaktuj się
            </a>
          </div>
        </div>
      </footer>
    );
  }
  