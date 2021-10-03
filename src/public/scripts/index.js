let previousData

//Initial products query
const getItems = async () => {
    const res = await fetch("bsaleApi/");
    const data = await res.json();
    return data;
};

let dataApi = getItems()

//Categories query
const getCategories = async () => {
    const res = await fetch("/bsaleApi/category/all")
    const data = await res.json()
    //console.log(data)
    return data;
}
let categoriesDataApi = getCategories()

//Listener for input when Enter key is pressed
const search = (e) =>{
    document.getElementById("search-hint").style.visibility = "hidden"
    if(e.keyCode === 13){
        console.log("A Buscar!")
        searchItemByInput()
    }
}

//Handles the fetched data and renders all the items
const renderData = async ( data ) => {
    const apiResp = await data
    let renderedItems = ""
    console.log(apiResp)
    previousData = apiResp
    const defaultUrlImage = '../img/notAvailable.png'

    apiResp.map(({ url_image, name, price, discount, id }) => {
        let priceContent = ""
        if(discount>0){
            let discountPrice = price-(price*(discount/100))
            console.log("Precio Normal: "+price)
            console.log("Precio Descuento: "+discountPrice)
            priceContent = `
                <div class='discount'>
                    <p class="animate__animated animate__heartBeat animate__repeat-3">
                        Sale!
                        <br/>
                        ${discount}%
                    </p>
                    
                </div>
                <p class="card-text precio-normal">Precio normal: $${price}</p>
                <p class="card-text precio-descuento">Precio Descuento:</p>
                <p class="card-text price discountPrice">$${discountPrice}</p>
            `
        }
        else{
            priceContent = `
                <p class="card-text precio-normal">Producto destacado</p>
                <p class="card-text"> Precio:</p>
                <p class="card-text price normalPrice">$${price}</p>
            `
        }

        renderedItems += `
            <div class="card-container">
                <div class="card" style="width: 18rem;">
                <img src="${ url_image || defaultUrlImage }" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-title productName">${name}</h4>
                    ${priceContent}
                </div>
                </div>
            </div>
        `
    })
    let counter = document.getElementById('total-resultados')
    counter.innerHTML = apiResp.length
    document.getElementById('resultados').style.visibility = 'inherit'
    document.getElementById('items-container').innerHTML = renderedItems
} 


//Handles the fetched data and renders all the categories
const renderCategories = async ( data ) =>{
    const apiResp = await data
    let renderedCategories = "<option value=TODOS>TODOS</option>"
    console.log(apiResp)
    apiResp.map(({ id, name}) =>{
        renderedCategories += `
            <option value="${id}">${ name.toUpperCase() }</option>
        `
    })
    document.getElementById('category').innerHTML = renderedCategories
}

//Fetches the data searching by category
const searchByCategory = async () =>{
    let category = document.getElementById("category").value
    if(category === "TODOS"){
        const res = await fetch("bsaleApi/");
        const data = await res.json();
        renderData(data)
    }
    else{
        const res = await fetch(`/bsaleApi/category/${category}`)
        const data = await res.json()
        renderData(data)
    }
}

//Fetches the data searching by name
const searchItemByInput = async () => {
    const inputString = document.getElementById("search-input").value  
    if(inputString === ""){
        console.log("Input vacio")
        document.getElementById("search-hint").style.visibility = "inherit"
    }
    else{
        console.log("Input: "+inputString)
        const res = await fetch(`/bsaleApi/search/${inputString}`)
        const data = await res.json()
        console.log(data)
        renderData(data)
    }
} 


const orderBy = () =>{
    let orderOption =  document.getElementById("orderBy").value
    console.log(orderOption)
    switch(orderOption){
        case "1": previousData.sort(function(a, b){
            if(a.name > b.name) {return - 1}
            if(a.name < b.name) {return 1}
            return 0
        })
        break;
        case "2": previousData.sort(function(a, b){
            if(a.name < b.name) {return - 1}
            if(a.name > b.name) {return 1}
            return 0
        })
        break;
        case "3": previousData.sort(function(a, b){
            if(a.price < b.price) {return - 1}
            if(a.price > b.price) {return 1}
            return 0
        })
        break;
        case "4": previousData.sort(function(a, b){
            if(a.price > b.price) {return - 1}
            if(a.price < b.price) {return 1}
            return 0
        })
        break;
        case "5": previousData.sort(function(a, b){
            if(a.discount > b.discount) {return - 1}
            if(a.discount < b.discount) {return 1}
            return 0
        })
        break;
    }
    renderData(previousData)
    console.log(previousData)
}

//Initial render of products and its categories
renderData(dataApi)
renderCategories(categoriesDataApi)