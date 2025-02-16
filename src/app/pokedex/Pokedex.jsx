import { useEffect, useState } from "react"
import axios from "axios"
import { useName } from "../../hooks/useName"
import PokemonList from "./components/PokemonList"
import { Link } from "react-router"

const POKEAPI_BASE = 'https://pokeapi.co/api/v2/'

function Pokedex() {
  const [pokemons, setPokemons] = useState([])
  const [filteredPokemons, setFilteredPokemons] = useState(pokemons)
  const [search, setSearch] = useState ('')
  const [types, setTypes] = useState([])
  const [selectedType, setSelectedType] = useState('all')
  const [singlePokemon, setSinglePokemon] = useState(null)

  const { name, clearName } = useName()

  //Función para cargar los primeros 150 pokémon
  const getInitialPokemons = () => {
    axios
      .get(`${POKEAPI_BASE}/pokemon?limit=150`)
      .then(({ data }) => {
        setPokemons(data.results)
        setFilteredPokemons(data.results)
        setSinglePokemon(null)
      })
  }

  useEffect(() => {
    getInitialPokemons()
  }, [])

  // Cargar los tipos de pokémon
  useEffect(() => {
    axios.
      get(`${POKEAPI_BASE}/type?limit=18`)
        .then(({data}) => setTypes(data.results))
  }, [])

  // Filtrar por nombre en tiempo real mientras se escribe en el Input
  useEffect(() => {
    if (!search) {
      setFilteredPokemons(pokemons)
      setSinglePokemon(null)
      return
    }

      setFilteredPokemons(
        pokemons.filter(p => 
          p.name.toLowerCase().includes(search.toLowerCase())
        ))
  }, [search, pokemons])

  // Cargar pokémon segun el tipo selccionado
  useEffect(() => {
    if (selectedType === 'all') {
      getInitialPokemons()
      return
    }

    axios.get(`${POKEAPI_BASE}/type/${selectedType}`)
      .then(({data}) => {
        const typePokemons = data.pokemon.map(p => p.pokemon)
        setPokemons(typePokemons)
        setFilteredPokemons(typePokemons)
        setSinglePokemon(null)

      })

  },[selectedType])

  // Buscar un pokemón por nombre o id
  const searchPokemon = () => {
    if (!search) {
      getInitialPokemons()
      return
    }

    axios. get(`${POKEAPI_BASE}/pokemon/${search}`)
      .then(({data}) => {
        if (selectedType !== 'all') {
          const isOfType = data.types.some(t => t.type.name === selectedType)
          if(!isOfType){
            setSinglePokemon(null)
            alert('El pokemón no es del tipo seleccionado')
            return
          }
        }
        setSinglePokemon(data)
      })
      .catch(() =>{
        alert('Pokemon no encontrado')
        setSinglePokemon(null)
      })
  }

  return (
    <div>
      <h1>Pokedex</h1>

      {name &&
        <div>
          <p>Bienvenido {name}, aquí podrás encontrar a tu pokemón favorito</p>
          <button className='btn' onClick={clearName}>Salir</button>
        </div>
        }
      
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Filtra o busca por el nombre o el id"
        onKeyDown={(e) => e.key === 'Enter' && searchPokemon()}
      />

      <button className='btn' onClick={searchPokemon}>Buscar</button>

      <select 
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}>
          <option value='all'>All</option>
          {types.map(type => (
            <option key={type.name} value={type.name}>{type.name}</option>
          ))}
        

      </select>

      {singlePokemon ?
        <Link to={`/pokedex/${singlePokemon.name}`}>
          <h2>{singlePokemon?.name}</h2>
          <img src={singlePokemon?.sprites?.other['official-artwork']?.front_default} alt={singlePokemon?.name} />
        </Link>
        :
        <PokemonList pokemons={filteredPokemons}/>
      }
      

      
    </div>
  )
}

export default Pokedex
