const express = require('express')
 ///const ejs = require('ejs') //para renderizar, express lo usa pñor defecto, solo lo configuramos
const path = require('path')
const multer = require('multer')// para subir archivos
const { v4: uuidv4 } = require('uuid');
uuidv4(); // ⇨ '1b9d6bcd-bbfd-4b2d-9b5d-ab8dfbbd4bed'

//initilizations 
const app = express()

//settings
app.set('port', 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//middlewares --> necesita entender la imagen o lo que le estas enviando y uno vez lo hace pasa a las rutas.. por eso se hace antes de las rutas
const storage  = multer.diskStorage({
    destination: path.join(__dirname, './public/uploads'),
    filename: (req, file, cb)=>{
        cb(null,uuidv4() + path.extname(file.originalname).toLocaleLowerCase() ) //le concatenamos la extension
    }                                                                                                                                              
})

app.use(multer({
    storage,
    dest: path.join(__dirname, 'public/uploads'),
    limits : {fileSize: 1000000},//el limete de bytes
    //validar el tipo de imagen
    fileFilter: (req,file,cb)=>{
        const filetypes =/jpeg|jpg|png|gif/
        const mimetype = filetypes.test(file.mimetype)
        const extmane =  filetypes.test(path.extname(file.originalname))
        if(mimetype && extmane){
            return cb (null,true)//retorna un nulo y un true porque no hara nada
        } else return cb('Error: el archivo debe ser una imagen')

    }
}).single('image'))//nombe del input



//routes
app.use(require('./routes/index.route'))//utiliza el enrutador 

//StaticFiles
app.use(express.static(path.join(__dirname, 'public')))

//Start server
app.listen(app.get('port'), () =>{
    console.log(`Server On port ${app.get('port')}`) //sintax emmatscripts
})

