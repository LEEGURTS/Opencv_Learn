import React from "react";
import { CommunityFeed } from "@/components/CommunityFeed";
import Link from "next/link";

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">
                OpenCV 학습 사이트
              </h1>
            </div>
            <nav className="flex space-x-8">
              <Link
                href="/"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                학습
              </Link>
              <Link
                href="/community"
                className="text-blue-600 hover:text-blue-800 px-3 py-2 rounded-md text-sm font-medium"
              >
                커뮤니티
              </Link>
              <Link
                href="#"
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                프로젝트
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">커뮤니티</h2>
          <p className="text-gray-600">
            OpenCV 학습자들과 함께 지식을 공유하고 소통해보세요.
          </p>
        </div>

        <CommunityFeed />
      </main>
    </div>
  );
};

export default CommunityPage;
