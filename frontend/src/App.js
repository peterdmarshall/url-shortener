import React from 'react';
import {
  Switch,
  Route
} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import ProtectedRoute from './auth/protectedRoute';
import Loading from './components/Loading';
import MainPage from './components/MainPage';
import AnalyticsPage from './components/AnalyticsPage';
import SettingsPage from './components/SettingsPage';

function App() {

  return (
    <Switch>
      <Route exact path="/" component={MainPage}></Route>
      <ProtectedRoute exact path="/analytics" component={AnalyticsPage}></ProtectedRoute>
      <ProtectedRoute exact path="/settings" component={SettingsPage}></ProtectedRoute>
    </Switch>
  );
}

export default App;
