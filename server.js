const express = require('express');
const cors = require('cors');

const app =express();
app.use(cors());


app.use(function (err, req, res, next) {
    
    res.status(500).send('Sorry, something went wrong')
  })


  const moviedata =require ('./data.json');


app.get('/',moviefav);
app.get('/favorite',filmfav);
app.get('*',notfoundHandler);

function Movie(title,poster_path,overview){
    this.title=title,
    this.poster_path=poster_path,
    this.overview=overview
}


function moviefav(req,res){

    let moviearr=new Movie(moviedata.title,moviedata.poster_path,moviedata.overview)
    
    return res.status(200).json(moviearr)
}

function filmfav(req,res){
    return res.status(200).send("Welcome to Favorite Page");

}

function notfoundHandler(req,res){
    return res.status(404).send('huh????')

}


app.listen(3000, ()=> {
    console.log("listen to port 3000")
})

