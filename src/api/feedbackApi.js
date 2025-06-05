import axios from 'axios'

const BACKEND_URL = 'http://localhost:8080/feedbacks'

export async function saveFeedbackToBackend(feedback) {
  const response = await axios.post(BACKEND_URL, feedback) //url, data (JS object)
  return response.data
}

export async function fetchFeedbacks() {
  const response = await axios.get(BACKEND_URL)
  return response.data //JSON object
}
