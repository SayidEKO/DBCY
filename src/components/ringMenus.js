//环形菜单
import { Component } from 'react';
import '../style/ringMenus.css'

export default class RingMenus extends Component {
  state = {
    sectorMenuVisible: false,
  }

  getSectorJsx() {
    const { sectorMenuItems } = this.props;

    if (!sectorMenuItems || !Array.isArray(sectorMenuItems) || sectorMenuItems.length === 0) {
      return;
    }

    return sectorMenuItems.map((item, i) => {
      return (
        <div
          key={i}
          className={'sector-item'}
          onClick={() => this.onClickSectorMenuItem(i)}>
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

  componentDidMount() {

  }

  componentDidUpdate() {
    const { sectorMenuVisible } = this.state
    const { closeMenus } = this.props
    if (closeMenus === true && sectorMenuVisible === true) {
      this.setState({sectorMenuVisible:false})
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