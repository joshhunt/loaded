import React, { Component } from 'react';
import styles from './styles.styl';
import Editor from '../Editor';
import Header from '../Header';
import Nav from '../Nav';

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <Nav />
        <div className={styles.header}>
          <Header />
        </div>
        <div className={styles.body}>
          <Editor />
        </div>
      </div>
    );
  }
}

export default App;
