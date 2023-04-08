window.onload=function(){

    var rng=document.getElementById("id_nota");
	rng.parentNode.insertBefore(document.createTextNode(rng.min),rng);
	rng.parentNode.appendChild(document.createTextNode(rng.max));
    let spval=document.createElement("span");
	rng.parentNode.appendChild(spval)
    rng.value=0;
    spval.innerHTML=" ("+rng.value+")";
    rng.onchange=function(){
        rng.nextSibling.nextSibling.innerHTML=" ("+this.value+")";
    }

    let btn=document.getElementById("filtrare");
    btn.onclick=function(){
        
        const filtrare_nume = document.getElementById("titlu_prod").value;
        if (!filtrare_nume.match(/^[a-zA-Z0-9 :.-]*$/))
            alert("Numele indrodus conține caractere nepermise!");
        else{
        
            const filtrare_nota = document.getElementById("id_nota").value;
            var radiobuttons=document.getElementsByName("gr_rad");		
		    sir="";
            for(let rad of radiobuttons)
                if(rad.checked)
                {
                    sir=rad.value;
                    break;
                }

            var optiuni=document.getElementById("i_sel_multiplu").options;		
            categorii=[];
            for(let opt of optiuni){
                if(opt.selected)
                    categorii.push(opt.value);
                }
            lungime = categorii.length; 

            var checkedValue = null; 
            var inputElements = document.getElementsByClassName('messageCheckbox');
            for(var i=0; inputElements[i]; ++i){
                  if(inputElements[i].checked){
                       checkedValue = inputElements[i].value;
                       break;
                  }
            }
				
            const sel_simplu=document.getElementById("tara").value;
            const productii=document.getElementsByClassName("produs");
            an_curent = new Date().getFullYear();

        for (let prod of productii){
            prod.style.display="none";

            const gen = prod.querySelector(".val-genuri").innerText;
            const nume = prod.querySelector(".val-nume").innerText;
            const nota = parseFloat(prod.querySelector(".val-nota").innerText);
            const an = parseInt(prod.querySelector(".an").innerText);
            const copii= prod.getElementsByClassName("val-copii")[0].innerHTML;
            const tara = prod.querySelector(".val-tara").innerText;
            
            let v1 = nume.toLowerCase().includes(filtrare_nume.toLowerCase());
            let v2 = nota >= filtrare_nota;
            let v3 = sir =="toate" || ((sir == "true") && (copii == "true")) || ((sir == "false") && (copii == "false"));
            let v4 = checkedValue == null || (checkedValue == "10" && an == an_curent);
            ok = 0
            for(let c of categorii)
                if(gen.includes(c))
                {
                    ok += 1;
                }
            let v5 = ok == lungime;
            var v6 = 0;
            if(sel_simplu =="toate")
            {
                v6 += 1;
            }
            else if(tara == sel_simplu)
            {
                v6 += 1;
            }

            console.log(v6);

            if (v1 && v2 && v3 && v4 && v5 && v6)
            prod.style.display="block";
        }
        }
    }
    btn=document.getElementById("afis_fil");
    btn.onclick=function() {
        var x = document.getElementById("afis");
        if (x.style.display === "none") {
          x.style.display = "block";
          document.getElementById("afis_fil").innerHTML="Ascunde filtre";
        } else {
          x.style.display = "none"
          document.getElementById("afis_fil").innerHTML="Afișează filtre";
        }
      }
    function sortArticole(factor){
        
        const productii=document.getElementsByClassName("produs");
        let arrayProduse=Array.from(productii);
        arrayProduse.sort(function(art1,art2){
            let nume1=art1.getElementsByClassName("val-nume")[0].innerHTML;
            let nume2=art2.getElementsByClassName("val-nume")[0].innerHTML;
            let nota1= parseFloat(art1.getElementsByClassName("val-nota")[0].innerHTML);
            let nota2= parseFloat(art2.getElementsByClassName("val-nota")[0].innerHTML);
            let rez = factor*(nota1-nota2);
            if (rez==0)
                return factor*nume1.localeCompare(nume2)
            return rez;
        });
        console.log(arrayProduse); 
        for (let prod of arrayProduse){
            prod.parentNode.appendChild(prod);
        }
    }

    btn=document.getElementById("sortCrescNume");
    btn.onclick=function(){
        sortArticole(1);
    }
    btn=document.getElementById("sortDescrescNume");
    btn.onclick=function(){
        sortArticole(-1);
    }

    btn=document.getElementById("calculeaza");
    btn.onclick=function(){
        const produse=document.getElementsByClassName("produs");
        sumaNote=0;
        nr=0;
        for (let prod of produse){
            if(prod.style.display == "block")
            {
                sumaNote+= parseFloat(prod.getElementsByClassName("val-nota")[0].innerHTML);
                nr+=1;
            }
        }
        let infoSuma=document.createElement("div");
        let aux = (sumaNote/nr + "").substring(0,4);
        infoSuma.innerHTML=">>pentru produsele selectate, nota medie este: "+ aux;
        infoSuma.className="info-produse";
        let p=document.getElementById("medie")
        p.parentNode.insertBefore(infoSuma,p.nextSibling);
        setTimeout(function(){infoSuma.remove()}, 2000);
    }

    btn=document.getElementById("resetare");
    btn.onclick=function(){
        
        var produse=document.getElementsByClassName("produs");
    
        for (let prod of produse){
            prod.style.display="block";
        }

        document.getElementById("titlu_prod").value = "";
        document.getElementById("id_nota").value = "0";
        rng.value=0;
        spval.innerHTML=" ("+rng.value+")";
        rng.onchange=function()
        {
            rng.nextSibling.nextSibling.innerHTML=" ("+this.value+")";
        }
        document.getElementById('i_check1').checked = false;
        document.getElementById("tara").value = "toate";
        var radiobuttons=document.getElementsByName("gr_rad");		
        for(let rad of radiobuttons)
        {
            if(rad.checked && ((rad.value == "true")||(rad.value == "false")))
            {
                rad.checked = false;
            }
            if(rad.checked == false && (rad.value == "toate"))
            {
                rad.checked = true;
            }
        }
        var optiuni=document.getElementById("i_sel_multiplu");	
        optiuni.selectedIndex = -1;	

    }
}