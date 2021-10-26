export default {
  data() {
    return {
      addressMessages: [],
    };
  },
  methods: {
    addressValidation({
      postalCode,
      postalCodeA,
      postalCodeB,
      prefecture,
      municipality,
    }) {
      this.addressMessages = [];

      // 郵便番号
      if (!postalCode) {
        this.addressMessages.push("物件の郵便番号を入力してください"); // 必須入力
      } else if (postalCode.match(/[^0-9]/g)) {
        // 半角数字のみ
        this.addressMessages.push("半角数字で入力してください");
      } else if (
        // 文字数チェック
        postalCodeA.length !== 3 ||
        postalCodeB.length !== 4
      ) {
        this.addressMessages.push("郵便番号を正しく入力してください");
      } else if (!prefecture || !municipality) {
        // 郵便番号チェック
        this.addressMessages.push("正しい郵便番号を入力してください");
      }

      if (this.addressMessages.length) {
        throw new Error("Invalid");
      }
    },
  },
};
