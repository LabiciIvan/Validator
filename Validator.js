/**
 *  The Validator class is designed to simplify the process of validating 
 * form fields in JavaScript. It provides a simple and intuitive interface 
 * for validating fields, while abstracting away the complexity of regular
 * expressions and other validation techniques.
 *
 *  The Validator class includes a variety of validation methods for common
 * form fields, including email, phone number, password, and more. These methods
 * are designed to be flexible and configurable, allowing you to easily customize
 * them to fit your specific validation requirements.
 * @class Validator
 *
 * @author Ioan Labici <labici.ioan@yahoo.com>
 */
class Validator {

    // alpha accepts only letters.
    alpha = /^\w\D+$/;

    // numeric accepts only numbers.
    numeric = /^(?=.*\d)[\d ]+$/;

    // alphaNumeric acccepts leters and numbers.
    alphaNumeric = /^[A-Za-z0-9 _]*[A-Za-z0-9][A-Za-z0-9 _]*$/;

    errorOn = false;

    errors = [];

    errorsTemporary = [];


    /**
     * 
     * @param {JSON} rules - A JSON object containing the fields and rules. Typically use the field name followed
     *                                     by a colon (:) and a string ('') with rules delimited by ( | ).
     * 
     *                                  Example:  {name  : 'required | alpha | max : 10 ',
     *                                             email : 'required | email | min : 10 '}.
     * 
     * @param {JSON} values - A JSON object containing the fields declared in rules and value. Typically the field name followed
     *                                      by a colon (:) and the value for that field.
     * 
     *                                  Example:  {name  : 'validator',
     *                                             email : 'validator@gmail.com'}.
     */
    constructor(rules, values) { 
        try {
            this.values = values;
            this.rules = rules;
            this.rulesKeys = Object.keys(rules);
            
            this.#validate();

        } catch (error) {
            throw error;
        }
    }


    #validate() {
        this.rulesKeys.forEach(key => {
            let rule = this.rules[key];
            let ruleSplit = rule.split('|');

            this.analiseRule(key, this.values[key], ruleSplit);
            
        });
    }


    async analiseRule(key, value, ruleSplit) {

        let assuredRules = this.assureRules(ruleSplit);
        
        assuredRules.forEach(individualRule => {
            if (individualRule.includes('min')) {
                let ruleCondition = individualRule.replace('min:', '');

                this.ruleExecutor['min'](key, value, ruleCondition);
            }
            else if (individualRule.includes('max')) {
                let ruleCondition = individualRule.replace('max:', '');

                this.ruleExecutor['max'](key, value, ruleCondition);
            }
            else if (individualRule.includes('alphaWithout')) {
                let ruleCondition = individualRule.replace('alphaWithout:', '');
    
                this.ruleExecutor['alphaWithout'](key, value, ruleCondition);  
            }
            else
            {
                try {
                    this.ruleExecutor[individualRule](key, value);
                } catch (error) {
                    throw error;
                }
            }
        });

        this.clean(key);
    }

    ruleExecutor = {
        required: (key, val) => {
            if (val === '' || val === null) this.packError(this.ruleError['required'](key), key);
        },
        min: (key, val, condition) => {
            if (val === undefined || val === '' || val == null) {
                this.packError(this.ruleError['min'](key, condition), key);
                return;
            }
            else
            {
                val.length < parseInt(condition) ? this.packError(this.ruleError['min'](key, condition), key) : '';
            } 
        },
        max: (key, val, condition) => {
            if (val === undefined || val === ' ' || val == null) {
                this.packError(this.ruleError['max'](key, condition), key);
            }
            else
            {
                val.length > parseInt(condition) === true ? this.packError(this.ruleError['max'](key, condition), key) : '';
            } 
        },
        alpha: (key, val) => {
            let result = this.alpha.test(val);

            if (result !== true) this.packError(this.ruleError['alpha'](key, val), key);
        },
        numeric: (key, val) => {
            let result = this.numeric.test(val);

            if (result !== true) this.packError(this.ruleError['numeric'](key, val), key);
        },
        alphaNumeric: (key, val) => {
            let result = this.alphaNumeric.test(val);

            if (result !== true) this.packError(this.ruleError['alphaNumeric'](key, val), key);
        },
        alphaWithout: (key,val, condition) => {

                let WITHOUT = new RegExp(`^[^${condition}]*$`);

                let result = WITHOUT.test(val);

                if (result !== true) this.packError(this.ruleError['alphaWithout'](key, val), key);
            
        }
    }


    ruleError = {
        required: (key) => {
            return `The field ${key} is required!`;
        },
        min: (key, condition) => {
            return `The field ${key} can be minimum ${condition} characters .`;
        },
        max: (key, condition) => {
            return `The field ${key} can be maximum ${condition} characters .`;
        },
        alpha: (key, val) => {
            return `The field ${key} can only be letters.`
        },
        numeric: (key, val) => {
            return `The field ${key} can only be numbers.`
        },
        alphaNumeric: (key, val) => {
            return `The field ${key} can be numbers and letters.`
        },
        alphaWithout: (key, condition) => {
            return `Format  ${''.repeat(2) +  condition + ' '.repeat(2)} is not allowed in ${key}.`
        }
    }


    async check() {
        return new Promise((resolved, rejected) => {

            this.rulesKeys.forEach(rule => {
                this.errors[rule].length > 0 ? this.errorOn = true : '';
            });

            this.errorOn === true ? rejected(this.errors) : resolved(true);
        });
    }

    
    packError(message, key) {
        this.errorsTemporary.push(message);
    }


    assureRules(ruleSplit) {
        let assuredRules = ruleSplit.filter(rule => {
            let trimmed = rule.trim();
            return trimmed.length > 0;
        });
        
        return assuredRules;
    }


    clean(key) {
        this.errors[key] = Array();
        this.errors[key] = [...this.errorsTemporary];

        this.errorsTemporary = new Array();
    }
}


export default Validator;