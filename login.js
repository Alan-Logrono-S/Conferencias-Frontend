const errorDiv = document.querySelector('#errorMensaje');

document.querySelector('#form-login').addEventListener('submit', async(e)=>{
    e.preventDefault();

    try{

    const res = await fetch('http://localhost:4000/api/usuarios/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            email : document.querySelector('#email').value,
            password : document.querySelector('#password').value
        })
    });

    const data = await res.json();

    if(!res.ok) throw new Error(data.msg || "Error en el Login");

    localStorage.setItem('usuario', JSON.stringify(data));

    window.location.href = 'dashboard.html';

    }catch(error){
        errorDiv.textContent = error.message;

        errorDiv.classList.remove('errorHiden');
        errorDiv.classList.add('errorShow');

        setTimeout(() => {
            errorDiv.classList.add('errorHiden');
            errorDiv.classList.remove('errorShow');
        }, 3000);
    }
});