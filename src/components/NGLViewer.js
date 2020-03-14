import React, { Component } from 'react';
// import logo from './logo.svg';
// import './App.css';
import { Stage, ColormakerRegistry } from 'ngl';
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
        this.state = { stage: null, pdb: null }
        this.pdb = this.pdb.bind(this)
        this.input = React.createRef();
        // this.paste = () => { setTimeout(() => document.activeElement.blur()); }
        this.handleChange = this.handleChange.bind(this)
    }

    componentWillReceiveProps(props) {
        this.setState({
            outputPdb: props.outputPdb
        }, () => {
            console.log('viewport ' + props.viewport)
            // this.inputElement.click();
            console.log(this.input.current.value)
            this.pdb({
                value: this.input.current.value
            }, this.props.viewport)
            // this.handleChange({
            //     target: {
            //         value: this.state.outputPdb
            //     }
            // })
        })
    }
    resetStage() {
        if (this.state.stage) {
            this.state.stage.removeAllComponents();
            // FIXME: having a hard time cleaning up the viewport.
            this.setState({ stage: null });
        }
    }

    handleChange(e) {
        console.log('came here to handle change');
        this.pdb(e.target)
    }
    pdb(content, viewportId = this.props.viewport) {
        console.log('came here ')
        console.log(content)
        var pdb;
        if (content.files) {
            pdb = content.files[0]
        }
        else {
            if (!content.value.length) return;
            // if (content.value.indexOf("HEADER") !== 0) return;
            console.log('came here 2')

            pdb = new Blob([content.value], { type: 'text/plain' });
            // content.value = "";
        }
        this.setState({ stage: new Stage(viewportId) })
        this.setState({ pdb });
        setTimeout(() => {
            const schemeId = ColormakerRegistry.addScheme(function (params) {
                this.atomColor = function (atom) {
                    console.log(JSON.stringify(atom));
                    if (atom.serial > 600 && atom.serial < 1000) {
                        return 0xffffff; // blue
                    } else if (atom.serial < 600) {
                        return 0xff0000; // red
                    } else {
                        return 0x00ff00; // green
                    }
                };
            });
            this.state.stage.loadFile(pdb, { ext: 'pdb', defaultRepresentation: false }).then(o => {
                o.addRepresentation("cartoon", { color: 'bfactor' }); //schemeId });
                o.autoView();
            });
        }, 2000);

        // setTimeout(() =>
        //     this.state.stage.loadFile(pdb, { ext: "pdb", defaultRepresentation: true })
        // );
    }
    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div id={this.props.viewport} style={{ width: "100%", height: '700px' }}>
                        {/* {
                            this.state.outputPdb && <img src="" id="logo" className="App-logo" alt="logo" style={{ margin: "auto", display: this.state.pdb ? "none" : "block" }} />
                        } */}
                    </div>
                    <form id="pdbform" style={{ display: 'none' }}>
                        {/* <label>PDB File<input type="file" id="pdbfile" onChange={(e) => this.pdb(e.target)} /></label><br /> */}
                        <label>Paste PDB: <textarea rows="1" wrap="soft" cols="20" type="text" id="pdbtext" value={this.state.outputPdb} ref={this.input} /></label>
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