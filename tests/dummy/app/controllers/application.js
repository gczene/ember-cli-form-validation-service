import Ember from 'ember';

var validations = {
  email: {
    presence: {
      message: 'Please give us your email address.'
    }
  }
};

export default Ember.Controller.extend({
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
