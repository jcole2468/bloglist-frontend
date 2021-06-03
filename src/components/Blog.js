import React, { useState } from 'react'


const Blog = ({ blog, addLike, handleDelete, user }) => {
  const [visible, setVisible] = useState(false)
  // const [showRemove, setShowRemove] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }



  const toggleVisibility = () => {
    setVisible(!visible)
  }

  // blog styling
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  return (
    <div style={blogStyle}>
      {/* toggle blog view */}
      {visible ?
        <div style={showWhenVisible}>
          <div>{blog.title} <button onClick={toggleVisibility} >hide</button></div>
          <div>{blog.author}</div>
          <div>{blog.likes}<button onClick={addLike}>likes</button></div>
          <div>{blog.url}</div>
          <button onClick={handleDelete} style={ user.username === blog.user.username ? showWhenVisible : hideWhenVisible} >remove</button>
        </div>
        :
        <div style={hideWhenVisible}>
          {blog.title} {blog.author} <button onClick={toggleVisibility}>view</button>
        </div>
      }


    </div>
  )
}

export default Blog