<template>
    <v-card flat class="my-5">
        <v-img :src="formatBg(header_background)" class="white--text align-end" height="300px">
        <v-card-text>
         
          <v-row align="center" justify="center">
            <v-col cols="12" class="mb-5">
              <h1 :v-if="header_title" class="text-center display-2 text-lg-h1 text-md-h2">
                {{header_title}}
              </h1>
            </v-col>
          </v-row>
        </v-card-text>
      </v-img>
    </v-card>
</template>


<script>
export default {
    name: 'Header',
    props: {
        header_background: String,
        header_title: String
    },
    methods: {
      formatBg(header_background){
        if(header_background.length < 12){
          return require('@/assets/' + header_background + '.jpg');
        }else{
          return header_background
        }
      }
    }
}
</script>

