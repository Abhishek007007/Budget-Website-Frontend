import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row, Spin, Typography, message, Select, Input, DatePicker, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";


const { Title } = Typography;
const { RangePicker } = DatePicker;

const NewsComponent = () => {
  const [newsData, setNewsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [sortBy, setSortBy] = useState("relevancy"); // Set default sorting to "relevancy"
  const [dateRange, setDateRange] = useState([null, null]);

  const newsAPIUrl = "https://newsapi.org/v2/everything";
  const apiKey = "eb8956e0e67049aa8ed7fe0e79b8ce05";
  const query = "financial"; // Filtering by financial news

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await axios.get(newsAPIUrl, {
          params: {
            q: query, // Search for 'financial' news
            apiKey: apiKey,
            language: "en", // Fetch English articles
            page: page, // Pagination
            sortBy: sortBy, // Sorting by relevance, date, or popularity
            from: dateRange[0] ? dateRange[0].format("YYYY-MM-DD") : undefined, // From date filter
            to: dateRange[1] ? dateRange[1].format("YYYY-MM-DD") : undefined, // To date filter
            pageSize: 5, // Number of articles per page
          },
        });
        setNewsData(response.data.articles);
        setTotalResults(response.data.totalResults);
      } catch (error) {
        setError("Failed to fetch news. Please try again later.");
        message.error("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page, sortBy, dateRange]);

  const handleSearch = (e) => {
    setSearchText(e.target.value);
  };

  const handleDateRangeChange = (dates) => {
    setDateRange(dates);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
  };

  const handlePaginationChange = (page) => {
    setPage(page);
  };

  const filteredNewsData = newsData.filter((article) =>
    article.title.toLowerCase().includes(searchText.toLowerCase()) ||
    article.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  if (loading) {
    return <Spin size="large" />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Title level={2}>Financial News</Title>

      {/* Search and Filter Controls */}
      <div style={{ marginBottom: 20 }}>
        <Input
          placeholder="Search News"
          prefix={<SearchOutlined />}
          value={searchText}
          onChange={handleSearch}
          style={{ width: 300, marginRight: 20 }}
        />

        <RangePicker
          style={{ marginRight: 20 }}
          onChange={handleDateRangeChange}
          format="YYYY-MM-DD"
        />

        <Select
          value={sortBy}
          onChange={handleSortChange}
          style={{ width: 200 }}
          placeholder="Sort By"
        >
          <Select.Option value="publishedAt">Date (Newest First)</Select.Option>
          <Select.Option value="relevancy">Relevance</Select.Option>
          <Select.Option value="popularity">Popularity</Select.Option>
        </Select>
      </div>

      {/* News Articles */}
      <Row gutter={[16, 16]}>
        {filteredNewsData.map((article, index) => (
          <Col span={8} key={index}>
            <Card
              hoverable
              cover={
                article.urlToImage ? (
                  <img alt="news" src={article.urlToImage} />
                ) : (
                  <img alt="news" src="https://via.placeholder.com/150" />
                )
              }
            >
              <Card.Meta
                title={<a href={article.url} target="_blank" rel="noopener noreferrer">{article.title}</a>}
                description={article.description || "No description available."}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      <Pagination
        current={page}
        total={totalResults}
        pageSize={5}
        onChange={handlePaginationChange}
        style={{ marginTop: 20 }}
      />
    </div>
  );
};

export default NewsComponent;
