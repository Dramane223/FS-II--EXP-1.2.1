import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postAdded, postDeleted, postUpdated } from './features/posts/postsSlice'
import {
  setSelectedPlatforms,
  togglePlatform,
} from './features/platforms/platformsSlice'
import './App.css'

function App() {
  const dispatch = useDispatch()

  const postIds = useSelector((state) => state.posts.allIds)
  const postsById = useSelector((state) => state.posts.byId)
  const platformIds = useSelector((state) => state.platforms.allIds)
  const platformsById = useSelector((state) => state.platforms.byId)
  const selectedPlatformIds = useSelector((state) => state.platforms.selectedIds)

  const posts = postIds.map((id) => postsById[id])
  const platforms = platformIds.map((id) => platformsById[id])

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')

  const savePost = (event) => {
    event.preventDefault()

    if (!title.trim() || !content.trim() || selectedPlatformIds.length === 0) {
      setMessage('Please complete all fields and select at least one platform.')
      return
    }

    const postData = {
      title,
      content,
      platformIds: selectedPlatformIds,
      updatedAt: new Date().toLocaleString(),
    }

    if (editingId) {
      dispatch(postUpdated({ id: editingId, changes: postData }))
      setMessage('Post updated successfully.')
    } else {
      dispatch(
        postAdded({
          id: Date.now().toString(),
          ...postData,
        }),
      )
      setMessage('Post created successfully.')
    }

    setTitle('')
    setContent('')
    setEditingId(null)
    dispatch(setSelectedPlatforms([]))
  }

  const editPost = (post) => {
    setTitle(post.title)
    setContent(post.content)
    setEditingId(post.id)
    dispatch(setSelectedPlatforms(post.platformIds))
    setMessage(`Editing "${post.title}"`)
  }

  const deletePost = (id) => {
    dispatch(postDeleted(id))
    setMessage('Post deleted successfully.')
  }

  const cancelEdit = () => {
    setTitle('')
    setContent('')
    setEditingId(null)
    dispatch(setSelectedPlatforms([]))
    setMessage('Editing cancelled.')
  }

  return (
    <main className="app">
      <section className="post-manager">
        <header>
          <h1>Redux Post Manager</h1>
          <p>Create and manage posts using centralized Redux state.</p>
        </header>

        <form className="post-form" onSubmit={savePost}>
          <label htmlFor="title">Post title</label>
          <input
            id="title"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Enter a post title"
          />

          <label htmlFor="content">Post content</label>
          <textarea
            id="content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Write your post content..."
            rows="6"
          />

          <label>Publishing platforms</label>
          <div className="platform-list">
            {platforms.map((platform) => (
              <button
                className={
                  selectedPlatformIds.includes(platform.id)
                    ? 'platform active'
                    : 'platform'
                }
                type="button"
                key={platform.id}
                onClick={() => dispatch(togglePlatform(platform.id))}
              >
                {platform.name}
                <span>{platform.limit.toLocaleString()} character limit</span>
              </button>
            ))}
          </div>

          <div className="form-actions">
            <button type="submit">
              {editingId ? 'Update Post' : 'Create Post'}
            </button>

            {editingId && (
              <button
                className="secondary-button"
                type="button"
                onClick={cancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && <p className="message">{message}</p>}

        <section className="post-list">
          <h2>Posts ({posts.length})</h2>

          {posts.length === 0 ? (
            <p className="empty-state">No posts created yet.</p>
          ) : (
            posts.map((post) => (
              <article className="post-card" key={post.id}>
                <h3>{post.title}</h3>
                <p>{post.content}</p>

                <div className="post-platforms">
                  {post.platformIds.map((id) => (
                    <span key={id}>{platformsById[id].name}</span>
                  ))}
                </div>

                <small>Last updated: {post.updatedAt}</small>

                <div className="card-actions">
                  <button type="button" onClick={() => editPost(post)}>
                    Edit
                  </button>
                  <button
                    className="delete-button"
                    type="button"
                    onClick={() => deletePost(post.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </section>
    </main>
  )
}

export default App