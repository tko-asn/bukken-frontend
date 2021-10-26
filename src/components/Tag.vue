<template>
  <div class="item-tags">
    <a v-for="tag in tags" :key="tag.id" class="link">
      {{ tag.firstCategory }}
      <span class="link__span" v-if="tag.secondCategory">/</span>
      {{ tag.secondCategory }}
      <!-- ×アイコン -->
      <fa-icon
        class="link__times-circle"
        icon="times-circle"
        @click="deleteTag(tag.id)"
      />
    </a>
  </div>
</template>

<script>
export default {
  props: {
    tags: Array,
    deleteTag: {
      type: Function,
      default: () => () => {},
    },
  },
};
</script>

<style scoped>
.item-tags {
  margin: 10px 0 20px;
}

.link {
  display: inline-block;
  margin: 10px 15px 0 0;
  padding: 0.3em;
  border: 3px solid rgb(61, 61, 221);
  border-radius: 2em;
  background: #fff;
  color: rgb(61, 61, 221);
  font-size: 0.8em;
}

/* ×アイコン */
.link__times-circle {
  margin-left: 2px;
}

.link__times-circle:hover {
  opacity: 0.7;
}

@media screen and (max-width: 599px) {
  .link {
    padding: 0.2em;
  }

  .link__times-circle {
    margin-left: 1px;
  }
}
</style>