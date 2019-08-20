<template>
  <div>
    <div></div>
  </div>
</template>

<script>
  export default {
    name:'mod-button',
    props: {
      color: {
        type: String,
        required: false,
        default: 'white'
      },
      hoverColor:{
        type: String,
        required: false,
        default: 'white'
      },
      src: {
        type: Object,
        required: true
      },
      action: {
        rquired: true
      },
      value: {
        required: false,
        default: 0
      }
    },
    computed: {
      switchColor() {
        return this.data 
      },
    },
    data() {
      return {
        key: value
      }
    },
  }
</script>

<style lang="scss" scoped>

</style>