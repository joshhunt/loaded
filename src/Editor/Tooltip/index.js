import React, { Component } from 'react';
import cx from 'classnames';
import styles from './styles.styl'

export default class Tooltip extends Component {
  render() {
    return (
      <div className={cx(styles.root, this.props.className)} style={this.props.style || {} }>

        {this.props.items.map((item, index) => (
          <button key={index} className={styles.button} onClick={item.onClick}>
            {item.children}
          </button>
        ))}

        {/* <button className={styles.button} onClick={this.handleAlignLeft}>
          <div className={styles.iconAlignLeft} />
        </button>
        <button className={styles.button} onClick={this.handleAlignNone}>
          <div className={styles.iconAlignNone} />
        </button>
        <button className={styles.button} onClick={this.handleAlignRight}>
          <div className={styles.iconAlignRight} />
        </button> */}
      </div>
    );
  }
}
