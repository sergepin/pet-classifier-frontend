"use client";

import React, { useState, useRef, ChangeEvent, DragEvent, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  probabilities: {
    cat: number;
    dog: number;
  };
}

const ClassifierComponent: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setPrediction(null);

    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          setPreviewUrl(result);
        } else {
          setError('Error al leer la imagen');
        }
      };
      reader.onerror = () => {
        setError('Error al leer la imagen');
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);
    setPrediction(null);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            setPreviewUrl(result);
          } else {
            setError('Error al leer la imagen');
          }
        };
        reader.onerror = () => {
          setError('Error al leer la imagen');
        };
        reader.readAsDataURL(file);
      } else {
        setError('Por favor, selecciona solo archivos de imagen.');
      }
    }
  };

  const handlePredict = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen primero.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('https://petclassifier.zeabur.app/api/predict/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Error HTTP: ${response.status} ${response.statusText}`);
      }

      const data: PredictionResult = await response.json();
      setPrediction(data);
    } catch (err: unknown) {
      setError(`Error al clasificar la imagen: ${err instanceof Error ? err.message : 'Error desconocido'}`);
    } finally {
      setLoading(false);
    }
  };

  const getAnimalIcon = (animal: string) => {
    return animal === 'cat' ? '🐱' : '🐕';
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-2xl mx-auto p-8 bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20"
    >
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-center mb-8"
      >
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm font-medium rounded-full mb-4"
        >
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          AI Powered
        </motion.div>
        
        <motion.h1 
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent mb-3 tracking-tight"
        >
          Pet Classifier
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-gray-700 text-lg font-medium mb-6"
        >
          Sube una imagen de tu mascota y descubre si es un gato o un perro
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex justify-center space-x-6 text-sm text-gray-500"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>99.8% Accuracy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Real-time</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Secure</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        ref={dropZoneRef}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${isDragOver 
            ? 'border-purple-500 bg-purple-50 scale-105' 
            : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
          }
        `}
      >
        <motion.div 
          animate={isDragOver ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <motion.div 
            animate={{ rotate: isDragOver ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="text-6xl mb-4"
          >
            📸
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-700">
            {isDragOver ? '¡Suelta la imagen aquí!' : 'Arrastra y suelta tu imagen aquí'}
          </h3>
          <p className="text-gray-500">o</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Seleccionar Imagen
          </motion.button>
          <p className="text-sm text-gray-400">Soporta JPG, PNG, GIF hasta 10MB</p>
        </motion.div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </motion.div>

      <AnimatePresence mode="wait">
        {previewUrl ? (
          <motion.div 
            key="preview"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <div className="relative group">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src={previewUrl}
                  alt="Vista previa"
                  width={320}
                  height={320}
                  className="max-w-sm max-h-80 rounded-xl shadow-2xl object-cover border-4 border-white"
                  onError={() => setError('Error al cargar la imagen')}
                  unoptimized
                />
              </motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-red-500 text-white p-2 rounded-full transition-all duration-300 hover:bg-red-600 z-10"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="placeholder"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex justify-center"
          >
            <div className="w-80 h-60 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <motion.div 
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-4xl mb-2"
                >
                  📷
                </motion.div>
                <p className="text-sm">Vista previa de la imagen</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedFile && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-6 flex justify-center space-x-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePredict}
              disabled={loading}
              className={`
                relative px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg
                ${loading
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white'
                }
              `}
            >
              {loading ? (
                <div className="flex items-center">
                  <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="rounded-full h-5 w-5 border-b-2 border-white mr-3"
                  ></motion.div>
                  Analizando imagen...
                </div>
              ) : (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Clasificar Mascota
                </div>
              )}
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedFile(null);
                setPreviewUrl(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-bold rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-300 shadow-lg"
            >
              Cambiar Imagen
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl text-center"
          >
            <div className="flex items-center justify-center">
              <motion.svg 
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
                className="w-6 h-6 text-red-500 mr-2" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </motion.svg>
              <span className="text-red-700 font-medium">{error}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {prediction && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="mt-8 p-6 bg-gradient-to-br from-green-50 to-blue-50 border border-green-200 rounded-2xl shadow-xl"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
                className="text-6xl mb-4"
              >
                {getAnimalIcon(prediction.predicted_class)}
              </motion.div>
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-2xl font-bold text-gray-800 mb-2"
              >
                ¡Es un {prediction.predicted_class === 'cat' ? 'Gato' : 'Perro'}!
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className={`text-xl font-semibold mb-6 ${getConfidenceColor(prediction.confidence)}`}
              >
                Confianza: {(prediction.confidence * 100).toFixed(1)}%
              </motion.p>
              
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>🐱 Gato</span>
                    <span>{(prediction.probabilities.cat * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.probabilities.cat * 100}%` }}
                      transition={{ duration: 1, delay: 0.8 }}
                      className="bg-gradient-to-r from-orange-400 to-orange-600 h-3 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="flex justify-between text-sm font-medium text-gray-700 mb-1">
                    <span>🐕 Perro</span>
                    <span>{(prediction.probabilities.dog * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prediction.probabilities.dog * 100}%` }}
                      transition={{ duration: 1, delay: 1.0 }}
                      className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full"
                    ></motion.div>
                  </div>
                </motion.div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setPrediction(null);
                  if (fileInputRef.current) fileInputRef.current.value = '';
                }}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-medium rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200"
              >
                Probar otra imagen
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!selectedFile && !prediction && !loading && !error && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="mt-8 text-center"
          >
            <motion.div 
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-6xl mb-4"
            >
              🤔
            </motion.div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">¿Qué mascota tienes?</h3>
            <p className="text-gray-500">Sube una foto y te diremos si es un gato o un perro</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Badge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-8 text-center"
      >
        <div className="inline-flex items-center space-x-8 bg-white/60 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-white/20">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">10K+</div>
            <div className="text-xs text-gray-500">Images Classified</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">99.8%</div>
            <div className="text-xs text-gray-500">Accuracy Rate</div>
          </div>
          <div className="w-px h-8 bg-gray-300"></div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-800">24/7</div>
            <div className="text-xs text-gray-500">Uptime</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ClassifierComponent;