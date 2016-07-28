import React, { Component } from 'react';
import { Entity, EditorState } from 'draft-js';
import cx from 'classnames';
import Tooltip from '../Tooltip';

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

        <img src={src} className={styles.image} />
      </div>
    );
  }
}
