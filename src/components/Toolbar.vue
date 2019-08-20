<template>
  <div ma-0 pa-0 app>
    <v-layout row left class="ma-0 pa-0 fill-horizontal">
      <!-- Quick buttons -->
      <div class="title font-weight-thin top pa-0 pt-2 grey--text ml-3 mr-1" left>
        Quick controls:
      </div>
      <kt-divider type="small"/>
  
      <div v-for="button in quickButtons" :key="button.name" class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0 white--text" 
          small 
          icon 
          @click="dispatch(button.method)" 
          @mouseover.prevent="help(button.tooltip)"
          @mouseleave.prevent="help('')"
        >
          <v-icon small :color="colors.quickColor">{{button.icon}}</v-icon>
        </v-btn>
      </div>
      <kt-divider type="normal"/>


      <!-- Expressions -->
      <div class="title font-weight-thin top pa-0 grey--text mr-1" left>
        Expressions:
      </div>

      <kt-divider type="small"/>
      <!-- Expression switch -->
      <div class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0 mr-1" 
          small
          icon 
          @click="dispatch(expressionButtons.switch.method)"
          @mouseover.prevent="help(expressionButtons.switch.tooltip)"
          @mouseleave.prevent="help('')"
        >
          <v-icon 
            v-if="switchExpressions" 
            color="grey darken-2"
          >
            {{expressionButtons.switch.icons.off}}
          </v-icon>
          <v-icon 
            v-else 
            success color="light-green accent-2"
          >
            {{expressionButtons.switch.icons.on}}
          </v-icon>
        </v-btn>
      </div>



      <kt-divider type="small" class="mr-1"/>

      <!--  Bake Frame Rate -->
      <v-form class="pa-0 ma-0" ref="form" @submit.prevent>
        <v-text-field 
          dark
          class="pa-0 ma-0 styled-input white--text"
          height="15"
          background-color="grey darken-3"
          color="orange lighten-1"
          placeholder="10"
          counter="4"
          hide-details
          type="number"
          v-model="bakeFrameRate"
          :rules="inputRules"
          @mouseover.prevent="help('Baking frame rate. 1 means it bakes each frame')"
          @mouseleave.prevent="help('')"
        ></v-text-field>
      </v-form>

       <!-- Bake Expressions -->
      <div class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0" 
          small 
          icon 
          @click="dispatch(expressionButtons.bake.method)"
          @mouseover.prevent="help(expressionButtons.bake.tooltip); changeColor('flame', 'orange lighten-2')"
          @mouseleave.prevent="help(''); changeColor('flame')"
        >
          <v-icon 
            small 
            :color="colors.flame"
          >
            {{expressionButtons.bake.icon}}
          </v-icon>
        </v-btn>
      </div>


      <kt-divider type="normal" />
      <!-- KEYING -->
      <div class="title font-weight-thin top pa-0 grey--text mr-1">
        Keying:
      </div>

      <kt-divider type="small" />

      <!-- Switch keys -->
      <div class="ma-0" v-for="button in switchKeys" :key="button.name">
        <v-btn 
          class="transparent ma-0 pa-0" 
          small
          icon 
          @click="button.value == false ? dispatch(button.method) : ''"
          @mouseover.prevent="help(button.tooltip)"
          @mouseleave.prevent="help('')"
        >
          <v-icon small v-if="button.value" color="deep-purple lighten-1">{{button.icon}}</v-icon>
          <v-icon small v-else color="grey darken-2">{{button.icon}}</v-icon>
        </v-btn>
      </div>

      <kt-divider type="small" />
      <!-- Key Buttons -->
      <div v-for="button in keyButtons" :key="button.name" class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0 white--text" 
          small
          icon 
          @click="dispatch(button.method)"
          @mouseover.prevent="help(button.tooltip)"
          @mouseleave.prevent="help('')"  
        >
          <v-icon small>{{button.icon}}</v-icon>
        </v-btn>
      </div>
      
      <!-- Frame Field -->
      <v-form class="pa-0 ma-0" ref="frameField" @submit.prevent>
        <v-text-field 
          dark
          class="pa-0 ma-0 styled-input white--text"
          height="15"
          background-color="grey darken-3"
          color="grey"
          placeholder="10"
          counter="4"
          hide-details
          type="number"
          :rules="inputRules"
          v-model="inputValue"
          @mouseover.prevent="help('Number of frames to offset')"
          @mouseleave.prevent="help('')"
        ></v-text-field>
      </v-form>
      <v-spacer></v-spacer>

      <!-- RENDERING -->
      <kt-divider type="bold" />
      <div class="title font-weight-thin top pa-0 grey--text mr-1">
        Options:
      </div>
      <!-- Smart Option -->
      <v-btn 
          class="transparent ma-0 pa-0" 
          small 
          icon 
          @click="dispatch(smartOption.method)"
          @mouseover="help(smartOption.tooltip)"
          @mouseleave="help('')"
        >
          <v-icon 
            v-if="smartOption.value" 
            color="purple darken-1"
            :style="smartOption.small? 'font-size: 16px;' : ''" 
             >{{smartOption.icon}}</v-icon>
          <v-icon 
            v-else  
            color="grey darken-2"
            :style="smartOption.small? 'font-size: 16px;' : ''"
          >
            {{smartOption.icon}}
          </v-icon>
        </v-btn>
      <kt-divider type="small" />
      <!-- Options -->
      <div v-for="(button, index) in options" :key="index" class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0" 
          small 
          icon 
          @click="dispatch(button.method, index)"
          @mouseover="help(button.tooltip)"
          @mouseleave="help('')"
        >
          <v-icon 
            v-if="button.value" 
            color="deep-purple lighten-2"
            :style="button.small? 'font-size: 16px;' : ''" 
             >{{button.icon}}</v-icon>
          <v-icon 
            v-else  
            color="grey darken-2"
            :style="button.small? 'font-size: 16px;' : ''"
          >
            {{button.icon}}
          </v-icon>
        </v-btn>
      </div>

      <kt-divider />
      <v-btn 
          class="transparent ma-0 pa-0 white--text" 
          small 
          icon 
          @click="dispatch(settingsButton.method)" 
          @mouseover.prevent="help(settingsButton.tooltip)"
          @mouseleave.prevent="help('')"
        >
          <v-icon small :color="colors.quickColor">{{settingsButton.icon}}</v-icon>
        </v-btn>
      <!-- Render Buttons -->
      <!-- <div v-for="button in renderButtons" :key="button.name" class="ma-0">
        <v-btn 
          class="transparent ma-0 pa-0 white--text" 
          small 
          icon 
          @click="dispatch(button.method)"
          @mouseover.prevent="help(button.tooltip)"
          @mouseleave.prevent="help('')"
        >
          <v-icon small>{{button.icon}}</v-icon>
        </v-btn>
      </div> -->

    </v-layout>
  </div>
