<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Mini App</title>
    <style>
      body {
        margin: 0;
        padding: 1em;
        background: #fff;
      }
      
      [data-cart-info],
      [data-credit-card] {
        transform: scale(0.78);
    	margin-left: -3.4em;
      }
      [data-cc-info] input:focus,
      [data-cc-digits] input:focus {
        outline: none;
      }
      .mdc-card__primary-action,
      .mdc-card__primary-action:hover {
        cursor: auto;
        padding: 20px;
        min-height: inherit;
      }
      
      [data-credit-card] [data-card-type] {
        transition: width 1.5s;
        margin-left: calc(100% - 130px);
      }
      [data-credit-card].is-visa {
        background: linear-gradient(135deg, #622774 0%, #c53364 100%);
      }
      [data-credit-card].is-mastercard {
        background: linear-gradient(135deg, #65799b 0%, #5e2563 100%);
      }
      .is-visa [data-card-type],
      .is-mastercard [data-card-type] {
        width: auto;
      }
      input.is-invalid,
      .is-invalid input {
        text-decoration: line-through;
      }
      ::placeholder {
        color: #fff;
      }
      
      [data-cart-info] span {
        display: inline-block;
        vertical-align: middle;
      }
      
      .material-icons {
        font-size: 150px;
      }
      
      div[data-credit-card] {
        width: 435px;
        min-height: 240px;
        border-radius: 10px;
        background-color: #5d6874;
      }
      
      [data-card-type] {
        display: block;
        width: 120px;
        height: 60px;
      }
      
      [data-cc-digits] {
        margin-top: 2em;
      }
      
      [data-cc-digits] input {
        color: #fff;
        font-size: 2em;
        line-height: 2em;
        border: none;
        background: none;
        margin-right: .5em;
      }
      
      [data-cc-info] {
        margin-top: 1em;
      }
      
      [data-cc-info] input {
        color: #fff;
        font-size: 1.2em;
        border: none;
        background: none;
      }
      
      [data-cc-info] input:last-child {
        padding-right: 10px;
        float: right;
      }
      
      [data-pay-btn] {
        position: fixed;
        width: 90%;
        border-style: solid;
        border-width: 1px;
        bottom: 20px;
      }
    </style>
  </head>
  <body>
    <div data-cart-info>
      <h1 class="mdc-typography--headline4">
        <span class="material-icons">shopping_cart</span>
        <span data-bill></span>
      </h1>
    </div>
    
    <div class="mdc-card mdc-card--outlined" data-credit-card>
      <div class="mdc-card__primary-action">
        <img data-card-type src="http://placehold.it/120x60.png?text=Card"/>
        <div data-cc-digits>
          <input type="text" size="4" placeholder="----"/>
          <input type="text" size="4" placeholder="----"/>
          <input type="text" size="4" placeholder="----"/>
          <input type="text" size="4" placeholder="----"/>
        </div>
          
          <div data-cc-info>
            <input type="text" size="20" placeholder="Name Surname"/>
            <input type="text" size="6" placeholder="MM/YY"/>
          </div>
          
        </div>
      </div>
    
    <button data-pay-btn class="mdc-button">Pay & Checkout Now</button>
    
    <script>
      const supportedCards = {
        visa, mastercard
      };
      
      const countries = [
        {
          code: "US",
          currency: "USD",
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          country: 'Ghana'
        }
      ];
      
      const startApp = () => {
        fetchBill()
        validateWithLuhn()
      };
      
      const appState = {};
      
      const formatAsMoney = (amount, buyerCountry) => {
        
        let country = countries.find(c => c.country === buyerCountry)
        
        country = country ? country : countries[0];
        
        const {code, currency} = country;
        
        return amount.toLocaleString(`en-${code}`, {style: "currency", currency: currency});
        
      }
      
      const flagIfInvalid = (field, isValid) => {
        
        if(isValid ===  true){
          return field.classList.remove('is-invalid')
        }
        else {
          return field.classList.add('is-invalid')
        }
        
      }
      
      const expiryDateFormatIsValid = (target) => {
        let re = /^(0[1-9]|1[0-2])\/([0-9][0-9])$/;
        if(!re.test(target)) return false;
        const [mm, yy] = target.split('/').map((e) => parseInt(e, 10)); 
        
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = parseInt(new Date().getFullYear().
                                     toString().substr(-2), 10);
        
        if(yy > currentYear) return true;
        else if(yy === currentYear) {
          if(currentMonth <= mm) return true;
        } else {
          return false;
        }
      }
      
      const detectCardType = ({ target }) => {
        const number = target.value;
        const cc = document.querySelector('[data-credit-card]')
        const img = document.querySelector('[data-card-type]')
        
        if(number.startsWith("4")) {
          cc.classList.remove('is-mastercard')
          cc.classList.add('is-visa')
          img.src = supportedCards.visa
          return 'is-visa'
        } else {
          cc.classList.remove('is-visa')
          cc.classList.add('is-mastercard')
          img.src = supportedCards.mastercard
          return 'is-mastercard'
        }
      }
      
      const validateCardExpiryDate = ({target}) => {
        const result = expiryDateFormatIsValid(target.value);
        flagIfInvalid(target, result);
        return result;
      }
      
      const validateCardHolderName = ({ target }) => {
        const name = target.value.split(" ")
        const firstName = name[0]
        const lastName = name[1]
        const isValid = name.length === 2 && firstName.length >= 3 && lastName.length >= 3
        
        console.log("name", name);
        console.log("\nfirstName", firstName);
        console.log("\nlastName", lastName);
        
        flagIfInvalid(target, isValid)
        return isValid
      }
      
      const validateWithLuhn = digits => {
        digits = digits.map(value => parseInt(value, 10))
        
        for(let i = digits.length - 2; i >= 0; i -= 2){
          digits[i] *= 2
          
          if(digits[i] > 9) {
            digits[i] -= 9
          }
        }
        
        const sum = digits.reduce((accumulator, value) => accumulator + value, 0)
        
        return (sum % 10) === 0
      }
      
      const validateCardNumber = () => {
        const digits = document.querySelectorAll('[data-cc-digits] input')
        const arrayOfDigits = Array.from(digits).map(input => input.value).join('').split('')
        const getDigitsDiv = document.querySelector('[data-cc-digits]')
        
        console.log("arrayOfDigits", arrayOfDigits);
        
        if(validateWithLuhn(arrayOfDigits)) {
          flagIfInvalid(getDigitsDiv, true)
          return true
        } else {
          flagIfInvalid(getDigitsDiv, false)
          return false
        }
        
      }
      
      const uiCanInteract = () => {
        const detectDigits = document.querySelector('[data-cc-digits] input:first-child')
        detectDigits.addEventListener("blur", detectCardType)
        
        const detectInfo = document.querySelector('[data-cc-info] input:first-child')
        detectInfo.addEventListener("blur", validateCardHolderName)
        
        const ExpiryDate = document.querySelector('[data-cc-info] input:last-child')
        ExpiryDate.addEventListener('blur', validateCardExpiryDate)
        
        const Owner = document.querySelector('[data-pay-btn]')
        Owner.addEventListener('click', validateCardNumber)
        
        detectDigits.focus()
      }
      
      const displayCartTotal = ({ results }) => {
        const [data] = results;
        
        const {itemsInCart,  buyerCountry} = data;
        
        appState.items = itemsInCart;
        appState.country = buyerCountry;
        
        appState.bill = itemsInCart.reduce((total, current) => {
          return total + (current.price * current.qty)
        }, 0);
        
        appState.billFormatted = formatAsMoney(appState.bill, appState.country);
        
        document.querySelector('[data-bill]').textContent = appState.billFormatted;
        
        uiCanInteract();
        
        console.log("appState", appState)
        
      }
      
      const fetchBill = () => {
        const api = "https://randomapi.com/api/006b08a801d82d0c9824dcfdfdfa3b3c";
        
        fetch(api)
        .then(response => response.json())
        .then(data => {displayCartTotal(data)})
        .catch((e) => console.log("Something bad ocurred", e))
      };
      
      startApp();
    </script>
  </body>
</html>