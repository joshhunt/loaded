import React, { Component } from 'react';
import { Entity, EditorState } from 'draft-js';
import cx from 'classnames';

import styles from './styles.styl'

export default class Image extends Component {

  alignmentClass = {
    'NONE': styles.alignNone,
    'FLOAT-LEFT': styles.alignLeft,
    'FLOAT-RIGHT': styles.alignRight,
  }

  align = (alignment) => {
    const entityKey = this.props.block.getEntityAt(0)
    Entity.mergeData(entityKey, { alignment });
    const { editorState, onChange } = this.props.blockProps;

    const newEditorState = EditorState.forceSelection(editorState, editorState.getSelection());
    onChange(newEditorState);
  }

  handleAlignLeft = () => this.align('FLOAT-LEFT')
  handleAlignNone = () => this.align('NONE')
  handleAlignRight = () => this.align('FLOAT-RIGHT')

  render() {
    const entity = Entity.get(this.props.block.getEntityAt(0));
    const { src, alignment } = entity.getData();

    return (
      <div className={cx(styles.root, this.alignmentClass[alignment])}>
        <div className={styles.controls}>
          <button className={styles.button} onClick={this.handleAlignLeft}>
            <div className={styles.iconAlignLeft} />
          </button>
          <button className={styles.button} onClick={this.handleAlignNone}>
            <div className={styles.iconAlignNone} />
          </button>
          <button className={styles.button} onClick={this.handleAlignRight}>
            <div className={styles.iconAlignRight} />
          </button>
        </div>

        <img
          src={src}
          className={styles.image}
        />
      </div>
    );
  }
}
