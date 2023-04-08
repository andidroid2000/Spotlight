//pachete utilizate
const express = require('express');
const fs = require ('fs');
const path = require('path');
const sharp = require('sharp');
const {Client} =require('pg');
const url = require('url');
const { exec } = require("child_process");
const ejs=require('ejs');
const router = express.Router();

var app = express();

app.set("view engine", "ejs");
app.use("/resurse",express.static(__dirname+"/resurse"));

const client = new Client({
    host:'localhost',
    port:5432,
    user:'toader',
    password:'parolica',
    database:'filme'
});

client.connect();

function verificaImagini(){
	var textFisier=fs.readFileSync("resurse/json/galerie.json"); //citeste tot fisierul
	var jsi=JSON.parse(textFisier); //am transformat in obiect
	var caleGalerie=jsi.cale_galerie;
    let vectImagini=[]
	for (let im of jsi.imagini){
		var imgMare= path.join(caleGalerie, im.fisier);//obtin calea completa (im.fisier are doar numele fisierului din folderul caleGalerie)
		var ext = path.extname(im.fisier);//obtin extensia
		var numeFisier =path.basename(im.fisier,ext)//obtin numele fara extensie
		let imgMica=path.join(caleGalerie+"/mic/", numeFisier+"-mic"+".webp");//creez cale apentru imaginea noua; prin extensia wbp stabilesc si tipul ei
        let imgMedie = path.join(caleGalerie+"/mediu/", numeFisier+"-mediu"+".webp");
        vectImagini.push({mare:imgMare, mediu:imgMedie, mic:imgMica, descriere:im.descriere, titlu:im.titlu, timp:im.timp}); //adauga in vector un element
		if (!fs.existsSync(imgMica))//daca nu exista imaginea, mai jos o voi crea
		sharp(imgMare)
		  .resize(150) //daca dau doar width(primul param) atunci height-ul e proportional
		  .toFile(imgMica, function(err) {
              if(err)
			    console.log("eroare conversie",imgMare, "->", imgMica, err);
		  });
        if (!fs.existsSync(imgMedie))
          sharp(imgMare)
            .resize(250) 
            .toFile(imgMedie, function(err) {
                if(err)
                  console.log("eroare conversie",imgMare, "->", imgMedie, err);
            });
	}
    return vectImagini;
}
function galerieStatica(imagini){
    //obtin ora curenta - ora
    var d = new Date();
    var timp_ora = d.getHours();
    let vectFinalImagini =[];
    for (let imag of imagini)
    {
        //obtin intervalul orar corespunzator imaginii si il incarc intr-un vector: [ora1, min1, ora2, min2]      
        let interval_orar = imag.timp.replace('-',':').split(':');
        //Verific care imagini sunt potrivite pentru ora actuala a server-ului
        if(interval_orar[0]<=timp_ora && interval_orar[2]>timp_ora )
        {
            vectFinalImagini.push(imag);
        }
    }
    while(vectFinalImagini.length > 10)
    {
        vectFinalImagini.pop();
    }
    return vectFinalImagini;
}
function galerieAnimata(imagini)
{
    let nrImag = [7, 8, 9, 11];
    let nrRand = nrImag[Math.floor(Math.random() * nrImag.length)];
    let vectImagFinal = [];
    while(nrRand>0)
    {
        var poz = Math.floor(Math.random()* imagini.length);
        if(!vectImagFinal.includes(imagini[poz]))
        {
            vectImagFinal.push(imagini[poz]);
            nrRand--;
        }
    }
    return vectImagFinal;
}
//imagini galerie statica
let galImag = verificaImagini();
let galImagStat = galerieStatica(galImag);
//imagini galerie animata
//let galImagAnimata = galerieAnimata(galImag);
//console.log(galImagAnimata);

app.get("*/galerie.json", function(req, res){
    res.status(403).render("pagini/403");
})
app.get("*/galerie-animata.css",function(req, res){
    res.setHeader("Content-Type","text/css");//pregatesc raspunsul de tip css
    let sirScss=fs.readFileSync("./resurse/scss/galerie-animata.scss").toString("utf-8");//citesc scss-ul ca string
    let galImagAnimata = galerieAnimata(galImag);
    let nrImagini = galImagAnimata.length;
    let rezScss=ejs.render(sirScss,{nrImagini});// transmit culoarea catre scss si obtin sirul cu scss-ul compilat
    fs.writeFileSync("./temp/galerie-animata.scss",rezScss);//scriu scss-ul intr-un fisier temporar
    exec("sass ./temp/galerie-animata.scss ./temp/galerie-animata.css", (error, stdout, stderr) => {//execut comanda sass (asa cum am executa in cmd sau PowerShell)
        if (error) {
            console.log(`error: ${error.message}`);
            res.end();//termin transmisiunea in caz de eroare
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            res.end();
            return;
        }
        //totul a fost bine, trimit fisierul rezultat din compilarea scss
        res.sendFile(path.join(__dirname,"temp/galerie-animata.css"));
    });
});
app.get("/cinema", function(req, res){
    let conditie= req.query.tip ?  " and categ_prod='"+req.query.tip+"'" : "";//verific care e paramatrul primit (care e optional)
    client.query("select * from date_productii where 1=1"+conditie, function(err,rez){
        client.query("select unnest(enum_range( null::categ_productie)) as categ", function(err,rez2){//selectez toate valorile posibile din enum-ul categ_productie
            client.query("select unnest(enum_range( null::tara_productie)) as tari", function(err, rez3){
                let l = ["Ianuarie", "Februarie", "Martie", "Aprilie", "Mai", "Iunie", "Iulie", "August", "Septembrie", "Octombrie", "Noimebrie", "Decembrie"];
                let z = ["Duminică", "Luni", "Marți", "Miercuri", "Joi", "Vineri", "Sâmbătă"];
                res.render("pagini/cinema", {filme:rez.rows, categorii:rez2.rows, tari:rez3.rows, luni:l, zile:z});
            });
        });
    });
});

app.get("/cinema/:id",function(req, res){
    console.log(req.params);
    const rezultat= client.query("select * from date_productii where id_prod="+req.params.id, function(err,rez){
        //console.log(err, rez);
        console.log(rez.rows);
        res.render("pagini/film", {prod:rez.rows[0], imagini: galImagStat});
    });
});
//ca sa putem accesa home atat cu local, cat si cu /index + obtinerea IP-ului;
app.get(["/","/index"],function(req, res){
    const ip = req.ip;
    console.log(ip);
    let galImagAnimata = galerieAnimata(galImag);
    res.status(403).render("pagini/index", {ip: ip, imagini: galImagStat, galImagAnimata}); 
});
app.get("/*",function(req, res){   
    if(req.url.includes("scss"))
    {
        res.end();
        return;
    }
    if(req.url.includes("map"))
    {
        res.end();
        return;
    }
    res.render("pagini"+req.url, function(err,rezultatRandare){
        if(err){
            if(err.message.includes("Failed to lookup view")){
                res.status(404).render("pagini/404");
            }
            else 
                throw err;
        }
        else{
            res.send(rezultatRandare);
        }
    });  
});

app.listen(8081, '0.0.0.0');
console.log(">>Server pornit: port 8081;");
