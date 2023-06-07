import { useEffect, useState } from 'react';
import axios from 'axios'
import { ThreeDots } from 'react-loader-spinner';
import Articles from './Articles.jsx';
import './style.css'

const App = () => {
  const [articles, setArticles] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setLoading] = useState(false)

  const options = {
    method: 'GET',
    url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI',
    params: {
      pageNumber: '1',
      pageSize: '10',
    },
    headers: {
      'X-RapidAPI-Key': process.env.X_RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
    }
  };

  const getArticles = async q => {
    try {
      setLoading(true)
      const {data} = await axios.request({...options, params: {...options.params, q}})
      const filtered = data.value.filter((article, i, arr) => arr.findIndex(({id}) => id === article.id) === i)
      const updated = filtered.map((article, index) => ({...article, index, summation: ''}))
      setArticles(updated)
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    getArticles(query)
    setQuery('')
  }

  return (
    <main className="main">
      <div className="app">
        <form onSubmit={handleSubmit} className="input-container">
          <input
            name='query'
            autoComplete='on'
            onChange={e => setQuery(e.target.value)}
            type="text"
            className="input"
            value={query}
            placeholder="What to search for"
          />
          <button className='button' type='submit'>
            &#x1F50E;&#xFE0E;
          </button>
        </form>
        <ThreeDots ariaLabel="three-dots-loading" color="#4fa94d" visible={isLoading} />
        {!isLoading && <Articles articles={articles}/>}
      </div>
    </main>
  )
}
export default App