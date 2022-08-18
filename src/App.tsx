import './App.css'
import axios from 'axios'
import { useState } from 'react'

function App() {
  const [countries, setCountries] = useState();
  const [input, setInput] = useState<string>();

  const loadData = async () => {
    const response = await axios.get(`localhost:3000/countryquery/${input}`)
    const filteredCountries = response.data;
    setCountries(filteredCountries)
  }

  return (
    <div className="App">
      <input type={"text"} onChange={(e => setInput(e.target.value))}/>
      <button onClick={loadData}>Pesquisar</button>
    </div>
  )
}

export default App
