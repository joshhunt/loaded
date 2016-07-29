import React, { Component } from 'react';
import { Entity, EditorState, getVisibleSelectionRect, SelectionState, RichUtils } from 'draft-js';
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

  iconClassForBlockType = {
    'unstyled': styles.activeParagraph,
    'header-one': styles.activeH1,
    'header-two': styles.activeH2,
    'blockquote': styles.activeQuote,
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getFocusKey();
    const activeBlockType = editorState
      .getCurrentContent()
      .getBlockForKey(blockKey)
      .getType()

    const selectedEl = getSelectedBlockElement();
    if (!selectedEl) { return }

    const rect = selectedEl.getBoundingClientRect();

    this.setState({
      activeBlockType,
      top: window.scrollY + (rect.top) - 350,
      left: rect.left,
    });
  }

  toggleBlockType = (type) => {
    const { editorState } = this.props;
    const selection = editorState.getSelection();

    const newEditorState = RichUtils.toggleBlockType(this.props.editorState, type);
    const evenNewerEditorState = EditorState.forceSelection(newEditorState, selection);

    this.props.onChange(evenNewerEditorState)

    setTimeout(() => {
      const selection = this.props.editorState.getSelection();
      const evenNewerEditorState2 = EditorState.forceSelection(this.props.editorState, selection);
      this.props.onChange(evenNewerEditorState2)
    }, 1);
  };

  handleUnstyled = () => this.toggleBlockType('unstyled');
  handleH1 = () => this.toggleBlockType('header-one');
  handleH2 = () => this.toggleBlockType('header-two');
  handleBlockquote = () => this.toggleBlockType('blockquote');

  render() {
    return (
      <div className={styles.root} style={{
        top: this.state.top,
        left: this.state.left,
      }}>

        <div className={cx(this.iconClassForBlockType[this.state.activeBlockType])}></div>

        <Tooltip
          className={styles.controls}
          items={[{
              onClick: this.handleUnstyled,
              children: <div className={styles.iconParagraph} />
            },{
              onClick: this.handleH1,
              children: <div className={styles.iconH1} />,
            },{
              onClick: this.handleH2,
              children: <div className={styles.iconH2} />,
            },{
              onClick: this.handleBlockquote,
              children: <div className={styles.iconQuote} />,
            }]}
        />
      </div>
    );
  }
}
