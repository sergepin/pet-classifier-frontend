// src/app/components/ClassifierComponent.tsx
import React, { useState, useRef, ChangeEvent } from 'react';

// 1. Definir tipos para la respuesta de la API (TypeScript al rescate!)
interface PredictionResult {
  predicted_class: string;
  confidence: number;
  probabilities: {
    cat: number;
    dog: number;
  };
}

const ClassifierComponent: React.FC = () => {
  // 2. Estados de la aplicación
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // 3. Referencia al input de tipo 'file' para resetearlo si es necesario
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 4. Manejador de cambio de archivo
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null); // Limpiar errores previos
    setPrediction(null); // Limpiar predicciones previas

    const file = event.target.files?.[0]; // Obtener el primer archivo seleccionado
    if (file) {
      setSelectedFile(file); // Guardar el archivo en el estado
      setPreviewUrl(URL.createObjectURL(file)); // Crear URL para previsualizar la imagen
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // 5. Manejador del envío de la imagen a la API
  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }

    setLoading(true); // Indicar que la carga está en progreso
    setError(null); // Limpiar errores
    setPrediction(null); // Limpiar predicciones previas

    const formData = new FormData();
    formData.append('image', selectedFile); // 'image' debe coincidir con el nombre del campo esperado por tu API

    try {
      const response = await fetch('https://petclassifier.zeabur.app/api/predict/', {
        method: 'POST',
        body: formData,
        // No necesitas 'Content-Type': 'multipart/form-data' aquí,
        // el navegador lo establece automáticamente con FormData.
      });

      if (!response.ok) {
        // Manejar errores de respuesta HTTP (ej. 404, 500)
        const errorData = await response.json(); // Intentar leer el mensaje de error del backend
        throw new Error(errorData.detail || `Error HTTP: ${response.status} ${response.statusText}`);
      }

      const data: PredictionResult = await response.json(); // Parsear la respuesta JSON
      setPrediction(data); // Almacenar el resultado de la predicción
    } catch (err: any) {
      console.error('Error al clasificar la imagen:', err);
      setError(`Error al clasificar la imagen: ${err.message || 'Error desconocido'}`);
    } finally {
      setLoading(false); // Finalizar el estado de carga
      // Opcional: Resetear el input de archivo después de la predicción
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  // 6. Renderizado del componente
  return (
    <div>
      {/* Input de archivo */}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef} // Asignar la referencia
        onChange={handleFileChange} // Manejar cambio de archivo
        className="block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:text-sm file:font-semibold
                   file:bg-violet-50 file:text-violet-700
                   hover:file:bg-violet-100"
      />

      {/* Previsualización de la imagen */}
      {previewUrl && (
        <div className="mt-4 flex justify-center">
          <img
            src={previewUrl}
            alt="Vista previa de la imagen seleccionada"
            className="max-w-xs max-h-60 rounded-lg shadow-md border border-gray-200 object-contain"
          />
        </div>
      )}

      {/* Botón de Clasificar */}
      <button
        onClick={handlePredict}
        disabled={!selectedFile || loading} // Deshabilitar si no hay archivo o está cargando
        className={`mt-6 w-full font-bold py-2 px-4 rounded transition-colors duration-200
                   ${!selectedFile || loading
                      ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                   }`}
      >
        {loading ? 'Clasificando...' : 'Clasificar Imagen'}
      </button>

      {/* Área de Mensajes de Error */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {/* Área de Resultados de Predicción */}
      {prediction && (
        <div className="mt-6 text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-xl font-bold text-green-700 mb-2">
            Predicción: <span className="capitalize">{prediction.predicted_class}</span>
          </p>
          <p className="text-lg text-gray-800">
            Confianza: <span className="font-semibold">{(prediction.confidence * 100).toFixed(2)}%</span>
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-gray-600">
            <p>Gato: {(prediction.probabilities.cat * 100).toFixed(2)}%</p>
            <p>Perro: {(prediction.probabilities.dog * 100).toFixed(2)}%</p>
          </div>
        </div>
      )}

      {/* Mensaje inicial si no hay resultados ni carga */}
      {!selectedFile && !prediction && !loading && !error && (
        <div className="mt-6 text-center text-gray-600">
            <p className="text-lg font-semibold text-gray-700">Resultado:</p>
            <p className="text-xl text-blue-600">Selecciona una imagen para empezar</p>
        </div>
      )}
    </div>
  );
};

export default ClassifierComponent;