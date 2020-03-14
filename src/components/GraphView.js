import React from 'react'
import { Grid, Image, Tab } from 'semantic-ui-react'
import FileUploader from './FileUploader'
import NGLViewer from './NGLViewer';

class GraphView extends React.Component {
    constructor(props){
        super(props)
        this.state = {
          outputPdb1: null,
          outputPdb2: null
        }
        this.setOutput = this.setOutput.bind(this);
      }
    
      setOutput(output){
        this.setState({
          ...output
        })
      }
    
      render() {
        return (
          <div className='home'>
            {/* <form action="http://localhost:7082/file-upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" />
          <input type="submit" value="submit" />
        </form> */}
            <Grid>
              <Grid.Row columns={2}>
                <Grid.Column>
                  {/* <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /> */}
                  <NGLViewer outputPdb={this.state.outputPdb1} viewport="viewport1" />
                </Grid.Column>
                <Grid.Column>
                  {/* <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /> */}
                  <NGLViewer outputPdb={this.state.outputPdb2} viewport="viewport2" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <FileUploader formId={2} setOutput={this.setOutput} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        )
      }
}

export default GraphView