import { Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux'

function PrivateRoute({ component: Component, loginState, ...rest }) {
    return (
        <Route
            {...rest}
            // 如果已登录，则直接跳转到对应页面，否则重定向到登录页面
            render = { props => loginState 
                ? <Component {...props}/> 
                : <Redirect to={{ pathname: '/my', state: { from: props.location } }}/>
            }
        >
        </Route>
    )
}

// 映射函数
const mapStateToProps = state => {
    return {
        loginState: state.userModule.loginState
    }
}

export default connect(mapStateToProps)(withRouter(PrivateRoute))
