import React, { Component } from 'react';
import logo from './logo.svg';
import styles from './styles.styl';
import Editor from '../Editor';

class App extends Component {
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <img src={logo} className={styles.logo} alt="logo" />
          <h2>Loaded</h2>
        </div>

        <Editor />
      </div>
    );
  }
}

export default App;
