import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
      <div className="text-center">
        <h1 className="text-6xl font-extrabold mb-4 text-blue-600 dark:text-blue-400">404</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">Oops! Página não encontrada</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline dark:text-blue-300 dark:hover:text-blue-500">
          Retornar à Página Inicial
        </a>
      </div>
    </div>
  );
};

export default NotFound;