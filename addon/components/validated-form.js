import Ember from 'ember';

export default Ember.Component.extend({

  submitted: false,
  formValidationService: Ember.inject.service(),
  init: function () {
    this._super();
    var helper = this.get('formValidationService');
    this.set('form', helper.create(this.get('form')));
  },
  actions: {
    submit: function () {
      this.set('submitted', true);
      if (this.get('form.$valid')) {
        this.sendAction();
      }
    }
  }
});
