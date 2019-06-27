import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tooltipDelay: 800,
    uiblocked: false,
    numFrames: 10,
    bakeFrameRate: 1,
    tooltip: '',
    quickButtons: [
      {name:'addNull', icon:'center_focus_strong', method: 'blockui',  tooltip:'Add null.'},
      {name:'addSolid', icon:'crop_landscape', method:'', tooltip:'Add a new solid.',},
      {name:'fastComp', icon:'movie', method:'', tooltip:'Add comp with preset settings.'},
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

    expressionOptions:[
      {
        name:'projectSelection', 
        icon:'folder', 
        tooltip:'Perform on project selection.',
        method: 'activateExpressionOption',
        value: false,
        small: true
      },
      {
        name:'selectedLayers',
        icon:'view_stream',
        tooltip:'Perform on selected layers.',
        method:'activateExpressionOption',
        value: false,
        small: true
      },
      {
        name:'workArea',
        icon:'space_bar',
        tooltip:'Perform on workarea.',
        method:'activateExpressionOption',
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
    keyArea: {
      name: 'useArea',
      icon: 'space_bar',
      tooltip: 'Only frames in work area.',
      method: 'switchKeyArea',
      value: false
    },

    keyButtons: [
      {
        name: 'fastBackward',
        icon: 'first_page',
        tooltip: 'Move keys n frames back.',
        method: '',
      },
      {
        name: 'backwards',
        icon: 'chevron_left',
        tooltip: 'Move keys 1 frame back.',
        method: '',
      },
      {
        name: 'forward',
        icon: 'chevron_right',
        tooltip: 'Move keys 1 frame forward.',
        method: '',
      },
      {
        name: 'fastForward',
        icon: 'last_page',
        tooltip: 'Move keys n frames forward.',
        method: '',
      },
    ],

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
    activateExpressionOption: (state, payload) => {
      state.expressionOptions[payload].value = !state.expressionOptions[payload].value
    },
    changeFrames: (state, payload) => {
      state.numFrames = payload
    },
    changeBakeFrameRate: (state, payload) => {
      state.bakeFrameRate = payload
    },
    switchKeyArea: (state) => {
      state.keyArea.value = !state.keyArea.value
    }
  },
  actions: {
    blockui: context =>{
      context.commit('blockui')
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
    activateExpressionOption: (context, payload) => {
      context.commit('activateExpressionOption', payload)
    },
    switchKeyArea: (context) =>{
      context.commit('switchKeyArea')
    }
    
  }
})
