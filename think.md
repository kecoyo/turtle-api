## think 对象
框架中内置 think 全局对象，方便在项目中随时随地使用。
```js
think.app
think.ROOT_PATH
think.APP_PATH
think.env
think.version
think.config(name, value, m)
think.Controller
think.Logic
think.Service
think.service(name, m, ...args)
think.beforeStartServer(fn)
think.isArray(array)
think.isBoolean(boolean)
think.isInt(any)
think.isNull(any)
think.isNullOrUndefined(any)
think.isNumber(number)
think.isString(str)
think.isSymbol(any)
think.isUndefined(any)
think.isRegExp(reg)
think.isDate(date)
think.isError(error)
think.isFunction(any)
think.isPrimitive(any)
think.isIP(ip)
think.isBuffer(buffer)
think.isIPv4(ip)
think.isIPv6(ip)
think.isMaster
think.isObject(obj)
think.promisify(fn, receiver)
think.extend(target,...any)
think.camelCase(str)
think.snakeCase(str)
think.isNumberString(str)
think.isTrueEmpty(any)
think.isEmpty(any)
think.defer()
think.omit(obj, props)
think.md5(str)
think.timeout(num)
think.escapeHtml(str)
think.datetime(date, format)
think.uuid(version)
think.ms(str)
think.isExist(path)
think.isFile(filepath)
think.isDirectory(filepath)
think.chmod(path, mode)
think.mkdir(path, mode)
think.getdirFiles(dir, prefix)
think.rmdir(path, reserve)
```
