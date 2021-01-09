import React, { Component, Fragment, useEffect } from 'react';
import EditTodo from "./EditTodo"

class ListTodos extends Component {

    constructor(props) {
        super(props);
        this.state = {
            todos: []
        };
    }

    setTodos(todoList){
        this.setState({
            todos: todoList
        });
    }
    

    async getTodos(){
        try{
            const response = await fetch("/todos");
            const jsonData = await response.json();
            this.setTodos(jsonData);
        }
        catch(err){

        }
    }

    async deleteTodo(todoId){
        try{
            const response = await fetch(`/todos/${todoId}`, {
                method: "DELETE",
                headers: {"Content-Type": "application/json"},
            });
            const jsonData = await response.json();
            this.setTodos(jsonData);
        }
        catch(err){
            console.log(err);
        }
    }

    // async editTodo(todoId){
    //     try{
    //         const response = await fetch(`http://localhost:5000/todos/${todoId}`, {
    //             method: "PUT",
    //             headers: {"Content-Type": "application/json"},
    //         });
    //     }
    //     catch(err){
    //         console.log(err);
    //     }
    // }
    
    componentDidMount(){
        this.getTodos();
    }

    getTableComponent(){
        return this.state.todos.map((todo) => {
            return (
                <tr key={todo.todo_id}>
                    <td>{todo.description}</td>
                    <td><button>Edit</button></td>
                    <td><button 
                            className="btn btn-danger"
                            onClick={() => this.deleteTodo(todo.todo_id)}>
                            Delete
                            </button
                            ></td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Fragment>
                <table class="table mt-5 text-center">
                    <thead>
                        <tr>
                        <th scope="col">Description</th>
                        <th scope="col">Edit</th>
                        <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.getTableComponent()}
                    </tbody>
                    </table>
            </Fragment>
        );
    }
}

export default ListTodos;