'use client';

import React, { useState, useEffect } from 'react';
import './index.css'; // Make sure you have this file with Tailwind CSS imports

// Real API
const API_BASE_URL = 'http://localhost:4001';

const api = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },
  register: async (username, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
  },
  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to get current user');
    return response.json();
  },
  getUserProfile: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to get user profile');
    return response.json();
  },
  followUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/follow`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to follow user');
    return response.json();
  },
  getFeed: async () => {
    const response = await fetch(`${API_BASE_URL}/posts/feed`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to get feed');
    return response.json();
  },
  createPost: async (content, fileUrl) => {
    const response = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content, fileUrl }),
    });
    if (!response.ok) throw new Error('Failed to create post');
    return response.json();
  },
  likePost: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to like post');
    return response.json();
  },
  unlikePost: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/like`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to unlike post');
    return response.json();
  },
  getComments: async (postId) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (!response.ok) throw new Error('Failed to get comments');
    return response.json();
  },
  createComment: async (postId, content) => {
    const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) throw new Error('Failed to create comment');
    return response.json();
  },
};

// Login Component
const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.login(email, password);
      localStorage.setItem('token', result.token);
      setUser(result.user);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded bg-black text-white"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 border border-gray-300 rounded bg-black text-white"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Login
      </button>
    </form>
  );
};

// Register Component
const Register = ({ setUser }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await api.register(username, email, password);
      localStorage.setItem('token', result.token);
      setUser(result.user);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        className="w-full p-2 border border-gray-300 rounded bg-black text-white"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded bg-black text-white"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-2 border border-gray-300 rounded bg-black text-white"
      />
      <button
        type="submit"
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Register
      </button>
    </form>
  );
};

// CreatePost Component
const CreatePost = ({ onPostCreated }) => {
  const [content, setContent] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fileUrl = file ? URL.createObjectURL(file) : null;
      const newPost = await api.createPost(content, fileUrl);
      onPostCreated(newPost);
      setContent('');
      setFile(null);
    } catch (error) {
      console.error('Failed to create post:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-b border-gray-800">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={240}
        placeholder="What's happening?"
        className="w-full p-2 bg-transparent text-white resize-none border border-gray-700 rounded"
        rows={3}
      />
      <div className="flex justify-between items-center mt-2">
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-sm text-gray-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Post
        </button>
      </div>
    </form>
  );
};

// Post Component
const Post = ({ post, onLike, navigate }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);

  const handleLike = async () => {
    try {
      if (isLiked) {
        await api.unlikePost(post.id);
      } else {
        await api.likePost(post.id);
      }
      onLike(post.id);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Failed to like/unlike post:', error);
    }
  };

  // ... [Previous code remains the same up to handleShowComments]

  const handleShowComments = async () => {
    if (!showComments) {
      try {
        const fetchedComments = await api.getComments(post.id);
        setComments(fetchedComments);
      } catch (error) {
        console.error('Failed to fetch comments:', error);
      }
    }
    setShowComments(!showComments);
  };

  return (
    <div className="p-4 border-b border-gray-800 hover:bg-gray-900">
      <div className="flex space-x-3">
        <img
          src={post.creator.avatarUrl || 'https://via.placeholder.com/48'}
          alt={post.creator.username}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center space-x-1">
            <span className="font-bold text-white">
              {post.creator.username}
            </span>
            <span className="text-gray-500">@{post.creator.username}</span>
            <span className="text-gray-500">
              · {new Date(post.createdOn).toLocaleString()}
            </span>
          </div>
          <p className="mt-2 text-white">{post.content}</p>
          {post.fileUrl && (
            <img
              src={post.fileUrl}
              alt="Post attachment"
              className="mt-2 rounded-2xl max-h-80 w-full object-cover"
            />
          )}
          <div className="flex justify-between mt-3 text-gray-500">
            <button
              onClick={handleShowComments}
              className="flex items-center space-x-2 hover:text-blue-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.commentsCount}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Retweet</span>
            </button>
            <button
              onClick={handleLike}
              className={`flex items-center space-x-2 ${
                isLiked ? 'text-red-500' : 'hover:text-red-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{post.likesCount}</span>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>
        </div>
      </div>
      {showComments && (
        <div className="mt-4 space-y-2">
          {comments.map((comment) => (
            <div key={comment.id} className="text-white">
              <span className="font-bold">{comment.creator.username}: </span>
              {comment.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Feed Component
const Feed = ({ navigate }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const feed = await api.getFeed();
        setPosts(feed);
      } catch (error) {
        console.error('Failed to fetch feed:', error);
      }
    };
    fetchFeed();
  }, []);

  const handlePostCreated = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likesCount: post.likesCount + 1 } : post
      )
    );
  };

  return (
    <div className="space-y-4">
      <CreatePost onPostCreated={handlePostCreated} />
      {posts.map((post) => (
        <Post
          key={post.id}
          post={post}
          onLike={handleLike}
          navigate={navigate}
        />
      ))}
    </div>
  );
};

// Profile Component
const Profile = ({ userId, navigate }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userProfile = await api.getUserProfile(userId);
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleFollow = async () => {
    try {
      await api.followUser(userId);
      // Update UI to reflect new follow status
      alert('You are now following this user!');
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  if (!profile) return <div className="text-white">Loading...</div>;

  return (
    <div className="p-4 text-white">
      <h2 className="text-2xl font-bold">{profile.username}'s Profile</h2>
      <img
        src={profile.avatarUrl}
        alt={`${profile.username}'s avatar`}
        className="w-24 h-24 rounded-full my-4"
      />
      <p className="mb-4">{profile.bio}</p>
      <button
        onClick={handleFollow}
        className="px-4 py-2 bg-blue-500 rounded-full hover:bg-blue-600"
      >
        Follow
      </button>
      <button
        onClick={() => navigate('feed')}
        className="px-4 py-2 bg-gray-800 rounded-full ml-2 hover:bg-gray-700"
      >
        Back to Feed
      </button>
    </div>
  );
};

// Main App Component
const App = () => {
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('feed');
  const [currentProfileId, setCurrentProfileId] = useState(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await api.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to fetch current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const navigate = (page, profileId = null) => {
    setCurrentPage(page);
    if (profileId) setCurrentProfileId(profileId);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="bg-gray-900 p-8 rounded-lg w-96">
          <h1 className="text-2xl font-bold text-white mb-4">Twitter Clone</h1>
          <Login setUser={setUser} />
          <div className="my-4 border-t border-gray-800"></div>
          <Register setUser={setUser} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Twitter Clone</h1>
        <nav>
          <button
            onClick={() => navigate('feed')}
            className="mr-4 hover:text-blue-400"
          >
            Home
          </button>
          <button
            onClick={() => navigate('profile', user.id)}
            className="hover:text-blue-400"
          >
            Profile
          </button>
        </nav>
      </header>
      <main className="container mx-auto mt-4">
        {currentPage === 'feed' && <Feed navigate={navigate} />}
        {currentPage === 'profile' && (
          <Profile userId={currentProfileId} navigate={navigate} />
        )}
      </main>
    </div>
  );
};

export default App;
