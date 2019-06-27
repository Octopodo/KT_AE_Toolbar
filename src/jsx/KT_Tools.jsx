var KT = {};
KT.sys = {};
KT.Types = {};
KT.icons = {};

(function(){

/************************************************/

if(!Array.prototype.indexOf){
  Array.prototype.indexOf = function(item) {
    if(item instanceof Function){
      for (var i = 0; i < this.length; i++) {
        if (item (this[i])) {
          return i;
        } 
      }
      return -1;
    }
    else{
      for (var i = 0; i < this.length; i++) {
        if (item ==  this[i]) {

          return i;
        } 
      }
      return -1;
    }
  }
}

if(!Array.prototype.find)
{
    Array.prototype.find = function(callback) 
    {
        for (var i = 0; i < this.length; i++) {
            if (callback(this[i])) {
                return this[i];
            } 
        }
        return -1;
    }
}


if(!Array.prototype.remove)
{
    Array.prototype.remove = function() 
    {
        var what, a = arguments, L = a.length, ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    }
}


if(!Array.prototype.swap)
{
    Array.prototype.swap = function(index_A, index_B) 
    {
        var temp = this[index_A];
        this[index_A] = this[index_B];
        this[index_B] = temp;
        return this;
    }
}


if(!Array.prototype.shuffle)
{
    Array.prototype.shuffle = function()
    { 
        for (var i = this.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this[i];
            this[i] = this[j];
            this[j] = temp;
            }
        return this;
    }
}

if (!String.prototype.splice) {
    /**
     * {JSDoc}
     *
     * The splice() method changes the content of a string by removing a range of
     * characters and/or adding new characters.
     *
     * @this {String}
     * @param {number} start Index at which to start changing the string.
     * @param {number} delCount An integer indicating the number of old chars to remove.
     * @param {string} newSubStr The String that is spliced in.
     * @return {string} A new string with the spliced substring.
     */
    String.prototype.splice = function(start, delCount, newSubStr) {
        return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
    };
}

if(!String.prototype.toCamelCase)
{
    String.prototype.toCamelCase = function()
    {
        return this.charAt(0).toLowerCase() + this.slice(1);
    }
}


if(!String.prototype.toClassCase)
{
    String.prototype.toClassCase = function()
    {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }
}


KT.assign = function(target, source)
{
    var newSource = JSON.stringify(source);
    newSource = JSON.parse(newSource);
    for(var i in newSource)
    {
        target[i] = newSource[i];
    }
    return target
}

/**/
KT.checkType = function(element, types, strict)
{   
    var _types = KT.toArray(types);
    if (strict) {
        var result = true;
        for (var i = 0; i <_types.length; i++) {
            var type = _types[i];
            var isType = KT["is" + type.toClassCase()](element);
            if (!isType) {
                result = false;
            }
        }
    } else {
        var result = false;
        for (var i = 0; i < _types.length; i++) {
            var type = _types[i];
            var isType = KT["is" + type.toClassCase()](element);
            if (isType === true) {
                result = true;  
            }
        }
    }
    return result;
}


/**/
KT.crawlItems = function(items, storage) {
    var curItems;
    var check = items instanceof FolderItem;

    if( items instanceof FolderItem ){
        curItems = items.items;
    } else {
        curItems = items;
    }
            
    if(curItems instanceof CompItem || curItems instanceof FootageItem && curItems.hasVideo) {
        storage.push(curItems);
        return;
    }

    for(var i = 1; i <= curItems.length; i++){
        if(curItems[i] instanceof CompItem || curItems[i] instanceof FootageItem && curItems[i].hasVideo) {
            storage.push(curItems[i])
        } else if(curItems[i] instanceof FolderItem){
            KT.crawlItems(curItems[i], storage);
        }
    }
}


/**/
KT.collectLayersSource = function(comp, min)
{
    if(comp.numLayers <= min) {
        return false
        }

    var layers = [];

    for (var i = 1; i <= comp.numLayers; i++) {
        var layer = comp.layer(i);
        layers.push(layer.source);
    }
    return layers;
}


/**/
KT.collectProjectSelection = function(filters, getAudio, selection, items)
{
    var _items = (!items) ? [] : items;
    var _selection = (!selection) ?  app.project.selection : selection;
    var _filters = KT.toArray(filters);

    if( !_selection || _selection.length <= 0) { 
        return false 
    }
    
    for (var i = 0; i < _selection.length; i++) {
        var item = _selection[i];
        
        if (item instanceof FolderItem) {
            var folderItems = KT.collectionToArray(item.items)
            KT.collectProjectSelection( _filters, getAudio, folderItems, _items);
            continue
        }
        
        var filterPass = false;

        for(var j = 0; j < _filters.length; j++) {
            if(!filterPass) {
                var filter = _filters[j];
                filterPass = item instanceof filter
            }
        }
        
        if (filterPass == true) {
            var isAudio = (item.hasAudio == true && !item.hasVideo);
            if(isAudio == true && !getAudio) {
                continue
            } else {
                _items.push(item)
            }
        }
    }
    
    return _items
}

KT.extend = function (target, source)
{
  target = target || {};
  for (var prop in source)
  {
    if (typeof source[prop] === 'object')
    {
      target[prop] = extend(target[prop], source[prop]);
    } else
    {
      target[prop] = source[prop];
    }
  }
  return target;
}


/**/
KT.collectionToArray = function(collection) {
    var arr = [];
    
    for (var i = 1; i <= collection.length; i++){
        arr.push(collection[i])
    }

    return arr
}


/**/
KT.findItem = function(name,  type, items, callback) 
{
    var _items = (!items) ? KT.collectionToArray(app.project.items) : items;

    for(var i = 0; i < _items.length; i++) {
        var item = _items[i];
        var _type = (!type) ? true : item instanceof type;

        if (item.name.match(new RegExp(encodeURIComponent(name))) && _type == true) {
            return item
            if(callback != null) {callback(item)}
        } else {
            continue
        }

    }

    return false;
}


/**/
KT.formatDecimals = function(value, length)
{
    var _length = (!length) ? 2 : length;
    var newValue = value.toString(); 
    var split = newValue.split(".");  
    var decimals = "";
    
    if (split.length >1) { 
        decimals =  "." + split[1].substring(0, length);
    }
        
    var integers = split[0]; 
    var ret = integers + decimals;     
    return  ret;    
}


/**/
KT.fileExists = function(path)
{
    return new File(path).exists;
}


/**/
KT.getFileNames = function(path, obj, def)
{

    var folder = new Folder(path);
    var fileNames = (!obj) ? [] : {};
    var value = (!def) ? false : true;
    folder.getFiles(function(file)
    {
        if(file instanceof File)
        {   
            fileName = KT.stripFileExtension(KT.stripFileExtension(file.name));
            if(!obj) {fileNames.push(fileName)}
            else {fileNames[fileName] = value}
        }
    });
    return fileNames
}

KT.getFileName = function(path)
{
    var split = path.split("/");
    return split[split.length -1];
}

/**/
KT.getType = function(element) 
{
    return element.constructor.name;
}


/**/
KT.getExtension = function (fileName)
{
    var split = fileName.split(".");
    return split[split.length - 1]
}


/**/
KT.getPrefix = function (str, delimiter)
{
    var split = str.split(delimiter);
     return split[0]
}


/**/
KT.getValueFromString = function(string)
{
    if(string == "true" || string == "false") {
        return (string == "true");
    }
        
    if(!isNaN(parseFloat(string))){
        return parseFloat(string);
    }
                        
    return string;
}


/**/
KT.intersectVectors= function(vectorOne, vectorTwo, min, max)
{
    var _max = (!max) ? Number.MAX_VALUE : max;
    var _min = (!min) ? -1 * Number.MAX_VALUE : min;

    _max = (_max < _min) ? _min : _max;
    _min = (_min > _max) ? _max : _min;
    var intersection = [vectorOne[0], vectorOne[1]];
    intersection[0] = (vectorOne[0] > vectorTwo[0]) ? vectorOne[0] : vectorTwo[0];
    intersection[1] = (vectorOne[1] < vectorTwo[1]) ? vectorOne[1] : vectorTwo[1];
    
    if (intersection[0] > intersection[1]) {intersection[0] = intersection[1]};
    if (intersection[1] < intersection[0]) {intersection[1] = intersection[0]};
    if (intersection[0] < _min) {intersection[0] = _min};
    if (intersection[1] < _min) {intersection[1] = _min};
    if (intersection[0] > _max) {intersection[1] = _max};
    if (intersection[1] > _max) {intersection[1] = _max};
    return intersection
}


/**/
KT.isArray = function(element, type)
{    
    var isArray = element instanceof Array;   
    var typeUndefined = KT.isUndefined(type);

    if(typeUndefined) {        
            return isArray
    } else {
    
        if (isArray) {
            var member = "is" +  type.toClassCase();
            return KT[member](element[0]);
        } else {
            return false;
        }   
    }
}

KT.isPromise = function(element)
{
    return element instanceof KT.Types.Promise;
}
/**/
KT.isFlag = function(element)
{
    var isString = KT.isString(element);
    
    if (isString) {
        return KT.env.get("env.flags").test(element);
    }
    
}


/**/
KT.isEmpty = function(element)
{
    var isArray = KT.isArray(element);   
    
    if (isArray) {
        return element.length < 1;
    }

    return true;
}


/**/
KT.isFunction = function(element)
{
    return typeof element === "function";
} 


/**/
KT.isKTObject = function(member)
{
    return member.slice(0, 2) === "KT";
}


/**/
KT.isObject = function(element)
{
    return  element === Object(element) && !KT.isFunction(element) && !KT.isArray(element)
}

/**/
KT.isNotEmpty = function(element)
{
    var isArray = KT.isArray(element);
    
    if (isArray) {
        return element.length > 0; 
    }
    
    return false;
}


/**/
KT.isObject = function(element)
{
    return typeof element === 'object';
}


/**/
KT.isLiteral = function(element)
{
    return !KT.checkType(element, [ "Array", "Function"]) && KT.isObject(element);               
}

KT.isNumber = function(element)
{
    return typeof element === 'number'
}    

/**/
KT.isString =  function(element)
{
    return typeof element === "string";
}


/**/
KT.isUndefined = function(element)
{
    return element == null;

}

KT.listProperties = function(obj)
{
    var list = ""
    for (var p in obj)
    {
        list += p + "\n";
    }
    alert(list)
}

/**/
KT.quickSort = function(arr)
{
    
    if (arr.length <= 1) { 
        return origArray;
    } else {
        var left = [];
        var right = [];
        var newArray = [];
        var pivot = arr.pop();
        var length = arr.length;
        
        for (var i = 0; i < length; i++) {
            if (arr[i] <= pivot) {
                left.push(arr[i]);
            } else {
                right.push(arr[i]);
            }
        }

        return newArray.concat(quickSort(left), pivot, quickSort(right));  
    }
}


/**/
KT.randomFloatInRange = function(min, max)
{
    return Math.random() * (max - min) + min;
}


/**/
KT.randomIntInRange = function(min, max)
{ 
    return Math.floor(Math.random() * (max - min + 1) + min); 
} 


/**/
KT.randomIntList = function(length, min, max)
{
    var _min = (!min) ? 0: min;
    var _max = (!max) ? 0: max;
    var list = [];
    
    for (var i = 0; i < length; i++) {  
        list.push(KT.randomIntInRange (_min, _max));    
    }

    return list 
}


/**/
KT.readFile = function(path)
{
    var file   = new File(path);
    if (!file) {
        return null     
    }

    var split = file.name.split(".");
    var fileOk = file.open("r");
        
    if(fileOk) {  
        var content =  file.read();
        file.close();
        return content
    }
    return null
}


/**/
KT.secsFromTimecode = function(time, frameDuration){
    var _frameDuration_ = (!frameDuration)? 1/25: frameDuration;
    var codes = time.split(":");

    return  parseInt(codes[0]) * 3600 +
            parseInt(codes[1]) * 60 +
            parseInt(codes[2]) +
            parseInt(codes[3]) * _frameDuration_
        
}


/**/
KT.selectFile = function(mode, prompt) 
{
    var _prompt_ = (!prompt) ? "Select a file": prompt;
    var _mode_ = (!mode) ? 'r': mode; 
    var file = new File().openDlg(_prompt_);
        
    if (!file) {   
        return false;
    }
        
        var fileOk = file.open(mode); 
        
    if (fileOk == true) {
        return file;
    } else {
        return false;
            
    }
        
}


/**/
KT.selectFolderDialog = function(prompt)
{
    var folder = File.saveDialog(prompt || '');

    if(!folder) {
        return
    }


    folder = folder.toString().split("/");
    folder.pop();
    folder = folder.join("/");
    var path = Folder.decode(folder);
    
    //Here starts the clean function
    return new Folder(path);
}


/**/
KT.shuffleArray = function(array)
{
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    return array;
}


/*TODO:
    Replace the regex for a env variable
*/
KT.stripFileExtension = function (str)
{
    return str.replace(/\.[^\/.]+$/, "")
}


/*TODO:
    Replace the regex for a env variable
*/
KT.stripFramesFromString = function (str)
{
    return str.replace(/\[[^\/[]+$/, "");
}


/*TODO:
    Replace the regex for a env variable
*/
KT.stripPrefix = function(str)
{
    return str.replace(/^(.*?)_/, "");
}
    

/**/
KT.toArray = function(element)
{
    var isArray = KT.isArray(element);
    
    if(!isArray) {   
        return [element];
    } else {
        return element;
    }
}

KT.argsToArray = function(args)
{
    var arr = []
    for (var i = 0; i < args.length; i++)
    {
        arr.push(args[i])
    }
    return arr;
}


/**/
KT.toKTCase = function(member)
{
    var _member = member;
    var _member = _member.replace(/ /g, "");
    var isKTObject = KT.isKTObject(_member);
    
    if (isKTObject) {
        return _member;
    } else  {
        return _member.toCamelCase();
    }
}


/**/
KT.validateInput = function(value, length) 
{
    var _length_ = (!length)? 2: length;
    var newVal = value.toString();
    var length = newVal.length;

    if (newVal.length < _length_) {
        var numZeros = _length_ - newVal.length;
        
        for (var i = 0; i < numZeros; i++) {
            newVal = "0" + newVal;
        }

        return newVal;
    } else {
        return newVal;
    }
}


/**/
KT.writeFile = function(content, path)
{
    var file = new File(path);
    var fileOk = file.open("w");
    
    if (!fileOk) {
        return KT;
    }

    file.write(content);
    file.close();
    return KT;
}

/*******************************************/
KT.Types.Config = function(){

  this.active = false;
  this.available = false;
  this.injected = false;
  this.licensed = true;
  this.forbidden = false;

  var length = arguments.length;
  if(length == 1){
    var obj = arguments[0]
    if (obj instanceof KT.Types.Config || KT.isObject(obj)) {
        
      this.active = obj.active || false;
      this.available = obj.available || false;
      this.injected = obj.injected || false;
      this.licensed = obj.licensed || true;
      this.forbidden = obj.forbidden || false;
    }
    else if(obj instanceof Boolean){
      this.active = obj;
      this.available = obj;
      this.injected = obj;
      this.licensed = obj;
      this.forbidden = obj;
    }
  }
  else if(length == 5){
    this.active = arguments[0];
    this.available = arguments[1];
    this.injected = arguments[2];
    this.licensed = arguments[3];
    this.forbidden = arguments[4];
  }
  else{
    this.active = false;
    this.available = false;
    this.injected = false;
    this.licensed = true;
    this.forbidden = false;
  }
}

/************************************************/


KT.env = new function KT_Env(_type){
  var type = _type;
  var content = KT.readFile("~/Desktop/KT_Tools/src/config/env.json");
  var env = JSON.parse(content);
  var path = new function (path){
  var root = path || (new File($.fileName)).parent.parent.parent;
  var rootPath = root.fsName.replace(/\\/g, '/');

  this.get = function(path)    {
    var p;
    var dev = (KT.env.get('devmode')) ? '/src' : ''; 
    if(path == 'root')
    {
        return rootPath;
    }
    if(!path) {
      p = rootPath + dev 
    }
    else if(path[0] == '/'){
      p = rootPath + dev + path
    }
    else {
      p = rootPath + dev + '/' + path;
    }
    return p
  }
}

  this.get = function(what){
    var levels = what.split(".");
    var obj = env;
    for(var i = 0, n = levels.length; i < n ; i++){
      var level = levels[i];
      obj = obj[level];
      if(KT.isUndefined(obj)){
          return
      }
    }
    return obj
  }

  this.save = function(){
    var path = this.getPath('config/env.json')
    var content = JSON.stringify(env, null, 4);
    KT.writeFile(content, path);
  }

  this.getPath = function(p){
    return path.get(p);
  }

  this.init = function(){ 
    var e = env;
    env.os = $.os.split(" ")[0].toLowerCase();
    env.os = (env.os == "windows") ? "win" : "mac";
    for(var e in env._extensions[env.os]){
        env.extensions[e] = new RegExp("\\" + env._extensions[env.os][e].join("|\\"))
    } 
    env.ignore = new RegExp( env._ignore.join("|")); 
    env.stackIgnore = new RegExp( env._stackIgnore.join("|"));
    env.moduleTypes = new RegExp( env._moduleTypes.join("|")); 
  }

  this.init()
}

/*************FACTORY************************/

function require(id, type)
{
    var category = KT.getCategory(type);
    var module = KT.modules.get(id, category);
    if(KT.env.get('splitmode'))
    {
        if(KT.isUndefined(module))
        {
            KT.modules.inject(id, category);
            return KT.modules.get(id, category)
        }
        else
        {
            return module
        }   
    }
    else 
    {
        return module
    }   
}

KT.Invoke = function(){
    var id = arguments[0];
    var item = require(id, 'Witch');
    item = item.clone(arguments[2]);
    if(KT.isUndefined(item.awake))
    {
        return item
    }
    item.awake(arguments[1]);
    item.setChildren();
    return item;
}

KT.Cast = function()
{
    var id = arguments[0];
    var spell = require(id, 'Spell');
    if(spell.multispell() == true)
    {
        return spell
    }
    var args = KT.argsToArray(arguments);
    args.shift()
    return spell.cast.apply(spell, args)
}

KT.Coven = function()
{
    var args = KT.argsToArray(arguments);
    KT.modules.addInstance(args, 'Coven')
}

KT.Witch = function()
{
    var args = KT.argsToArray(arguments);
    KT.modules.addInstance(args, 'Witch')
}

KT.Spell = function()
{
    if (arguments.length == 1)
    {
        return KT.require(arguments[0], 'Spell')
    }
    var args = KT.argsToArray(arguments);
    KT.modules.addInstance(args, 'Spell')
}

KT.Grimoire = function()
{
    var args = KT.argsToArray(arguments);
    KT.modules.addInstance(args, 'Grimoire')
}

KT.Types.Coven = function(args)
{
    args.unshift('Coven');
    KT.Types.Module.apply(this, args);
}

KT.Types.Witch = function(args)
{
    var container = 0;
    args.unshift('Witch');
    KT.Types.Module.apply(this, args);

    this.select = function(method)
    {
        if(KT.isFunction(this[method]))
        {
            return this[method]
        }
    }

    this.setContainer = function(cont)
    {
        container = cont
    }

    this.layout = function()
    {
        if(!KT.isUndefined(this.awake))
        {
            this.awake(container, this)
        }
        return this
    }

     this.clone = function(props)
    {
        var mod =  new KT.Types[this.getType()]([this.getId()]);
        
        for (var p in this)
        {
            var prop = this[p];
            if(p == 'parent')
            {
                mod.parent = prop;
                continue;
            }
            if(prop instanceof KT.Types.Witch)
            {
                mod[p] = pro.clone(); 
            }
            else if(prop instanceof KT.Types.Spell)
            {
                prop.yield(mod);
            }
            else if(KT.isFunction(prop))
            {
                mod[p] = prop;
            }
            else
            {
                var newProp = JSON.stringify(prop);
                mod[p] = JSON.parse(newProp);
            }
        }
        if(!KT.isUndefined(props))
        {
            for(var p in props)
            {
                var prop = props[p];
                var newProp = JSON.stringify(prop);
                mod[p] = JSON.parse(newProp);
            }
        }
        var s = this;
        return mod;
    }
}

KT.Types.Spell = function(args)
{
    var i = 2;
    var id = args[0];
    args.unshift('Spell');
    KT.Types.Module.apply(this, args);
    var multispell =(args[2].name == 'anonymous') ? false: true;
    this.cast = (!multispell) ? args[2] : null;
    var i = (!multispell) ? 3 : 2;
    for(i; i < args.length; i++)
    {
        var name = args[i].name;
        if(name != 'anonymous')
        {
            this[args[i].name] = args[i]
        }
        else
        {
            args[i]();
        }
    }

    this.pipe = function()
    {
        return this[curMethod].apply(this, arguments)
    }
    
    this.multispell = function()
    {
        return multispell
    }
}

KT.Types.Grimoire = function()
{
    args.unshift('Grimoire');
    KT.Types.Module.apply(this, args);
}

KT.Types.Promise = function()
{
    KT.types.Module.call('Promise', arguments);

    var instances = [];
    var parents = [];
}

KT.Types.Module = function ()
{
    var i = 4;
    var type = arguments[0];
    var id = arguments[1];
    if(id == 'ModalDialog'){$.bp()}
    if(!KT.isUndefined(arguments[3]) && arguments[3].name == 'anonymous')
    {
        this.awake = arguments[3];
    }
    else
    {
        i = 3
    }
    
    for(i; i < arguments.length; i++)
    {
        var method = arguments[i];
        var name = method.name;
        if(name == 'anonymous')
        {
            method();
            continue
        }

        this[name] = method
    }

    this.getId = function()
    {
        return id
    }

    this.getType = function()
    {
        return type
    }

    this.merge = function(obj)
    {
        if(KT.isUndefined(obj))
        {
            return
        }
        for(var i in obj)
        {
            if(KT.isObject(obj[i]))
            {
                this[i] = JSON.parse(JSON.stringify(obj[i]))
            }
            else
            {
                this[i] = obj[i];
            }
        }
    }

    this.setChildren = function()
    {
        for(var i in this)
        {
            var child = this[i];
            if(child instanceof KT.Types.Witch || child instanceof KT.Types.Spell || child instanceof KT.Types.Grimoire)
            {
                child.parent = this;
            }
        }
    }

    this.merge(arguments[2]);
    
}


/*****MODULES******/
KT.getCategory = function(type)
{
    return type.toLowerCase() + 's'
}

KT.Types.Injector = function(type)
{
    var type = type;
    var category = KT.getCategory(type);
    var items = {};
    var promises = {};
    var manifest = {};

    this.add = function(item)
    {
        if(!KT.isUndefined(items[item.id]))
        {
            return items[item.id]
        }

        items[item.id] = {
            path: item.path,
            props: item.props,
            instance: item.instance
        }
    }

    this.addInstance = function(args, type)
    {
        if(KT.isUndefined(items[args[0]].instance))
        {
            var instance =  new KT.Types[type](args);
            var item = items[instance.getId()]; 
            item.instance = instance;
            if(KT.env.get('testing'))
            {
                manifest[instance.getId()] = item.path;
            }
            else
            {
                item.props.active = true
            }
            return instance;
        }
    }

    this.reset = function()
    {
        for(var i in manifest)
        {
            if(!KT.isUndefined(items[i]) && !items[i].props.active)
            {
                delete items[i];
            }
        }
    }

    this.addPromise = function(id, parent)
    {
        if(KT.isUndefined(promises[id]))
        {
            promises[id] = [parent];
        }
        else
        {
            promises[id].push(parent)
        }
        return new KT.Types.Promise(id)
    }



    this.filter = function(filter){}

    this.get = function(id)
    {
        return items[id].instance
    }

    this.getInstance = function(id)
    {
        return items[id].instance
    }

    this.getItems = function()
    {
        var collection = {}
        for(var i in items)
        {
            collection[i] = JSON.parse(JSON.stringify(items[i].props));
        }
        return collection
    }

    this.inject = function(id)
    {
        if(!KT.isUndefined(items[id]))
        {
            if(items[id].props.licensed == true && (!items[id].props.licensed || KT.env.get("current") == 'sys'))
            {
                try
                {
                    $.evalFile(items[id].path);
                    items[id].props.injected = true;
                    items[id].props.available = true;
                }
                catch(err)
                {
                    var e = err;
                    var path = e.fileName.split('/');
                    path.splice(0, 3);
                    path = path.join('/')
                    items[id].props.injected = false;
                    items[id].props.available = false;
                    alert('¡ERROR!:\n' 
                            + 'Desc =>' + e.message + '\n'
                            + 'Line => ' + e.line + '\n'
                            + 'File => ' + path + '\n\n' 
                            + '(Maybe you should stop drinking beer at work?)')

                }
            }
        }
    }

    this.length = function()
    {
        var count = 0;
        for(var i in items)
        {
            count++;
        }
        return count
    }

}


KT.modules = new function()
{
    var modules = {
        covens: new KT.Types.Injector('Coven'),
        witchs: new KT.Types.Injector('Witch'),
        spells: new KT.Types.Injector('Spell'),
        grimoires: new KT.Types.Injector('Grimoire')
    }

    var manifest = {};

    this.reset = function()
    {
        for (var m in modules)
        {
            
        }
    }
    this.init = function()
    {
        this.scan();
        this.readConfig();
    }

    this.category = function(cat)
    {
        return modules[cat];
    }

    this.add = function(item)
    {
        return modules[KT.getCategory(type)].add(item)
    }

    this.addInstance = function(args, type)
    {
        return modules[KT.getCategory(type)].addInstance(args, type)
    }

    this.addPromise = function(id, type)
    {
        return modules[KT.getCategory(type)].addPromise(id, currentModule);
    }

    this.get = function(id, type)
    {
        var t = (type == type.toLowerCase()) ? type : KT.getCategory(type); 
        return modules[t].get(id)
    }

    this.getItems = function(category)
    {
        return modules[category].getItems()
    }

    this.inject = function(id, type)
    {
        var t = (type == type.toLowerCase()) ? type : KT.getCategory(type);
        modules[t].inject(id)
        return modules[t].getInstance(id)
    }


    this.scan = function(path, ignore)
    {
        var _path = path || KT.env.getPath();
        var injector = this;
        var folder = new Folder(_path);
        folder.getFiles(function(item)
        {
            var _ignore = ignore || item.name.match(KT.env.get('ignore'))
            if(item instanceof Folder && KT.isUndefined(_ignore))
            {
                this.scan(item.fsName, _ignore);
            }
            else if(item instanceof File)
            {
                var match = KT.env.get('moduleTypes');
                
                match = item.name.match(match);
                if(!KT.isUndefined(match))
                {
                    var type = match[0];
                    var category = KT.getCategory(type)
                    modules[category].add({
                        id: File.decode(KT.stripFileExtension(KT.stripFileExtension(item.name))),
                        path: item.fsName,
                        instance:null,
                        props: new KT.Types.Config({available:true})
                    })
                }
            }
        })
    }

    this.readConfig = function(p)
    {   
        var category, config, module;
        if(!KT.env.get('devmode'))
        {
            return;
        }
        else
        {
            var path = path || KT.env.getPath("config") + "/config.json";
            var config = JSON.parse(KT.readFile(path));
            
            for (var category in config)
            {
                for(var m in config[category])
                {
                    module = this.get(m, category);
                    if(!KT.isUndefined(module))
                    {
                        module.props = new KT.Types.Config(config[category][m]);
                    }
                }
            }
        }
    }

    this.init();
    var m = modules;
}



function KT_Launcher()
{
    var mainWindow, runWindow, curWindow, counter = 0;
    
    this.launch = function(covens, context)
    {
        var win;
        var _covens =KT.toArray(covens);
        var length = _covens.length;
        var title = KT.env.get('scriptName');
        if(mainWindow instanceof Window)
        {
            if(runWindow instanceof Window)
            {
                runWindow.close();
            }

            win = runWindow = (context instanceof Panel)? context : new Window('palette',title,undefined, {resizeable:true});
        }
        else{
            win = mainWindow = (context instanceof Panel)? context :new Window('palette',title,undefined, {resizeable:true});
        }
        var tabPanel = win.add('tabbedpanel');

        for(var c = 0; c < length; c++)
        {
            var coven = _covens[c];
            coven = KT.modules.inject(coven, 'Coven');
            if(!KT.isUndefined(coven))
            {
                var tab = tabPanel.add('tab');
                tab.text = coven.getId();
                coven.awake(tab);
                coven.setChildren();
                tab.alignment = 'fill'
                tab.alignChildren = 'fill'
            }
        }
        win.alignChildren = 'fill'
        win.layout.layout(true);
        win.show();
    }
}
/*****LAUNCHER*****************/


})()