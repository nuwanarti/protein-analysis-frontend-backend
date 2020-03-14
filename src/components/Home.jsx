import React from 'react';
import { Grid, Image, Tab } from 'semantic-ui-react'

import GraphView from './GraphView'
import ZScore from './ZScore'

const panes = [
  { menuItem: 'Graph View', render: () => <Tab.Pane><GraphView /></Tab.Pane> },
  { menuItem: 'Z-Score', render: () => <Tab.Pane><ZScore /></Tab.Pane> },
  // { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
]

class Home extends React.Component {

  render(){
    return <Tab panes={panes} />
  }
}

export default Home;