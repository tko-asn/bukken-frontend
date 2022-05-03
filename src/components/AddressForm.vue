<template>
  <!-- フォーム -->
  <div class="block-address">
    <!-- 郵便番号 -->
    <div class="block-address__postal-code">
      <MediumInput
        width="45px"
        placeholder="xxx"
        v-model="postalCodeA"
        :maxLength="3"
        @input="
          $emit('addressData', {
            postalCode: $event + postalCodeB,
            postalCodeA: $event,
          })
        "
      />
      <span class="block-address__span">-</span>
      <MediumInput
        width="55px"
        placeholder="xxxx"
        v-model="postalCodeB"
        :maxLength="4"
        @input="
          $emit('addressData', {
            postalCode: postalCodeA + $event,
            postalCodeB: $event,
          })
        "
      />
    </div>

    <!-- バリデーションメッセージ -->
    <ValidationMessage :messages="validations" v-show="validations.length" />

    <!-- 都道府県と市区町村が存在する場合 -->
    <template v-if="prefecture && municipality">
      <!-- 都道府県・市区町村 -->
      <MediumInput :readonly="true" v-model="prefecture" :width="inputWidth" />
      <MediumInput
        :readonly="true"
        v-model="municipality"
        :width="inputWidth"
      />
      <template v-if="optionInput">
        <MediumInput
          placeholder="町名・番地"
          v-model="townName"
          :width="inputWidth"
          @input="$emit('addressData', { townName: $event })"
        />
        <MediumInput
          placeholder="アパート・マンション名"
          v-model="buildingName"
          :width="inputWidth"
          @input="$emit('addressData', { buildingName: $event })"
        />
      </template>
    </template>
  </div>
</template>

<script>
import ValidationMessage from "@/components/ValidationMessage";
import MediumInput from "@/components/MediumInput";
import widthMixin from "@/mixins/widthMixin";
const YubinBango = require("yubinbango-core2");

export default {
  components: {
    ValidationMessage,
    MediumInput,
  },
  mixins: [widthMixin],
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
  computed: {
    inputWidth() {
      return this.width >= 600 ? "70%" : "100%";
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
.block-address__span {
  padding: 0 5px;
  color: rgb(143, 142, 142);
  font-weight: bold;
}

.block-address__postal-code {
  display: flex;
  align-items: center;
}
</style>