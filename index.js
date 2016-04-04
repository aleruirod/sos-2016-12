var express = require("express");

var app = express();

var bodyParser = require("body-parser");

app.use(bodyParser.json());

app.use("/",express.static(__dirname+"/static"));

var p = (process.env.PORT || 16666);

app.get("/time",(req,res) => {

	var now = new Date();
	res.write("It is "+now);
	res.end();
})


//Codigo Ale API de prueba (games) ###############################################


var games = [];

app.get("/api-test/games/loadInitialData", (req,res) =>{
	games = [{ name : "cod", PEGI : "18"},{ name : "GTA", PEGI : "18"}];
	console.log("2 elements initialized.");
	res.sendStatus(201);
});

app.get("/api/sandbox/games/", (req,res) =>{
	console.log("New GET of all resources.");
	res.send(games);
});

app.get("/api/sandbox/games/:name", (req,res) =>{
	var name = req.params.name;
	var aux = null;
	for (var i = 0; i < games.length; i++) {
		if (games[i].name == name){
			aux = games[i];
			res.send(aux);
		}
	}
	if (aux == null) {
		res.sendStatus(404);
	}
	console.log("New GET of resource "+name);
	
	
});

app.post("/api/sandbox/games", (req,res) =>{
	var game = req.body;
	games.push(game);
	console.log("New POST of resource "+game.name);
	res.sendStatus(201);
});

app.post("/api/sandbox/games/:name", (req,res) =>{
	res.sendStatus(405);
});

app.put("/api/sandbox/games/:name", (req,res) =>{
	var game = req.body;
	var aux = null;
	for (var i = 0; i < games.length; i++) {
		if (games[i].name == req.params.name) {
			aux = games[i];
			aux.name = game.name;
			aux.PEGI = game.PEGI;
			res.sendStatus(200);
		}
	}
	if (aux == null) {
		res.sendStatus(404);
	}
	console.log("New PUT of resource "+game.name);
	
});

app.put("/api/sandbox/games", (req,res) =>{
	res.sendStatus(405);
});

app.delete("/api/sandbox/games", (req,res) =>{
	games = [];
	console.log("You DELETED all games :(");
	res.send(200);
});

app.delete("/api/sandbox/games/:name", (req,res) =>{
	var name = req.params.name;
	var aux = null;
	for (var i = 0; i < games.length; i++) {
		if (games[i].name == name){
			aux = games[i];
			games.splice(i,1);
			res.send(200);
		}
	}
	if (aux == null) {
		res.sendStatus(404);
	}
	console.log("You deleted the game successfully.");
	
});

// Codigo de Ale API principal (death-penalty-stats)

var death_penalty_stats = [];

app.get("/api/v1/death_penalty_stats/loadInitialData", (req,res) =>{
	death_penalty_stats = [{ country : "SPAIN", abolition_year : 1995, for_all_crimes : "yes", murder_rate_per_100k_people : 0.8},
	{ country : "GERMANY", abolition_year : 1987, for_all_crimes : "yes", murder_rate_per_100k_people : 0.8},
	{ country : "PERU", abolition_year : 1979, for_all_crimes : "no", murder_rate_per_100k_people : 9.6},
	{ country : "TURKEY", abolition_year : 1984, for_all_crimes : "no", murder_rate_per_100k_people : 2.6},
	{ country : "SWEDEN", abolition_year : 1972, for_all_crimes : "yes", murder_rate_per_100k_people : 0.7}];
	console.log("5 elements initialized.");
	res.sendStatus(201);
});

app.get("/api/v1/death_penalty_stats", (req,res) =>{
	var auxList = [];
	var auxList1 = [];
	var fro = req.query.from;
	var to = req.query.to;
	var limit = req.query.limit;
	var offset = req.query.offset;
	
	if (fro || to) {
		if (!fro)
			fro = 0;
		if (!to)
			to = 9999;
		for (var i = 0; i < death_penalty_stats.length; i++) {//BUSQUEDA POR AÑOS
			if (death_penalty_stats[i].abolition_year >= fro && death_penalty_stats[i].abolition_year <= to) {
				auxList.push(death_penalty_stats[i]);
			}
		}
		if (!offset)
			offset = 0;
		if (!limit || limit > death_penalty_stats.length)
			limit = death_penalty_stats.length;
		if (fro = 0 && to = 9999) {//PAGINACION SI NO SE HA UTILIZADO BUSQUEDA EN LA PETICION
			for (var i = offset; i < death_penalty_stats.length; i++) {
				if (auxList.length <= (limit-1))
					auxList.push(death_penalty_stats[i]);
			}
		res.send(auxList);
		} else {//PAGINACION SI SE HA UTILIZADO BUSQUEDA EN LA PETICION
			for (var i = offset; i < auxList.length; i++) {
				if (auxList1.length <= (limit-1))
					auxList1.push(auxList[i]);
			}
		res.send(auxList1);
		}
	} else {
		console.log("New GET of all resources.");
		res.send(death_penalty_stats);
	}
});

