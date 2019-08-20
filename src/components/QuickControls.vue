<template>
  <v-layout row left class="ma-0 pa-0 fill-horizontal">
    <!-- Quick buttons -->
    <div class="title font-weight-thin top pa-0 pt-2 grey--text ml-3 mr-1" left>
      Quick controls:
    </div>
    <v-divider vertical inset red :class="`ma-0 mr-2 my-0 small-separator`" ></v-divider>
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
    <v-divider vertical inset red :class="`mx-2 mr-3 my-0 separator ${colors.separator}`"></v-divider>
  </v-layout>

</template>

<script>
  export default {
    name:'quick-controls'
  }
</script>

<style lang="scss" scoped>

</style>