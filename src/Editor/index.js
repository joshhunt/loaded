import React, { Component } from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils
} from 'draft-js';

import styles from './styles.styl';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createEmpty() };
  }

  handleChange = (editorState) => this.setState({editorState});

  onKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(this.state.editorState, command);

    if (newState) {
      this.handleChange(newState);
      return true;
    }

    return false;
  };

  handleBold = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'BOLD'));

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.toolbar}>
          <button onClick={this.handleBold}>Bold</button>
        </div>

        <DraftEditor
          handleKeyCommand={this.onKeyCommand}
          editorState={editorState}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}
