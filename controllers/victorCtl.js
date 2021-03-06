
var republican_stats = [];
//var apikey = 1234;


 module.exports.getLoadInitialData = (req,res) =>{
 	/*var key = req.query.apikey;
	if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
	
		republican_stats = [
		{ country : "Switzerland", year : 1648, gdppc : 58730, population : 8362000},
		{ country : "Argentina", year : 1816, gdppc : 22458, population : 43590000},
		{ country : "Venezuela", year : 1819, gdppc : 13633, population : 31029000},
		{ country : "Peru", year : 1824, gdppc : 11403, population : 31490000},
		{ country : "Colombia", year : 1819, gdppc : 11284, population : 48782000},
		{ country : "Brazil", year : 1889, gdppc : 10284, population : 206151000},
		{ country : "Liberia", year : 1847, gdppc : 855, population : 4132000},
		{ country : "Uruguay", year : 1828, gdppc : 21247, population : 3480000},
		{ country : "Mexico", year : 1867, gdppc : 18370, population : 12227300},
		{ country : "Paraguay", year : 1811, gdppc : 8717, population : 6855000},
		{ country : "Chile", year : 1818, gdppc : 23556, population : 18192000},
		{ country : "Austria", year : 1918, gdppc : 47031, population : 8736000},
		{ country : "Germany", year : 1918, gdppc : 46893, population : 82040000},
		{ country : "Poland", year : 1918, gdppc : 26210, population : 38514000},
		{ country : "Italy", year : 1946, gdppc : 35801, population : 60832000},
		{ country : "Turkey", year : 1923, gdppc : 20188, population : 79270000},
		{ country : "France", year : 1870, gdppc : 41018, population : 64629000},
		{ country : "Hungary", year : 1946, gdppc : 25891, population : 9807000},
		{ country : "Russia", year : 1917, gdppc : 24067, population : 14668300}];


		console.log("16 elements initialized.");
		res.sendStatus(201);
	//}

}

module.exports.getResources = (req,res) =>{
	var key=req.query.apikey;
	var limit = req.query.limit;
	var offset = req.query.offset;
	var fron = req.query.from;
	var to = req.query.to;
	var aux = [];
	var aux2 = [];
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		if (fron || to || limit || offset) {
			if (!fron)
				fron = 0;
			if (!to)
				to = 9999;
			if (!offset)
				offset = 0;
			if (!limit || limit > republican_stats.length)
				limit = republican_stats.length;
			for (var i = 0; i < republican_stats.length; i++) {//BUSQUEDA POR AÑOS
				if (republican_stats[i].year >= fron && republican_stats[i].year <= to)
					aux.push(republican_stats[i]);
					console.log("country", republican_stats[i].country);
			}
			for (var i = offset; i < aux.length; i++) {
				if (aux2.length <= (limit-1))
					aux2.push(aux[i]);
			}
		res.send(aux2);
		} else {
			console.log("New GET of all resources.");
			res.send(republican_stats);
		}
		/*
		if(from || to || limit || offset){
			for (var i = offset; i < limit; i++) {
				if (republican_stats[i].year >= from && republican_stats[i].year <= to ){
					aux.push(republican_stats[i])
				}
			}
			if (aux.length == 0){
				res.sendStatus(404);
			}
			res.send(aux);
		}else{
			res.send(republican_stats);
		}*/
		
		console.log("New GET of all resources.");
		console.log("From = "+ fron);
		console.log("To = "+ to);
		console.log("Limit = "+ limit);
		console.log("Offset = "+ offset);
	//}
}

