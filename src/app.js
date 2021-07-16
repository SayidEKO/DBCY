// import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch, Redirect, withRouter } from 'react-router-dom'

import Layout from './layout/layout'

import Index from "./views/index";

import WorkerBook from './views/workerbook'

import Work from './views/work/work'
import Add from './views/add/add'
import My from './views/my/my'

import WorkTag from './views/work/workTag'
import WorkTagList from './views/work/workTagList';

import Detail from './views/work/detail/detail';
import New from './views/work/new/new';
import TableDetail from './views/common/tableDetail'

import MyAttendance from './views/my/attendance';

import ErrorPage from './views/common/errorPage'
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import React from 'react';

import './style/transition.css';

const ANIMATION_MAP = {
  PUSH: 'forward',
  POP: 'back'
}

const Routes = withRouter(({location, history}) => (
  <TransitionGroup
    className="router-wrapper"
    style={{height: '100%'}}
    childFactory={child => React.cloneElement(
      child,
      { classNames: ANIMATION_MAP[history.action] || 'fade'}
    )}
  >
    <CSSTransition
      timeout={500}
      key={location.pathname}
    >
      <Switch>
        <Route exact path='/' render={props => <Index {...props} />} ></Route>
        <Route exact path='/workerbook' render={props => <WorkerBook {...props} />} ></Route>

        <Route exact path='/work' render={props => <Layout {...props}><Work /></Layout>} ></Route>
        <Route exact path='/add' render={props => <Layout {...props}><Add /></Layout>}></Route>
        <Route exact path='/my' render={props => <Layout {...props}><My /></Layout>}></Route>
        <Route exact path='/my/attendance' render={props => <MyAttendance />}></Route>

        <Route exact path='/work/workTag' render={props => <WorkTag {...props} />}></Route>
        <Route exact path='/work/workTag/workTagList' render={props => <WorkTagList {...props} />}></Route>

        <Route exact path='/work/customList/detail' render={props => <Detail {...props} />}></Route>
        <Route exact path='/work/customList/new' render={props => <New {...props} />}></Route>

        <Route exact path='/work/customList/tableDetail' render={props => <TableDetail {...props} />}></Route>

        <Route exact path='/404' render={props => <ErrorPage {...props}></ErrorPage>}></Route>
        <Redirect to="/404"></Redirect>
      </Switch>
    </CSSTransition>
  </TransitionGroup>
));

function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <Routes />
    </Router>
  );
}

export default App;