import { useRef } from "react"
import { useNavigate } from "react-router";
import { useName } from "../../hooks/useName"
import './styles/Home.scss'

function Home() {

  const inputRef = useRef()
  const { setName } = useName()
  const navigate = useNavigate()

  const handleSetName = () => {
    if (!inputRef.current.value) return
    setName(inputRef.current.value)
    navigate('/pokedex')
  }

  return (
    <div className="home">
      
      <h1>POKÉDEX</h1>
      <h2>¡Hola entrenador!</h2>
      <p>Para poder comenzar, dame tu nombre</p>
      <input 
        type="text"
        ref={inputRef}
        onKeyDown={(e) => e.key === 'Enter' && handleSetName()}/>
      <button className="btn" onClick={handleSetName}>Comenzar</button>
    </div>
  )
}

export default Home
