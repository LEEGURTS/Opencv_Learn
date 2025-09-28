"use client";

import React, { useState } from "react";
import { CommunityPost } from "./CommunityPost";

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  likes: number;
  comments: number;
  tags: string[];
}

const mockPosts: Post[] = [
  {
    id: "1",
    title: "OpenCV로 얼굴 인식 구현하기",
    content: `안녕하세요! OpenCV를 사용해서 얼굴 인식을 구현해봤습니다.

코드는 다음과 같습니다:
\`\`\`python
import cv2
import numpy as np

# 얼굴 인식기 로드
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# 웹캠에서 비디오 캡처
cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    # 얼굴 검출
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    # 검출된 얼굴에 사각형 그리기
    for (x, y, w, h) in faces:
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
    
    cv2.imshow('Face Detection', frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
\`\`\`

결과가 정말 좋네요! 혹시 더 개선할 방법이 있을까요?`,
    author: "김학습",
    createdAt: "2024-01-15 14:30",
    likes: 12,
    comments: 5,
    tags: ["OpenCV", "얼굴인식", "Python"],
  },
  {
    id: "2",
    title: "이미지 필터링 기법 비교",
    content: `다양한 이미지 필터링 기법을 비교해봤습니다.

1. 가우시안 블러
2. 미디언 필터
3. 바이래터럴 필터

각각의 장단점과 사용 사례를 정리해봤는데, 어떤 필터가 가장 효과적일까요?`,
    author: "박컴퓨터",
    createdAt: "2024-01-14 09:15",
    likes: 8,
    comments: 3,
    tags: ["필터링", "이미지처리", "비교분석"],
  },
  {
    id: "3",
    title: "OpenCV 프로젝트 아이디어 공유",
    content: `새로운 OpenCV 프로젝트를 시작하려고 합니다. 

현재 고려 중인 아이디어들:
- 실시간 객체 추적
- OCR을 이용한 문서 스캔
- 스타일 전송 (Style Transfer)

어떤 프로젝트가 가장 흥미로울까요?`,
    author: "이개발자",
    createdAt: "2024-01-13 16:45",
    likes: 15,
    comments: 8,
    tags: ["프로젝트", "아이디어", "OpenCV"],
  },
];

export const CommunityFeed: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    tags: "",
  });

  const handleLike = (postId: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleComment = (postId: string, _comment: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId ? { ...post, comments: post.comments + 1 } : post
      )
    );
  };

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    const post: Post = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      author: "현재사용자",
      createdAt: new Date().toLocaleString("ko-KR"),
      likes: 0,
      comments: 0,
      tags: newPost.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    setPosts([post, ...posts]);
    setNewPost({ title: "", content: "", tags: "" });
  };

  return (
    <div className="space-y-6">
      {/* 새 포스트 작성 */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          새 포스트 작성
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="제목을 입력하세요"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <textarea
            placeholder="내용을 입력하세요"
            value={newPost.content}
            onChange={(e) =>
              setNewPost({ ...newPost, content: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
          />
          <input
            type="text"
            placeholder="태그를 쉼표로 구분하여 입력하세요 (예: OpenCV, Python, 이미지처리)"
            value={newPost.tags}
            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="flex justify-end">
            <button
              onClick={handleCreatePost}
              disabled={!newPost.title.trim() || !newPost.content.trim()}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              포스트 작성
            </button>
          </div>
        </div>
      </div>

      {/* 포스트 목록 */}
      <div className="space-y-6">
        {posts.map((post) => (
          <CommunityPost
            key={post.id}
            post={post}
            onLike={handleLike}
            onComment={handleComment}
          />
        ))}
      </div>
    </div>
  );
};
