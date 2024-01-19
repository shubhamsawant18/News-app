import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import InfiniteScroll from 'react-infinite-scroll-component'

const News = ({ setProgress, country, pageSize, category }) => {
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const capitalizerFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  useEffect(() => {
    document.title = `${capitalizerFirstLetter(category)} - NewsMonkey`;
  }, [category]);

  const updateNews = async () => {
    setProgress(10);
    const url = `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=ab3a642e2ae24bd5aa22e07a2ed0b54f&page=${page}&pageSize=${pageSize}`;
    setLoading(true);
    try {
      const response = await fetch(url);
      const parsedData = await response.json();
      setArticles((prevArticles) => prevArticles.concat(parsedData.articles));
      setTotalResults(parsedData.totalResults || 0);
      setLoading(false);
      setProgress(100);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  useEffect(() => {
    updateNews();
    //eslint-disable-next-line
  }, []);

  const handlePrevClick = async () => {
    setPage((prevPage) => prevPage - 1);
    await updateNews();
  };

  const handleNextClick = async () => {
    setPage((prevPage) => prevPage + 1);
    await updateNews();
  };

  const fetchMoreData = async () => {
    setPage((prevPage) => prevPage + 1);
    await updateNews();
  };

  return (
    <div>
      <h1 className="text-center" style={{ margin: "35px 0px",marginTop: '60px' }}>
        NewsMonkey - Top {capitalizerFirstLetter(category)} headlines
      </h1>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((element) => (
              <div className="col-md-4" key={element.url}>
                <NewsItem
                  title={element.title || ""}
                  description={element.description || ""}
                  imageUrl={element.urlToImage || ""}
                  newsUrl={element.url || ""}
                  author={element.author || ""}
                  date={element.publishedAt || ""}
                  source={element.source?.name || ""}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default News;
