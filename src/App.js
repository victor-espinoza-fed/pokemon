import { useState, useRef } from 'react';
import './App.css';

const api = 'https://pokeapi.co/api/v2/';

const styles = {
  section: { display: 'flex' },
  card: {
    display: 'flex',
    flexDirection: 'column',
    border: '2px dashed #666',
    margin: 10,
    padding: 10,
  },
  id: { fontSize: 12 },
  name: {
    fontSize: 16,
    color: 'blue',
    textTransform: 'capitalize',
  },
  quote: {
    fontSize: 14,
    fontWeight: 'bold'
  },
  errors: {
    marginTop: 30,
    color: 'red',
  },
  close: {
    marginLeft: 14,
    background: 'transparent',
    borderRadius: 6,
    border: '1px solid',
    padding: '5px 10px',
    cursor: 'pointer',
  }
}

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [pokedex, setPokedex] = useState({});
  const [errors, setErrors] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const name = useRef();
  const addPokemon = () => {
    const { value } = name.current;
    const endpoint = `${api}pokemon/${value}`;
    if (!value) return;
    setDisabled(true);
    fetch(endpoint).then(r => r.json()).then(({ id, name, sprites}) => {
      const { front_default: image } = sprites;
      const pokemon = { id, name, image, counter: 1 };
      const tmp = [...pokemons];
      if (!pokedex[id]) {
        tmp.push(id);
        setPokedex({ ...pokedex, [id]: pokemon })
      } else {
        const item = pokedex[id];
        item.counter++;
        setPokedex({ ...pokedex, [id]: item });
      }
      setPokemons(tmp);
    }).catch(() => {
      const error = `The pokemon ${value} does not exist!`;
      const tmp = [...errors];
      tmp.push(error);
      setErrors(tmp);
    }).finally(() => {
      name.current.value = '';
      setDisabled(false);
    });
  }

  const getPokemonsList = () => (
    pokemons.map((id) => {
      const { name, image, counter } = pokedex[id];
      return (
        <div key={id} style={styles.card}>
          <div style={styles.id}>{id}</div>
          <img src={image}/>
          <div style={styles.quote}>+{counter}</div>
          <div style={styles.name}>{name}</div>
        </div>
      )
    })
  );

  const close = (index) => {
    const tmp = [...errors];
    tmp.splice(index, 1);
    setErrors(tmp);
  }
  const getErrors = () => errors.map((error, index) => (
    <div key={`error-${index}`}>
      {error}
      <button style={styles.close} onClick={close.bind(this, index)}>X</button>
    </div>
  ));

  return (
    <div className="App">
      Pokemon: <input ref={name} type="text"/>
      <button onClick={addPokemon} disabled={disabled}>Catch!</button>
      <section style={styles.section}>
        {!pokemons.length
          ? 'No Pokemons captured yet'
          : getPokemonsList()}
      </section>
      <section style={styles.errors}>{getErrors()}</section>
    </div>
  );
}

export default App;
