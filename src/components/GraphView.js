import React from "react";
import { Grid, Dimmer, Loader } from "semantic-ui-react";
import FileUploader from "./FileUploader";
import NGLViewer from "./NGLViewer";

class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outputPdb1: null,
      outputPdb2: null,
      uploading: false
    };
    this.setOutput = this.setOutput.bind(this);
    this.setUploadingStatus = this.setUploadingStatus.bind(this);
  }

  setUploadingStatus(status){
    this.setState({
      uploading: status
    })
  }

  setOutput(output) {
    this.setState({
      ...output,
      uploading: false
    });
  }

  render() {
    return (
      <div className="home">
        {/* <form action="http://localhost:7082/file-upload" method="post" enctype="multipart/form-data">
          <input type="file" name="file" />
          <input type="submit" value="submit" />
        </form> */}
        <Grid centered>
          {
            this.state.uploading && <Dimmer active>
            <Loader indeterminate>Preparing Files</Loader>
          </Dimmer>
          }
          <Grid.Row>
            <Grid.Column width={8}>
              <FileUploader formId={2} setOutput={this.setOutput} setUploadingStatus={this.setUploadingStatus} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={2}>
            <Grid.Column>
              {/* <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /> */}
              <NGLViewer
                outputPdb={this.state.outputPdb1}
                viewport="viewport1"
              />
            </Grid.Column>
            <Grid.Column>
              {/* <Image src='https://react.semantic-ui.com/images/wireframe/paragraph.png' /> */}
              <NGLViewer
                outputPdb={this.state.outputPdb2}
                viewport="viewport2"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default GraphView;
