<template>
  <div v-html="html" class="left"></div>
</template>
<script>
import showdown from 'showdown'
import readme from '../../隐私政策.md'
export default {
  data () {
    return {
      md: readme,
      html: ''
    }
  },
  components: {
    showdown
  },
  mounted () {
    let converter = new showdown.Converter()
    let text = this.md.toString()
    this.html = converter.makeHtml(text)
  }
}
</script>
<style>
ul li {
  line-height: 25px;
  text-align: left;
}
p,h1,h2,h3,h4,h5{
  text-align: left;
  line-height: 25px;
}
p{
  text-indent: 25px;
}
</style>
