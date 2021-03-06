# Ember-cli-form-validation-service

This package helps you to validate forms and sets up CSS rules for showing/hiding error messages and/or bootstrap icons relies on DOM events and `ember-validations`.

Built on top of [ember-validation](https://github.com/dockyard/ember-validations) so you can build your any custom validator.

## Implementation example

As in the example I recommend to keep your forms as a component.

### Index controller
Lets start from the beginning. You have a `controller` called `index` which has a property consists of the form configuration. In my case it is called *formData* but of course you can call it by your wish. (Note: Multiple form configurations work as well.)

```javascript
// controllers/index.js
import Ember from 'ember';

// more elegant if you import your rules from somewhere
var validations = {
  firstName: {
    presence: true
  },
  email: {
    presence: {
      message: 'Please give us your email address.'
    },
    length: { minimum: 5 }
  }
};

export default Ember.Controller.extend({
  // form configuration
  formData: {
    firstName: '',
    lastName: '',
    email: '',
    validations: validations
  },
  actions: {
    submit() {
      console.log('form is submitted!');
    }
  }
});

```

**formData property**

Form fields list + the validation rules.

**submit action**
Submit action will catch the form submit event from component (see template).

### Index template

```javascript
{{!-- templates/index.hbs --}}
{{my-form form=formData action="submit"}}

```

**Important**: `form` property is required!

### My-form component.js

Currently there is no blueprint yet, please create this stub manually:

```javascript
// components/my-form.js
import Ember from 'ember';
import ValidatedFormComponent from '../components/validated-form';

export default ValidatedFormComponent.extend({
  // your custom stuff here
});
```

### My-form compenent's template
It is the most complex part but don't be scared most of them is just pure bootstrap implememtation.

```html
{{!-- templates/components/my-form.hbs --}}
<form class="{{if submitted 'submitted' 'unsubmitted'}}" id="myForm">
  <!-- login form / password -->
  <div class="row">
    <div class="col-md-4 col-md-offset-4 col-xs-12">
      {{#form-group class="has-feedback" hasError=form.$status.firstName.invalid}}
        <label for="firstName">First name</label>
        {{input value=form.firstName class="form-control" id="firstName"}}
        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
        <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
        <p class="error">
          {{{form.errors.firstName.firstObject}}}
        </p>
      {{/form-group}}
    </div>
  </div>

  <!-- login form / email -->
  <div class="row">
    <div class="col-md-4 col-md-offset-4 col-xs-12">
      {{form.$status.email.valid}}
      {{#form-group class="has-feedback" hasError=form.$status.email.invalid}}
        <label for="email">Email address</label>
        {{input type="text" value=form.email class="form-control" id="email"}}
        <span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>
        <span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>
        <p class="error">
          {{{form.errors.email.firstObject}}}
        </p>
      {{/form-group}}
    </div>
  </div>

  <!-- login form / submit -->
  <div class="row">
    <div class="col-md-4 col-md-offset-4 col-xs-12">
      <div class="form-group">
        <button type="submit"
            class="btn btn-primary"
            {{action "submit"}}>
          <span class="fa fa-angle-right" aria-hidden="true"></span>
          Log in
        </button>
      </div>
    </div>
  </div>
</form>


```

Ok, so what happened here?

When you passed the `formData` to the extended `ValidatedForm` component it decorated the formData object with some new useful properties.

These properties are:

Property  | Type | Explanation |
------------- | ------------- | -------------
$valid  | Boolean | true if every property is valid
$invalid  | Boolean | opposite of $valid
$status | Object | individual property validity. See below:


### $status
Relying on the `validation` object properties (passed it from controller) will be created on this object.
In my example above there is a `firstName` and `email` property therefore `$status` will have these flags:

```javascript
// in the example controller you can reach those as:
formData.$status.email.invalid
formData.$status.email.valid
formData.$status.firstName.invalid
formData.$status.firstName.valid

// in your component's template you can reach those as:
form.$status.email.invalid
form.$status.email.valid
form.$status.firstName.invalid
form.$status.firstName.valid

```

Error messages are generated by [ember-validation](https://github.com/dockyard/ember-validations) so available as `errors`.

## form-group component

It is the other interesting part. The goal is to implement a flexible way to show/hide error messages (or anything else) inside Bootstrap style `div.form-group` div. This component add additional classes to the .form-group wrapper.

For example you have this snippet:
```html
<div class="form-group otherClass">
    <label for="exampleInputFile">File input</label>
    <input type="file" id="exampleInputFile">
    <p class="help-block">Example block-level help text here.</p>
    <p class="alert alert-danger">{{renderedErrorMessage}}</p>
</div>
```
and the `<p>` expected to be shown on different DOM events controlled only with `CSS` you can use this `component`

Example implementation:
```html
{{#form-group class="otherClass"}}
    <label for="exampleInputFile">File input</label>
    <input type="file" id="exampleInputFile"> <!-- of course do it in ember way -->
    <p class="help-block">Example block-level help text here.</p>
    <p class="alert alert-danger">{{renderedErrorMessage}}</p>
{{/form-group}}
```

and in `less` file
```css

.form-group{
    /*input triggers it on blur event*/
    p.alert {
        display: none;
    }
    &.touched {
        p.alert {
            display: block;
        }
    }
}
```
Generated `CSS` classes on `div.form-group`.

| CSS class | happens when|
| ----------| -------|
| pristine | the control hasn't been interacted with yet |
| dirty |the control has been interacted with |
| untouched | the control hasn't been blurred |
| touched | the control has been blurred |
| infocus | the input is in focus |
| valueChanged | the value of the input is different from the initial value |

(Yes this terminology comes from angular).

If you want to use `has-error` class you can implement like:
```html
{{#form-group class="otherClass" hasError=yourVariable}}
...
```

Note: `form-validation-service` has a feature to detect the validity of the inside form. Let's combine them:
```html
{{#form-group class="otherClass" hasError=form.$status.firstName.invalid}}
    {{input value=form.firstName}}
{{/form-group}}
```



## This package contains
- **validated-form** component
- **form-group** component
- **form-validation-service**

## validated-form component

When you create a form use your own component which is extended from `validated-form`. (Currently there is no blueprint yet, please do it manually)
```javascript
//components/my-form.js
import Ember from 'ember';
import ValidatedFormComponent from '../components/validated-form';

export default ValidatedFormComponent.extend({});

```
This component requires a `form` property where your form configuration is sitting. (See below in implementation section).

This will create a `submit` action which will bubble up and will create a `submitted` property in your `my-form` component.

## form-validation-service
This handy service is working for you. it implements `ember-validation` and validating your form meanwhile creates some new properties to check the form validity and field validity too. Please see below for detailed description.

##form-group component
It follows `bootstrap` conventions and will decorate the `form-group` classed div with several css classes based on the input states and DOM events.




## Installation

* `npm install ember-cli-form-validation-service --save`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
