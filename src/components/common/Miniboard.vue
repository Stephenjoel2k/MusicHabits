<template>
    <v-card flat class="my-3 miniboard" color="#161b22" justify-space-around :to="route" link :disabled="disable ? true : false">
        <v-img :src="require('@/assets/' + background + '.png')" class="white--text align-end" height="120px">
        <v-card-text>
         
          <v-row align="center" justify="center">
            <v-col cols="12" class="mb-3">
              <h1 class="text-center  text-lg-h3 text-sm-h5">
                {{title}}
              </h1>
            </v-col>
          </v-row>
        </v-card-text>
      </v-img>
    </v-card>
</template>


<script>
export default {
    name: 'Miniboard',
    props: {
        title: String,
        background: String,
        route: String,
        disable: Boolean,
    }
}
</script>

<style scoped>
  .miniboard{
    -webkit-animation: fadein 2s alternate;
    animation: fadein 2s alternate;
  }

    @keyframes fadein {
        0% {opacity: 0; }
        100% {opacity: 1;}
    }
    @-webkit-keyframes fadein {
        0% {opacity: 0; }
        100% {opacity: 1; }
    }

</style>