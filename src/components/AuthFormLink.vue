<template>
  <div class="block-auth-form-link">
    <p class="block-auth-form-link__text">{{ linkObj.label }}</p>
    <router-link
      class="block-auth-form-link__link"
      :to="{ name: linkObj.name }"
      >{{ linkObj.value }}</router-link
    >
  </div>
</template>

<script>
export default {
  props: {
    linkObj: {
      type: Object,
      default: () => ({ label: "", name: "", value: "" }),
    },
  },
};
</script>


<style scoped>
.block-auth-form-link {
  height: 100px;
  color: gray;
  font-size: 1.2em;
  letter-spacing: 2px;
  text-align: center;
}

.block-auth-form-link__text {
  margin: 30px 0 10px;
  font-size: 0.8em;
}

.block-auth-form-link__link {
  color: rgb(52, 189, 161);
  text-decoration: none;
  font-size: 0.9em;
}
</style>