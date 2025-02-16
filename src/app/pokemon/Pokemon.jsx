import { useEffect, useState } from "react"
import { useParams } from "react-router"
import axios from "axios"

const POKEAPI_BASE = 'https://pokeapi.co/api/v2/'

function Pokemon() {

  const params = useParams()
  const [pokemon, setPokemon] = useState({})

  useEffect(() => {
    if (params.name){
      axios.get(`${POKEAPI_BASE}/pokemon/${params.name}`)
      .then(({data}) => setPokemon(data))
    }

  }, [params])
  

  const types = pokemon?.types?.map(t => t.type.name)
  const ability = pokemon?.abilities?.map(a => a.ability.name)
  const [hp, attack, defense, specialAttack, specialDefense, speed] = pokemon?.stats || []
  
console.log(pokemon)

  return (
    <div>
      
      <img
        src={pokemon?.sprites?.other['official-artwork']?.front_default}
        alt={pokemon?.name}
      />

      <span>id: #{pokemon.id?.toString().padStart(3, '0')}</span>
      
      <h2>{pokemon?.name}</h2>
      <p>Peso: {pokemon?.weight}</p>
      <p>Altura: {pokemon?.height}</p>
      <p>Tipos: {types?.join(', ')}</p>
      <p>Habilidades: {ability?.join(', ')}</p>
      <p>{hp?.stat.name}: <span>{hp?.base_stat}</span></p>
      <p>{attack?.stat.name}: <span>{attack?.base_stat}</span></p>
      <p>{defense?.stat.name}: <span>{defense?.base_stat}</span></p>
      <p>{specialAttack?.stat.name}: <span>{specialAttack?.base_stat}</span></p>
      <p>{specialDefense?.stat.name}: <span>{specialDefense?.base_stat}</span></p>
      <p>{speed?.stat.name}: <span>{speed?.base_stat}</span></p>

      <ul>
        {pokemon?.moves?.map(m => (
          <li key={m.move.name}>{m.move.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default Pokemon
