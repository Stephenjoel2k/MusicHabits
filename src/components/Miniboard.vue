<template>
    <v-card flat class="py-2" justify-space-around color="#EAEBEB" :to="route" link :disabled="disable ? true : false">
        <v-img :src="require('@/assets/' + background + '.jpg')" class="white--text align-end" height="120px">
        <v-card-text>
         
          <v-row align="center" justify="center">
            <v-col cols="12" class="mb-3">
              <h1 class="text-center display-1 text-lg-h3 text-sm-h4">
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