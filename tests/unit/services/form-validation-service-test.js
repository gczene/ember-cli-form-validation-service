import {
  moduleFor,
  test
} from 'ember-qunit';
import Em from 'ember';

var emptyForm = {
  firstName: '',
  lastName: '',
  validations: {
    firstName: {presence: true, length: {minimum: 3}},
    lastName: {presence: true}
  }
},
  filledForm = {
    firstName: 'morethan3',
    lastName: 'morethan3',
    validations: {
      firstName: {presence: true, length: {minimum: 3}},
      lastName: {presence: true}
    }
  };

moduleFor('service:form-validation-service', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
  needs: ['ember-validations@validator:local/presence']
});

// Replace this with your real tests.
test('it exists', function (assert) {
  var service = this.subject();
  assert.ok(service);
});

test('create method', function (assert) {
  var service = this.subject();
  assert.ok(service.create, 'should exist');
});

test('form.$status', function (assert) {
  var service = this.subject(),
    form;

  assert.equal(emptyForm.$status, undefined, 'should not exist');
  Em.run(function () {
    form = service.create(emptyForm);
  });
  assert.ok(form.$status, 'should exist');
  assert.equal(Em.keys(form.$status).length, 2, 'should have 2 elements');
  assert.equal(form.$status.firstName.valid, false, '.firstName.valid should be false');
  assert.equal(form.$status.firstName.invalid, true, '.firstName.valid should be true');
  Em.run(function () {
    form.set('firstName', 'morethan3');
  });
  assert.equal(form.$status.firstName.valid, true, '.firstName.valid should be true');
  assert.equal(form.$status.firstName.invalid, false, '.firstName.invalid should be false');
});

test('form.$valid', function (assert) {
  var service = this.subject(),
    form;

  Em.run(function () {
    form = service.create(emptyForm);
  });
  assert.equal(form.get('$valid'), false);
  assert.equal(form.get('$invalid'), true);

  Em.run(function () {
    form.set('firstName', 'morethan3');
  });
  assert.equal(form.get('$valid'), false);
  assert.equal(form.get('$invalid'), true);
  Em.run(function () {
    form.set('lastName', 'morethan3');
  });
  assert.equal(form.get('$valid'), true);
  assert.equal(form.get('$invalid'), false);

});

test('2 different instances', function (assert) {
  var service = this.subject(),
    form1,
    form2;
  Em.run(function () {
    form1 = service.create(emptyForm);
    form2 = service.create(filledForm);
  });
  assert.equal(form1.get('$valid'), false);
  assert.equal(form1.get('$invalid'), true);

  assert.equal(form2.get('$valid'), true);
  assert.equal(form2.get('$invalid'), false);

});
