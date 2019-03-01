import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import * as serviceWorker from './serviceWorker';

import './App.css';
import './index.css';

import App from './App';
import MenuAppBar from './MenuAppBar';
import StockDetail from './StockDetail';

require('dotenv').config();

ReactDOM.render(
    <Router>
        <div>
            <MenuAppBar />
            <header className="App-header"></header>
            <div>
                <Route exact path="/" component={App} />
                <Route exact path="/stock/:id" component={StockDetail} />
            </div>
        </div>
    </Router>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
