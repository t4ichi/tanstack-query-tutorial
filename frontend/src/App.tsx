import { QueryClient, QueryClientProvider, useMutation, useQuery } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import './App.css'

const queryClient = new QueryClient()

type Todo = {
  id: number
  title: string
  completed: boolean
}

type FormInputs = {
  title: string
}

function TodoList() {
  const { register, handleSubmit } = useForm<FormInputs>()
  const { data, isLoading, error } = useQuery({
    queryKey: ['todos'],
    queryFn: () => axios.get<Todo[]>('http://localhost:8080/todos').then(res => res.data)
  })

  const mutation = useMutation({
    mutationFn: async (title: string) => {
      await axios.post('http://localhost:8080/todos', { title, completed: false })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    }
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const onSubmit = (data: FormInputs) => {
    mutation.mutate(data.title)
  }

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          {...register('title', { required: true })}
          type="text"
        />
        <button type="submit">Add</button>
      </form>
      <ul>
        {data?.map((todo) => (
          <li key={todo.id}>
            <input type="checkbox" checked={todo.completed} />
            {todo.title}
          </li>
        ))}
      </ul>
    </div>
  )
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  )
}

export default App