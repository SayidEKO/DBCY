//底部菜单
import React from 'react';

export default class TabbarButton extends React.Component {

  getSectorJsx() {
    const { sectorMenuItems, style } = this.props;

    if (!sectorMenuItems || !Array.isArray(sectorMenuItems) || sectorMenuItems.length === 0) {
      return;
    }

    return sectorMenuItems.map((item, i) => {
      return (
        <div key={i} onClick={() => this.onClickSectorMenuItem(i)} style={style[i]}>
          {item}
        </div>
      )
    });
  }

  onClickSectorMenuItem(index) {
    const { sectorMenuItemFunctions, sectorMenuItems } = this.props;
    if (!sectorMenuItemFunctions || typeof (sectorMenuItemFunctions[index]) !== 'function') {
      return;
    }
    sectorMenuItemFunctions[index](sectorMenuItems[index]);
  }

  render() {
    const { show = true } = this.props
    return (
      <div style={{
        display: show ? 'flex' : 'none',
        width: '100%',
        height: '100%',
        fontSize: 18,
        textAlign: 'center',
        color: 'white'
      }}>
        {this.getSectorJsx()}
      </div>
    )
  }
}