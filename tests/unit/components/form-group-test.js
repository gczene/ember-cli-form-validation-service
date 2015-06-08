import {
  moduleForComponent,
  test
} from 'ember-qunit';

import Ember from 'ember';

var component;

moduleForComponent('form-group', {
  // Specify the other units that are required for this test
  // needs: ['component:foo', 'helper:bar']
  beforeEach: function () {
    component = this.subject();
  }
});

test('it renders', function (assert) {
  assert.expect(2);
  assert.equal(component._state, 'preRender');
  this.render();
  assert.equal(component._state, 'inDOM');
});

test('initials values', function (assert) {

  assert.ok(component.get('status.pristine'));
  assert.equal(component.get('status.dirty'), false);
  assert.equal(component.get('status.touched'), false);
  assert.equal(component.get('status.untouched'), true);
  assert.equal(component.get('status.valueChanged'), false);
  assert.equal(component.get('status.inFocus'), false);

});

test('dirty should be the opposite of pristine after changing pristine', function (assert) {
  component.set('status.pristine', false);
  assert.ok(component.get('status.dirty'));
});

test('untouched should be the opposite of pristine after changing touched', function (assert) {
  component.set('status.touched', true);
  assert.equal(component.get('status.untouched'), false);
});

test('has-error should be the opposite of has-success', function (assert) {
  var self = this;

  Ember.run(function () {
    component.set('hasError', false);
  });

  assert.ok(self.$().hasClass('has-success'), 'should add has-success CSS class');
  assert.ok(!self.$().hasClass('has-error'), 'should remove has-error CSS class');

  Ember.run(function () {
    component.set('hasError', true);
  });

  assert.ok(!self.$().hasClass('has-success'), 'should remove has-success CSS class');
  assert.ok(self.$().hasClass('has-error'), 'should add has-error CSS class');
});

test('changing the input value', function (assert) {
  // $component = this.append('<input value="dsada">');
  var $component = this.$(),
    self = this;

  $component.html('<input type="text" value="testValue">');
  component.didInsertElement();
  Ember.run(function () {
    self.$('input').val('anotherValue').trigger('keyup');
  });
  assert.ok(component.get('status.valueChanged'), '.status.valuchanged should be set to true');
  assert.ok(this.$().hasClass('value-changed'), 'should add value-changed CSS class');

  Ember.run(function () {
    self.$('input').val('testValue').trigger('keyup');
  });
  assert.equal(component.get('status.valueChanged'), false, '.status.valuchanged should be set to false');
  assert.equal(this.$().hasClass('value-changed'), false, 'should remove value-changed CSS class');

});

test('keyup event', function (assert) {
  var dessert = assert,
    self = this;

  this.$().html('<input type="text">');
  component.didInsertElement();

  dessert.ok(component.get('status.pristine'), 'status.pristine should be true as initial');
  dessert.ok(this.$().hasClass('pristine'), 'should have pristine CSS class');
  dessert.equal(component.get('status.dirty'), false, 'status.pristine should be true as initial');
  dessert.equal(this.$().hasClass('dirty'), false, 'should NOT have dirty CSS class');

  Ember.run(function () {
    self.$('input').trigger('keyup');
  });

  dessert.equal(this.$().hasClass('pristine'), false, 'should NOT have pristine CSS class');
  dessert.equal(component.get('status.pristine'), false, 'status.pristine should be false after keyup event');
  dessert.equal(component.get('status.dirty'), true, 'status.dirty should be false after keyup event');
  dessert.equal(this.$().hasClass('dirty'), true, 'should have dirty CSS class');
});

test('focus event', function (assert) {
  var self = this;
  this.$().html('<input type="text">');
  component.didInsertElement();

  assert.equal(component.get('status.inFocus'), false, 'status.inFocus should be false before focus event fired');
  assert.equal(this.$().hasClass('in-focus'), false, 'should NOT have in-focus CSS class');
  Ember.run(function () {
    self.$('input').trigger('focus');
  });
  assert.equal(component.get('status.inFocus'), true, 'status.inFocus should be true after focus event fired');
  assert.equal(this.$().hasClass('in-focus'), true, 'should have in-focus CSS class');
});

test('blur event', function (assert) {
  var self = this;
  this.$().html('<input type="text">');
  component.didInsertElement();
  assert.equal(this.$().hasClass('touched'), false, 'should NOT have touched CSS class after blur is fired');
  assert.equal(this.$().hasClass('untouched'), true, 'should have untouched CSS class after blur is fired');

  Ember.run(function () {
    component.set('status.inFocus', true);
    self.$('input').trigger('blur');
  });
  assert.equal(component.get('status.inFocus'), false);
  assert.equal(this.$().hasClass('touched'), true, 'should have touched CSS class after blur is fired');
  assert.equal(this.$().hasClass('untouched'), false, 'should NOT have untouched CSS class after blur is fired');
});
