/// <reference types="Cypress" />
import ProductCatalouge from "../../support/pageObjects/ProductCatalouge"
import Confrimation from "../../support/pageObjects/Confirmation"
import typeQuantityCheck from "../../utils/typeQuantityCheck"
const testData = require("../../fixtures/csvTestData.json");

//Fetching the Data from csvTestData.json 
describe("Dynamically Generated Tests", () => {
  testData.forEach((testDataRow) => {
    const data = {
      zebra: testDataRow.zebra,
      lion: testDataRow.lion,
      elephant: testDataRow.elephant,
      giraffe: testDataRow.giraffe,
      state: testDataRow.state,
      inStock: testDataRow.inStock,
      zebraInStock: testDataRow.inStock.zebra,
      lionInStock: testDataRow.inStock.lion,
      elephantInStock: testDataRow.inStock.elephant,
      giraffeInStock: testDataRow.inStock.giraffe
    };
    context(`Generating a test for ${data.state}`, () => {
      it("should verify the taxes and total amount of socks", () => {
        
        //Object initiation
        const productCatalouge = new ProductCatalouge()
        const confirmation =new Confrimation()

        //fetching environment url from cypress.json
        cy.visit(Cypress.env("url"))

        //Inserting the data in the web application from csvTestData.json
        productCatalouge.getZibraQuantity().type(data.zebra)
        productCatalouge.getLionQuantity().type(data.lion)
        productCatalouge.getElephantQuantity().type(data.elephant)
        productCatalouge.getGirrafeQuantity().type(data.giraffe)
        productCatalouge.getShipToState().select(data.state)

        //Checking if state is not blank
        expect(data.state).to.not.equal("")

        //Clicking on CHECKOUT Button
        productCatalouge.getCheckoutButton().click()

        //Verifying that after checking out, we landed on the CONFIRMATION page
        confirmation.getConfirmationMessage().contains("Confirm")
        
        let priceList = []
        let quantList = []
        var total=0
        var tax=0
        var grandTotal=0
        
        //Verifying DATA TYPE == Number and 0<= DATA QUANTITY<= In STOCK Quantity
        expect(typeQuantityCheck(data.zebra, data.zebraInStock)).to.be.true 
        expect(typeQuantityCheck(data.lion, data.lionInStock)).to.be.true 
        expect(typeQuantityCheck(data.elephant, data.elephantInStock)).to.be.true 
        expect(typeQuantityCheck(data.giraffe, data.giraffeInStock)).to.be.true 
      
        //MULTIPLYING TAXES AND SUMMING
        //Looping through table on confirmation page
        cy.get("tr.line_item td:nth-child(1)").each(($e1, index, $list) =>{
          //Getting all the prices from the confirmation page and pushing into LIST
            cy.get("tr.line_item td:nth-child(1)").eq(index).next().then(function(price1){
               priceList.push(price1.text())
            })
            //Getting all the quantities from the confirmation page and pushing into LIST
            cy.get("tr.line_item td:nth-child(1)").eq(index).next().next().then(function(quant){
                quantList.push(quant.text())
            })
                       
        }).then(function(){
            for (var i = 0; i < priceList.length; i++) {
              //calculating Total price by multiplying price and quantity from above and adding into total
                total+=priceList[i]*quantList[i]
              }
              //Applying state tax on total and getting the grand total after tax application
              if(data.state=="California"){
                tax = total*0.08
                tax=tax.toFixed(2)
                grandTotal=Number(total)+Number(tax)
                
            } else if(data.state=="New York"){
                tax = total*0.06
                tax=tax.toFixed(2)
                grandTotal=Number(total)+Number(tax)
                

            } else if(data.state=="Minnesota"){
                tax = total*0.00
                tax=tax.toFixed(2)
                grandTotal=Number(total)+Number(tax)
                 
            } else{
                tax = total*0.05
                tax=tax.toFixed(2)
                grandTotal=Number(total)+Number(tax)
                
            }
            //fetching total calculated by website
            cy.get('#total').then(function(cal){
                var calculated = cal.text()
                var splitcal = calculated.split("$")
                var trimCal = splitcal[1].trim()
                
                //Verifying calculated total with the website total
                expect(Number(grandTotal)).to.equal(Number(trimCal))

            })  
        })   
      });
    });
  });
});