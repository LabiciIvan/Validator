// Import Validator from it's file.
import Validator from "./Validator.js";

// Declare rules.
let rules =   {
    name: 'required|min:2|max:250|alpha',
    email: 'required|min:2|alpha',
    password: 'required',
    password_confirmation: 'required',
};

// Declare values
let values = {
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
};


const handleInput = () => {
    let inputs = document.querySelectorAll('.input-validator');
    inputs.forEach(e => {
        values[e.name] = e.value;
    });
    
    // Initialise Validation as a new Validator and pass rules and values.
    const Validation = new Validator(rules, values);

    // Access check() method and use .then and .catch for further decisions.
    Validation.check()
    .then((res) => {
        console.log('res', res);
        res === true ? console.log('Validation succeeded.', res) : console.log('Something went wrong...', res) ;
    })
    .catch((err) => {
        console.log('err', err);
    });
}




document.querySelector('.btn').addEventListener('click', handleInput);