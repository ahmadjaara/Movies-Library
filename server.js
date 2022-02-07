require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios =require('axios');

const pg =require('pg');//it provide 
const { database } = require('pg');

// const client = new pg.Client(process.env.DATABASE_URL);
const client = new pg.Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})


const port=process.env.PORT;

const app =express();
app.use(cors());
app.use(express.json());





//   const moviedata =require ('./data.json');
// let userSearch ="spider-Man"

app.get('/trending',trendingHandler);
app.get('/search',searchHandler);
app.get('/certification',certHandler);
app.get('/tv/popular',tvHandler);


app.post('/addMovie',addMovie);//crud operation for databse create read update delete\drop==>http method :post get put delete
app.get('/getMovies',getMovie);



app.get('/oneFilm/:id',oneFilmHandler);


app.put('/updatefilm/:id',updatefilmHandler); // the name param is just for testing 
app.delete('/deletefilm/:id',deletefilmHandler);


app.get('*',notfoundHandler);
app.use(errorHandler) ;
let urlTr =`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.APIKEY}`;

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

    }).catch((error)=>{
       errorHandler (error,req,res);
    })
};


function searchHandler(req,res){
    let userSearch =req.query.userSearch;
    let urlSearch =`https://api.themoviedb.org/3/search/movie?api_key=${process.env.APIKEY}&language=en-US&query=${userSearch}&page=2`;
    let newarr=[];
    axios.get(urlSearch)
    .then((result)=>{
        result.data.results.forEach((element) => {
            newarr.push(new Movie(element.id,element.title,element.release_date,element.poster_path,element.overview))
        })
        //console.log(newarr)
        res.status(200).json(newarr);

    }).catch((error)=>{
        errorHandler (error,req,res);
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

    }).catch((error)=>{
       errorHandler (error,req,res);
    })};

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

    }).catch((error)=>{
       errorHandler (error,req,res);
    })
    
};

function addMovie(req,res){
console.log(req.body);    
let sql = `INSERT INTO MoviesLibrary (title,release_date,poster_path,overview)VALUES($1,$2,$3,$4) RETURNING*;`
let values=[req.body.title,req.body.release_date,req.body.poster_path,req.body.overview];
client.query(sql,values)
.then(data =>{
res.status(200).json(data.rows);})
.catch((error)=>{
       errorHandler(error,req,res)});
};



function getMovie(req,res){
    let sql = `SELECT * FROM MoviesLibrary;`
    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}


function oneFilmHandler(req,res){

    let sql = `SELECT * FROM MoviesLibrary WHERE id=${req.params.id};`;
    // let sql = `SELECT * FROM favRecipes WHERE readyInMinutes<60;`;

    client.query(sql).then(data=>{
       res.status(200).json(data.rows);
    }).catch(error=>{
        errorHandler(error,req,res)
    });
}
function updatefilmHandler (req,res){
    const id = req.params.id;
    //console.log(req.params.name);
    //const film = req.body;
    const sql = `UPDATE MoviesLibrary SET title =$1 , release_date=$2 WHERE id=${req.params.id} RETURNING *;` 
    let values=[req.body.title,req.body.release_date];
    client.query(sql,values).then(data=>{
        res.status(200).json(data.rows);
    }).catch(error=>{
       errorHandler(error,req,res)
    });
};


    function deletefilmHandler(req,res){
        const id = req.params.id;
        const sql = `DELETE FROM MoviesLibrary WHERE id=${id};` 
        // DELETE FROM table_name WHERE condition;
    
        client.query(sql).then(()=>{
            res.status(200).send("The film has been deleted");
            // res.status(204).json({});
        }).catch(error=>{
            errorHandler(error,req,res)
        });
    };


function notfoundHandler(req,res){
    return res.status(404).send('huh????')

};

function errorHandler (error,req,res){
    const err = {
        status : 500,
        messgae : "error"
        };
    res.status(500).send(err)}
    

client.connect().then(()=>{
    app.listen(port, ()=> {
        console.log(`listen to port ${port}`)
    })
})
