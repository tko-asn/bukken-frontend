export default {
  methods: {
    // 郵便番号（前半3桁）
    postalCodeA(post) {
      return post.address?.["postalCode"].slice(0, 3);
    },
    // 郵便番号（後半4桁）
    postalCodeB(post) {
      return post.address?.["postalCode"].slice(3);
    },
    // 住所のデータを連結して返す
    addressData(post) {
      return (
        post.address?.["prefecture"] +
        post.address?.["municipality"] +
        post.address?.["townName"] +
        post.address?.["buildingName"]
      );
    },
  },
};
