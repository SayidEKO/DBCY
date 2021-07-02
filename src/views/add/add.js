import Base from '../base';
import { withRouter } from "react-router-dom"

import { Grid } from "antd-mobile";

import { router2workTag } from '../../utils/routers';

import { menus } from "../../config";

class Add extends Base {
  constructor(props) {
    super(props);
    this.state = {
      categories: []
    }
  }

  componentDidMount() {
    for (var key in menus) {
      this.state.categories.push({
        icon: menus[key].icon,
        text: key,
        url: menus[key].url,
      })
    }
    this.setState({})
  }

  render() {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', background: 'white' }}>
        <div style={{ width: '100%' }}>
          <Grid
            hasLine={false}
            data={this.state.categories}
            onClick={(item) => router2workTag(this, item.text)} />
        </div>
      </div>
    );
  }
}

export default withRouter(Add)