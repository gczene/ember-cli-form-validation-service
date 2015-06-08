/**
 * Form model helper
 * this service based on ember-validation see https://github.com/dockyard/ember-validations
 * Example controller: <todo: URL of github example controller>
 *
 *  this service will generate a '$status' object on the passed obj.
 *  e.g. user: {firstName: 'John', lastName: 'Doe'}
 *  will have new properties like
 *  - $status.firstName.valid   => one property validity
 *  - errors.firstName          => see: ember-validations
 *  - $valid                    => indicates the whole object validity (if any of them is invalid, it becomes to false too)
 *
 */

import Ember from 'ember';
import EmberValidations from 'ember-validations';

var statusObjectPrefix = '$status';

export default Ember.Service.extend({
  /**
   * Observer for form properties
   */
  _addObserver: function () {
    this.setValidationByErrors();
  },
  /**
   * Setting validity flags depends on ember-validation.errors
   */
  setValidationByErrors: function () {
    this.set('$valid', true);
    return this.validate()
      .catch((err) => {
        // one of them fails => the form is invalid
        this.set('$valid', false);
        return err;
      })
      .finally(() => {
        // looping through the passed validation rules and compare it to ember-validations.errors
        // and sets up true | false on the
        Ember.keys(this.get('validations'))
          .forEach((key) => {
            this.setOnePropertyValidity(key, !this.get('errors.' + key).get('length'));
          });
      });
  },
  /**
   * Set up one form property flag
   * @param {String}  prop   property name
   * @param {Boolean} value  value to set
   * @return {this}
   */
  setOnePropertyValidity: function (prop, value) {
    this.set(statusObjectPrefix + '.' + prop + '.valid', value);
    this.set(statusObjectPrefix + '.' + prop + '.invalid', !value);
  },

  attacheMethods: function (form) {
    form.setOnePropertyValidity = this.setOnePropertyValidity;
    form.setValidationByErrors = this.setValidationByErrors;
    form._addObserver = this._addObserver;
  },
  create: function (form) {
    if (form.get && (form.get('$status') !== undefined)) {
      return form;
    }
    // EmberValidations.Mixin attempt to lookup the container of the object it is
    // extending but by default Ember.Objects do not have containers
    var container = Ember.get(this, 'container'),
      originalKeys = Ember.keys(form);

    this.attacheMethods(form);
    // it is a raw object
    if (form instanceof Ember.Object === false) {
      form = Ember.Object.extend(form, EmberValidations.Mixin, {
        $invalid: Ember.computed.not('$valid'),
        validations: form.validations
      }).create({container: container});
    } else {
      // it is already an Ember.Object instance
      form.reopen(EmberValidations.Mixin, {
        $invalid: Ember.computed.not('$valid'),
        validations: form.validations,
        container: container
      });
      form = (form.create && form.create()) || form;
    }
    // set $status property
    form.set(statusObjectPrefix, Ember.Object.create({}));

    originalKeys.forEach((prop) => {
      if (prop !== 'validations') {
        form.set(prop, form[prop]);
        form.set(statusObjectPrefix + '.' + prop, {});
        form.setOnePropertyValidity(prop, true);
        form.addObserver(prop, form, '_addObserver');
      }
    });

    if (form.validations) {
      form.init();
      form.setValidationByErrors();
    }
    return form;
  }
});
