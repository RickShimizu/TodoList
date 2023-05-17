import styles from './App.module.css'

import { useState, useEffect } from 'react';
import { BsTrash, BsBookmarkCheck, BsBookmarkCheckFill } from 'react-icons/bs'

const API = 'http://localhost:5000'

function App() {

  const [title, setTitle] = useState('')
  const [time, setTime] = useState('')
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  //load todo
  useEffect(() => {

    const loadData = async () => {
      setLoading(true);

      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))
      setLoading(false)
      setTodos(res)
    }

    loadData();

  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const todo = {
      id: Math.random(),
      title,
      time,
      done: false,
    };

    await fetch(API + "/todos", {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        "Content-Type": "application/json",
      },
    });
    //monta uma lista de elementos anteriores e adiciona um novo elemento , modo de listar info sem recarregar pg
    setTodos((prevState) => [...prevState, todo]);

    setTitle('');
    setTime('');
  }

  const handleDelete = async (id) => {
    await fetch(API + "/todos/" + id, {
      method: 'DELETE',
    });

    setTodos((prevState) => prevState.filter((todo) => todo.id !== id));
  };

  const handleEdit = async (todo) => {
    todo.done = !todo.done
    const data = await fetch(API + "/todos/" + todo.id, {
      method: 'PUT',
      body: JSON.stringify(todo),
      headers: {
        'Content-type': 'application/json',
      }
    });

    setTodos((prevState) =>
      prevState.map((t) => (t.id === data.id ? (t = data) : t))
      );
  };


  if (loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className={styles.App}>
      <div className={styles.todo_header}>
        <h1>React Todo</h1>
      </div>

      <div className={styles.form_todo}>
        <h2>Insira sua proxima tarefa:</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.form_control}>
            <label htmlFor='title'>O que você vai fazer ?</label>
            <input
              type='text'
              name='title'
              placeholder='titulo da tarefa'
              onChange={(e) => setTitle(e.target.value)}
              value={title || ''}
              required
            />
          </div>

          <div className={styles.form_control}>
            <label htmlFor='time'>Duração:</label>
            <input
              type='text'
              name='time'
              placeholder='tempo da tarefa (em horas)'
              onChange={(e) => setTime(e.target.value)}
              value={time || ''}
              required
            />
          </div>
          <input className={styles.input} type='submit' value="Enviar" />
        </form>
      </div>

      <div className={styles.list_todo}>
        <h2>Lista de tarefas:</h2>
        {console.log('quantia ' + todos.length)}
        {todos.length === 0 ? <p>Não há tarefas</p> :
          todos.map((todo) => (
            <div className={styles.todo} key={todo.id}>
              <h3 className={todo.done ? styles.todo_done : ""}>{todo.title}</h3>
              <p>Duração: {todo.time}
                <div className={styles.actions}>
                  <span onClick={() => handleEdit(todo)}>
                    {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
                  </span>
                  <BsTrash onClick={() => handleDelete(todo.id)} />
                </div>
              </p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default App
