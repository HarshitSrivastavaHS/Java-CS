const express = require("express")
const path = require("path")
const app = express();
const port = 3000;

const fs = require("fs")
const programsData = require('./data/programs.json');
const programsDataInReverse = [...programsData];
programsDataInReverse.reverse();
const req = require("express/lib/request");

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index', { programs: programsData, year: programsByYear , keys: sortedKeys , active: "home", recent: programsDataInReverse.slice(0,4)});
  });

app.get('/program/:id', (req, res) => {
    const programId = req.params.id;
    const program = programsData.find(item => item.id == programId);
    if (program) {
        let solution = readSolutionCode(program.solution); 
        res.render('program', { program, solution, active: "" });
    } else {
        res.status(404).render("404", {active: ""});
    }
});

app.get('/search', (req, res) => {
    const query = req.query.query.toLowerCase();
    const searchResults = programsData.filter((program) => {
      return program.name.toLowerCase().includes(query);
    });
    res.render('search', { programs: programsData, searchResults, searchQuery: query, active: "" });
});

app.get("/about", (req, res)=> {
    res.render("about", { active: "about"})
})

app.get("/year", (req, res)=>{
    res.render("years", {years: sortedKeys, programs: programsByYear , active: "years"})
})

app.get("/year/:id", (req, res)=>{
    let yearData = programsByYear[req.params.id];
    if (!yearData){
        res.status(404).render("404", {active: ""})
    }
    else {
        res.render("year", {programs: programsData, ID: yearData, year: req.params.id, active: ""})
    }
})

app.get('/*', (req, res)=> {
    res.status(404).render("404", {active: ""});
})

app.listen(port, ()=>{
    console.log(`The app is listening at port ${port}`)
})

function readSolutionCode(filePath) {
    try {
        const solution = fs.readFileSync(filePath, 'utf-8')
        return solution
    } catch (err) {
        console.error(`Error reading in solution code: ${err}`)
        return "Error";
    }
}

const programsByYear = {};

programsData.forEach((program)=>{
    const {id, years} = program
    years.map((year)=>{
        if (!programsByYear[year]) {
            programsByYear[year] = [id];
        }
        else {
            programsByYear[year].push(id);
        }
    })
})
const sortedKeys = Object.keys(programsByYear).sort((a, b) => b - a);