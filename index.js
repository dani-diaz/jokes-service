const express = require('express');
const app = express();
const { Joke } = require('./db');
const {Op} = require("sequelize")


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.get('/jokes', async (req, res, next) => {
  try {
    // TODO - filter the jokes by tags and content
    const {tags, content}=req.query;
    let where ={}
    if(tags){
      where.tags={[Op.like]: `%${tags}%`} 
    }if(content){
      where.joke ={[Op.like]:`%${content}%`}
    }
    const jokes = await Joke.findAll({where});
    res.send(jokes);
   
  } catch (error) {
    console.error(error);
    next(error)
  }
  
});

app.delete('/jokes:id', async (req, res, next) => {
  try {
    const jokeId = req.params.id;
    const joke = await Joke.findByPk(jokeId);
    if(!joke){
      res.status(404).send('Joke not found');
    } else {
      await joke.destroy();
      res.send('Joke deleted');
    }
  } catch (error) {
    console.error(error);
    next(error)
  }
});


// we export the app, not listening in here, so that we can run tests
module.exports = app;
