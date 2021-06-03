import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginSerivice from './services/login'
import Togglable from './components/Togglable'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}



const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('JCOLE')
  const [password, setPassword] = useState('Ghost')
  const [user, setUser] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs => {
      const sorted = blogs.sort((a, b) => (b.likes - a.likes))
      setBlogs(sorted)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappuser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginSerivice.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappuser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch(exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = async (event) => {
    event.preventDefault()

    try{
      await setUser(null)

      window.localStorage.removeItem(
        'loggedBlogappuser', JSON.stringify(user)
      )
    } catch (exception) {
      setErrorMessage('Cannot Logout')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="log in">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

  const addBlog = (blogObject) => {
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage(`blog ${returnedBlog.title} by ${returnedBlog.author} added`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
      })
  }

  const addLike = (id) => {
    const blog = blogs.find(b => b.id === id)
    const newLike = { ...blog, likes: blog.likes += 1 }

    blogService
      .update(id, newLike)
      .then(returnedBlog => {
        setBlogs(blogs.map(blog => blog.id !== id ? blog : returnedBlog))
        sortBlogs()
      })
  }

  const deleteBlog = id => {
    const blog = blogs.find(b => b.id === id)
    if (window.confirm(`remove blog ${blog.title} by ${blog.author}`)) {
      blogService
        .remove(blog.id)
        .then(returnedBlog => {
          setBlogs(blogs.filter(b => b.id !== blog.id))
          setErrorMessage('blog Removed')
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const blogForm = () => (
    <Togglable buttonLabel='new blog'>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  const sortBlogs = () => {
    const sorted = blogs.sort((a, b) => (b.likes - a.likes))
    setBlogs(sorted)
  }

  return (
    <div>
      <Notification message={errorMessage}/>
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged-in
            <button onClick={handleLogout} >logout</button>
          </p>
          {blogForm()}
        </div>
      }

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          addLike={() => addLike(blog.id)}
          handleDelete={() => deleteBlog(blog.id)}
          user={user}
        />
      )}


    </div>
  )
}

export default App