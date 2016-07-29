import React, { Component } from 'react';
import { Entity, EditorState, getVisibleSelectionRect, SelectionState } from 'draft-js';
import cx from 'classnames';

import styles from './styles.styl';
import Tooltip from '../Tooltip';

function getSelectedBlockElement() {
  const selection = window.getSelection()
  if (selection.rangeCount == 0) return null

  let node = selection.getRangeAt(0).startContainer
  do {
    if (node.getAttribute && node.getAttribute('data-block') == 'true')
      return node
    node = node.parentNode
  } while (node != null)
  return null
};

export default class GutterControls extends Component {

  state = {
    top: 0,
  };

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const selectionState = editorState.getSelection();
    const selectedEl = getSelectedBlockElement();
    if (!selectedEl) { return }

    const rect = selectedEl.getBoundingClientRect();

    this.setState({
      display: 'block',
      top: window.scrollY + (rect.top) - 350,
      left: rect.left,
    });
  }

  render() {
    return (
      <div className={styles.root} style={{
        top: this.state.top,
        left: this.state.left,
      }}>

        <div className={styles.activeIcon}></div>

        <Tooltip
          className={styles.controls}
          items={[{
              // onClick: this.handleH1,
              children: <div className={styles.paragraph3} />
            },{
              // onClick: this.handleH2,
              children: <div className={styles.iconH1} />,
            },{
              // onClick: this.handleBold,
              children: <div className={styles.iconH2} />,
            }]}
        />
      </div>
    );
  }
}