app.get("/api/v1/death_penalty_stats/:country", (req,res) =>{
	var country = req.params.country;
	var aux = null;
	if (isNaN(country)) {
		for (var i = 0; i < death_penalty_stats.length; i++) {
			if (death_penalty_stats[i].country == country){
				aux = death_penalty_stats[i];
				res.send(aux);
			}
		}
	}else {
		for (var i = 0; i < death_penalty_stats.length; i++) {
			if (death_penalty_stats[i].abolition_year == country){
				aux = death_penalty_stats[i];
				res.send(aux);
			}
		}
	}
		
	if (aux == null) {
		res.sendStatus(404);
	}
	console.log("New GET of resource "+country);
	
});



app.post("/api/v1/death_penalty_stats", (req,res) =>{
	var stat = req.body;
	var no = 0;
	if (stat.country == null || stat.country == "" || !isNaN(stat.country) || isNaN(stat.abolition_year)
	 	|| (stat.for_all_crimes != "yes" && stat.for_all_crimes != "no") || isNaN(stat.murder_rate_per_100k_people) || stat.murder_rate_per_100k_people == null 
	 	|| stat.murder_rate_per_100k_people == "" ) {
	 	res.sendStatus(400);
	 } else {
		for (var i = 0; i < death_penalty_stats.length; i++) {
			if (death_penalty_stats[i].country == stat.country) {
	 			res.sendStatus(409);
	 			no = 1;
			} 
		}
		if (no != 1){
		death_penalty_stats.push(stat);
		console.log("New POST of resource "+stat.country);
		res.sendStatus(201);
		}
	}
});

app.post("/api/v1/death_penalty_stats/:country", (req,res) =>{
	res.sendStatus(405);
});

app.put("/api/v1/death_penalty_stats/:country", (req,res) =>{
	var stat = req.body;
	var aux = null;
	if (stat.country == null || stat.country == "" || !isNaN(stat.country) || isNaN(stat.abolition_year)
	  	|| (stat.for_all_crimes != "yes" && stat.for_all_crimes != "no") || isNaN(stat.murder_rate_per_100k_people) || stat.murder_rate_per_100k_people == null 
	  	|| stat.murder_rate_per_100k_people == "" ) {
	 	res.sendStatus(400);
	 } else {
		for (var i = 0; i < death_penalty_stats.length; i++) {
			if (death_penalty_stats[i].country == req.params.country) {
				aux = death_penalty_stats[i];
				if (aux.country != stat.country) {
					sendStatus(400);
				} else {
				aux.country = stat.country;
				aux.abolition_year = stat.abolition_year;
				aux.for_all_crimes = stat.for_all_crimes;
				aux.murder_rate_per_100k_people = stat.murder_rate_per_100k_people;
				res.sendStatus(200);
				}
			}
		}
		if (aux == null) {
			res.sendStatus(404);
		}
	}
	console.log("New PUT of resource "+stat.country);
	
});

app.put("/api/v1/death_penalty_stats", (req,res) =>{
	res.sendStatus(405);
});

app.delete("/api/v1/death_penalty_stats", (req,res) =>{
	death_penalty_stats = [];
	console.log("You DELETED all statistics :(");
	res.send(200);
});

app.delete("/api/v1/death_penalty_stats/:country", (req,res) =>{
	var country = req.params.country;
	var aux = null;
	for (var i = 0; i < death_penalty_stats.length; i++) {
		if (death_penalty_stats[i].country == country){
			aux = death_penalty_stats[i];
			death_penalty_stats.splice(i,1);
			res.send(200);
		}
	}
	if (aux == null) {
		res.sendStatus(404);
	}
	console.log("You deleted the country's statistics successfully.");
	
});

// //#####################################################
// //#####################################################





var victorCtl = require('./controllers/victorCtl.js');

app.get("/api/v1/republican_stats/loadInitialData", victorCtl.getLoadInitialData);

app.get("/api/v1/republican_stats", victorCtl.getResources);

app.get("/api/v1/republican_stats/:data", victorCtl.getData);

app.get("/api/v1/republican_stats/:country/:year", victorCtl.getDataDouble);

app.post("/api/v1/republican_stats", victorCtl.getPost);

app.post("/api/v1/republican_stats/:country", victorCtl.getPostForbidden);

app.put("/api/v1/republican_stats/:country",victorCtl.getPut);

app.put("/api/v1/republican_stats/:country/:year", victorCtl.getPutYear);

app.put("/api/v1/republican_stats", victorCtl.getPutForbidden);

app.delete("/api/v1/republican_stats", victorCtl.getDelete);


app.delete("/api/v1/republican_stats/:country", victorCtl.getDeleteOne);




//Código Víctor API prueba (pirates)

var apiratesCtl = require('./controllers/apiratesCtl.js');



app.get("/api/sandbox/pirates", apiratesCtl.getResources);

app.get("/api/sandbox/pirates/:name", apiratesCtl.getPirate);

app.get("/api/sandbox/loadInitialData", apiratesCtl.getLoadInitialData);

app.post("/api/sandbox/pirates", apiratesCtl.getPost);


app.post("/api/sandbox/pirates/:name", function(req,res){
	res.sendStatus(403);
});

app.put("/api/sandbox/pirates/:name", apiratesCtl.getPut);

app.put("/api/sandbox/pirates", function(req,res){
	res.sendStatus(403);
});

app.delete("/api/sandbox/pirates", apiratesCtl.getDelete);

app.delete("/api/sandbox/pirates/:name", apiratesCtl.getDeleteOne);


app.listen(p);    