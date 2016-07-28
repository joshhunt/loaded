import React, { Component } from 'react';
import styles from './styles.styl';
import Editor from '../Editor';
import Header from '../Header';

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
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
