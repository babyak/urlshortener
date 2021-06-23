import 'date-fns';
import React, { useState } from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import jsonServerProvider from 'ra-data-json-server';
import LandingPage from './LandingPage';
import { Route } from 'react-router-dom';

const SCHEME = 'http'
const HOST = 'localhost'
const PORT = '3000'

const dataProvider = jsonServerProvider('http://localhost:3000');

const customRoutes  = [
  <Route exact path="/public" component={LandingPage} />,
];

const AdminPage = () => (
  <Admin customRoutes={customRoutes} dataProvider={dataProvider}>
    <Resource name="urls" list={ListGuesser} />
  </Admin>
)

export default AdminPage;
