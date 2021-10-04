let previousData
let loadSpinner = true
let productItems = []
let productsPages = []
let selectedPage
let selectedIndex
let startIndex
let endIndex
let pagingList

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

const getProductById = async (id) =>{
    const idToSearch = id
    const res = await fetch(`/bsaleApi/product/${idToSearch}`)
    const data = await res.json()
    return data
}

let categoriesDataApi = getCategories()

//Listener for input when Enter key is pressed
const search = (e) =>{
    document.getElementById("search-hint").style.visibility = "hidden"
    if(e.keyCode === 13){
        searchItemByInput()
    }
}


//Handles the fetched data and renders all the items
const renderData = async ( data ) => {
    calculatePagination(data)
} 


//Handles the fetched data and renders all the categories
const renderCategories = async ( data ) =>{
    const apiResp = await data
    let renderedCategories = "<option value=TODOS>TODOS</option>"

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
        loadSpinner = true
        renderData(data)
    }
    else{
        const res = await fetch(`/bsaleApi/category/${category}`)
        const data = await res.json()
        loadSpinner = true
        renderData(data)
    }
}

//Fetches the data searching by name
const searchItemByInput = async () => {
    const inputString = document.getElementById("search-input").value  
    if(inputString === ""){
        document.getElementById("search-hint").style.visibility = "inherit"
    }
    else{
        const res = await fetch(`/bsaleApi/search/${inputString}`)
        const data = await res.json()
        loadSpinner = true
        renderData(data)
    }
} 


const orderBy = () =>{
    let orderOption =  document.getElementById("orderBy").value
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
            if(a.price-(a.price*(a.discount/100)) < b.price-(b.price*(b.discount/100))) {return -1}
            if(a.price-(a.price*(a.discount/100)) > b.price-(b.price*(b.discount/100))) {return 1}
            return 0
        })
        break;
        case "4": previousData.sort(function(a, b){
            if(a.price-(a.price*(a.discount/100)) > b.price-(b.price*(b.discount/100))) {return -1}
            if(a.price-(a.price*(a.discount/100)) < b.price-(b.price*(b.discount/100))) {return 1}
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
    loadSpinner = true
    renderData(previousData)
}

//Calculates de number of pages by the amount of items on data
const calculatePagination = async ( data ) =>{
    const productItems = await data
    let pagesNumber = productItems.length / 8
    const pagesNumberRemainder = pagesNumber % 1
    const pagesNumberWithoutRemainder = Math.floor(pagesNumber)
    if(pagesNumberRemainder>0)
        pagesNumber = Number(pagesNumberWithoutRemainder) +1
    productsPages = Array(pagesNumber)
        .fill(1)
        .map((x, i) => i+1)
    startIndex = 0
    endIndex = 8
    selectedPage = 1
    injectPagination()
    injectPage(productItems)
}

//renders pagination data to the client
const injectPagination = () =>{
    pagingList = `
        <li class="page-item"><a href="#content" class="page-link" onclick="goPrev()">Anterior</a></li>
        <li class="page-item"><p id="spanSelectedPage">Página ${selectedPage} de ${productsPages.length}</p></li>
        <li class="page-item"><a href="#content" class="page-link" onclick="goNext()">Siguiente</a></li>
    `
    document.getElementById("pagingTop").innerHTML = pagingList
    document.getElementById("pagingBottom").innerHTML = pagingList
}
//renders all the items data to the client
const injectPage = async (data) =>{
    const apiResp = await data
    const spinner = document.getElementById("spinner")
    if(loadSpinner){
        spinner.style.visibility = "visible"
    }
    previousData = apiResp
    const defaultUrlImage = '../img/notAvailable.png'
    const list = await data
    renderedItems = ""
    const newListOfItems = list.slice(startIndex, endIndex)
    newListOfItems.map(({ url_image, name, price, discount, id }, index) =>{
        let priceContent = ""
        if(discount>0){
            let discountPrice = price-(price*(discount/100))
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
                <p class="card-text price discountPrice">$${Math.round(discountPrice)}</p>
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
            <div class="card-container shadow">
                <div class="card">
                    <img src="${ url_image || defaultUrlImage }" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h4 class="card-title productName">${name}</h4>
                        ${priceContent}
                    </div>
                    <button class="btn btn-addtoCart" onclick="addToCart(${id})">Agregar al carro</button>
                </div>
                
            </div>
        `
    })
    if(loadSpinner){
        setTimeout(() => {
            spinner.style.visibility = "hidden"
            document.getElementById('resultados').style.visibility = 'inherit'
            document.getElementById('items-container').innerHTML = renderedItems
            document.getElementById('total-resultados').innerHTML = list.length
        }, 1300);
    }
    else{
        document.getElementById('resultados').style.visibility = 'inherit'
        document.getElementById('items-container').innerHTML = renderedItems
        document.getElementById('total-resultados').innerHTML = list.length
    }
    document.getElementById('resultados').style.visibility = 'inherit'
}

//Handles page to render
const goPrev = () =>{
    if(selectedPage != 1){
        startIndex -= 8
        endIndex -= 8
        selectedPage--
        loadSpinner = false
        injectPage(previousData)
        injectPagination()
    }
}

//Handles page to render
const goNext = () =>{
    if(selectedPage < productsPages.length){
        startIndex += 8
        endIndex += 8
        selectedPage++
        loadSpinner = false
        injectPage(previousData)
        injectPagination()
    }
}

// set localStorage for cart
let carrito = JSON.parse(localStorage.getItem('itemsOnCart')) || []
const addToCart = async (id) =>{
    const idToSearch = id
    const addedItem = await getProductById(idToSearch)
    console.log(addedItem)
    carrito.push(addedItem)
    localStorage.setItem("itemsOnCart", JSON.stringify(carrito))
    injectCart()
}

//Renders amount of items on the cart
const injectCart =() =>{
    let storedCart = JSON.parse(localStorage.getItem("itemsOnCart"))
    document.getElementById("itemsCounter").innerHTML = storedCart.length
    const cartContainer = document.getElementById("cartContainer")
    cartContainer.classList.add("animate__animated", "animate__heartBeat", "animate__repeat-2")
    setTimeout(() => {
        cartContainer.classList.remove("animate__animated", "animate__heartBeat", "animate__repeat-2")
    }, 3000);
}

const redirect = () => {
    window.location.href = "/cartList.html";
};

//Initial render of products and its categories
calculatePagination(dataApi)
renderCategories(categoriesDataApi)
injectCart()
