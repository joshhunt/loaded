import React, { Component } from 'react';
import cx from 'classnames';

import {
  Editor as DraftEditor,
  EditorState,
} from 'draft-js';

import styles from './styles.styl';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {
      editorState: EditorState.createEmpty(),
      isDragging: false,
      parallax: 0,
    };
    this.onChange = (editorState) => this.setState({editorState});
  }

  componentDidMount() {

    window.addEventListener('scroll', () => {
      // console.log(window.scrollY);
      const scrollment = window.scrollY / 8;
      console.log(Math.floor(scrollment));
      this.setState({
        parallax: scrollment,
      });
    }, false);
  }

  onDrop = (ev) => {
    ev.preventDefault();
    window.dropEvent = ev;
    this.setState({ isDragging: false });

    const files = ev.target.files || ev.dataTransfer.files;
    const file = files[0];
    const blobUrl = URL.createObjectURL(file)
    this.setState({
      image: blobUrl,
    });

    setTimeout(this.onBackdropLoad, 300);
  };

  onDragEnter = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.state.isDragging) {
      this.setState({ isDragging: true });
    }
  };

  onBackdropLoad = () => {
    this.setState({
      displayBackdrop: true,
    });
  }

  onDragLeave = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ isDragging: false });
  };

  render() {
    return (
      <div className={styles.root} ref='el'
        onDrop={this.onDrop}
        onDragOver={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        style={{top: this.state.parallax * -1}}
      >
        <div
          className={cx(styles.backdrop, {[styles.displayBackdrop]: this.state.displayBackdrop})}
          style={{
            backgroundImage: `url(${this.state.image})`,
          }}
        />

        <div className={styles.front}>
          <div className={styles.editor}>
            <DraftEditor
              placeholder="Every great story begins with a title..."
              editorState={this.state.editorState}
              onChange={this.onChange}
            />
          </div>
        </div>

        {
          this.state.isDragging && (
          <div className={styles.isDragging}  >
            Drop cover image
          </div>
        )}
      </div>
    );
  }
}
