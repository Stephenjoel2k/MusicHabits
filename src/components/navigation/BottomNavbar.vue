<template>
  <v-card
  >
    <v-bottom-navigation dark app color="primary" class="d-md-none black" fixed>
      
      <v-btn to=/profile text>
        <span>Insights</span>
        <v-icon>mdi-chart-histogram</v-icon>
      </v-btn>

      <v-btn to=/dashboard text>
        <span>Home</span>
        <v-icon>mdi-home</v-icon>
      </v-btn>

      <v-btn to=/discover-artists text>
        <span>Discover</span>
        <v-icon>mdi-account-search</v-icon>
      </v-btn>

      <v-btn to=/generate-playlists text>
        <span>Generate</span>
        <v-icon>mdi-playlist-plus</v-icon>
      </v-btn>

       

    </v-bottom-navigation>
  </v-card>
</template>

<script>
export default {
   data() {
    return {
    }
  }
}
</script>