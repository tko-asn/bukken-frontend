<template>
  <!-- フォーム -->
  <div class="block-address">
    <!-- 郵便番号 -->
    <input
      type="text"
      class="block-address__input-postal-code-a"
      placeholder="xxx"
      @keydown.enter.prevent
      v-model="postalCodeA"
      maxlength="3"
      @input="
        $emit('addressData', {
          postalCode: $event.target.value + postalCodeB,
          postalCodeA: $event.target.value,
        })
      "
    />
    <span class="block-address__span">-</span>
    <input
      type="text"
      class="block-address__input-postal-code-b"
      placeholder="xxxx"
      @keydown.enter.prevent
      v-model="postalCodeB"
      maxlength="4"
      @input="
        $emit('addressData', {
          postalCode: postalCodeA + $event.target.value,
          postalCodeB: $event.target.value,
        })
      "
    />

    <!-- バリデーションメッセージ -->
    <ValidationMessage :messages="validations" v-show="validations.length" />

    <!-- 都道府県と市区町村が存在する場合 -->
    <template v-if="prefecture && municipality">
      <!-- 都道府県・市区町村 -->
      <ul class="item-address">
        <li class="item-address__list">
          <input
            type="text"
            class="item-address__input-prefecture"
            v-model="prefecture"
            readonly
          />
        </li>
        <li class="item-address__list">
          <input
            type="text"
            class="item-address__input-municipality"
            v-model="municipality"
            readonly
          />
        </li>
        <template v-if="optionInput">
          <li class="item-address__list">
            <input
              class="item-address__input-town-name"
              type="text"
              placeholder="町名・番地"
              @keydown.enter.prevent
              v-model="townName"
              @input="$emit('addressData', { townName: $event.target.value })"
            />
          </li>
          <li class="item-address__list">
            <input
              class="item-address__input-building-name"
              type="text"
              placeholder="アパート・マンション名"
              @keydown.enter.prevent
              v-model="buildingName"
              @input="
                $emit('addressData', { buildingName: $event.target.value })
              "
            />
          </li>
        </template>
      </ul>
    </template>
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
const YubinBango = require("yubinbango-core2");

export default {
  components: {
    ValidationMessage,
  },
  props: {
    optionInput: {
      // 町名・番地・アパート・マンション名を表示するかどうか
      type: Boolean,
      default: false,
    },
    validations: {
      type: Array,
      default: () => [],
    },
    addressProps: {
      type: Object,
      default: () => {
        return {
          postalCodeA: "",
          postalCodeB: "",
          townName: "",
          buildingName: "",
        };
      },
    },
  },
  data() {
    return {
      // 所在地
      postalCode: "",
      prefecture: "",
      municipality: "",
      townName: this.addressProps.townName,
      buildingName: this.addressProps.buildingName,
      // 郵便番号の部品
      postalCodeA: this.addressProps.postalCodeA,
      postalCodeB: this.addressProps.postalCodeB,
    };
  },
  created() {
    // propsに郵便番号が指定されwatchのpostalCodeを発火させる場合
    this.postalCode = this.postalCodeA + this.postalCodeB;
  },
  watch: {
    postalCodeA(val) {
      this.postalCode = val + this.postalCodeB; // 郵便番号を結合
    },
    postalCodeB(val) {
      this.postalCode = this.postalCodeA + val; // 郵便番号を結合
    },
    // 郵便番号
    postalCode(val) {
      const _this = this;
      // 半角数字以外の文字はNG
      if (val && !val.match(/[^0-9]/g)) {
        new YubinBango.Core(val, (addr) => {
          _this.prefecture = addr.region; // 都道府県
          _this.municipality = addr.locality + addr.street; // 市区町村
          this.$emit("addressData", {
            // 親コンポーネントに都道府県と市区町村の値を渡す
            prefecture: _this.prefecture,
            municipality: _this.municipality,
          });
        });

        // 適切でない値が入力されたら値を初期化
      } else {
        _this.prefecture = "";
        _this.municipality = "";
      }
    },
  },
};
</script>

<style scoped>
/* 入力フォームすべて */
[class*="input"] {
  height: 20px;
  padding: 5px 10px;
  border: 2px solid rgb(143, 142, 142);
  border-radius: 4px;
  font-size: 1.1em;
}

/* リストの間 */
.item-address__list {
  margin-top: 15px;
}

.block-address__span {
  padding: 0 5px;
}

.block-address__input-postal-code-a {
  width: 30px;
}

.block-address__input-postal-code-b {
  width: 50px;
}

.item-address {
  display: flex;
  flex-direction: column;
  list-style: none;
  margin: 0;
  padding: 0;
}

[class*="item-address__input"] {
  width: 70%;
}

[class*="item-address__input"]:read-only {
  background: rgb(216, 214, 214);
}

@media screen and (max-width: 599px) {
  [class*="item-address__input"] {
    width: 80%;
  }
}
</style>