// src/app/page.tsx
import ClassifierComponent from './components/ClassifierComponent';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="min-h-screen flex items-center justify-center p-6">
        <ClassifierComponent />
      </div>
    </main>
  );
}