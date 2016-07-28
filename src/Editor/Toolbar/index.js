import React, { Component } from 'react';
// import cx from 'classnames';
import { getVisibleSelectionRect, RichUtils, convertToRaw } from 'draft-js';

import Tooltip from '../Tooltip';
import styles from './styles.styl';

export default class Toolbar extends Component {

  state = { style: {} };

  toggleInlineStyle = (style) => this.props.onChange(RichUtils.toggleInlineStyle(this.props.editorState, style));
  toggleBlockType = (type) => this.props.onChange(RichUtils.toggleBlockType(this.props.editorState, type));

  handleBold = () => this.toggleInlineStyle('BOLD');
  handleItalic = () => this.toggleInlineStyle('ITALIC');
  handleUnderline = () => this.toggleInlineStyle('UNDERLINE');
  handleCode = () => this.toggleInlineStyle('CODE');
  handleH1 = () => this.toggleBlockType('header-one');
  handleH2 = () => this.toggleBlockType('header-two');
  handleH3 = () => this.toggleBlockType('header-three');

  handleDump = () => {
    const content = this.props.editorState.getCurrentContent();
    const raw = convertToRaw(content);
    window.editorState = raw;

    console.log('Raw JS editor state has been saved to window.editorState');
    console.log(window.editorState);
  }

  componentWillReceiveProps(newProps) {
    const { editorState } = newProps;
    const selectionState = editorState.getSelection();

    if (selectionState.isCollapsed()) {
      this.setState({
        style: { display: 'none' }
      });

      return
    }

    const rect = getVisibleSelectionRect(window);

    if (!rect) {
      return null
    }

    const leftOffset = rect.width / 2;

    this.setState({
      style: {
        display: 'flex',
        top: window.scrollY + (rect.top - 75),
        left: leftOffset + rect.left,
      }
    });
  }

  render() {
    return (
      <Tooltip
        className={styles.root}
        style={this.state.style}
        items={[{
            onClick: this.handleH1,
            children: <div className={styles.iconH1} />,
          },{
            onClick: this.handleH2,
            children: <div className={styles.iconH2} />,
          },{
            onClick: this.handleH3,
            children: <div className={styles.iconH3} />,
          }, {
            onClick: this.handleBold,
            children: <div className={styles.iconBold} />
          }, {
            onClick: this.handleItalic,
            children: <div className={styles.iconItalic} />
          }, {
            onClick: this.handleUnderline,
            children: <div className={styles.iconUnderline} />
          }]}
      />
    );
  }
}
