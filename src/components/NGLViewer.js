import React, { Component } from "react";
// import logo from './logo.svg';
// import './App.css';
import { Stage, ColormakerRegistry, Colormaker, ColormakerScales } from "ngl";
/*global Blob*/

// Note viztein makes for a good Viewport wrapper to ngl Stage
// https://github.com/McMenemy/viztein

class NGLViewer extends Component {
  // paste could be handled more gracefully.
  // componentDidMount() {
  //     document.addEventListener('paste', this.paste);
  // }
  // componentWillUnount() {
  //     document.removeEventListener("paste", this.paste)
  //     this.state.stage.dispose();
  // }
  constructor(props) {
    super(props);
    this.state = { stage: null, pdb: null };
    this.pdb = this.pdb.bind(this);
    this.input = React.createRef();
    // this.paste = () => { setTimeout(() => document.activeElement.blur()); }
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState(
      {
        outputPdb: props.outputPdb,
      },
      () => {
        console.log("viewport " + props.viewport);
        // this.inputElement.click();
        console.log(this.input.current.value);
        this.pdb(
          {
            value: this.input.current.value,
          },
          this.props.viewport
        );
        // this.handleChange({
        //     target: {
        //         value: this.state.outputPdb
        //     }
        // })
      }
    );
  }
  resetStage() {
    if (this.state.stage) {
      this.state.stage.removeAllComponents();
      // FIXME: having a hard time cleaning up the viewport.
      this.setState({ stage: null });
    }
  }

  handleChange(e) {
    console.log("came here to handle change");
    this.pdb(e.target);
  }
  pdb(content, viewportId = this.props.viewport) {
    console.log("came here ");
    console.log(content);
    var pdb;
    if (content.files) {
      pdb = content.files[0];
    } else {
      if (!content.value.length) return;
      // if (content.value.indexOf("HEADER") !== 0) return;
      console.log("came here 2");

      pdb = new Blob([content.value], { type: "text/plain" });
      // content.value = "";
    }
    this.setState({ stage: new Stage(viewportId) });
    this.setState({ pdb });
    setTimeout(() => {
      //   var schemeId = ColormakerRegistry.addScheme(function (params) {
      //     this.atomColor = function (atom) {
      //       if (atom.serial < 100) {
      //         return 0x0000ff; // blue
      //       } else if (atom.serial > 2000) {
      //         return 0xff0000; // red
      //       } else {
      //         return 0x00ff00; // green
      //       }
      //     };
      //   });
    //   ColormakerScales['OrRd2'] = '[S] Purple-Blue'
      var BfactorColormaker2 = (function (Colormaker$$1) {
        function BfactorColormaker (params) {
          Colormaker$$1.call(this, params);
            
          if (!params.scale) {
            this.scale = 'OrRd2';
          }else{
              console.log('came here')
              console.log(params.scale)
              this.scale='WtYlRd'
              params.scale='WtYlRd'
              console.log(params.scale)
              console.log(this.scale)

          }
      
          if (!params.domain) {
            var selection;
            var min = Infinity;
            var max = -Infinity;
      
            if (params.sele) {
              selection = new Selection(params.sele);
            }
      
            this.structure.eachAtom(function (a) {
              var bfactor = a.bfactor;
              min = Math.min(min, bfactor);
              max = Math.max(max, bfactor);
            }, selection);
      
            this.domain = [ min, max ];
          }
      
          this.bfactorScale = this.getScale();
        }
      
        if ( Colormaker$$1 ) BfactorColormaker.__proto__ = Colormaker$$1;
        BfactorColormaker.prototype = Object.create( Colormaker$$1 && Colormaker$$1.prototype );
        BfactorColormaker.prototype.constructor = BfactorColormaker;
      
        BfactorColormaker.prototype.atomColor = function atomColor (a) {
          return this.bfactorScale(a.bfactor)
        };
      
        return BfactorColormaker;
      }(Colormaker));
      
      ColormakerRegistry.add('bfactor3', BfactorColormaker2);

      var schemeId = ColormakerRegistry.addSelectionScheme([
        ["red", "64-74 or 134-154 or 222-254 or 310-310 or 322-326"],
        ["green", "311-322"],
        ["yellow", "40-63 or 75-95 or 112-133 or 155-173 or 202-221 or 255-277 or 289-309"],
        ["blue", "1-39 or 96-112 or 174-201 or 278-288"],
        ["white", "*"]
      ], "Transmembrane 3dqb");

      this.state.stage
        .loadFile(pdb, { ext: "pdb", defaultRepresentation: false })
        .then((o) => {
            o.addRepresentation("cartoon", { color: 'bfactor3' }); //schemeId });bfactor
        //   o.addRepresentation("cartoon", { color: schemeId }); //schemeId });bfactor
          o.autoView();
        })
        .catch((e) => {
          console.log("error occured");
          console.log(e);
        });
      //   stage.loadFile("rcsb://3dqb.pdb")
      //   .then(function (o) {
      //     o.addRepresentation("cartoon", { color: schemeId }); // pass schemeId  here
      //     o.autoView();
      //   });
    }, 2000);

    // setTimeout(() =>
    //     this.state.stage.loadFile(pdb, { ext: "pdb", defaultRepresentation: true })
    // );
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <div
            id={this.props.viewport}
            style={{ width: "100%", height: "700px" }}
          >
            {/* {
                            this.state.outputPdb && <img src="" id="logo" className="App-logo" alt="logo" style={{ margin: "auto", display: this.state.pdb ? "none" : "block" }} />
                        } */}
          </div>
          <form id="pdbform" style={{ display: "none" }}>
            {/* <label>PDB File<input type="file" id="pdbfile" onChange={(e) => this.pdb(e.target)} /></label><br /> */}
            <label>
              Paste PDB:{" "}
              <textarea
                rows="1"
                wrap="soft"
                cols="20"
                type="text"
                id="pdbtext"
                value={this.state.outputPdb}
                ref={this.input}
              />
            </label>
            {/* <button type="reset" onClick={(e) => this.resetStage()}>Reset</button> */}
          </form>
        </header>
        {/* {
                    this.state.url && this.pdb({
                        value: this.state.url
                    })
                } */}
      </div>
    );
  }
}

export default NGLViewer;
