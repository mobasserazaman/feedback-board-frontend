import { useState, useOptimistic, useTransition, useEffect } from 'react'
import { saveFeedbackToBackend, fetchFeedbacks } from './api/feedbackApi'

export default function FeedbackBoard() {

  const [feedbacks, setFeedbacks] = useState([])
  const [pending, startTransition] = useTransition()
  const [optimisticFeedbacks, addOptimisticFeedback] = useOptimistic(
    feedbacks,
    (state, newFeedback) => [...state, newFeedback]
  )

  console.log(feedbacks)
  useEffect(() => {
    fetchFeedbacks().then(setFeedbacks)
  }, [])

  async function submitFeedback(formData) {
    const newFeedback = {
      text: formData.get('feedback'),
    }

    addOptimisticFeedback({ ...newFeedback, id: Date.now() }) // optimistic update
    const saved = await saveFeedbackToBackend(newFeedback)
    setFeedbacks((prev) => [...prev, saved])
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Quick Feedback Board</h1>
      <form
        action={(formData) => {
          startTransition(() => submitFeedback(formData))
        }}
        className="flex gap-2 mb-6"
      >
        <input
          name="feedback"
          type="text"
          required
          placeholder="Leave feedback..."
          className="flex-1 px-3 py-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={pending}
        >
          {pending ? 'Sending...' : 'Send'}
        </button>
      </form>

      <ul className="space-y-2">
        {optimisticFeedbacks.map((fb, i) => (
          <li key={i} className="bg-gray-100 p-3 rounded">
            {fb.id} : {fb.text}
          </li>
        ))}
      </ul>
    </div>
  )
}
