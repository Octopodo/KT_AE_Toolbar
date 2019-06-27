<template>
  <v-app class="grey darken-4">
    <div class="toolbar">
      <toolbar></toolbar>
      <BlockUI v-if="uiblocked">
        <v-btn @click="unblockui">unblock</v-btn>
      </BlockUI>
    </div>
    <v-divider :class="`ma-0 pa-0 grey darken-2 ${colors.separator}`" ></v-divider>
    <div class="help grey--text text--darken-2">{{help()}}</div>
    <!-- <v-divider vertical inset red :class="`mx-2 mr-3 my-0 separator ${colors.separator}`" small></v-divider> -->
  </v-app>
</template>

<script>
import Toolbar from './components/Toolbar'
// import { mapActions } from 'vuex'

export default {
  name: 'App',
  components: {
    Toolbar
  },
  data() {
    return {
      help(){
        return this.$store.state.tooltip
      },
      colors: {
        separator: 'grey darken-3'
      },
    }
  },
  computed:{
    uiblocked(){
      return this.$store.state.uiblocked
    },
    currentMessage(){
      return this.$store.state.tooltip
    
    }
  },
  methods:{
    unblockui(){
      this.$store.dispatch('unblockui')
    }
  }
}
</script>


<style lang="sass" scoped>
.toolbar
  width: 100%

.help
  font-family: 'Tahoma'!important
  font-weight: 100!important
  font-size: 8pt!important
</style>
