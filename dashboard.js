const API_URL = 'http://localhost:4000/api';

let globalConferencistas = [], globalAuditorios = [], globalReservas = [];

document.addEventListener('DOMContentLoaded', async () =>{
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    if(!usuario) return window.location.href = 'index.html';

    document.getElementById('bienvenido-user').textContent = `Bienvenido ${usuario.nombre} ${usuario.apellido}`;
    await obtenerTodo();
});

async function obtenerTodo() {
    await listarConferencistas();
    await listarAuditorios();
    await listarReservas();
}

///======CONFERENCISTAS======



async function listarConferencistas() {
    globalConferencistas = await( await fetch(`${API_URL}/conferencistas`)).json();

    document.getElementById('tabla-conferencistas').innerHTML = globalConferencistas.map(co => `
        <tr>
            <td>${co.nombre}</td>
            <td>${co.apellido}</td>
            <td>${co.cedula}</td>
            <td>${co.genero}</td>
            <td>${co.ciudad}</td>
            <td>${co.direccion}</td>
            <td>${co.fecha_nacimiento ? co.fecha_nacimiento.split('T') [0] : 'S/F'}</td>
            <td>${co.telefono}</td>
            <td>${co.email}</td>
            <td>${co.empresa}</td>

            <td>
                <button class="btn-edit" onClick="agregarConferencista('${co._id}')">Editar</button>
                <button class="btn-delete" onClick="eliminar('conferencistas','${co._id}')">Eliminar</button>
            </td>
        </tr>`
    ).join('');

    document.getElementById('re-conferencista').innerHTML = '<option value="">Seleccionar Conferencista</option>' +
    globalConferencistas.map(c =>` <option value='${c._id}'>${c.nombre} ${c.apellido}</option>`).join('');
};

document.getElementById('form-conferencistas').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const id = document.getElementById('co._id').value;

    const body = {
        nombre : document.getElementById('co-nombre').value,
        apellido : document.getElementById('co-apellido').value,
        cedula : document.getElementById('co-cedula').value,
        genero : document.getElementById('co-genero').value,
        ciudad : document.getElementById('co-ciudad').value,
        direccion : document.getElementById('co-direccion').value,
        fecha_nacimiento : document.getElementById('co-fecha').value,
        telefono : document.getElementById('co-telefono').value,
        email : document.getElementById('co-email').value,
        empresa : document.getElementById('co-empresa').value
    }

    await fetch(`${API_URL}/conferencistas${id ? '/'+id : ''}`,{
        method:id ? 'PUT' : 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
    });

    e.target.reset();
    document.getElementById('co._id').value = '';
    await obtenerTodo();
});

function agregarConferencista(id){
    const c = globalConferencistas.find(x=> x._id === id);
    if(!c) return
    document.getElementById('co._id').value = c._id;
    document.getElementById('co-nombre').value = c.nombre;
    document.getElementById('co-apellido').value = c.apellido;
    document.getElementById('co-cedula').value = c.cedula;
    document.getElementById('co-genero').value = c.genero;
    document.getElementById('co-ciudad').value = c.ciudad;
    document.getElementById('co-direccion').value = c.direccion;
    document.getElementById('co-fecha').value = c.fecha_nacimiento ? c.fecha_nacimiento.split('T') [0] : '';
    document.getElementById('co-telefono').value = c.telefono;
    document.getElementById('co-email').value = c.email;
    document.getElementById('co-empresa').value = c.empresa;

    window.scrollTo(0,0);
};


///======AUDITORIO======



async function listarAuditorios() {
    globalAuditorios = await( await fetch(`${API_URL}/auditorios`)).json();

    document.getElementById('tabla-auditorios').innerHTML = globalAuditorios.map(au => `
        <tr>
            <td>${au.codigo}</td>
            <td>${au.nombre}</td>
            <td>${au.ubicacion}</td>
            <td>${au.capacidad}</td>
            <td>${au.descripcion}</td>

            <td>
                <button class="btn-edit" onClick="agregarAuditorio('${au._id}')">Editar</button>
                <button class="btn-delete" onClick="eliminar('auditorios','${au._id}')">Eliminar</button>
            </td>
        </tr>`
    ).join('');

    document.getElementById('re-auditorio').innerHTML = '<option value="">Seleccionar Auditorio</option>' +
    globalAuditorios.map(a =>` <option value='${a._id}'>${a.nombre}</option>`).join('');
};

