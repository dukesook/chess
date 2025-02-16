export default class Utility {

  static must_be(object, type) {
    if (!(object instanceof type)) {
      throw new Error(`Must be a ${type.name}`);
    }
  }

  static must_be_string(object) {
    if (typeof object !== 'string') {
      throw new Error('Must be a string');
    }
  }

}