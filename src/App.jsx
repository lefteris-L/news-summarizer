import { Configuration, OpenAIApi } from 'openai'
import axios from 'axios'
import './style.css'
import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import clsx from 'clsx';

const App = () => {
  const [articles, setArticles] = useState([])
  const [activeArticles, setActive] = useState([])
  const [query, setQuery] = useState('')
  const [isLoading, setLoading] = useState(false)
  const [loader, setLoader] = useState('')

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
console.log(options.headers);
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  // delete config.baseOptions.headers['User-Agent']
  const openai = new OpenAIApi(config);

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

  const summarizeArticle = async article => {
    try {
      setLoader(article.id)
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{role: 'user', content: `summarize this in 2 paragraphs: ${articles[article.index].url}`}]
      })
      article.summation = completion.data.choices[0].message.content
      setActive(current => [...current, article.id])
    } catch (e) {
      console.log(e);
    } finally {
      setLoader('')
    }
  }

  const handleSubmit = e => {
    e.preventDefault()
    getArticles(query)
    setQuery('')
  }

  const handleClick = article => {
    if (article.summation) {
      setActive(current => current.includes(article.id)
        ? current.filter(id => id !== article.id)
        : [...current, article.id]
      )
    }
    else if (loader) return
    else summarizeArticle(article)
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
        {!isLoading && articles.map(article => {
          const shouldOpen = activeArticles.includes(article.id)
          const date = article.datePublished.slice(0, 10).split('-').reverse().join('.')
          const styles = {
            transform: `scaleY(${Number(shouldOpen)})`,
            display: shouldOpen ? 'inline' : 'none'
          }

          return (
            <div className='article-container' key={article.id}>
              <h1 onClick={() => handleClick(article)} className='article-header'>
                {article.title}
              </h1>
              <ThreeDots ariaLabel="three-dots-loading" color="#4fa94d" visible={loader === article.id} width='50' height='50'/>
              {loader !== article.id && <article className={clsx("summary-box", shouldOpen ? 'open' : 'close')} style={styles}>
                {article.summation}
              </article>}
              {date[0] != 0 && <p className='date'>Date published: {date}</p>}
            </div>
          )
        })}
      </div>
    </main>
  )
}
export default App