import React from 'react';
import ReactDOM from 'react-dom';

import './generated/Reflection';
import './generated/Buffs';

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
