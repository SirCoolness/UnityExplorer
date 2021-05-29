import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';

import {Main} from "./Components/Main/Main";
import {DriversAdapter} from "./Components/Drivers/DriversAdapter";

ReactDOM.render(
  <React.StrictMode>
    <DriversAdapter>
        <Main />
    </DriversAdapter>
  </React.StrictMode>,
  document.getElementById('root')
);

