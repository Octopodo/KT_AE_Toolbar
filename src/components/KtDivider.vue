<template>
  <div>
    <!-- Normal divider -->
    <hr
      v-if="type == 'normal'"
      class="ma-0 pa-0 mr-2 kt-divider" 
    />

    <!-- Small Divider -->
    <hr
      v-if="type == 'small'"
      class="pa-0 ma-0 mr-1 small-divider" 
    />
    <hr
      v-if="type == 'bold'"
      :class="`ml-1 mr-2 my-0 bold-divider grey--text text-darken-1`" 
    />

  </div>
</template>

<script>
  export default {
    name:'kt-divider',
    props:{
      type:{
        type: String,
        required: false,
        default: 'normal'
      },
      color:{
        type: String,
        required: false,
        default:'grey darken-3'
      }
    }
  }
</script>

<style lang="sass" scoped>
.kt-divider
  border-style: none
  background-color: #424242
  width: 1px
  height: 100%!important

  
.bold-divider
  border-style: none
  background-color: #424242
  width: 2px
  height: 100%!important

.small-divider
  border-style: none
  background-color: #333333
  width: 1px
  height: 18px!important
  margin-top: 5px!important
</style>