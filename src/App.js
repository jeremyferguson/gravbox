import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
class InputCell extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ch: ''};
        this.grid = props.grid;
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({ch:event.target.value});
    }
    render() {
        return (
            <input className = "inputCell" onChange = {this.handleChange}/>
        );
    }
}
class Grid extends React.Component {
    constructor(props) {
        super(props);
        this.height = props.height;
        this.width = props.width;
    }
    render() {
        return (
            {for (var i = 0; i < this.height; i ++ ) {
                for (var j = 0; j < this.width; j ++) {
                    <InputCell grid={this} />
                }
            }
            }
        );
}
class Selecter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {code: ''};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const requestOptions = {
            method: 'POST',
            cache: "no-cache",
            headers: {'content_type':'application/json' },
            body: JSON.stringify({ name: event.target.value})
        };
        fetch('/app/sample',requestOptions).then(res => res.json()).then(data => 	{
            this.setState({code: data});
        });
    }

    render() {
        return (
        <select id = 'sample_programs' onChange = {this.handleChange}>
            <option value='default'>Select sample program:</option>
            <option value='HelloWorld'>Hello, World!</option>
            <option value='forloop'>Basic For Loop</option>
            <option value='beer'>99 Bottles of Beer</option>
            <option value='factorial'>Factorial</option>
        </select>);
    }
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
          <Selecter />
          <Grid height = "20" width = "20"/> 
      </header>
    </div>
  );
}

export default App;
