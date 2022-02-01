require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios =require('axios');

const port=process.env.PORT;

const app =express();
app.use(cors());


app.use(function errorHandler (err, req, res, next) {
    let error ={
        status:500,
        err:'Sorry, something went wrong'
    };
    res.status(500).send(error)
  })


//   const moviedata =require ('./data.json');
let userSearch ="spider-Man"

app.get('/trending',trendingHandler);
app.get('/search',searchHandler);
app.get('/certification',certHandler);
app.get('/tv/popular',tvHandler);
app.get('*',notfoundHandler);

let urlTr =`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;
let urlSearch =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}&page=2`;
let urlCert =`https://api.themoviedb.org/3/certification/movie/list?api_key=${process.env.APIKEY}`;
let urlTvPop =`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.APIKEY}&language=en-US&page=1`;



// function Movie(title,poster_path,overview){
//     this.title=title,
//     this.poster_path=poster_path,
//     this.overview=overview
// }


// function moviefav(req,res){

//     let moviearr=new Movie(moviedata.title,moviedata.poster_path,moviedata.overview)
    
//     return res.status(200).json(moviearr)
// }

function Movie(id,title,release_date,poster_path,overview){
    this.id =id,
    this.title=title,
    this.release_date=release_date,
    this.poster_path=poster_path,
    this.overview=overview
    
}

function trendingHandler(req,res){
    let newarr=[];
    axios.get(urlTr)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new Movie(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        //console.log(newarr)
        res.status(200).json(newarr);

    }).catch((err)=>{
        errorHandler (err, req, res, next);
    })
};


function searchHandler(req,res){

    let newarr=[];
    axios.get(urlSearch)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new Movie(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        //console.log(newarr)
        res.status(200).json(newarr);

    }).catch((err)=>{
        errorHandler (err, req, res, next);

    })
};

function Certificat(certification,meaning){
    this.certification = certification,
    this.meaning =meaning 
}

function certHandler(req,res){
    let newarr=[];
    axios.get(urlCert)
    .then((result)=>{
        result.data.certifications.US.forEach((element) => {//US is a prpoerty inside certifications object which is data type is array 
            newarr.push(new Certificat(element.certification,element.meaning))
            
        })
        //console.log(newarr)
       res.status(200).json(newarr);

    }).catch((err)=>{
        errorHandler (err, req, res, next);

    })
    

    
};

function Tvpop(nametv,id,first_air_date,backdrop_path,overview,vote_average){
    this.name = nametv,
    this.id =id,
    this.first_air_date=first_air_date,
    this.backdrop_path=backdrop_path,
    this.overview=overview,
    this.vote_average=vote_average
    
}

function tvHandler(req,res){
    let newarr=[];
    axios.get(urlTvPop)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new Tvpop(element.name,element.id,element.first_air_date,element.backdrop_path,element.overview,element.vote_average))
        })
        //console.log(newarr)
        res.status(200).json(newarr);

    }).catch((err)=>{
        errorHandler (err, req, res, next);
    })
    
};



function notfoundHandler(req,res){
    return res.status(404).send('huh????')

};



app.listen(port, ()=> {
    console.log(`listen to port ${port}`)
});

