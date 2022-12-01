
// Definição das classes 

class Carro {
    
    constructor(model, board, year, state){
    this.model = model
    this.board = board
    this.year = year
    this.state = state
}    
};


class Reserva{
    constructor(reserve_outset, reserve_last, id_car) { 
    this.id_car = id_car
    this.reserve_outset = reserve_outset
    this.reserve_last = reserve_last
}
    
};


// Variáveis globais
var tabela = document.getElementById("op");



// Funções para página de cadastro

function cadastro(){
    let form  = document.forms["formCarros"]
    let newCarro = new Carro
    axios.post('http://localhost:8000/cadastro', 
    
    {
        model: form["model"].value,
        board: form["board"].value,
        year: form["year"].value  
    }
    
    ).then(response => {console.log(response.data)})
    .catch(erro => {console.log(erro)});
    alert("Carro cadastrado")
    this.form.reset();

};


// Funções para página de reservas

function converteData() { 
    let form = document.forms["formReserva"]
    
    var reserve_outset = document.getElementById('reserve_outset').value
    var reserve_last = document.getElementById('reserve_last').value
    
    
    const hoje = new Date(reserve_outset)
    const diaI = String(hoje.getDate().toString().padStart(2,'0'))
    const mesI = String(hoje.getMonth() + 1).padStart(2,'0')
    const anoI = String(hoje.getFullYear())
    const horasI = String(hoje.getHours())
    const minutosI = String(hoje.getMinutes())
    reserve_outset = `${diaI}/${mesI}/${anoI} ${horasI}:${minutosI}`
    
    
    const hojeF = new Date(reserve_last)
    const diaF = String(hojeF.getDate().toString().padStart(2,'0'))
    const mesF = String(hojeF.getMonth() + 1).padStart(2,'0')
    const anoF = String(hojeF.getFullYear())
    const horasF = String(hojeF.getHours())
    const minutosF = String(hojeF.getMinutes())
    reserve_last = `${diaF}/${mesF}/${anoF} ${horasF}:${minutosF}`
    
    
    
    this.form.reset();
    verificaReservas(reserve_outset, reserve_last)
};


function verificaReservas(reserve_outset, reserve_last){
     
    let form = document.forms["formReserva"]
    let newReserva = new Reserva 
     
    axios.post('http://localhost:8000/consulta_reserva',
    
    {
        reserve_outset: reserve_outset,
        reserve_last: reserve_last       
    }
    
    ).then(response => {
        const data = response.data 
        console.log(data)
        devolveOpcoes(data, reserve_outset, reserve_last)
   
    })
    .catch(erro => {console.log(erro)});

    
               
};


function devolveOpcoes(data,reserve_outset, reserve_last){
    
    const myElement = document.querySelector("thead")
    const exist = document.body.contains(myElement)
    
    if(exist == false){
        
        
         
        let titulo = document.getElementById("tit")
        tituloCarros = criaCelula("h2", "Carros disponiveis")
        console.log(titulo)
        console.log(tituloCarros)

        titulo.appendChild(tituloCarros)
            
            

        
        
        let thead = criarTag("thead");
        let tbody = criarTag("tbody");
        let tfoot = criarTag("tfoot");


        
        
        tabela.appendChild(thead);
        tabela.appendChild(tbody);
        tabela.appendChild(tfoot);

        
        let linhaHead = criarTag("tr")
        let indicesTabela = ["ID", "Modelo", "Ano de Fabricação"]
        
        for(let i = 0; i < indicesTabela.length; i++){
            
            let th = criaCelula("th", indicesTabela[i]);
            linhaHead.appendChild(th);
            

        }
        thead.appendChild(linhaHead)
        
        
        for(let i = 0; i < data.length; i++){
            
            var linhaBody = criarTag("tr"); 
            
        
            
            for(let j = 0; j < indicesTabela.length; j++){
                    
                cel = '';
                
                
                cel = criaCelula("td", data[i][j])

                linhaBody.appendChild(cel);
            
            }
            tbody.appendChild(linhaBody); 
        }
        
        getId(reserve_outset, reserve_last)
    }   

    else if(exist == true) {
       remove(data)
       
    }
    
       
}


function getId(reserve_outset, reserve_last){
   var id = document.getElementById('op').getElementsByTagName('tr') 
   console.log('length: ', id)
   for(var i = 0; i < id.length; i++ ){
       var linhaId = id[i];
       linhaId.addEventListener("click", function(){
               
               verificaLinha(this, false, reserve_outset, reserve_last);
       })
   }
   
}


function verificaLinha(linhaId, multiplos, reserve_outset, reserve_last){
    var id_carS = linhaId.getElementsByTagName("td")[0]
    var id_car = parseInt(id_carS.innerText)
    if(!multiplos){
        var id = linhaId.parentElement.getElementsByTagName("tr")
    
        for(var i = 0; i < id.length; i++){
            var linha_ = id[i]
            linha_.classList.remove("selecionado");
        }
    }
   confirmaReserva(id_car, reserve_outset, reserve_last)
} 


function confirmaReserva(id_car, reserve_outset, reserve_last){
     
    if(confirm('Confirmar reserva ?')){
        axios.post('http://localhost:8000/faz_reserva',
        
        {
            id_car: id_car,
            reserve_outset: reserve_outset,
            reserve_last: reserve_last       
        }
        
        ).then(response => {
            const data = response.data 
            console.log(data)
            console.log("Reservado")
    
        })
        .catch(erro => {console.log(erro)});
        alert("Reserva registrada")
        window.location.reload()
    }
    else {
        alert("Após revisar escolha, selecione um carro para reserva")
    }
} 

// Funções para página de update

function upadate_state(){
    let form  = document.forms["formUpdate"]
    let newCarro = new Carro
    axios.post('http://localhost:8000/update_car', 
    
    {
        state: form["state"].value,
        board: form["board"].value
    }
    
    ).then(response => {console.log(response.data)})
    .catch(erro => {console.log(erro)});
    alert("Carro encontrado")
    this.form.reset();
}

// MRC90


// Funções reutilizáveis 

function criarTag(elemento){
    
    return document.createElement(elemento)

}


function criaCelula(tag, text) {
    tag = criarTag(tag);
    tag.textContent = text
    return tag
}


function remove(data){
    
    let titulo = document.querySelector('h2')
    let thead = document.querySelector('thead')
    let tbody = document.querySelector('tbody')
    let tfoot = document.querySelector('tfoot')

    titulo.remove(titulo)
    thead.remove(thead)
    tbody.remove(tbody)
    tfoot.remove(tfoot)

    
    devolveOpcoes(data)
} 

