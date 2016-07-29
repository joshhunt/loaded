import React, { Component } from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Entity,
  convertFromRaw,
} from 'draft-js';

import Toolbar from './Toolbar';
import GutterControls from './GutterControls';
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

  handleImage = (imageUrl, selection) => {
    let { editorState } = this.state;

    if (selection) {
      editorState = EditorState.forceSelection(editorState, selection);
    }

    const entityKey = Entity.create('image', 'IMMUTABLE', {
      src: imageUrl,
      alignment: 'NONE',
    });

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    this.handleChange(newEditorState);
  }

  handleDroppedFiles = (selection, files) => {
    console.log(selection.serialize(), files);

    const file = files[0];
    const blobUrl = URL.createObjectURL(file);
    this.handleImage(blobUrl, selection);
  }

  handleDrop = (...args) => {
    console.log(...args);
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
    const contentBlockType = contentBlock.getType();
    const type = getEntityType(contentBlock);

    if (type === 'image') {
      return styles.blockImage;
    } else {
      if (contentBlockType === 'unstyled') {
        return styles.blockUnstyled;
      }
    }
  }

  render() {
    const { editorState } = this.state;
    return (
      <div className={styles.root}>
        <Toolbar
          editorState={editorState}
          onChange={this.handleChange} />
        <GutterControls
          editorState={editorState}
          onChange={this.handleChange} />

        <DraftEditor
          placeholder="Just type..."
          blockStyleFn={this.blockStyleRenderer}
          blockRendererFn={this.blockRenderer}
          handleKeyCommand={this.onKeyCommand}
          handleDroppedFiles={this.handleDroppedFiles}
          handleDrop={this.handleDrop}
          editorState={editorState}
          onChange={this.handleChange}
        />

        <img src={DEMO_IMAGE} style={{opacity: 0, height: 1, width: 1}} />
      </div>
    );
  }
}


