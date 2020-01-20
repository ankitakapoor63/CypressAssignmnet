const typeQuantityCheck = (enteredQuantity, inStockquantity) => {
    if(typeof enteredQuantity === "number" && enteredQuantity >= 0 && enteredQuantity % 1 === 0 && enteredQuantity <= inStockquantity) {
      return true;
    }
    return false;
  }

 export default typeQuantityCheck;