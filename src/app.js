// import { HashRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

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

import ErrorPage from './views/common/errorPage'



function App() {
  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div style={{ height: '100%' }}>
        <Switch>
          <Route exact path='/' render={props => <Index {...props} />} ></Route>
          <Route exact path='/workerbook' render={props => <WorkerBook {...props} />} ></Route>

          <Route exact path='/work' render={props => <Layout {...props}><Work /></Layout>} ></Route>
          <Route exact path='/add' render={props => <Layout {...props}><Add /></Layout>}></Route>
          <Route exact path='/my' render={props => <Layout {...props}><My /></Layout>}></Route>

          <Route exact path='/work/workTag' render={props => <WorkTag {...props} />}></Route>
          <Route exact path='/work/workTag/workTagList' render={props => <WorkTagList {...props} />}></Route>

          <Route exact path='/work/customList/detail' render={props => <Detail {...props} />}></Route>
          <Route exact path='/work/customList/new' render={props => <New {...props} />}></Route>

          <Route exact path='/work/customList/tableDetail' render={props => <TableDetail {...props} />}></Route>

          <Route exact path='/404' render={props => <ErrorPage {...props}></ErrorPage>}></Route>
          <Redirect to="/404"></Redirect>
        </Switch>
      </div>
    </Router>
  );
}

export default App;