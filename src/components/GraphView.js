import React from "react";
import { Grid, Dimmer, Loader, Header, Container } from "semantic-ui-react";
import FileUploader from "./FileUploader";
import NGLViewer from "./NGLViewer";

class GraphView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      outputPdb1: null,
      outputPdb2: null,
      uploading: false,
    };
    this.setOutput = this.setOutput.bind(this);
    this.setUploadingStatus = this.setUploadingStatus.bind(this);
  }

  setUploadingStatus(status) {
    this.setState({
      uploading: status,
    });
  }

  setOutput(output) {
    this.setState({
      ...output,
      uploading: false,
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
          {this.state.uploading && (
            <Dimmer active>
              <Loader indeterminate>Preparing Files</Loader>
            </Dimmer>
          )}
          <Grid.Row columns={1}>
            <Grid.Column width={10}>
              <Header as="h2" style={{ textAlign: "center" }}>
                The analysis of contacts between two structures
              </Header>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={8}>
              <FileUploader
                formId={2}
                setOutput={this.setOutput}
                setUploadingStatus={this.setUploadingStatus}
              />
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
          <Grid.Row columns={1} style={{ marginTop: ((this.state.outputPdb1 && this.state.outputPdb2) ? '10px' : "-700px"), zIndex: ((this.state.outputPdb1 && this.state.outputPdb2) ? 100 : 0)}}>
            <Grid.Column width={10}>
              <Container>
                <p>
                  Intra-residue interactions are calculated within a radius of
                  4.6 Å, using only non-hydrogen atoms.
                </p>
                <p>
                  Note that the uploaded structures must have the same sequence.
                </p>
                <p>
                  The residue graphs are subtracted from each other so that all
                  matching links have been removed.
                </p>
                <p>
                  The resulting differential graphs contained only interactions
                  specific to the shape.
                </p>
                <p>
                  The differences are shown in red.d only interactions specific
                  for the form and molecule.
                </p>
                <p>The differences are shown in red color.</p>
                <p>
                  Reference:
                  <br />
                  Pintar, S., Borišek, J., Usenik, A. et al. Domain sliding of
                  two Staphylococcus aureus N- acetylglucosaminidases enables
                  their substrate-binding prior to its catalysis. Commun Biol 3,
                  178 (2020).
                  <a href="https://doi.org/10.1038/s42003-020-0911-7">
                    https://doi.org/10.1038/s42003-020-0911-7
                  </a>
                </p>
              </Container>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default GraphView;
