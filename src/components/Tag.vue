<template>
  <div class="item-tags">
    <a v-for="tag in tags" :key="tag.id" class="item-tags__tag">
      {{ tag.first }}
      <span v-if="tag.second">/</span>
      {{ tag.second }}
      <!-- ×アイコン -->
      <fa-icon
        class="item-tags__tag__times-circle"
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
  },
  methods: {
    // タグを消去
    deleteTag(tagId) {
      this.$emit("delete", tagId);
    },
  },
};
</script>

<style scoped>
.item-tags {
  margin: 10px 0 20px;
}

.item-tags__tag {
  display: inline-block;
  margin: 10px 15px 0 0;
  padding: 0.6em;
  border: 3px solid rgb(61, 61, 221);
  border-radius: 2em;
  background: #fff;
  color: rgb(61, 61, 221);
}

/* ×アイコン */
.item-tags__tag__times-circle {
  margin-left: 5px;
}

.item-tags__tag__times-circle:hover {
  opacity: 0.7;
}
</style>