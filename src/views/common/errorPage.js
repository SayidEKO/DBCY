import { withRouter } from "react-router-dom";
import Base from "../base";

class ErrorPage extends Base {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  render() {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
        <div
          style={{ width: '100%', textAlign: 'center' }}
          onClick={() => this.props.history.goBack()}>
          出错啦,点我返回
        </div>
      </div>
    )
  }
}

export default withRouter(ErrorPage)