/* NOTAS:
-PM2 es recomendable para produccion  
-NODEMON solo para desarrollo
*/
//en el 2020 salio la importacion ecmacscript modul "import http from 'xxxx' "
/* const http = require('http'); //importacion con comun js
 */
/* const notes = [
    {"id":1,
     "content": "lorem"
    },
    {"id":2,
    "content": "lorem impsun"},
    {"id":3,
    "content": "lorem ipsun lorem"}
] */

/* este es un callback => funcion que almacena otra funcion y decide cuando se ejecutara
    En este caso la funcion app ejectura la funcion anonima con dos parametros.
    cade vez que reciba un un request.
    el parametro request, lleva la informacion de la request que la llamo
    y response devuelve informacion al request.
*/
/* const app = http.createServer((request,response)=>{
    //status code 200, toda fue bien, cabezera con meta datos de la informacion
    response.writeHead(200, {'Content-Type':'application/json'}) //el tipo de dato que estamos devolviendo
    response.end(JSON.stringify(notes)) //recorre la array y transforma los objetos en un string
})
 */
//por defecto puerto 80 en http
//por defecto puerto 443 en https
// cambiamso el puerto a 3001
/* const PORT = 3001
app.listen(PORT)
console.log(`server running on port ${PORT}`) */



/* El */
/* CREAR SERVER CON EXPRESS */
const express = require('express')
const app = express()

/* el request va de arriba a abajo pasando por todos los endpoitns
    con el "use" podemos capturar el request 
 */
//importar el midleware
const logger = require('./loggerMiddleware')
//ingresen desde cualquier origen, se puede configurar para elegir
const cors = require('cors')
/* soportar la request con un objeto  y lo parsea para ser usado aca*/
app.use(express.json())

app.use(cors)

app.use(logger)

let notes = [
    {
     "id":1,
     "content": "lorem"
    },
    {
    "id":2,
    "content": "lorem impsun"},
    {"id":3,
    "content": "lorem ipsun lorem"}
]

app.get('/',(request,response) =>{
    response.send('<h1>Hi</h1>')
})

app.get('/api/notes',(request,response) =>{
    response.json(notes)
})

app.get('/api/notes/:id',(request,response) =>{
    const id = Number(request.params.id) //de request el parametros el id
    const note = notes.find(note => note.id === id)//encontrar
    
    if(note){
        response.json(note)
    }else{
        response.status(404).end()
    }
})

app.delete('/api/notes/:id',(request,response) =>{
    const id = Number(request.params.id)
    notes = notes.filter(note => note.id != id)
    response.status(204).end()
})

app.post('/api/notes',(request, response) =>{
    const note = request.body
    if(!note || !note.content){
        return response.status(400).json({
            error: 'note.content is missing'
        })
    }
    const ids = notes.map(note => note.id)
    const maxId = Math.max(...ids)
    const newNote = {
        id: maxId + 1,
        content: note.content
    }

    notes = [...notes, newNote]

    response.status(201).json(note)
})

/* buena pratica en caso que el request no encuentre su endpoint */
app.use((request, response)=>{
    response.status(404).json({
        error:"No se encontro la ruta"
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, ()=>{
    console.log(`server running on port ${PORT}`)
})