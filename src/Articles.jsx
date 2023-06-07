import { useState } from 'react'
import { Configuration, OpenAIApi } from 'openai'
import clsx from 'clsx';
import { ThreeDots } from 'react-loader-spinner';

const Articles = ({articles}) => {
  const [activeArticles, setActive] = useState([])
  const [loader, setLoader] = useState('')
  const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
  })

  // delete config.baseOptions.headers['User-Agent']
  const openai = new OpenAIApi(config);

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

  return articles.map(article => {
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
  })
}

export default Articles
