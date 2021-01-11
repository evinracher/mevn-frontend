<template>
  <nav aria-label="Page navigation" v-if="total > 1">
    <ul class="pagination d-flex justify-content-center">
      <li class="page-item" :class="{ disabled: page === 1 }">
        <router-link class="page-link" :to="{ query: { page: page - 1 } }">
          Previous
        </router-link>
      </li>
      <li
        v-for="item in pagesCount"
        :key="item"
        class="page-item"
        :class="{ active: page == item }"
      >
        <router-link class="page-link" :to="{ query: { page: item } }">{{
          item
        }}</router-link>
      </li>
      <li class="page-item" :class="{ disabled: page === pagesCount }">
        <router-link class="page-link" :to="{ query: { page: page + 1 } }">
          Next
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  computed: {
    ...mapState(["total", "page", "limit"]),
    pagesCount() {
      return Math.ceil(this.total / this.limit);
    },
  },
  watch: {
    "$route.query.page": {
      immediate: true,
      handler(newValue, oldValue) {
        this.setNotes(newValue);
      },
    },
  },
  methods: {
    ...mapActions(["setNotes"]),
  },
};
</script>

<style>
</style>