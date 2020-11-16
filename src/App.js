import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
class Selecter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {code: ''}
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const requestOptions = {
            method: 'POST',
            cache: "no-cache",
            headers: {'content_type':'application/json' },
            body: JSON.stringify({ name: event.target.value})
        };
        fetch('/app/sample',requestOptions).then(res => res.json()).then(data => {
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
      </header>
    </div>
  );
}

export default App;
