import React, { Component } from 'react';
import styles from './styles.styl';
import Editor from '../Editor';

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <h2>Loaded</h2>
        </div>

        <Editor />
      </div>
    );
  }
}

export default App;
