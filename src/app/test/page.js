function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">BrandName</h1>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="container mx-auto mt-10">
        {/* Sidebar & Main content */}
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 bg-white p-4 shadow">
            <h2 className="text-lg font-semibold mb-4">Profile</h2>
            {/* ...Other Sidebar Content */}
          </div>
          
          {/* Main content */}
          <div className="w-3/4 ml-4">
            <div className="bg-white p-4 shadow rounded">
              {/* Post/Create Content Form */}
              <div className="border-b pb-4 mb-4">
                <textarea 
                  className="w-full p-2 rounded border" 
                  placeholder="What's on your mind?">
                </textarea>
                <button className="bg-blue-500 text-white rounded px-4 py-2 mt-2">
                  Post
                </button>
              </div>
              
              {/* Feed/Posts */}
              <div>
                {/* Single Post */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold">Username</h3>
                  <p>Post content...</p>
                </div>
                {/* ...More Posts */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;