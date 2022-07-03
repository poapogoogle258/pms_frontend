import React from 'react';
import ReactDOM from 'react-dom';
import {Route,BrowserRouter, Switch} from 'react-router-dom';

import {Provider} from 'react-redux';
import { createStore } from 'redux'
import rootReducer from './services/reducers'
import { loadState, saveState } from './services/reducers/localStorage'

import Navbar from './components/Navbar'
import Home from './pages/Home'
import firstpage from './pages/firstpage'

import Register from './pages/Register'
import Login from './pages/Login'
import Profile from './pages/Profile';
import CodeSubmitter from './pages/student/CodeSubmitter'
import Courses from './pages/student/Courses';
import Coursedescription from './pages/student/Coursedescription'
import CreateCourses from './pages/teacher/CreateCourses'
import CreateLesson from './pages/teacher/CreateLesson'
import CreateProblem from './pages/teacher/CreateProblem'
import EditLesson from './pages/teacher/EditLesson';
import CourseManager from './pages/teacher/CourseManager'
import JoinCourses from './pages/student/JoinCourses';
import EditProblem from './pages/teacher/EditProblem'
import ScoreDashboard from './pages/student/ScoreCourse'
import ScoreTaskDashboard from './pages/student/ScoreTask'
import StatisticsDashboard from './pages/student/Statistics'

import 'semantic-ui-css/semantic.min.css'



const persistStore = loadState()
const store = createStore(rootReducer, persistStore)

store.subscribe(() => {
  saveState(store.getState())
})

const Routing = () =>{
  return <Switch>
            <Route exact path='/' component={firstpage} />
            <Route exact path='/home' component={Home} />
            <Route path='/login' exact component={Login} />
            <Route path='/register' exact component={Register} />
            <Route path='/newcourses' exact component={CreateCourses}/>
            <Route path='/coursemember/:coursesid' exact component={CourseManager}/>
            <Route path='/joincourse/:courseid' exact component={JoinCourses} />
            <Route path='/joincourse/:courseid/:password' exact component={JoinCourses} />
            <Route path='/courses/:courses_id' exact component={Courses}/>
            <Route path='/courses/:courses_id/:task_id' exact component={Courses}/>
            <Route path='/createlesson/:courses_id' exact component={CreateLesson}/>
            <Route path='/createproblem/:coursesid/:taskid' exact component={CreateProblem} />
            <Route path='/editlesson/:courses_id/:task_id' exact component={EditLesson}/>
            <Route path='/courses/:courses_id/:task_id/example/:problemid' exact component={CodeSubmitter}/>
            <Route path='/Profile' exact component={Profile} />
            <Route path='/editproblem/:courses_id/:task_id/:problemid' exact component={EditProblem}/>
            <Route path='/score/:courses_id' exact component={ScoreDashboard}/>
            <Route path='/score/:courses_id/:task_id' exact component={ScoreTaskDashboard}/>
            <Route path='/statistics/:courses_id' exact component={StatisticsDashboard}/>
            <Route path='/coursedescription/:courses_id' exact component={Coursedescription} />
        </Switch>
}

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter forceRefresh={true}>
      <Navbar />    
      <Routing/>
    </BrowserRouter>
  </Provider>
  ,document.getElementById('root'));
