import { Configuration, OpenAIApi } from 'openai'
import axios from 'axios'
import './style.css'
import { useEffect, useState } from 'react';
// require('dotenv/config')

const App = () => {
  const [articles, setArticles] = useState([])
  const [query, setQuery] = useState('')

  const options = {
    method: 'GET',
    url: 'https://contextualwebsearch-websearch-v1.p.rapidapi.com/api/Search/WebSearchAPI',
    params: {
      pageNumber: '1',
      pageSize: '10',
      autoCorrect: 'true'
    },
    headers: {
      'X-RapidAPI-Key': '1bb9d75e86msh1971cb81e7ddfabp1f1591jsn250df1fe5e6f',
      'X-RapidAPI-Host': 'contextualwebsearch-websearch-v1.p.rapidapi.com'
    }
  };

  // const config = new Configuration({
  //   apiKey: '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'
  // })

  // delete config.baseOptions.headers['User-Agent']
  // const openai = new OpenAIApi(config);
  // const methods = {}

  // const getList = async list => {
  //   try {
  //     const response = await axios.request({...options, url: `${options.url}/list-${list}`})
  //     methods[list] = response.data.payload
  //   } catch (error) {
  //     alert(error);
  //   }
  //   const optionsArr = methods[list].map((item, i) => new Option(item, i))
  //   document.getElementById(list).append([new Option('1', 1), new Option('2', 2)])
  // }
  // if (!methods.publishers) getList('publishers')
  // if (!methods.exchanges) getList('exchanges')

  const getArticle = async q => {
    try {
      const response = await axios.request({...options, params: {...options.params, q}})
      console.log(response);
      setArticles(response.data.value.map(article => ({...article, show: false})))
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmit = (e) => {
    e.key === 'Enter' && getArticle(query) && setQuery('')
  }

  const toggleArticle = id => {
    const current = articles.find(article => id === article.id)
    current.show = !current.show
  }

  // const getArticle = async (method, methods, choice = null) => {
  //   const articleContainer = document.getElementById('article')
  //   let article = {}

  //   try {
  //     article = await axios.get(`/articles-by-${method}/${methods[method][choice]}`)
      
  //     const completion = await openai.createChatCompletion({
  //       model: 'gpt-3.5-turbo',
  //       messages: [{role: 'user', content: `summarize this article in 2 paragraphs ${all.link}`}]
  //     })
    
  //     const summary = completion.data.choices[0].message.content
  //     articleContainer.innerHTML = summary
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }
  return (
    <main className="main">
      <input onKeyUp={handleSubmit} onChange={e => setQuery(e.target.value)} type="text" className="input" value={query} placeholder="What to search for" />
      <div className="app">
        <div className="articles-container">
          {articles.map(article => (
            <h1 className='article' key={article.id}>
              <div onClick={() => toggleArticle(article.id)}>{article.title}</div>
              {article.show && <div className="summary-box">{article.body}</div>}
            </h1>
          ))}
        </div>
      </div>
    </main>
  )
}
export default App