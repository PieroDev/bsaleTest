let carrito = JSON.parse(localStorage.getItem('itemsOnCart')) || []

const injectCartList = () =>{
    let storedCart = JSON.parse(localStorage.getItem("itemsOnCart"))
    let renderedCart = ""
    let precioTotal = 0
    storedCart.map(( {url_image, name, price, discount, id }, index)=>{
        let discountPrice = Math.floor(price-(price*(discount/100)))
        precioTotal = precioTotal + discountPrice
        renderedCart += `
        <div class="list-item">
            <div class="list-item-container">
                <p>${id}</p>
            </div>
            <div class="list-item-container">
                <p>${name}</p>
            </div>
            <div class="list-item-container">
                <p>${price}</p>
            </div>
            <div class="list-item-container">
                <p>${discount}</p>
            </div>
            <div class="list-item-container">
                <p>${discountPrice}</p>
            </div>
        </div>
        `
    })
    document.getElementById("inject").innerHTML = renderedCart
    document.getElementById("precioTotal").innerHTML = `<h3>Precio total: $${precioTotal.toString()}</h3>`
}

const resetCart = () =>{
    let carroVacio = []
    localStorage.setItem("itemsOnCart", JSON.stringify(carroVacio))
    window.scrollTo(0, 0);
    injectCartList()
}


injectCartList()
