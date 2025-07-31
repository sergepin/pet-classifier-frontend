// src/app/page.tsx
import ClassifierComponent from './components/ClassifierComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Professional Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <div className="text-3xl">🤖</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">AI Pet Classifier</h1>
                <p className="text-sm text-gray-600">Powered by Machine Learning</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>API Online</span>
              </div>
              <div className="hidden md:block">|</div>
              <div className="hidden md:block">
                <span>v1.0.0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-6">
        <ClassifierComponent />
      </div>

      {/* Professional Footer */}
      <footer className="bg-white/60 backdrop-blur-sm border-t border-white/20 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Advanced AI-powered pet classification system that can accurately distinguish between cats and dogs using state-of-the-art machine learning algorithms.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• High accuracy classification</li>
                <li>• Real-time processing</li>
                <li>• Drag & drop support</li>
                <li>• Detailed confidence scores</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Technology</h3>
              <ul className="text-gray-600 text-sm space-y-2">
                <li>• Next.js 15</li>
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• Tailwind CSS</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              © 2025 AI Pet Classifier. Built with ❤️ using modern web technologies.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}