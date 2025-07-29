// src/app/page.tsx
import ClassifierComponent from './components/ClassifierComponent'; // Importa el componente

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Clasificador de Perros y Gatos
      </h1>

      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <p className="text-center text-gray-600 mb-6">
          Sube una imagen de un perro o un gato para clasificarla.
        </p>
        {/* Aquí usamos nuestro componente de clasificación */}
        <ClassifierComponent />
      </div>
    </main>
  );
}