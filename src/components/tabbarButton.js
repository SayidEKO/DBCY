//底部菜单
import { Component } from 'react';

export default class TabbarButton extends Component {

  getSectorJsx() {
    const { sectorMenuItems, style, onClickTabbarButton } = this.props;

    if (!sectorMenuItems || !Array.isArray(sectorMenuItems) || sectorMenuItems.length === 0) {
      return;
    }

    return sectorMenuItems.map((item, index) => {
      return (
        <div key={item} onClick={() => onClickTabbarButton(item)} style={style[index]}>
          {item}
        </div>
      )
    });
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