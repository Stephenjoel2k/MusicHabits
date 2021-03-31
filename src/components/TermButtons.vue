<template>

      <v-row align="center" justify="center">
        <v-btn-toggle mandatory class="mb-4">
          <v-tabs>
            <v-tab @click="$emit('display-top', 'long_term')" class="caption black white--text">All Time</v-tab>
            <v-tab @click="$emit('display-top', 'medium_term')" class="caption black white--text">~ 6 Months</v-tab>
            <v-tab @click="$emit('display-top', 'short_term')" class="caption black white--text">~ 1 Month</v-tab>
          </v-tabs>
        </v-btn-toggle>
      </v-row>

</template>

<script>
export default {
    name: "TermButtons",
}
</script>


<style scoped>

</style>