document.getElementById('form-auditorios').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const id = document.getElementById('au._id').value;

    const body = {
        codigo : document.getElementById('au-codigo').value,
        nombre : document.getElementById('au-nombre').value,
        ubicacion : document.getElementById('au-ubicacion').value,
        capacidad : document.getElementById('au-capacidad').value,
        descripcion : document.getElementById('au-descripcion').value
    }

    await fetch(`${API_URL}/auditorios${id ? '/'+id : ''}`,{
        method:id ? 'PUT' : 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
    });

    e.target.reset();
    document.getElementById('au._id').value = '';
    await obtenerTodo();
});

function agregarAuditorio(id){
    const a = globalAuditorios.find(x=> x._id === id);
    if(!a) return
    document.getElementById('au._id').value = a._id;
    document.getElementById('au-codigo').value = a.codigo;
    document.getElementById('au-nombre').value = a.nombre;
    document.getElementById('au-ubicacion').value = a.ubicacion;
    document.getElementById('au-capacidad').value = a.capacidad;
    document.getElementById('au-descripcion').value = a.descripcion;

    window.scrollTo(0,0);
};


///======RESERVAS======



async function listarReservas() {
    globalReservas = await( await fetch(`${API_URL}/reservas`)).json();



    document.getElementById('tabla-reservas').innerHTML = globalReservas.map(re => {
        
        const co = typeof re.id_conferencista === 'object' ? re.id_conferencista : globalConferencistas.find(c => c._id === re.id_conferencista);
        const au =  typeof re.id_auditorio === 'object' ? re.id_auditorio : globalAuditorios.find(a => a._id === re.id_auditorio);
        
        return`
        <tr>
            <td>${re.codigo}</td>
            <td>${re.descripcion}</td>
            <td>${co ? co.nombre + ' '+ co.apellido : 'No encontrado'}</td>
            <td>${au ? au.nombre : 'No encontrado'}</td>

            <td>
                <button class="btn-edit" onClick="agregarReserva('${re._id}')">Editar</button>
                <button class="btn-delete" onClick="eliminar('reservas','${re._id}')">Eliminar</button>
            </td>
        </tr>`
    }).join('');

};

document.getElementById('form-reservas').addEventListener('submit', async (e)=>{
    e.preventDefault();

    const id = document.getElementById('re._id').value;

    const body = {
        codigo : document.getElementById('re-codigo').value,
        descripcion : document.getElementById('re-descripcion').value,
        id_conferencista : document.getElementById('re-conferencista').value,
        id_auditorio : document.getElementById('re-auditorio').value,
    }

    if(!body.id_conferencista || ! body.id_auditorio)return alert("Debe de seleccionar Conferencista y Auditorio");

    await fetch(`${API_URL}/reservas${id ? '/'+id : ''}`,{
        method:id ? 'PUT' : 'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body)
    });


    e.target.reset();
    document.getElementById('re._id').value = '';
    await obtenerTodo();
});

function agregarReserva(id){
    const r = globalReservas.find(x=> x._id === id);
    if(!r) return
    document.getElementById('re._id').value = r._id;
    document.getElementById('re-codigo').value = r.codigo;
    document.getElementById('re-descripcion').value = r.descripcion;
    document.getElementById('re-conferencista').value = r.id_conferencista;
    document.getElementById('re-auditorio').value = r.id_auditorio;


    window.scrollTo(0,0);
};

// === FUNCIONES ===


async function eliminar(entidad,id) {
    if(confirm('¿Desea eliminar el Registro?')){
        await fetch(`${API_URL}/${entidad}/${id}`,{
            method:'DELETE'
        });
    };
    await obtenerTodo();
};

function seccion(id){
    document.querySelectorAll('.modulo').forEach(m=> m.style.display = 'none');
    document.getElementById(`sec-${id}`).style.display = 'block';
}

function logout(){
    localStorage.clear();
    window.location.href = 'index.html';
};