</template>

<script>

export default {
  computed:{
    switchExpressions(){
      return this.$store.state.expressionButtons.switch.value
    },
    switchKeysValue(index){
      return this.$store.state.switchKeys[index].value
    },
    inputValue: {
      get() {
        return this.$store.state.numFrames
      },
      set(value) {
        this.$store.dispatch('changeFrames', value);
      }
    },
    bakeFrameRate: {
      get() {
        return this.$store.state.bakeFrameRate
      },
      set(value) {
        this.$store.dispatch('changeBakeFrameRate', value);
      }
    },
  },
  methods:{
    dispatch(action, payload){
      if(payload === '') {
        return
      }
      return this.$store.dispatch(action, payload)
    },
    help(value){
      this.$store.commit('setHelptip', value);
    },
    changeColor(wich, color){
      this.colors[wich] = color? color : 'white'
    },
  },
  data() {
    return {
      colors: {
        separator: 'grey darken-3',
        flame: 'white',
        quickColor: 'white'
      },
      tooltipDelay: this.$store.state.tooltipDelay,
      quickButtons: this.$store.state.quickButtons,
      expressionButtons: this.$store.state.expressionButtons,
      options: this.$store.state.options,
      renderButtons: this.$store.state.renderButtons,
      keyButtons: this.$store.state.keyButtons,
      switchKeys: this.$store.state.switchKeys,
      smartOption: this.$store.state.smart,
      settingsButton: this.$store.state.settings,
      inputRules: [
        v => !isNaN(Number(v)) || 'Must be a number'
      ],
      numFrames: this.$store.state.numFrames
    }
  },
  name:'navbar'
}
</script>

<style lang="sass" scoped>
.fill-horizontal
  width: 100%


.transparent
  background-color: transparent!important
  border-color: transparent!important

.tooltip
  top: 0px!important
  // left: 35px!important
  // color: blue

.title
  font-family: 'Tahoma'!important
  font-weight: 100!important
  font-size: 8pt!important
  white-space: nowrap!important
  padding-top: 10px!important
  // width: 50%!important

.styled-input
  width: 40px
  padding-top: 6px!important
  font-size: 10pt
  font-color: white!important
</style>