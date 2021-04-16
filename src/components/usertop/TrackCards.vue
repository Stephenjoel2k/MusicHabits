<template>

    <v-row dense>
        <v-col v-for="(item, i) in items" :key="i" cols="12">
          <v-card dark :href=item.external_urls.spotify target="_blank">
            <div class="d-flex flex-no-wrap justify-space-between">
              <div>
                <v-card-title class="info_text" v-if="type == 'artist'">{{i+1}} - {{item.name}}</v-card-title>
                <v-card-title v-if="type == 'track'">{{i+1}} - {{item.name}}</v-card-title>
                <v-card-subtitle v-if="type == 'artist'">{{item.genres}}</v-card-subtitle>
                <v-card-subtitle v-if="type == 'track'">{{item.artists[0].name}}</v-card-subtitle>
                <v-card-subtitle> popularity: {{item.popularity}}%</v-card-subtitle>
              </div>
              <v-avatar class="ma-3" size="100" tile>
                <v-img v-if="type == 'artist'" :src="item.images[1].url"></v-img>
                <v-img  v-if="type == 'track'" :src="item.album.images[1].url"></v-img>
              </v-avatar>
            </div>
          </v-card>
        </v-col>
      </v-row>

</template>

<script>
export default {
    name: "TrackCards",
    props: {
        items: Array,
        type: String
    }
}
</script>


<style scoped>
  .v-card__text, .v-card__title {
    word-break: normal; /* maybe !important  */
  }
  
</style>