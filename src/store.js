import Vue from 'vue'
import Vuex from 'vuex'
import commands from './commands.js'
// import { start } from 'repl';

Vue.use(Vuex);

function Options(state) {
  let opts =  {
    comp: {
      selected: state.options[0].value,
      settings: {}
    },
    layer: {
      selected: state.options[1].value
    },
    properties: {
      markers: state.switchKeys[1].value
    },
    interval: {
      workarea: state.options[2].value
    },
    time: {}
  }

  return opts
}

function callCommand(command){
  const msg = new VulcanMessage(VulcanMessage.TYPE_PREFIX + 'com.kt.tools.server.callComand');
  msg.setPayload(command);
  VulcanInterface.dispatchMessage(msg)
}
const toolbarPrefix = 'com.kt.tools.server.'
export default new Vuex.Store({
  state: {
    tooltipDelay: 800,
    uiblocked: false,
    numFrames: 10,
    bakeFrameRate: 1,
    tooltip: '',
    quickButtons: [
      {name:'fitCompToContent', icon:'flip_to_back', method:'fitCompToContent', tooltip:"Resize comp to fit the content.(Don't work with shape layers by the moment)"},
      {name:'fitContentToComp', icon:'flip_to_front', method:'fitContentToComp', tooltip:"Resize the content to fit the comp size.(Don't work with shape layers by the moment)"},
      {name:'compToContentDuration', icon:'settings_ethernet', method:'fitCompsToContentDuration', tooltip:"Fits the duration of the comp to the longest layer."},
      {name:'addNull', icon:'center_focus_strong', method: 'addNull',  tooltip:'Add null.'},
      {name:'addSolid', icon:'crop_landscape', method:'addSolid', tooltip:'Add a new solid.',},
      {name:'fastComp', icon:'movie', method:'createComp', tooltip:'Add comp with preset settings.'},
    ],

    expressionButtons: {
      bake: {
        name:'bakeExpressions', 
        icon:'whatshot', 
        method:'', 
        tooltip:'Bake expressions.'
      },
      switch: {
        name:'switchExpressions', 
        icons:{on:'toggle_on', 
        off:'toggle_off'}, 
        method:'switchExpressions', 
        tooltip:'Enable or disable expressions.',
        value: false
      }
    },

    smart:{
      name:'projectSelection', 
      icon:'grade', 
      tooltip:'Perform smart operation.',
      method: 'smartPerform',
      value: false,
      small: true
    },
    options:[
      {
        name:'projectSelection', 
        icon:'folder', 
        tooltip:'Perform on project selection.',
        method: 'selectOption',
        value: false,
        small: true
      },
      {
        name:'selectedLayers',
        icon:'view_stream',
        tooltip:'Perform on selected layers.',
        method:'selectOption',
        value: false,
        small: true
      },
      {
        name:'workArea',
        icon:'space_bar',
        tooltip:'Perform on workarea.',
        method:'selectOption',
        value: false,
        small: false
      },
    ],

    renderButtons:[
      {
        name:'toQueue',
        icon:'add_to_queue',
        tooltip:'To render queue.',
        method:'',
        value: false
      },
      {
        name:'toMeQueue',
        icon:'queue_play_next',
        tooltip:'To Media Encoder queue.',
        method:'',
        value: false
      },
    ],

    switchKeys: [
      {
        name: 'useKeys',
        icon: 'label_important',
        tooltip: 'Work on frames.',
        method: 'switchKeys',
        value: true
      },
      {
        name: 'useMarkers',
        icon: 'local_offer',
        tooltip: 'Work on markers.',
        method: 'switchKeys',
        value: false
      }
    ],

    keyButtons: [
      {
        name: 'fastBackward',
        icon: 'first_page',
        tooltip: 'Move keys n frames back.',
        method: 'keysFastBackwards',
      },
      {
        name: 'backwards',
        icon: 'chevron_left',
        tooltip: 'Move keys 1 frame back.',
        method: 'keysBackwards',
      },
      {
        name: 'forward',
        icon: 'chevron_right',
        tooltip: 'Move keys 1 frame forward.',
        method: 'keysForward',
      },
      {
        name: 'fastForward',
        icon: 'last_page',
        tooltip: 'Move keys n frames forward.',
        method: 'keysFastForward',
      },
    ],

    settings: {
      name: 'settings',
      icon: 'settings',
      tooltip: 'Advanced Settings',
      method: 'advancedSettings'
    },

    renderPresset:{
      name: 'renderPresset',
      items: [
        'Presset 1',
        'Presset 2',
        'Presset 3',
        'Presset 4'
      ],
      // current: 'Presset 1'  
    }
  },
  mutations: {
    advancedSettings: (state, payload) => {
      callCommand (`KT.invoke('ToolbarSettings')`);
    },
    setHelptip: (state, payload) => {
      state.tooltip = payload
    },
    blockui: state =>{
      state.uiblocked = true
    },
    unblockui: state => {
      state.uiblocked = false
    },
    switchExpressions: state => {
      state.expressionButtons.switch.value = !state.expressionButtons.switch.value
    },
    switchKeys: state => {
      state.switchKeys[0].value = !state.switchKeys[0].value;
      state.switchKeys[1].value = !state.switchKeys[1].value
    },

    changeFrames: (state, payload) => {
      state.numFrames = payload
    },
    changeBakeFrameRate: (state, payload) => {
      state.bakeFrameRate = payload
    },
    switchKeyArea: (state) => {
      state.keyArea.value = !state.keyArea.value
    },
    switchKeySelectedLayers: (state) => {
      state.keyLayers.value = !state.keyLayers.value
    },
    createComp:(state)=>{
      let opts = Options(state);
      opts.comp.settings=  {
          name: 'Custom Comp',
          open: true
      }

      callCommand (`KT.cast('CompManager', 'createComp', ${JSON.stringify(opts)})`);
    },
    smartPerform:(state)=> {
      state.smart.value = !state.smart.value;
      for(var i in state.options){
        state.options[i].value = (state.smart.value == true)? false: state.options[i].value
      }
    },

    selectOption: (state, payload) => {
      state.options[payload].value = !state.options[payload].value
      state.smart.value = (state.options[payload].value == true)? false: state.smart.value;
    },

    fitCompToContent:(state)=>{
      commands.call(commands.fitCompToContent(state.options))
    },
    fitContentToComp:()=>{
      const msg = new VulcanMessage(VulcanMessage.TYPE_PREFIX+ 'com.kt.tools.server.callCommand')
      VulcanInterface.dispatchMessage(msg)
    },
    fitCompsToContentDuration:(state)=>{
      let opts = Options(state)
      callCommand(`KT.cast('CompManager', 'fitCompsToContentDuration', ${JSON.stringify(opts)}) `)
    }
  },
  actions: {
    advancedSettings: context => {
      context.commit('advancedSettings')
    },
    blockui: context =>{
      context.commit('blockui')
    },
    smartPerform: context =>{
      context.commit('smartPerform')
    },
    unblockui: context => {
      context.commit('unblockui')
    },
    changeFrames: (context, payload) =>{
      context.commit('changeFrames', payload)
    },
    changeBakeFrameRate: (context, payload) =>{
      context.commit('changeBakeFrameRate', payload)
    },
    switchExpressions: context => {
      context.commit('switchExpressions')
    },
    switchKeys: context =>{
      context.commit('switchKeys')
    },
    selectOption: (context, payload) => {
      context.commit('selectOption', payload)
    },
    switchKeyArea: (context) =>{
      context.commit('switchKeyArea')
    },
    switchKeySelectedLayers: (context) =>{
      context.commit('switchKeySelectedLayers')
    },
    createComp: (context) => {
      context.commit('createComp')
    },
    fitCompToContent: (context) => {
      context.commit('fitCompToContent')
    },
    fitContentToComp: (context) => {
      context.commit('fitContentToComp')
    },

    fitCompsToContentDuration:(context) => {
      context.commit('fitCompsToContentDuration')
    },

    addNull: (context) => {
      callCommand(`KT.cast('CompManager', 'addNull')`)
    },
    addSolid: (context) => {
      callCommand(`KT.cast('CompManager', 'addSolid')`)
    },

    keysBackwards: (context) => {
      let options = Options(context.state);
      options.time.offset = -1;
      options.time.units = 'f';
      options.properties.keyed = true;
      options.interval.overclock = true;
      options.interval.underclock = true;
      console.log(options)
      callCommand(`KT.cast('ToolbarCommands').offsetKeys(${JSON.stringify(options)})`)
    },
    keysForward: (context) => {
      let options = Options(context.state);
      options.time.offset = 1;
      options.time.units = 'f';
      options.properties.keyed = true;
      options.interval.overclock = true;
      options.interval.underclock = true;
      console.log(options)
      callCommand(`KT.cast('ToolbarCommands').offsetKeys(${JSON.stringify(options)})`)
    },
    keysFastBackwards: (context) => {
      let options = Options(context.state);
      options.time.offset = -context.state.numFrames;
      options.time.units = 'f';
      options.properties.keyed = true;
      options.interval.overclock = true;
      options.interval.underclock = true;
      console.log(options)
      callCommand(`KT.cast('ToolbarCommands').offsetKeys(${JSON.stringify(options)})`)
    },
    keysFastForward: (context) => {
      let options = Options(context.state);
      options.time.offset = context.state.numFrames;
      options.time.units = 'f';
      options.properties.keyed = true;
      options.interval.overclock = true;
      options.interval.underclock = true;
      console.log(options)
      callCommand(`KT.cast('ToolbarCommands').offsetKeys(${JSON.stringify(options)})`)
    }
  }
})
