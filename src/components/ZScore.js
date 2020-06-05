import React, { Component } from "react";
import axios, { post } from "axios";
import {
  Grid,
  Image,
  Container,
  Header,
  Icon,
  TextArea,
  Form,
  Input,
  Button,
  Label,
  Dimmer,
  Loader,
} from "semantic-ui-react";

// import InputRange from 'react-input-range';
import { Slider } from "react-semantic-ui-range";
// var imageName = require('./images/image1.jpg')
import fig1 from "../assets/styles/fig1.png";
import fig2 from "../assets/styles/fig2.png";
class ZScore extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file: null,
      formId: 1,
      output: null,
      zScore: 0,
      uploading: false,
    };
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.fileUpload = this.fileUpload.bind(this);
  }
  onFormSubmit(e) {
    e.preventDefault(); // Stop form submit
    this.setState({
      uploading: true,
    });
    this.fileUpload(this.state.file1).then((response) => {
      // this.props.setOutput(response.data);

      console.log("value " + response.data.zScore);
      console.log(
        response.data.zScore.replace("Z-score", "").replace(/[ :]/g, "")
      );
      let v = response.data.zScore.replace("Z-score", "").replace(/[ :]/g, "");
      console.log("v " + v);
      let value = parseFloat(v);
      console.log("value " + value);
      console.log("type of value " + typeof value);
      this.setState(
        {
          output: response.data.output,
          zScore: value,
          uploading: false,
        },
        () => console.log("value is " + this.state.zScore)
      );
      console.log(response.data);
      // console.log('type of ' + typeof parseInt(response.data.zScore.replace('Z-score', '').replace(/[ :]/g, '')))
    });
  }

  onChange(e) {
    this.setState({ [e.target.name]: e.target.files[0] });
  }

  fileUpload(file1, file2) {
    const url = "https://taru.iam.upr.si:7082/calZScore";
    // const url = "http://ec2-52-204-51-163.compute-1.amazonaws.com:4000/calZScore";
    const formData = new FormData();
    formData.append("file1", file1);
    console.log("form id " + this.state.formId);
    formData.append("formId", this.state.formId);
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };
    return post(url, formData, config);
  }

  render() {
    return (
      <Grid centered>
        {this.state.uploading && (
          <Dimmer active>
            <Loader indeterminate>Uploading Files</Loader>
          </Dimmer>
        )}
        <Grid.Row columns={1}>
          <Grid.Column width={8}>
            <Header as="h2" style={{ textAlign: "center" }}>
              {" "}
              Validation and quality assessment of macromolecular structures
              using complex network analysis{" "}
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={4}>
            <Form onSubmit={this.onFormSubmit}>
              <Input
                style={{ marginLeft: "10px" }}
                type="file"
                name="file1"
                onChange={this.onChange}
              />
              <Button style={{ marginLeft: "10px" }} color="teal" type="submit">
                Upload
              </Button>
            </Form>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={4}>
            <div
              style={{
                borderRadius: "5px",
                backgroundImage: "linear-gradient(-90deg, blue, white, red)",
              }}
            >
              <Slider
                color="teal"
                inverted={false}
                settings={{
                  start: this.state.zScore,
                  min: -3,
                  max: 3,
                  // min: this.state.zScore - 1,
                  // max: this.state.zScore + 1,
                  step: 1,
                }}
                value={this.state.zScore}
                disabled
              />
            </div>
            <Label color="red">{this.state.zScore}</Label>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={4}>
            {/* <Header as="h2" icon textAlign="center">
              <Icon name="line graph" circular />
              <Header.Content>Z Score Calculator and Visualizer</Header.Content>
            </Header> */}
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={3}>
          <Grid.Column width={6}>
            <Image src={fig1} width="400px" centered />
          </Grid.Column>
          <Grid.Column width={4}>
            {this.state.output && (
              <TextArea
                placeholder="Text will appear here"
                value={this.state.output}
                style={{ height: "500px", width: "400px", padding: "20px" }}
              />
            )}
          </Grid.Column>
          <Grid.Column width={6}>
            <Image src={fig2} width="400px" centered />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns={1}>
          <Grid.Column width={10}>
            <Container>
              <p>
                By transforming the three-dimensional protein models into the 2D
                graphs, each amino acid is abstracted as an Cα atom. The Cα atom
                of an amino acid residue is a node, and an edge is created when
                the distance between the Cα atoms is equal to or below a
                threshold value of 7 Å.
              </p>
              <p>
                The mean node degree (MND) of the graph is calculated and
                compared to the MND of proteins of similar size in PDB.
              </p>
              {/* <br /> */}
              <p>
                The slider graphic shows the Z-Score value of the uploaded
                structure.
              </p>
              {/* <br /> */}
              <p>
                Reference: <br/>Pražnikar, J., Tomić, M. & Turk, D. Validation and
                quality assessment of macromolecular structures using complex
                network analysis. Sci Rep 9, 1678 (2019).<br/>
                <a href="https://doi.org/10.1038/s41598-019-38658-9">https://doi.org/10.1038/s41598-019-38658-9</a>
              </p>
            </Container>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row columns={2}>
          <Grid.Column width={4}></Grid.Column>
          <Grid.Column width={12}> */}
        {/* <InputRange
                            maxValue={this.state.zScore + 50}
                            minValue={this.state.zScore - 50}
                            value={this.state.zScore}
                            onChange={value => this.setState({ value })}
                            onChangeComplete={value => console.log(value)} /> */}

        {/* <div style={{
                            borderRadius: '5px',
                            backgroundImage: 'linear-gradient(-90deg, red, yellow)'
                        }}>
                            <Form.Input
                                label={`Duration: ${this.state.zScore}ms `}
                                min={this.state.zScore - 4}
                                max={this.state.zScore + 4}
                                name='duration'
                                onChange={ e => console.log(e)}
                                step={100}
                                type='range'
                                value={this.state.zScore}
                            />
                        </div> */}
        {/* </Grid.Column> */}
        {/* </Grid.Row> */}
      </Grid>
    );
  }
}

export default ZScore;
