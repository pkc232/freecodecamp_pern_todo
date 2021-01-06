import React, { Component, Fragment } from 'react';

class InputTodo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            description: ""
        };
        this.onSubmitForm = this.onSubmitForm.bind(this);

    };

    setDescription(val){
        this.setState({
            description: val
        }
        );
    }

    async onSubmitForm(e){
        e.preventDefault();

        try{
            const body = {description: this.state.description};
            const response = await fetch("http://localost:5000/todos", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(body)
            });
            console.log(response);
        } 
        catch(err){
            console.log(err.message);
        }
    };
    
    render() {
        return (
            <Fragment>
                <h1 className="text-center mt-5">Pern Todo List</h1>
                <form className="d-flex mt-5" onSubmit={this.onSubmitForm}>
                    <input type="text" className="form-control" 
                    value={this.state.description}
                    onChange={e => this.setDescription(e.target.value)}
                    />
                    <button className="btn btn-success">Add</button>
                </form>
            </Fragment>
        );
    }
}

export default InputTodo;