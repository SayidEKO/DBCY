//环形菜单
import { Component } from 'react';
import '../style/ringMenus.scss'

export default class RingMenus extends Component {
  state = {
    sectorMenuVisible: false,
  }

  getSectorJsx() {
    const { sectorMenuItems, onClickRightMenus } = this.props;

    if (!sectorMenuItems || !Array.isArray(sectorMenuItems) || sectorMenuItems.length === 0) {
      return;
    }

    return sectorMenuItems.map(item => {
      return (
        <div
          key={item}
          className={'sector-item'}
          onClick={() => onClickRightMenus(item)}>
          {item}
        </div>
      )
    });
  }

  componentDidMount() {

  }

  componentDidUpdate() {
    const { sectorMenuVisible } = this.state
    const { closeMenus } = this.props
    if (closeMenus === true && sectorMenuVisible === true) {
      this.setState({ sectorMenuVisible: false })
    }
  }





  render() {
    const { sectorMenuVisible } = this.state;

    return (
      <div>
        <img alt=''
          onClick={() => this.setState({ sectorMenuVisible: !sectorMenuVisible })}
          className={`center-icon ${sectorMenuVisible && 'activity'}`}
          src={require('../assets/tab/add_select.png').default} />
        <div className={`sector-list ${sectorMenuVisible && 'active'}`}>
          {this.getSectorJsx()}
        </div>
      </div>
    )
  }
}