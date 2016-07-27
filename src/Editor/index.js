import React, { Component } from 'react';
import {
  Editor as DraftEditor,
  EditorState,
  RichUtils,
  AtomicBlockUtils,
  Entity,
  Modifier
} from 'draft-js';

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
  handleItalic = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'ITALIC'));
  handleUnderline = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'UNDERLINE'));
  handleCode = () => this.handleChange(RichUtils.toggleInlineStyle(this.state.editorState, 'CODE'));

  handleImage = () => {
    const type = 'image';
    const { editorState } = this.state;
    const entityKey = Entity.create(type, 'IMMUTABLE', { src: DEMO_IMAGE });

    const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');
    this.handleChange(newEditorState);
  }

  blockRenderer = (block) => {
    if (block.getType() === 'atomic') {
      return {
        component: Media,
        editable: false,
        props: {
          editorState: this.state.editorState,
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
        </div>

        <DraftEditor
          blockRendererFn={this.blockRenderer}
          blockStyleFn={this.blockStyleRenderer}
          handleKeyCommand={this.onKeyCommand}
          editorState={editorState}
          onChange={this.handleChange}
        />

        <img src={DEMO_IMAGE} style={{opacity: 0, height: 1, width: 1}} />
      </div>
    );
  }
}


class Media extends Component {

  state = {
    cycle: [
      'NONE',
      'FLOAT-LEFT',
      'FLOAT-RIGHT',
    ]
  }

  handleClick = (ev) => {
    const cycle = [...this.state.cycle];
    cycle.unshift(cycle.pop());
    const currentAlignment = cycle[0];
    console.log(currentAlignment);
    this.setState({ cycle });
  }

  render() {
    const entity = Entity.get(this.props.block.getEntityAt(0));
    const { src } = entity.getData();
    const type = entity.getType();

    return (<img onClick={this.handleClick} className={styles.image} src={src} />);
  }
}
