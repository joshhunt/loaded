import React, { Component } from 'react';
import { Entity, EditorState } from 'draft-js';
import cx from 'classnames';
import Tooltip from '../Tooltip';

import styles from './styles.styl'

export default class Image extends Component {

  state = {
    isDragging: false
  };

  alignmentClass = {
    'NONE': styles.alignNone,
    'FLOAT-LEFT': styles.alignLeft,
    'FLOAT-RIGHT': styles.alignRight,
  };

  align = (alignment) => {
    const entityKey = this.props.block.getEntityAt(0)
    Entity.mergeData(entityKey, { alignment });
    const { editorState, onChange } = this.props.blockProps;

    const newEditorState = EditorState.forceSelection(editorState, editorState.getSelection());
    onChange(newEditorState);
  };

  handleAlignLeft = () => this.align('FLOAT-LEFT');
  handleAlignNone = () => this.align('NONE');
  handleAlignRight = () => this.align('FLOAT-RIGHT');

  handleDrop = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ isDragging: false });

    const files = ev.target.files || ev.dataTransfer.files;
    const file = files[0];
    const blobUrl = URL.createObjectURL(file);
    this.setState({
      image: blobUrl,
    });
  };

  handleDragEnter = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    if (!this.state.isDragging) {
      this.setState({ isDragging: true });
    }
  };

  handleDragLeave = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ isDragging: false });
  };

  render() {
    const entity = Entity.get(this.props.block.getEntityAt(0));
    const { src, alignment } = entity.getData();

    return (
      <div className={cx(styles.root, this.alignmentClass[alignment])}>
        <Tooltip
          className={styles.controls}
          items={[
            {
              onClick: this.handleAlignLeft,
              children: <div className={styles.iconAlignLeft} />
            }, {
              onClick: this.handleAlignNone,
              children: <div className={styles.iconAlignNone} />
            }, {
              onClick: this.handleAlignRight,
              children: <div className={styles.iconAlignRight} />
            }
          ]}
        />

        <img
          src={this.state.image || src}
          className={cx(styles.image, { [styles.isDragging]: this.state.isDragging })}
          onDrop={this.handleDrop}
          onDragOver={this.handleDragEnter}
          onDragLeave={this.handleDragLeave}
          />
      </div>
    );
  }
}
