// NewsFeedPage component is a presentational component that expects 
// its data to be passed in using React props

import React, { Component } from 'react';
import { render } from 'react-dom';
import NavBar from '../components/NavBar.jsx';
import NewsFeedEntry from '../components/NewsFeedEntry.jsx';
import { dummyData } from '../../api/dummyData';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import Message from '../components/Message.jsx';


export class NewsFeedPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      posts: []
    }
  }

  onNewsFeedEntryClick(post) {
    this.setState({
      currentPost: post
    });
  }

  render() {
    const { newsfeed, feedExists, loading, posts } = this.props;
    const { currentPost } = this.state;

    if (!feedExists) {
      return <NotFoundPage/>;
    }

    let Posts;
    if (!posts || !posts.length) {
      Posts = (
        <Message
          title="No moments taken at this location"
          subtitle="Add new moments using the field above"
        />
      );
    } 

    return (
      <div className="page lists-show">
        <NavBar />
        <div className="content-scrollable list-items">
          {loading ? <Message title="Loading News Feed..."/> : Posts}
        </div>
      </div>
    );
  }
}

NewsFeedPage.propTypes = {
  newsfeed: React.PropTypes.object,
  posts: React.PropTypes.array,
  loading: React.PropTypes.bool,
  newsfeedExists: React.PropTypes.bool,
};