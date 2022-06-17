class ValidationError extends Error { }
class ValueError extends Error { }
class SchemaError extends Error { }

class Schema {
    constructor({ type, required = false, nullable = false }) {
        this.type = type;
        this.required = required;
        this.nullable = nullable;
    }

    validate(value) {
        if (value === null) return this.nullable;
        else if (value === undefined) return !this.required;
        return typeof value === this.type;
    }
}


class Validator {
    schemas = {};

    constructor(data) {
        this.__validate_schemas();
        this.__validate_data(data);
        this.data = data;
    }

    __validate_schemas() {
        for (let schemaName in this.schemas) {
            if (!(schemas[schemaName] instanceof Schema)) {
                throw new SchemaError(`${schemaName} is not a valid Schema`);
            }
        }
    }

    __validate_data(data) {
        if (typeof data !== 'object') {
            throw new ValueError('data must be an object');
        }
    }

    __getFieldValidator(field) {
        return `validate${field[0].toUpperCase()}${field.slice(1)}`;
    }

    validate() {
        for (let field in this.schemas) {
            const schema = this.schemas[field];
            const value = this.data[field];
            const validatorMethod = this.__getFieldValidator(field);
            const hasValidator = typeof this[validatorMethod] === 'function';

            if (!schema.validate(value)) {
                throw new ValidationError(`${value} is not a valid value for ${field}`);
            }
            if (hasValidator && !this[validatorMethod](value)) {
                throw new ValidationError(`${value} is not a valid value for ${field}`);
            }
        }
    }

    isValid({ raiseException = false }) {
        try {
            this.validate();
            return true;
        }
        catch (err) {
            if (raiseException) throw err;
            return false;
        }
    }
}

class MyValidator extends Validator {
    schemas = {
        name: new Schema({
            type: 'string',
            required: true,
            nullable: false,
        }),
        title: new Schema({
            type: 'string',
            required: false,
            nullable: true,
        })
    }

    validate() {
        super.validate();
        if (!(this.validateTitleV2(this.data.title))) {
            throw new ValidationError('title must be Mr.')
        }
    }

    validateTitle(value) {
        if (!['Mr.', 'Sir', 'Ms.', 'Mrs.'].includes(value)) {
            return false;
        }
        return true;
    }

    validateTitleV2(value) {
        if (!['Mr.'].includes(value)) {
            return false;
        }
        return true;
    }
}

// Valid Cases
// const validator1 = new MyValidator({
//     name: 'Rahman',
//     title: 'Mr.'
// });
// console.log(validator1.isValid({ raiseException: true }));

// const validator2 = new MyValidator({
//     name: 'Rahman'
// });
// console.log(validator2.isValid({ raiseException: true }));

// const validator3 = new MyValidator({
//     name: 'Rahman',
//     title: null
// });
// console.log(validator3.isValid({ raiseException: true }));


// Invalid cases
// const validator4 = new MyValidator({
//     title: 'Mr.'
// });
// console.log(validator4.isValid({ raiseException: true }));

// const validator5 = new MyValidator({
//     name: null
// });
// console.log(validator5.isValid({ raiseException: true }));

// const validator6 = new MyValidator({
//     name: 'Rahman',
//     title: 'MR.'
// });
// console.log(validator6.isValid({ raiseException: true }));

const validator7 = new MyValidator({
    name: 'Rahman',
    title: 'Sir'
});
console.log(validator7.isValid({ raiseException: true }));