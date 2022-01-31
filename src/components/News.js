import React, { Component } from 'react'
import Newsitem from './Newsitem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
    static defaultProps = {
        country: 'in',
        pageSize: 6,
        category: "general"
    };
    static propTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string

    };

    constructor() {
        super();
        console.log("hello i am a constructor");
        this.state = {
            articles: [],
            loading: false,
            page: 1

        }
    }

    async componentDidMount() {
        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=1&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });

        let data = await fetch(url);
        let parsedata = await data.json();
        console.log(parsedata);
        this.setState({
            articles: parsedata.articles,
            totalarticles: parsedata.totalResults,
            loading: false
        })
    }
    handleNextClick = async () => {
        if (!(this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize))) {

            let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page + 1}&pageSize=${this.props.pageSize}`;
            this.setState({ loading: true });
            let data = await fetch(url);
            let parsedata = await data.json();


            this.setState(
                {
                    page: this.state.page + 1,
                    articles: parsedata.articles,
                    loading: false

                }
            )
        }
    }
    handlePreviousClick = async () => {

        let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apikey}&page=${this.state.page - 1}&pageSize=${this.props.pageSize}`;
        this.setState({ loading: true });

        let data = await fetch(url);
        let parsedata = await data.json();
        console.log(parsedata);

        this.setState(
            {
                page: this.state.page - 1,
                articles: parsedata.articles,
                loading: false

            }
        )
    }

    render() {
        return (
            <div className="container my-3">

                <h2 className="text-center" style={{ margin: '25px 0px' }}>Top {this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)} Headlines</h2>
                {this.state.loading && <Spinner />}

                <div className="row">
                    {!this.state.loading && this.state.articles.map((element) => {
                        return (

                            <div className="col-md-4" key={element.url}>
                                <Newsitem title={element.title} description={element.description} imgurl={element.urlToImage} newsurl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />

                            </div>
                        )


                    })}


                </div>
                <div className="container d-flex justify-content-between">
                    <button type="button" disabled={this.state.page <= 1} className="btn btn-dark" onClick={this.handlePreviousClick}>&larr; Previous</button>
                    <button disabled={this.state.page + 1 > Math.ceil(this.state.totalResults / this.props.pageSize)} type="button" className="btn btn-dark" onClick={this.handleNextClick}>Next &#8594;</button>
                </div>
            </div>
        )
    }
}

export default News
