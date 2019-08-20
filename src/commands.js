export default {
  call(command){
    const msg = new VulcanMessage(VulcanMessage.TYPE_PREFIX + 'com.kt.tools.server.callComand');
    msg.setPayload(command);
    VulcanInterface.dispatchMessage(msg)
  },
  getOptions(options){
    console.log(options)
    var opts= {};
    for(var i in options){
      opts[options[i].name]= options[i].value;
      
    }
    return JSON.stringify(opts)
  },

  fitCompToContent (options){
    return `var comps = KT.cast('CompSelector').selectComps(${this.getOptions(options)});
    var res = (comps != null) ? KT.cast('CompManager').fitCompsToContent(comps, null, null, {keys: true}): 'no comps selected'`
  }
}