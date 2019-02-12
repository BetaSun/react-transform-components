/**
 * 合并类名
 * @param  {...String} args 不限制个数的类名
 * @return {String} 合并以后的类名
 */
export function classNames(...args) {
  return args.map(arg => arg || '').join(' ');
}

/**
 * 是否是数组
 * @param {Any} value 要判断的变量
 * @return {Boolean} true是数组，false不是数组
 */
export function isArray(value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * 是否是移动端
 * @return {Boolean} true是移动端，false不是移动端
 */
export function isMobile() {
  return /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(window.navigator.userAgent);
}

/**
 * 是否是除了ipad以外的移动端
 * @return {Boolean} true是移动端，false不是移动端
 */
export function isMobileExcludeIpad() {
  return /Android|iPhone|SymbianOS|Windows Phone|iPod/.test(window.navigator.userAgent);
}