module.exports.getData = (req,res) =>{
	//var key=req.query.apikey;
	var data = req.params.data;
	var aux = null;
	var aux2= [];
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		if(isNaN(data)){
			for (var i = 0; i < republican_stats.length; i++) {
				if (republican_stats[i].country == data){
					aux = republican_stats[i];
					res.send(aux);
				}
			}
		}else{
			for (var i = 0; i < republican_stats.length; i++) {
				if (republican_stats[i].year == data){
					aux2.push(republican_stats[i]);
				}
			}
			if (aux2.length == 0){
				res.sendStatus(404);
			}
			res.send(aux2);
		}

		if (aux == null) {
			res.sendStatus(404);
		}
		console.log("New GET of resource ");
	//}	
}
module.exports.getDataDouble = (req,res)=>{
	//var key=req.query.apikey;
	var country = req.params.country;
	var year = req.params.year;
	var aux= [];
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		if(isNaN(country)){
			for (var i = 0; i < republican_stats.length; i++) {
				if (republican_stats[i].country == country){
					for (var j = 0; j < republican_stats.length; j++)
						if(republican_stats[j].country == country && republican_stats[j].year == year ){
							aux.push(republican_stats[j]);
						}
				}
			}
			if (aux.length == 0){
					res.sendStatus(404);
			}	
			res.send(aux);
		}
		
		console.log("New GET of resource ");
	//}
}

module.exports.getPost = (req,res) =>{
	//var key=req.query.apikey;
	var stat = req.body;
	var no = 0;
	/*if (key != apikey || !key){
		res.sendStatus(401);
	}else{*/
		if (stat.country == null || stat.country == "" || !isNaN(stat.country) || isNaN(stat.year) || isNaN(stat.gdppc)|| isNaN(stat.population) ){
		 	res.sendStatus(400);
		}else {
			for (var i = 0; i < republican_stats.length; i++) {
				if (republican_stats[i].country == stat.country) {
	 				res.sendStatus(409);
	 				no = 1;
				} 
			}
			if (no != 1){
					republican_stats.push(stat);
					console.log("New POST of resource "+stat.country);
					res.sendStatus(201);
			}
		}
	//}
}


module.exports.getPostForbidden = (req,res) =>{
	/*var key=req.query.apikey;
	if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		res.sendStatus(405);
	//}
}

module.exports.getPut =  (req,res) =>{
	//var key=req.query.apikey;
	var stat = req.body;
	var aux = null;
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		if (stat.country == null || stat.country == "" || !isNaN(stat.country) || isNaN(stat.year) || isNaN(stat.gdppc)|| isNaN(stat.population) ){
		 	res.sendStatus(400);
		}else{
			for (var i = 0; i < republican_stats.length; i++) {
				if (republican_stats[i].country == req.params.country) {
					aux = republican_stats[i];
					if (req.params.country != stat.country) {
						res.sendStatus(400);
					}else{
						aux.country = stat.country;
						aux.year = stat.year;
						aux.gdppc = stat.gdppc;
						aux.population = stat.population;
						res.sendStatus(200);
					}
				}
			}
			if (aux == null) {
				res.sendStatus(404);
			}
		}

		console.log("New PUT of resource "+stat.country);
	//}	
}

module.exports.getPutYear = (req,res) =>{
	var key=req.query.apikey;
	var year = req.params.year;
	var country = req.params.country;

	var aux = null;
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		if(isNaN(country)){
			if (year<0 || year > 2016 || isNaN(year)){
			 	res.sendStatus(400);
			}else{
					for (var i = 0; i < republican_stats.length; i++) {
						if (republican_stats[i].country == country) {
							aux = republican_stats[i];
							aux.year = year;
							res.sendStatus(200);
						}/*if (republican_stats[i].country != country) {
							res.sendStatus(400)
						}*/
					}
			}
		}
		if(aux == null) {
			res.sendStatus(404);
		}
		console.log("New PUT of resource "+stat.country);
	//}	
}

module.exports.getPutForbidden =  (req,res) =>{
	/*var key=req.query.apikey;
	if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		res.sendStatus(405);
	//}
}

module.exports.getDelete = (req,res) =>{
	/*var key=req.query.apikey;
	if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		republican_stats = [];
		console.log("You DELETED all statistics");
		res.send(200);
	//}
}

module.exports.getDeleteOne = (req,res) =>{
	//var key=req.query.apikey;
	var country = req.params.country;
	var aux = null;
	/*if (key != apikey || !key){
		res.sendStatus(401);
	} else {*/
		for (var i = 0; i < republican_stats.length; i++) {
			if (republican_stats[i].country == country){
				aux = republican_stats[i];
				republican_stats.splice(i,1);
				res.send(200);
			}
		}
		if (aux == null) {
			res.sendStatus(404);
		}
		
		console.log("You deleted the country's statistics successfully.");
	//}	
}


