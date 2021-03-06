const express = require('express');
const passport = require("passport");
const cookieSession = require('cookie-session');
const app = express();
const cors = require("cors");
const pool = require("./db");
const path = require("path");
require('./passport-setup');

const PORT = process.env.PORT || 5000;

//process.env.PORT
//process.env.NODE_ENV => production or undefined

//middleware
app.use(cors());
app.use(express.json()); //req.body

// app.use(express.static(path.join(__dirname, "client/build")));

if(process.env.NODE_ENV === "production"){
    //serve static content
    //npm run build
    app.use(express.static(path.join(__dirname, "client/build")));
}

app.use(cookieSession({
    name: `todo-session`,
    keys: [`key1`, `key2`]
}));

app.use(passport.initialize());
app.use(passport.session());

//ROUTES//
app.get('/failed', (req, res) => res.send('You failed to login!'));
app.get('/good', (req, res) => res.send(`Welcome ${req.user.email}`));

app.get('/',
  passport.authenticate('google', { scope:
      [ 'email', 'profile' ] }
));

app.get( '/google/callback',
    passport.authenticate( 'google', {
        successRedirect: '/good',
        failureRedirect: '/failed'
}));



//create a todo

app.post("/todos", async (req, res) => {
    try{
        const {description} = req.body;
        const newTodo = await pool.query(
            "INSERT into todo (description) values($1) returning *",
            [description]
            );
        console.log(req.body);
        res.json(newTodo.rows[0]);
    } catch(err){
        console.log(err.message);
    }
});

//get all todos

app.get("/todos", async(req, res) => {
    console.log("I got the request");
    try{
        const allTodos = await pool.query("select * from todo");
        res.json(allTodos.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

//get a todo

app.get("/todos/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const todo = await pool.query("select * from todo where todo_id=$1", [id]);
        res.json(todo.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
    try{
        const {id} = req.params;
        const {description} = req.body;
        const updateTodo = await pool.query("update todo set description = $1 where todo_id = $2",
         [description, id]);
        res.json("todo was updated");
        
    } catch(err){
        console.log(err.message);
    }
});

//delete a todo
app.delete("/todos/:id", async(req, res) => {
    try{
        const {id} = req.params;
        const deleteTodo = await pool.query("delete from todo where todo_id=$1", [
            id
        ]);
        const newTodos = await pool.query("select * from todo")
        res.json(newTodos.rows);
    }
    catch(err){
        console.log(err.message);
    }
});

// app.get("*", (req, res) => {
//     res.sendFile(path.join(__dirname, "client/build/index.html"));
// })

app.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
})