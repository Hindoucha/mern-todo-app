import {useEffect, useState} from 'react'

const API_BASE = "http://localhost:3001"

function App() {

  const [todos, setTodos] = useState([])
  const [popupActive, setPopupActive] = useState(false)
  const [newTodo, setNewTodo] = useState("")

  useEffect (()=>{
    GetTodos()
  }, [])

  const GetTodos = () => {
    fetch(API_BASE + "/todos")
    .then(res => res.json())
    .then(data => setTodos(data))
    .catch(console.log("Error in getting data"))
  }

  const completeTodo = async (id) => {
    const request = {
      method : "PUT",
      headers : {'contentType' : "application/json"}, 
      body : JSON.stringify({})
    }
    // update it on database
    const data =  await fetch(API_BASE + "/todo/complete/"+ id, request)
                  .then(res => res.json())

    // update it on the state
    setTodos(todos => todos.map( todo => {
      if (todo._id === data._id) {
        todo.complete = data.complete
      }
      return todo
    }))
  }

  const deleteTodo = async (id) => {
    const requestOptions = {
      method : "DELETE",
      headers : {'content-type' : "application/json"},
      body: JSON.stringify({})
    }
  
    // delete it in the database
    const data = await fetch(API_BASE + "/todo/delete/"+ id, requestOptions)
    .then(res => res.json())

    // delete it in the state
    setTodos(todos => todos.filter(todo => todo._id !== data._id))
  }

  const addTodo = async() => {
    const requestOptions = {
      method : "POST",
      headers : {'content-type' : "application/json"},
      body : JSON.stringify({
        text : newTodo
      })
    }

    // add it to the database
    const data = await fetch(API_BASE + "/todo/new", requestOptions)
    .then(res => res.json())

    // add it to the state
    setTodos([...todos, data])
    setPopupActive(false)
    setNewTodo("")
  }

  return (
    <div className="App">
      
      <h1>Welcome, Hindoucha!</h1>
      <h3>Your Todos</h3>
      
      <div className="todos">
        {
          todos.map(todo => (
            <div className={"todo " + (todo.complete? "is-complete" : "")} key={todo._id}>
              <div className="checkbox" onClick={()=> completeTodo(todo._id)}></div>
              <div className="text">{todo.text}</div>
              <div className="delete" onClick={() => deleteTodo(todo._id)}>x</div>
            </div>
          ))
        }
      </div>

      <div className="add-todo" onClick={()=> setPopupActive(true)}>+</div>

      { popupActive ? 
          <div className="add-todo-modal">
            <h3>Add todo</h3>
            <input type="text" className="add-todo-input" onChange={(e) => setNewTodo(e.target.value)}/>
            <div className="button" onClick={addTodo}>Create todo</div>
            <div className="close" onClick={()=>setPopupActive(false)}>x</div>
          </div>
        : ''}
    </div>
  );
}

export default App;
