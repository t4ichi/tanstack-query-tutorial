import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [todo, setTodo] = useState([])

  useEffect(() => {
    axios.get("http://localhost:8080/todos").then((res) => {
      setTodo(res.data)
    }).catch((err) => {
      console.log(err)
    })
  })
  return (
    <div>{JSON.stringify(todo)}</div>
  )
}

export default App