import React, { Component } from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Entity,
  convertToRaw,
  convertFromRaw,
} from 'draft-js';


import Image from './Image';
import baseState from './exampleContentState';
import styles from './styles.styl';

const DEMO_IMAGE = 'http://www.mohigantimes.org/wp-content/uploads/2015/04/the-office-key-art-season-8-1.jpg';

function getEntityType(contentBlock) {
  if (contentBlock.getType() === 'atomic') {
    const entity = Entity.get(contentBlock.getEntityAt(0));
    return entity.getType();
  }

  return undefined;
}

export default class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = { editorState: EditorState.createWithContent(convertFromRaw(baseState)) };
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
  handleItalic = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  handleUnderline = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  handleCode = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));

  handleDump = () => {
    const content = this.state.editorState.getCurrentContent();
    const raw = convertToRaw(content);
    console.log(raw);
  }

  handleImage = () => {
    const { editorState } = this.state;
    const entityKey = Entity.create('image', 'IMMUTABLE', {
      src: DEMO_IMAGE,
      alignment: 'NONE',
    });

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    this.handleChange(newEditorState);
  }

  blockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Image,
        editable: false,
        props: {
          editorState: this.state.editorState,
          onChange: this.handleChange,
        }
      };
    }

    return null;
  }

  blockStyleRenderer = (contentBlock) => {
    const type = getEntityType(contentBlock);

    if (type === 'image') {
      return styles.imageFigure;
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.root}>
        <div className={styles.toolbar}>
          <button className={styles.button} onClick={this.handleBold}>Bold</button>
          <button className={styles.button} onClick={this.handleItalic}>Italic</button>
          <button className={styles.button} onClick={this.handleUnderline}>Underline</button>
          <button className={styles.button} onClick={this.handleCode}>Code</button>
          <button className={styles.button} onClick={this.handleImage}>Image</button>
          <button className={styles.button} onClick={this.handleDump}>Dump</button>
        </div>

        <DraftEditor
          blockStyleFn={this.blockStyleRenderer}
          blockRendererFn={this.blockRenderer}
          handleKeyCommand={this.onKeyCommand}
          editorState={editorState}
          onChange={this.handleChange}
        />

        <img src={DEMO_IMAGE} style={{opacity: 0, height: 1, width: 1}} />
      </div>
    );
  }
}


