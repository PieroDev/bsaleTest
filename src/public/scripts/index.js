let previousData
let loadSpinner = true
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
        console.log("Input: "+inputString)
        const res = await fetch(`/bsaleApi/search/${inputString}`)
        const data = await res.json()
        loadSpinner = true
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
    loadSpinner = true
    renderData(previousData)
}

let productItems = []
let productsPages = []
let selectedPage
let selectedIndex
let startIndex
let endIndex
let pagingList

const calculatePagination = async ( data ) =>{
    const productItems = await data
    console.log(productItems)
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

const injectPagination = () =>{
    pagingList = `
        <li class="page-item"><a class="page-link" onclick="goPrev()">Previous</a></li>
        <li class="page-item"><p id="spanSelectedPage">Página ${selectedPage} de ${productsPages.length}</p></li>
        <li class="page-item"><a class="page-link" onclick="goNext()">Next</a></li>
    `
    document.getElementById("pagingTop").innerHTML = pagingList
    document.getElementById("pagingBottom").innerHTML = pagingList
}

const injectPage = async (data) =>{
    const apiResp = await data
    const spinner = document.getElementById("spinner")
    if(loadSpinner){
        spinner.style.visibility = "visible"
    }
    previousData = apiResp
    const defaultUrlImage = '../img/notAvailable.png'
    const list = await data
    console.log(list)
    renderedItems = ""
    const newListOfItems = list.slice(startIndex, endIndex)
    console.log("Here")
    console.log(newListOfItems)
    newListOfItems.map(({ url_image, name, price, discount, id }, index) =>{
        console.log("Entro aca")
        console.log(name)
        console.log(index)
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
            <div class="card-container">
                <div class="card">
                <img src="${ url_image || defaultUrlImage }" class="card-img-top" alt="...">
                <div class="card-body">
                    <h4 class="card-title productName">${name}</h4>
                    ${priceContent}
                </div>
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

//Initial render of products and its categories
calculatePagination(dataApi)
renderCategories(categoriesDataApi)