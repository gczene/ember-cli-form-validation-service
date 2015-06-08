import Ember from 'ember';
import layout from '../templates/components/form-group';

export default Ember.Component.extend({
  layout: layout,
  classNames: ['form-group'],
  classNameBindings: [
    'hasError:has-error:has-success',
    'status.pristine:pristine',
    'status.dirty:dirty',
    'status.touched:touched',
    'status.untouched:untouched',
    'status.inFocus:in-focus',
    'status.valueChanged:value-changed'
  ],
  init: function () {
    this._super();
    this.set('status', Ember.Object.extend({
      pristine: true,
      dirty: Ember.computed.not('pristine'),
      touched: false,
      untouched: Ember.computed.not('touched'),
      inFocus: false,
      valueChanged: false
    }).create());
  },
  reset: function () {
    this.set('status.pristine', true);
    this.set('status.touched', false);
    this.set('status.valueChanged', false);
  },
  didInsertElement: function () {
    var html = Ember.$(this.element),
      self = this,
      _element; // input or select or textarea inside this <div>

    _element = Ember.$('input, textarea, select', html);

    self.set('value', _element.val())
      .set('initialValue', _element.val());

    _element.on('reset', self.reset.bind(self));

    _element.on('keyup', function () {
      self.set('status.pristine', false)
        .set('value', Ember.$(this).val())
        .set('status.valueChanged', self.get('value') !== self.get('initialValue'));
    });
    _element.on('change', function () {
      self.set('status.pristine', false)
        .set('value', Ember.$(this).val())
        .set('status.valueChanged', self.get('value') !== self.get('initialValue'));
    });
    _element.on('focus', function () {
      self.set('status.inFocus', true);
    });

    _element.on('blur', function () {
      self.set('status.inFocus', false)
        .set('status.touched', true);
    });
  }
});
