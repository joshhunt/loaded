import React, { Component } from 'react';
import cx from 'classnames';

import styles from './styles.styl';

export default class Nav extends Component {

  state = { blue: false };

  componentDidMount() {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        this.setState({
          blue: true
        });
      } else {
        this.setState({
          blue: false
        });
      }
    })
  }

  render() {
    return (
      <div className={cx(styles.root, {[styles.blue]: this.state.blue})} >
        <div className={styles.ccccc}>
          <div className={styles.logo} />
          <span>9News: new article</span>
        </div>
        <button className={styles.button}>
          Save
        </button>
      </div>
    );
  }
}


