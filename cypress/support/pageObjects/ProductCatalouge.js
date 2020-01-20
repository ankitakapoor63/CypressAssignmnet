class ProductCatalouge{
getZibraQuantity(){
    return cy.get("#line_item_quantity_zebra")
}
getLionQuantity(){
    return cy.get("#line_item_quantity_lion")
}
getElephantQuantity(){
    return cy.get("#line_item_quantity_elephant")
}
getGirrafeQuantity(){
    return cy.get("#line_item_quantity_giraffe")
}
getCheckoutButton(){
    return cy.get("input[type='submit']")
}
getShipToState(){
    return cy.get("select")
}

}
export default ProductCatalouge;