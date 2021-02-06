// NOTES
// --1-- la api de fetch, nos permite llamar rutas y poder ineterpretar lo q esta devuelve
// --2-- fetch('http://localhost:3000/api/meals',{ -- a continuación algunas opciones de la api de fetch
//         method : 'GET', // POST,PUT,DELETE -- Podemos definir metodos (por default GET)
//         mode: 'cors', // El modo por el cual accederemos
//         cache: 'no-cache', // si queremos que nos retorne el cache o no del servidor
//         credentials:'same-origin' // credenciales, si existen. De lo contrario (defualt same-orgin)
//         headers:{ // tambien podemos definir headers y enviar información en ellos
//             'Content-Type': 'application/json'
//         },
//         redirect: 'follow', /7 redirect funciona para tomar una ruta si el servidor nos redirige a ella (follow)
//         body: JSON.stringify({}) // podemos también enviarle información en un body pero este debe ser convertido a string
//
//     })
// --3-- DOMParser puede analizar gramaticalmente (parsear, en adelante) código XML o HTML almacenado en una cadena de texto
//       y convertirlo en un Documento DOM
let mmealsState = [];

const stringToHtml = (s) => { // funcion para transformar un string en html
    const parser = new DOMParser() // 3
    const doc = parser.parseFromString(s, 'text/html') // esto retorna un documento completo
    return doc.body.firstChild // asi que definimos que queremos es el primer elemento dentro de body
}
const renderItem = (item) => { // funcion para rendereizar los items
    const element = stringToHtml(`<li data-id ="${item._id}">${item.name} </li>`) // llamamos a la función para transformar
    element.addEventListener('click', () => { // agragmos el listener para el click que se daŕa en los elementos
        const mealsList = document.getElementById('meals-list') // traemos a la etqieuta de html por el id
        Array.from(mealsList.children).forEach(x => x.classList.remove('selected')) // llo que trae la etiqueta es un arreglo así que lo recorremos
        // luego con classList eliminamos la clase selected de toso los elementos
        element.classList.add('selected') // luego añadimos la misma clase solo a un elemento (al que le demos click)
        const mealsIdInput = document.getElementById('meals-id') // treaemos el elemento del input oculto
        mealsIdInput.value = item._id; // par aasignar el valor del id del item seleccionado
    })
    return element
}
const renderOrder = (order, meals) => { // renderizando las ordenes
    const meal = meals.find(meal => meal._id === order.meal_id)
    return stringToHtml(`<li data-id ="${order._id}">${meal.name} - ${order.user_id}</li>`)
}

window.onload = () => {

    const orderForm = document.getElementById('order')
    orderForm.onsubmit = (e) => {
        e.preventDefault()
        const submit  = document.getElementById('submit')
        submit.setAttribute('disabled',true)
        const mealId = document.getElementById('meals-id')
        const mealIdValue = mealId.value
        if (!mealIdValue) {
            alert('Debe seleccionar un plato');
        }
        const order = {
            meal_id: mealIdValue,
            user_id: "federico",
        }
        fetch('https://serverless-example.camilo-001.vercel.app/api/orders', { //33
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
        }).then(x => x.json())
            .then(respuesta => {
                const renderedOrder = renderOrder(respuesta,mealsState )
                const ordersList = document.getElementById('orders-list')
                ordersList.appendChild(renderedOrder)
                submit.removeAttribute('disabled')
            })
    }

    fetch('https://serverless-example.camilo-001.vercel.app/api/meals')// 1 //
        // 2 si no utilizamos las opciones disponibles por fetch este las tomara por defecto
        .then(response => response.json())// lo que hacemos es trnasformar la respuesta de la llamada en un JSON
        .then(data => {
            mealsState = data
            const mealsList = document.getElementById('meals-list') // traemos el id de la etiqueta html
            const submit = document.getElementById('submit')
            const listItems = data.map(renderItem) // creamos el template
            mealsList.removeChild(mealsList.firstElementChild)// para eliminar el cargando usamos removechild pero especificamos que es el primer elemento de esa lista
            listItems.forEach(element => mealsList.appendChild(element))// recorremos el arreglo de listitems y usamos appenedChild para crear el lemento
            submit.removeAttribute('disabled') // quitamos la funcion de disabled del boton submit hasta que cargue la lista
            fetch('https://serverless-example.camilo-001.vercel.app/api/orders')
                .then(response => response.json())
                .then(ordersData => {
                    const ordersList = document.getElementById('orders-list')
                    const listOrders = ordersData.map(orderData => renderOrder(orderData, data))
                    ordersList.removeChild(ordersList.firstElementChild)
                    listOrders.forEach(element => ordersList.appendChild(element))
                })
        })
}